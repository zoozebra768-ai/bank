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

export default function ManagementDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("transactions");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [accountData, setAccountData] = useState({
    name: "Lisaglenn",
    number: "****4582",
    balance: 3500.00,
    interestRate: "2.5%",
    routing: "021000021",
    openedDate: "2023-01-15",
    type: "Checking"
  });

  // Transaction data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [backups, setBackups] = useState<{ filename: string; created: string }[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    status: ''
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

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
    loadBackups();
  }, []);

  const loadTransactions = async () => {
    try {
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

  const handleAccountUpdate = (field: string, value: string) => {
    setAccountData(prev => ({
      ...prev,
      [field]: field === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSaveAccount = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      // Here you would normally save to your backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setMessage("Account updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Failed to update account. Please try again.");
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
      amount: transaction.amount.toString(),
      status: transaction.status
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    setIsLoading(true);
    try {
      const updates = {
        amount: parseFloat(editForm.amount),
        status: editForm.status
      };

      const result = await adminUpdateTransaction(editingTransaction, updates);
      if (result) {
        setMessage("Transaction updated successfully");
        await loadTransactions();
        setEditingTransaction(null);
        setEditForm({ amount: '', status: '' });
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
    setEditForm({ amount: '', status: '' });
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

        {/* Account Details Tab */}
        {activeTab === "account" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update account details</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      value={accountData.name}
                      onChange={(e) => handleAccountUpdate("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Account Number</Label>
                    <Input
                      id="number"
                      value={accountData.number}
                      onChange={(e) => handleAccountUpdate("number", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={accountData.balance}
                      onChange={(e) => handleAccountUpdate("balance", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate</Label>
                    <Input
                      id="interestRate"
                      value={accountData.interestRate}
                      onChange={(e) => handleAccountUpdate("interestRate", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="routing">Routing Number</Label>
                    <Input
                      id="routing"
                      value={accountData.routing}
                      onChange={(e) => handleAccountUpdate("routing", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openedDate">Opened Date</Label>
                    <Input
                      id="openedDate"
                      value={accountData.openedDate}
                      onChange={(e) => handleAccountUpdate("openedDate", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button 
                    onClick={handleSaveAccount}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-700">${accountData.balance.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Current Balance</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-700">{accountData.interestRate}</p>
                    <p className="text-sm text-slate-600">Interest Rate</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Account Type:</span>
                    <Badge variant="secondary">{accountData.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Opened:</span>
                    <span className="font-medium">{accountData.openedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Routing:</span>
                    <span className="font-medium">{accountData.routing}</span>
                  </div>
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
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{transaction.name}</p>
                              <p className="text-sm text-slate-500">{transaction.merchant}</p>
                              <p className="text-xs text-slate-400">{transaction.date} at {transaction.time}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`amount-${transaction.id}`}>Amount</Label>
                              <Input
                                id={`amount-${transaction.id}`}
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm(prev => ({...prev, amount: e.target.value}))}
                                placeholder="Enter amount"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`status-${transaction.id}`}>Status</Label>
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
