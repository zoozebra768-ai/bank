# EmailJS OTP Template with Logo - Setup Guide

## 📧 Updated OTP Email Template

Your EmailJS template should now include these variables:

### **Template Variables Available:**
- `{{passcode}}` - The 4-digit OTP code
- `{{time}}` - Expiration time (15 minutes from now)
- `{{email}}` - Recipient email address
- `{{logo_url}}` - Hosted logo URL (recommended for most email clients)
- `{{logo_svg}}` - SVG logo code (for HTML emails)
- `{{company_name}}` - "Rory Bank"
- `{{support_email}}` - "support@rorybank.com"
- `{{website_url}}` - "https://rorybank.com"

## 🎨 **Recommended EmailJS Template HTML:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rory Bank OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo img {
            max-width: 200px;
            height: auto;
        }
        .otp-code {
            background-color: #fef3c7;
            border: 2px solid #d97706;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            color: #d97706;
            letter-spacing: 5px;
        }
        .warning {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #d97706;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Logo Section -->
        <div class="logo">
            <img src="{{logo_url}}" alt="{{company_name}}" />
        </div>
        
        <!-- Header -->
        <h1 style="color: #d97706; text-align: center;">OTP Verification</h1>
        
        <!-- Main Content -->
        <p>Hello,</p>
        <p>You have requested a One Time Password (OTP) for your {{company_name}} account.</p>
        
        <!-- OTP Code -->
        <div class="otp-code">
            {{passcode}}
        </div>
        
        <!-- Instructions -->
        <p><strong>Instructions:</strong></p>
        <ul>
            <li>Enter this code in the verification field</li>
            <li>This code will expire at: <strong>{{time}}</strong></li>
            <li>Do not share this code with anyone</li>
        </ul>
        
        <!-- Warning -->
        <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            {{company_name}} will never contact you about this email or ask for any login codes or links. 
            Beware of phishing scams. If you didn't make this request, you can safely ignore this email.
        </div>
        
        <!-- Support -->
        <p>If you have any questions or concerns, please contact our support team:</p>
        <p>
            <a href="mailto:{{support_email}}" class="button">Contact Support</a>
        </p>
        
        <!-- Footer -->
        <div class="footer">
            <p>This email was sent to: {{email}}</p>
            <p>&copy; 2024 {{company_name}}. All rights reserved.</p>
            <p>Visit us at: <a href="{{website_url}}">{{website_url}}</a></p>
        </div>
    </div>
</body>
</html>
```

## 🔧 **Alternative Simple Template (Text-based):**

If you prefer a simpler approach, you can use this text-based template:

```
Subject: Your Rory Bank OTP Code

{{logo_url}}

To authenticate, please use the following One Time Password (OTP):

{{passcode}}

This OTP will be valid for 15 minutes till {{time}}.

Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.

{{company_name}} will never contact you about this email or ask for any login codes or links. Beware of phishing scams.

Thanks for visiting {{company_name}}!

---
{{company_name}} Support Team
{{support_email}}
{{website_url}}
```

## 📋 **Setup Steps:**

1. **Go to EmailJS Dashboard** → Email Templates
2. **Edit your OTP template** (template_q29hzcs)
3. **Replace the content** with one of the templates above
4. **Test the template** with the new variables
5. **Update template variables** to include all the new parameters

## 🎯 **Logo Options:**

- **`{{logo_url}}`** - Use this for most email clients (recommended)
- **`{{logo_svg}}`** - Use this for HTML emails that support SVG
- **Text fallback** - If images don't load, the template will still work

## ✅ **Benefits:**

- ✅ Professional appearance with logo
- ✅ Consistent branding
- ✅ Better user trust
- ✅ Mobile-responsive design
- ✅ Security warnings included
- ✅ Support contact information
- ✅ Fallback options for different email clients

The template is now ready to use with your updated EmailJS configuration!
