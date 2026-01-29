<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('limit')) {
            return Teacher::latest()->take($request->limit)->get();
        }
        return Teacher::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'max_hours' => 'integer|min:1',
            'color' => 'nullable|string|max:7',
        ]);

        return Teacher::create($validated);
    }

    public function show(Teacher $teacher)
    {
        return $teacher;
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'specialization' => 'nullable|string|max:255',
            'max_hours' => 'integer|min:1',
            'color' => 'nullable|string|max:7',
        ]);

        $teacher->update($validated);
        return $teacher;
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();
        return response()->noContent();
    }
}
