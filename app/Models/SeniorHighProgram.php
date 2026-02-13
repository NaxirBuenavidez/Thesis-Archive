<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeniorHighProgram extends Model
{
    protected $fillable = ['department_id', 'name', 'code', 'description'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
