from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from models import Employee, Material, BorrowedMaterial, LeaveOutMember, WaitingReturn, User
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from db import db
import os
from io import BytesIO
import pandas as pd
from werkzeug.utils import secure_filename
import io
from datetime import datetime
from config import Config
import psycopg2
from urllib.parse import urlparse

print("Current working directory:", os.getcwd())
print("Templates folder contents:", os.listdir(os.path.join(os.getcwd(), "templates")))


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

@app.route("/ping-db")
def ping_db():
    uri = os.getenv("DATABASE_URL", "")
    # mask credentials for logs/return
    try:
        masked = uri
        if "@" in uri:
            left, right = uri.split("@", 1)
            masked = "***@"+ right
    except Exception:
        masked = "***"

    try:
        # Try a direct psycopg2 connect (explicit sslmode too)
        conn = psycopg2.connect(uri, connect_timeout=5)
        conn.close()
        return f"✅ DB connect OK (uri ok? sslmode present: {'sslmode' in uri})."
    except Exception as e:
        # return the full error so you can see details in logs/browser
        return f"❌ DB connect failed. uri={masked} — error: {e}", 500


# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@app.route("/create-admin")
def create_admin():
    # Change these to your desired credentials
    username = "admin"
    password = "admin123"
    role = "admin"

    # Check if admin already exists
    existing = User.query.filter_by(username=username).first()
    if existing:
        return "⚠️ Admin already exists."

    # Create new admin
    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    new_admin = User(username=username, password=hashed_pw, role=role)
    db.session.add(new_admin)
    db.session.commit()

    return f"✅ Admin created! Username: {username}, Password: {password}"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ---------------- LOGIN & REGISTER ----------------
# ---------------- REGISTER (Manager Only) ----------------
@app.route("/register", methods=["GET", "POST"])
def register():
    # Registration is now public to allow self-signup as requested
    if request.method == "POST":
        username = request.form["username"]
        password = generate_password_hash(request.form["password"])
        role = request.form["role"]

        if User.query.filter_by(username=username).first():
            flash("Username already exists", "error")
            return redirect(url_for("register"))

        new_user = User(username=username, password=password, role=role, is_approved=False)
        db.session.add(new_user)
        db.session.commit()
        flash("Registration successful! Please wait for administrative approval before you can log in.", "success")
        return redirect(url_for("root"))

    return render_template("register.html", user=current_user)

# ---------------- LOGIN ----------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("home"))  # already logged in

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            if not user.is_approved and user.username != 'admin':
                flash("Your account is pending approval. Please contact the administrator.", "error")
                return redirect(url_for("login"))
            
            login_user(user)
            flash(f"Welcome back, {user.username}!", "success")
            return redirect(url_for("home"))

        flash("Invalid credentials", "error")

    return render_template("login.html", user=current_user)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out successfully", "success")
    return redirect(url_for("root"))



# ---------------- CHANGE PASSWORD ----------------
@app.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        current_password = request.form['current_password']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        # Check if current password is correct
        if not check_password_hash(current_user.password, current_password):
            flash('Current password is incorrect', 'error')
            return redirect(url_for('change_password'))

        # Check if new password and confirm password match
        if new_password != confirm_password:
            flash('New passwords do not match', 'error')
            return redirect(url_for('change_password'))

        # Update password hash in DB
        current_user.password = generate_password_hash(new_password)
        db.session.commit()
        flash('Password changed successfully!', 'success')
        return redirect(url_for('home'))

    return render_template('change_password.html', user=current_user)


# ---------------- DASHBOARD ----------------
# ---------------- HOME / ROOT ----------------
@app.route("/")
def root():
    return render_template("landing.html", user=current_user)
# Dashboard (only for logged-in users)
@app.route("/home")
@login_required
def home():
    total_employees = Employee.query.count()
    total_materials = Material.query.count()
    borrowed_count = BorrowedMaterial.query.filter_by(is_returned=False).count()
    waiting_count = WaitingReturn.query.count()
    leave_count = LeaveOutMember.query.count()
    
    return render_template(
        "index.html", 
        user=current_user,
        stats={
            "total_employees": total_employees,
            "total_materials": total_materials,
            "borrowed_count": borrowed_count,
            "waiting_count": waiting_count,
            "leave_count": leave_count
        }
    )

# Add Employee with separatename and father_name fields
@app.route('/add_employee', methods=['GET', 'POST'])
def add_employee():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        father_name = request.form.get('father_name', '').strip()
        grand_father_name = request.form.get('grand_father_name', '').strip()
        sex = request.form.get('sex', '').strip()
        position = request.form.get('position', '').strip()
        employment_status = request.form.get('employment_status', '').strip()
        phone_number = request.form.get('phone_number', '').strip()
        project = request.form.get('project', '').strip()


        if not name or not father_name or not sex or not employment_status or not phone_number or not project:
            flash('Please fill all required fields.', 'error')
            return redirect(url_for('add_employee'))

        exists = Employee.query.filter_by(name=name, father_name=father_name ,grand_father_name = grand_father_name).first()
        if exists:
            flash('Employee with this name already exists.', 'error')
            return redirect(url_for('add_employee'))

        new_emp = Employee(
            name=name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            sex=sex,
            position=position,
            employment_status=employment_status,
            phone_number=phone_number,
            project=project,
            status='active'
        )
        db.session.add(new_emp)
        db.session.commit()
        flash('Employee added successfully!', 'success')
        return redirect(url_for('add_employee'))

    return render_template('add_employee.html')



# ---------------- USER APPROVAL ----------------
@app.route('/admin/approve-users')
@login_required
def manage_approvals():
    if current_user.role != 'admin':
        flash("Unauthorized access.", "error")
        return redirect(url_for('home'))
    
    pending_users = User.query.filter_by(is_approved=False).all()
    return render_template('approve_users.html', users=pending_users)

@app.route('/admin/approve-user/<int:user_id>', methods=['POST'])
@login_required
def approve_user(user_id):
    if current_user.role != 'admin':
        return "Unauthorized", 403
    
    user = User.query.get_or_404(user_id)
    user.is_approved = True
    db.session.commit()
    flash(f"User {user.username} has been approved.", "success")
    return redirect(url_for('manage_approvals'))

@app.route('/admin/reject-user/<int:user_id>', methods=['POST'])
@login_required
def reject_user(user_id):
    if current_user.role != 'admin':
        return "Unauthorized", 403
    
    user = User.query.get_or_404(user_id)
    username = user.username
    db.session.delete(user)
    db.session.commit()
    flash(f"User {username} has been rejected and removed.", "success")
    return redirect(url_for('manage_approvals'))

# ---------------- BULK UPLOAD USERS ----------------
@app.route('/admin/upload-users', methods=['GET', 'POST'])
@login_required
def upload_users():
    if current_user.role != 'admin':
        flash("Unauthorized access.", "error")
        return redirect(url_for('home'))

    if request.method == 'POST':
        file = request.files.get('file')
        if not file:
            flash("No file selected!", "error")
            return redirect(request.url)

        filename = secure_filename(file.filename)
        try:
            df = pd.read_excel(file) if filename.endswith('.xlsx') else pd.read_csv(file)
            df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            
            added = 0
            for _, row in df.iterrows():
                u = str(row.get('username', '')).strip()
                p = str(row.get('password', '')).strip()
                r = str(row.get('role', 'employee')).strip()
                
                if u and p:
                    if not User.query.filter_by(username=u).first():
                        hashed_pw = generate_password_hash(p)
                        new_user = User(username=u, password=hashed_pw, role=r, is_approved=True)
                        db.session.add(new_user)
                        added += 1
            
            db.session.commit()
            flash(f"Successfully uploaded {added} users.", "success")
            return redirect(url_for('home'))
        except Exception as e:
            flash(f"Error: {e}", "error")
            
    return render_template("upload_users.html")


# ---------------- BULK UPLOAD MATERIALS ----------------
@app.route('/upload-materials', methods=['GET', 'POST'])
@login_required
def upload_materials():
    if current_user.role != 'admin':
        flash("Unauthorized access.", "error")
        return redirect(url_for('home'))

    if request.method == 'POST':
        file = request.files.get('file')
        if not file:
            flash("No file selected!", "error")
            return redirect(request.url)

        filename = secure_filename(file.filename)
        if not (filename.endswith('.xlsx') or filename.endswith('.csv')):
            flash("Unsupported format!", "error")
            return redirect(request.url)

        try:
            df = pd.read_excel(file) if filename.endswith('.xlsx') else pd.read_csv(file)
            df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            
            added = 0
            for _, row in df.iterrows():
                name = str(row.get('name', '')).strip()
                sn = str(row.get('serial_number', '')).strip()
                
                if name and sn:
                    exists = Material.query.filter_by(serial_number=sn).first()
                    if not exists:
                        new_mat = Material(name=name, serial_number=sn, status='available')
                        db.session.add(new_mat)
                        added += 1
            
            db.session.commit()
            flash(f"Successfully uploaded {added} materials.", "success")
            return redirect(url_for('materials'))
        except Exception as e:
            app.logger.exception("Error uploading materials")
            flash(f"Error uploading materials: {e}", "error")
            return redirect(url_for('upload_materials'))

    return render_template("upload_materials.html")

# Add Material with serial number
@app.route('/add-material', methods=['GET', 'POST'])
@login_required
def add_material():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        serial_number = request.form.get('serial_number', '').strip()

        if not name or not serial_number:
            flash("Both Material Name and Serial Number are required.", "error")
            return redirect(url_for('add_material'))

        exists = Material.query.filter_by(serial_number=serial_number).first()
        if exists:
            flash(f"Material with Serial Number '{serial_number}' already exists.", "error")
        else:
            new_material = Material(name=name, serial_number=serial_number, status='available')
            db.session.add(new_material)
            db.session.commit()
            flash(f"Material '{name}' added successfully.", "success")
        return redirect(url_for('add_material'))

    return render_template("add_material.html")


# Borrow Material (only materials available)
@app.route('/borrow', methods=['GET', 'POST'])
def borrow_material():
    employees = Employee.query.filter_by(status='active').all()
    materials = Material.query.filter_by(status='available').all()
    if request.method == 'POST':
        emp_id = request.form.get('employee_id')
        purpose = request.form.get('purpose', '').strip()
        material_ids = request.form.getlist('material_ids')

        if not emp_id or not material_ids:
            flash("Please select employee and at least one material.", "error")
            return redirect(url_for('borrow_material'))

        for mid in material_ids:
            borrowed = BorrowedMaterial(employee_id=emp_id, material_id=mid, purpose=purpose)
            db.session.add(borrowed)
            material = Material.query.get(mid)
            if material:
                material.status = 'borrowed'

        db.session.commit()
        flash("Materials borrowed successfully.", "success")
        return redirect(url_for('home'))
    return render_template("borrow_material.html", employees=employees, materials=materials)


# Return all materials and move employee to leave-out list
@app.route('/return', methods=['GET', 'POST'])
def return_material():
    employees = Employee.query.filter_by(status='active').all()
    if request.method == 'POST':
        emp_id_raw = request.form.get('employee')
        if not emp_id_raw:
            flash("No employee selected for return.", "error")
            return redirect(url_for('return_material'))
            
        try:
            emp_id = int(emp_id_raw)
            borrowings = BorrowedMaterial.query.filter_by(employee_id=emp_id, is_returned=False).all()
            for b in borrowings:
                b.is_returned = True
                material = Material.query.get(b.material_id)
                if material:
                    material.status = 'available'

            db.session.commit()
            flash(f"All materials returned successfully.", "success")
        except (ValueError, TypeError):
            flash("Invalid employee selection.", "error")
        except Exception as e:
            db.session.rollback()
            flash(f"An unexpected error occurred: {str(e)}", "error")
            
        return redirect(url_for('return_material'))
    return render_template("return_material.html", employees=employees)


# Return individual materials for employee
@app.route('/return-individual', methods=['GET', 'POST'])
def return_individual_material():
    employees = Employee.query.filter_by(status='active').all()
    selected_emp = None
    borrowings = []

    if request.method == 'POST':
        emp_id_raw = request.form.get('employee')
        if emp_id_raw:
            try:
                emp_id = int(emp_id_raw)
                selected_emp = Employee.query.get(emp_id)
                if not selected_emp:
                    flash("Employee not found.", "error")
                    return redirect(url_for('return_individual_material'))
                    
                borrowings = BorrowedMaterial.query.filter_by(employee_id=emp_id, is_returned=False).all()

                if 'return_materials' in request.form:
                    returned_ids = request.form.getlist('materials')
                    if not returned_ids:
                        flash("No items selected for return.", "error")
                    else:
                        for borrow in borrowings:
                            if str(borrow.id) in returned_ids:
                                borrow.is_returned = True
                                if borrow.material:
                                    borrow.material.status = 'available'
                        db.session.commit()
                        remaining = BorrowedMaterial.query.filter_by(employee_id=emp_id, is_returned=False).count()
                        if remaining == 0:
                            flash("All materials returned. Clearance complete.", "success")
                        else:
                            flash(f"Successfully returned {len(returned_ids)} items.", "success")
                        return redirect(url_for('return_individual_material'))
            except (ValueError, TypeError):
                flash("Invalid operation selected.", "error")

    return render_template("return_individual.html", employees=employees, selected_emp=selected_emp, borrowings=borrowings)



# View Leave-Out Members
@app.route('/leave-out')
def leave_out():
    members = LeaveOutMember.query.all()
    leave_data = []
    for m in members:
        if m.employee:
            leave_data.append({
                'id': m.employee.id,
                'name': m.employee.name,
                'father_name': m.employee.father_name,
                'grand_father_name':m.employee.grand_father_name,
                'sex' : m.employee.sex,
                'leave_date': m.leave_date,
                'phone_number': m.employee.phone_number,
                'position': m.employee.position,
                'employment_status': m.employee.employment_status,
                "project": m.employee.project

            })
    return render_template("leave_out.html", members=leave_data)



# View all employees with separate Name, Father Name, Sex, and borrow status
@app.route('/employees')





def list_employees():
    employees = Employee.query.filter(Employee.status != 'left').all()

    employee_data = []
    for emp in employees:
        borrowings = BorrowedMaterial.query.filter_by(employee_id=emp.id, is_returned=False).all()

        if borrowings:
            status = "Borrowed"
            materials = []
            for b in borrowings:
                material = Material.query.get(b.material_id)
                if material:
                    materials.append(f"{material.name} (SN: {material.serial_number})")
        else:
            status = "Not Borrowed"
            materials = []

        employee_data.append({
            'id': emp.id,
            'name': emp.name,
            'father_name': emp.father_name,
            'sex': emp.sex,
            'status': status,
            'materials': materials,
            'grand_father_name': emp.grand_father_name,
            'position': emp.position,
            'employment_status': emp.employment_status,
            'phone_number': emp.phone_number,
            'project' :emp.project
        })

    return render_template("employees.html", employees=employee_data)




# View borrowed employees only
@app.route('/borrowed-employees')
def borrowed_employees():
    employees = Employee.query.all()
    borrowed_list = []

    for emp in employees:
        borrowings = BorrowedMaterial.query.filter_by(employee_id=emp.id, is_returned=False).all()
        for b in borrowings:
            material = Material.query.get(b.material_id)
            borrowed_list.append({
                'id': emp.id,
                'name': emp.name,
                'father_name': emp.father_name,
                'grand_father_name': emp.grand_father_name,
                'sex': emp.sex,
                'phone_number': emp.phone_number,
                'position': emp.position,
                'employment_status': emp.employment_status,
                'project': emp.project,
                'material_name': material.name,
                'serial_number': material.serial_number
            })

    return render_template("borrowed_employees.html", borrowed_list=borrowed_list)




# Upload employees via Excel/CSV
@app.route('/upload-employees', methods=['GET', 'POST'])
def upload_employees():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file:
            flash("No file selected!", "error")
            return redirect(request.url)

        filename = secure_filename(file.filename)
        if not (filename.endswith('.xlsx') or filename.endswith('.csv')):
            flash("Unsupported file format! Upload .xlsx or .csv only.", "error")
            return redirect(request.url)

        try:
            if filename.endswith('.xlsx'):
                df = pd.read_excel(file, dtype=str)
            else:
                df = pd.read_csv(file, dtype=str)
        except Exception as e:
            flash(f"Error reading file: {e}", "error")
            return redirect(request.url)

        # ✅ Normalize column names
        df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]

        # ✅ Allow variations for "position"
        position_candidates = ['position', 'postion', 'job', 'role', 'job_position']
        position_col = next((c for c in df.columns if c in position_candidates), None)

        added, skipped = [], []

        for _, row in df.iterrows():
            name = str(row.get('name', '')).strip()
            father_name = str(row.get('father_name', '')).strip()
            grand_father_name = str(row.get('grand_father_name', '')).strip() if 'grand_father_name' in df.columns else ''
            sex = str(row.get('sex', '')).strip()
            position = str(row.get(position_col, '')).strip() if position_col else ''  # ✅ safe mapping
            employment_status = str(row.get('employment_status', '')).strip() if 'employment_status' in df.columns else ''
            phone_number = str(row.get('phone_number', '')).strip() if 'phone_number' in df.columns else ''
            project = str(row.get('project', '')).strip() if 'project' in df.columns else ''

            # Require minimum fields
            if not name or not father_name or not sex or not employment_status or not phone_number:
                continue

            exists = Employee.query.filter_by(name=name, father_name=father_name).first()
            if exists:
                skipped.append(f"{name} {father_name}")
            else:
                new_emp = Employee(
                    name=name,
                    father_name=father_name,
                    grand_father_name=grand_father_name,
                    sex=sex,
                    position=position,
                    employment_status=employment_status,
                    phone_number=phone_number,
                    status='active',
                    project=project
                )
                db.session.add(new_emp)
                added.append(f"{name} {father_name}")

        db.session.commit()
        flash(f"Added {len(added)} employees. Skipped {len(skipped)} duplicates.", "success")
        return redirect(url_for('upload_employees'))

    return render_template("upload_employees.html")



# View all materials with status (new)
@app.route('/materials')
def materials():
    # Only show available materials
    materials = Material.query.filter_by(status='available').all()
    return render_template('materials.html', materials=materials)


# Waiting for return list view (new)
@app.route("/waiting-return")
def waiting_return():
    all_entries = WaitingReturn.query.all()
    waiting_list = []
    for w in all_entries:
        if w.employee:
            waiting_list.append({
                'id': w.employee.id,
                'name': w.employee.name,
                'father_name': w.employee.father_name,
                'grand_father_name':w.employee.grand_father_name,
                'sex' :w.employee.sex,
                'phone_number': w.employee.phone_number,
                'position': w.employee.position,
                'employment_status': w.employee.employment_status,
                'project' : w.employee.project,
                'added_date': w.added_date
            })
    return render_template("waiting_return.html", waiting_list=waiting_list)




# Add employee to waiting return list
# Add employee to waiting return list
@app.route('/add-to-waiting/<int:emp_id>', methods=['POST'])
def add_to_waiting(emp_id):
    emp = Employee.query.get_or_404(emp_id)

    # ✅ Check if employee has any borrowed materials not returned
    borrowed_items = BorrowedMaterial.query.filter_by(employee_id=emp.id, is_returned=False).all()
    if not borrowed_items:
        flash(f"Employee '{emp.name} {emp.father_name}' has no borrowed materials. Cannot add to waiting list.", "warning")
        return redirect(url_for('list_employees'))

    # ✅ Check if already in waiting list
    already_waiting = WaitingReturn.query.filter_by(employee_id=emp.id).first()
    if already_waiting:
        flash(f"Employee '{emp.name} {emp.father_name}' is already in the waiting list.", "error")
    else:
        waiting = WaitingReturn(employee_id=emp.id, added_date=datetime.utcnow())
        db.session.add(waiting)
        db.session.commit()
        flash(f"Employee '{emp.name} {emp.father_name}' added to waiting for return list.", "success")

    return redirect(url_for('list_employees'))



# Remove employee from waiting return list
@app.route('/remove-from-waiting/<int:emp_id>', methods=['POST'])
def remove_from_waiting(emp_id):
    waiting = WaitingReturn.query.filter_by(employee_id=emp_id).first()
    if waiting:
        db.session.delete(waiting)
        db.session.commit()
        flash("Employee removed from waiting for return list.", "success")
    else:
        flash("Employee was not in waiting list.", "error")
    return redirect(url_for('waiting_return'))

@app.route('/approve-leave/<int:emp_id>', methods=['POST'])
def approve_leave(emp_id):
    employee = Employee.query.get_or_404(emp_id)

    borrowed = BorrowedMaterial.query.filter_by(employee_id=emp_id, is_returned=False).all()
    if borrowed:
        flash("Employee has borrowed materials. Cannot approve leave.", "error")
        return redirect(url_for('list_employees'))

    # Check if already in leave out
    leave_out = LeaveOutMember.query.filter_by(employee_id=employee.id).first()
    if not leave_out:
        leave_out = LeaveOutMember(employee_id=employee.id, leave_date=datetime.utcnow())
        db.session.add(leave_out)

    # Mark employee as left instead of deleting
    employee.status = 'left'

    db.session.commit()
    flash("Employee approved for leave-out and status updated.", "success")
    return redirect(url_for('list_employees'))

@app.route('/return-from-leave/<int:emp_id>', methods=['POST'])
def return_from_leave(emp_id):
    employee = Employee.query.get_or_404(emp_id)
    leave_out = LeaveOutMember.query.filter_by(employee_id=emp_id).first()
    
    if leave_out:
        db.session.delete(leave_out)
        employee.status = 'active'
        db.session.commit()
        flash(f"Employee {employee.name} has returned from leave and is now active.", "success")
    else:
        flash("Employee was not on leave-out.", "error")
        
    return redirect(url_for('leave_out'))
@app.route('/export-borrowed-and-available')
def export_borrowed_and_available():
    # Borrowed employees data
    borrowed_data = []
    employees = Employee.query.all()
    for emp in employees:
        borrowings = BorrowedMaterial.query.filter_by(employee_id=emp.id, is_returned=False).all()
        if borrowings:
            materials = ", ".join(
                [f"{Material.query.get(b.material_id).name} (SN: {Material.query.get(b.material_id).serial_number})"
                 for b in borrowings])
            borrowed_data.append({
                "Employee ID": emp.id,
                "Name": f"{emp.name} {emp.father_name}",
                "Sex": emp.sex,
                "Position": emp.position,
                "Phone Number": emp.phone_number,
                "Borrowed Materials": materials,
                "Borrow Count": len(borrowings)
            })

    # Available materials data
    available_materials = Material.query.filter_by(status='available').all()
    available_data = [{
        "Material ID": m.id,
        "Material Name": m.name,
        "Serial Number": m.serial_number
    } for m in available_materials]

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        if borrowed_data:
            pd.DataFrame(borrowed_data).to_excel(writer, sheet_name='Borrowed Employees', index=False)
        else:
            pd.DataFrame([{"Note": "No borrowed employees"}]).to_excel(writer, sheet_name='Borrowed Employees', index=False)

        if available_data:
            pd.DataFrame(available_data).to_excel(writer, sheet_name='Available Materials', index=False)
        else:
            pd.DataFrame([{"Note": "No available materials"}]).to_excel(writer, sheet_name='Available Materials', index=False)

    output.seek(0)
    return send_file(
        output,
        download_name="borrowed_employees_and_available_materials.xlsx",
        as_attachment=True,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    
@app.route("/export-waiting-return")
def export_waiting_return():
    all_entries = WaitingReturn.query.all()
    data = []

    for w in all_entries:
        if w.employee:
            data.append({
                'ID': w.employee.id,
                'Name': w.employee.name,
                'Father Name': w.employee.father_name,
                'Grand Father Name': w.employee.grand_father_name,
                'Sex': w.employee.sex,
                'Phone Number': w.employee.phone_number,
                'Position': w.employee.position,
                'Employment Status': w.employee.employment_status,
                'Project': w.employee.project,
                'Added Date': w.added_date.strftime("%Y-%m-%d %H:%M:%S")
            })

    # Create a Pandas DataFrame
    df = pd.DataFrame(data)

    # Convert to Excel in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name="WaitingForReturn")

    output.seek(0)

    return send_file(output,
                     download_name="waiting_for_return.xlsx",
                     as_attachment=True,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
@app.route('/export-excel')
def export_excel():
   

    employees = Employee.query.all()
    data = []
    for emp in employees:
        borrowed_items = [f"{bm.material.name} ({bm.purpose})" for bm in emp.borrowed_materials if not bm.is_returned]
        data.append({
            "Employee Name": emp.name,
            "Father Name": emp.father_name,
            "Sex": emp.sex,
            "Borrowed Materials": ", ".join(borrowed_items) if borrowed_items else "None"
        })

    df = pd.DataFrame(data)
    output = BytesIO()
    df.to_excel(output, index=False, sheet_name="Employees")
    output.seek(0)

    return send_file(output, as_attachment=True, download_name="employees.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


# ✅ NEW ROUTE for exporting available materials
@app.route('/export-available-materials')
def export_available_materials():

    # Get IDs of all borrowed materials
    borrowed_ids = db.session.query(BorrowedMaterial.material_id).filter_by(is_returned=False).all()
    borrowed_ids = [id for (id,) in borrowed_ids]

    # Filter available (not borrowed) materials
    available_materials = Material.query.filter(~Material.id.in_(borrowed_ids)).all()

    data = []
    for mat in available_materials:
        data.append({
            "Material Name": mat.name,
            "Serial Number": mat.serial_number
        })

    df = pd.DataFrame(data)
    output = BytesIO()
    df.to_excel(output, index=False, sheet_name="Available Materials")
    output.seek(0)

    return send_file(output, as_attachment=True, download_name="available_materials.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")






if __name__ == '__main__':
    app.run(debug=True)
