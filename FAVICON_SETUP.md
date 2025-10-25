# Rory Bank Favicon Setup

## 📁 Files Created:
- `public/favicon.svg` - SVG favicon (32x32)
- `public/favicon-generator.html` - Generator page for creating other formats

## 🔧 Next Steps:

### 1. Create favicon.ico file:
You can create a favicon.ico file by:
- Opening `public/favicon-generator.html` in your browser
- Right-clicking on the SVG and saving as favicon.svg
- Using an online converter like https://favicon.io/favicon-converter/
- Upload the SVG and download the favicon.ico file
- Place it in the `public/` directory

### 2. Create apple-touch-icon.png:
- Use the same SVG from favicon-generator.html
- Convert to PNG format (180x180px recommended)
- Save as `apple-touch-icon.png` in the `public/` directory

### 3. Alternative: Use online favicon generator:
- Go to https://favicon.io/
- Upload the SVG file
- Download the complete favicon package
- Extract files to the `public/` directory

## ✅ Current Setup:
The layout.tsx file is already configured to use:
- `/favicon.svg` for modern browsers
- `/favicon.ico` for older browsers
- `/apple-touch-icon.png` for iOS devices
- Theme color: #D97706 (Rory Bank orange)

## 🎯 Favicon Features:
- **Bank building** with windows and door
- **Security shield** with checkmark
- **Rory Bank colors** (amber/orange gradient)
- **Clean design** that works at small sizes
- **Professional appearance** for browser tabs

The favicon will now appear in browser tabs, bookmarks, and mobile home screen icons!
