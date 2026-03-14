<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

// User info route removed auth
Route::get('/user', function (Request $request) {
    return $request->user();
});

// Resources without auth
Route::apiResource('teachers', TeacherController::class);
Route::apiResource('classrooms', ClassroomController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('school-classes', SchoolClassController::class);
Route::apiResource('time-slots', TimeSlotController::class);
// Scheduler routes — must come BEFORE the resource routes
Route::post('/schedules/generate', [App\Http\Controllers\Api\SchedulerController::class, 'generate']);
Route::delete('/schedules/clear', [App\Http\Controllers\Api\SchedulerController::class, 'clear']);
Route::get('/schedules/export/excel', [App\Http\Controllers\Api\ScheduleController::class, 'exportExcel']);
Route::get('/schedules/export/pdf', [App\Http\Controllers\Api\ScheduleController::class, 'exportPdf']);

Route::apiResource('schedules', ScheduleController::class);
Route::apiResource('assignments', AssignmentController::class);

// Dashboard stats without auth
Route::get('/dashboard/stats', [App\Http\Controllers\Api\DashboardController::class, 'stats']);

// Settings without auth
Route::get('/settings', [App\Http\Controllers\Api\SettingController::class, 'index']);
Route::post('/settings', [App\Http\Controllers\Api\SettingController::class, 'update']);