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

export interface Account {
  id: number;
  userId: string;
  name: string;
  number: string;
  balance: number;
  interestRate: string;
  routing: string;
  openedDate: string;
  type: string;
  currency: string;
  swiftCode?: string;
}

export const CURRENCY_MAP: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'GHS': 'GH₵'
};

export const getCurrencySymbol = (code: string = 'USD') => CURRENCY_MAP[code] || '$';

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

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000'; // Default to localhost
};

// Get transactions from API for current user
export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  try {
    const effectiveUserId = userId || getCurrentUserId();
    const baseUrl = getBaseUrl();
    const url = effectiveUserId
      ? `${baseUrl}/api/transactions?userId=${effectiveUserId}`
      : `${baseUrl}/api/transactions`;

    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Get account info for current user
export const getAccountData = async (userId?: string): Promise<Account | null> => {
  try {
    const effectiveUserId = userId || getCurrentUserId();
    if (!effectiveUserId) return null;

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/accounts?userId=${effectiveUserId}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching account:', error);
    return null;
  }
};

// Helper functions for transaction data
export const getTransactionsByType = async (type: "deposit" | "withdrawal" | "all") => {
  const transactions = await getTransactions();
  if (type === "all") return transactions;
  return transactions.filter(t => t.type === type);
};

export const getTotalIncome = async (userId?: string) => {
  const transactions = await getTransactions(userId);
  return transactions.filter(t => t.type === "deposit" && t.status === "Processed").reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0);
};

export const getTotalExpenses = async (userId?: string) => {
  const transactions = await getTransactions(userId);
  return Math.abs(transactions.filter(t => t.type === "withdrawal" && t.status === "Processed").reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0));
};

export const getNetBalance = async (userId?: string) => {
  const income = await getTotalIncome(userId);
  const expenses = await getTotalExpenses(userId);
  return Number(income) - Number(expenses);
};

export const getAvailableBalance = async () => {
  const transactions = await getTransactions();
  const processedTransactions = transactions.filter(t => t.status === "Processed");

  const totalDeposits = processedTransactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0);

  const totalWithdrawals = processedTransactions
    .filter(t => t.type === "withdrawal")
    .reduce((sum, t) => Number(sum) + Math.abs(Number(t.amount || 0)), 0);

  return Number(totalDeposits) - Number(totalWithdrawals);
};

export const getCompletedTransactions = async () => {
  const transactions = await getTransactions();
  return transactions.filter(t => t.status === "Processed");
};

export const getPendingTransactions = async () => {
  const transactions = await getTransactions();
  return transactions.filter(t => t.status === "Pending");
};

export const getStatementData = async (userId?: string, currency: string = 'USD', startDate?: string, endDate?: string) => {
  const effectiveUserId = userId || getCurrentUserId();
  const account = await getAccountData(effectiveUserId);

  // Try to get user data for fallback
  let fallbackName = "Customer";
  let fallbackNumber = "****0000";
  let fallbackSwift = "SBGAKACC";
  let userCurrency = currency;

  if (typeof window !== 'undefined') {
    try {
      const userDataStr = localStorage.getItem('user');
      if (userDataStr) {
        const userObj = JSON.parse(userDataStr);
        fallbackName = userObj.name || fallbackName;
        fallbackNumber = userObj.accountNumber || (userObj.id === 'linaglenn' ? "****4582" : "****0000");
        fallbackSwift = userObj.swiftCode || fallbackSwift;
        userCurrency = userObj.currency || currency;
      }
    } catch (e) { }
  }

  const effectiveCurrency = account?.currency || userCurrency;
  const currencySymbol = getCurrencySymbol(effectiveCurrency);

  const allTransactions = await getTransactions(effectiveUserId);

  // Sort all transactions chronologically for correct historical balance calculation
  const chronologicalTransactions = [...allTransactions].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Determine filtering bounds
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  // Set end date to end of day to include all transactions on that day
  end.setHours(23, 59, 59, 999);

  // Determine "Opening Balance" type transactions
  const isOpeningRecord = (t: any) =>
    t.name === "Opening Balance" || t.name === "Initial Deposit" || t.name === "Cash Deposit";

  // Opening Balance calculation:
  // We sum ALL transactions that are either "Opening Balance" records OR occurred before the start date.
  // This ensures that the primary "Opening Balance" is always in the header, not the table.
  const openingTransactions = chronologicalTransactions.filter(t =>
    t.status === "Processed" && (isOpeningRecord(t) || new Date(t.date) < start)
  );
  const openingBalance = openingTransactions.reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0);

  // Transactions within the selected period
  // We exclude "Opening Balance" records from the table because they are now accounted for in the header.
  const filteredTransactions = chronologicalTransactions.filter(t => {
    const tDate = new Date(t.date);
    const inRange = tDate >= start && tDate <= end;
    return inRange && !isOpeningRecord(t);
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "deposit" && t.status === "Processed")
    .reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0);

  const totalExpenses = Math.abs(filteredTransactions
    .filter(t => t.type === "withdrawal" && t.status === "Processed")
    .reduce((sum, t) => Number(sum) + Number(t.amount || 0), 0));

  const closingBalance = Number(openingBalance) + Number(totalIncome) - Number(totalExpenses);

  const formatDateRange = (s?: string, e?: string) => {
    if (s && e) return `${new Date(s).toLocaleDateString()} - ${new Date(e).toLocaleDateString()}`;
    if (s) return `From ${new Date(s).toLocaleDateString()}`;
    if (e) return `Until ${new Date(e).toLocaleDateString()}`;
    return "Full History";
  };

  return {
    accountHolder: account?.name || fallbackName,
    accountNumber: account?.number || fallbackNumber,
    statementPeriod: formatDateRange(startDate, endDate),
    statementDate: new Date().toLocaleDateString(),
    openingBalance,
    totalIncome,
    totalExpenses,
    closingBalance,
    transactions: filteredTransactions.map(t => ({
      date: t.date,
      time: t.time,
      description: t.name,
      merchant: t.merchant,
      category: t.category,
      amount: t.amount,
      status: t.status,
      type: t.type
    })),
    currency: effectiveCurrency,
    currencySymbol,
    swiftCode: account?.swiftCode || fallbackSwift
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
