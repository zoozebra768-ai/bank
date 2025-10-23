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
import { useState, useEffect } from "react";

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    router.push('/');
  };

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
      balance: 3475.25,
      availableBalance: 3475.25,
      type: "Current",
      openedDate: "Oct 15, 2025",
      creditLimit: undefined,
      dueDate: undefined
    }
  };

  const account = accountData[params.id as keyof typeof accountData] || accountData["1"];

  const allTransactions = [
    { id: 3, name: "Cheque Deposit", amount: 3000000.00, date: "Oct 21, 2025", time: "9:00 AM", merchant: "H & G Group of Company #7927", type: "deposit" },
    { id: 1, name: "Bank Service", amount: -24.75, date: "Oct 20, 2025", time: "10:30 AM", merchant: "Service Charge #4523", type: "withdrawal" },
    { id: 2, name: "Cash Deposit", amount: 3500.00, date: "Oct 18, 2025", time: "9:00 AM", merchant: "Lina Wills #4329", type: "deposit" },
  ];

  const filteredTransactions = allTransactions.filter(t => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "deposit") return t.type === "deposit";
    if (selectedFilter === "withdrawal") return t.type === "withdrawal";
    return true;
  });

  const totalIncome = allTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  const statements = [
    { month: "October 2025", dateRange: "Oct 1 - Oct 19, 2025", status: "Current Period" },

  ];

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
                <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button onClick={() => router.push('/transfer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Send className="w-5 h-5" />
                  Transfer
                </button>
                <a href="/transactions" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Receipt className="w-5 h-5" />
                  Transactions
                </a>
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
       
            <button onClick={() => router.push('/transfer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
            <Send className="w-5 h-5" />
            Transfer
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
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
        <main className="lg:ml-64 p-4 lg:p-8 min-h-screen overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, Lisaglenn</h2>
            <p className="text-slate-600 mt-1">Here's what's happening with your money today</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            {/* <button className="p-2 rounded-lg hover:bg-white relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}
            <div className="relative group">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-amber-600 text-white">LG</AvatarFallback>
              </Avatar>
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100">
                    Lisaglenn
                  </div>
                  <button 
                    onClick={() => router.push('/accounts/1')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => router.push('/accounts/1')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded"
                  >
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

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-amber-100">
                Available Balance
                </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold">
                  ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

        

          

         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions Section */}
          <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All transactions for this account</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateStatement}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Statement
                    </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("all")}
                    className={selectedFilter === "all" ? "bg-amber-700 hover:bg-amber-800" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedFilter === "deposit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("deposit")}
                    className={selectedFilter === "deposit" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant={selectedFilter === "withdrawal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("withdrawal")}
                    className={selectedFilter === "withdrawal" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Withdrawal
                  </Button>
                </div>

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
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
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
                      <Badge variant="secondary" className={`${
                        transaction.type === "deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                      </Badge>
                          <p className={`font-semibold text-lg min-w-[120px] text-right ${
                        transaction.type === "deposit" ? "text-green-700" : "text-red-600"
                      }`}>
                        {transaction.type === "deposit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <Button 
                    onClick={() => router.push('/transactions')}
                    className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                  >
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
                    </div>

          {/* Sidebar - Account Details & Statements */}
          <div className="space-y-6">
            {/* Account Details */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Account Number</p>
                  <p className="font-medium text-slate-900">{account.fullNumber}</p>
                  </div>
              
                <div>
                  <p className="text-sm text-slate-500">Account Type</p>
                  <p className="font-medium text-slate-900 capitalize">{account.type}</p>
                      </div>
                      <div>
                  <p className="text-sm text-slate-500">Opened On</p>
                  <p className="font-medium text-slate-900">{account.openedDate}</p>
                </div>
          
              </CardContent>
            </Card>

            {/* Statements */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Statements</CardTitle>
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <CardDescription>Download your monthly statements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {statements.map((statement, index) => (
                  <div key={index} className="p-3 rounded-lg border border-slate-200 hover:border-amber-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-sm text-slate-900">{statement.month}</p>
                          <p className="text-xs text-slate-500">{statement.dateRange}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-white text-amber-800 hover:bg-amber-50">
                  <Send className="w-4 h-4 mr-2" />
                  Transfer Money
                </Button>
                <Button className="w-full bg-white/20 text-white hover:bg-white/30 border-0">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
                <Button className="w-full bg-white/20 text-white hover:bg-white/30 border-0">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
          </CardContent>
        </Card>
          </div>
        </div>
      </main>
    </div>
    </AuthWrapper>
  );
}
