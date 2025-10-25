import React from 'react';

interface RoryBankLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm', container: 'w-8 h-8' },
  md: { icon: 20, text: 'text-base', container: 'w-10 h-10' },
  lg: { icon: 24, text: 'text-lg', container: 'w-12 h-12' },
  xl: { icon: 32, text: 'text-xl', container: 'w-16 h-16' }
};

const variantMap = {
  default: {
    container: 'bg-gradient-to-br from-amber-600 to-orange-700',
    icon: 'text-white',
    text: 'text-slate-900'
  },
  white: {
    container: 'bg-white',
    icon: 'text-amber-600',
    text: 'text-white'
  },
  dark: {
    container: 'bg-gradient-to-br from-slate-800 to-slate-900',
    icon: 'text-white',
    text: 'text-slate-900'
  }
};

export default function RoryBankLogo({ 
  size = 'md', 
  variant = 'default', 
  showText = true,
  className = ''
}: RoryBankLogoProps) {
  const sizeConfig = sizeMap[size];
  const variantConfig = variantMap[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeConfig.container} ${variantConfig.container} rounded-lg flex items-center justify-center shadow-lg`}>
        <svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={variantConfig.icon}
        >
          {/* Custom Rory Bank Logo Design */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Bank Building Base */}
          <rect x="3" y="12" width="18" height="9" rx="1" fill="url(#logoGradient)" />
          
          {/* Building Structure */}
          <rect x="4" y="8" width="16" height="4" rx="0.5" fill="url(#logoGradient)" />
          
          {/* Roof/Peak */}
          <path d="M2 8 L12 2 L22 8 Z" fill="url(#logoGradient)" />
          
          {/* Windows */}
          <rect x="6" y="10" width="2" height="1.5" rx="0.2" fill="currentColor" fillOpacity="0.3" />
          <rect x="9" y="10" width="2" height="1.5" rx="0.2" fill="currentColor" fillOpacity="0.3" />
          <rect x="12" y="10" width="2" height="1.5" rx="0.2" fill="currentColor" fillOpacity="0.3" />
          <rect x="15" y="10" width="2" height="1.5" rx="0.2" fill="currentColor" fillOpacity="0.3" />
          
          {/* Door */}
          <rect x="10.5" y="14" width="3" height="6" rx="0.3" fill="currentColor" fillOpacity="0.4" />
          
          {/* Security Shield */}
          <path d="M12 4 L14 6 L12 8 L10 6 Z" fill="currentColor" fillOpacity="0.6" />
          
          {/* Trust Symbol - Checkmark */}
          <path d="M10.5 6 L11.5 7 L13.5 5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeConfig.text} font-bold ${variantConfig.text}`}>
            Rory Bank
          </span>
          <span className={`text-xs ${variant === 'white' ? 'text-white/80' : 'text-slate-500'}`}>
            Secure Banking
          </span>
        </div>
      )}
    </div>
  );
}

// Export individual components for specific use cases
export function RoryBankIcon({ size = 'md', variant = 'default', className = '' }: Omit<RoryBankLogoProps, 'showText'>) {
  return <RoryBankLogo size={size} variant={variant} showText={false} className={className} />;
}

export function RoryBankText({ size = 'md', variant = 'default', className = '' }: Omit<RoryBankLogoProps, 'showText'>) {
  const sizeConfig = sizeMap[size];
  const variantConfig = variantMap[variant];
  
  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`${sizeConfig.text} font-bold ${variantConfig.text}`}>
        Rory Bank
      </span>
      <span className={`text-xs ${variant === 'white' ? 'text-white/80' : 'text-slate-500'}`}>
        Secure Banking
      </span>
    </div>
  );
}
