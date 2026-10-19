import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Button, Typography, TextField, MenuItem, Card, CardContent, Pagination } from '@mui/material';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { RootState } from '../store';
import { setFilter, setPage, resetFilters } from '../store/expenseFilterSlice';
import { Expense, Category } from '../types';

export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.expenseFilter);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await API.get('/categories');
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            const { data } = await API.get('/expenses', { params: filters });
            setExpenses(data.expenses);
            setTotal(data.total);
            setPages(data.pages);
        };
        fetchExpenses();
    }, [filters]);

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Expenses ({total})</Typography>
                    <Button variant="contained" onClick={() => navigate('/expenses/new')}>+ Add Expense</Button>
                </Box>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <TextField label="Search" value={filters.search} onChange={(e) => dispatch(setFilter({ search: e.target.value }))} size="small" />
                            <TextField label="Category" select value={filters.category} onChange={(e) => dispatch(setFilter({ category: e.target.value }))} size="small" sx={{ minWidth: 150 }}>
                                <MenuItem value="">All</MenuItem>
                                {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                            </TextField>
                            <TextField label="Payment Method" select value={filters.paymentMethod} onChange={(e) => dispatch(setFilter({ paymentMethod: e.target.value }))} size="small" sx={{ minWidth: 150 }}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="credit_card">Credit Card</MenuItem>
                                <MenuItem value="debit_card">Debit Card</MenuItem>
                                <MenuItem value="mobile_money">Mobile Money</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                            <TextField label="Start Date" type="date" value={filters.startDate} onChange={(e) => dispatch(setFilter({ startDate: e.target.value }))} size="small" InputLabelProps={{ shrink: true }} />
                            <TextField label="End Date" type="date" value={filters.endDate} onChange={(e) => dispatch(setFilter({ endDate: e.target.value }))} size="small" InputLabelProps={{ shrink: true }} />
                            <TextField label="Sort By" select value={filters.sortBy} onChange={(e) => dispatch(setFilter({ sortBy: e.target.value as 'date' | 'amount' }))} size="small" sx={{ minWidth: 120 }}>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="amount">Amount</MenuItem>
                            </TextField>
                            <TextField label="Order" select value={filters.order} onChange={(e) => dispatch(setFilter({ order: e.target.value as 'asc' | 'desc' }))} size="small" sx={{ minWidth: 120 }}>
                                <MenuItem value="desc">Newest First</MenuItem>
                                <MenuItem value="asc">Oldest First</MenuItem>
                            </TextField>
                            <Button variant="outlined" onClick={() => dispatch(resetFilters())}>Reset</Button>
                        </Box>
                    </CardContent>
                </Card>

                {expenses.length === 0 && <Typography color="text.secondary">No expenses found.</Typography>}
                {expenses.map(expense => (
                    <Card key={expense._id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/expenses/${expense._id}`)}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography fontWeight="bold">{expense.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {expense.category.name} • {expense.paymentMethod.replace('_', ' ')} • {new Date(expense.date).toLocaleDateString()}
                                </Typography>
                                {expense.notes && <Typography variant="body2" color="text.secondary">{expense.notes}</Typography>}
                            </Box>
                            <Typography variant="h6" fontWeight="bold">{expense.amount.toLocaleString()} RWF</Typography>
                        </CardContent>
                    </Card>
                ))}

                {pages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination count={pages} page={filters.page} onChange={(_, value) => dispatch(setPage(value))} color="primary" />
                    </Box>
                )}
            </Container>
        </>
    );
}
