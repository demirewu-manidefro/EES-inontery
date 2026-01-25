from app import app, db
from models import User, Employee, Material, BorrowedMaterial, LeaveOutMember, WaitingReturn

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
