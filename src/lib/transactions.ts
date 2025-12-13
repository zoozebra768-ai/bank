// Transaction data for the banking application
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

// Get current user ID from localStorage
const getCurrentUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.id;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return undefined;
};

// Get transactions from API for current user
export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  try {
    const effectiveUserId = userId || getCurrentUserId();
    const url = effectiveUserId
      ? `/api/transactions?userId=${effectiveUserId}`
      : '/api/transactions';

    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Helper functions for transaction data
export const getTransactionsByType = async (type: "deposit" | "withdrawal" | "all") => {
  const transactions = await getTransactions();
  if (type === "all") return transactions;
  return transactions.filter(t => t.type === type);
};

export const getTotalIncome = async () => {
  const transactions = await getTransactions();
  return transactions.filter(t => t.type === "deposit" && t.status === "Processed").reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = async () => {
  const transactions = await getTransactions();
  return Math.abs(transactions.filter(t => t.type === "withdrawal" && t.status === "Processed").reduce((sum, t) => sum + t.amount, 0));
};

export const getNetBalance = async () => {
  const income = await getTotalIncome();
  const expenses = await getTotalExpenses();
  return income - expenses;
};

export const getAvailableBalance = async () => {
  const transactions = await getTransactions();
  const processedTransactions = transactions.filter(t => t.status === "Processed");

  const totalDeposits = processedTransactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = processedTransactions
    .filter(t => t.type === "withdrawal")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return totalDeposits - totalWithdrawals;
};

export const getCompletedTransactions = async () => {
  const transactions = await getTransactions();
  return transactions.filter(t => t.status === "Processed");
};

export const getPendingTransactions = async () => {
  const transactions = await getTransactions();
  return transactions.filter(t => t.status === "Pending");
};

export const getStatementData = async () => {
  const transactions = await getTransactions();
  const totalIncome = await getTotalIncome();
  const totalExpenses = await getTotalExpenses();
  const netBalance = await getNetBalance();

  return {
    accountHolder: "Lisaglenn",
    accountNumber: "****4582",
    statementPeriod: "October 1 - October 19, 2025",
    statementDate: new Date().toLocaleDateString(),
    openingBalance: 3500.00,
    totalIncome,
    totalExpenses,
    closingBalance: netBalance,
    transactions: transactions.map(t => ({
      date: t.date,
      time: t.time,
      description: t.name,
      merchant: t.merchant,
      category: t.category,
      amount: t.amount,
      status: t.status
    }))
  };
};

// Admin functions for managing transactions
export const adminAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  try {
    const response = await fetch('/api/admin/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
};

export const adminUpdateTransaction = async (id: number, updates: Partial<Transaction>) => {
  try {
    const response = await fetch('/api/admin/transactions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return null;
  }
};

export const adminDeleteTransaction = async (id: number) => {
  try {
    const response = await fetch(`/api/admin/transactions?id=${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

export const adminGetTransactionById = async (id: number) => {
  try {
    const transactions = await getTransactions();
    return transactions.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error getting transaction by ID:', error);
    return null;
  }
};

export const adminGetNextTransactionId = async () => {
  try {
    const transactions = await getTransactions();
    return transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
  } catch (error) {
    console.error('Error getting next transaction ID:', error);
    return 1;
  }
};

export const adminBackupTransactions = async () => {
  try {
    const response = await fetch('/api/admin/backup', {
      method: 'POST'
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

export const adminRestoreTransactions = async (filename: string) => {
  try {
    const response = await fetch('/api/admin/backup', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error restoring transactions:', error);
    return false;
  }
};

export const adminGetBackups = async () => {
  try {
    const response = await fetch('/api/admin/backup');
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching backups:', error);
    return [];
  }
};
