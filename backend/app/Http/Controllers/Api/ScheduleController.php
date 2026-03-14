<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\SimpleExcel\SimpleExcelWriter;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Schedule::with(['teacher', 'classroom', 'course', 'schoolClass', 'timeSlot']);

        if ($user && $user->role === 'teacher') {
            $query->where('teacher_id', $user->teacher_id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'course_id' => 'required|exists:courses,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'time_slot_id' => 'required|exists:time_slots,id',
        ]);

        return Schedule::create($validated);
    }

    public function show(Schedule $schedule)
    {
        return $schedule->load(['teacher', 'classroom', 'course', 'schoolClass', 'timeSlot']);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'teacher_id' => 'exists:teachers,id',
            'classroom_id' => 'exists:classrooms,id',
            'course_id' => 'exists:courses,id',
            'school_class_id' => 'exists:school_classes,id',
            'time_slot_id' => 'exists:time_slots,id',
        ]);

        $schedule->update($validated);
        return $schedule;
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->noContent();
    }
    private function getScheduleData(Request $request)
    {
        $user = $request->user();
        $query = Schedule::with(['teacher', 'classroom', 'course', 'schoolClass', 'timeSlot']);

        if ($user && $user->role === 'teacher') {
            $query->where('teacher_id', $user->teacher_id);
        }

        if ($request->has('class_name') && $request->class_name) {
            $query->whereHas('schoolClass', function ($q) use ($request) {
                $q->where('name', $request->class_name);
            });
        }
        
        if ($user && $user->role === 'admin' && $request->has('teacher_name') && $request->teacher_name) {
            $query->whereHas('teacher', function ($q) use ($request) {
                $q->where('name', $request->teacher_name);
            });
        }

        $schedules = $query->get();

        $teacherMap = [];
        $workDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

        foreach ($schedules as $s) {
            $teacherName = $s->teacher->name ?? 'Unknown Teacher';
            if (!isset($teacherMap[$teacherName])) {
                $teacherMap[$teacherName] = [
                    'teacher' => $teacherName,
                    'schedules' => []
                ];
            }
            $teacherMap[$teacherName]['schedules'][] = $s;
        }

        $tableData = [];
        foreach ($teacherMap as $teacherData) {
            $row = ['Teacher' => $teacherData['teacher']];
            foreach ($workDays as $day) {
                $daySchedules = array_filter($teacherData['schedules'], function($s) use ($day) {
                    return $s->timeSlot->day === $day;
                });
                
                usort($daySchedules, function($a, $b) {
                    return strcmp($a->timeSlot->start_time, $b->timeSlot->start_time);
                });

                $formattedSlots = [];
                foreach ($daySchedules as $ds) {
                    $start = substr($ds->timeSlot->start_time, 0, 5);
                    $end = substr($ds->timeSlot->end_time, 0, 5);
                    $formattedSlots[] = "{$start}-{$end} | {$ds->course->name} | {$ds->schoolClass->name} | {$ds->classroom->name}";
                }
                
                $row[$day] = implode("\n", $formattedSlots);
            }
            $tableData[] = $row;
        }

        usort($tableData, function($a, $b) {
            return strcmp($a['Teacher'], $b['Teacher']);
        });

        return ['tableData' => $tableData, 'workDays' => $workDays];
    }

    public function exportExcel(Request $request)
    {
        $data = $this->getScheduleData($request)['tableData'];
        
        $writer = SimpleExcelWriter::streamDownload('schedule.xlsx');
        
        foreach ($data as $row) {
            $writer->addRow($row);
        }
        
        return $writer->toBrowser();
    }

    public function exportPdf(Request $request)
    {
        $data = $this->getScheduleData($request);
        
        $pdf = Pdf::loadView('exports.schedule', [
            'schedules' => $data['tableData'],
            'workDays'  => $data['workDays']
        ])->setPaper('a4', 'landscape');
            
        return $pdf->download('schedule.pdf');
    }
}
