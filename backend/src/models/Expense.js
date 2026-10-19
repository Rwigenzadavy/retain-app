import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, required: true },
    paymentMethod: { type: String, enum: ['cash', 'credit_card', 'debit_card', 'mobile_money', 'other'], required: true },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
