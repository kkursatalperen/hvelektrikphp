# HV Elektrik — Paylaşımlı Hosting Paketi (Frontend + PHP Backend)

Bu repo, orijinal projenin (FastAPI/Python + MongoDB backend, React/Vite frontend)
**paylaşımlı hosting'te (sadece PHP + MySQL) çalışacak** tam karşılığıdır.

```
frontend/      React + Vite kaynak kodu (hvelektrik.vercel.app'te su an calisan AYNI kaynak)
backend-php/   PHP + MySQL backend (Python backend'in tam karsiligi)
```

## ⚠️ SİTEYİ ÇALIŞTIRMAK İÇİN MUTLAKA YAPILMASI GEREKENLER (önem sırasına göre)

Bunlardan biri atlanırsa/yanlış yapılırsa site ya hiç açılmaz ya da açılır
ama içi boş görünür. Sırayla:

### 1. Bu repodan TAZE çalışın — eski bir kopya kullanmayın

Elinizde daha önceden kalmış bir zip/klasör varsa **kullanmayın**. Sadece
`hvelektrikphp` reposunu şimdi indirin (GitHub → Code → Download ZIP, ya da
`git clone`). Daha önce bir kere "eski site" sorunu bundan kaynaklanmıştı.

### 2. Size ayrıca (repo dışında) iletilen 2 öğeyi DOĞRU YERE koyun

Repoda olmayan, size güvenli bir kanaldan ayrıca gönderilen 2 şey var —
bunları tam olarak şu klasörlere koyun:

| Size gönderilen | Tam olarak nereye koyulacak |
|---|---|
| `.env` dosyası | `backend-php/.env` (yani `backend-php` klasörünün içine, `public` klasörünün **yanına** — içine değil) |
| `export` klasörü (12 adet `.json` dosyası) | `backend-php/scripts/export/` (böyle bir `scripts` klasörü zaten repoda var, içine `export` adında bir klasör açıp 12 dosyayı oraya koyun) |

`export` klasörü mevcut haberleri, mesajları, hero slider'ı, projeleri vb.
içeriyor — doğru yere koymazsanız site açılır ama içi bomboş gelir.

### 3. `backend-php/.env` içindeki şu 2 alanı doldurun — EN KRİTİK ADIM

- **`DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASS`** — hosting'te MySQL
  veritabanı oluşturunca alacağınız bilgiler (aşağıda adım adım anlatılıyor).
- **`ALLOWED_ORIGINS`** — sitenin gerçek adresini buraya yazmazsanız,
  backend çalışsa bile site boş görünür (tarayıcı isteği engeller). Örnek:
  ```
  ALLOWED_ORIGINS=https://hvelektrik.com.tr,https://www.hvelektrik.com.tr
  ```
  (`https://` ile, hem www'lu hem www'suz varsa ikisi de, virgülle ayrılmış.)

Bu alanları doldurduktan sonra, veritabanına asıl veriyi aktarmak için
(2. adımda koyduğunuz `export` klasörünü kullanarak):
```bash
cd backend-php
php scripts/import_mysql.php
```

### 4. `frontend/.env` dosyasını doldurun, SONRA build alın

`frontend/.env.example`'ı `frontend/.env` yapıp `VITE_BACKEND_URL`'e backend'in
adresini yazın (ör. `https://api.hvelektrik.com.tr`, sonunda `/api` OLMADAN).
**Sıra önemli: önce bu dosyayı doldurun, `npm run build`'i ondan SONRA
çalıştırın** — build alırken bu adres kod içine gömülüyor, sonradan
değiştiremezsiniz, yeniden build almanız gerekir.

### 5. Deploy ettikten sonra hemen kontrol edin (2 dakika)

1. `https://api.SIZINDOMAIN.com/api` → `{"service":"HV Elektrik API","ok":true,...}` görmelisiniz.
2. Ana sayfa: slider, kategoriler, sayaçlar, projeler, footer dolu olmalı
   (boşsa 2. ve 3. adımları kontrol edin).
3. **Sağ altta "Made with Emergent" rozeti GÖRÜNMEMELİ.** Görünüyorsa 1.
   adımı atladınız demektir — yanlış/eski bir kaynak kullanılmış.
4. İletişim formu + kariyer formu (CV yükleme) + admin girişini deneyin.

---

## Mimari

| Katman | Teknoloji | Nerede |
|---|---|---|
| Frontend | React + **Vite** (CRA/craco DEĞİL) | `frontend/` — statik build, herhangi bir hosting'de |
| Backend | **PHP 8.1+** (bağımlılıksız, saf PHP) | `backend-php/public/`, `backend-php/src/` — paylaşımlı hosting |
| Veritabanı | **MySQL/MariaDB** | Hosting'in sunduğu MySQL |
| Görsel/CV yükleme | Cloudinary | Mevcut hesap, değişmiyor |
| Mail bildirimi (opsiyonel) | Resend | Mevcut hesap, değişmiyor |

Frontend, backend'e `VITE_BACKEND_URL` üzerinden HTTP istekleri atar
(`frontend/src/lib/api.js`). **Dikkat:** Vite projeleri `REACT_APP_` değil
`VITE_` önekli ortam değişkeni kullanır.

## Gereksinimler (hosting tarafında)

- PHP **8.1+** (8.2 önerilir), eklentiler: `pdo_mysql`, `curl`, `mbstring`
  (çoğu paylaşımlı hostingde zaten açık gelir)
- MySQL/MariaDB veritabanı
- Apache + `mod_rewrite` (backend `.htaccess` kullanıyor)
- Node.js sadece **yerel build almak için** gerekli (hosting'e Node kurulmaz,
  sadece `npm run build`'in çıktısı olan statik dosyalar yüklenir)
- **Ekstra bir yazılım kurmanıza gerek yok** — Composer, Docker, XAMPP vb.
  hiçbiri gerekmiyor, paylaşımlı hosting zaten PHP+MySQL+Apache ile hazır gelir.

## Detaylı kurulum adımları

### Backend (PHP) — `backend-php/` klasörü

1. **Veritabanı oluşturun** (hosting kontrol paneli → MySQL Veritabanları).
2. **Şemayı çalıştırın**: phpMyAdmin → SQL sekmesi → `backend-php/migrations/schema.sql`.
3. **`.env` doldurun** (yukarıdaki "MUTLAKA YAPILMASI GEREKENLER" bölümüne
   bakın) — `backend-php/public/` klasörünün DIŞINDA kalmalı.
4. **Dosyaları yükleyin**: `backend-php/` klasörünün TAMAMINI hosting'e
   aktarın; bir subdomain açıp (ör. `api.hvelektrik.com.tr`) document
   root'unu `backend-php/public/` yapın.
5. **Veri taşıyın**: aşağıdaki "Veri taşıma" bölümüne bakın.

### Frontend (React/Vite) — `frontend/` klasörü

1. `frontend/.env` doldurun (yukarıya bakın).
2. ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run build
   ```
3. Oluşan **`frontend/build/`** klasörünün içeriğini hosting'e yükleyin —
   çıktı klasörü `dist/` DEĞİL `build/`'dir. Yüklemeden önce hedef klasördeki
   eski dosyaları temizleyin (eski + yeni dosyalar karışmasın).
4. `frontend/vercel.json`'daki SPA rewrite kuralı Apache'de karşılığı yok —
   Apache için `frontend/build/.htaccess` oluşturup şunu ekleyin:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```
   (Yoksa `/haberler/xyz` gibi doğrudan girilen alt sayfa adresleri 404 verir.)

## Veri taşıma (mevcut MongoDB verisi → yeni MySQL)

Size ayrıca iletilen `backend-php/scripts/export/` klasöründe canlı veriden
alınmış 12 dosya var: `users`, `messages`, `careers`, `news`, `hero_slides`,
`categories`, `counters`, `page_content`, `footer_info`, `partners`,
`projects`, `career_posts`.

Hosting'de (SSH varsa):

```bash
cd backend-php
php scripts/import_mysql.php
```

Bu script hem admin kullanıcısını (`.env`'deki `ADMIN_EMAIL`/`ADMIN_PASSWORD`
ile) oluşturur, hem tüm içerikleri MySQL'e aktarır. Tekrar çalıştırmak veri
kaybına yol açmaz (idempotent).

SSH yoksa: `backend-php/scripts/` klasörünü geçici olarak `backend-php/public/`
altına taşıyıp tarayıcıdan bir kere çalıştırın, hemen ardından silin.

Veriyi yeniden/güncel almak isterseniz:

```bash
cd backend-php/scripts
pip install pymongo dnspython
MONGO_URL="<eski backend/.env icindeki MONGO_URL>" DB_NAME="<eski backend/.env icindeki DB_NAME>" python export_mongo.py
```

## Ne taşınmadı

Mongo'daki `services`, `about`, `settings`, `meta` koleksiyonları gerçek
backend'de (server.py) hiçbir route tarafından kullanılmıyor — taşınmadı.

## Yerel geliştirme / test

Backend:
```bash
cd backend-php
php -S localhost:8090 -t public public/router.php
```

Frontend:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Bilinen küçük veri notu (acil değil)

`projects` tablosundaki en eski kayıtlardan biri, eski bir şema sürümünden
kalma fazladan alanlar (`title`, `sector`, `location` gibi) içeriyordu — bunlar
hiçbir yerde kullanılmadığı için taşınmadı, güncel alanlar (`title_tr` vb.)
zaten doluydu ve birebir aktarıldı. Görsel olarak fark etmezsiniz.
