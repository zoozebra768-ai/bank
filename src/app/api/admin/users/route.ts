// Admin API routes for user management
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read users from JSON file
function readUsers(): User[] {
  try {
    ensureDataDirectory();

    if (!fs.existsSync(USERS_FILE)) {
      // Create initial file with sample data
      const initialUsers: User[] = [
        {
          id: "linaglenn",
          email: "linawills48@gmail.com",
          password: "i4cu56725",
          name: "Linaglenn",
          role: "Customer"
        },
        {
          id: "admin",
          email: "support@rorybank.com",
          password: "admin123",
          name: "Admin User",
          role: "Administrator"
        }
      ];

      fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2));
      return initialUsers;
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Write users to JSON file
function writeUsers(users: User[]): boolean {
  try {
    ensureDataDirectory();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const users = readUsers();
    // Don't return passwords in the response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json({ success: true, data: usersWithoutPasswords });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/admin/users - Add new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { id, email, password, name, role, phone } = body;

    if (!id || !email || !password || !name || !role) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: id, email, password, name, role'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate role
    if (!['Customer', 'Administrator'].includes(role)) {
      return NextResponse.json({
        success: false,
        error: 'Role must be either "Customer" or "Administrator"'
      }, { status: 400 });
    }

    const users = readUsers();

    // Check if user ID or email already exists
    if (users.some(u => u.id === id || u.email === email)) {
      return NextResponse.json({
        success: false,
        error: 'User ID or email already exists'
      }, { status: 400 });
    }

    const newUser: User = {
      id,
      email,
      password, // In production, this should be hashed
      name,
      role,
      phone: phone || undefined
    };

    users.push(newUser);

    if (writeUsers(users)) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json({ success: true, data: userWithoutPassword });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to add user' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// PUT /api/admin/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Don't allow changing user ID
    if ('id' in updates) {
      delete updates.id;
    }

    // If email is being updated, check if it's already taken
    if (updates.email && users.some((u, i) => i !== index && u.email === updates.email)) {
      return NextResponse.json({
        success: false,
        error: 'Email already exists'
      }, { status: 400 });
    }

    // Validate role if being updated
    if (updates.role && !['Customer', 'Administrator'].includes(updates.role)) {
      return NextResponse.json({
        success: false,
        error: 'Role must be either "Customer" or "Administrator"'
      }, { status: 400 });
    }

    // Validate email format if being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid email format'
        }, { status: 400 });
      }
    }

    users[index] = { ...users[index], ...updates };

    if (writeUsers(users)) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = users[index];
      return NextResponse.json({ success: true, data: userWithoutPassword });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const users = readUsers();

    // Prevent deleting the last administrator
    const adminUsers = users.filter(u => u.role === 'Administrator');
    const userToDelete = users.find(u => u.id === id);

    if (userToDelete && userToDelete.role === 'Administrator' && adminUsers.length <= 1) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete the last administrator'
      }, { status: 400 });
    }

    const filteredUsers = users.filter(u => u.id !== id);

    if (filteredUsers.length === users.length) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (writeUsers(filteredUsers)) {
      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 });
  }
}





