<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\SchoolClass;
use App\Models\Classroom;
use App\Models\Assignment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'teachers' => Teacher::count(),
            'courses' => Course::count(),
            'classes' => SchoolClass::count(),
            'rooms' => Classroom::count(),
            'assignments' => Assignment::count(),
        ]);
    }
}
