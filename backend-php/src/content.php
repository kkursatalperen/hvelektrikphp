<?php
declare(strict_types=1);

/**
 * Site icerik yonetimi: hero slides, categories, counters, page content (i18n),
 * footer info, partners, projects, career posts + genel gorsel yukleme.
 * Orijinal backend/server.py (master branch) ile birebir ayni endpoint'ler/JSON sekilleri.
 */

function hv_json_encode_field(mixed $value): string
{
    return json_encode($value ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function hv_json_decode_field(?string $raw): array
{
    if ($raw === null || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function hv_str(array $data, string $key, string $default = ''): string
{
    return isset($data[$key]) ? (string) $data[$key] : $default;
}

function hv_int(array $data, string $key, int $default = 0): int
{
    return isset($data[$key]) ? (int) $data[$key] : $default;
}

// ------------------------------------------------------------------ //
// Hero Slides
// ------------------------------------------------------------------ //
function hv_hero_slide_input(array $data): array
{
    return [
        'sort_order' => hv_int($data, 'sort_order', 0),
        'image' => hv_str($data, 'image'),
        'sub_tr' => hv_str($data, 'sub_tr'),
        'sub_en' => hv_str($data, 'sub_en'),
        'title_tr' => hv_str($data, 'title_tr'),
        'title_en' => hv_str($data, 'title_en'),
        'desc_tr' => hv_str($data, 'desc_tr'),
        'desc_en' => hv_str($data, 'desc_en'),
        'cta_tr' => hv_str($data, 'cta_tr'),
        'cta_en' => hv_str($data, 'cta_en'),
        'link' => hv_str($data, 'link', '/'),
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_route_hero_slides_public(PDO $pdo): void
{
    $stmt = $pdo->query(
        'SELECT id, sort_order, image, sub_tr, sub_en, title_tr, title_en, desc_tr, desc_en,
                cta_tr, cta_en, link, active, created_at
         FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC LIMIT 20'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_hero_slides_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query(
        'SELECT id, sort_order, image, sub_tr, sub_en, title_tr, title_en, desc_tr, desc_en,
                cta_tr, cta_en, link, active, created_at
         FROM hero_slides ORDER BY sort_order ASC LIMIT 20'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_hero_slide_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_hero_slide_input(Http::body());
    $id = hv_uuid();
    $createdAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO hero_slides (id, sort_order, image, sub_tr, sub_en, title_tr, title_en,
                desc_tr, desc_en, cta_tr, cta_en, link, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['sort_order'], $input['image'], $input['sub_tr'], $input['sub_en'],
        $input['title_tr'], $input['title_en'], $input['desc_tr'], $input['desc_en'],
        $input['cta_tr'], $input['cta_en'], $input['link'], $input['active'] ? 1 : 0, $createdAt,
    ]);
    Http::json($input + ['id' => $id, 'created_at' => $createdAt]);
}

function hv_route_hero_slide_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_hero_slide_input(Http::body());
    $stmt = $pdo->prepare(
        'UPDATE hero_slides SET sort_order=?, image=?, sub_tr=?, sub_en=?, title_tr=?, title_en=?,
                desc_tr=?, desc_en=?, cta_tr=?, cta_en=?, link=?, active=? WHERE id=?'
    );
    $stmt->execute([
        $input['sort_order'], $input['image'], $input['sub_tr'], $input['sub_en'],
        $input['title_tr'], $input['title_en'], $input['desc_tr'], $input['desc_en'],
        $input['cta_tr'], $input['cta_en'], $input['link'], $input['active'] ? 1 : 0, $id,
    ]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'hero_slides', $id)) {
        Http::error(404, 'Slide bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_hero_slide_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM hero_slides WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

function hv_row_exists(PDO $pdo, string $table, string $id): bool
{
    $stmt = $pdo->prepare("SELECT 1 FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    return (bool) $stmt->fetch();
}

// ------------------------------------------------------------------ //
// Categories
// ------------------------------------------------------------------ //
function hv_category_input(array $data): array
{
    return [
        'sort_order' => hv_int($data, 'sort_order', 0),
        'icon' => hv_str($data, 'icon', 'tower'),
        'image' => hv_str($data, 'image'),
        'accent_image' => hv_str($data, 'accent_image'),
        'link' => hv_str($data, 'link', '/'),
        'title_tr' => hv_str($data, 'title_tr'),
        'title_en' => hv_str($data, 'title_en'),
        'sub_tr' => hv_str($data, 'sub_tr'),
        'sub_en' => hv_str($data, 'sub_en'),
        'desc_tr' => hv_str($data, 'desc_tr'),
        'desc_en' => hv_str($data, 'desc_en'),
        'page_title_tr' => hv_str($data, 'page_title_tr'),
        'page_title_en' => hv_str($data, 'page_title_en'),
        'page_desc_tr' => hv_str($data, 'page_desc_tr'),
        'page_desc_en' => hv_str($data, 'page_desc_en'),
        'features_tr' => is_array($data['features_tr'] ?? null) ? $data['features_tr'] : [],
        'features_en' => is_array($data['features_en'] ?? null) ? $data['features_en'] : [],
        'stats' => is_array($data['stats'] ?? null) ? $data['stats'] : [],
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_category_row(array $row): array
{
    $row['active'] = (bool) $row['active'];
    $row['features_tr'] = hv_json_decode_field($row['features_tr']);
    $row['features_en'] = hv_json_decode_field($row['features_en']);
    $row['stats'] = hv_json_decode_field($row['stats']);
    return $row;
}

const HV_CATEGORY_COLUMNS = 'id, sort_order, icon, image, accent_image, link, title_tr, title_en,
    sub_tr, sub_en, desc_tr, desc_en, page_title_tr, page_title_en, page_desc_tr, page_desc_en,
    features_tr, features_en, stats, active, created_at';

function hv_route_categories_public(PDO $pdo): void
{
    $stmt = $pdo->query('SELECT ' . HV_CATEGORY_COLUMNS . ' FROM categories WHERE active = 1 ORDER BY sort_order ASC LIMIT 20');
    Http::json(array_map('hv_category_row', $stmt->fetchAll()));
}

function hv_route_categories_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query('SELECT ' . HV_CATEGORY_COLUMNS . ' FROM categories ORDER BY sort_order ASC LIMIT 20');
    Http::json(array_map('hv_category_row', $stmt->fetchAll()));
}

function hv_route_category_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_category_input(Http::body());
    $id = hv_uuid();
    $createdAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO categories (id, sort_order, icon, image, accent_image, link, title_tr, title_en,
                sub_tr, sub_en, desc_tr, desc_en, page_title_tr, page_title_en, page_desc_tr, page_desc_en,
                features_tr, features_en, stats, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['sort_order'], $input['icon'], $input['image'], $input['accent_image'], $input['link'],
        $input['title_tr'], $input['title_en'], $input['sub_tr'], $input['sub_en'],
        $input['desc_tr'], $input['desc_en'], $input['page_title_tr'], $input['page_title_en'],
        $input['page_desc_tr'], $input['page_desc_en'],
        hv_json_encode_field($input['features_tr']), hv_json_encode_field($input['features_en']),
        hv_json_encode_field($input['stats']), $input['active'] ? 1 : 0, $createdAt,
    ]);
    Http::json($input + ['id' => $id, 'created_at' => $createdAt]);
}

function hv_route_category_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_category_input(Http::body());
    $stmt = $pdo->prepare(
        'UPDATE categories SET sort_order=?, icon=?, image=?, accent_image=?, link=?, title_tr=?, title_en=?,
                sub_tr=?, sub_en=?, desc_tr=?, desc_en=?, page_title_tr=?, page_title_en=?,
                page_desc_tr=?, page_desc_en=?, features_tr=?, features_en=?, stats=?, active=?
         WHERE id=?'
    );
    $stmt->execute([
        $input['sort_order'], $input['icon'], $input['image'], $input['accent_image'], $input['link'],
        $input['title_tr'], $input['title_en'], $input['sub_tr'], $input['sub_en'],
        $input['desc_tr'], $input['desc_en'], $input['page_title_tr'], $input['page_title_en'],
        $input['page_desc_tr'], $input['page_desc_en'],
        hv_json_encode_field($input['features_tr']), hv_json_encode_field($input['features_en']),
        hv_json_encode_field($input['stats']), $input['active'] ? 1 : 0, $id,
    ]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'categories', $id)) {
        Http::error(404, 'Kategori bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_category_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Counters
// ------------------------------------------------------------------ //
function hv_counter_input(array $data): array
{
    return [
        'sort_order' => hv_int($data, 'sort_order', 0),
        'icon' => hv_str($data, 'icon', 'globe'),
        'value' => hv_int($data, 'value', 0),
        'suffix' => hv_str($data, 'suffix', '+'),
        'label_tr' => hv_str($data, 'label_tr'),
        'label_en' => hv_str($data, 'label_en'),
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_route_counters_public(PDO $pdo): void
{
    $stmt = $pdo->query(
        'SELECT id, sort_order, icon, value, suffix, label_tr, label_en, active
         FROM counters WHERE active = 1 ORDER BY sort_order ASC LIMIT 20'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_counters_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query(
        'SELECT id, sort_order, icon, value, suffix, label_tr, label_en, active
         FROM counters ORDER BY sort_order ASC LIMIT 20'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_counter_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_counter_input(Http::body());
    $id = hv_uuid();
    $stmt = $pdo->prepare(
        'INSERT INTO counters (id, sort_order, icon, value, suffix, label_tr, label_en, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['sort_order'], $input['icon'], $input['value'], $input['suffix'],
        $input['label_tr'], $input['label_en'], $input['active'] ? 1 : 0,
    ]);
    Http::json($input + ['id' => $id]);
}

function hv_route_counter_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_counter_input(Http::body());
    $stmt = $pdo->prepare(
        'UPDATE counters SET sort_order=?, icon=?, value=?, suffix=?, label_tr=?, label_en=?, active=? WHERE id=?'
    );
    $stmt->execute([
        $input['sort_order'], $input['icon'], $input['value'], $input['suffix'],
        $input['label_tr'], $input['label_en'], $input['active'] ? 1 : 0, $id,
    ]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'counters', $id)) {
        Http::error(404, 'Sayaç bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_counter_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM counters WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Page Content (i18n sozlugu, key-value)
// ------------------------------------------------------------------ //
function hv_route_content_public(PDO $pdo): void
{
    $section = $_GET['section'] ?? null;
    if ($section !== null && $section !== '') {
        $stmt = $pdo->prepare('SELECT content_key AS `key`, value_tr, value_en FROM page_content WHERE section = ?');
        $stmt->execute([$section]);
    } else {
        $stmt = $pdo->query('SELECT content_key AS `key`, value_tr, value_en FROM page_content');
    }
    $result = [];
    foreach ($stmt->fetchAll() as $row) {
        $result[$row['key']] = ['value_tr' => $row['value_tr'], 'value_en' => $row['value_en']];
    }
    Http::json($result);
}

function hv_route_content_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query('SELECT content_key AS `key`, value_tr, value_en, section, updated_at FROM page_content');
    Http::json($stmt->fetchAll());
}

function hv_route_content_upsert(PDO $pdo, array $config, string $key): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $data = Http::body();
    $valueTr = hv_str($data, 'value_tr');
    $valueEn = hv_str($data, 'value_en');
    $section = hv_str($data, 'section', 'genel');
    $updatedAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO page_content (content_key, value_tr, value_en, section, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), value_en = VALUES(value_en),
                                  section = VALUES(section), updated_at = VALUES(updated_at)'
    );
    $stmt->execute([$key, $valueTr, $valueEn, $section, $updatedAt]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Footer Info (key-value)
// ------------------------------------------------------------------ //
function hv_route_footer_public(PDO $pdo): void
{
    $stmt = $pdo->query('SELECT content_key AS `key`, value_tr, value_en FROM footer_info');
    $result = [];
    foreach ($stmt->fetchAll() as $row) {
        $result[$row['key']] = ['value_tr' => $row['value_tr'], 'value_en' => $row['value_en']];
    }
    Http::json($result);
}

function hv_route_footer_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query('SELECT content_key AS `key`, value_tr, value_en, updated_at FROM footer_info');
    Http::json($stmt->fetchAll());
}

function hv_route_footer_upsert(PDO $pdo, array $config, string $key): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $data = Http::body();
    $valueTr = hv_str($data, 'value_tr');
    $valueEn = hv_str($data, 'value_en');
    $updatedAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO footer_info (content_key, value_tr, value_en, updated_at)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value_tr = VALUES(value_tr), value_en = VALUES(value_en),
                                  updated_at = VALUES(updated_at)'
    );
    $stmt->execute([$key, $valueTr, $valueEn, $updatedAt]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Partners
// ------------------------------------------------------------------ //
function hv_partner_input(array $data): array
{
    return [
        'sort_order' => hv_int($data, 'sort_order', 0),
        'name' => hv_str($data, 'name'),
        'logo' => hv_str($data, 'logo'),
        'link' => hv_str($data, 'link'),
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_route_partners_public(PDO $pdo): void
{
    $stmt = $pdo->query('SELECT id, sort_order, name, logo, link, active FROM partners WHERE active = 1 ORDER BY sort_order ASC LIMIT 50');
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_partners_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query('SELECT id, sort_order, name, logo, link, active FROM partners ORDER BY sort_order ASC LIMIT 50');
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_partner_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_partner_input(Http::body());
    $id = hv_uuid();
    $stmt = $pdo->prepare('INSERT INTO partners (id, sort_order, name, logo, link, active) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$id, $input['sort_order'], $input['name'], $input['logo'], $input['link'], $input['active'] ? 1 : 0]);
    Http::json($input + ['id' => $id]);
}

function hv_route_partner_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_partner_input(Http::body());
    $stmt = $pdo->prepare('UPDATE partners SET sort_order=?, name=?, logo=?, link=?, active=? WHERE id=?');
    $stmt->execute([$input['sort_order'], $input['name'], $input['logo'], $input['link'], $input['active'] ? 1 : 0, $id]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'partners', $id)) {
        Http::error(404, 'Ortak bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_partner_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM partners WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Projects
// ------------------------------------------------------------------ //
function hv_project_input(array $data): array
{
    return [
        'sort_order' => hv_int($data, 'sort_order', 0),
        'image' => hv_str($data, 'image'),
        'images' => is_array($data['images'] ?? null) ? $data['images'] : [],
        'title_tr' => hv_str($data, 'title_tr'),
        'title_en' => hv_str($data, 'title_en'),
        'desc_tr' => hv_str($data, 'desc_tr'),
        'desc_en' => hv_str($data, 'desc_en'),
        'category' => hv_str($data, 'category', 'ges'),
        'country' => hv_str($data, 'country'),
        'year' => isset($data['year']) && $data['year'] !== '' ? (int) $data['year'] : null,
        'status' => hv_str($data, 'status', 'tamamlanan'),
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_project_row(array $row): array
{
    $row['active'] = (bool) $row['active'];
    $row['year'] = $row['year'] !== null ? (int) $row['year'] : null;
    $row['images'] = hv_json_decode_field($row['images']);
    return $row;
}

const HV_PROJECT_COLUMNS = 'id, sort_order, image, images, title_tr, title_en, desc_tr, desc_en,
    category, country, year, status, active, created_at';

function hv_route_projects_public(PDO $pdo): void
{
    $category = $_GET['category'] ?? null;
    if ($category !== null && $category !== '') {
        $stmt = $pdo->prepare('SELECT ' . HV_PROJECT_COLUMNS . ' FROM projects WHERE active = 1 AND category = ? ORDER BY sort_order ASC LIMIT 200');
        $stmt->execute([$category]);
    } else {
        $stmt = $pdo->query('SELECT ' . HV_PROJECT_COLUMNS . ' FROM projects WHERE active = 1 ORDER BY sort_order ASC LIMIT 200');
    }
    Http::json(array_map('hv_project_row', $stmt->fetchAll()));
}

function hv_route_projects_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query('SELECT ' . HV_PROJECT_COLUMNS . ' FROM projects ORDER BY sort_order ASC LIMIT 200');
    Http::json(array_map('hv_project_row', $stmt->fetchAll()));
}

function hv_route_project_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_project_input(Http::body());
    $id = hv_uuid();
    $createdAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO projects (id, sort_order, image, images, title_tr, title_en, desc_tr, desc_en,
                category, country, year, status, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['sort_order'], $input['image'], hv_json_encode_field($input['images']),
        $input['title_tr'], $input['title_en'], $input['desc_tr'], $input['desc_en'],
        $input['category'], $input['country'], $input['year'], $input['status'],
        $input['active'] ? 1 : 0, $createdAt,
    ]);
    Http::json($input + ['id' => $id, 'created_at' => $createdAt]);
}

function hv_route_project_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_project_input(Http::body());
    $stmt = $pdo->prepare(
        'UPDATE projects SET sort_order=?, image=?, images=?, title_tr=?, title_en=?, desc_tr=?, desc_en=?,
                category=?, country=?, year=?, status=?, active=? WHERE id=?'
    );
    $stmt->execute([
        $input['sort_order'], $input['image'], hv_json_encode_field($input['images']),
        $input['title_tr'], $input['title_en'], $input['desc_tr'], $input['desc_en'],
        $input['category'], $input['country'], $input['year'], $input['status'],
        $input['active'] ? 1 : 0, $id,
    ]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'projects', $id)) {
        Http::error(404, 'Proje bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_project_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM projects WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Career Posts (ilanlar)
// ------------------------------------------------------------------ //
function hv_career_post_input(array $data): array
{
    return [
        'title_tr' => hv_str($data, 'title_tr'),
        'title_en' => hv_str($data, 'title_en'),
        'location' => hv_str($data, 'location', 'İzmir'),
        'type' => hv_str($data, 'type', 'tam-zamanlı'),
        'desc_tr' => hv_str($data, 'desc_tr'),
        'desc_en' => hv_str($data, 'desc_en'),
        'active' => array_key_exists('active', $data) ? (bool) $data['active'] : true,
    ];
}

function hv_route_career_posts_public(PDO $pdo): void
{
    $stmt = $pdo->query(
        'SELECT id, title_tr, title_en, location, type, desc_tr, desc_en, active, created_at
         FROM career_posts WHERE active = 1 ORDER BY created_at DESC LIMIT 50'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_career_posts_admin_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query(
        'SELECT id, title_tr, title_en, location, type, desc_tr, desc_en, active, created_at
         FROM career_posts ORDER BY created_at DESC LIMIT 50'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['active'] = (bool) $row['active']; }
    Http::json($rows);
}

function hv_route_career_post_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_career_post_input(Http::body());
    $id = hv_uuid();
    $createdAt = hv_now();
    $stmt = $pdo->prepare(
        'INSERT INTO career_posts (id, title_tr, title_en, location, type, desc_tr, desc_en, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['title_tr'], $input['title_en'], $input['location'], $input['type'],
        $input['desc_tr'], $input['desc_en'], $input['active'] ? 1 : 0, $createdAt,
    ]);
    Http::json($input + ['id' => $id, 'created_at' => $createdAt]);
}

function hv_route_career_post_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_career_post_input(Http::body());
    $stmt = $pdo->prepare(
        'UPDATE career_posts SET title_tr=?, title_en=?, location=?, type=?, desc_tr=?, desc_en=?, active=? WHERE id=?'
    );
    $stmt->execute([
        $input['title_tr'], $input['title_en'], $input['location'], $input['type'],
        $input['desc_tr'], $input['desc_en'], $input['active'] ? 1 : 0, $id,
    ]);
    if ($stmt->rowCount() === 0 && !hv_row_exists($pdo, 'career_posts', $id)) {
        Http::error(404, 'İlan bulunamadı');
    }
    Http::json(['ok' => true]);
}

function hv_route_career_post_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $pdo->prepare('DELETE FROM career_posts WHERE id = ?')->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Genel gorsel yukleme (admin panelindeki tum resim alanlari icin)
// ------------------------------------------------------------------ //
const HV_ALLOWED_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
const HV_MAX_IMAGE_MB = 10;

function hv_route_admin_upload(PDO $pdo, array $config, Cloudinary $cloudinary): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);

    if (!$cloudinary->enabled()) {
        Http::error(503, 'Cloudinary yapılandırılmamış.');
    }
    if (!isset($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
        Http::error(422, 'Dosya gerekli');
    }
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        Http::error(422, 'Dosya yüklenemedi');
    }

    $filename = $_FILES['file']['name'];
    $ext = strtolower((string) pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($ext, HV_ALLOWED_IMAGE_EXT, true)) {
        Http::error(422, 'Desteklenmeyen dosya türü.');
    }

    $data = file_get_contents($_FILES['file']['tmp_name']);
    if ($data === false || strlen($data) > HV_MAX_IMAGE_MB * 1024 * 1024) {
        Http::error(422, "Dosya " . HV_MAX_IMAGE_MB . " MB'dan büyük olamaz.");
    }

    $upload = $cloudinary->uploadImage($data, $filename);
    if (!$upload['ok']) {
        Http::error(502, 'Görsel yüklenemedi.');
    }

    Http::json(['url' => $upload['secure_url'], 'public_id' => $upload['public_id']]);
}
