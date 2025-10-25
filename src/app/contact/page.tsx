"use client";

import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Customer Support | Rory Bank",
  description: "Get in touch with Rory Bank customer support. 24/7 assistance for all your banking needs. Email support@rorybank.com or visit our Accra branch.",
  keywords: [
    "contact Rory Bank",
    "customer support",
    "banking help",
    "Rory Bank support",
    "banking assistance",
    "financial support"
  ],
  openGraph: {
    title: "Contact Us - Customer Support | Rory Bank",
    description: "Get in touch with Rory Bank customer support. 24/7 assistance for all your banking needs.",
    url: "https://rorybank.com/contact",
  },
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Shield,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendContactEmail, validateEmail } from "@/lib/emailService";

export default function ContactPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setSubmitError(null);
    setValidationErrors({});
    
    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            category: "",
            message: ""
          });
        }, 3000);
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again or email us directly at support@rorybank.com.');
    }
    
    setIsSubmitting(false);
  };

  const contactInfo = [
    // {
    //   icon: Phone,
    //   title: "Phone Support",
    //   details: ["+233 30 123 4567", "+233 20 987 6543"],
    //   description: "24/7 customer support"
    // },
    {
      icon: Mail,
      title: "Email Support",
      details: ["support@rorybank.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Independence Avenue", "Accra, Ghana"],
      description: "Monday - Friday, 8AM - 5PM"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 8AM - 5PM", "Saturday: 9AM - 2PM"],
      description: "Closed on Sundays"
    }
  ];

  const supportCategories = [
    "General Inquiry",
    "Account Support",
    "Technical Issue",
    "Card Services",
    "Loan Services",
    "Investment Advice",
    "Complaint",
    "Feedback",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Rory Bank</h1>
              <p className="text-xs text-slate-500">Contact Us</p>
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
                <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Building2 className="w-5 h-5" />
                  Home
                </button>
                <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Shield className="w-5 h-5" />
                  Online Banking
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 font-medium">
                  <MessageCircle className="w-5 h-5" />
                  Contact
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

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Rory Bank</h1>
                <p className="text-xs text-slate-500">Contact Us</p>
              </div>
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
      <main className="max-w-7xl mx-auto px-6 py-8 min-h-screen overflow-y-auto pb-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, concerns, or support you need.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-amber-700" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-600">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className={validationErrors.name ? "border-red-500" : ""}
                        />
                        {validationErrors.name && (
                          <p className="text-sm text-red-600">{validationErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          required
                          className={validationErrors.email ? "border-red-500" : ""}
                        />
                        {validationErrors.email && (
                          <p className="text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className={validationErrors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.category && (
                          <p className="text-sm text-red-600">{validationErrors.category}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                        className={validationErrors.subject ? "border-red-500" : ""}
                      />
                      {validationErrors.subject && (
                        <p className="text-sm text-red-600">{validationErrors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                        className={validationErrors.message ? "border-red-500" : ""}
                      />
                      {validationErrors.message && (
                        <p className="text-sm text-red-600">{validationErrors.message}</p>
                      )}
                    </div>

                    {/* Submit Error Display */}
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="w-3 h-3 text-red-600" />
                          </div>
                          <p className="text-red-800 font-medium">Error</p>
                        </div>
                        <p className="text-red-700 text-sm mt-1">{submitError}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Quick Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-amber-700" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-600 text-sm">{detail}</p>
                      ))}
                      <p className="text-xs text-slate-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-amber-600 to-orange-700 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              <Button 
                  className="w-full bg-white/20 text-white hover:bg-white/30 border-0"
                  onClick={() => window.open('mailto:support@rorybank.com')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
               
                <Button 
                  className="w-full bg-white/20 text-white hover:bg-white/30 border-0"
                  onClick={() => router.push('/login')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Online Banking
                </Button>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">How quickly will I get a response?</h4>
                  <p className="text-sm text-slate-600">We typically respond to all inquiries within 24 hours during business days.</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Is my information secure?</h4>
                  <p className="text-sm text-slate-600">Yes, all your information is encrypted and protected by bank-level security.</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Can I visit a branch?</h4>
                  <p className="text-sm text-slate-600">Yes, our main branch is located at 123 Independence Avenue, Accra.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
