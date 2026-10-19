import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { Expense, Budget } from '../types';

interface DashboardData {
    totalSpent: number;
    remainingBudget: number | null;
    budgetStatus: string | null;
    highestExpense: Expense | null;
    recentExpenses: Expense[];
    spendingByCategory: { name: string; total: number }[];
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData>({
        totalSpent: 0,
        remainingBudget: null,
        budgetStatus: null,
        highestExpense: null,
        recentExpenses: [],
        spendingByCategory: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();

                const expensesRes = await API.get('/expenses', {
                    params: { limit: 100, page: 1 }
                });
                const allExpenses: Expense[] = expensesRes.data.expenses;

                const monthlyExpenses = allExpenses.filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() + 1 === month && d.getFullYear() === year;
                });

                const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
                const highestExpense = monthlyExpenses.reduce((max, e) => e.amount > (max?.amount || 0) ? e : max, null as Expense | null);

                const categoryMap: { [key: string]: number } = {};
                monthlyExpenses.forEach(e => {
                    const catName = e.category.name;
                    categoryMap[catName] = (categoryMap[catName] || 0) + e.amount;
                });
                const spendingByCategory = Object.entries(categoryMap).map(([name, total]) => ({ name, total }));

                let budgetData: Budget | null = null;
                try {
                    const budgetRes = await API.get('/budget', { params: { month, year } });
                    budgetData = budgetRes.data;
                } catch {}

                setData({
                    totalSpent,
                    remainingBudget: budgetData?.remaining ?? null,
                    budgetStatus: budgetData?.status ?? null,
                    highestExpense,
                    recentExpenses: allExpenses.slice(0, 5),
                    spendingByCategory
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const statusColor = (status: string | null) => {
        if (status === 'over') return 'error.main';
        if (status === 'approaching') return 'warning.main';
        return 'success.main';
    };

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>My Dashboard</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Total Spent (This Month)</Typography>
                                <Typography variant="h5" fontWeight="bold">{data.totalSpent.toLocaleString()} RWF</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Remaining Budget</Typography>
                                <Typography variant="h5" fontWeight="bold" color={statusColor(data.budgetStatus)}>
                                    {data.remainingBudget !== null ? `${data.remainingBudget.toLocaleString()} RWF` : 'No budget set'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Budget Status</Typography>
                                <Typography variant="h5" fontWeight="bold" color={statusColor(data.budgetStatus)} sx={{ textTransform: 'capitalize' }}>
                                    {data.budgetStatus || 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Highest Expense</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {data.highestExpense ? `${data.highestExpense.amount.toLocaleString()} RWF` : 'N/A'}
                                </Typography>
                                {data.highestExpense && <Typography variant="body2">{data.highestExpense.title}</Typography>}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Spending by Category</Typography>
                                {data.spendingByCategory.length === 0 && <Typography color="text.secondary">No expenses this month</Typography>}
                                {data.spendingByCategory.map(cat => (
                                    <Box key={cat.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{cat.name}</Typography>
                                        <Typography fontWeight="bold">{cat.total.toLocaleString()} RWF</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Recent Expenses</Typography>
                                    <Button size="small" onClick={() => navigate('/expenses')}>View All</Button>
                                </Box>
                                {data.recentExpenses.length === 0 && <Typography color="text.secondary">No expenses yet</Typography>}
                                {data.recentExpenses.map(e => (
                                    <Box key={e._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box>
                                            <Typography>{e.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{e.category.name}</Typography>
                                        </Box>
                                        <Typography fontWeight="bold">{e.amount.toLocaleString()} RWF</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

