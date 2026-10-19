import Category from '../models/Category.js';
import Expense from '../models/Expense.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await Category.findOne({ name });
        if (exists) return res.status(400).json({ message: 'Category already exists' });
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (category.isDefault) return res.status(400).json({ message: 'Cannot update default category' });
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (category.isDefault) return res.status(400).json({ message: 'Cannot delete default category' });

        const defaultCategory = await Category.findOne({ isDefault: true });
        if (defaultCategory) {
            await Expense.updateMany({ category: category._id }, { category: defaultCategory._id });
        }

        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
