// Email logo utilities for Rory Bank

export const EMAIL_LOGO_CONFIG = {
  // SVG Logo for emails (inline SVG)
  svgLogo: `
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#EA580C" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="200" height="60" fill="#FEF3C7" rx="8"/>
      
      <!-- Logo Icon -->
      <g transform="translate(10, 10)">
        <!-- Bank Building -->
        <rect x="5" y="25" width="30" height="15" rx="2" fill="url(#logoGradient)"/>
        <rect x="6" y="20" width="28" height="5" rx="1" fill="url(#logoGradient)"/>
        <path d="M2 20 L20 5 L38 20 Z" fill="url(#logoGradient)"/>
        
        <!-- Windows -->
        <rect x="8" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="13" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="18" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="23" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        
        <!-- Door -->
        <rect x="17" y="32" width="6" height="8" rx="0.5" fill="white" opacity="0.4"/>
        
        <!-- Security Shield -->
        <path d="M20 8 L22 10 L20 12 L18 10 Z" fill="white" opacity="0.6"/>
        <path d="M19 10 L20 11 L21 9" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
      
      <!-- Text -->
      <text x="55" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1F2937">Rory Bank</text>
      <text x="55" y="40" font-family="Arial, sans-serif" font-size="12" fill="#6B7280">Secure Banking</text>
    </svg>
  `,
  
  // Base64 encoded logo (alternative)
  base64Logo: 'data:image/svg+xml;base64,' + Buffer.from(`
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#EA580C" />
        </linearGradient>
      </defs>
      
      <rect width="200" height="60" fill="#FEF3C7" rx="8"/>
      
      <g transform="translate(10, 10)">
        <rect x="5" y="25" width="30" height="15" rx="2" fill="url(#logoGradient)"/>
        <rect x="6" y="20" width="28" height="5" rx="1" fill="url(#logoGradient)"/>
        <path d="M2 20 L20 5 L38 20 Z" fill="url(#logoGradient)"/>
        
        <rect x="8" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="13" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="18" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        <rect x="23" y="28" width="3" height="2" rx="0.3" fill="white" opacity="0.3"/>
        
        <rect x="17" y="32" width="6" height="8" rx="0.5" fill="white" opacity="0.4"/>
        
        <path d="M20 8 L22 10 L20 12 L18 10 Z" fill="white" opacity="0.6"/>
        <path d="M19 10 L20 11 L21 9" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
      
      <text x="55" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1F2937">Rory Bank</text>
      <text x="55" y="40" font-family="Arial, sans-serif" font-size="12" fill="#6B7280">Secure Banking</text>
    </svg>
  `).toString('base64'),
  
  // Hosted logo URL (simple, clean logo for emails)
  hostedLogoUrl: 'https://via.placeholder.com/150x40/D97706/FFFFFF?text=Rory+Bank',
  
  // Text-based logo (fallback)
  textLogo: `
    <div style="font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #D97706; text-align: center; padding: 10px;">
      🏦 Rory Bank
    </div>
  `
};

// Get logo for email templates
export function getEmailLogo(type: 'svg' | 'base64' | 'hosted' | 'text' = 'svg'): string {
  switch (type) {
    case 'svg':
      return EMAIL_LOGO_CONFIG.svgLogo;
    case 'base64':
      return EMAIL_LOGO_CONFIG.base64Logo;
    case 'hosted':
      return EMAIL_LOGO_CONFIG.hostedLogoUrl;
    case 'text':
      return EMAIL_LOGO_CONFIG.textLogo;
    default:
      return EMAIL_LOGO_CONFIG.svgLogo;
  }
}
