import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        if (!fs.existsSync(ACCOUNTS_FILE)) {
            return NextResponse.json({ success: false, error: 'Accounts data not found' }, { status: 404 });
        }

        const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
        const accounts = JSON.parse(data);
        const account = accounts.find((a: any) => a.userId === userId);

        if (!account) {
            return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: account });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch account' }, { status: 500 });
    }
}
