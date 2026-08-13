"""
Mevcut MongoDB Atlas veritabanindaki users/messages/careers/news koleksiyonlarini
JSON dosyalarina aktarir. Sadece OKUMA yapar, hicbir seyi degistirmez/silmez.

Kullanim:
    pip install pymongo dnspython
    python export_mongo.py

Ciktilar backend-php/scripts/export/ klasorune yazilir:
    users.json, messages.json, careers.json, news.json

Not: users.json icindeki password_hash export edilmez. Yeni PHP sisteminde admin
kullanicisi import_mysql.php tarafindan ADMIN_EMAIL/ADMIN_PASSWORD (.env) uzerinden
yeniden olusturulur, boylece giris bilgileri degismez.
"""
import json
import os
from pathlib import Path

from pymongo import MongoClient

MONGO_URL = os.environ.get(
    "MONGO_URL",
    "mongodb+srv://gokdenizhv_db_user:gokdenizhv123@hv-elektrik.d6btczd.mongodb.net/?appName=hv-elektrik",
)
DB_NAME = os.environ.get("DB_NAME", "alpere123oguz_db_user")

OUT_DIR = Path(__file__).parent / "export"
OUT_DIR.mkdir(exist_ok=True)

COLLECTIONS = ["users", "messages", "careers", "news"]


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
            json.dump(docs, f, ensure_ascii=False, indent=2)
        print(f"{name}: {len(docs)} kayit -> {out_path}")

    print("\nTamamlandi. Simdi backend-php/scripts/export/ klasorunu hosting'e "
          "yukleyip (ya da yerel test icin ayni yerde birakip) import_mysql.php "
          "script'ini calistirin.")


if __name__ == "__main__":
    main()
