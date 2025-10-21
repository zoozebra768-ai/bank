"use client";

import AuthWrapper from "@/components/AuthWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  Home,
  Send,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Globe,
  MessageCircle,
  Search,
  User,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TransferPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transferType, setTransferType] = useState("internal");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [account, setAccount] = useState("");
  const [memo, setMemo] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const accounts = [
    { id: "1", name: "Current Account", number: "****4582", balance: 12345.67 },
    { id: "2", name: "Savings Account", number: "****1234", balance: 45574.25 }
  ];

  const recentRecipients = [
    { name: "Sarah Johnson", account: "****7890", bank: "First National Bank" },
    { name: "Mike Chen", account: "****4567", bank: "Chase Bank" },
    { name: "Emily Davis", account: "****2345", bank: "Wells Fargo" }
  ];

  const handleTransfer = () => {
    // Handle transfer logic here
    console.log("Transfer initiated:", { transferType, amount, recipient, account, memo, scheduleDate });
  };

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
            
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
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
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 p-4 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Transfer Money</h2>
              <p className="text-slate-600 mt-1">Send money to friends, family, or other accounts</p>
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
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transfer Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>New Transfer</CardTitle>
                  <CardDescription>Enter the transfer details below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Transfer Type */}
                  <div className="space-y-2">
                    <Label htmlFor="transfer-type">Transfer Type</Label>
                    <Select value={transferType} onValueChange={setTransferType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal Transfer</SelectItem>
                        <SelectItem value="external">External Transfer</SelectItem>
                        <SelectItem value="wire">Wire Transfer</SelectItem>
                        <SelectItem value="ach">ACH Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* From Account */}
                  <div className="space-y-2">
                    <Label htmlFor="from-account">From Account</Label>
                    <Select value={account} onValueChange={setAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} - {acc.number} (${acc.balance.toLocaleString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipient */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient name or account number"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Memo */}
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Textarea
                      id="memo"
                      placeholder="Add a note for this transfer"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Schedule Transfer */}
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule Transfer (Optional)</Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>

                  {/* Transfer Button */}
                  <Button 
                    onClick={handleTransfer}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                    size="lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Transfer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Recipients */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Recent Recipients</CardTitle>
                  <CardDescription>Quick access to recent transfers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentRecipients.map((recipient, index) => (
                    <div key={index} className="p-3 rounded-lg border border-slate-200 hover:border-amber-600 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900">{recipient.name}</p>
                          <p className="text-xs text-slate-500">{recipient.account} • {recipient.bank}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Transfer Limits */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Transfer Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Daily Limit</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Monthly Limit</span>
                    <span className="font-medium">$50,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Wire Transfer</span>
                    <span className="font-medium">$100,000</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-white text-amber-800 hover:bg-amber-50">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Send Money
                  </Button>
                  <Button className="w-full bg-white/20 text-white hover:bg-white/30 border-0">
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Request Money
                  </Button>
                  <Button className="w-full bg-white/20 text-white hover:bg-white/30 border-0">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Transfer
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