from app import app, db
from models import User
from werkzeug.security import generate_password_hash

with app.app_context():
    username = "admin"
    password = "admin123"
    role = "admin"

    existing = User.query.filter_by(username=username).first()
    if existing:
        print("Admin user already exists.")
        # Ensure password is correct
        existing.password = generate_password_hash(password, method='pbkdf2:sha256')
        db.session.commit()
        print("Admin password updated to default 'admin123' just in case.")
    else:
        hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
        new_admin = User(username=username, password=hashed_pw, role=role)
        db.session.add(new_admin)
        db.session.commit()
        print(f"Admin user created. Username: {username}, Password: {password}")
