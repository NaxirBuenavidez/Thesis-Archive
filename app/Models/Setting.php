<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];

    /**
     * Get all settings with resolved paths for branding (Logo, etc.)
     */
    public static function getResolved()
    {
        $settings = self::all()->pluck('value', 'key');
        
        if (isset($settings['logo_path']) && !empty($settings['logo_path'])) {
            $val = (string) $settings['logo_path'];
            
            // 1. If it's already a full URL or data URI, leave it
            if (str_starts_with($val, 'http') || str_starts_with($val, 'data:image')) {
                return $settings;
            }

            // 2. If it starts with /, it's an absolute web path (preferred)
            if (str_starts_with($val, '/')) {
                $settings->put('logo_path', (string) url($val));
                return $settings;
            }

            // 3. Check for the file in public/images/ (Static fallback)
            if (file_exists(public_path('images/' . $val))) {
                $settings->put('logo_path', (string) url('images/' . $val));
                return $settings;
            }

            // 4. Fallback to storage/ (User uploads)
            if (config('filesystems.default') === 's3') {
                try {
                    $settings->put('logo_path', (string) \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($val, now()->addMinutes(120)));
                } catch (\Exception $e) {
                    $settings->put('logo_path', (string) url('storage/' . $val));
                }
            } else {
                $settings->put('logo_path', (string) url('storage/' . $val));
            }
        }
        
        return $settings;
    }
}
