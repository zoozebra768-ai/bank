// OTP utility functions

export interface OTPData {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

// Generate a random 4-digit OTP
export function generateOTP(): string {
  // For testing purposes, always return 5467
  return "5467";
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
    code: generateOTP(),
    email,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    attempts: 0
  };
}

// Simulate sending OTP via email
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // In a real application, this would integrate with an email service like SendGrid, AWS SES, etc.
  console.log('\n' + '='.repeat(50));
  console.log('📧 OTP EMAIL SIMULATION');
  console.log('='.repeat(50));
  console.log(`📬 To: ${email}`);
  console.log(`🔐 OTP Code: ${otp}`);
  console.log(`⏰ Generated at: ${new Date().toLocaleString()}`);
  console.log(`⏳ Expires in: 5 minutes`);
  console.log('='.repeat(50));
  console.log('💡 Copy the OTP code above to test the verification\n');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, we'll always return true
  // In production, handle actual email sending errors
  return true;
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
