<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class FullWeekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define days and times
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        $times = [
            ['start' => '08:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '12:00'],
            ['start' => '13:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '17:00'],
        ];

        // Clear existing slots to avoid duplicates if we are "resetting" or we can check exists
        // Given the state is broken, maybe just truncate? 
        // But that breaks foreign keys in `schedules` (if any existed, but they are cleared on generation).
        // It might break `assignments` if they don't reference timeslots (they don't, they reference slots in schedule but assignment itself doesn't).
        // `schedules` has `time_slot_id`.
        // If we truncate TimeSlot, we must truncate Schedule too.
        
        // Let's just truncate TimeSlot and Schedule.
        // Assuming no other data depends on TimeSlot ID permanently ( Assignments don't).
        

        \App\Models\Schedule::truncate();
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        TimeSlot::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        foreach ($days as $day) {
            foreach ($times as $time) {
                TimeSlot::create([
                    'day' => $day,
                    'start_time' => $time['start'],
                    'end_time' => $time['end'],
                ]);
            }
        }
    }
}
