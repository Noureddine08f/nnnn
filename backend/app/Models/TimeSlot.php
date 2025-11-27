<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    protected $fillable = ['day', 'start_time', 'end_time'];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
