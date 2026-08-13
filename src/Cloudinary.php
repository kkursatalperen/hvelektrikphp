<?php
declare(strict_types=1);

final class Cloudinary
{
    public function __construct(
        private readonly string $cloudName,
        private readonly string $apiKey,
        private readonly string $apiSecret,
    ) {
    }

    public function enabled(): bool
    {
        return $this->cloudName !== '' && $this->apiKey !== '' && $this->apiSecret !== '';
    }

    private function sign(array $params): string
    {
        ksort($params);
        $pairs = [];
        foreach ($params as $key => $value) {
            $pairs[] = "$key=$value";
        }
        $toSign = implode('&', $pairs) . $this->apiSecret;
        return sha1($toSign);
    }

    /**
     * Ham (raw) dosyayi Cloudinary'e yukler. cv gibi dokuman dosyalari icin resource_type=raw kullanilir
     * (orijinal Python kodundaki cloudinary.uploader.upload(..., resource_type="raw", ...) ile ayni).
     *
     * @return array{ok: bool, secure_url?: string, public_id?: string, error?: string}
     */
    public function uploadRaw(string $binaryData, string $publicId, string $originalFilename): array
    {
        $timestamp = (string) time();
        $signParams = [
            'filename_override' => $originalFilename,
            'overwrite' => 'false',
            'public_id' => $publicId,
            'timestamp' => $timestamp,
            'unique_filename' => 'false',
            'use_filename' => 'false',
        ];
        $signature = $this->sign($signParams);

        $tmpFile = tempnam(sys_get_temp_dir(), 'hvcv');
        file_put_contents($tmpFile, $binaryData);

        $fields = $signParams + [
            'api_key' => $this->apiKey,
            'signature' => $signature,
            'file' => new CURLFile($tmpFile, 'application/octet-stream', $originalFilename),
        ];

        $ch = curl_init("https://api.cloudinary.com/v1_1/{$this->cloudName}/raw/upload");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        @unlink($tmpFile);

        if ($response === false || $curlError !== '') {
            return ['ok' => false, 'error' => $curlError ?: 'cURL error'];
        }

        $decoded = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300 && is_array($decoded) && isset($decoded['secure_url'])) {
            return ['ok' => true, 'secure_url' => $decoded['secure_url'], 'public_id' => $decoded['public_id'] ?? $publicId];
        }

        return ['ok' => false, 'error' => is_array($decoded) ? ($decoded['error']['message'] ?? 'upload failed') : 'upload failed'];
    }

    /**
     * Genel gorsel yukleme (admin panelindeki hero/kategori/proje/partner gorselleri icin).
     * Orijinal Python'daki cloudinary.uploader.upload(data, folder="hv-media", resource_type="image") ile ayni.
     *
     * @return array{ok: bool, secure_url?: string, public_id?: string, error?: string}
     */
    public function uploadImage(string $binaryData, string $originalFilename): array
    {
        $timestamp = (string) time();
        $signParams = [
            'folder' => 'hv-media',
            'timestamp' => $timestamp,
        ];
        $signature = $this->sign($signParams);

        $tmpFile = tempnam(sys_get_temp_dir(), 'hvimg');
        file_put_contents($tmpFile, $binaryData);

        $fields = $signParams + [
            'api_key' => $this->apiKey,
            'signature' => $signature,
            'file' => new CURLFile($tmpFile, 'application/octet-stream', $originalFilename),
        ];

        $ch = curl_init("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        @unlink($tmpFile);

        if ($response === false || $curlError !== '') {
            return ['ok' => false, 'error' => $curlError ?: 'cURL error'];
        }

        $decoded = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300 && is_array($decoded) && isset($decoded['secure_url'])) {
            return ['ok' => true, 'secure_url' => $decoded['secure_url'], 'public_id' => $decoded['public_id'] ?? ''];
        }

        return ['ok' => false, 'error' => is_array($decoded) ? ($decoded['error']['message'] ?? 'upload failed') : 'upload failed'];
    }

    public function destroyRaw(string $publicId): bool
    {
        $timestamp = (string) time();
        $signParams = [
            'invalidate' => 'true',
            'public_id' => $publicId,
            'timestamp' => $timestamp,
        ];
        $signature = $this->sign($signParams);

        $fields = $signParams + [
            'api_key' => $this->apiKey,
            'signature' => $signature,
        ];

        $ch = curl_init("https://api.cloudinary.com/v1_1/{$this->cloudName}/raw/destroy");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($fields),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $response !== false && $httpCode >= 200 && $httpCode < 300;
    }
}
