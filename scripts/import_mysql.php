<?php
declare(strict_types=1);

/**
 * export_mongo.py tarafindan uretilen JSON dosyalarini MySQL'e aktarir,
 * ayrica .env'deki ADMIN_EMAIL/ADMIN_PASSWORD ile admin kullanicisini olusturur/gunceller.
 *
 * Kullanim (once schema.sql'i hedef veritabaninda calistirin):
 *   php import_mysql.php
 *
 * Idempotent'tir: tekrar calistirilirsa mevcut id'leri REPLACE INTO ile gunceller,
 * veri kaybina/yinelenmeye yol acmaz.
 */

require __DIR__ . '/../src/Database.php';
require __DIR__ . '/../src/Auth.php';

$config = require __DIR__ . '/../src/config.php';
$pdo = Database::pdo($config);

function load_json(string $path): array
{
    if (!is_file($path)) {
        echo "  (dosya yok, atlandi: $path)\n";
        return [];
    }
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

$exportDir = __DIR__ . '/export';

// --- admin kullanicisi ---
echo "Admin kullanicisi olusturuluyor/guncelleniyor...\n";
$adminEmail = strtolower($config['admin_email']);
$adminHash = Auth::hashPassword($config['admin_password']);
$stmt = $pdo->prepare(
    'INSERT INTO users (email, password_hash, name, role, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
);
$stmt->execute([$adminEmail, $adminHash, 'HV Admin', 'admin', gmdate('Y-m-d H:i:s')]);
echo "  OK: $adminEmail\n";

// --- messages ---
echo "messages aktariliyor...\n";
$messages = load_json("$exportDir/messages.json");
$stmt = $pdo->prepare(
    'REPLACE INTO messages (id, name, email, phone, subject, message, is_read, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($messages as $m) {
    $stmt->execute([
        $m['id'], $m['name'], $m['email'], $m['phone'] ?? '', $m['subject'], $m['message'],
        !empty($m['read']) ? 1 : 0, hv_mongo_date($m['created_at']),
    ]);
}
echo '  ' . count($messages) . " kayit aktarildi\n";

// --- careers ---
echo "careers aktariliyor...\n";
$careers = load_json("$exportDir/careers.json");
$stmt = $pdo->prepare(
    'REPLACE INTO careers (id, name, email, phone, position, message, cv_url, cv_public_id, cv_filename, cv_size, is_read, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($careers as $c) {
    $stmt->execute([
        $c['id'], $c['name'], $c['email'], $c['phone'] ?? '', $c['position'], $c['message'] ?? '',
        $c['cv_url'] ?? null, $c['cv_public_id'] ?? null, $c['cv_filename'] ?? null,
        isset($c['cv_size']) ? (int) $c['cv_size'] : null,
        !empty($c['read']) ? 1 : 0, hv_mongo_date($c['created_at']),
    ]);
}
echo '  ' . count($careers) . " kayit aktarildi\n";

// --- news ---
echo "news aktariliyor...\n";
$news = load_json("$exportDir/news.json");
$stmt = $pdo->prepare(
    'REPLACE INTO news (id, title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, image, news_date, published, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($news as $n) {
    $stmt->execute([
        $n['id'], $n['title_tr'], $n['title_en'], $n['excerpt_tr'], $n['excerpt_en'],
        $n['content_tr'], $n['content_en'], $n['image'] ?? '', $n['date'],
        !empty($n['published']) ? 1 : 0, hv_mongo_date($n['created_at']),
    ]);
}
echo '  ' . count($news) . " kayit aktarildi\n";

echo "\nTamamlandi.\n";

function hv_mongo_date(?string $iso): string
{
    if (!$iso) {
        return gmdate('Y-m-d H:i:s');
    }
    $dt = new DateTime($iso);
    $dt->setTimezone(new DateTimeZone('UTC'));
    return $dt->format('Y-m-d H:i:s');
}
