# Retain - Personal Expense & Budget Manager

A full-stack web application for managing personal expenses and monthly budgets.

## Live Demo
> Coming soon (deployment link will be added here)

## Technologies Used

**Frontend:**
- React + TypeScript + Vite
- Material UI (MUI)
- React Router v6
- React Context (authentication)
- Redux Toolkit (filtering/sorting)
- Axios

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## Main Features

- User authentication (sign up, sign in, sign out)
- Create, view, update, delete expenses
- Filter expenses by category, payment method, date, amount
- Search and sort expenses
- Set and monitor monthly budget
- User dashboard with spending summary
- Admin dashboard with platform insights
- Admin category management
- Protected routes based on user roles
- Pagination for expense listings
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```

### Create a .env file in the backend folder

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

```bash     
npm run seed
npm run dev
```
