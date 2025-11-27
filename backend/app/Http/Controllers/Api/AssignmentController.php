<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        return Assignment::with(['teacher', 'course', 'schoolClass'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'course_id' => 'required|exists:courses,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'hours_per_week' => 'required|integer|min:1',
        ]);

        return Assignment::create($validated);
    }

    public function show(Assignment $assignment)
    {
        return $assignment->load(['teacher', 'course', 'schoolClass']);
    }

    public function update(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'teacher_id' => 'exists:teachers,id',
            'course_id' => 'exists:courses,id',
            'school_class_id' => 'exists:school_classes,id',
            'hours_per_week' => 'integer|min:1',
        ]);

        $assignment->update($validated);
        return $assignment;
    }

    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return response()->noContent();
    }
}
