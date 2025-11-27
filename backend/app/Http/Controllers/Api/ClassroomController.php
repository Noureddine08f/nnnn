<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index()
    {
        return Classroom::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'type' => 'nullable|string|max:255',
        ]);

        return Classroom::create($validated);
    }

    public function show(Classroom $classroom)
    {
        return $classroom;
    }

    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'capacity' => 'integer|min:1',
            'type' => 'nullable|string|max:255',
        ]);

        $classroom->update($validated);
        return $classroom;
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return response()->noContent();
    }
}
