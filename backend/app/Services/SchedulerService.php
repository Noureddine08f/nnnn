<?php

namespace App\Services;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\TimeSlot;
use Exception;
use Illuminate\Support\Facades\DB;

class SchedulerService
{
    public function generate()
    {
        return DB::transaction(function () {
            return $this->tryGenerate();
        });
    }

    private function tryGenerate()
    {
        // 1. مسح الجدول القديم
        Schedule::query()->delete();

        // 2. جلب البيانات (ترتيب عشوائي للمدرسين لضمان عمل زر التوليد بشكل متجدد)
        $assignments = Assignment::with(['teacher', 'course', 'schoolClass'])
            ->inRandomOrder() 
            ->get();

        $classrooms = Classroom::orderBy('id')->get();
        
        // ترتيب الفترات الزمنية لضمان توزيعها على أيام الأسبوع
        $timeSlots = TimeSlot::whereIn('day', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'])
            ->orderBy('start_time') 
            ->orderBy('day')
            ->get();

        if ($timeSlots->isEmpty() || $classrooms->isEmpty() || $assignments->isEmpty()) {
            throw new Exception("بيانات ناقصة: تأكد من وجود فترات زمنية، قاعات، وتكليفات.");
        }

        // 3. إنشاء خزان الحصص بنظام Round-Robin (توزيع عادل للبداية)
        $sessionPool = [];
        $tempAssignments = [];
        
        // تجهيز بيانات التكليفات لتوزيعها بشكل متناوب
        foreach ($assignments as $assignment) {
            $requiredSessions = ceil($assignment->hours_per_week / 2);
            $tempAssignments[] = [
                'teacher_id'      => $assignment->teacher_id,
                'course_id'       => $assignment->course_id,
                'school_class_id' => $assignment->school_class_id,
                'assignment_id'   => $assignment->id,
                'remaining'       => $requiredSessions
            ];
        }

        // توزيع الحصص بنظام Round-Robin
        $hasRemaining = true;
        while ($hasRemaining) {
            $hasRemaining = false;
            foreach ($tempAssignments as &$ta) {
                if ($ta['remaining'] > 0) {
                    $sessionPool[] = [
                        'teacher_id'      => $ta['teacher_id'],
                        'course_id'       => $ta['course_id'],
                        'school_class_id' => $ta['school_class_id'],
                        'assignment_id'   => $ta['assignment_id']
                    ];
                    $ta['remaining']--;
                    $hasRemaining = true;
                }
            }
        }

        // 4. مصفوفات التتبع لمنع التضارب والـ Soft Constraints
        $teacherOccupied = []; // منع تعارض الأستاذ (Hard)
        $classOccupied   = []; // منع تعارض القسم (Hard)
        $roomOccupied    = []; // منع تعارض القاعة (Hard)
        
        $teacherDailySessions = []; // توزيع العبء اليومي للأستاذ (Hard: max 2, Soft: 2-2-2-2-1)
        $slotUsage = []; // توازن الفترات الزمنية (Soft)
        $classCourseDaily = []; // تفادي تكرار المادة للقسم في نفس اليوم (Soft)
        
        $schedulesToInsert = [];
        $failures = [];

        // 5. حلقة التوزيع الذكية (Smart Allocation with Scoring System)
        foreach ($sessionPool as $session) {
            $bestSlot = null;
            $bestRoom = null;
            $minScore = PHP_INT_MAX;

            $tId = $session['teacher_id'];
            $cId = $session['school_class_id'];
            $courseId = $session['course_id'];

            foreach ($timeSlots as $slot) {
                $sId = $slot->id;
                $day = $slot->day;

                // قيد: منع المدرس من أخذ أكثر من حصتين في يوم واحد (Hard Constraint)
                $dailyCount = $teacherDailySessions[$tId][$day] ?? 0;
                if ($dailyCount >= 2) continue;

                // التأكد من عدم وجود تعارض للأستاذ أو القسم في هذا الـ Slot (Hard Constraints)
                if (isset($teacherOccupied[$sId][$tId])) continue;
                if (isset($classOccupied[$sId][$cId])) continue;

                foreach ($classrooms as $room) {
                    $rId = $room->id;

                    // التأكد من عدم وجود تعارض للقاعة (Hard Constraint)
                    if (isset($roomOccupied[$sId][$rId])) continue;

                    // --- حساب النقاط (Scoring System) ---
                    // الهدف: أقل رقم ممڪن = أفضل اختيار
                    $score = 0;

                    // 1. توازن الفترات (Slot Balancing): نفضل الفترات الأقل استعمالاً
                    $score += ($slotUsage[$sId] ?? 0) * 10;

                    // 2. توزيع أيام الأستاذ (Day Distribution): نفضل الأيام التي فيها حصص أقل للأستاذ
                    $score += $dailyCount * 20;

                    // 3. توزيع المواد للقسم (Class Course Distribution): عقوبة كبيرة إذا كانت نفس المادة في نفس اليوم
                    $classCourseCount = $classCourseDaily[$cId][$courseId][$day] ?? 0;
                    $score += $classCourseCount * 50; 

                    // اختيار أفضل نتيجة (Lowest Score)
                    if ($score < $minScore) {
                        $minScore = $score;
                        $bestSlot = $slot;
                        $bestRoom = $room;
                        
                        // إذا لقينا "Perfect Match" بـ score = 0 نقدر نخرج بكري لتسريع العملية
                        if ($minScore === 0) break 2;
                    }
                }
            }

            // بعد تجربة كل الخيارات، نحجز الـ Best Match
            if ($bestSlot && $bestRoom) {
                $sId = $bestSlot->id;
                $day = $bestSlot->day;
                $rId = $bestRoom->id;

                // تسجيل الحجز (Hard Constraints)
                $teacherOccupied[$sId][$tId] = true;
                $classOccupied[$sId][$cId]   = true;
                $roomOccupied[$sId][$rId]    = true;

                // تحديث الـ Soft Constraints
                $slotUsage[$sId] = ($slotUsage[$sId] ?? 0) + 1;
                $teacherDailySessions[$tId][$day] = ($teacherDailySessions[$tId][$day] ?? 0) + 1;
                $classCourseDaily[$cId][$courseId][$day] = ($classCourseDaily[$cId][$courseId][$day] ?? 0) + 1;

                $schedulesToInsert[] = [
                    'teacher_id'      => $tId,
                    'course_id'       => $courseId,
                    'school_class_id' => $cId,
                    'classroom_id'    => $rId,
                    'time_slot_id'    => $sId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ];
            } else {
                $failures[] = "Could not place session for Teacher ID: {$tId}, Course ID: {$courseId}, Class ID: {$cId}";
            }
        }

        // 6. الإدخال النهائي
        foreach (array_chunk($schedulesToInsert, 100) as $chunk) {
            Schedule::insert($chunk);
        }

        return [
            'status'    => empty($failures) ? 'success' : 'partial',
            'scheduled' => count($schedulesToInsert),
            'remaining' => count($sessionPool) - count($schedulesToInsert),
            'issues'    => array_unique($failures)
        ];
    }
}