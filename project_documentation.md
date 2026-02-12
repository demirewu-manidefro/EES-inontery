# Employee Material Management System - Project Documentation

> **Note:** This documentation is optimized for importing into presentation tools like Gamma.

---

## 1. Project Overview

### **Project Title**
**Employee Material Management System (EMMS)**

### **About the Project**
The **Employee Material Management System (EMMS)** is a comprehensive web-based platform designed for the **Ethiopian Statistics Service (ESS)**. It modernizes the workflow for tracking office assets, personnel, and equipment lending lifecycles, moving from a manual paper-based process to a centralized digital solution.

![Screenshot: System Landing Page - Shows the ESS Logo and "Enter Portal" button]

### **Core Objectives**
1.  **Digital Transformation:** Eliminate physical registers and reduce human error.
2.  **Asset Accountability:** Track every item from acquisition to assignment to return.
3.  **Real-Time Logistics:** Instantly view who has what item and for how long.
4.  **Secure Management:** Role-based access ensuring only authorized personnel can modify records.

---

## 2. User Interface & Experience (UI/UX)

The system features a modern, responsive interface built with **Bootstrap 5** and **Lucide Icons**.

### **Master Dashboard**
The central hub for all operations. It provides an at-a-glance view of system health.

**Key Widgets:**
-   **Total Staff:** Real-time count of active employees.
-   **Stock Inventory:** Total number of registered tracking units.
-   **Borrowed Items:** Number of items currently deployed in the field.
-   **Waitlist:** Staff members pending item return clearance.

![Screenshot: Master Dashboard - Showing the 4 colored statistic cards and the main functional grid]

---

## 3. Functional Modules

### **A. Workforce Management**
Manage personnel records with detailed demographic and professional data.

**Features:**
-   **Add Personnel:** Capture comprehensive data including:
    -   *Personal:* First Name, Father's Name, Grandfather's Name, Sex, Phone.
    -   *Professional:* Position, Employment Status (Permanent/Contract), Assigned Project.
-   **Bulk Import:** Upload hundreds of employee records via Excel/CSV.
-   **Staff Directory:** A searchable list of all active employees.

![Screenshot: Add Employee Form - Shows the input fields for employee registration]

### **B. Inventory Control**
A robust system for tracking physical assets.

**Features:**
-   **Material Registration:** uniquely identify items by **Name** and **Serial Number**.
-   **Status Tracking:** Items are automatically marked as `available` or `borrowed`.
-   **Batch Upload:** Import initial inventory stocks via Excel templates.

![Screenshot: Inventory List - A table showing materials and their current status]

### **C. Deployment & Logistics (Borrow/Return)**
The core transactional engine of the system.

**Workflow:**
1.  **Issue Material:** Select an employee and multiple available items to assign them for a specific purpose.
    -   *Logic:* Only `available` materials appear in the selection list.
2.  **Tracking:** Assigned items are linked to the employee's profile.
3.  **Return Process:**
    -   **Individual Return:** Return specific items (e.g., just the laptop, keep the mouse).
    -   **Bulk Return:** "Return All" function for immediate clearance.
4.  **Waitlist:** Flag employees who need to return items but haven't yet, ensuring they don't get overlooked during clearance.

![Screenshot: Borrow Material Screen - The form to select an employee and check off items to borrow]

---

## 4. Technical Architecture

### **Technology Stack**
| Layer | Tech | Role |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Bootstrap 5 | Responsive UI & Layouts |
| **Backend** | Python (Flask 2.3) | API, Routing, & Business Logic |
| **Database** | PostgreSQL | Relational Data Storage |
| **Security** | Flask-Login | Session Managment & Auth |
| **Icons** | Lucide React | Modern visual indicators |

### **Database Schema**
The system relies on a relational model to ensure data integrity.

-   **`Employees`**: Stores staff bio-data.
-   **`Materials`**: Stores asset inventory (Unique Serial Numbers).
-   **`BorrowedMaterials`**: Link table resolving Many-to-Many relationships between Employees and Materials.
-   **`Users`**: System administrators and managers with hashed passwords.
-   **`LeaveOutMembers`**: Archive of former employees.

---

## 5. Security & Administration

### **Role-Based Access Control (RBAC)**
-   **Administrator:** unique access to:
    -   Approve/Reject new user registrations.
    -   Import bulk data (Users/Employees/Materials).
-   **System User:** Standard access to Borrow/Return functions and Reference lists.

### **Account Security**
-   **User Approval:** New registrations are "Pending" until an Admin explicitly approves them.
-   **Password Encryption:** All passwords are hashed using `pbkdf2:sha256` before storage.

![Screenshot: User Approval Screen - Admin view showing pending user requests]

---

## 6. Installation Guide

1.  **Environment Setup**
    Ensure you have `Python 3.8+` and `PostgreSQL` installed.

2.  **Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Initialization**
    ```bash
    python init_db.py
    ```

4.  **Run Application**
    ```bash
    flask run
    ```

5.  **Access**
    Navigate to `http://127.0.0.1:5000` in your web browser.

---

## 7. Future Roadmap
-   **Automated Email Alerts:** For overdue returns.
-   **Barcode Integration:** Scan items to borrow/return instantly.
-   **Mobile Application:** A dedicated Android/iOS app for field logistics.
