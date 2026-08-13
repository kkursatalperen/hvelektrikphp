<?php
declare(strict_types=1);

final class Http
{
    public static function json(mixed $data, int $status = 200): never
    {
        self::respondJson($data, $status);
        exit;
    }

    // exit etmeyen varyant: yanit gonderildikten sonra arka planda is (mail gonderimi gibi)
    // yapmak isteyen handler'lar icin kullanilir.
    public static function respondJson(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    // FastAPI'nin HTTPException'i {"detail": "..."} govdesiyle doner; frontend bu alani okuyor.
    public static function error(int $status, string $detail): never
    {
        self::json(['detail' => $detail], $status);
    }

    public static function body(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === '' || $raw === false) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    // Starlette'in CORSMiddleware'i allow_credentials=True oldugunda allow_origins=["*"]
    // olsa bile literal "*" donmez (spec bunu yasakliyor); istegin Origin header'ini
    // aynen yansitir. Ayni davranisi burada birebir uyguluyoruz.
    public static function applyCors(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin !== '') {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            $reqMethod = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ?? '*';
            $reqHeaders = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '*';
            header("Access-Control-Allow-Methods: $reqMethod");
            header("Access-Control-Allow-Headers: $reqHeaders");
            http_response_code(204);
            exit;
        }
    }
}
