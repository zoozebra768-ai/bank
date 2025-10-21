"use client";

import AuthWrapper from "@/components/AuthWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Download,
  Filter,
  Search,
  ChevronLeft,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Building2,
  Home,
  Send,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Globe,
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Statement generation function
  const generateStatement = () => {
    const transactions = [
      { id: 1, name: "Starbucks Coffee", amount: -5.67, date: "Oct 19, 2025", time: "10:30 AM", category: "Food & Drink", status: "completed", merchant: "Starbucks #4523" },
      { id: 2, name: "Whole Foods Market", amount: -156.43, date: "Oct 18, 2025", time: "6:45 PM", category: "Groceries", status: "completed", merchant: "Whole Foods Market" },
      { id: 3, name: "Netflix Subscription", amount: -15.99, date: "Oct 18, 2025", time: "12:00 AM", category: "Entertainment", status: "completed", merchant: "Netflix.com" },
      { id: 4, name: "Shell Gas Station", amount: -45.20, date: "Oct 17, 2025", time: "8:15 AM", category: "Transportation", status: "completed", merchant: "Shell #7891" },
    ];

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const netBalance = totalIncome - totalExpenses;

    // Create statement content
    const statementContent = `
RORY BANK
ACCOUNT STATEMENT

Account Holder: John Doe
Account Number: ****4582
Statement Period: October 1 - October 19, 2025
Statement Date: ${new Date().toLocaleDateString()}

SUMMARY:
Opening Balance: ₵0.00
Total Income: ₵${totalIncome.toFixed(2)}
Total Expenses: ₵${totalExpenses.toFixed(2)}
Closing Balance: ₵${netBalance.toFixed(2)}

TRANSACTION DETAILS:
${transactions.map(t => `
Date: ${t.date} ${t.time}
Description: ${t.name}
Merchant: ${t.merchant}
Category: ${t.category}
Amount: ${t.amount > 0 ? '+' : ''}₵${t.amount.toFixed(2)}
Status: ${t.status}
`).join('')}

This statement was generated on ${new Date().toLocaleString()}
For any questions, please contact customer service.

Rory Bank - Modern Banking
    `.trim();

    // Create and download file
    const blob = new Blob([statementContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RoryBank_Statement_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const accountData = {
    "1": {
      name: "Current Account",
      number: "****4582",
      fullNumber: "5678 9012 2341",
      balance: 12345.67,
      availableBalance: 3500,
      type: "checking",
      openedDate: "Jan 15, 2020",
      interestRate: "0.01%",
      routing: "021000021",
      creditLimit: 0,
      dueDate: undefined
    }
  };

  const account = accountData[params.id as keyof typeof accountData] || accountData["1"];

  const transactions = [
    {
      id: 1,
      type: "income",
      description: "Salary Deposit",
      amount: 3500.00,
      date: "2024-01-15",
      category: "Salary"
    },
    {
      id: 2,
      type: "expense",
      description: "Grocery Store",
      amount: -125.50,
      date: "2024-01-14",
      category: "Food"
    },
    {
      id: 3,
      type: "income",
      description: "Freelance Payment",
      amount: 850.00,
      date: "2024-01-13",
      category: "Freelance"
    },
    {
      id: 4,
      type: "expense",
      description: "Electric Bill",
      amount: -89.99,
      date: "2024-01-12",
      category: "Utilities"
    },
    {
      id: 5,
      type: "expense",
      description: "Coffee Shop",
      amount: -12.75,
      date: "2024-01-11",
      category: "Food"
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "income") return transaction.type === "income";
    if (selectedFilter === "expense") return transaction.type === "expense";
    return true;
  });

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Rory Bank</h1>
              <p className="text-xs text-slate-500">Online Banking</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Rory Bank</h1>
                  <p className="text-xs text-slate-500">Online Banking</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
                  <CreditCard className="w-5 h-5" />
                  Account
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Send className="w-5 h-5" />
                  Transfer
                </button>
                <button onClick={() => router.push('/transactions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Receipt className="w-5 h-5" />
                  Transactions
                </button>
                <button onClick={() => router.push('/forex')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Globe className="w-5 h-5" />
                  Forex Rates
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </button>
                <button onClick={() => router.push('/contact')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <MessageCircle className="w-5 h-5" />
                  Contact
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg p-4 text-white">
                  <p className="text-sm font-medium mb-1">Need Help?</p>
                  <p className="text-xs opacity-90 mb-3">Contact our support team</p>
                  <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm">
                    Get Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Rory Bank</h1>
            <p className="text-xs text-slate-500">Online Banking</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
            <CreditCard className="w-5 h-5" />
              Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Send className="w-5 h-5" />
            Transfer
          </button>
            <button onClick={() => router.push('/transactions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Receipt className="w-5 h-5" />
            Transactions
          </button>
            <button onClick={() => router.push('/forex')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <Globe className="w-5 h-5" />
              Forex Rates
            </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
            <button onClick={() => router.push('/contact')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <MessageCircle className="w-5 h-5" />
              Contact
            </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg p-4 text-white">
            <p className="text-sm font-medium mb-1">Need Help?</p>
            <p className="text-xs opacity-90 mb-3">Contact our support team</p>
              <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm">
              Get Support
            </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, John</h2>
            <p className="text-slate-600 mt-1">Here's what's happening with your money today</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-amber-600 text-white">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-600">
                Available balance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{account.creditLimit > 0 ? account.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</div>
              <p className="text-xs text-slate-600">
                {account.creditLimit > 0 ? 'Available credit' : 'No credit limit'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{account.interestRate}</div>
              <p className="text-xs text-slate-600">
                Annual percentage rate
              </p>
            </CardContent>
          </Card>
                </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">₵{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-600">
                This month
              </p>
              </CardContent>
            </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₵{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-600">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-600">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>All transactions for this account</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("all")}
                    className={selectedFilter === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedFilter === "income" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("income")}
                    className={selectedFilter === "income" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Income
                  </Button>
                  <Button
                    variant={selectedFilter === "expense" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("expense")}
                    className={selectedFilter === "expense" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Expenses
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={generateStatement}>
                  <Download className="w-4 h-4" />
                  Download Statement
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`} />
                            )}
                          </div>
                          <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                          </div>
                        </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : ''}₵{Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                      </div>
                    </div>
                  ))}
                </div>
            <div className="mt-6 text-center">
              <Button variant="outline" className="w-full">
                Load More
              </Button>
              <Button 
                onClick={() => router.push('/transactions')} 
                className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
              >
                View All Transactions
              </Button>
                </div>
              </CardContent>
            </Card>

          {/* Sidebar - Account Details & Statements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Account Details */}
          <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Account Number</p>
                  <p className="font-medium text-slate-900">{account.fullNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Routing Number</p>
                  <p className="font-medium text-slate-900">{account.routing}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account Type</p>
                  <p className="font-medium text-slate-900 capitalize">{account.type}</p>
                </div>
                <div>
                <p className="text-sm text-slate-500">Opened Date</p>
                  <p className="font-medium text-slate-900">{account.openedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Interest Rate</p>
                  <p className="font-medium text-slate-900">{account.interestRate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
          <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800">
                  <Send className="w-4 h-4 mr-2" />
                  Transfer Money
                </Button>
              <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Statements
              </Button>
              <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg p-4 text-white mb-4">
                <p className="text-sm font-medium mb-1">24/7 Support</p>
                <p className="text-xs opacity-90 mb-3">Get help with your account</p>
                <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm">
                  Contact Support
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Phone: +1 (555) 123-4567</p>
                <p className="text-sm text-slate-600">Email: support@rorybank.com</p>
                <p className="text-sm text-slate-600">Hours: 24/7</p>
          </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </AuthWrapper>
  );
}