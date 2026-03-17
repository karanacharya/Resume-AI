# Resume-AI

**Resume-AI** is a simple full-stack application that helps users generate resumes (based on a job description) and interview reports while managing user authentication using AI-powered services.

## What is this project?
This project is designed to let users register, log in, and create AI-generated resumes and interview reports based on a given job description. It includes a React frontend for the user interface and a Node/Express backend that handles authentication, report generation, and API communication.

## Features
- ✅ User registration and login (JWT-based authentication)
- ✅ Protected routes to keep user data secure
- ✅ Resume generation based on job description using AI services
- ✅ Interview report generation using AI services
- ✅ Clear separation between frontend (React + Vite) and backend (Node + Express)

## Getting Started
### 1) Backend
1. Go to the backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

### 2) Frontend
1. Go to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `Backend/` – Express server, controllers, models, and API routes
- `Frontend/` – React app with routes, context, hooks, and pages

## Notes
- Make sure the backend is running before using the frontend
- Add any required environment variables (e.g., database connection, JWT secret, AI API key) in the backend configuration

---

If you want to improve the project, consider adding better error handling, user profiles, and more advanced AI report customization.
