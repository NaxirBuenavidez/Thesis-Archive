<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$logo = App\Models\Setting::where('key', 'logo_path')->first();
if ($logo && str_starts_with($logo->value, 'http')) {
    $path = explode('thesis-archive/', $logo->value)[1] ?? null;
    if ($path) {
        $logo->value = $path;
        $logo->save();
        echo 'Fixed logo_path DB entry.';
    }
}
echo "Done.\n";
