// Admin API routes for transaction backups
import { NextRequest, NextResponse } from 'next/server';
import { adminBackupTransactions, adminRestoreTransactions } from '@/lib/transactions';
import fs from 'fs';
import path from 'path';

// POST /api/admin/backup - Create backup
export async function POST() {
  try {
    const backupFile = adminBackupTransactions();
    
    if (backupFile) {
      return NextResponse.json({ 
        success: true, 
        message: 'Backup created successfully',
        backupFile: path.basename(backupFile)
      });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to create backup' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create backup' }, { status: 500 });
  }
}

// GET /api/admin/backup - List available backups
export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir);
    const backupFiles = files
      .filter(file => file.startsWith('transactions-backup-') && file.endsWith('.json'))
      .map(file => ({
        filename: file,
        created: fs.statSync(path.join(dataDir, file)).mtime
      }))
      .sort((a, b) => b.created.getTime() - a.created.getTime());
    
    return NextResponse.json({ success: true, data: backupFiles });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to list backups' }, { status: 500 });
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
    
    const dataDir = path.join(process.cwd(), 'data');
    const backupFile = path.join(dataDir, filename);
    
    const success = adminRestoreTransactions(backupFile);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Backup restored successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to restore backup' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

