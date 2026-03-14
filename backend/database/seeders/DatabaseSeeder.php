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

        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@school.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]
        );

        // Teachers
        $t1 = Teacher::firstOrCreate(['name' => 'John Doe'], ['max_hours' => 18, 'color' => '#ef4444']);
        $t2 = Teacher::firstOrCreate(['name' => 'Jane Smith'], ['max_hours' => 18, 'color' => '#3b82f6']);
        $t3 = Teacher::firstOrCreate(['name' => 'Ali Ahmed'], ['max_hours' => 18, 'color' => '#10b981']);

        // Teacher User
        User::firstOrCreate(
            ['email' => 'teacher@school.com'],
            [
                'name' => 'John Doe (Teacher)',
                'password' => bcrypt('password'),
                'role' => 'teacher',
                'teacher_id' => $t1->id
            ]
        );

        // Student User
        User::firstOrCreate(
            ['email' => 'student@school.com'],
            [
                'name' => 'Student User',
                'password' => bcrypt('password'),
                'role' => 'student'
            ]
        );

        // Classrooms
        $r1 = Classroom::create(['name' => 'Lab 1', 'capacity' => 20, 'type' => 'Lab']);
        $r2 = Classroom::create(['name' => 'Lab 2', 'capacity' => 20, 'type' => 'Lab']);

        // Courses
        $c1 = Course::create(['name' => 'Mathematics', 'code' => 'MATH101']);
        $c2 = Course::create(['name' => 'Physics', 'code' => 'PHYS101']);
        $c3 = Course::create(['name' => 'History', 'code' => 'HIST101']);

        // Classes
        $sc1 = SchoolClass::create(['name' => 'DWM 1']);
        $sc2 = SchoolClass::create(['name' => 'DWM 2']);

        // TimeSlots (Sunday to Thursday, 4 slots a day)
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        $times = [
            ['start' => '08:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '12:00'],
            ['start' => '13:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '17:00'],
        ];

        foreach ($days as $day) {
            foreach ($times as $time) {
                TimeSlot::create([
                    'day' => $day,
                    'start_time' => $time['start'],
                    'end_time' => $time['end'],
                ]);
            }
        }

        // Assignments
        Assignment::create(['teacher_id' => $t1->id, 'course_id' => $c1->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 2]);
        Assignment::create(['teacher_id' => $t2->id, 'course_id' => $c2->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 2]);
        Assignment::create(['teacher_id' => $t3->id, 'course_id' => $c3->id, 'school_class_id' => $sc2->id, 'hours_per_week' => 2]);
    }
}
