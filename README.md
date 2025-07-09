# 🐞 Bug-Tracker

A smart bug tracking system built with **MERN stack + Tailwind CSS** that supports user authentication (via Google OAuth and Admin-based login), AI-powered bug type and priority prediction, and a role-based dashboard for reporters and developers.

---

## 🚀 Features

- 🔐 **Authentication**
  - Google Sign-In using Passport.js
  - Username & Password (Admin-managed)
  
- 🐛 **Bug Reporting**
  - Report bugs with description, priority, assigned developer, and type.
  - AI-assisted bug type and priority prediction based on bug description.

- 🧑‍💻 **Role-based Dashboards**
  - **Reporter View**:
    - Submit bugs
    - View all personal bug reports and their status
  - **Developer View**:
    - See all bugs
    - Update bug priority, status, and assignment

- 🎨 **Modern UI**
  - Tailwind CSS-based styling
  - Fully responsive design

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Bootstrap (for optional components)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Passport.js (Google OAuth + Local Strategy)
- **AI Integration**: Predicts bug priority & type using simple ML logic/API



