"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Settings,
  User,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RoryBankLogo from "@/components/RoryBankLogo";
import { type Transaction, adminAddTransaction, adminUpdateTransaction, adminDeleteTransaction, adminBackupTransactions, adminRestoreTransactions, adminGetBackups } from "@/lib/transactions";
import { getUserRole, clearUserData } from "@/lib/user";

export default function ManagementDashboard() {
  const router = useRouter();
  
  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState("accounts");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Account data state
  interface Account {
    id: number;
    name: string;
    number: string;
    balance: number;
    interestRate: string;
    routing: string;
    openedDate: string;
    type: string;
  }

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<number | null>(null);
  const [editAccountForm, setEditAccountForm] = useState<Partial<Account>>({});
  const [newAccount, setNewAccount] = useState({
    name: "",
    number: "",
    balance: "",
    interestRate: "",
    routing: "",
    openedDate: new Date().toISOString().split('T')[0],
    type: "Checking"
  });

  // Transaction data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [backups, setBackups] = useState<{ filename: string; created: string }[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    amount: '',
    date: '',
    time: '',
    category: '',
    merchant: '',
    status: '',
    type: 'withdrawal' as 'deposit' | 'withdrawal'
  });

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().toTimeString().slice(0, 5), // Current time HH:MM
    category: "",
    merchant: "",
    status: "Processed",
    type: "withdrawal"
  });

  const categories = [
    "Food & Drink",
    "Groceries", 
    "Entertainment",
    "Income",
    "Shopping",
    "Transportation",
    "Utilities",
    "Transfer",
    "Cash",
    "Health & Fitness",
    "Insurance",
    "Housing",
    "Deposit",
    "Service"
  ];

  // Set client flag
  useEffect(() => {
    setIsClient(true);
    loadTransactions();
    loadBackups();
    loadAccounts();
  }, []);

  // Auth check after hooks
  const userRole = getUserRole();
  const isLoggedIn = isClient ? localStorage.getItem('isLoggedIn') : null;
  
  // Redirect if not admin
  useEffect(() => {
    if (isClient && (!isLoggedIn || userRole !== 'Administrator')) {
      router.push('/dashboard');
    }
  }, [isClient, isLoggedIn, userRole, router]);

  const loadTransactions = async () => {
    try {
      // Use the same endpoint as transactions page and dashboard
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const backups = await adminGetBackups();
      setBackups(backups);
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/admin/accounts');
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.name || !newAccount.number || !newAccount.balance || !newAccount.interestRate || !newAccount.routing || !newAccount.openedDate || !newAccount.type) {
      setMessage("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });

      const data = await response.json();
      if (data.success) {
        setAccounts(prev => [data.data, ...prev]);
        setNewAccount({
          name: "",
          number: "",
          balance: "",
          interestRate: "",
          routing: "",
          openedDate: new Date().toISOString().split('T')[0],
          type: "Checking"
        });
        setMessage("Account created successfully");
      } else {
        setMessage(data.error || "Failed to create account");
      }
    } catch (error) {
      setMessage("Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditAccount = (account: Account) => {
    setEditingAccount(account.id);
    setEditAccountForm({
      name: account.name,
      number: account.number,
      balance: account.balance,
      interestRate: account.interestRate,
      routing: account.routing,
      openedDate: account.openedDate,
      type: account.type
    });
  };

  const handleSaveEditAccount = async () => {
    if (!editingAccount) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingAccount, ...editAccountForm })
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Account updated successfully");
        await loadAccounts();
        setEditingAccount(null);
        setEditAccountForm({});
      } else {
        setMessage(data.error || "Failed to update account");
      }
    } catch (error) {
      setMessage("Error updating account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditAccount = () => {
    setEditingAccount(null);
    setEditAccountForm({});
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/accounts?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setAccounts(prev => prev.filter(a => a.id !== id));
        setMessage("Account deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete account");
      }
    } catch (error) {
      setMessage("Error deleting account");
    } finally {
      setIsLoading(false);
    }
  };


  const handleAddTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.category || !newTransaction.merchant) {
      setMessage("Name, amount, category, and merchant are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(prev => [data.data, ...prev]);
        setNewTransaction({
          name: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          category: "",
          merchant: "",
          status: "Processed",
          type: "withdrawal"
        });
        setMessage("Transaction added successfully");
      } else {
        setMessage(data.error || "Failed to add transaction");
      }
    } catch (error) {
      setMessage("Error adding transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/transactions?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setMessage("Transaction deleted successfully");
      } else {
        setMessage(data.error || "Failed to delete transaction");
      }
    } catch (error) {
      setMessage("Error deleting transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction.id);
    setEditForm({
      name: transaction.name,
      amount: transaction.amount.toString(),
      date: transaction.date,
      time: transaction.time,
      category: transaction.category,
      merchant: transaction.merchant,
      status: transaction.status,
      type: transaction.type
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    if (!editForm.name || !editForm.amount || !editForm.category || !editForm.merchant) {
      setMessage("Name, amount, category, and merchant are required");
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        name: editForm.name,
        amount: parseFloat(editForm.amount),
        date: editForm.date,
        time: editForm.time,
        category: editForm.category,
        merchant: editForm.merchant,
        status: editForm.status,
        type: editForm.type
      };

      const result = await adminUpdateTransaction(editingTransaction, updates);
      if (result) {
        setMessage("Transaction updated successfully");
        await loadTransactions();
        setEditingTransaction(null);
        setEditForm({ 
          name: '', 
          amount: '', 
          date: '', 
          time: '', 
          category: '', 
          merchant: '', 
          status: '', 
          type: 'withdrawal' 
        });
      } else {
        setMessage("Failed to update transaction");
      }
    } catch (error) {
      setMessage("Error updating transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({ 
      name: '', 
      amount: '', 
      date: '', 
      time: '', 
      category: '', 
      merchant: '', 
      status: '', 
      type: 'withdrawal' 
    });
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const result = await adminBackupTransactions();
      if (result) {
        setMessage(`Backup created successfully: ${result.filename}`);
        await loadBackups();
      } else {
        setMessage("Failed to create backup");
      }
    } catch (error) {
      setMessage("Error creating backup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm(`Are you sure you want to restore from ${filename}? This will replace all current transactions.`)) return;

    setIsLoading(true);
    try {
      const result = await adminRestoreTransactions(filename);
      if (result) {
        setMessage("Backup restored successfully");
        await loadTransactions();
      } else {
        setMessage("Failed to restore backup");
      }
    } catch (error) {
      setMessage("Error restoring backup");
    } finally {
      setIsLoading(false);
    }
  };

  const totalIncome = transactions.filter(t => t.type === "deposit" && t.status === "Processed").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === "withdrawal" && t.status === "Processed").reduce((sum, t) => sum + t.amount, 0));

  // Show loading or access denied
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn || userRole !== 'Administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-6">You must be an administrator to access this page.</p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RoryBankLogo size="md" />
              <div>
                <p className="text-xs text-slate-500">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Management</h1>
          <p className="text-slate-600">Manage account details and transactions</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "accounts" ? "default" : "outline"}
            onClick={() => setActiveTab("accounts")}
            className={activeTab === "accounts" ? "bg-amber-700 hover:bg-amber-800" : ""}
          >
            <User className="w-4 h-4 mr-2" />
            Accounts
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className={activeTab === "transactions" ? "bg-amber-700 hover:bg-amber-800" : ""}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Transactions
          </Button>
          <Button
            variant={activeTab === "backup" ? "default" : "outline"}
            onClick={() => setActiveTab("backup")}
            className={activeTab === "backup" ? "bg-amber-700 hover:bg-amber-800" : ""}
          >
            <Download className="w-4 h-4 mr-2" />
            Backup & Restore
          </Button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* Add New Account */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="newAccountName">Account Name</Label>
                    <Input
                      id="newAccountName"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountNumber">Account Number</Label>
                    <Input
                      id="newAccountNumber"
                      value={newAccount.number}
                      onChange={(e) => setNewAccount(prev => ({...prev, number: e.target.value}))}
                      placeholder="e.g., ****4582"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountBalance">Balance</Label>
                    <Input
                      id="newAccountBalance"
                      type="number"
                      step="0.01"
                      value={newAccount.balance}
                      onChange={(e) => setNewAccount(prev => ({...prev, balance: e.target.value}))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountInterestRate">Interest Rate</Label>
                    <Input
                      id="newAccountInterestRate"
                      value={newAccount.interestRate}
                      onChange={(e) => setNewAccount(prev => ({...prev, interestRate: e.target.value}))}
                      placeholder="e.g., 2.5%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountRouting">Routing Number</Label>
                    <Input
                      id="newAccountRouting"
                      value={newAccount.routing}
                      onChange={(e) => setNewAccount(prev => ({...prev, routing: e.target.value}))}
                      placeholder="e.g., 021000021"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountOpenedDate">Opened Date</Label>
                    <Input
                      id="newAccountOpenedDate"
                      type="date"
                      value={newAccount.openedDate}
                      onChange={(e) => setNewAccount(prev => ({...prev, openedDate: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccountType">Account Type</Label>
                    <Select value={newAccount.type} onValueChange={(value) => setNewAccount(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Checking">Checking</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleAddAccount}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </CardContent>
            </Card>

            {/* Accounts List */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>Manage existing accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accounts.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No accounts found. Create your first account above.</p>
                  ) : (
                    accounts.map((account) => (
                      <div key={account.id} className="p-4 border border-slate-200 rounded-lg">
                        {editingAccount === account.id ? (
                          // Edit Form
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-name-${account.id}`}>Account Name</Label>
                                <Input
                                  id={`edit-account-name-${account.id}`}
                                  value={editAccountForm.name || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, name: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-number-${account.id}`}>Account Number</Label>
                                <Input
                                  id={`edit-account-number-${account.id}`}
                                  value={editAccountForm.number || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, number: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-balance-${account.id}`}>Balance</Label>
                                <Input
                                  id={`edit-account-balance-${account.id}`}
                                  type="number"
                                  step="0.01"
                                  value={editAccountForm.balance || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, balance: parseFloat(e.target.value) || 0}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-interest-${account.id}`}>Interest Rate</Label>
                                <Input
                                  id={`edit-account-interest-${account.id}`}
                                  value={editAccountForm.interestRate || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, interestRate: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-routing-${account.id}`}>Routing Number</Label>
                                <Input
                                  id={`edit-account-routing-${account.id}`}
                                  value={editAccountForm.routing || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, routing: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-date-${account.id}`}>Opened Date</Label>
                                <Input
                                  id={`edit-account-date-${account.id}`}
                                  type="date"
                                  value={editAccountForm.openedDate || ''}
                                  onChange={(e) => setEditAccountForm(prev => ({...prev, openedDate: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edit-account-type-${account.id}`}>Account Type</Label>
                                <Select 
                                  value={editAccountForm.type || ''} 
                                  onValueChange={(value) => setEditAccountForm(prev => ({...prev, type: value}))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Checking">Checking</SelectItem>
                                    <SelectItem value="Savings">Savings</SelectItem>
                                    <SelectItem value="Credit">Credit</SelectItem>
                                    <SelectItem value="Investment">Investment</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={handleSaveEditAccount}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelEditAccount}
                                disabled={isLoading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Display Mode
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-amber-700" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{account.name}</p>
                                <p className="text-sm text-slate-500">Account: {account.number}</p>
                                <p className="text-xs text-slate-400">Opened: {account.openedDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">{account.type}</Badge>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">${account.balance.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Interest: {account.interestRate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStartEditAccount(account)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAccount(account.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            {/* Add New Transaction */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionName">Transaction Name</Label>
                    <Input
                      id="transactionName"
                      value={newTransaction.name}
                      onChange={(e) => setNewTransaction(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., Coffee Shop"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionAmount">Amount</Label>
                    <Input
                      id="transactionAmount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({...prev, amount: e.target.value}))}
                      placeholder="e.g., -5.67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionCategory">Category</Label>
                    <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionMerchant">Merchant</Label>
                    <Input
                      id="transactionMerchant"
                      value={newTransaction.merchant}
                      onChange={(e) => setNewTransaction(prev => ({...prev, merchant: e.target.value}))}
                      placeholder="e.g., Starbucks #4523"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionDate">Date</Label>
                    <Input
                      id="transactionDate"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({...prev, date: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionTime">Time</Label>
                    <Input
                      id="transactionTime"
                      type="time"
                      value={newTransaction.time}
                      onChange={(e) => setNewTransaction(prev => ({...prev, time: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionStatus">Status</Label>
                    <Select value={newTransaction.status} onValueChange={(value) => setNewTransaction(prev => ({...prev, status: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processed">Processed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionType">Type</Label>
                    <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleAddTransaction}
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Manage existing transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border border-slate-200 rounded-lg">
                      {editingTransaction === transaction.id ? (
                        // Edit Form
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-name-${transaction.id}`}>Transaction Name</Label>
                              <Input
                                id={`edit-name-${transaction.id}`}
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                                placeholder="e.g., Coffee Shop"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-amount-${transaction.id}`}>Amount</Label>
                              <Input
                                id={`edit-amount-${transaction.id}`}
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm(prev => ({...prev, amount: e.target.value}))}
                                placeholder="Enter amount"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-category-${transaction.id}`}>Category</Label>
                              <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({...prev, category: value}))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-merchant-${transaction.id}`}>Merchant</Label>
                              <Input
                                id={`edit-merchant-${transaction.id}`}
                                value={editForm.merchant}
                                onChange={(e) => setEditForm(prev => ({...prev, merchant: e.target.value}))}
                                placeholder="e.g., Starbucks #4523"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-date-${transaction.id}`}>Date</Label>
                              <Input
                                id={`edit-date-${transaction.id}`}
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm(prev => ({...prev, date: e.target.value}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-time-${transaction.id}`}>Time</Label>
                              <Input
                                id={`edit-time-${transaction.id}`}
                                type="time"
                                value={editForm.time}
                                onChange={(e) => setEditForm(prev => ({...prev, time: e.target.value}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-status-${transaction.id}`}>Status</Label>
                              <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({...prev, status: value}))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Processed">Processed</SelectItem>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-type-${transaction.id}`}>Type</Label>
                              <Select value={editForm.type} onValueChange={(value) => setEditForm(prev => ({...prev, type: value as 'deposit' | 'withdrawal'}))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="deposit">Deposit</SelectItem>
                                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleSaveEdit}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display Mode
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.amount > 0 ? "bg-amber-100" : "bg-slate-100"
                            }`}>
                              {transaction.amount > 0 ? (
                                <TrendingUp className="w-5 h-5 text-amber-700" />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{transaction.name}</p>
                              <p className="text-sm text-slate-500">{transaction.merchant}</p>
                              <p className="text-xs text-slate-400">{transaction.date} at {transaction.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">{transaction.category}</Badge>
                            <Badge variant={transaction.status === 'Processed' ? 'default' : transaction.status === 'Pending' ? 'secondary' : 'destructive'}>
                              {transaction.status}
                            </Badge>
                            <p className={`font-semibold ${
                              transaction.amount > 0 ? "text-amber-700" : "text-slate-900"
                            }`}>
                              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTransaction(transaction)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === "backup" && (
          <div className="space-y-6">
            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            {/* Create Backup */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Create Backup
                </CardTitle>
                <CardDescription>Create a backup of all current transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600">
                    Create a timestamped backup of all transactions. This will save the current state of your transaction data.
                  </p>
                  <Button 
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Create Backup
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Restore Backup */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Restore Backup
                </CardTitle>
                <CardDescription>Restore transactions from a previous backup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600">
                    Select a backup file to restore. This will replace all current transactions with the backup data.
                  </p>
                  
                  {backups.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Available Backups:</Label>
                      <div className="space-y-2">
                        {backups.map((backup, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div>
                              <p className="font-medium">{backup.filename}</p>
                              <p className="text-sm text-slate-500">
                                Created: {new Date(backup.created).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleRestoreBackup(backup.filename)}
                              disabled={isLoading}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Restore
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No backup files found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Transactions</Label>
                    <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
                  </div>
                  <div>
                    <Label>Total Income</Label>
                    <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Total Expenses</Label>
                    <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Net Balance</Label>
                    <p className="text-2xl font-bold text-slate-900">${(totalIncome - totalExpenses).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
