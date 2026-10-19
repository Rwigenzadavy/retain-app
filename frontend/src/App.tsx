import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoute, AdminRoute } from './components/AuthRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import Budget from './pages/Budget';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
            <Route path="/expenses" element={<AuthRoute><Expenses /></AuthRoute>} />
            <Route path="/expenses/new" element={<AuthRoute><ExpenseForm /></AuthRoute>} />
            <Route path="/expenses/:id" element={<AuthRoute><ExpenseForm /></AuthRoute>} />
            <Route path="/budget" element={<AuthRoute><Budget /></AuthRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
