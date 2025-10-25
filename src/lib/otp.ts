// OTP utility functions

import { sendOTPEmail as sendEmailJSOTP } from './emailService';

export interface OTPData {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

// Generate a random 4-digit OTP
export function generateOTP(): string {
  // Generate a truly random 4-digit OTP
  const min = 1000;
  const max = 9999;
  const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomOTP.toString();
}

// Generate OTP with additional security (alternative method)
export function generateSecureOTP(): string {
  // Use crypto.getRandomValues for better randomness if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0];
    const otp = (randomValue % 9000) + 1000; // Ensure 4-digit range
    return otp.toString();
  }
  
  // Fallback to Math.random
  return generateOTP();
}

// Check if OTP is expired
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

// Validate OTP format (4 digits)
export function isValidOTPFormat(otp: string): boolean {
  return /^\d{4}$/.test(otp);
}

// Create OTP data
export function createOTPData(email: string): OTPData {
  return {
    code: generateSecureOTP(), // Use secure OTP generation
    email,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now (matching EmailJS template)
    attempts: 0
  };
}

// Send OTP via EmailJS
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    console.log('\n' + '='.repeat(50));
    console.log('📧 SENDING RANDOM OTP VIA EMAILJS');
    console.log('='.repeat(50));
    console.log(`📬 To: ${email}`);
    console.log(`🔐 Random OTP Code: ${otp}`);
    console.log(`⏰ Generated at: ${new Date().toLocaleString()}`);
    console.log(`⏳ Expires in: 15 minutes`);
    console.log('='.repeat(50));
    
    // Send OTP via EmailJS
    const success = await sendEmailJSOTP(email, otp);
    
    if (success) {
      console.log('✅ OTP email sent successfully via EmailJS');
      console.log('💡 Check your email inbox for the OTP code\n');
    } else {
      console.log('❌ Failed to send OTP email via EmailJS');
      console.log('💡 Using fallback - OTP code is:', otp, '\n');
    }
    
    return success;
    
  } catch (error) {
    console.warn('OTP email sending error (non-blocking):', error);
    console.log('💡 Using fallback - OTP code is:', otp, '\n');
    // Always return true in development to allow the flow to continue
    return true;
  }
}

// Verify OTP
export function verifyOTP(inputOTP: string, otpData: OTPData): { isValid: boolean; message: string } {
  // Check if OTP is expired
  if (isOTPExpired(otpData.expiresAt)) {
    return { isValid: false, message: "OTP has expired. Please request a new one." };
  }
  
  // Check attempts limit
  if (otpData.attempts >= 3) {
    return { isValid: false, message: "Too many failed attempts. Please request a new OTP." };
  }
  
  // Check if OTP matches
  if (inputOTP === otpData.code) {
    return { isValid: true, message: "OTP verified successfully!" };
  }
  
  // Increment attempts
  otpData.attempts += 1;
  const remainingAttempts = 3 - otpData.attempts;
  
  return { 
    isValid: false, 
    message: `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : 'No attempts remaining.'}` 
  };
}