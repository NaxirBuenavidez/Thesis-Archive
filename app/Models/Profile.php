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
    }

    public function getAvatarAttribute($value)
    {
        if ($value) {
            if (str_starts_with($value, 'http') || str_starts_with($value, 'data:image')) {
                return $value;
            }
            
            if (env('FILESYSTEM_DISK') === 's3') {
                return \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($value, now()->addMinutes(120));
            }
            
            return url('storage/' . $value);
        }
        return null;
    }
}
