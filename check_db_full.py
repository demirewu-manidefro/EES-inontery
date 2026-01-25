import sqlite3
import os

db_path = os.path.join("instance", "dbems.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
try:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", tables)

    for table_name in tables:
        t = table_name[0]
        print(f"\nColumns in '{t}':")
        cursor.execute(f"PRAGMA table_info({t});")
        cols = cursor.fetchall()
        for c in cols:
            print(c)

except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
