<?php
declare(strict_types=1);

/**
 * HV Elektrik API - route tablosu ve handler'lar.
 * Orijinal backend/server.py (FastAPI) ile birebir ayni endpoint'ler, ayni JSON sekilleri.
 */

function hv_uuid(): string
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function hv_now(): string
{
    $dt = new DateTime('now', new DateTimeZone('UTC'));
    return $dt->format('Y-m-d\TH:i:s.u\+00:00');
}

// Yaniti hemen istemciye gonderip aciklamayi (ornegin mail gonderimi) arka planda
// bitirmeye calisir. PHP-FPM'de calisir; calismazsa istek biraz daha uzun surer, hata olmaz.
function hv_finish_response_and_continue(): void
{
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    }
}

function hv_dispatch(PDO $pdo, array $config): void
{
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
    $path = rtrim($path, '/');
    if ($path === '') {
        $path = '/';
    }

    $resend = new Resend($config['resend_api_key'], $config['sender_email'], $config['notify_email']);
    $cloudinary = new Cloudinary($config['cloudinary_cloud_name'], $config['cloudinary_api_key'], $config['cloudinary_api_secret']);

    $routes = [
        ['GET', '#^/api$#', fn() => hv_route_root($config, $cloudinary)],
        ['POST', '#^/api/auth/login$#', fn() => hv_route_login($pdo, $config)],
        ['GET', '#^/api/auth/me$#', fn() => hv_route_me($pdo, $config)],
        ['POST', '#^/api/auth/logout$#', fn() => hv_route_logout()],

        ['POST', '#^/api/contact$#', fn() => hv_route_contact_submit($pdo, $resend)],
        ['GET', '#^/api/admin/messages$#', fn() => hv_route_messages_list($pdo, $config)],
        ['PATCH', '#^/api/admin/messages/(?P<id>[^/]+)/read$#', fn($p) => hv_route_message_mark_read($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/messages/(?P<id>[^/]+)$#', fn($p) => hv_route_message_delete($pdo, $config, $p['id'])],

        ['POST', '#^/api/career$#', fn() => hv_route_career_submit($pdo, $resend, $cloudinary)],
        ['GET', '#^/api/admin/careers$#', fn() => hv_route_careers_list($pdo, $config)],
        ['PATCH', '#^/api/admin/careers/(?P<id>[^/]+)/read$#', fn($p) => hv_route_career_mark_read($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/careers/(?P<id>[^/]+)$#', fn($p) => hv_route_career_delete($pdo, $config, $cloudinary, $p['id'])],

        ['GET', '#^/api/news$#', fn() => hv_route_news_list($pdo)],
        ['GET', '#^/api/news/(?P<id>[^/]+)$#', fn($p) => hv_route_news_get($pdo, $p['id'])],
        ['POST', '#^/api/admin/news$#', fn() => hv_route_news_create($pdo, $config)],
        ['PUT', '#^/api/admin/news/(?P<id>[^/]+)$#', fn($p) => hv_route_news_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/news/(?P<id>[^/]+)$#', fn($p) => hv_route_news_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/hero-slides$#', fn() => hv_route_hero_slides_public($pdo)],
        ['GET', '#^/api/admin/hero-slides$#', fn() => hv_route_hero_slides_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/hero-slides$#', fn() => hv_route_hero_slide_create($pdo, $config)],
        ['PUT', '#^/api/admin/hero-slides/(?P<id>[^/]+)$#', fn($p) => hv_route_hero_slide_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/hero-slides/(?P<id>[^/]+)$#', fn($p) => hv_route_hero_slide_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/categories$#', fn() => hv_route_categories_public($pdo)],
        ['GET', '#^/api/admin/categories$#', fn() => hv_route_categories_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/categories$#', fn() => hv_route_category_create($pdo, $config)],
        ['PUT', '#^/api/admin/categories/(?P<id>[^/]+)$#', fn($p) => hv_route_category_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/categories/(?P<id>[^/]+)$#', fn($p) => hv_route_category_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/counters$#', fn() => hv_route_counters_public($pdo)],
        ['GET', '#^/api/admin/counters$#', fn() => hv_route_counters_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/counters$#', fn() => hv_route_counter_create($pdo, $config)],
        ['PUT', '#^/api/admin/counters/(?P<id>[^/]+)$#', fn($p) => hv_route_counter_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/counters/(?P<id>[^/]+)$#', fn($p) => hv_route_counter_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/content$#', fn() => hv_route_content_public($pdo)],
        ['GET', '#^/api/admin/content$#', fn() => hv_route_content_admin_list($pdo, $config)],
        ['PUT', '#^/api/admin/content/(?P<key>[^/]+)$#', fn($p) => hv_route_content_upsert($pdo, $config, $p['key'])],

        ['GET', '#^/api/footer$#', fn() => hv_route_footer_public($pdo)],
        ['GET', '#^/api/admin/footer$#', fn() => hv_route_footer_admin_list($pdo, $config)],
        ['PUT', '#^/api/admin/footer/(?P<key>[^/]+)$#', fn($p) => hv_route_footer_upsert($pdo, $config, $p['key'])],

        ['GET', '#^/api/partners$#', fn() => hv_route_partners_public($pdo)],
        ['GET', '#^/api/admin/partners$#', fn() => hv_route_partners_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/partners$#', fn() => hv_route_partner_create($pdo, $config)],
        ['PUT', '#^/api/admin/partners/(?P<id>[^/]+)$#', fn($p) => hv_route_partner_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/partners/(?P<id>[^/]+)$#', fn($p) => hv_route_partner_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/projects$#', fn() => hv_route_projects_public($pdo)],
        ['GET', '#^/api/admin/projects$#', fn() => hv_route_projects_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/projects$#', fn() => hv_route_project_create($pdo, $config)],
        ['PUT', '#^/api/admin/projects/(?P<id>[^/]+)$#', fn($p) => hv_route_project_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/projects/(?P<id>[^/]+)$#', fn($p) => hv_route_project_delete($pdo, $config, $p['id'])],

        ['GET', '#^/api/career-posts$#', fn() => hv_route_career_posts_public($pdo)],
        ['GET', '#^/api/admin/career-posts$#', fn() => hv_route_career_posts_admin_list($pdo, $config)],
        ['POST', '#^/api/admin/career-posts$#', fn() => hv_route_career_post_create($pdo, $config)],
        ['PUT', '#^/api/admin/career-posts/(?P<id>[^/]+)$#', fn($p) => hv_route_career_post_update($pdo, $config, $p['id'])],
        ['DELETE', '#^/api/admin/career-posts/(?P<id>[^/]+)$#', fn($p) => hv_route_career_post_delete($pdo, $config, $p['id'])],

        ['POST', '#^/api/admin/upload$#', fn() => hv_route_admin_upload($pdo, $config, $cloudinary)],
    ];

    foreach ($routes as [$routeMethod, $pattern, $handler]) {
        if ($routeMethod !== $method) {
            continue;
        }
        if (preg_match($pattern, $path, $matches)) {
            $params = array_filter($matches, fn($k) => is_string($k), ARRAY_FILTER_USE_KEY);
            $handler($params);
            return;
        }
    }

    Http::error(404, 'Not Found');
}

// ------------------------------------------------------------------ //
// Health
// ------------------------------------------------------------------ //
function hv_route_root(array $config, Cloudinary $cloudinary): void
{
    Http::json([
        'service' => 'HV Elektrik API',
        'ok' => true,
        'email_enabled' => $config['resend_api_key'] !== '',
        'cloudinary_enabled' => $cloudinary->enabled(),
    ]);
}

// ------------------------------------------------------------------ //
// Auth
// ------------------------------------------------------------------ //
function hv_route_login(PDO $pdo, array $config): void
{
    $data = Http::body();
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $password = (string) ($data['password'] ?? '');

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        Http::error(422, 'Geçersiz istek');
    }

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
        Http::error(401, 'Geçersiz e-posta veya şifre');
    }
    if ($user['role'] !== 'admin') {
        Http::error(403, 'Yetkiniz yok');
    }

    $token = Auth::createAccessToken((string) $user['id'], $email, $config['jwt_secret']);

    setcookie('access_token', $token, [
        'expires' => time() + 8 * 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);

    Http::json([
        'id' => (string) $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'name' => $user['name'] ?: 'Admin',
        'token' => $token,
    ]);
}

function hv_route_me(PDO $pdo, array $config): void
{
    $user = Auth::requireAdmin($pdo, $config['jwt_secret']);
    Http::json($user);
}

function hv_route_logout(): void
{
    setcookie('access_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Contact
// ------------------------------------------------------------------ //
function hv_route_contact_submit(PDO $pdo, Resend $resend): void
{
    $data = Http::body();
    $name = trim((string) ($data['name'] ?? ''));
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $phone = trim((string) ($data['phone'] ?? ''));
    $subject = trim((string) ($data['subject'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        Http::error(422, 'Ad Soyad geçersiz');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Http::error(422, 'E-posta geçersiz');
    }
    if (mb_strlen($subject) < 2 || mb_strlen($subject) > 200) {
        Http::error(422, 'Konu geçersiz');
    }
    if (mb_strlen($message) < 5 || mb_strlen($message) > 5000) {
        Http::error(422, 'Mesaj geçersiz');
    }

    $id = hv_uuid();
    $createdAt = hv_now();

    $stmt = $pdo->prepare(
        'INSERT INTO messages (id, name, email, phone, subject, message, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)'
    );
    $stmt->execute([$id, $name, $email, $phone, $subject, $message, $createdAt]);

    Http::respondJson(['ok' => true, 'id' => $id]);
    hv_finish_response_and_continue();

    $resend->send(
        "[HV Elektrik] Yeni iletişim mesajı — $subject",
        hv_contact_email_html($name, $email, $phone, $subject, $message)
    );
    exit;
}

function hv_route_messages_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query(
        'SELECT id, name, email, phone, subject, message, is_read AS `read`, created_at
         FROM messages ORDER BY created_at DESC LIMIT 1000'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['read'] = (bool) $row['read'];
    }
    Http::json($rows);
}

function hv_route_message_mark_read(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->prepare('UPDATE messages SET is_read = 1 WHERE id = ?');
    $stmt->execute([$id]);
    Http::json(['ok' => true]);
}

function hv_route_message_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->prepare('DELETE FROM messages WHERE id = ?');
    $stmt->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// Career
// ------------------------------------------------------------------ //
const HV_ALLOWED_CV_EXT = ['pdf', 'doc', 'docx'];
const HV_MAX_CV_MB = 10;

function hv_route_career_submit(PDO $pdo, Resend $resend, Cloudinary $cloudinary): void
{
    $name = trim((string) ($_POST['name'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $phone = trim((string) ($_POST['phone'] ?? ''));
    $position = trim((string) ($_POST['position'] ?? ''));
    $message = trim((string) ($_POST['message'] ?? ''));

    if (mb_strlen($name) < 2) {
        Http::error(422, 'Ad Soyad geçersiz');
    }
    if (!str_contains($email, '@')) {
        Http::error(422, 'E-posta geçersiz');
    }
    if (mb_strlen($position) < 2) {
        Http::error(422, 'Pozisyon geçersiz');
    }

    if (!isset($_FILES['cv']) || $_FILES['cv']['error'] === UPLOAD_ERR_NO_FILE) {
        Http::error(422, 'CV dosyası gerekli');
    }
    if ($_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
        Http::error(422, 'CV yüklenemedi');
    }

    $filename = $_FILES['cv']['name'];
    $ext = strtolower((string) pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($ext, HV_ALLOWED_CV_EXT, true)) {
        Http::error(422, 'Sadece PDF, DOC ve DOCX kabul edilir');
    }

    $data = file_get_contents($_FILES['cv']['tmp_name']);
    if ($data === false || strlen($data) > HV_MAX_CV_MB * 1024 * 1024) {
        Http::error(422, 'Dosya ' . HV_MAX_CV_MB . " MB'dan büyük olamaz");
    }

    if (!$cloudinary->enabled()) {
        Http::error(503, 'CV yükleme servisi yapılandırılmamış (Cloudinary anahtarları eksik).');
    }

    $stem = pathinfo($filename, PATHINFO_FILENAME);
    $safeStem = preg_replace('/[^A-Za-z0-9\-_]/', '', $stem);
    $safeStem = substr($safeStem !== '' ? $safeStem : 'cv', 0, 60);
    $publicId = 'hv-careers/' . bin2hex(random_bytes(16)) . '_' . $safeStem;

    $upload = $cloudinary->uploadRaw($data, $publicId, $filename);
    if (!$upload['ok']) {
        Http::error(502, 'CV yüklenemedi, tekrar deneyin.');
    }

    $id = hv_uuid();
    $createdAt = hv_now();
    $cvUrl = $upload['secure_url'];

    $stmt = $pdo->prepare(
        'INSERT INTO careers (id, name, email, phone, position, message, cv_url, cv_public_id, cv_filename, cv_size, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)'
    );
    $stmt->execute([
        $id, $name, strtolower($email), $phone, $position, $message,
        $cvUrl, $upload['public_id'], $filename, strlen($data), $createdAt,
    ]);

    Http::respondJson(['ok' => true, 'id' => $id]);
    hv_finish_response_and_continue();

    $resend->send(
        "[HV Elektrik] Yeni başvuru — $position · $name",
        hv_career_email_html($name, $email, $phone, $position, $message, $cvUrl)
    );
    exit;
}

function hv_route_careers_list(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->query(
        'SELECT id, name, email, phone, position, message, cv_url, cv_public_id, cv_filename, cv_size,
                is_read AS `read`, created_at
         FROM careers ORDER BY created_at DESC LIMIT 1000'
    );
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['read'] = (bool) $row['read'];
        $row['cv_size'] = $row['cv_size'] !== null ? (int) $row['cv_size'] : null;
    }
    Http::json($rows);
}

function hv_route_career_mark_read(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->prepare('UPDATE careers SET is_read = 1 WHERE id = ?');
    $stmt->execute([$id]);
    Http::json(['ok' => true]);
}

function hv_route_career_delete(PDO $pdo, array $config, Cloudinary $cloudinary, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);

    $stmt = $pdo->prepare('SELECT cv_public_id FROM careers WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        Http::error(404, 'Bulunamadı');
    }

    if (!empty($row['cv_public_id']) && $cloudinary->enabled()) {
        $cloudinary->destroyRaw($row['cv_public_id']);
    }

    $del = $pdo->prepare('DELETE FROM careers WHERE id = ?');
    $del->execute([$id]);
    Http::json(['ok' => true]);
}

// ------------------------------------------------------------------ //
// News
// ------------------------------------------------------------------ //
function hv_route_news_list(PDO $pdo): void
{
    $publishedParam = $_GET['published'] ?? 'true';
    $onlyPublished = !in_array(strtolower((string) $publishedParam), ['false', '0'], true);

    if ($onlyPublished) {
        $stmt = $pdo->prepare(
            'SELECT id, title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, image,
                    news_date AS date, published, created_at
             FROM news WHERE published = 1 ORDER BY news_date DESC LIMIT 500'
        );
        $stmt->execute();
    } else {
        $stmt = $pdo->query(
            'SELECT id, title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, image,
                    news_date AS date, published, created_at
             FROM news ORDER BY news_date DESC LIMIT 500'
        );
    }
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['published'] = (bool) $row['published'];
    }
    Http::json($rows);
}

function hv_route_news_get(PDO $pdo, string $id): void
{
    $stmt = $pdo->prepare(
        'SELECT id, title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, image,
                news_date AS date, published, created_at
         FROM news WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        Http::error(404, 'Haber bulunamadı');
    }
    $row['published'] = (bool) $row['published'];
    Http::json($row);
}

function hv_news_input_from_body(array $data): array
{
    $required = ['title_tr', 'title_en', 'excerpt_tr', 'excerpt_en', 'content_tr', 'content_en', 'image', 'date'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            Http::error(422, "Alan eksik: $field");
        }
    }
    $date = (string) $data['date'];
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        Http::error(422, 'Geçersiz tarih formatı (YYYY-MM-DD)');
    }
    return [
        'title_tr' => (string) $data['title_tr'],
        'title_en' => (string) $data['title_en'],
        'excerpt_tr' => (string) $data['excerpt_tr'],
        'excerpt_en' => (string) $data['excerpt_en'],
        'content_tr' => (string) $data['content_tr'],
        'content_en' => (string) $data['content_en'],
        'image' => (string) $data['image'],
        'date' => $date,
        'published' => array_key_exists('published', $data) ? (bool) $data['published'] : true,
    ];
}

function hv_route_news_create(PDO $pdo, array $config): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_news_input_from_body(Http::body());

    $id = hv_uuid();
    $createdAt = hv_now();

    $stmt = $pdo->prepare(
        'INSERT INTO news (id, title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, image, news_date, published, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id, $input['title_tr'], $input['title_en'], $input['excerpt_tr'], $input['excerpt_en'],
        $input['content_tr'], $input['content_en'], $input['image'], $input['date'],
        $input['published'] ? 1 : 0, $createdAt,
    ]);

    Http::json($input + ['id' => $id, 'created_at' => $createdAt]);
}

function hv_route_news_update(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $input = hv_news_input_from_body(Http::body());

    $stmt = $pdo->prepare(
        'UPDATE news SET title_tr=?, title_en=?, excerpt_tr=?, excerpt_en=?, content_tr=?, content_en=?,
                          image=?, news_date=?, published=?
         WHERE id=?'
    );
    $stmt->execute([
        $input['title_tr'], $input['title_en'], $input['excerpt_tr'], $input['excerpt_en'],
        $input['content_tr'], $input['content_en'], $input['image'], $input['date'],
        $input['published'] ? 1 : 0, $id,
    ]);

    if ($stmt->rowCount() === 0) {
        $check = $pdo->prepare('SELECT 1 FROM news WHERE id = ?');
        $check->execute([$id]);
        if (!$check->fetch()) {
            Http::error(404, 'Haber bulunamadı');
        }
    }

    Http::json(['ok' => true]);
}

function hv_route_news_delete(PDO $pdo, array $config, string $id): void
{
    Auth::requireAdmin($pdo, $config['jwt_secret']);
    $stmt = $pdo->prepare('DELETE FROM news WHERE id = ?');
    $stmt->execute([$id]);
    Http::json(['ok' => true]);
}
