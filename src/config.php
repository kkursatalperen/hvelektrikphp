<?php
declare(strict_types=1);

// .env dosyasini basit sekilde okur (harici kutuphane gerektirmez).
function hv_load_env(string $path): void
{
    if (!is_file($path)) {
        return;
    }
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));
        if (strlen($value) >= 2 && (
            ($value[0] === '"' && $value[-1] === '"') ||
            ($value[0] === "'" && $value[-1] === "'")
        )) {
            $value = substr($value, 1, -1);
        }
        if ($key !== '' && getenv($key) === false) {
            putenv("$key=$value");
        }
    }
}

hv_load_env(__DIR__ . '/../.env');

function hv_env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

function hv_env_required(string $key): string
{
    $value = hv_env($key);
    if ($value === null) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['detail' => "Sunucu yapilandirma hatasi: $key eksik."]);
        exit;
    }
    return $value;
}

return [
    'db_host' => hv_env('DB_HOST', 'localhost'),
    'db_port' => hv_env('DB_PORT', '3306'),
    'db_name' => hv_env_required('DB_NAME'),
    'db_user' => hv_env_required('DB_USER'),
    'db_pass' => hv_env('DB_PASS', ''),

    'jwt_secret' => hv_env_required('JWT_SECRET'),

    'admin_email' => hv_env('ADMIN_EMAIL', 'admin@hvelektrik.com.tr'),
    'admin_password' => hv_env('ADMIN_PASSWORD', 'HvAdmin2026!'),

    'resend_api_key' => hv_env('RESEND_API_KEY', ''),
    'sender_email' => hv_env('SENDER_EMAIL', 'onboarding@resend.dev'),
    'notify_email' => hv_env('NOTIFY_EMAIL', 'info@hvelektrik.com.tr'),

    'cloudinary_cloud_name' => hv_env('CLOUDINARY_CLOUD_NAME', ''),
    'cloudinary_api_key' => hv_env('CLOUDINARY_API_KEY', ''),
    'cloudinary_api_secret' => hv_env('CLOUDINARY_API_SECRET', ''),
];
