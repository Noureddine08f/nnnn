<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return Schedule::with(['teacher', 'classroom', 'course', 'schoolClass', 'timeSlot'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'course_id' => 'required|exists:courses,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'time_slot_id' => 'required|exists:time_slots,id',
        ]);

        return Schedule::create($validated);
    }

    public function show(Schedule $schedule)
    {
        return $schedule->load(['teacher', 'classroom', 'course', 'schoolClass', 'timeSlot']);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'teacher_id' => 'exists:teachers,id',
            'classroom_id' => 'exists:classrooms,id',
            'course_id' => 'exists:courses,id',
            'school_class_id' => 'exists:school_classes,id',
            'time_slot_id' => 'exists:time_slots,id',
        ]);

        $schedule->update($validated);
        return $schedule;
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->noContent();
    }
}
