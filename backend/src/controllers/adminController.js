import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';

export const getAdminInsights = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalExpenses = await Expense.countDocuments();
        const totalValue = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyExpenses = await Expense.countDocuments({ createdAt: { $gte: startOfMonth } });

        const spendingPerCategory = await Expense.aggregate([
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $project: { name: '$category.name', total: 1 } }
        ]);

        const categoryUsage = await Expense.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $project: { name: '$category.name', count: 1 } },
            { $sort: { count: -1 } }
        ]);

        const top5 = categoryUsage.slice(0, 5);
        const bottom5 = categoryUsage.slice(-5).reverse();

        const recentExpenses = await Expense.find()
            .populate('user', 'name email')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        const recentUsers = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalUsers,
            totalExpenses,
            totalValue: totalValue[0]?.total || 0,
            monthlyExpenses,
            spendingPerCategory,
            top5Categories: top5,
            bottom5Categories: bottom5,
            recentExpenses,
            recentUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
