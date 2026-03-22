<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::getResolved());
    }

    public function update(Request $request)
    {
        // Settings to update
        $updates = $request->except(['logo', '_method']);

        foreach ($updates as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Handle logo upload if present
        if ($request->hasFile('logo')) {
            $request->validate(['logo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5120']);
            $path = $request->file('logo')->store('system', 's3');
            
            Setting::updateOrCreate(
                ['key' => 'logo_path'],
                ['value' => $path]
            );
        }

        \Illuminate\Support\Facades\Cache::forget('system_settings');
        return response()->json(['message' => 'Settings updated successfully', 'settings' => Setting::getResolved()]);
    }
}
