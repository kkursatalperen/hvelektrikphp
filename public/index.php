<?php
declare(strict_types=1);

require __DIR__ . '/../src/Http.php';
require __DIR__ . '/../src/Database.php';
require __DIR__ . '/../src/Jwt.php';
require __DIR__ . '/../src/Auth.php';
require __DIR__ . '/../src/Cloudinary.php';
require __DIR__ . '/../src/Resend.php';
require __DIR__ . '/../src/content.php';
require __DIR__ . '/../src/app.php';

$config = require __DIR__ . '/../src/config.php';

Http::applyCors($config['allowed_origins']);

try {
    $pdo = Database::pdo($config);
} catch (Throwable $e) {
    error_log('DB connection failed: ' . $e->getMessage());
    Http::error(500, 'Veritabanına bağlanılamadı.');
}

try {
    hv_dispatch($pdo, $config);
} catch (Throwable $e) {
    error_log('Unhandled error: ' . $e->getMessage());
    Http::error(500, 'Sunucu hatası.');
}
