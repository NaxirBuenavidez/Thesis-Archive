<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        if (isset($settings['logo_path']) && !empty($settings['logo_path'])) {
            $val = (string) $settings['logo_path'];
            if (!str_starts_with($val, 'http') && !str_starts_with($val, 'data:image') && !str_starts_with($val, '/')) {
                if (env('FILESYSTEM_DISK') === 's3') {
                    try {
                        $settings->put('logo_path', \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($val, now()->addMinutes(120)));
                    } catch (\Exception $e) {
                        $settings->put('logo_path', url('storage/' . $val));
                    }
                } else {
                    $settings->put('logo_path', url('storage/' . $val));
                }
            } elseif (str_starts_with($val, '/')) {
                $settings->put('logo_path', url($val));
            }
        }
        
        return response()->json($settings);
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
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['message' => 'Settings updated successfully', 'settings' => $settings]);
    }
}
