<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'target_user_id',
        'title',
        'message',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data'    => 'array',
        'read_at' => 'datetime',
    ];

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeForUser($query, \App\Models\User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('target_user_id', $user->id);
            
            // If the user is an admin or super admin, they also get the system-wide (target_user_id = null) notifications
            if ($user->role && in_array($user->role->slug, ['spadmin', 'admin'])) {
                $q->orWhereNull('target_user_id');
            }
        });
    }
}
