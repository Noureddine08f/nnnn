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
        User::truncate();
        Assignment::truncate();
        Teacher::truncate();
        Classroom::truncate();
        Course::truncate();
        SchoolClass::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Teachers (Need 18 hours each. Total 3 teachers = 54 hours load)
        $t1 = Teacher::create(['name' => 'Noureddine', 'max_hours' => 20, 'color' => '#ef4444']);
        $t2 = Teacher::create(['name' => 'Abdelwahab', 'max_hours' => 20, 'color' => '#3b82f6']);
        $t3 = Teacher::create(['name' => 'Abdelkader', 'max_hours' => 20, 'color' => '#10b981']);
        $t4 = Teacher::create(['name' => 'Amel', 'max_hours' => 20, 'color' => '#10b981']);
        $t5 = Teacher::create(['name' => 'Nadir', 'max_hours' => 20, 'color' => '#10b981']);

        // Create Users for Testing
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@institut.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Noureddine (Teacher)',
            'email' => 'noureddine@institut.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'teacher_id' => $t1->id
        ]);

        User::create([
            'name' => 'Student User',
            'email' => 'student@institut.com',
            'password' => bcrypt('password'),
            'role' => 'student'
        ]);

        // 2. Classrooms (12 rooms total for scheduling flexibility)        $r1 = Classroom::create(['name' => 'Room 01', 'capacity' => 30, 'type' => 'Lecture']);
        $r2 = Classroom::create(['name' => 'Room 02', 'capacity' => 30, 'type' => 'Lecture']);
        $r3 = Classroom::create(['name' => 'Room 03', 'capacity' => 30, 'type' => 'Lecture']);
        $r4 = Classroom::create(['name' => 'Room 04', 'capacity' => 30, 'type' => 'Lecture']);
        $r5 = Classroom::create(['name' => 'Room 05', 'capacity' => 30, 'type' => 'Lecture']);
        $r6 = Classroom::create(['name' => 'Room 06', 'capacity' => 30, 'type' => 'Lecture']);
        $r7 = Classroom::create(['name' => 'Room 07', 'capacity' => 30, 'type' => 'Lecture']);
        $r8 = Classroom::create(['name' => 'Lab 1', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer
        $r9 = Classroom::create(['name' => 'Lab 2', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer
        $r10 = Classroom::create(['name' => 'Lab 3', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer
        $r11 = Classroom::create(['name' => 'Lab 4', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer
        $r12 = Classroom::create(['name' => 'Lab 5', 'capacity' => 20, 'type' => 'Lab']); // Extra buffer

        // 3. School Classes (Groups of students). 
        // Each group also has 40h max capacity per week.
        // We need to distribute 54 hours of lessons. So we need at least 2 classes (groups).
        $sc1 = SchoolClass::create(['name' => 'WEBDEV S1']);
        $sc2 = SchoolClass::create(['name' => 'WEBDEV S2']);
        $sc3 = SchoolClass::create(['name' => 'WEBDEV S3']); // Extra buffer
        $sc4 = SchoolClass::create(['name' => 'WEBDEV S4']); // Extra buffer

        // 4. Courses
        $c1 = Course::create(['name' => 'HTML/CSS', 'code' => 'HTML']);
        $c2 = Course::create(['name' => 'JavaScript', 'code' => 'JS']);
        $c3 = Course::create(['name' => 'PHP', 'code' => 'PHP']);
        $c4 = Course::create(['name' => 'Java', 'code' => 'JAVA']);
        $c5  = Course::create(['name' => 'Laravel', 'code' => 'LARAVEL']);
        $c6  = Course::create(['name' => 'English', 'code' => 'ENG']);

        // 5. Assignments
        // Distribute courses across teachers and school classes.
        // Each teacher gets ~10 hours_per_week total (slots the scheduler will assign).

        // Noureddine: HTML/CSS for S1 (5h) + JavaScript for S2 (5h) = 10h
        Assignment::create(['teacher_id' => $t1->id, 'course_id' => $c1->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 5]);
        Assignment::create(['teacher_id' => $t1->id, 'course_id' => $c2->id, 'school_class_id' => $sc2->id, 'hours_per_week' => 5]);

        // Abdelwahab: PHP for S1 (5h) + Laravel for S3 (5h) = 10h
        Assignment::create(['teacher_id' => $t2->id, 'course_id' => $c3->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 5]);
        Assignment::create(['teacher_id' => $t2->id, 'course_id' => $c5->id, 'school_class_id' => $sc3->id, 'hours_per_week' => 5]);

        // Abdelkader: Java for S2 (5h) + JavaScript for S4 (5h) = 10h
        Assignment::create(['teacher_id' => $t3->id, 'course_id' => $c4->id, 'school_class_id' => $sc2->id, 'hours_per_week' => 5]);
        Assignment::create(['teacher_id' => $t3->id, 'course_id' => $c2->id, 'school_class_id' => $sc4->id, 'hours_per_week' => 5]);

        // Amel: English for S1 (4h) + English for S3 (4h) = 8h
        Assignment::create(['teacher_id' => $t4->id, 'course_id' => $c6->id, 'school_class_id' => $sc1->id, 'hours_per_week' => 4]);
        Assignment::create(['teacher_id' => $t4->id, 'course_id' => $c6->id, 'school_class_id' => $sc3->id, 'hours_per_week' => 4]);

        // Nadir: HTML/CSS for S3 (5h) + PHP for S4 (5h) = 10h
        Assignment::create(['teacher_id' => $t5->id, 'course_id' => $c1->id, 'school_class_id' => $sc3->id, 'hours_per_week' => 5]);
        Assignment::create(['teacher_id' => $t5->id, 'course_id' => $c3->id, 'school_class_id' => $sc4->id, 'hours_per_week' => 5]);
    }
}
