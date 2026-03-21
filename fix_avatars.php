<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$profiles = App\Models\Profile::where('avatar', 'like', 'http%')->get();
foreach ($profiles as $profile) {
    if (strpos($profile->avatar, 'thesis-archive/') !== false) {
        $path = explode('thesis-archive/', $profile->avatar)[1];
        // Note: we must bypass the mutator if we had one, but we don't have a mutator, only an accessor.
        // However, wait, if we read $profile->avatar it goes through the accessor!
        // So we should read the raw attribute:
        $rawAvatar = $profile->getRawOriginal('avatar');
        if (strpos($rawAvatar, 'thesis-archive/') !== false) {
            $path = explode('thesis-archive/', $rawAvatar)[1];
            $profile->avatar = $path;
            $profile->save();
            echo "Updated avatar path for profile " . $profile->id . "\n";
        }
    }
}
echo "Avatars fixed.\n";
