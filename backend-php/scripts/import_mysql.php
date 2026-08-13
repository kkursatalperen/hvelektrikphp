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

// --- hero_slides ---
echo "hero_slides aktariliyor...\n";
$heroSlides = load_json("$exportDir/hero_slides.json");
$stmt = $pdo->prepare(
    'REPLACE INTO hero_slides (id, sort_order, image, sub_tr, sub_en, title_tr, title_en, desc_tr, desc_en, cta_tr, cta_en, link, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($heroSlides as $h) {
    $stmt->execute([
        $h['id'], (int) ($h['sort_order'] ?? 0), $h['image'] ?? '', $h['sub_tr'] ?? '', $h['sub_en'] ?? '',
        $h['title_tr'] ?? '', $h['title_en'] ?? '', $h['desc_tr'] ?? '', $h['desc_en'] ?? '',
        $h['cta_tr'] ?? '', $h['cta_en'] ?? '', $h['link'] ?? '/', !empty($h['active']) ? 1 : 0,
        hv_mongo_date($h['created_at'] ?? null),
    ]);
}
echo '  ' . count($heroSlides) . " kayit aktarildi\n";

// --- categories ---
echo "categories aktariliyor...\n";
$categories = load_json("$exportDir/categories.json");
$stmt = $pdo->prepare(
    'REPLACE INTO categories (id, sort_order, icon, image, accent_image, link, title_tr, title_en,
        sub_tr, sub_en, desc_tr, desc_en, page_title_tr, page_title_en, page_desc_tr, page_desc_en,
        features_tr, features_en, stats, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($categories as $c) {
    $stmt->execute([
        $c['id'], (int) ($c['sort_order'] ?? 0), $c['icon'] ?? 'tower', $c['image'] ?? '', $c['accent_image'] ?? '',
        $c['link'] ?? '/', $c['title_tr'] ?? '', $c['title_en'] ?? '', $c['sub_tr'] ?? '', $c['sub_en'] ?? '',
        $c['desc_tr'] ?? '', $c['desc_en'] ?? '', $c['page_title_tr'] ?? '', $c['page_title_en'] ?? '',
        $c['page_desc_tr'] ?? '', $c['page_desc_en'] ?? '',
        hv_arr_json($c['features_tr'] ?? []), hv_arr_json($c['features_en'] ?? []), hv_arr_json($c['stats'] ?? []),
        !empty($c['active']) ? 1 : 0, hv_mongo_date($c['created_at'] ?? null),
    ]);
}
echo '  ' . count($categories) . " kayit aktarildi\n";

// --- counters ---
echo "counters aktariliyor...\n";
$counters = load_json("$exportDir/counters.json");
$stmt = $pdo->prepare(
    'REPLACE INTO counters (id, sort_order, icon, value, suffix, label_tr, label_en, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($counters as $c) {
    $stmt->execute([
        $c['id'], (int) ($c['sort_order'] ?? 0), $c['icon'] ?? 'globe', (int) ($c['value'] ?? 0),
        $c['suffix'] ?? '+', $c['label_tr'] ?? '', $c['label_en'] ?? '', !empty($c['active']) ? 1 : 0,
    ]);
}
echo '  ' . count($counters) . " kayit aktarildi\n";

// --- page_content ---
echo "page_content aktariliyor...\n";
$pageContent = load_json("$exportDir/page_content.json");
$stmt = $pdo->prepare(
    'REPLACE INTO page_content (content_key, value_tr, value_en, section, updated_at)
     VALUES (?, ?, ?, ?, ?)'
);
foreach ($pageContent as $p) {
    $stmt->execute([
        $p['key'], $p['value_tr'] ?? '', $p['value_en'] ?? '', $p['section'] ?? 'genel',
        hv_mongo_date($p['updated_at'] ?? null),
    ]);
}
echo '  ' . count($pageContent) . " kayit aktarildi\n";

// --- footer_info ---
echo "footer_info aktariliyor...\n";
$footerInfo = load_json("$exportDir/footer_info.json");
$stmt = $pdo->prepare(
    'REPLACE INTO footer_info (content_key, value_tr, value_en, updated_at)
     VALUES (?, ?, ?, ?)'
);
foreach ($footerInfo as $f) {
    $stmt->execute([
        $f['key'], $f['value_tr'] ?? '', $f['value_en'] ?? '', hv_mongo_date($f['updated_at'] ?? null),
    ]);
}
echo '  ' . count($footerInfo) . " kayit aktarildi\n";

// --- partners ---
echo "partners aktariliyor...\n";
$partners = load_json("$exportDir/partners.json");
$stmt = $pdo->prepare(
    'REPLACE INTO partners (id, sort_order, name, logo, link, active)
     VALUES (?, ?, ?, ?, ?, ?)'
);
foreach ($partners as $p) {
    $stmt->execute([
        $p['id'], (int) ($p['sort_order'] ?? 0), $p['name'] ?? '', $p['logo'] ?? '', $p['link'] ?? '',
        !empty($p['active']) ? 1 : 0,
    ]);
}
echo '  ' . count($partners) . " kayit aktarildi\n";

// --- projects ---
// Not: baz eski kayitlarda "created_at" yerine kamelCase "createdAt" olabiliyor
// (eski surumden kalma karisik sema); ikisi de kontrol edilir.
echo "projects aktariliyor...\n";
$projects = load_json("$exportDir/projects.json");
$stmt = $pdo->prepare(
    'REPLACE INTO projects (id, sort_order, image, images, title_tr, title_en, desc_tr, desc_en,
        category, country, year, status, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($projects as $p) {
    $stmt->execute([
        $p['id'], (int) ($p['sort_order'] ?? 0), $p['image'] ?? '', hv_arr_json($p['images'] ?? []),
        $p['title_tr'] ?? '', $p['title_en'] ?? '', $p['desc_tr'] ?? '', $p['desc_en'] ?? '',
        $p['category'] ?? 'ges', $p['country'] ?? '', isset($p['year']) ? (int) $p['year'] : null,
        $p['status'] ?? 'tamamlanan', !empty($p['active']) ? 1 : 0,
        hv_mongo_date($p['created_at'] ?? $p['createdAt'] ?? null),
    ]);
}
echo '  ' . count($projects) . " kayit aktarildi\n";

// --- career_posts ---
echo "career_posts aktariliyor...\n";
$careerPosts = load_json("$exportDir/career_posts.json");
$stmt = $pdo->prepare(
    'REPLACE INTO career_posts (id, title_tr, title_en, location, type, desc_tr, desc_en, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($careerPosts as $c) {
    $stmt->execute([
        $c['id'], $c['title_tr'] ?? '', $c['title_en'] ?? '', $c['location'] ?? 'İzmir', $c['type'] ?? 'tam-zamanlı',
        $c['desc_tr'] ?? '', $c['desc_en'] ?? '', !empty($c['active']) ? 1 : 0,
        hv_mongo_date($c['created_at'] ?? null),
    ]);
}
echo '  ' . count($careerPosts) . " kayit aktarildi\n";

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

function hv_arr_json(mixed $value): string
{
    return json_encode(is_array($value) ? $value : [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
