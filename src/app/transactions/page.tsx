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
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  CreditCard,
  Receipt,
  X,
  Home,
  Send,
  BarChart3,
  Settings,
  Bell,
  Globe,
  MessageCircle,
  Menu,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RoryBankLogo from "@/components/RoryBankLogo";
import { getTransactions, getTotalIncome, getTotalExpenses, getNetBalance, getStatementData, type Transaction } from "@/lib/transactions";
import { generateBankStatementPDF } from "@/lib/pdfStatement";

export default function TransactionsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  useEffect(() => {
    loadTransactions();
    loadTotals();
  }, []);

  const loadTotals = async () => {
    try {
      const income = await getTotalIncome();
      const expenses = await getTotalExpenses();
      const balance = await getNetBalance();
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setNetBalance(balance);
    } catch (error) {
      console.error('Error loading totals:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Statement generation function
  const generateStatement = async () => {
    try {
      const statementData = await getStatementData();
      await generateBankStatementPDF(statementData);
    } catch (error) {
      console.error('Error generating statement:', error);
    }
  };

  const allTransactions = transactions;

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

    // Date filter
    if (dateRange === "today") {
      matchesDate = t.date === new Date().toISOString().split('T')[0];
    } else if (dateRange === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = new Date(t.date) >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = new Date(t.date) >= monthAgo;
    } else if (dateRange === "last-month") {
      matchesDate = t.date.includes("Sep");
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  // Sort transactions by date and time (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    // Helper function to parse date strings (handles both "Oct 20, 2025" and "2025-10-20" formats)
    const parseDate = (dateStr: string): Date => {
      // Try ISO format first (2025-10-20)
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
        return new Date(dateStr);
      }
      // Try formatted date (Oct 20, 2025)
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
      return new Date(0); // Fallback for invalid dates
    };

    // Helper function to parse time strings (handles both "10:30 AM" and "12:41" formats)
    const parseTime = (timeStr: string): number => {
      const normalized = timeStr.trim().toUpperCase();
      const hasAMPM = normalized.includes('AM') || normalized.includes('PM');
      
      if (hasAMPM) {
        // Format: "10:30 AM" or "12:41 PM"
        const match = normalized.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (match) {
          let hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const ampm = match[3];
          
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          return hours * 60 + minutes; // Convert to minutes for comparison
        }
      } else {
        // Format: "12:41" (24-hour format)
        const match = normalized.match(/(\d{1,2}):(\d{2})/);
        if (match) {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          return hours * 60 + minutes;
        }
      }
      return 0; // Fallback
    };

    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    
    // Compare dates first (newest first)
    if (dateB.getTime() !== dateA.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }
    
    // If dates are the same, compare by time (newest first)
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    return timeB - timeA;
  });

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RoryBankLogo size="sm" />
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
                <RoryBankLogo size="md" />
              </div>

              <nav className="space-y-2">
                <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                
                <button onClick={() => router.push('/transfer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
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
                <button onClick={() => router.push('/management')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <BarChart3 className="w-5 h-5" />
                  Management
                </button>
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg p-4 text-white">
                  <p className="text-sm font-medium mb-1">Need Help?</p>
                  <p className="text-xs opacity-90 mb-3">Contact our support team</p>
                  <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm" onClick={() => router.push('/contact')}>
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
            <RoryBankLogo size="md" />
          </div>

          <nav className="space-y-2">
            <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            
            <button onClick={() => router.push('/transfer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
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
            <button onClick={() => router.push('/management')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <BarChart3 className="w-5 h-5" />
              Management
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg p-4 text-white">
              <p className="text-sm font-medium mb-1">Need Help?</p>
              <p className="text-xs opacity-90 mb-3">Contact our support team</p>
            <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm" onClick={() => router.push('/contact')}>
              Get Support
            </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 p-4 lg:p-8 min-h-screen overflow-y-auto pb-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Transaction History</h2>
              <p className="text-slate-600 mt-1">View and manage all your transactions</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <div className="relative group">
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-amber-600 text-white">LG</AvatarFallback>
                </Avatar>
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100">
                      Lisaglenn
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Total Income
                  </CardTitle>
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
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    Total Expenses
                  </CardTitle>
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
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    Net Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {filteredTransactions.length} total transactions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Filter Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter by Type</label>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All transactions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expenses">Expenses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Showing {sortedTransactions.length} of {allTransactions.length} transactions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement add transaction modal
                        alert('Add Transaction feature coming soon!');
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
                    <Button
                      onClick={generateStatement}
                      className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Statement
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="text-slate-600 mt-2">Loading transactions...</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions found</h3>
                    <p className="text-slate-600">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.amount > 0 ? "bg-amber-100" : "bg-slate-100"
                          }`}>
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="w-5 h-5 text-amber-700" />
                            ) : (
                              <ArrowDownLeft className="w-5 h-5 text-slate-600" />
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
                          <Badge variant={
                            transaction.status === 'Processed' ? 'default' : 
                            transaction.status === 'Pending' ? 'secondary' : 
                            'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? "text-amber-700" : "text-slate-900"
                          }`}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transaction Details Modal */}
          {isModalOpen && selectedTransaction && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Transaction Details</h2>
                    <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedTransaction.amount > 0 ? "bg-amber-100" : "bg-slate-100"
                      }`}>
                        {selectedTransaction.amount > 0 ? (
                          <ArrowUpRight className="w-6 h-6 text-amber-700" />
                        ) : (
                          <ArrowDownLeft className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{selectedTransaction.name}</h3>
                        <p className="text-slate-600">{selectedTransaction.merchant}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Amount</p>
                        <p className={`font-semibold ${
                          selectedTransaction.amount > 0 ? "text-amber-700" : "text-slate-900"
                        }`}>
                          {selectedTransaction.amount > 0 ? "+" : ""}${Math.abs(selectedTransaction.amount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <Badge variant={
                          selectedTransaction.status === 'Processed' ? 'default' : 
                          selectedTransaction.status === 'Pending' ? 'secondary' : 
                          'destructive'
                        }>
                          {selectedTransaction.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Category</p>
                        <p className="font-medium">{selectedTransaction.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Type</p>
                        <p className="font-medium capitalize">{selectedTransaction.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-medium">{selectedTransaction.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Time</p>
                        <p className="font-medium">{selectedTransaction.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // Add print or share functionality here
                        window.print();
                      }}
                    >
                      Print Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthWrapper>
  );
}