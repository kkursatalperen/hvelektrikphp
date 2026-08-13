<?php
declare(strict_types=1);

// Bagimliliksiz, sade HS256 JWT encode/decode. Orijinal Python backend'de
// PyJWT ile ayni algoritmayi (HS256) ve ayni payload sekliyle (sub, email, exp, type) uretir.
final class Jwt
{
    public static function encode(array $payload, string $secret): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $segments = [
            self::b64url(json_encode($header, JSON_UNESCAPED_SLASHES)),
            self::b64url(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];
        $signingInput = implode('.', $segments);
        $signature = hash_hmac('sha256', $signingInput, $secret, true);
        $segments[] = self::b64url($signature);
        return implode('.', $segments);
    }

    /**
     * @return array{ok: bool, payload?: array, error?: string}
     */
    public static function decode(string $token, string $secret): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return ['ok' => false, 'error' => 'invalid'];
        }
        [$headerB64, $payloadB64, $sigB64] = $parts;

        $expectedSig = hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true);
        $actualSig = self::b64urlDecode($sigB64);
        if ($actualSig === false || !hash_equals($expectedSig, $actualSig)) {
            return ['ok' => false, 'error' => 'invalid'];
        }

        $payloadJson = self::b64urlDecode($payloadB64);
        if ($payloadJson === false) {
            return ['ok' => false, 'error' => 'invalid'];
        }
        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) {
            return ['ok' => false, 'error' => 'invalid'];
        }

        if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
            return ['ok' => false, 'error' => 'expired'];
        }

        return ['ok' => true, 'payload' => $payload];
    }

    private static function b64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64urlDecode(string $data): string|false
    {
        $padded = str_pad($data, strlen($data) + (4 - strlen($data) % 4) % 4, '=');
        return base64_decode(strtr($padded, '-_', '+/'), true);
    }
}
