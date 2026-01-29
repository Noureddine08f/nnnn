<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class WorkWeekSeeder extends Seeder
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
