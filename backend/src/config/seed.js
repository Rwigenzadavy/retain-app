import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const exists = await Category.findOne({ isDefault: true });
        if (!exists) {
            await Category.create({ name: 'Uncategorized', isDefault: true });
            console.log('Default category created');
        } else {
            console.log('Default category already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

seed();
