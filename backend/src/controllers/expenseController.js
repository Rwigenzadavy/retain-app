import Expense from '../models/Expense.js';
import Category from '../models/Category.js';

export const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, paymentMethod, notes } = req.body;
        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount,
            category,
            date,
            paymentMethod,
            notes
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const { category, paymentMethod, startDate, endDate, minAmount, maxAmount, search, sortBy, order, page, limit } = req.query;

        const filter = { user: req.user._id };

        if (category) filter.category = category;
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = Number(minAmount);
            if (maxAmount) filter.amount.$lte = Number(maxAmount);
        }
        if (search) filter.title = { $regex: search, $options: 'i' };

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortField = sortBy === 'amount' ? 'amount' : 'date';

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const total = await Expense.countDocuments(filter);
        const expenses = await Expense.find(filter)
            .populate('category', 'name')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNum);

        res.json({ expenses, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id).populate('category', 'name');
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await expense.deleteOne();
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
