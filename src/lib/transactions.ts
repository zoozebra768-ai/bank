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

export const transactions: Transaction[] = [
  
    { 
        id: 3, 
        name: "Cheque Deposit", 
        amount: 3000000.00, 
        date: "Oct 21, 2025", 
        time: "9:00 AM", 
        category: "Deposit",
        status: "Pending",
        merchant: "H & G Group of Company #7927", 
        type: "deposit" 
    },

    { 
        id: 1, 
        name: "Bank Service", 
        amount: -24.75, 
        date: "Oct 20, 2025", 
        time: "10:30 AM", 
        category: "Service",
        status: "Processed",
        merchant: "Service Charge #4523", 
        type: "withdrawal" 
    },
    { 
        id: 2, 
        name: "Cash Deposit", 
        amount: 3500.00, 
        date: "Oct 18, 2025", 
        time: "9:00 AM", 
        category: "Deposit",
        status: "Processed",
        merchant: "Lina Wills #4329", 
        type: "deposit" 
    },
];

// Helper functions for transaction data
export const getTransactionsByType = (type: "deposit" | "withdrawal" | "all") => {
  if (type === "all") return transactions;
  return transactions.filter(t => t.type === type);
};

export const getTotalIncome = () => {
  return transactions.filter(t => t.type === "deposit" && t.status !== "Pending").reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = () => {
  return Math.abs(transactions.filter(t => t.type === "withdrawal" && t.status !== "Pending").reduce((sum, t) => sum + t.amount, 0));
};

export const getNetBalance = () => {
  return getTotalIncome() - getTotalExpenses();
};

export const getCompletedTransactions = () => {
  return transactions.filter(t => t.status !== "Pending");
};

export const getPendingTransactions = () => {
  return transactions.filter(t => t.status === "Pending");
};

export const getStatementData = () => {
  return {
    accountHolder: "Lisaglenn",
    accountNumber: "****4582",
    statementPeriod: "October 1 - October 19, 2025",
    statementDate: new Date().toLocaleDateString(),
    openingBalance: 3500.00,
    totalIncome: getTotalIncome(),
    totalExpenses: getTotalExpenses(),
    closingBalance: getNetBalance(),
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
