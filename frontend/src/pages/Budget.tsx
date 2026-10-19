import { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { Budget as BudgetType } from '../types';

export default function Budget() {
    const [amount, setAmount] = useState('');
    const [budget, setBudget] = useState<BudgetType | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const { data } = await API.get('/budget', { params: { month, year } });
                setBudget(data);
                setAmount(data.budget.toString());
            } catch {}
        };
        fetchBudget();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/budget', { amount: Number(amount), month, year });
            setSuccess('Budget updated successfully!');
            setError('');
            const budgetRes = await API.get('/budget', { params: { month, year } });
            setBudget(budgetRes.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const statusColor = (status: string) => {
        if (status === 'over') return 'error';
        if (status === 'approaching') return 'warning';
        return 'success';
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Budget — {now.toLocaleString('default', { month: 'long' })} {year}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="Monthly Budget (RWF)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required fullWidth />
                            <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                                {budget ? 'Update Budget' : 'Set Budget'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {budget && (
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Monthly Budget</Typography>
                                <Typography fontWeight="bold">{budget.budget.toLocaleString()} RWF</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Total Spent</Typography>
                                <Typography fontWeight="bold">{budget.totalSpent.toLocaleString()} RWF</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Remaining</Typography>
                                <Typography fontWeight="bold" color={`${statusColor(budget.status)}.main`}>
                                    {budget.remaining.toLocaleString()} RWF
                                </Typography>
                            </Box>
                            <Alert severity={statusColor(budget.status) as any} sx={{ mt: 1 }}>
                                {budget.status === 'over' && 'You are over budget!'}
                                {budget.status === 'approaching' && 'You are approaching your budget limit!'}
                                {budget.status === 'within' && 'You are within your budget. Keep it up!'}
                            </Alert>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </>
    );
}
