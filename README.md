# HV Elektrik — PHP Backend

`backend/` (FastAPI + Python + MongoDB) klasörünün paylaşımlı hosting'te çalışan birebir
karşılığı. Aynı API sözleşmesi (aynı endpoint'ler, aynı JSON alan adları, aynı hata
mesajları) korunarak yeniden yazıldı — **frontend'de (React) hiçbir kod değişikliği
gerekmiyor**, sadece `REACT_APP_BACKEND_URL` yeni adrese güncellenecek.

Yerel bir PHP 8.2 ortamında gerçek MySQL şemasına ve gerçek Cloudinary hesabına karşı
uçtan uca test edildi (login, contact, career+CV upload+silme, news CRUD, CORS,
Türkçe karakterler) — hepsi sorunsuz geçti.

## 1. Gereksinimler (hosting tarafında)

- PHP **8.1+** (8.2 önerilir)
- PHP eklentileri: `pdo_mysql`, `curl`, `mbstring` (çoğu paylaşımlı hostingde zaten açık gelir)
- MySQL/MariaDB veritabanı
- Apache + `mod_rewrite` (`.htaccess` kullanılıyor)

Composer / SSH **gerekmiyor** — hiçbir üçüncü parti kütüphane yok, tamamen saf PHP.

## 2. Dosya yapısı ve hosting'e yükleme

```
backend-php/
  public/       <- BUNUN İÇİNİ hosting'te "document root" yapın (subdomain/klasör kökü)
    index.php
    .htaccess
    router.php  <- sadece yerel `php -S` gelistirmesi icin, hosting'de kullanılmaz
  src/          <- public/ ile AYNI SEVİYEDE, public/ İÇİNE DEĞİL (yani document root dışında)
  migrations/schema.sql
  scripts/      <- tek seferlik veri taşıma araçları
  .env          <- siz oluşturacaksınız (.env.example'dan kopyalayın)
```

**Önemli:** `src/` klasörü `public/`'ın içine konulmamalı (document root dışında kalmalı).
cPanel'de genelde bir alt alan adı (ör. `api.hvelektrik.com.tr`) açıp "Document Root"unu
`backend-php/public` olarak ayarlarsanız, `src/`, `.env`, `migrations/`, `scripts/`
otomatik olarak web'den erişilemez olur — en güvenli kurulum budur. Document root'u
ayrı ayarlayamıyorsanız (bazı çok temel paylaşımlı hostinglerde tek klasör verilir),
`src/.htaccess` içindeki "Require all denied" ekstra bir koruma katmanı sağlar ama
mümkünse gerçek document-root ayrımı tercih edin.

## 3. Kurulum adımları

1. **Veritabanı oluşturun** (hosting kontrol paneli → MySQL Veritabanları): bir DB adı,
   kullanıcı adı, şifre belirleyin, kullanıcıyı veritabanına yetkilendirin.
2. **Şemayı çalıştırın**: phpMyAdmin → veritabanınızı seçin → SQL sekmesi →
   `migrations/schema.sql` içeriğini yapıştırıp çalıştırın.
3. **`.env` oluşturun**: `.env.example`'ı `backend-php/.env` olarak kopyalayın
   (document root'un DIŞINA, yani `public/` klasörünün dışına), DB bilgilerini ve
   diğer değerleri (bkz. aşağıdaki tablo) girin.
4. **Dosyaları yükleyin**: `backend-php/` içeriğinin tamamını (public/, src/,
   migrations/, .env) hosting'e FTP/SFTP ile aktarın; `public/`'ı document root yapın.
5. **Admin kullanıcısını + mevcut verileri aktarın**: aşağıdaki "Veri taşıma" bölümüne
   bakın.
6. **Test edin**: `https://api.hvelektrik.com.tr/api` adresine gidip
   `{"service":"HV Elektrik API","ok":true,...}` yanıtını gördüğünüzden emin olun.
7. **Frontend'i güncelleyin**: Vercel → proje → Settings → Environment Variables →
   `REACT_APP_BACKEND_URL` değerini yeni PHP backend adresine çevirin (ör.
   `https://api.hvelektrik.com.tr`, sonunda `/api` OLMADAN), yeniden deploy edin.

### .env değerleri

| Değişken | Nereden bulunur |
|---|---|
| `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASS` | Hosting kontrol paneli → MySQL Veritabanları |
| `JWT_SECRET` | Rastgele üretin: `php -r "echo bin2hex(random_bytes(32));"` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin paneli giriş bilgileri — mevcut `backend/.env` dosyasındaki ile AYNI değeri girerseniz giriş bilgileri değişmez |
| `CLOUDINARY_*` | Mevcut `backend/.env` dosyasından birebir kopyalayın (hesap değişmiyor) |
| `RESEND_*` | Mevcut `backend/.env` dosyasından birebir kopyalayın (opsiyonel) |

## 4. Veri taşıma (mevcut MongoDB verisi → yeni MySQL)

Mevcut canlı veri zaten `scripts/export/` klasörüne aktarılmış durumda (bu depoya
girmez, `.gitignore`'da). İçinde ne var:

- `users.json` — 1 admin kullanıcı (şifre hash'i taşınmadı, güvenlik gereği; adım 2'de yeniden oluşturulacak)
- `messages.json` — 1 iletişim mesajı
- `careers.json` — 0 kayıt (henüz başvuru yok)
- `news.json` — 2 haber

Eğer aradan zaman geçtiyse ve veriyi yeniden/güncel almak isterseniz:

```bash
cd backend-php/scripts
pip install pymongo dnspython
MONGO_URL="<backend/.env içindeki MONGO_URL>" DB_NAME="<backend/.env içindeki DB_NAME>" python export_mongo.py
```

Sonra, hosting'e SSH erişiminiz varsa (çoğu cPanel'de "Terminal" özelliği vardır):

```bash
cd backend-php
php scripts/import_mysql.php
```

Bu script hem admin kullanıcısını (`.env`'deki `ADMIN_EMAIL`/`ADMIN_PASSWORD` ile)
oluşturur/günceller, hem de mesaj/başvuru/haber kayıtlarını MySQL'e aktarır.
Tekrar çalıştırmak veri kaybına yol açmaz (idempotent — aynı id'leri günceller).

SSH erişiminiz yoksa: `scripts/` klasörünü geçici olarak `public/` altına taşıyıp
tarayıcıdan bir kere çalıştırıp (`https://api.../import_mysql.php`), hemen ardından
sunucudan silin — kalıcı bırakmayın (kimliği doğrulanmamış herkes çalıştırabilir).

## 5. Ne taşınmadı, ne değişmedi

- Mongo'daki `partners`, `projects`, `services`, `hero_slides`, `page_content`,
  `categories`, `about`, `footer_info`, `career_posts`, `counters`, `settings`, `meta`
  koleksiyonları taşınmadı — frontend hiçbir zaman bunlara API üzerinden erişmiyordu
  (bakınız `frontend/src/lib/api.js` ve bunu kullanan 6 dosya), muhtemelen eski/deneme
  verisi. Site bunlarsız da olduğu gibi çalışır.
- Cloudinary ve Resend hesapları **değişmiyor** — aynı hesaplar, PHP'den de aynı REST
  API'ler üzerinden çağrılıyor.
- API endpoint'leri, JSON alan adları, hata mesajı formatı (`{"detail": "..."}`),
  cookie davranışı (httponly/secure/SameSite=None) birebir korundu.

## 6. Yerel geliştirme / test

```bash
php -S localhost:8090 -t public public/router.php
```

`.env`'i `backend-php/.env` olarak oluşturup yerel bir MySQL'e işaret ettirin,
`migrations/schema.sql`'i o veritabanında çalıştırın, sonra yukarıdaki komutla test edin.
