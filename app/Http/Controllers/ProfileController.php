<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'fname' => ['required', 'string', 'max:255'],
            'mname' => ['nullable', 'string', 'max:255'],
            'lname' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string'],
            'date_of_birth' => ['nullable', 'date'],
            'educational_backgrounds' => ['nullable', 'array'],
            'educational_backgrounds.*.id' => [
                'nullable', 
                'integer', 
                Rule::exists('educational_backgrounds', 'id')->where(function ($query) use ($user) {
                    return $query->where('user_id', $user->id);
                })
            ],
            'educational_backgrounds.*.level' => ['required', 'string', 'max:255'],
            'educational_backgrounds.*.school_name' => ['required', 'string', 'max:255'],
            'educational_backgrounds.*.degree' => ['nullable', 'string', 'max:255'],
            'educational_backgrounds.*.year_start' => ['required', 'integer'],
            'educational_backgrounds.*.year_end' => ['nullable', 'integer'],
            'educational_backgrounds.*.description' => ['nullable', 'string'],
        ]);

        $profileData = collect($validated)->except('educational_backgrounds')->toArray();
        $educationData = $validated['educational_backgrounds'] ?? [];

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        // Sync Educational Backgrounds
        // 1. Get IDs of incoming education records
        $incomingIds = collect($educationData)->pluck('id')->filter()->toArray();

        // 2. Delete records that are not in the incoming list
        $user->educationalBackgrounds()->whereNotIn('id', $incomingIds)->delete();

        // 3. Update or Create records
        foreach ($educationData as $edu) {
            $user->educationalBackgrounds()->updateOrCreate(
                ['id' => $edu['id'] ?? null],
                [
                    'level' => $edu['level'],
                    'school_name' => $edu['school_name'],
                    'degree' => $edu['degree'],
                    'year_start' => $edu['year_start'],
                    'year_end' => $edu['year_end'],
                    'description' => $edu['description'] ?? null,
                ]
            );
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
            'user' => $user->load('profile', 'educationalBackgrounds'), // Load education
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'], // Max 2MB
        ]);

        $user = $request->user();
        $profile = $user->profile ?? $user->profile()->create([]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->update(['avatar' => $path]);
        }

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => asset('storage/' . $path),
            'user' => $user->load('profile'),
        ]);
    }

    public function updateAccount(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            // Always require current password for any sensitive change
            'current_password' => ['required', 'current_password'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);

        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Account settings updated successfully',
            'user' => $user->load('profile'),
        ]);
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        return response()->json([
            'message' => 'Password verified',
        ]);
    }
}
