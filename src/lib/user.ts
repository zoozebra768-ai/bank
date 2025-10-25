// User data management and utilities

export interface User {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  accountHolder: string;
  role: string;
  avatar: string;
  initials: string;
}

// Default user data
export const defaultUser: UserProfile = {
  name: "Lisaglenn",
  email: "linawils48@gmail.com",
  phone: "+1 (555) 123-4567",
  accountHolder: "Lisa Wills & Glenn Howard Williams",
  role: "Customer",
  avatar: "",
  initials: "LG"
};

// User data management functions
export const getUserData = (): UserProfile => {
  if (typeof window === 'undefined') return defaultUser;
  
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        ...defaultUser,
        ...parsed,
        initials: parsed.name ? parsed.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : defaultUser.initials
      };
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  return defaultUser;
};

export const setUserData = (userData: User): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem('isLoggedIn') === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

export const setLoggedIn = (status: boolean): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('isLoggedIn', status.toString());
  } catch (error) {
    console.error('Error setting login status:', error);
  }
};

// User display utilities
export const getUserDisplayName = (): string => {
  const user = getUserData();
  return user.name || defaultUser.name;
};

export const getUserInitials = (): string => {
  const user = getUserData();
  return user.initials || defaultUser.initials;
};

export const getUserEmail = (): string => {
  const user = getUserData();
  return user.email || defaultUser.email;
};

export const getUserRole = (): string => {
  const user = getUserData();
  return user.role || defaultUser.role;
};

// Email masking utility
export const maskEmail = (email: string): string => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 4) {
    return `${localPart.substring(0, 2)}***@${domain}`;
  }
  return `${localPart.substring(0, 2)}*****${localPart.substring(localPart.length - 2)}@${domain}`;
};

// Account data related to user
export const getUserAccountData = () => {
  return {
    "1": {
      name: "Current Account",
      number: "****4582",
      fullNumber: "5678 9012 2341",
      balance: 3475.25,
      availableBalance: 3475.25,
      type: "Current",
      openedDate: "Oct 15, 2025",
      creditLimit: undefined,
      dueDate: undefined
    }
  };
};
