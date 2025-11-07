# Complaint Management System - Frontend

A React-based frontend application for a complaint management system. This system allows staff members to submit complaints without login, admins to manage complaints and workers, and workers to update ticket statuses.

## Features

### Staff Portal (No Login Required)
- Submit complaints with image uploads
- Select department and provide location
- Add detailed descriptions

### Admin Portal
- Login with JWT authentication
- Dashboard with statistics
- View all complaints with filtering
- Create tickets and assign to workers
- Manage worker accounts (create, update, delete)

### Worker Portal
- Login with JWT authentication
- View assigned tickets
- Update ticket status (Pending → In Progress → Resolved)
- Add updates/notes to tickets
- View personal statistics

## Tech Stack

- React 19 + Vite
- React Router DOM
- Axios
- Context API for state management

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## Default Login Credentials

**Admin:**
- Email: admin@complaintmanagement.com
- Password: admin123

**Worker (IT):**
- Email: worker.it@complaintmanagement.com
- Password: worker123

## Routes

- `/` - Home page
- `/submit-complaint` - Staff complaint form
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/complaints` - Manage complaints
- `/admin/workers` - Manage workers
- `/worker/login` - Worker login
- `/worker/dashboard` - Worker dashboard

## License

ISC
