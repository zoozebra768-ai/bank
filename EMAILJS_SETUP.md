# EmailJS Setup Guide for Rory Bank

## 📧 Quick EmailJS Setup with PrivateEmail.com

### Step 1: Get Your EmailJS Public Key
1. Go to your EmailJS dashboard
2. Go to "Account" section
3. Copy your **Public Key** (User ID)

### Step 2: Create Email Templates

#### 2.1 Contact Form Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template:

**Template Name:** `template_contact`

**Subject:** `New Contact Form Submission - {{subject}}`

**Content:**
```
From: {{from_name}} ({{from_email}})
Phone: {{phone}}
Category: {{category}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your Rory Bank website contact form.
```

4. Save the template and note the **Template ID**

#### 2.2 OTP Template (REQUIRED)
1. Create another template named `template_otp`
2. **Subject:** `Your Rory Bank OTP Code`
3. **Content:**
```
Your OTP code is: {{otp_code}}
This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

---
Rory Bank - Secure Banking
```
4. Save the template and note the **Template ID**

### Step 3: Update Code Configuration

Replace these values in `src/lib/emailService.ts`:

```typescript
// Line 21: Your service ID (already set)
serviceId: 'service_qnge28c',

// Line 22: Replace with your contact template ID
templateId: 'template_fee7aba',

// Line 23: Replace with your EmailJS public key
publicKey: 'ym8zb_WRn3hwmuJoi',
```

**IMPORTANT:** Also update the OTP template ID in the `sendOTPEmail` function (around line 96):

```typescript
// Send OTP email using EmailJS
const result = await emailjs.send(
  EMAILJS_CONFIG.serviceId,
  'template_otp', // Replace with your actual OTP template ID
  templateParams
);
```

### Step 4: Test the Setup

1. Run your development server
2. Go to the contact page
3. Fill out and submit the form
4. Check your email at `support@rorybank.com`

### Step 5: EmailJS Configuration Summary

**Service ID:** `service_qnge28c` ✅ (Already set)
**Public Key:** `YOUR_PUBLIC_KEY` (Replace this)
**Contact Template ID:** `YOUR_CONTACT_TEMPLATE_ID` (Replace this)
**OTP Template ID:** `template_otp` (Optional)

### Quick Setup Checklist
- [ ] EmailJS account created
- [ ] PrivateEmail.com service connected
- [ ] Contact form template created
- [ ] Public key obtained
- [ ] Service ID: `service_qnge28c` ✅
- [ ] Template ID obtained
- [ ] Code updated with real IDs
- [ ] Test email sent successfully

### Troubleshooting
- Make sure all IDs are correct
- Check that your PrivateEmail.com service is properly configured
- Verify the template variables match the code
- Check browser console for any error messages
- Ensure your PrivateEmail.com service allows sending to `support@rorybank.com`

### Free Tier Limits
- 200 emails per month
- Perfect for most small business websites
- Upgrade if you need more emails
