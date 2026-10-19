import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ExpenseFilters } from '../types/index';

const initialState: ExpenseFilters = {
    search: '',
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    order: 'desc',
    page: 1
};

const expenseFilterSlice = createSlice({
    name: 'expenseFilter',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<ExpenseFilters>>) => {
            return { ...state, ...action.payload, page: 1 };
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetFilters: () => initialState
    }
});

export const { setFilter, setPage, resetFilters } = expenseFilterSlice.actions;
export default expenseFilterSlice.reducer;
