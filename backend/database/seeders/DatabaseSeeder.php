<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Classroom;
use App\Models\Course;
use App\Models\SchoolClass;
use App\Models\TimeSlot;
use App\Models\Assignment;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        // Teachers
        $t1 = Teacher::create(['name' => 'John Doe', 'specialization' => 'Math', 'max_hours' => 18, 'color' => '#ef4444']);
        $t2 = Teacher::create(['name' => 'Jane Smith', 'specialization' => 'Science', 'max_hours' => 18, 'color' => '#3b82f6']);
        $t3 = Teacher::create(['name' => 'Ali Ahmed', 'specialization' => 'History', 'max_hours' => 18, 'color' => '#10b981']);

        // Classrooms
        $r1 = Classroom::create(['name' => 'Room 101', 'capacity' => 30, 'type' => 'Lecture']);
        $r2 = Classroom::create(['name' => 'Lab A', 'capacity' => 20, 'type' => 'Lab']);

        // Courses
        $c1 = Course::create(['name' => 'Mathematics', 'code' => 'MATH101']);
        $c2 = Course::create(['name' => 'Physics', 'code' => 'PHYS101']);
        $c3 = Course::create(['name' => 'History', 'code' => 'HIST101']);

        // Classes
        $sc1 = SchoolClass::create(['name' => 'Grade 10-A', 'grade_level' => '10']);
        $sc2 = SchoolClass::create(['name' => 'Grade 11-B', 'grade_level' => '11']);

        // TimeSlots
        $ts1 = TimeSlot::create(['day' => 'Monday', 'start_time' => '08:00', 'end_time' => '10:00']);
        $ts2 = TimeSlot::create(['day' => 'Monday', 'start_time' => '10:00', 'end_time' => '12:00']);
        $ts3 = TimeSlot::create(['day' => 'Tuesday', 'start_time' => '08:00', 'end_time' => '10:00']);
        $ts4 = TimeSlot::create(['day' => 'Tuesday', 'start_time' => '10:00', 'end_time' => '12:00']);

        // Assignments
        Assignment::create(['teacher_id' => $t1->id, 'course_id' => $c1->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 2]);
        Assignment::create(['teacher_id' => $t2->id, 'course_id' => $c2->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 2]);
        Assignment::create(['teacher_id' => $t3->id, 'course_id' => $c3->id, 'school_class_id' => $sc2->id, 'hours_per_week' => 2]);
    }
}
