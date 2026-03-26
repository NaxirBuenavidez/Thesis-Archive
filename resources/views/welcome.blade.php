<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Thesis Archive') }}</title>

        <!-- Fonts -->
        <link rel="icon" type="image/png" href="/images/ptas-logo.png" />
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @if(isset($bootData))
        <script>
            window.__boot_data = @json($bootData);
        </script>
        @endif

        <!-- Scripts -->
        @viteReactRefresh
        @if(file_exists(public_path('build/manifest.json')))
            @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @else
            <script>console.warn('Vite manifest not found. Please run npm run build.');</script>
        @endif
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>
