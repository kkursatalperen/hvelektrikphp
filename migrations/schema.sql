-- HV Elektrik backend - MySQL schema
-- Mongo'daki gercekte kullanilan 12 koleksiyonun (users, messages, careers, news,
-- hero_slides, categories, counters, page_content, footer_info, partners, projects,
-- career_posts) birebir MySQL karsiligi. "services", "about", "settings", "meta"
-- koleksiyonlari gercek backend'de (master branch) hicbir route tarafindan
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

CREATE TABLE IF NOT EXISTS hero_slides (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  sort_order INT          NOT NULL DEFAULT 0,
  image      VARCHAR(500) NOT NULL DEFAULT '',
  sub_tr     VARCHAR(300) NOT NULL DEFAULT '',
  sub_en     VARCHAR(300) NOT NULL DEFAULT '',
  title_tr   VARCHAR(300) NOT NULL DEFAULT '',
  title_en   VARCHAR(300) NOT NULL DEFAULT '',
  desc_tr    TEXT         NULL,
  desc_en    TEXT         NULL,
  cta_tr     VARCHAR(100) NOT NULL DEFAULT '',
  cta_en     VARCHAR(100) NOT NULL DEFAULT '',
  link       VARCHAR(300) NOT NULL DEFAULT '/',
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NULL,
  KEY idx_hero_slides_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id             CHAR(36)     NOT NULL PRIMARY KEY,
  sort_order     INT          NOT NULL DEFAULT 0,
  icon           VARCHAR(50)  NOT NULL DEFAULT 'tower',
  image          VARCHAR(500) NOT NULL DEFAULT '',
  accent_image   VARCHAR(500) NOT NULL DEFAULT '',
  link           VARCHAR(300) NOT NULL DEFAULT '/',
  title_tr       VARCHAR(300) NOT NULL DEFAULT '',
  title_en       VARCHAR(300) NOT NULL DEFAULT '',
  sub_tr         VARCHAR(300) NOT NULL DEFAULT '',
  sub_en         VARCHAR(300) NOT NULL DEFAULT '',
  desc_tr        TEXT         NULL,
  desc_en        TEXT         NULL,
  page_title_tr  VARCHAR(300) NOT NULL DEFAULT '',
  page_title_en  VARCHAR(300) NOT NULL DEFAULT '',
  page_desc_tr   TEXT         NULL,
  page_desc_en   TEXT         NULL,
  features_tr    LONGTEXT     NULL,
  features_en    LONGTEXT     NULL,
  stats          LONGTEXT     NULL,
  active         TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME     NULL,
  KEY idx_categories_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS counters (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  sort_order INT          NOT NULL DEFAULT 0,
  icon       VARCHAR(50)  NOT NULL DEFAULT 'globe',
  value      INT          NOT NULL DEFAULT 0,
  suffix     VARCHAR(20)  NOT NULL DEFAULT '+',
  label_tr   VARCHAR(200) NOT NULL DEFAULT '',
  label_en   VARCHAR(200) NOT NULL DEFAULT '',
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  KEY idx_counters_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- "key" MySQL'de ayrilmis kelime oldugu icin sutun adi content_key
CREATE TABLE IF NOT EXISTS page_content (
  content_key VARCHAR(190) NOT NULL PRIMARY KEY,
  value_tr    TEXT         NULL,
  value_en    TEXT         NULL,
  section     VARCHAR(100) NOT NULL DEFAULT 'genel',
  updated_at  DATETIME     NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS footer_info (
  content_key VARCHAR(190) NOT NULL PRIMARY KEY,
  value_tr    TEXT         NULL,
  value_en    TEXT         NULL,
  updated_at  DATETIME     NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partners (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  sort_order INT          NOT NULL DEFAULT 0,
  name       VARCHAR(200) NOT NULL DEFAULT '',
  logo       VARCHAR(500) NOT NULL DEFAULT '',
  link       VARCHAR(300) NOT NULL DEFAULT '',
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  KEY idx_partners_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  sort_order INT          NOT NULL DEFAULT 0,
  image      VARCHAR(500) NOT NULL DEFAULT '',
  images     LONGTEXT     NULL,
  title_tr   VARCHAR(300) NOT NULL DEFAULT '',
  title_en   VARCHAR(300) NOT NULL DEFAULT '',
  desc_tr    TEXT         NULL,
  desc_en    TEXT         NULL,
  category   VARCHAR(50)  NOT NULL DEFAULT 'ges',
  country    VARCHAR(100) NOT NULL DEFAULT '',
  year       INT          NULL,
  status     VARCHAR(50)  NOT NULL DEFAULT 'tamamlanan',
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NULL,
  KEY idx_projects_sort (sort_order),
  KEY idx_projects_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS career_posts (
  id         CHAR(36)     NOT NULL PRIMARY KEY,
  title_tr   VARCHAR(300) NOT NULL DEFAULT '',
  title_en   VARCHAR(300) NOT NULL DEFAULT '',
  location   VARCHAR(100) NOT NULL DEFAULT 'İzmir',
  type       VARCHAR(50)  NOT NULL DEFAULT 'tam-zamanlı',
  desc_tr    TEXT         NULL,
  desc_en    TEXT         NULL,
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NULL,
  KEY idx_career_posts_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
