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
        // 1. Teachers (matching FullCapacitySeeder)
        $t1 = Teacher::firstOrCreate(['name' => 'Noureddine'], ['max_hours' => 20, 'color' => '#ef4444']);
        $t2 = Teacher::firstOrCreate(['name' => 'Abdelwahab'], ['max_hours' => 20, 'color' => '#3b82f6']);
        $t3 = Teacher::firstOrCreate(['name' => 'Abdelkader'], ['max_hours' => 20, 'color' => '#10b981']);
        $t4 = Teacher::firstOrCreate(['name' => 'Amel'], ['max_hours' => 20, 'color' => '#10b981']);
        $t5 = Teacher::firstOrCreate(['name' => 'Nadir'], ['max_hours' => 20, 'color' => '#10b981']);

        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@institut.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]
        );

        // Teacher User
        User::firstOrCreate(
            ['email' => 'noureddine@institut.com'],
            [
                'name' => 'Noureddine (Teacher)',
                'password' => bcrypt('password'),
                'role' => 'teacher',
                'teacher_id' => $t1->id
            ]
        );

        // Student User
        User::firstOrCreate(
            ['email' => 'student@institut.com'],
            [
                'name' => 'Student User',
                'password' => bcrypt('password'),
                'role' => 'student'
            ]
        );

        // 2. Classrooms (12 rooms)
        Classroom::firstOrCreate(['name' => 'Room 01'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 02'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 03'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 04'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 05'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 06'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Room 07'], ['capacity' => 30, 'type' => 'Lecture']);
        Classroom::firstOrCreate(['name' => 'Lab 1'], ['capacity' => 20, 'type' => 'Lab']);
        Classroom::firstOrCreate(['name' => 'Lab 2'], ['capacity' => 20, 'type' => 'Lab']);
        Classroom::firstOrCreate(['name' => 'Lab 3'], ['capacity' => 20, 'type' => 'Lab']);
        Classroom::firstOrCreate(['name' => 'Lab 4'], ['capacity' => 20, 'type' => 'Lab']);
        Classroom::firstOrCreate(['name' => 'Lab 5'], ['capacity' => 20, 'type' => 'Lab']);

        // 3. Courses
        $c1 = Course::firstOrCreate(['code' => 'HTML'], ['name' => 'HTML/CSS']);
        $c2 = Course::firstOrCreate(['code' => 'JS'], ['name' => 'JavaScript']);
        $c3 = Course::firstOrCreate(['code' => 'PHP'], ['name' => 'PHP']);
        $c4 = Course::firstOrCreate(['code' => 'JAVA'], ['name' => 'Java']);
        $c5 = Course::firstOrCreate(['code' => 'LARAVEL'], ['name' => 'Laravel']);
        $c6 = Course::firstOrCreate(['code' => 'ENG'], ['name' => 'English']);

        // 4. School Classes
        $sc1 = SchoolClass::firstOrCreate(['name' => 'WEBDEV S1']);
        $sc2 = SchoolClass::firstOrCreate(['name' => 'WEBDEV S2']);
        $sc3 = SchoolClass::firstOrCreate(['name' => 'WEBDEV S3']);
        $sc4 = SchoolClass::firstOrCreate(['name' => 'WEBDEV S4']);

        // 5. TimeSlots (Sunday to Thursday, 4 slots a day)
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        $times = [
            ['start' => '08:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '12:00'],
            ['start' => '13:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '17:00'],
        ];

        foreach ($days as $day) {
            foreach ($times as $time) {
                TimeSlot::firstOrCreate([
                    'day' => $day,
                    'start_time' => $time['start'],
                    'end_time' => $time['end'],
                ]);
            }
        }

        // 6. Assignments (matching FullCapacitySeeder)
        // Noureddine: HTML/CSS for S1 (5h) + JavaScript for S2 (5h) = 10h
        Assignment::firstOrCreate(['teacher_id' => $t1->id, 'course_id' => $c1->id, 'school_class_id' => $sc1->id], ['hours_per_week' => 5]);
        Assignment::firstOrCreate(['teacher_id' => $t1->id, 'course_id' => $c2->id, 'school_class_id' => $sc2->id], ['hours_per_week' => 5]);

        // Abdelwahab: PHP for S1 (5h) + Laravel for S3 (5h) = 10h
        Assignment::firstOrCreate(['teacher_id' => $t2->id, 'course_id' => $c3->id, 'school_class_id' => $sc1->id], ['hours_per_week' => 5]);
        Assignment::firstOrCreate(['teacher_id' => $t2->id, 'course_id' => $c5->id, 'school_class_id' => $sc3->id], ['hours_per_week' => 5]);

        // Abdelkader: Java for S2 (5h) + JavaScript for S4 (5h) = 10h
        Assignment::firstOrCreate(['teacher_id' => $t3->id, 'course_id' => $c4->id, 'school_class_id' => $sc2->id], ['hours_per_week' => 5]);
        Assignment::firstOrCreate(['teacher_id' => $t3->id, 'course_id' => $c2->id, 'school_class_id' => $sc4->id], ['hours_per_week' => 5]);

        // Amel: English for S1 (4h) + English for S3 (4h) = 8h
        Assignment::firstOrCreate(['teacher_id' => $t4->id, 'course_id' => $c6->id, 'school_class_id' => $sc1->id], ['hours_per_week' => 4]);
        Assignment::firstOrCreate(['teacher_id' => $t4->id, 'course_id' => $c6->id, 'school_class_id' => $sc3->id], ['hours_per_week' => 4]);

        // Nadir: HTML/CSS for S3 (5h) + PHP for S4 (5h) = 10h
        Assignment::firstOrCreate(['teacher_id' => $t5->id, 'course_id' => $c1->id, 'school_class_id' => $sc3->id], ['hours_per_week' => 5]);
        Assignment::firstOrCreate(['teacher_id' => $t5->id, 'course_id' => $c3->id, 'school_class_id' => $sc4->id], ['hours_per_week' => 5]);
    }
}
