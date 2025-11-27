<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        return SchoolClass::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:255',
        ]);

        return SchoolClass::create($validated);
    }

    public function show(SchoolClass $schoolClass)
    {
        return $schoolClass;
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'grade_level' => 'string|max:255',
        ]);

        $schoolClass->update($validated);
        return $schoolClass;
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();
        return response()->noContent();
    }
}
