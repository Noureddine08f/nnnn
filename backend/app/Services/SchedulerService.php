<?php

namespace App\Services;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\TimeSlot;

class SchedulerService
{
    public function generate()
    {
        // Clear existing schedules
        Schedule::truncate();

        $assignments = Assignment::all();
        $timeSlots = TimeSlot::all();
        $classrooms = Classroom::all();

        // Sort assignments by hours needed (descending) to prioritize heavy courses?
        // Or maybe just random order for now.

        foreach ($assignments as $assignment) {
            $hoursNeeded = $assignment->hours_per_week;
            $hoursScheduled = 0;

            foreach ($timeSlots as $slot) {
                if ($hoursScheduled >= $hoursNeeded) {
                    break;
                }

                if ($this->isSlotAvailable($assignment, $slot)) {
                    // Find an available room
                    $room = $this->findAvailableRoom($slot, $classrooms);
                    
                    if ($room) {
                        Schedule::create([
                            'teacher_id' => $assignment->teacher_id,
                            'classroom_id' => $room->id,
                            'course_id' => $assignment->course_id,
                            'school_class_id' => $assignment->school_class_id,
                            'time_slot_id' => $slot->id,
                        ]);
                        $hoursScheduled++;
                    }
                }
            }
        }
        
        return true;
    }

    private function isSlotAvailable($assignment, $slot)
    {
        // Check teacher availability
        if (Schedule::where('teacher_id', $assignment->teacher_id)->where('time_slot_id', $slot->id)->exists()) {
            return false;
        }

        // Check class availability
        if (Schedule::where('school_class_id', $assignment->school_class_id)->where('time_slot_id', $slot->id)->exists()) {
            return false;
        }

        return true;
    }

    private function findAvailableRoom($slot, $classrooms)
    {
        foreach ($classrooms as $room) {
            if (!Schedule::where('classroom_id', $room->id)->where('time_slot_id', $slot->id)->exists()) {
                return $room;
            }
        }
        return null;
    }
}
