<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    public function index()
    {
        return TimeSlot::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        return TimeSlot::create($validated);
    }

    public function show(TimeSlot $timeSlot)
    {
        return $timeSlot;
    }

    public function update(Request $request, TimeSlot $timeSlot)
    {
        $validated = $request->validate([
            'day' => 'string|max:255',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i|after:start_time',
        ]);

        $timeSlot->update($validated);
        return $timeSlot;
    }

    public function destroy(TimeSlot $timeSlot)
    {
        $timeSlot->delete();
        return response()->noContent();
    }
}
