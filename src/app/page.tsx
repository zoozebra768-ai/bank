"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Shield,
  Smartphone,
  TrendingUp,
  CreditCard,
  Lock,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your money is protected with 256-bit encryption and multi-factor authentication."
    },
    {
      icon: Smartphone,
      title: "Mobile Banking",
      description: "Manage your accounts anywhere, anytime with our intuitive mobile app."
    },
    {
      icon: TrendingUp,
      title: "High-Yield Savings",
      description: "Earn competitive interest rates on your savings with no monthly fees."
    },
    {
      icon: CreditCard,
      title: "Premium Cards",
      description: "Get cashback rewards and exclusive benefits with our credit cards."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is always here to help you with any questions."
    },
    {
      icon: Users,
      title: "Trusted by Millions",
      description: "Join over 2 million customers who trust Rory Bank with their finances."
    }
  ];

  const benefits = [
    "No monthly maintenance fees",
    "Free ATM withdrawals nationwide",
    "Instant money transfers",
    "Real-time transaction alerts",
    "Budget tracking tools",
    "Personalized financial insights"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Rory Bank</h1>
                <p className="text-xs text-slate-500">Modern Banking</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-amber-700 transition-colors font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Features</a>
              <a href="#benefits" className="text-slate-600 hover:text-amber-700 transition-colors font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Benefits</a>
              <a href="/forex" className="text-slate-600 hover:text-amber-700 transition-colors font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Forex Rates</a>
              <a href="#about" className="text-slate-600 hover:text-amber-700 transition-colors font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>About</a>
              <a href="/contact" className="text-slate-600 hover:text-amber-700 transition-colors font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button onClick={() => router.push('/login')} className="font-bold bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white" style={{fontFamily: 'Poppins, sans-serif'}}>
                Log In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block text-slate-600 hover:text-amber-700 font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Features</a>
              <a href="#benefits" className="block text-slate-600 hover:text-amber-700 font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Benefits</a>
              <a href="/forex" className="block text-slate-600 hover:text-amber-700 font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Forex Rates</a>
              <a href="#about" className="block text-slate-600 hover:text-amber-700 font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>About</a>
              <a href="/contact" className="block text-slate-600 hover:text-amber-700 font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Contact</a>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => router.push('/login')} className="font-bold bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white" style={{fontFamily: 'Poppins, sans-serif'}}>Log In</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Banking Made
                <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent"> Simple</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Experience modern banking with zero fees, instant transfers, and premium rewards.
                Join millions who trust Rory Bank for their financial future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-lg h-14"
                  onClick={() => router.push('/login')}
                >
                  Go to Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Secure & Safe</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <img 
                  src="https://www.sciencing.com/img/gallery/11-signs-youre-in-a-happy-relationship-according-to-psychology/there-is-mutual-respect-1758326949.webp" 
                  alt="Happy couple in a relationship showing mutual respect" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Your Financial Future</h3>
                  <p className="text-sm opacity-90">Start your journey to financial freedom with Rory Bank</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make managing your money effortless and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200 hover:border-amber-600 transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Choose Rory Bank?</h2>
              <p className="text-lg text-slate-600 mb-8">
                We're committed to providing you with the best banking experience. Here's what sets us apart.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-amber-700 flex-shrink-0" />
                    <span className="text-slate-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white text-3xl">2.5%</CardTitle>
                  <CardDescription className="text-amber-100">APY on Savings</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-3xl">₵0</CardTitle>
                  <CardDescription>Monthly Fees</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-3xl">24/7</CardTitle>
                  <CardDescription>Customer Support</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white text-3xl">2M+</CardTitle>
                  <CardDescription className="text-slate-300">Happy Customers</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Open your account today and experience the future of banking. No fees, no hassle, just simple banking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-amber-800 hover:bg-amber-50 text-lg h-14"
            >
              Open Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10 text-lg h-14"
              onClick={() => router.push('/login')}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Rory Bank</h3>
                  <p className="text-xs text-slate-400">Modern Banking</p>
                </div>
              </div>
              <p className="text-sm">Banking made simple, secure, and accessible for everyone.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400">Checking Accounts</a></li>
                <li><a href="#" className="hover:text-amber-400">Savings Accounts</a></li>
                <li><a href="#" className="hover:text-amber-400">Credit Cards</a></li>
                <li><a href="#" className="hover:text-amber-400">Loans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400">Press</a></li>
                <li><a href="#" className="hover:text-amber-400">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-amber-400">Security</a></li>
                <li><a href="#" className="hover:text-amber-400">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Rory Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
