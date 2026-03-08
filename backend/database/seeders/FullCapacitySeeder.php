<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Classroom;
use App\Models\Course;
use App\Models\SchoolClass;
use App\Models\Assignment;
use Illuminate\Support\Facades\Schema;

class FullCapacitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Assignment::truncate();
        Teacher::truncate();
        Classroom::truncate();
        Course::truncate();
        SchoolClass::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Teachers (Need 18 hours each. Total 3 teachers = 54 hours load)
        $t1 = Teacher::create(['name' => 'John Doe', 'specialization' => 'Math', 'max_hours' => 20, 'color' => '#ef4444']);
        $t2 = Teacher::create(['name' => 'Jane Smith', 'specialization' => 'Science', 'max_hours' => 20, 'color' => '#3b82f6']);
        $t3 = Teacher::create(['name' => 'Ali Ahmed', 'specialization' => 'History', 'max_hours' => 20, 'color' => '#10b981']);

        // 2. Classrooms (Need capacity for 54 hours. Week capacity is 5 days * 4 slots * 2h = 40h per room)
        // So we need at least 2 rooms (80h capacity).
        $r1 = Classroom::create(['name' => 'Room 101', 'capacity' => 30, 'type' => 'Lecture']);
        $r2 = Classroom::create(['name' => 'Room 102', 'capacity' => 30, 'type' => 'Lecture']);
        $r3 = Classroom::create(['name' => 'Lab A', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer

        // 3. School Classes (Groups of students). 
        // Each group also has 40h max capacity per week.
        // We need to distribute 54 hours of lessons. So we need at least 2 classes (groups).
        $sc1 = SchoolClass::create(['name' => 'Class S1-A']);
        $sc2 = SchoolClass::create(['name' => 'Class S2-B']);
        $sc3 = SchoolClass::create(['name' => 'Class S3-C']); // Extra buffer

        // 4. Courses
        $math = Course::create(['name' => 'Mathematics', 'code' => 'MATH']);
        $phys = Course::create(['name' => 'Physics', 'code' => 'PHYS']);
        $hist = Course::create(['name' => 'History', 'code' => 'HIST']);
        $chem = Course::create(['name' => 'Chemistry', 'code' => 'CHEM']);
        $bio  = Course::create(['name' => 'Biology', 'code' => 'BIO']);
        $eng  = Course::create(['name' => 'English', 'code' => 'ENG']);

        // 5. Assignments
        // Goal: Each teacher gets 18h.
        // Asssuming slots are 2h long? Or is hours_per_week absolute hours? 
        // The SchedulerService logic loops `for ($i = 0; $i < $requiredHours; $i++)`.
        // And for each iteration it assigns ONE TimeSlot.
        // If TimeSlots are 2 hours long (8-10), then 1 "unit" of scheduling = 2 hours?
        // Let's check SchedulerService:
        // `for ($i = 0; $i < $requiredHours; $i++)` -> finds one slot.
        // Effectively, `hours_per_week` in Assignment actually means "SLOTS per week" if the scheduler logic treats 1 increment as 1 slot.
        // Wait, if `hours_per_week` is 18, does it mean 18 slots?
        // If 1 slot = 2 hours, then 18 hours = 9 slots.
        // BUT the SchedulerService treats `$requiredHours` as the loop count.
        // So if I put 18, it will try to find 18 SLOTS.
        // 18 slots * 2 hours/slot = 36 hours real time.
        // User asked for "18h".
        // If the user means 18 real-world hours, and slots are 2h, I should set `hours_per_week` (or rather `slots_per_week`) to 9.
        // However, looking at the previous seeder `DatabaseSeeder`, it used `hours_per_week` => 2.
        // And assigned it. 2 "hours" usually means 2 slots? Or 2 hours?
        // If the logic is `for ($i = 0; $i < $requiredHours; $i++)`, then `$requiredHours` is the NUMBER OF SLOTS.
        // Let's assume the variable name `hours_per_week` is a misnomer for `slots_per_week` OR the slots are 1 hour long.
        // But the seeded slots are 8-10 (2 hours).
        // If I schedule 1 slot, that is 2 hours of time.
        // If the user wants 18 hours load, that is 18/2 = 9 slots.
        // So I should assign 9 slots per teacher.
        
        // Teacher 1 (John): 5 slots (10h)
        Assignment::create(['teacher_id' => $t1->id, 'course_id' => $math->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 10]);

        // Teacher 2 (Jane): 5 slots (10h)
        Assignment::create(['teacher_id' => $t2->id, 'course_id' => $phys->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 10]);

        // Teacher 3 (Ali): 5 slots (10h)
        Assignment::create(['teacher_id' => $t3->id, 'course_id' => $hist->id, 'school_class_id' => $sc2->id, 'hours_per_week' => 10]);
    }
}
