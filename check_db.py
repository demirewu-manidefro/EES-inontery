import sqlite3
import os

db_path = os.path.join("instance", "dbems.db")
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
try:
    cursor.execute("PRAGMA table_info(employees);")
    columns = cursor.fetchall()
    print("Columns in 'employees' table:")
    for col in columns:
        print(col)
except Exception as e:
    print(f"Error reading table info: {e}")
finally:
    conn.close()
