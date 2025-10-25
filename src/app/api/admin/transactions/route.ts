// Admin API routes for transaction management
import { NextRequest, NextResponse } from 'next/server';
import { 
  adminAddTransaction, 
  adminUpdateTransaction, 
  adminDeleteTransaction, 
  adminGetTransactionById,
  adminGetNextTransactionId,
  adminBackupTransactions,
  adminRestoreTransactions,
  getTransactions
} from '@/lib/transactions';

// GET /api/admin/transactions - Get all transactions
export async function GET() {
  try {
    const transactions = getTransactions();
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
    
    if (!name || amount === undefined || !date || !time || !category || !status || !merchant || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: name, amount, date, time, category, status, merchant, type' 
      }, { status: 400 });
    }
    
    // Validate type
    if (!['deposit', 'withdrawal'].includes(type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type must be either "deposit" or "withdrawal"' 
      }, { status: 400 });
    }
    
    const newTransaction = adminAddTransaction({
      name,
      amount: parseFloat(amount),
      date,
      time,
      category,
      status,
      merchant,
      type
    });
    
    if (newTransaction) {
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
    
    const updatedTransaction = adminUpdateTransaction(id, updates);
    
    if (updatedTransaction) {
      return NextResponse.json({ success: true, data: updatedTransaction });
    } else {
      return NextResponse.json({ success: false, error: 'Transaction not found or update failed' }, { status: 404 });
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
    
    const success = adminDeleteTransaction(parseInt(id));
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Transaction not found or delete failed' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

