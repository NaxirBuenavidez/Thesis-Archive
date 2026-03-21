<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $notifications = Notification::forUser($user)
            ->orderByDesc('created_at')
            ->take(50)
            ->get();

        $unreadCount = Notification::forUser($user)->unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    public function markRead(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        Notification::forUser($user)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function markOne(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        Notification::forUser($user)
            ->where('id', $id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public static function dispatch(string $type, string $title, string $message, array $data = [], ?int $targetUserId = null): void
    {
        Notification::create([
            'type'           => $type,
            'target_user_id' => $targetUserId,
            'title'          => $title,
            'message'        => $message,
            'data'           => $data,
        ]);
    }
}
