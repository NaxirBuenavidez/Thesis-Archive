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
        
        foreach ($settings as $key => $val) {
            if (str_ends_with($key, '_path') && !empty($val)) {
                $val = (string) $val;
                
                // 1. If it's already a full URL or data URI, leave it
                if (str_starts_with($val, 'http') || str_starts_with($val, 'data:image')) {
                    continue;
                }

                // 2. If it starts with /, it's an absolute web path (preferred)
                if (str_starts_with($val, '/')) {
                    $settings[$key] = (string) url($val);
                    continue;
                }

                // 3. Check for the file in public/images/ (Static fallback)
                if (file_exists(public_path('images/' . $val))) {
                    $settings[$key] = (string) url('images/' . $val);
                    continue;
                }

                // 4. Fallback to storage/ (User uploads or S3)
                if (config('filesystems.default') === 's3' || str_starts_with($val, 'system/')) {
                    try {
                        // Use temporaryUrl for S3 to ensure access via R2 API endpoint
                        if (str_starts_with($val, 'system/')) {
                            $settings[$key] = (string) \Illuminate\Support\Facades\Storage::disk('s3')->temporaryUrl($val, now()->addHours(24));
                        } else {
                            $settings[$key] = (string) url('storage/' . $val);
                        }
                    } catch (\Exception $e) {
                        $settings[$key] = (string) url('storage/' . $val);
                    }
                } else {
                    $settings[$key] = (string) url('storage/' . $val);
                }
            }
        }
        
        return $settings;
    }
}
