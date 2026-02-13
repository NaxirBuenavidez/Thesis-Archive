<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar',
        'fname',
        'mname',
        'lname',
        'suffix',
        'address',
        'phone_number',
        'bio',
        'date_of_birth',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }//
}
