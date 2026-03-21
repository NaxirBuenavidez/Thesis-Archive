<?php
$log = file_get_contents('storage/logs/laravel.log');
preg_match_all('/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\].*?Exception:.*?Stack trace:/s', $log, $matches);
if (!empty($matches[0])) {
    // Print the last 2 exceptions
    $last_exceptions = array_slice($matches[0], -2);
    foreach ($last_exceptions as $e) {
        // print only first 15 lines of stack trace
        $lines = explode("\n", $e);
        echo implode("\n", array_slice($lines, 0, 15)) . "\n\n";
    }
} else {
    echo "No exceptions found in log.\n";
}
