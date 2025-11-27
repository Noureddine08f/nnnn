<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::apiResource('teachers', TeacherController::class);
Route::apiResource('classrooms', ClassroomController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('school-classes', SchoolClassController::class);
Route::apiResource('time-slots', TimeSlotController::class);
Route::apiResource('schedules', ScheduleController::class);
Route::apiResource('assignments', AssignmentController::class);
Route::post('/schedules/generate', [App\Http\Controllers\Api\SchedulerController::class, 'generate']);
