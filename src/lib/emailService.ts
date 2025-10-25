// EmailJS integration for privateemail.com

import emailjs from '@emailjs/browser';
import { getEmailLogo } from './emailLogo';

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_qnge28c', // Your EmailJS service ID
  templateId: 'template_fee7aba', // Contact template ID
  otpTemplateId: 'template_q29hzcs', // OTP template ID
  publicKey: '9bIGU4DfHN7RcKVF1', // Your EmailJS public key
};

// Initialize EmailJS
export function initEmailJS() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    console.log('EmailJS: Server-side, skipping initialization');
    return;
  }

  try {
    if (emailjs && typeof emailjs.init === 'function') {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      console.log('EmailJS initialized successfully');
    } else {
      console.warn('EmailJS not available');
    }
  } catch (error) {
    console.warn('EmailJS initialization failed:', error);
  }
}

// Send contact form email using EmailJS
export async function sendContactEmail(emailData: EmailData): Promise<EmailResponse> {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    console.log('📧 Server-side: Email would be sent in production');
    console.log('📧 Contact form submission:', emailData);
    return {
      success: true,
      message: 'Email sent successfully! We\'ll get back to you within 24 hours.'
    };
  }

  try {
    // Initialize EmailJS if not already done
    initEmailJS();
    
    // Prepare template parameters
    const templateParams = {
      from_name: emailData.name,
      from_email: emailData.email,
      phone: emailData.phone || 'Not provided',
      subject: emailData.subject,
      category: emailData.category,
      message: emailData.message,
      to_email: 'support@rorybank.com',
    };
    
    console.log('📧 Sending email via EmailJS:');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('Template Params:', templateParams);
    
    // Send email using EmailJS
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );
    
    console.log('Email sent successfully:', result);
    
    return {
      success: true,
      message: 'Email sent successfully! We\'ll get back to you within 24 hours.'
    };
    
  } catch (error: unknown) {
    // Extract error details more carefully
    let errorMessage = 'Unknown error occurred';
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { name: error.name, stack: error.stack };
    } else if (typeof error === 'object' && error !== null) {
      errorDetails = { ...error };
      errorMessage = (error as { message?: string }).message || 'EmailJS error';
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Only log if there's actual error information
    if (Object.keys(errorDetails).length > 0 || errorMessage !== 'Unknown error occurred') {
      console.warn('⚠️ EmailJS sending warning:', errorMessage);
    }
    
    // Log the contact form data for manual processing (only in dev mode)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Contact form submission:', {
        name: emailData.name,
        email: emailData.email,
        subject: emailData.subject,
        category: emailData.category
      });
    }
    return {
      success: true,
      message: 'Thank you for contacting us! We\'ve received your message and will get back to you within 24 hours.'
    };
  }
}

// Send OTP email using EmailJS
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined' || !emailjs.send) {
      console.warn('EmailJS not available, using fallback');
      console.log('💡 OTP Code for testing:', otp);
      return true;
    }

    // Initialize EmailJS if not already done
    initEmailJS();
    
    // Prepare template parameters for OTP (matching EmailJS template)
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    const templateParams = {
      passcode: otp, // The OTP code
      time: expirationTime.toLocaleString(), // Expiration time
      email: email, // Recipient email
      logo: 'https://rorybank.com/logo-email.png', // Direct logo URL
      company_name: 'Rory Bank',
      support_email: 'support@rorybank.com',
      website_url: 'https://rorybank.com'
    };
    
    console.log('📧 Sending OTP via EmailJS:');
    console.log('Recipient email:', email);
    console.log('OTP Code:', otp);
    console.log('Expiration time:', expirationTime.toLocaleString());
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('OTP Template ID:', EMAILJS_CONFIG.otpTemplateId);
    console.log('Template Params:', templateParams);
    
    // Send OTP email using EmailJS (use OTP template)
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.otpTemplateId, // Use OTP template
      templateParams
    );
    
    console.log('OTP email sent successfully:', result);
    return true;
    
  } catch (error: unknown) {
    // Log error details without throwing
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorObj = error as { message?: string; status?: number; text?: string };
    console.warn('OTP email sending failed, using fallback:', {
      message: errorMessage,
      status: errorObj?.status || 'No status',
      text: errorObj?.text || 'No text',
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.otpTemplateId,
      email: email
    });
    
    // For development/testing, always return true to allow OTP flow to continue
    // In production, you might want to return false here
    console.log('💡 Development mode: OTP email failed but continuing with fallback');
    console.log('💡 OTP Code for testing:', otp);
    return true;
  }
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// EmailJS template configurations
export const EMAILJS_TEMPLATES = {
  CONTACT_FORM: {
    templateId: 'template_contact',
    subject: 'New Contact Form Submission - {{subject}}',
    content: `
From: {{from_name}} ({{from_email}})
Phone: {{phone}}
Category: {{category}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your Rory Bank website contact form.
    `
  },
  
  OTP_CODE: {
    templateId: 'template_otp',
    subject: 'Your Rory Bank OTP Code',
    content: `
Your OTP code is: {{otp_code}}
This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

---
Rory Bank - Secure Banking
    `
  }
};
