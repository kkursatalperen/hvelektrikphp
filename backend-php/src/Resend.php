<?php
declare(strict_types=1);

final class Resend
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $senderEmail,
        private readonly string $notifyEmail,
    ) {
    }

    // RESEND_API_KEY bos ise sessizce atlar (orijinal Python davranisiyla ayni: hic hata firlatmaz).
    public function send(string $subject, string $html, ?string $to = null): void
    {
        if ($this->apiKey === '') {
            return;
        }

        $payload = json_encode([
            'from' => $this->senderEmail,
            'to' => [$to ?: $this->notifyEmail],
            'subject' => $subject,
            'html' => $html,
        ], JSON_UNESCAPED_UNICODE);

        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        curl_exec($ch);
        curl_close($ch);
    }
}

function hv_email_row(string $label, string $value): string
{
    $safeValue = $value !== '' ? $value : '-';
    return '<tr><td style="padding:8px 12px;background:#f7f7f9;color:#666;'
        . 'font-size:12px;letter-spacing:1px;text-transform:uppercase;width:130px;">'
        . $label . '</td>'
        . '<td style="padding:8px 12px;color:#1a1e2e;font-size:14px;">' . $safeValue . '</td></tr>';
}

function hv_contact_email_html(string $name, string $email, string $phone, string $subject, string $message): string
{
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES));
    $safeEmail = htmlspecialchars($email, ENT_QUOTES);
    return '
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;">
      <div style="background:#1a1e2e;color:#fff;padding:20px 24px;">
        <div style="font-size:22px;font-weight:900;">HV <span style="color:#E30613;font-weight:300;font-style:italic;">Elektrik</span></div>
        <div style="font-size:11px;letter-spacing:2px;color:#bbb;margin-top:4px;">YENİ İLETİŞİM MESAJI</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ' . hv_email_row('Ad Soyad', htmlspecialchars($name, ENT_QUOTES)) . '
        ' . hv_email_row('E-posta', '<a href="mailto:' . $safeEmail . '" style="color:#E30613;">' . $safeEmail . '</a>') . '
        ' . hv_email_row('Telefon', htmlspecialchars($phone, ENT_QUOTES)) . '
        ' . hv_email_row('Konu', htmlspecialchars($subject, ENT_QUOTES)) . '
      </table>
      <div style="padding:16px 24px;border-top:4px solid #E30613;background:#fafafa;color:#333;font-size:14px;line-height:1.6;">
        ' . $safeMessage . '
      </div>
      <div style="padding:12px 24px;color:#999;font-size:11px;background:#f7f7f9;">
        hvelektrik.com.tr · Otomatik bildirim
      </div>
    </div>';
}

function hv_career_email_html(string $name, string $email, string $phone, string $position, string $message, string $cvUrl): string
{
    $safeMessage = $message !== '' ? nl2br(htmlspecialchars($message, ENT_QUOTES)) : '<em style="color:#999;">(mesaj yok)</em>';
    $safeEmail = htmlspecialchars($email, ENT_QUOTES);
    $safeCvUrl = htmlspecialchars($cvUrl, ENT_QUOTES);
    return '
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;">
      <div style="background:#1a1e2e;color:#fff;padding:20px 24px;">
        <div style="font-size:22px;font-weight:900;">HV <span style="color:#E30613;font-weight:300;font-style:italic;">Elektrik</span></div>
        <div style="font-size:11px;letter-spacing:2px;color:#bbb;margin-top:4px;">YENİ KARİYER BAŞVURUSU</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ' . hv_email_row('Ad Soyad', htmlspecialchars($name, ENT_QUOTES)) . '
        ' . hv_email_row('E-posta', '<a href="mailto:' . $safeEmail . '" style="color:#E30613;">' . $safeEmail . '</a>') . '
        ' . hv_email_row('Telefon', htmlspecialchars($phone, ENT_QUOTES)) . '
        ' . hv_email_row('Pozisyon', htmlspecialchars($position, ENT_QUOTES)) . '
        ' . hv_email_row('CV', '<a href="' . $safeCvUrl . '" style="color:#E30613;">CV indir/görüntüle</a>') . '
      </table>
      <div style="padding:16px 24px;border-top:4px solid #E30613;background:#fafafa;color:#333;font-size:14px;line-height:1.6;">
        ' . $safeMessage . '
      </div>
      <div style="padding:12px 24px;color:#999;font-size:11px;background:#f7f7f9;">
        hvelektrik.com.tr · Otomatik bildirim
      </div>
    </div>';
}
