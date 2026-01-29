<?php

namespace App\Services;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\TimeSlot;
use Illuminate\Support\Facades\DB;
use Exception;

class SchedulerService
{
    /**
     * Generate the schedule ensuring all constraints are met.
     * 
     * Constraints:
     * 1. Teacher cannot be in two places at once.
     * 2. Class (student group) cannot be in two places at once.
     * 3. Classroom cannot be used by two classes at once.
     * 4. Each assignment must be scheduled for 'hours_per_week' slots.
     * 
     * Strategy: Randomized Greedy with Backtracking (approximated by restart/shuffle or just simple checking).
     * We will use a randomized greedy approach:
     * - Shuffle assignments to vary the starting point.
     * - For each hour of an assignment, try random time slots until one fits.
     */
    public function generate()
    {
        // 1. Clear existing schedule
        Schedule::truncate();

        // 2. Load Data
        $assignments = Assignment::all(); 
        // We want to process difficult assignments first? Or random? 
        // Random is usually better to avoid systemic bias if we don't have a heuristic.
        // Let's shuffle them.
        $assignments = $assignments->shuffle();

        $timeSlots = TimeSlot::all();
        $classrooms = Classroom::all();

        if ($timeSlots->isEmpty() || $classrooms->isEmpty()) {
            throw new Exception("No time slots or classrooms available.");
        }

        // 3. In-Memory Availability Trackers to avoid DB hits in loops
        // Keys: [EntityID][TimeSlotID] = true (occupied)
        $teacherOccupied = [];
        $classOccupied = [];
        $roomOccupied = [];

        // Pre-allocate to avoid undefined index warnings? Not strictly necessary in PHP if we use isset.
        
        $schedulesToInsert = [];

        foreach ($assignments as $assignment) {
            $requiredHours = $assignment->hours_per_week;
            $scheduledCount = 0;
            
            // Try to schedule each required hour
            for ($i = 0; $i < $requiredHours; $i++) {
                
                // We need to find ONE slot for this hour.
                // To distribute evenly, we should look at ALL slots in a random order.
                $shuffledSlots = $timeSlots->shuffle();
                $slotFound = false;

                foreach ($shuffledSlots as $slot) {
                    $slotId = $slot->id;

                    // CHECK CONFLICTS
                    
                    // 1. Teacher Conflict
                    if (isset($teacherOccupied[$assignment->teacher_id][$slotId])) {
                        continue;
                    }

                    // 2. Class Conflict
                    if (isset($classOccupied[$assignment->school_class_id][$slotId])) {
                        continue;
                    }

                    // 3. Find a Room
                    // We need ANY room that is free at this slot.
                    // We can stick to the same room for a course if we want, but requirements didn't specify.
                    // Let's just find the first available room.
                    $assignedRoomId = null;
                    
                    // Shuffle rooms to distribute usage? Or sequential? Shuffle is safer for distribution.
                    $shuffledRooms = $classrooms->shuffle();
                    
                    foreach ($shuffledRooms as $room) {
                        if (!isset($roomOccupied[$room->id][$slotId])) {
                            $assignedRoomId = $room->id;
                            break;
                        }
                    }

                    if ($assignedRoomId) {
                        // FOUND A VALID SLOT AND ROOM
                        
                        // Register occupation
                        $teacherOccupied[$assignment->teacher_id][$slotId] = true;
                        $classOccupied[$assignment->school_class_id][$slotId] = true;
                        $roomOccupied[$assignedRoomId][$slotId] = true;

                        // Add to insert list
                        $schedulesToInsert[] = [
                            'teacher_id' => $assignment->teacher_id,
                            'course_id' => $assignment->course_id,
                            'school_class_id' => $assignment->school_class_id,
                            'classroom_id' => $assignedRoomId,
                            'time_slot_id' => $slotId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        $slotFound = true;
                        $scheduledCount++;
                        break; // Break slot loop, move to next hour
                    }
                }

                if (!$slotFound) {
                    // We failed to schedule one of the hours for this assignment.
                    // This means the constraints are too tight or the greedy choice earlier blocked us.
                    // For now, we return an error. 
                    throw new Exception("Unable to generate schedule. Conflict for Teacher ID: {$assignment->teacher_id}, Class ID: {$assignment->school_class_id}. Not enough slots/rooms available.");
                }
            }
        }

        // 4. Bulk Insert
        // Use chunks to avoid query size limits if many items
        foreach (array_chunk($schedulesToInsert, 100) as $chunk) {
            Schedule::insert($chunk);
        }

        return true;
    }
}
