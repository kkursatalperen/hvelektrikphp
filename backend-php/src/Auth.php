<?php
declare(strict_types=1);

final class Auth
{
    public static function hashPassword(string $plain): string
    {
        return password_hash($plain, PASSWORD_BCRYPT);
    }

    public static function verifyPassword(string $plain, string $hash): bool
    {
        return password_verify($plain, $hash);
    }

    public static function createAccessToken(string $userId, string $email, string $secret): string
    {
        $payload = [
            'sub' => $userId,
            'email' => $email,
            'exp' => time() + 8 * 3600,
            'type' => 'access',
        ];
        return Jwt::encode($payload, $secret);
    }

    private static function tokenFromRequest(): ?string
    {
        if (!empty($_COOKIE['access_token'])) {
            return $_COOKIE['access_token'];
        }
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (stripos($auth, 'Bearer ') === 0) {
            return substr($auth, 7);
        }
        return null;
    }

    // FastAPI'deki get_current_admin() ile ayni davranis: token yoksa/gecersizse 401,
    // kullanici admin degilse 401 "Not authorized".
    public static function requireAdmin(PDO $pdo, string $secret): array
    {
        $token = self::tokenFromRequest();
        if ($token === null) {
            Http::error(401, 'Not authenticated');
        }

        $decoded = Jwt::decode($token, $secret);
        if (!$decoded['ok']) {
            Http::error(401, $decoded['error'] === 'expired' ? 'Token expired' : 'Invalid token');
        }

        $userId = $decoded['payload']['sub'] ?? null;
        if ($userId === null) {
            Http::error(401, 'Invalid token');
        }

        $stmt = $pdo->prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || $user['role'] !== 'admin') {
            Http::error(401, 'Not authorized');
        }

        return $user;
    }
}
