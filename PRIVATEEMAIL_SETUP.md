# PrivateEmail.com Setup Guide for Rory Bank

## 📧 Complete Email Setup Instructions

### Step 1: PrivateEmail.com Account Setup

#### 1.1 Create Account
- Go to [privateemail.com](https://privateemail.com)
- Sign up for an account
- Choose a plan that includes email forwarding

#### 1.2 Configure Email Addresses
- Add `support@rorybank.com` as your primary email
- Set up email forwarding to your personal email
- Configure spam filters and security settings

### Step 2: DNS Configuration

#### 2.1 MX Records
Add these MX records to your domain DNS:

```
Type: MX
Name: @
Value: mail.privateemail.com
Priority: 10
TTL: 3600
```

#### 2.2 SPF Record
Add SPF record for email authentication:

```
Type: TXT
Name: @
Value: v=spf1 include:privateemail.com ~all
TTL: 3600
```

#### 2.3 DKIM Record
- Get DKIM key from privateemail.com control panel
- Add as TXT record:
```
Type: TXT
Name: default._domainkey
Value: [DKIM key from privateemail.com]
TTL: 3600
```

### Step 3: SMTP Configuration

#### 3.1 SMTP Settings
Use these settings for sending emails:

```
Host: mail.privateemail.com
Port: 587 (TLS) or 465 (SSL)
Security: STARTTLS or SSL
Username: support@rorybank.com
Password: [your email password]
```

#### 3.2 Environment Variables
Add to your `.env.local` file:

```env
EMAIL_HOST=mail.privateemail.com
EMAIL_PORT=587
EMAIL_USER=support@rorybank.com
EMAIL_PASSWORD=zoozebra23
EMAIL_SECURE=false
```

### Step 4: Production Email Service

#### 4.1 Install Nodemailer
```bash
bun add nodemailer
bun add @types/nodemailer
```

#### 4.2 Update Email Service
Replace the simulated email sending in `src/lib/emailService.ts` with actual SMTP:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Step 5: Email Templates

#### 5.1 Contact Form Email
When someone submits the contact form, you'll receive:

```
Subject: [Category] Subject Line
From: Customer Name <customer@email.com>
To: support@rorybank.com

Name: Customer Name
Email: customer@email.com
Phone: +1234567890
Category: General Inquiry
Subject: Subject Line

Message:
Customer's message here...
```

#### 5.2 OTP Email
When users request OTP codes:

```
Subject: Your Rory Bank OTP Code
From: support@rorybank.com
To: user@email.com

Your OTP code is: 123456
This code will expire in 5 minutes.
```

### Step 6: Testing

#### 6.1 Test Email Forwarding
1. Send a test email to `support@rorybank.com`
2. Verify it forwards to your personal email
3. Check spam folder if not received

#### 6.2 Test Contact Form
1. Fill out the contact form on your site
2. Submit the form
3. Check if email is received in your inbox

#### 6.3 Test OTP System
1. Try logging in
2. Check if OTP email is sent
3. Verify OTP code works

### Step 7: Security Considerations

#### 7.1 Email Security
- Enable 2FA on your privateemail.com account
- Use strong passwords
- Regularly check login logs

#### 7.2 Spam Protection
- Configure spam filters
- Monitor email delivery
- Set up email alerts for failed deliveries

### Step 8: Monitoring

#### 8.1 Email Logs
- Monitor email delivery rates
- Check bounce rates
- Review spam complaints

#### 8.2 Performance
- Track email response times
- Monitor form submission success rates
- Check OTP delivery rates

## 🔧 Troubleshooting

### Common Issues

#### Emails Not Received
1. Check spam folder
2. Verify DNS records are correct
3. Test with different email providers
4. Contact privateemail.com support

#### SMTP Errors
1. Verify credentials
2. Check firewall settings
3. Test with different ports (587 vs 465)
4. Verify SSL/TLS settings

#### DNS Issues
1. Wait 24-48 hours for DNS propagation
2. Use DNS checker tools
3. Verify MX record priority
4. Check SPF record syntax

## 📞 Support

### PrivateEmail.com Support
- Email: support@privateemail.com
- Documentation: [privateemail.com/docs](https://privateemail.com/docs)
- Status Page: [status.privateemail.com](https://status.privateemail.com)

### Additional Resources
- [Email Deliverability Best Practices](https://privateemail.com/docs/deliverability)
- [DNS Configuration Guide](https://privateemail.com/docs/dns)
- [SMTP Setup Instructions](https://privateemail.com/docs/smtp)


