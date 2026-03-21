<?php
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

// Vercel Serverless Read-Only Filesystem Fix
$app->useStoragePath('/tmp/storage');
$storagePath = $app->storagePath();

foreach (['framework/views', 'framework/cache', 'framework/cache/data', 'framework/sessions', 'logs'] as $dir) {
    if (!is_dir("{$storagePath}/{$dir}")) {
        mkdir("{$storagePath}/{$dir}", 0777, true);
    }
}

$app->handleRequest(Request::capture());
