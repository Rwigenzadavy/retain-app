import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

export const setBudget = async (req, res) => {
    try {
        const { amount, month, year } = req.body;

        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, month, year },
            { amount },
            { new: true, upsert: true }
        );

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;

        const budget = await Budget.findOne({
            user: req.user._id,
            month: Number(month),
            year: Number(year)
        });

        if (!budget) return res.status(404).json({ message: 'No budget set for this month' });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const expenses = await Expense.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const remaining = budget.amount - totalSpent;

        let status = 'within';
        if (totalSpent > budget.amount) status = 'over';
        else if (remaining / budget.amount <= 0.2) status = 'approaching';

        res.json({ budget: budget.amount, totalSpent, remaining, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
