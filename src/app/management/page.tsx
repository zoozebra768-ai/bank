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
  Building2,
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
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManagementDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);

  // Account data state
  const [accountData, setAccountData] = useState({
    name: "Current Account",
    number: "****4582",
    fullNumber: "5678 9012 2341",
    balance: 12345.67,
    availableBalance: 12345.67,
    type: "checking",
    openedDate: "Jan 15, 2020",
    interestRate: "0.01%",
    routing: "021000021"
  });

  // Transaction data state
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Starbucks Coffee", amount: -5.67, date: "Oct 19, 2025", time: "10:30 AM", category: "Food & Drink", merchant: "Starbucks #4523" },
    { id: 2, name: "Whole Foods Market", amount: -156.43, date: "Oct 18, 2025", time: "6:45 PM", category: "Groceries", merchant: "Whole Foods Market" },
    { id: 3, name: "Netflix Subscription", amount: -15.99, date: "Oct 18, 2025", time: "12:00 AM", category: "Entertainment", merchant: "Netflix.com" },
    { id: 4, name: "Salary Deposit", amount: 3500.00, date: "Oct 15, 2025", time: "9:00 AM", category: "Income", merchant: "Employer Direct Deposit" },
    { id: 5, name: "Amazon Purchase", amount: -89.99, date: "Oct 14, 2025", time: "3:20 PM", category: "Shopping", merchant: "Amazon.com" }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    date: "",
    time: "",
    category: "",
    merchant: ""
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
    "Housing"
  ];

  const handleAccountUpdate = (field: string, value: string) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAccount = () => {
    // Here you would typically save to a database
    console.log("Account data saved:", accountData);
    setIsEditing(false);
  };

  const handleAddTransaction = () => {
    if (newTransaction.name && newTransaction.amount) {
      const transaction = {
        id: transactions.length + 1,
        name: newTransaction.name,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date || new Date().toLocaleDateString(),
        time: newTransaction.time || new Date().toLocaleTimeString(),
        category: newTransaction.category || "Other",
        merchant: newTransaction.merchant || "Unknown"
      };
      
      setTransactions(prev => [transaction, ...prev]);
      setNewTransaction({
        name: "",
        amount: "",
        date: "",
        time: "",
        category: "",
        merchant: ""
      });
    }
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Rory Bank</h1>
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
            variant={activeTab === "account" ? "default" : "outline"}
            onClick={() => setActiveTab("account")}
            className={activeTab === "account" ? "bg-amber-700 hover:bg-amber-800" : ""}
          >
            <User className="w-4 h-4 mr-2" />
            Account Details
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
            variant={activeTab === "analytics" ? "default" : "outline"}
            onClick={() => setActiveTab("analytics")}
            className={activeTab === "analytics" ? "bg-amber-700 hover:bg-amber-800" : ""}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
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
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
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
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? "text-amber-700" : "text-slate-900"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">
                  +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-slate-600 mt-2">From {transactions.filter(t => t.amount > 0).length} transactions</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-slate-600 mt-2">From {transactions.filter(t => t.amount < 0).length} transactions</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-700" />
                  Net Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  ${(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-slate-600 mt-2">Current account balance</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
