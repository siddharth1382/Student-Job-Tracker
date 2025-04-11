# 🎯 Student Job Tracker

**Student Job Tracker** is a full-stack web application designed specifically for students to seamlessly track and manage their job applications. Built using the powerful MERN stack (MongoDB, Express, React, Node.js), it ensures a smooth user experience with secure authentication, efficient data handling, and a responsive UI.

---

## 🔧 Tech Stack

### 🖥️ Frontend
- **React (Vite)** – Fast build tool and modern frontend framework
- **Tailwind CSS** – Utility-first CSS framework for responsive design
- **React Router DOM** – Client-side routing
- **Context API** – Global state management for user authentication

### 🛠️ Backend
- **Node.js** – JavaScript runtime environment
- **Express** – Web application framework
- **MongoDB Atlas** – Cloud-based NoSQL database
- **JWT (JSON Web Token)** – Authentication and authorization

---

## 📁 Project Structure

```
/Student-Job-Tracker
├── /backend       → Node.js + Express + MongoDB API
├── /frontend      → React + Tailwind Client
└── README.md      → Main README file
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/siddharth1382/Student-Job-Tracker.git
cd Student-Job-Tracker
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `/backend` directory:

```ini
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `/frontend` directory:

```ini
VITE_API_URL=http://localhost:3000
```

Start the React development server:

```bash
npm run dev
```

---

## ✅ Features

- 🔐 User Registration & Login with JWT
- ➕ Add Job Applications with Position, Company, Type, and Status
- ✏️ Update and 🗑️ Delete Applications
- 🔍 Filter Jobs by Status (Pending, Interview, Declined)
- 📎 Add External Job Links and Application Dates
- 🌐 Responsive Design for all devices
- 🛡️ Protected Routes using Context API and JWT

---

## 🧪 API Testing

- Postman Collection is available in `/backend`
- Register and Login to receive a JWT token
- Use this token in headers to access protected routes

---

## 📦 Deployment

- **Backend**: [Render](https://render.com)
- **Frontend**: [Vercel](https://vercel.com)

---

## 📄 License

This project was built for educational and demo purposes, particularly as part of a Teaching Assistant application. You’re welcome to fork, clone, and modify the project for personal use.

---

## 🙌 Acknowledgments

Thanks to the open-source community and educators for continuous inspiration.

---

## ✨ Author

**Siddharth**  
[GitHub Profile](https://github.com/siddharth1382)

---
