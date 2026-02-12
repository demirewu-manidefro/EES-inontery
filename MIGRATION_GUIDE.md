# Employee Material Management System (EMS) - Migration Summary

The system has been migrated from **Python Flask** to a modern **Full-Stack JavaScript** architecture.

## 🚀 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Sequelize ORM)
- **Frontend**: React.js (Vite), Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Export**: XLSX (Excel)

## 📁 Project Structure
- `/backend`: Node.js Express server, Sequelize models, and controllers.
- `/frontend`: React client with Tailwind CSS and responsive layout.

## 🛠️ Key Features Migrated
1. **Authentication**: JWT-based login, self-registration, and administrative approval.
2. **Employee Management**: List, individual add, and bulk upload (Excel/CSV).
3. **Inventory Management**: Track available materials with serial numbers.
4. **Issuance (Borrowing)**: Searchable interface to assign multiple materials to employees.
5. **Returns**: Process individual or bulk returns from employees.
6. **Advanced Lists**: 
    - **Waiting List**: Manage employees scheduled to return items.
    - **Leave-Out**: Track employees who have left the project.
7. **Admin Tools**: Approve/Reject new user signups.
8. **Data Export**: Export active borrowings and available inventory to Excel.

## 🚦 How to Start

### 1. Database Setup
Ensure you have **PostgreSQL** running and create a database named `ems_db`.
Update `backend/.env` with your credentials:
```env
DATABASE_URL=postgres://your_user:your_password@localhost:5432/ems_db
JWT_SECRET=your_random_secret
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000).

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
The client will run on [http://localhost:5173](http://localhost:5173).

## 🔑 Default Credentials
- **Username**: `admin`
- **Password**: `admin123` (Admin by default)
