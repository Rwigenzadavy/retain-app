import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    Retain
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button color="inherit" onClick={() => navigate('/expenses')}>Expenses</Button>
                    <Button color="inherit" onClick={() => navigate('/budget')}>Budget</Button>
                    {user?.role === 'admin' && (
                        <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
                    )}
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
