export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
}

export interface Category {
    _id: string;
    name: string;
    isDefault: boolean;
}

export interface Expense {
    _id: string;
    user: string;
    title: string;
    amount: number;
    category: Category;
    date: string;
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'mobile_money' | 'other';
    notes?: string;
    createdAt: string;
}

export interface Budget {
    budget: number;
    totalSpent: number;
    remaining: number;
    status: 'within' | 'approaching' | 'over';
}

export interface ExpenseFilters {
    search: string;
    category: string;
    paymentMethod: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    sortBy: 'date' | 'amount';
    order: 'asc' | 'desc';
    page: number;
}
