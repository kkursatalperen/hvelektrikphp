<?php
// Sadece yerel gelistirme icin: `php -S localhost:8090 -t public public/router.php`
// Gercek hostingde (Apache) bu dosyaya gerek yok, .htaccess ayni isi gorur.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;
if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false;
}
require __DIR__ . '/index.php';
