const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoDB_URI ='mongodb+srv://4RtMHUnf9g9anFRE:4RtMHUnf9g9anFRE@facebookdt.6rfak.mongodb.net/your-db-name?retryWrites=true&w=majority&appName=facebookdt';

mongoose.connect(mongoDB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Define models
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
    amount: Number,
    description: String,
    category: String,
    type: { type: String, enum: ['expense', 'income'] },
    date: String,
    source: String
}));

// Routes
app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.post('/transactions', async (req, res) => {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
});

app.put('/transactions/:id', async (req, res) => {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/transactions/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
