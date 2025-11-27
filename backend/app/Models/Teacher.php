<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = ['name', 'specialization', 'max_hours', 'color'];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
    //
}
