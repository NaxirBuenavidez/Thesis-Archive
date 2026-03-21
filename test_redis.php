<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $redis = Illuminate\Support\Facades\Redis::connection();
    echo "Pinging Redis...\n";
    $response = $redis->ping();
    echo "Response: " . (is_string($response) ? $response : 'OK') . "\n";
    echo "Connected successfully to Redis!\n";
} catch (\Exception $e) {
    echo "ERROR CONNECTING TO REDIS:\n";
    echo $e->getMessage() . "\n";
}
