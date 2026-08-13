-- HV Elektrik backend - MySQL schema
-- Mongo'daki 4 canli koleksiyonun (users, messages, careers, news) birebir MySQL karsiligi.
-- Diger 12 koleksiyon (partners, projects, services, hero_slides, page_content, categories,
-- about, footer_info, career_posts, counters, settings, meta) hicbir API endpoint'i tarafindan
-- kullanilmiyor / frontend tarafindan cagrilmiyor, bu yuzden tasinmadi.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(190) NOT NULL DEFAULT 'Admin',
  role          VARCHAR(30)  NOT NULL DEFAULT 'admin',
  created_at    DATETIME     NOT NULL,
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  phone      VARCHAR(40)  NULL,
  subject    VARCHAR(200) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL,
  KEY idx_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS careers (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  phone         VARCHAR(40)  NULL,
  position      VARCHAR(190) NOT NULL,
  message       TEXT         NULL,
  cv_url        VARCHAR(500) NULL,
  cv_public_id  VARCHAR(255) NULL,
  cv_filename   VARCHAR(255) NULL,
  cv_size       INT UNSIGNED NULL,
  is_read       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL,
  KEY idx_careers_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  title_tr   VARCHAR(300) NOT NULL,
  title_en   VARCHAR(300) NOT NULL,
  excerpt_tr TEXT         NOT NULL,
  excerpt_en TEXT         NOT NULL,
  content_tr LONGTEXT     NOT NULL,
  content_en LONGTEXT     NOT NULL,
  image      VARCHAR(500) NULL,
  news_date  DATE         NOT NULL,
  published  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL,
  KEY idx_news_date (news_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
