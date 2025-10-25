// Admin API routes for transaction backups
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

// Read transactions from JSON file
function readTransactions() {
  try {
    ensureDirectories();
    
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
function writeTransactions(transactions: unknown[]): boolean {
  try {
    ensureDirectories();
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing transactions:', error);
    return false;
  }
}

// POST /api/admin/backup - Create backup
export async function POST() {
  try {
    ensureDirectories();
    
    const transactions = readTransactions();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUPS_DIR, `transactions_${timestamp}.json`);
    
    fs.writeFileSync(backupFile, JSON.stringify(transactions, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        filename: `transactions_${timestamp}.json`,
        created: new Date().toISOString()
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create backup' }, { status: 500 });
  }
}

// GET /api/admin/backup - List available backups
export async function GET() {
  try {
    ensureDirectories();
    
    const files = fs.readdirSync(BACKUPS_DIR);
    const backups = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const stats = fs.statSync(path.join(BACKUPS_DIR, file));
        return {
          filename: file,
          created: stats.birthtime.toISOString(),
          size: stats.size
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    return NextResponse.json({ success: true, data: backups });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch backups' }, { status: 500 });
  }
}

// PUT /api/admin/backup - Restore from backup
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename } = body;
    
    if (!filename) {
      return NextResponse.json({ success: false, error: 'Backup filename is required' }, { status: 400 });
    }
    
    ensureDirectories();
    
    const backupFile = path.join(BACKUPS_DIR, filename);
    
    if (!fs.existsSync(backupFile)) {
      return NextResponse.json({ success: false, error: 'Backup file not found' }, { status: 404 });
    }
    
    const data = fs.readFileSync(backupFile, 'utf8');
    const transactions = JSON.parse(data);
    
    if (writeTransactions(transactions)) {
      return NextResponse.json({ success: true, message: 'Backup restored successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to restore backup' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

