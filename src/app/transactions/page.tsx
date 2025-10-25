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
import { transactions, getTotalIncome, getTotalExpenses, getNetBalance, getStatementData } from "@/lib/transactions";
import { generateBankStatementPDF } from "@/lib/pdfStatement";
import { getUserDisplayName, getUserInitials, clearUserData } from "@/lib/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TransactionsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    clearUserData();
    router.push('/');
  };

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Statement generation function
  const generateStatement = () => {
    const statementData = getStatementData();
    generateBankStatementPDF(statementData);
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

    // Date range filter (simplified for demo)
    if (dateRange === "this-month") {
      matchesDate = t.date.includes("Oct");
    } else if (dateRange === "last-month") {
      matchesDate = t.date.includes("Sep");
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();

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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Settings className="w-5 h-5" />
                  Settings
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Settings className="w-5 h-5" />
            Settings
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
                  <AvatarFallback className="bg-amber-600 text-white">{getUserInitials()}</AvatarFallback>
                </Avatar>
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100">
                    {getUserDisplayName()}
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">
                    Account Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
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
                        transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-700" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-700" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.name}</p>
                        <p className="text-sm text-slate-500">{transaction.merchant}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {transaction.date} at {transaction.time}
                        </p>
                        <p className={`text-xs font-medium ${
                          transaction.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>Status: {transaction.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* <Badge variant="secondary" className={`${
                        transaction.type === "deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {transaction.category}
                      </Badge> */}
                      <p className={`font-semibold text-lg min-w-[120px] text-right ${
                        transaction.status === 'Pending' ? 'text-yellow-600' : 
                        transaction.type === "deposit" ? "text-green-700" : "text-red-700"
                      }`}>
                        {transaction.type === "deposit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(transaction)}
                      >
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

      {/* Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Transaction Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                {/* Transaction Type & Amount */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedTransaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {selectedTransaction.type === "deposit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-700" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{selectedTransaction.name}</p>
                      <p className="text-sm text-slate-500">{selectedTransaction.type}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-lg ${
                    selectedTransaction.status === 'Pending' ? 'text-yellow-600' : 
                    selectedTransaction.type === "deposit" ? "text-green-700" : "text-red-700"
                  }`}>
                    {selectedTransaction.type === "deposit" ? "+" : "-"}${Math.abs(selectedTransaction.amount).toFixed(2)}
                  </p>
                </div>

                {/* Detailed Information */}
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Merchant</span>
                    <span className="font-medium text-slate-900">{selectedTransaction.merchant}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Category</span>
                    <span className="font-medium text-slate-900">{selectedTransaction.category}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Status</span>
                    <span className={`font-medium ${
                      selectedTransaction.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Date</span>
                    <span className="font-medium text-slate-900">{selectedTransaction.date}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Time</span>
                    <span className="font-medium text-slate-900">{selectedTransaction.time}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Transaction ID</span>
                    <span className="font-medium text-slate-900 font-mono text-sm">{selectedTransaction.id}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
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
        </div>
      )}
    </div>
    </AuthWrapper>
  );
}
