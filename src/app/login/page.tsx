"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Shield,
  CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RoryBankLogo from "@/components/RoryBankLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Dummy users
  const users = [
    {
      id: "linaglenn",
      email: "linawills48@gmail.com",
      password: "i4cu56725",
      name: "Linaglenn",
      role: "Customer"
    },
    {
      id: "admin",
      email: "support@rorybank.com",
      password: "admin123",
      name: "Admin User",
      role: "Administrator"
    },
    {
      id: "jgary",
      email: "jessicagary8@gmail.com",
      password: "News2me2$77$",
      name: "Jessica",
      role: "Customer"
    },
    {
      id: "kate",
      email: "cake4ukate@gmail.com",
      password: "katecake123",
      name: "Kate",
      role: "Customer"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => (u.email === email || u.id === email) && u.password === password);

      if (user) {
        // Check if user should skip OTP (jgary and admin users)
        if (user.id === 'jgary' || user.id === 'kate' || user.role === 'Administrator') {
          // Skip OTP and go directly to dashboard
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
          router.push('/dashboard');
        } else {
          // Redirect to OTP verification page with user data
          const userParam = encodeURIComponent(JSON.stringify(user));
          const emailParam = encodeURIComponent(user.email);

          console.log('🔍 Login Debug Info:');
          console.log('Found user:', user);
          console.log('User JSON:', JSON.stringify(user));
          console.log('Encoded user param:', userParam);
          console.log('Email param:', emailParam);
          console.log('Redirect URL:', `/otp?user=${userParam}&email=${emailParam}`);

          router.push(`/otp?user=${userParam}&email=${emailParam}`);
        }
      } else {
        setError("Invalid ID/email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (userType: 'customer' | 'admin') => {
    const user = userType === 'customer' ? users[0] : users[1];
    setEmail(user.id);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RoryBankLogo size="xl" />
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* ID/Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Customer ID or Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your ID or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>


            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Secure Login</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Your connection is encrypted and secure. We never store your password in plain text.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Need help? <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
