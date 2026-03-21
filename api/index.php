<?php
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Force Vercel to use /tmp for all cache files natively
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_EVENTS_CACHE=/tmp/events.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');

// Use database sessions natively across serverless functions instead of dropping payload
putenv('SESSION_DRIVER=database');
$_ENV['SESSION_DRIVER'] = 'database';

$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

// Trick Laravel into knowing Vercel's Load Balancer is using HTTPS
$_SERVER['HTTPS'] = 'on';
putenv('HTTPS=on');

// 🚨 VERCEL NATIVE ROUTING FIX
// Vercel serverless functions mutate REQUEST_URI to the destination script (api/index.php).
// We map it back via the query string tracking parameter to un-break Laravel routing!
if (isset($_GET['__path_override'])) {
    $override = '/' . ltrim($_GET['__path_override'], '/');
    $_SERVER['REQUEST_URI'] = $override;
    $_SERVER['PATH_INFO'] = $override;
}

try {
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
    
} catch (\Throwable $e) {
    // Intercept generic 500 error screen and unmask the raw PHP crash instead!
    http_response_code(500);
    header('Content-Type: text/plain');
    echo "VERCEL FATAL ERROR OVERRIDE:\n";
    echo "==============================\n\n";
    echo $e->getMessage() . "\n\n";
    echo "FILE: " . $e->getFile() . " on line " . $e->getLine() . "\n\n";
    echo "STACK TRACE:\n";
    echo $e->getTraceAsString();
    exit(1);
}
