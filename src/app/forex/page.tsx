"use client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forex Rates - Live Currency Exchange | Rory Bank",
  description: "Get real-time forex rates and currency exchange information. Track USD, EUR, GBP, and other major currencies with Rory Bank's live forex rates.",
  keywords: [
    "forex rates",
    "currency exchange",
    "USD to GHS",
    "EUR to GHS",
    "live exchange rates",
    "foreign exchange",
    "Rory Bank forex"
  ],
  openGraph: {
    title: "Forex Rates - Live Currency Exchange | Rory Bank",
    description: "Get real-time forex rates and currency exchange information with Rory Bank.",
    url: "https://rorybank.com/forex",
  },
};

import AuthWrapper from "@/components/AuthWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  Globe,
  Clock,
  RefreshCw,
  Home,
  Send,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  MessageCircle,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RoryBankLogo from "@/components/RoryBankLogo";

export default function ForexRatesPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const forexRates = [
    {
      currency: "US Dollars",
      code: "USD",
      transfer: {
        buying: 10.4000,
        selling: 10.9000
      },
      cash: {
        buying: 10.4000,
        selling: 11.5000
      }
    },
    {
      currency: "Pounds Sterling",
      code: "GBP",
      transfer: {
        buying: 14.0000,
        selling: 14.7000
      },
      cash: {
        buying: 14.0000,
        selling: 15.1000
      }
    },
    {
      currency: "Euro",
      code: "EUR",
      transfer: {
        buying: 12.0000,
        selling: 12.8000
      },
      cash: {
        buying: 12.0000,
        selling: 13.2000
      }
    }
  ];

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
                <button onClick={() => router.push('/transactions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Receipt className="w-5 h-5" />
                  Transactions
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
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
                  <Button className="w-full bg-white text-amber-700 hover:bg-slate-100" size="sm" onClick={() => router.push('/contact')}>
                    Get Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RoryBankLogo size="md" />
            </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Forex Rate</h1>
              <p className="text-slate-600">Foreign Exchange Rates</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>As at 19th October 2025</span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Rates
            </Button>
          </div>
        </div>

        {/* Exchange Rates Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              Current Exchange Rates
            </CardTitle>
            <CardDescription>
              All rates are quoted in Ghana Cedis (GHC) per unit of foreign currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Currency</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Code</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900" colSpan={2}>
                      Transfer / Offshore (GHC)
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900" colSpan={2}>
                      Cash (GHC)
                    </th>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-2 px-4"></th>
                    <th className="py-2 px-4"></th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-slate-600">Buying</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-slate-600">Selling</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-slate-600">Buying</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-slate-600">Selling</th>
                  </tr>
                </thead>
                <tbody>
                  {forexRates.map((rate, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-700">{rate.code}</span>
                          </div>
                          <span className="font-medium text-slate-900">{rate.currency}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          {rate.code}
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-4 font-mono text-slate-900">
                        {rate.transfer.buying.toFixed(4)}
                      </td>
                      <td className="text-center py-4 px-4 font-mono text-slate-900">
                        {rate.transfer.selling.toFixed(4)}
                      </td>
                      <td className="text-center py-4 px-4 font-mono text-slate-900">
                        {rate.cash.buying.toFixed(4)}
                      </td>
                      <td className="text-center py-4 px-4 font-mono text-slate-900">
                        {rate.cash.selling.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated:</span>
                <span className="font-medium">19th October 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Base Currency:</span>
                <span className="font-medium">Ghana Cedi (GHC)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rate Type:</span>
                <span className="font-medium">Spot Rates</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• Rates are subject to change without notice</p>
              <p>• Transfer rates apply to electronic transfers</p>
              <p>• Cash rates may vary at branch locations</p>
              <p>• Contact your branch for large transactions</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </AuthWrapper>
  );
}
