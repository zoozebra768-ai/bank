"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Send,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Globe,
  MessageCircle,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { getUserDisplayName, getUserInitials, clearUserData } from "@/lib/user";
import RoryBankLogo from "@/components/RoryBankLogo";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearUserData();
    router.push('/');
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transfer", href: "/transfer", icon: Send },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Forex", href: "/forex", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RoryBankLogo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white h-full w-80 p-6">
            <div className="flex items-center justify-between mb-8">
              <RoryBankLogo size="md" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="space-y-2 mb-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => {
                      router.push(item.href);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{getUserDisplayName()}</p>
                  <p className="text-xs text-slate-500">Account Holder</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <RoryBankLogo size="md" />
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900">{getUserDisplayName()}</p>
                <p className="text-xs text-slate-500">Account Holder</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Globe className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-slate-200 p-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-slate-600 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

