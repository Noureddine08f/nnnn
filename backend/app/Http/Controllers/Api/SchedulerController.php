<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SchedulerService;
use Illuminate\Http\Request;

class SchedulerController extends Controller
{
    protected $scheduler;

    public function __construct(SchedulerService $scheduler)
    {
        $this->scheduler = $scheduler;
    }

    public function generate()
    {
        $this->scheduler->generate();
        return response()->json(['message' => 'Schedule generated successfully']);
    }
}
