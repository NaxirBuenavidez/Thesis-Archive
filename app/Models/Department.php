<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description'];

    public function programs()
    {
        return $this->hasMany(Program::class);
    }

    public function seniorHighPrograms()
    {
        return $this->hasMany(SeniorHighProgram::class);
    }
}
