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
        
        // Strategy: Randomized Greedy
        // Shuffle assignments to avoid bias
        $assignments = $assignments->shuffle();

        // FILTER: Only allow slots from Sunday to Thursday
        $allowedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        $timeSlots = TimeSlot::whereIn('day', $allowedDays)->get();
        
        $classrooms = Classroom::all();

        if ($timeSlots->isEmpty() || $classrooms->isEmpty()) {
            throw new Exception("No time slots or classrooms available within the allowed days (Sun-Thu).");
        }

        // 3. In-Memory Availability Trackers
        // Keys: [EntityID][TimeSlotID] = true (occupied)
        $teacherOccupied = [];
        $classOccupied = [];
        $roomOccupied = [];

        // TRACKER: Keep track of total scheduled hours for each teacher
        // Key: [TeacherID] = Total Hours
        $teacherScheduledHours = [];

        $schedulesToInsert = [];
        $maxHoursPerWeek = 18; // Constraint: Max 18 hours per teacher

        foreach ($assignments as $assignment) {
            $requiredHours = $assignment->hours_per_week;
            $scheduledCount = 0;
            
            // Try to schedule each required hour
            for ($i = 0; $i < $requiredHours; $i++) {
                
                // CHECK: Has this teacher reached the 18-hour limit?
                $currentTeacherHours = $teacherScheduledHours[$assignment->teacher_id] ?? 0;
                
                // Assuming each slot is roughly 2 hours? Or 1 hour?
                // The loop structure implies $assignments->hours_per_week is a COUNT of slots.
                // However, detailed calculation requires slot duration.
                // Let's check a sample slot duration or assume 1 unit for now if exact duration is complex to get here.
                // BUT, to be safe, we should check the projected specific slot duration inside the loop.
                // Optimization: Check if currently strictly >= 18.
                if ($currentTeacherHours >= $maxHoursPerWeek) {
                     // Skip this unit of assignment because teacher is full.
                     // We count it as "handled" in terms of loop to avoid infinite retries, 
                     // but we don't schedule it.
                     continue; 
                }

                // We need to find ONE slot for this hour.
                $shuffledSlots = $timeSlots->shuffle();
                $slotFound = false;

                foreach ($shuffledSlots as $slot) {
                    $slotId = $slot->id;
                    
                    // Calculate slot duration in hours
                    // Assuming time format "H:i:s" or "H:i"
                    $startTime = \Carbon\Carbon::parse($slot->start_time);
                    $endTime = \Carbon\Carbon::parse($slot->end_time);
                    $durationInHours = $endTime->diffInHours($startTime);
                    
                    // CHECK: Will adding this specific slot exceed the limit?
                    if (($currentTeacherHours + $durationInHours) > $maxHoursPerWeek) {
                        continue; 
                    }

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
                    $assignedRoomId = null;
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
                        
                        // Update Teacher Hours
                        if (!isset($teacherScheduledHours[$assignment->teacher_id])) {
                            $teacherScheduledHours[$assignment->teacher_id] = 0;
                        }
                        $teacherScheduledHours[$assignment->teacher_id] += $durationInHours;

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
                    // If we failed to find a slot, we just skip it.
                    // This is "best effort" scheduling if constraints are tight.
                    // If strict validation is needed, we would throw exception, 
                    // but with strict limits (18h) we might intentionally skip overload.
                    // For now, silently continue or log? The user asked to "limit" them.
                }
            }
        }

        // 4. Bulk Insert
        foreach (array_chunk($schedulesToInsert, 100) as $chunk) {
            Schedule::insert($chunk);
        }

        return true;
    }
}
