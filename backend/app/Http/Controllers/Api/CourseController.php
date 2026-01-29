<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('limit')) {
            return Course::latest()->take($request->limit)->get();
        }
        return Course::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:courses',
        ]);

        return Course::create($validated);
    }

    public function show(Course $course)
    {
        return $course;
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|max:255|unique:courses,code,' . $course->id,
        ]);

        $course->update($validated);
        return $course;
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->noContent();
    }
}
