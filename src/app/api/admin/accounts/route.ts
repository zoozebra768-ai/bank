// Admin API routes for account management
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Account {
  id: number;
  name: string;
  number: string;
  balance: number;
  interestRate: string;
  routing: string;
  openedDate: string;
  type: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

// Ensure data directory exists
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read accounts from JSON file
function readAccounts(): Account[] {
  try {
    ensureDataDirectory();
    
    if (!fs.existsSync(ACCOUNTS_FILE)) {
      // Create initial file with sample data
      const initialAccounts: Account[] = [
        {
          id: 1,
          name: "Lisaglenn",
          number: "****4582",
          balance: 3500.00,
          interestRate: "2.5%",
          routing: "021000021",
          openedDate: "2023-01-15",
          type: "Checking"
        }
      ];
      
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(initialAccounts, null, 2));
      return initialAccounts;
    }
    
    const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading accounts:', error);
    return [];
  }
}

// Write accounts to JSON file
function writeAccounts(accounts: Account[]): boolean {
  try {
    ensureDataDirectory();
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing accounts:', error);
    return false;
  }
}

// GET /api/admin/accounts - Get all accounts
export async function GET() {
  try {
    const accounts = readAccounts();
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST /api/admin/accounts - Add new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, number, balance, interestRate, routing, openedDate, type } = body;
    
    if (!name || !number || balance === undefined || !interestRate || !routing || !openedDate || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: name, number, balance, interestRate, routing, openedDate, type' 
      }, { status: 400 });
    }
    
    const accounts = readAccounts();
    
    // Generate new ID
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    
    const newAccount: Account = {
      id: newId,
      name,
      number,
      balance: parseFloat(balance),
      interestRate,
      routing,
      openedDate,
      type
    };
    
    accounts.push(newAccount);
    
    if (writeAccounts(accounts)) {
      return NextResponse.json({ success: true, data: newAccount });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to add account' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// PUT /api/admin/accounts - Update account
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Account ID is required' }, { status: 400 });
    }
    
    const accounts = readAccounts();
    const index = accounts.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }
    
    // Convert balance to number if provided
    if (updates.balance !== undefined) {
      updates.balance = parseFloat(updates.balance);
    }
    
    accounts[index] = { ...accounts[index], ...updates };
    
    if (writeAccounts(accounts)) {
      return NextResponse.json({ success: true, data: accounts[index] });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update account' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// DELETE /api/admin/accounts - Delete account
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Account ID is required' }, { status: 400 });
    }
    
    const accounts = readAccounts();
    const filteredAccounts = accounts.filter(a => a.id !== parseInt(id));
    
    if (filteredAccounts.length === accounts.length) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }
    
    if (writeAccounts(filteredAccounts)) {
      return NextResponse.json({ success: true, message: 'Account deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete account' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

