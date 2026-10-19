import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { Category, Expense, User } from '../types';

interface Insights {
    totalUsers: number;
    totalExpenses: number;
    totalValue: number;
    monthlyExpenses: number;
    spendingPerCategory: { name: string; total: number }[];
    top5Categories: { name: string; count: number }[];
    bottom5Categories: { name: string; count: number }[];
    recentExpenses: Expense[];
    recentUsers: User[];
}

export default function AdminDashboard() {
    const [insights, setInsights] = useState<Insights | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        const [insightsRes, categoriesRes] = await Promise.all([
            API.get('/admin/insights'),
            API.get('/categories')
        ]);
        setInsights(insightsRes.data);
        setCategories(categoriesRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post('/categories', { name: newCategory });
            setNewCategory('');
            setSuccess('Category created!');
            setError('');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create category');
        }
    };

    const handleUpdateCategory = async () => {
        try {
            await API.put(`/categories/${editCategory?._id}`, { name: editName });
            setEditCategory(null);
            setSuccess('Category updated!');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Delete this category? Expenses will be moved to Uncategorized.')) {
            try {
                await API.delete(`/categories/${id}`);
                setSuccess('Category deleted!');
                fetchData();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>Admin Dashboard</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Grid container spacing={3} mb={4}>
                    {[
                        { label: 'Total Users', value: insights?.totalUsers },
                        { label: 'Total Expenses', value: insights?.totalExpenses },
                        { label: 'Total Value (RWF)', value: insights?.totalValue?.toLocaleString() },
                        { label: 'This Month Expenses', value: insights?.monthlyExpenses }
                    ].map(item => (
                        <Grid item xs={12} sm={6} md={3} key={item.label}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary">{item.label}</Typography>
                                    <Typography variant="h5" fontWeight="bold">{item.value ?? 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Spending per Category</Typography>
                                {insights?.spendingPerCategory.map(cat => (
                                    <Box key={cat.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{cat.name}</Typography>
                                        <Typography fontWeight="bold">{cat.total.toLocaleString()} RWF</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Top 5 Categories</Typography>
                                {insights?.top5Categories.map((cat, i) => (
                                    <Box key={cat.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{i + 1}. {cat.name}</Typography>
                                        <Typography>{cat.count} expenses</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Bottom 5 Categories</Typography>
                                {insights?.bottom5Categories.map((cat, i) => (
                                    <Box key={cat.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{i + 1}. {cat.name}</Typography>
                                        <Typography>{cat.count} expenses</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Recent Expenses</Typography>
                                {insights?.recentExpenses.map(e => (
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
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Recent Users</Typography>
                                {insights?.recentUsers.map(u => (
                                    <Box key={u._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{u.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Manage Categories</Typography>
                        <Box component="form" onSubmit={handleCreateCategory} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField label="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required size="small" fullWidth />
                            <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>Add Category</Button>
                        </Box>
                        {categories.filter(c => !c.isDefault).map(cat => (
                            <Box key={cat._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography>{cat.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button size="small" onClick={() => { setEditCategory(cat); setEditName(cat.name); }}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => handleDeleteCategory(cat._id)}>Delete</Button>
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>

                <Dialog open={Boolean(editCategory)} onClose={() => setEditCategory(null)}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogContent>
                        <TextField label="Category Name" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth sx={{ mt: 1 }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditCategory(null)}>Cancel</Button>
                        <Button variant="contained" onClick={handleUpdateCategory}>Update</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
