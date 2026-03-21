<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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
            // 'educational_backgrounds' => ['nullable', 'array'],
            // 'educational_backgrounds.*.id' => [
            //     'nullable', 
            //     'integer', 
            //     Rule::exists('educational_backgrounds', 'id')->where(function ($query) use ($user) {
            //         return $query->where('user_id', $user->id);
            //     })
            // ],
            // 'educational_backgrounds.*.level' => ['required', 'string', 'max:255'],
            // 'educational_backgrounds.*.school_name' => ['required', 'string', 'max:255'],
            // 'educational_backgrounds.*.degree' => ['nullable', 'string', 'max:255'],
            // 'educational_backgrounds.*.year_start' => ['required', 'integer'],
            // 'educational_backgrounds.*.year_end' => ['nullable', 'integer'],
            // 'educational_backgrounds.*.description' => ['nullable', 'string'],
        ]);

        $profileData = collect($validated)->except('educational_backgrounds')->toArray();
        // $educationData = $validated['educational_backgrounds'] ?? [];

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        /* Sync Educational Backgrounds - Disabled as table/relationship is missing
        $incomingIds = collect($educationData)->pluck('id')->filter()->toArray();
        $user->educationalBackgrounds()->whereNotIn('id', $incomingIds)->delete();
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
        */

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
            'user' => $user->load('profile'), // Load profile only for now
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
            $file = $request->file('avatar');
            $base64 = base64_encode(file_get_contents($file->path()));
            $mimeType = $file->getMimeType();
            $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

            // Delete old avatar from storage if it exists (legacy support)
            if ($profile->avatar && !str_starts_with($profile->avatar, 'http') && !str_starts_with($profile->avatar, 'data:image')) {
                Storage::disk('public')->delete($profile->avatar);
            }

            $profile->update(['avatar' => $base64Image]);
        }

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $profile->avatar,
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
            'password' => ['nullable', 'confirmed', Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
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
