# Student Job Tracker – Frontend

A responsive React application for tracking student job applications. Built with **Vite**, **React**, **React Router**, **Tailwind CSS**, and **Context API**.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and visit:

   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm run preview`: Preview the production build

## Features

- User authentication (register/login)
- Add and view job applications
- Track status (Pending, Interview, Declined)
- Job types: Full-time, Part-time, Remote, Internship
- Add application link and date
- Responsive layout
- Protected dashboard routes
- Context-based state management

## Folder Structure

```
/src
  /assets         → Static assets (icons, images)
  /components     → Reusable components
  /context        → AuthContext, GlobalContext
  /pages          → Main pages (Login, Register, Dashboard, etc.)
  /utils          → Utility functions (coming soon)
App.jsx
main.jsx
```

## Environment Variables

Create a `.env` file in the root of the frontend with the following:

```
VITE_API_URL=http://localhost:3000
```

> Make sure this matches your backend server URL.

## Deployment

The frontend can be deployed on **Vercel** or any static hosting platform that supports Vite builds.