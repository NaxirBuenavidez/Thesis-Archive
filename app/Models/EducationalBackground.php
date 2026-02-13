<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalBackground extends Model
{
    protected $fillable = [
        'user_id',
        'level',
        'school_name',
        'degree',
        'year_start',
        'year_end',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
