import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { Category } from '../types';

const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Other' }
];

export default function ExpenseForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await API.get('/categories');
            setCategories(data);
        };
        fetchCategories();

        if (isEdit) {
            const fetchExpense = async () => {
                const { data } = await API.get(`/expenses/${id}`);
                setTitle(data.title);
                setAmount(data.amount.toString());
                setCategory(data.category._id);
                setDate(data.date.split('T')[0]);
                setPaymentMethod(data.paymentMethod);
                setNotes(data.notes || '');
            };
            fetchExpense();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { title, amount: Number(amount), category, date, paymentMethod, notes };
            if (isEdit) {
                await API.put(`/expenses/${id}`, payload);
            } else {
                await API.post('/expenses', payload);
            }
            navigate('/expenses');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            await API.delete(`/expenses/${id}`);
            navigate('/expenses');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    {isEdit ? 'Edit Expense' : 'New Expense'}
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
                    <TextField label="Amount (RWF)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required fullWidth />
                    <TextField label="Category" select value={category} onChange={(e) => setCategory(e.target.value)} required fullWidth>
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
                    <TextField label="Payment Method" select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required fullWidth>
                        {paymentMethods.map(pm => (
                            <MenuItem key={pm.value} value={pm.value}>{pm.label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={3} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            {isEdit ? 'Update Expense' : 'Add Expense'}
                        </Button>
                        {isEdit && (
                            <Button variant="outlined" color="error" fullWidth onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                    </Box>
                    <Button variant="text" onClick={() => navigate('/expenses')}>Cancel</Button>
                </Box>
            </Container>
        </>
    );
}
