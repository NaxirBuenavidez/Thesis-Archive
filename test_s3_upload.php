<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "Uploading test file to Cloudflare R2...\n";

try {
    $filename = 'testing/hello_from_ai.txt';
    $content = "Hello! Your Thesis Archive file storage is working perfectly as of " . date('Y-m-d H:i:s');
    
    // Upload the file to S3
    Storage::disk('s3')->put($filename, $content, 'public');
    
    // Get the URL
    $url = Storage::disk('s3')->url($filename);
    
    echo "✅ Successfully uploaded to R2!\n";
    echo "Path: " . $filename . "\n";
    echo "URL: " . $url . "\n";
} catch (\Exception $e) {
    echo "❌ Upload FAILED: " . $e->getMessage() . "\n";
}
