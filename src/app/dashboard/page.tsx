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
  MessageCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const accountData = {
    "1": {
      name: "Current Account",
      number: "****4582",
      fullNumber: "5678 9012 2341",
      balance: 12345.67,
      availableBalance: 3500,
      type: "Current",
      openedDate: "Oct 15, 2025",
      creditLimit: undefined,
      dueDate: undefined
    }
  };

  const account = accountData[params.id as keyof typeof accountData] || accountData["1"];

  const allTransactions = [
    { id: 1, name: "Starbucks Coffee", amount: -5.67, date: "Oct 19, 2025", time: "10:30 AM", category: "Food & Drink", status: "completed", merchant: "Starbucks #4523" },
    { id: 2, name: "Whole Foods Market", amount: -156.43, date: "Oct 18, 2025", time: "6:45 PM", category: "Groceries", status: "completed", merchant: "Whole Foods Market" },
    { id: 3, name: "Netflix Subscription", amount: -15.99, date: "Oct 18, 2025", time: "12:00 AM", category: "Entertainment", status: "completed", merchant: "Netflix.com" },
    { id: 4, name: "Shell Gas Station", amount: -45.20, date: "Oct 17, 2025", time: "8:15 AM", category: "Transportation", status: "completed", merchant: "Shell #7891" },
 ];

  const filteredTransactions = allTransactions.filter(t => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "income") return t.amount > 0;
    if (selectedFilter === "expenses") return t.amount < 0;
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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6">
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
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, John</h2>
            <p className="text-slate-600 mt-1">Here's what's happening with your money today</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative group">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-amber-600 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-slate-600 border-b border-slate-100">
                    John Doe
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

        {/* Account Overview Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-3 gap-6">
          {/* Transactions Section */}
          <div className="col-span-2 space-y-6">
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
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
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
                    variant={selectedFilter === "income" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("income")}
                    className={selectedFilter === "income" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Income
                  </Button>
                  <Button
                    variant={selectedFilter === "expenses" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("expenses")}
                    className={selectedFilter === "expenses" ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    Expenses
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
