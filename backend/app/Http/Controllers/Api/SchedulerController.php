<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SchedulerService;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Exception;

class SchedulerController extends Controller
{
    protected $scheduler;

    public function __construct(SchedulerService $scheduler)
    {
        $this->scheduler = $scheduler;
    }

    public function generate()
    {
        try {
            $this->scheduler->generate();
            return response()->json(['message' => 'Schedule generated successfully']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to generate schedule',
                'error' => $e->getMessage()
            ], 422);
        }
    }


    public function clear()
    {
        try {

            // Use delete() instead of truncate() to be safer with foreign keys and permissions
            Schedule::query()->delete();
            return response()->json(['message' => 'Schedule cleared successfully']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to clear schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
