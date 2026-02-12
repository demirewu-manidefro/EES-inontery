# EMS Pro - Employee Material Management System

**Developed for:** Ethiopian Statistics Service (ESS)  
**Prepared by:** Demirewu Manidefro  
**System Architecture:** Modern MERN-style Stack (Node.js, Express, React, PostgreSQL)  
**preparation Date:** February 2026

---

## Abstract

The **Employee Material Management System (EMS Pro)** is a professional-grade digital solution designed to replace manual, paper-based tracking of office materials at the Ethiopian Statistics Service (ESS). 

This version represents a total architectural overhaul, transitioning from a Python/Flask monolith to a high-performance **Decoupled Architecture**:
*   **Backend:** Node.js & Express.js with Sequelize ORM.
*   **Frontend:** React.jsx with Tailwind CSS and Framer Motion for premium aesthetics.
*   **Database:** PostgreSQL for robust relational data management.

The system provides real-time tracking, advanced role-based access control, dynamic data visualization, and comprehensive Excel reporting.

---

## Key Features

- **Dynamic Dashboard:** Real-time statistics and quick actions for managers.
- **Advanced Inventory:** Unified view of available and borrowed materials with real-time status updates.
- **Smart Employee Management:** Track workforce attendance, projects, and material allocation.
- **Modern Borrow/Return Workflow:** Streamlined process for bulk or individual material allocation.
- **Premium UI/UX:** Dark mode support, smooth animations, and responsive design for all devices.
- **Total Data Portability:** One-click Excel exports for every data view (Employees, Inventory, Waiting List, Leave Out).
- **Secure Authentication:** JWT-based login with hashed passwords and administrative approval workflows.

---

## Tools and Technologies

| Category | Tool / Technology |
|-----------|-------------------|
| **Backend** | Node.js, Express.js |
| **Frontend** | React, Tailwind CSS, Lucide React, Framer Motion |
| **Database** | PostgreSQL |
| **ORM** | Sequelize |
| **Report Generation** | XLSX (Excel) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js |
| **Version Control** | Git & GitHub |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/demirewu-manidefro/EES-inontery.git
   cd Employee_material_managment_system
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with DATABASE_URL and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## Author

**Demirewu Manidefro**  
Developer – Employee Material Management System (ESS)  
Prepared on February 2026
