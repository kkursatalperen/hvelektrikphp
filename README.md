# HV Elektrik — Paylaşımlı Hosting Paketi (Frontend + PHP Backend)

Bu repo, orijinal projenin (FastAPI/Python + MongoDB backend, React/Vite frontend)
**paylaşımlı hosting'te (sadece PHP + MySQL) çalışacak** tam karşılığıdır. İçinde
hem güncel frontend (`frontend/`, Vite ile — `hvelektrik.vercel.app`'te şu an
çalışan **aynı** kaynak) hem de PHP backend (kök dizin: `public/`, `src/`, vb.) var.

> **Önemli düzeltme notu:** Bu paketin önceki bir sürümü backend'in sadece
> auth/contact/career/news kısmını içeriyordu — o, projenin eski (main branch,
> 9 Temmuz) bir kopyasına dayanıyordu. Gerçek canlı site (master branch, 26
> Temmuz) çok daha fazla özellik kullanıyor: anasayfa slider'ı, hizmet
> kategorileri, sayaçlar, çok dilli metin sistemi, footer içeriği, iş ortakları,
> proje vitrini, kariyer ilanları. **Bu sürüm hepsini kapsıyor** ve gerçek
> canlı veriyle uçtan uca test edildi.

## 1. Mimari

| Katman | Teknoloji | Nerede |
|---|---|---|
| Frontend | React + **Vite** (CRA/craco DEĞİL) | `frontend/` — statik build, herhangi bir hosting'de |
| Backend | **PHP 8.1+** (bağımlılıksız, saf PHP) | `public/`, `src/` — paylaşımlı hosting |
| Veritabanı | **MySQL/MariaDB** | Hosting'in sunduğu MySQL |
| Görsel/CV yükleme | Cloudinary | Mevcut hesap, değişmiyor |
| Mail bildirimi (opsiyonel) | Resend | Mevcut hesap, değişmiyor |

Frontend, backend'e `VITE_BACKEND_URL` üzerinden HTTP istekleri atar
(`frontend/src/lib/api.js`). **Dikkat:** Vite projeleri `REACT_APP_` değil
`VITE_` önekli ortam değişkeni kullanır.

## 2. Gereksinimler (hosting tarafında)

- PHP **8.1+** (8.2 önerilir), eklentiler: `pdo_mysql`, `curl`, `mbstring`
- MySQL/MariaDB veritabanı
- Apache + `mod_rewrite` (backend `.htaccess` kullanıyor)
- Node.js sadece **yerel build almak için** gerekli (hosting'e Node kurulmaz,
  sadece `npm run build`'in çıktısı olan statik dosyalar yüklenir)

Composer / SSH gerekmiyor — PHP tarafında hiçbir üçüncü parti kütüphane yok.

## 3. Kurulum adımları

### 3.1 Backend (PHP)

1. **Veritabanı oluşturun** (hosting kontrol paneli → MySQL Veritabanları).
2. **Şemayı çalıştırın**: phpMyAdmin → SQL sekmesi → `migrations/schema.sql`.
3. **`.env` oluşturun** (`.env.example`'dan kopyalayın, `public/` klasörünün
   DIŞINA, yani repo kökünde `backend-php/.env` olacak şekilde — document root
   ayrı bir alt alan adına verildiyse bu otomatik olarak web'den erişilemez olur).
4. **Dosyaları yükleyin**: `public/`, `src/`, `migrations/`, `.env` dosyalarını
   hosting'e aktarın; bir subdomain açıp (ör. `api.hvelektrik.com.tr`) document
   root'unu `public/` yapın.
5. **Veri taşıyın**: aşağıdaki "Veri taşıma" bölümüne bakın.
6. **Test edin**: `https://api.hvelektrik.com.tr/api` → `{"service":"HV Elektrik API","ok":true,...}`.
7. **`ALLOWED_ORIGINS`'i güncelleyin**: `.env`'de frontend'in gerçek adresini
   ekleyin (bkz. aşağıdaki CORS bölümü) — **bu adım atlanırsa frontend
   backend'e istek atamaz (CORS hatası alırsınız), site boş görünür.**

### 3.2 Frontend (React/Vite)

1. `frontend/.env.example`'ı `frontend/.env` yapıp `VITE_BACKEND_URL`'i
   backend'in adresine ayarlayın (sonunda `/api` OLMADAN).
2. ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run build
   ```
3. Oluşan `frontend/dist/` klasörünün içeriğini hosting'e yükleyin (ana domain
   veya istediğiniz alt klasör).
4. `frontend/vercel.json`'daki SPA rewrite kuralı (`/(.*) → /index.html`)
   Apache'de karşılığı yok — Apache için `frontend/dist/.htaccess` dosyası
   oluşturup şunu ekleyin:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```
   (Yoksa `/haberler/xyz` gibi doğrudan girilen alt sayfa adresleri 404 verir.)

### 3.3 CORS (`ALLOWED_ORIGINS`)

Backend, `.env`'deki `ALLOWED_ORIGINS` listesinde **tam olarak eşleşen**
origin'lerden gelen isteklere izin verir (orijinal Python backend'deki
`CORSMiddleware(allow_origins=[...])` ile birebir aynı davranış). Varsayılan:

```
ALLOWED_ORIGINS=https://hvelektrik.vercel.app,http://localhost:5173,http://localhost:3000
```

Frontend'i yeni domain'e taşıdığınızda bu listeye **gerçek domain'i eklemeniz
şart**, örneğin:

```
ALLOWED_ORIGINS=https://hvelektrik.com.tr,https://www.hvelektrik.com.tr
```

## 4. Veri taşıma (mevcut MongoDB verisi → yeni MySQL)

`scripts/export/` klasöründe zaten canlı veriden alınmış bir dışa aktarım var
(bu depoya girmez — ayrıca, güvenli bir kanaldan size iletildi). İçindeki 12
dosya: `users`, `messages`, `careers`, `news`, `hero_slides`, `categories`,
`counters`, `page_content`, `footer_info`, `partners`, `projects`, `career_posts`.

Yeniden/güncel almak isterseniz:

```bash
cd scripts
pip install pymongo dnspython
MONGO_URL="<backend/.env icindeki MONGO_URL>" DB_NAME="<backend/.env icindeki DB_NAME>" python export_mongo.py
```

Sonra hosting'de (SSH varsa):

```bash
php scripts/import_mysql.php
```

Bu script hem admin kullanıcısını (`.env`'deki `ADMIN_EMAIL`/`ADMIN_PASSWORD`
ile) oluşturur, hem tüm içerikleri MySQL'e aktarır. Tekrar çalıştırmak veri
kaybına yol açmaz (idempotent).

SSH yoksa: `scripts/` klasörünü geçici olarak `public/` altına taşıyıp
tarayıcıdan bir kere çalıştırın, hemen ardından silin.

## 5. Ne taşınmadı

Mongo'daki `services`, `about`, `settings`, `meta` koleksiyonları gerçek
backend'de (server.py) hiçbir route tarafından kullanılmıyor — taşınmadı.

## 6. Yerel geliştirme / test

Backend:
```bash
php -S localhost:8090 -t public public/router.php
```

Frontend:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## 7. Bilinen küçük veri notu (acil değil)

`projects` tablosundaki en eski kayıtlardan biri, eski bir şema sürümünden
kalma fazladan alanlar (`title`, `sector`, `location` gibi) içeriyordu — bunlar
hiçbir yerde kullanılmadığı için taşınmadı, güncel alanlar (`title_tr` vb.)
zaten doluydu ve birebir aktarıldı. Görsel olarak fark etmezsiniz.
