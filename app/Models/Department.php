<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'description'];

    public function programs()
    {
        return $this->hasMany(Program::class);
    }
}
