// Admin API routes for transaction management
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  status: string;
  merchant: string;
  type: "deposit" | "withdrawal";
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

// Ensure data directory exists
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read transactions from JSON file
function readTransactions(): Transaction[] {
  try {
    ensureDataDirectory();
    
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
}

// Write transactions to JSON file
function writeTransactions(transactions: Transaction[]): boolean {
  try {
    ensureDataDirectory();
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing transactions:', error);
    return false;
  }
}

// GET /api/admin/transactions - Get all transactions
export async function GET() {
  try {
    const transactions = readTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/admin/transactions - Add new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, amount, date, time, category, status, merchant, type } = body;
    
    if (!name || amount === undefined || !category || !status || !merchant || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: name, amount, category, status, merchant, type' 
      }, { status: 400 });
    }
    
    // Validate type
    if (!['deposit', 'withdrawal'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type must be either "deposit" or "withdrawal"' 
      }, { status: 400 });
    }
    
    const transactions = readTransactions();
    
    // Generate new ID
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    
    // Use current date/time if not provided
    const currentDate = new Date();
    const transactionDate = date || currentDate.toISOString().split('T')[0];
    const transactionTime = time || currentDate.toTimeString().slice(0, 5);
    
    const newTransaction: Transaction = {
      id: newId,
      name,
      amount: parseFloat(amount),
      date: transactionDate,
      time: transactionTime,
      category,
      status,
      merchant,
      type
    };
    
    transactions.push(newTransaction);
    
    if (writeTransactions(transactions)) {
      return NextResponse.json({ success: true, data: newTransaction });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to add transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// PUT /api/admin/transactions - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Transaction ID is required' }, { status: 400 });
    }
    
    const transactions = readTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }
    
    transactions[index] = { ...transactions[index], ...updates };
    
    if (writeTransactions(transactions)) {
      return NextResponse.json({ success: true, data: transactions[index] });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// DELETE /api/admin/transactions - Delete transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Transaction ID is required' }, { status: 400 });
    }
    
    const transactions = readTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== parseInt(id));
    
    if (filteredTransactions.length === transactions.length) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }
    
    if (writeTransactions(filteredTransactions)) {
      return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

