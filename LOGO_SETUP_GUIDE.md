# Rory Bank Email Logo Setup Guide

## 🎯 **Logo URL for EmailJS:**
```
https://rorybank.com/logo-email.png
```

## 📁 **Files Created:**
- `public/logo-email.svg` - SVG version of the logo
- Email service updated to use your domain

## 🔧 **Setup Steps:**

### **Step 1: Convert SVG to PNG**
1. Open `public/logo-email.svg` in your browser
2. Right-click and "Save image as" or use an online converter
3. Convert to PNG format (200x60 pixels)
4. Save as `logo-email.png`

### **Step 2: Upload to Your Domain**
Upload `logo-email.png` to your website's root directory:
```
rorybank.com/logo-email.png
```

### **Step 3: Test the URL**
Visit `https://rorybank.com/logo-email.png` to ensure it loads correctly.

### **Step 4: Update EmailJS Template**
In your EmailJS template, the `{{logo}}` variable will now use:
```html
<img src="{{logo}}" alt="Rory Bank" />
```

Which resolves to:
```html
<img src="https://rorybank.com/logo-email.png" alt="Rory Bank" />
```

## 🎨 **Logo Specifications:**
- **Size**: 200x60 pixels
- **Format**: PNG (for email compatibility)
- **Background**: Light amber (#FEF3C7)
- **Icon**: Bank building with security shield
- **Text**: "Rory Bank" + "Secure Banking"
- **Colors**: Rory Bank orange gradient

## ✅ **Benefits:**
- ✅ **Professional branding** - uses your own domain
- ✅ **Reliable hosting** - on your own server
- ✅ **Email compatible** - PNG format works everywhere
- ✅ **Brand consistency** - matches your website design
- ✅ **Fast loading** - served from your CDN/server

## 🚀 **Alternative: Use SVG (Advanced)**
If you want to use the SVG version directly:
```javascript
// In emailLogo.ts, change to:
hostedLogoUrl: 'https://rorybank.com/logo-email.svg',
```

**Note**: SVG works in most modern email clients but PNG is more universally compatible.

## 🔍 **Testing:**
1. Upload the logo to your domain
2. Test the URL in your browser
3. Send a test OTP email
4. Verify the logo appears correctly

Your EmailJS template will now use your professional Rory Bank logo hosted on your own domain!
