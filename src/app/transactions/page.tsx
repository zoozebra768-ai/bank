"use client";

import AuthWrapper from "@/components/AuthWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Home,
  Send,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Search,
  Globe,
  MessageCircle,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  Eye,
  Plus,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TransactionsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
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
TRANSACTION STATEMENT

Account Holder: John Doe
Account Number: ****4582
Statement Period: October 1 - October 19, 2025
Statement Date: ${new Date().toLocaleDateString()}

SUMMARY:
Opening Balance: $0.00
Total Income: $${totalIncome.toFixed(2)}
Total Expenses: $${totalExpenses.toFixed(2)}
Closing Balance: $${netBalance.toFixed(2)}

TRANSACTION DETAILS:
${transactions.map(t => `
Date: ${t.date} ${t.time}
Description: ${t.name}
Merchant: ${t.merchant}
Category: ${t.category}
Amount: ${t.amount > 0 ? '+' : ''}$${t.amount.toFixed(2)}
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
    link.download = `RoryBank_TransactionStatement_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const allTransactions = [
    { id: 1, name: "Starbucks Coffee", amount: -5.67, date: "Oct 19, 2025", time: "10:30 AM", category: "Food & Drink", status: "completed", merchant: "Starbucks #4523" },
    { id: 2, name: "Whole Foods Market", amount: -156.43, date: "Oct 18, 2025", time: "6:45 PM", category: "Groceries", status: "completed", merchant: "Whole Foods Market" },
    { id: 3, name: "Netflix Subscription", amount: -15.99, date: "Oct 18, 2025", time: "12:00 AM", category: "Entertainment", status: "completed", merchant: "Netflix.com" },
    { id: 4, name: "Shell Gas Station", amount: -45.20, date: "Oct 17, 2025", time: "8:15 AM", category: "Transportation", status: "completed", merchant: "Shell #7891" },
  ];

  const filteredTransactions = allTransactions.filter(t => {
    let matchesFilter = true;
    let matchesSearch = true;
    let matchesDate = true;

    // Filter by type
    if (selectedFilter === "income") matchesFilter = t.amount > 0;
    if (selectedFilter === "expenses") matchesFilter = t.amount < 0;

    // Search filter
    if (searchTerm) {
      matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     t.category.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // Date range filter (simplified for demo)
    if (dateRange === "this-month") {
      matchesDate = t.date.includes("Oct");
    } else if (dateRange === "last-month") {
      matchesDate = t.date.includes("Sep");
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                  <Receipt className="w-5 h-5" />
                  Transactions
                </button>
                <button onClick={() => router.push('/transfer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Send className="w-5 h-5" />
                  Transfer
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
        <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6">
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
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Send className="w-5 h-5" />
            Transfer
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
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
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Transaction History</h2>
              <p className="text-slate-600 mt-1">View and manage all your transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Income</CardDescription>
                <TrendingUp className="w-4 h-4 text-amber-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">
                +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {filteredTransactions.filter(t => t.amount > 0).length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Expenses</CardDescription>
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {filteredTransactions.filter(t => t.amount < 0).length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardDescription>Net Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {filteredTransactions.length} total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expenses">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateStatement}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Statement
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} of {allTransactions.length} transactions
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? "bg-amber-100" : "bg-slate-100"
                      }`}>
                        {transaction.amount > 0 ? (
                          <ArrowDownLeft className="w-5 h-5 text-amber-700" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.name}</p>
                        <p className="text-sm text-slate-500">{transaction.merchant}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {transaction.date} at {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        {transaction.category}
                      </Badge>
                      <p className={`font-semibold text-lg min-w-[120px] text-right ${
                        transaction.amount > 0 ? "text-amber-700" : "text-slate-900"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions found</h3>
                <p className="text-slate-600">Try adjusting your filters or search terms</p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center">
              <Button variant="outline">Load More Transactions</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AuthWrapper>
  );
}
