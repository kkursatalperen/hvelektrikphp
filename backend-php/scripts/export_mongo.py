"""
Mevcut MongoDB Atlas veritabanindaki, gercekte kullanilan koleksiyonlari JSON
dosyalarina aktarir. Sadece OKUMA yapar, hicbir seyi degistirmez/silmez.

Kullanim:
    pip install pymongo dnspython
    MONGO_URL=... DB_NAME=... python export_mongo.py

Ciktilar backend-php/scripts/export/ klasorune yazilir.

Not: users.json icindeki password_hash export edilmez. Yeni PHP sisteminde admin
kullanicisi import_mysql.php tarafindan ADMIN_EMAIL/ADMIN_PASSWORD (.env) uzerinden
yeniden olusturulur, boylece giris bilgileri degismez.

Not 2: "services", "about", "settings", "meta", "counters"(eger bos donerse) gibi
gercek server.py'da hic route'u olmayan koleksiyonlar bilerek aktarilmiyor.
"""
import json
import os
from pathlib import Path

from pymongo import MongoClient

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise SystemExit(
        "MONGO_URL ve DB_NAME ortam degiskenlerini ayarlayin "
        "(backend/.env dosyasindaki degerler kullanilabilir)."
    )

OUT_DIR = Path(__file__).parent / "export"
OUT_DIR.mkdir(exist_ok=True)

COLLECTIONS = [
    "users", "messages", "careers", "news",
    "hero_slides", "categories", "counters", "page_content",
    "footer_info", "partners", "projects", "career_posts",
]


def main():
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=8000)
    db = client[DB_NAME]

    for name in COLLECTIONS:
        docs = list(db[name].find({}))
        for doc in docs:
            doc["_id"] = str(doc["_id"])
            if name == "users":
                doc.pop("password_hash", None)

        out_path = OUT_DIR / f"{name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(docs, f, ensure_ascii=False, indent=2, default=str)
        print(f"{name}: {len(docs)} kayit -> {out_path}")

    print("\nTamamlandi.")


if __name__ == "__main__":
    main()
