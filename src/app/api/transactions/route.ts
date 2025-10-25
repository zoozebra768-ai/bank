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
      // Create initial file with sample data
      const initialTransactions: Transaction[] = [
        {
          id: 1,
          name: "Salary Deposit",
          amount: 3500.00,
          date: "2024-10-01",
          time: "09:00",
          category: "Income",
          status: "Processed",
          merchant: "Employer Corp",
          type: "deposit"
        },
        {
          id: 2,
          name: "Coffee Shop",
          amount: -5.67,
          date: "2024-10-15",
          time: "08:30",
          category: "Food & Dining",
          status: "Processed",
          merchant: "Starbucks #4523",
          type: "withdrawal"
        },
        {
          id: 3,
          name: "Grocery Store",
          amount: -89.45,
          date: "2024-10-18",
          time: "14:20",
          category: "Groceries",
          status: "Processed",
          merchant: "Whole Foods Market",
          type: "withdrawal"
        },
        {
          id: 4,
          name: "Gas Station",
          amount: -45.20,
          date: "2024-10-19",
          time: "16:45",
          category: "Transportation",
          status: "Processed",
          merchant: "Shell Station #123",
          type: "withdrawal"
        },
        {
          id: 5,
          name: "Online Purchase",
          amount: -127.99,
          date: "2024-10-20",
          time: "20:15",
          category: "Shopping",
          status: "Pending",
          merchant: "Amazon.com",
          type: "withdrawal"
        }
      ];
      
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(initialTransactions, null, 2));
      return initialTransactions;
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

// GET /api/transactions - Get all transactions
export async function GET() {
  try {
    const transactions = readTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST /api/transactions - Add new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transactions = readTransactions();
    
    // Generate new ID
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    
    const newTransaction: Transaction = {
      ...body,
      id: newId
    };
    
    transactions.push(newTransaction);
    
    if (writeTransactions(transactions)) {
      return NextResponse.json({ success: true, data: newTransaction });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add transaction' }, { status: 500 });
  }
}

// PUT /api/transactions - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
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
    return NextResponse.json({ success: false, error: 'Failed to update transaction' }, { status: 500 });
  }
}

// DELETE /api/transactions - Delete transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    const transactions = readTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (filteredTransactions.length === transactions.length) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }
    
    if (writeTransactions(filteredTransactions)) {
      return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete transaction' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete transaction' }, { status: 500 });
  }
}

