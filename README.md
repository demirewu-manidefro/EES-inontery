# EES Inventory System

An Equipment & Employee Management System (EES) designed to handle inventory management, employee records, and material borrowing/returning processes.

## Project Structure

The project is structured as a full-stack web application:
- **`backend/`**: Node.js & Express server with a PostgreSQL database (using Sequelize ORM).
- **`frontend/`**: React application built with Vite and styled with Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration with Role-Based Access Control (Admin/User).
- **Dashboard**: Overview of key metrics and statistics (using Recharts).
- **Employee Management**: Add, update, and track employee details, including a "Leave Out" feature for tracking departing employees.
- **Material & Inventory Management**: Track all materials and equipment available in the system.
- **Borrowing & Returning System**:
  - Request materials to borrow.
  - Track borrowed items.
  - Process returns and handle items in a "Waiting Return" state.
  - Admin approvals for borrowing requests.
- **Gallery & News**: Informational pages for organization updates.

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT & bcryptjs
- **File Uploads**: Multer
- **Data Parsing**: csv-parser & xlsx

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend/` directory with your PostgreSQL database credentials and JWT secret (e.g., `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).
4. Run the server:
   ```bash
   npm run dev
   ```
   *Note: On the first run, Sequelize will automatically sync the models and create a default admin user (`admin` / `admin123`).*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the provided Vite URL (typically `http://localhost:5173`).

## Default Credentials
- **Username:** admin
- **Password:** admin123
