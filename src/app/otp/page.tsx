"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Shield,
  CreditCard,
  ArrowLeft,
  Mail
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { verifyOTP, isValidOTPFormat, createOTPData, sendOTPEmail, type OTPData } from "@/lib/otp";
import RoryBankLogo from "@/components/RoryBankLogo";

interface UserData {
  email: string;
  role: string;
  [key: string]: string | undefined;
}

function OTPVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [error, setError] = useState("");
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    // Get user data and OTP data from URL params or localStorage
    const email = searchParams.get('email');
    const userJson = searchParams.get('user');
    
    if (userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        setUserData(user);
        
        // Create OTP data for this user
        const newOtpData = createOTPData(email || user.email);
        setOtpData(newOtpData);
        
        // Send OTP
        sendOTPEmail(email || user.email, newOtpData.code);
      } catch (error) {
        setError("Invalid session data. Please login again.");
      }
    } else {
      setError("No session data found. Please login again.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpData || !userData) return;
    
    setIsVerifyingOTP(true);
    setError("");

    // Validate OTP format
    if (!isValidOTPFormat(otp)) {
      setError("Please enter a valid 4-digit OTP.");
      setIsVerifyingOTP(false);
      return;
    }

    // Verify OTP
    const verification = verifyOTP(otp, otpData);
    
    if (verification.isValid) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Redirect based on role
      if (userData.role === 'Administrator') {
        router.push('/management');
      } else { 
        router.push('/dashboard');
      }
    } else {
      setError(verification.message);
    }
    
    setIsVerifyingOTP(false);
  };

  const handleResendOTP = async () => {
    if (!userData) return;
    
    setIsResendingOTP(true);
    setError("");

    try {
      const newOtpData = createOTPData(userData.email);
      const emailSent = await sendOTPEmail(userData.email, newOtpData.code);
      
      if (emailSent) {
        setOtpData(newOtpData);
        setTimeLeft(900); // Reset timer (15 minutes)
        setError("");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    }
    
    setIsResendingOTP(false);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  if (error && error.includes("session")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Session Expired</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={handleBackToLogin} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RoryBankLogo size="xl" />
          </div>
          <p className="text-slate-600 mt-2">Verify Your Identity</p>
        </div>

        {/* OTP Verification Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Enter Verification Code</CardTitle>
            <CardDescription className="text-slate-600">
              We've sent a 4-digit code to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* Email Display */}
              <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">{userData?.email}</span>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700 font-medium">
                  Verification Code
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500 text-center text-lg tracking-widest"
                    maxLength={4}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Timer and Resend */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${timeLeft > 60 ? 'bg-green-500' : timeLeft > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-600">
                    {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Code expired'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResendingOTP || timeLeft > 0}
                  className="text-amber-600 hover:text-amber-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingOTP ? "Sending..." : "Resend"}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isVerifyingOTP || otp.length !== 4 || timeLeft === 0}
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-medium"
              >
                {isVerifyingOTP ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Verify Code
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* Back to Login Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToLogin}
                className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Secure Verification</p>
                  <p className="text-xs text-amber-700 mt-1">
                    This code expires in 15 minutes and can only be used once. Never share this code with anyone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Didn't receive the code? <button onClick={handleResendOTP} className="text-amber-600 hover:text-amber-700 font-medium">Resend</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <OTPVerificationContent />
    </Suspense>
  );
}
