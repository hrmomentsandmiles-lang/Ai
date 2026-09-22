import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession, AuthStep } from '../types/auth';
import { useRouter } from './RouterContext';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  phone: string;
  setPhone: (phone: string) => void;
  userName: string;
  setUserName: (userName: string) => void;
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  otp: string;
  setOtp: (otp: string) => void;
  generatedMockOtp: string;
  session: UserSession | null;
  error: string | null;
  isLoading: boolean;
  sendMockOtp: () => Promise<boolean>;
  verifyOtpAndLogin: () => Promise<boolean>;
  logout: () => void;
  usePresetDemo: (role: UserRole) => void;
  resetAuthFlow: () => void;
  updateUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'civicflow_mock_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { navigate } = useRouter();
  const [role, setRole] = useState<UserRole>('citizen');
  const [phone, setPhone] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [step, setStep] = useState<AuthStep>('input');
  const [otp, setOtp] = useState<string>('');
  const [generatedMockOtp, setGeneratedMockOtp] = useState<string>('842109');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(null);

  // Restore mock session from sessionStorage on load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserSession;
        setSession(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const sendMockOtp = async (): Promise<boolean> => {
    setError(null);
    if (!userName.trim()) {
      setError('Please enter your username / full name.');
      return false;
    }
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }

    setIsLoading(true);
    // Simulate brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Generate a new 6-digit mock code
    const newMockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMockOtp(newMockOtp);
    setOtp('');
    setStep('otp');
    setIsLoading(false);
    return true;
  };

  const verifyOtpAndLogin = async (): Promise<boolean> => {
    setError(null);
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return false;
    }

    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return false;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const finalDisplayName =
      userName.trim() || (role === 'citizen' ? 'Aarav Sharma' : 'Municipal Field Officer');
    const rawDigits = phone.replace(/\D/g, '');
    const formattedPhone = rawDigits ? `+91 ${rawDigits.slice(-10)}` : '+91 98765 43210';

    const newSession: UserSession = {
      phone: formattedPhone,
      role,
      authenticatedAt: new Date().toISOString(),
      displayName: finalDisplayName,
      badgeId: role === 'officer' ? 'MUNI-FLD-882' : undefined,
      department: role === 'officer' ? 'Urban Works & Public Safety' : undefined,
    };

    setSession(newSession);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // Ignore storage errors
    }

    setIsLoading(false);

    // Route user according to role as requested:
    // Citizen -> /citizen/dashboard
    // Officer -> /officer
    if (role === 'citizen') {
      navigate('/citizen/dashboard');
    } else {
      navigate('/officer');
    }

    return true;
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);
    resetAuthFlow();
    navigate('/');
  };

  const updateUserName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setSession((prev) => {
      if (!prev) return null;
      const updated: UserSession = { ...prev, displayName: trimmed };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const resetAuthFlow = () => {
    setStep('input');
    setOtp('');
    setUserName('');
    setError(null);
    setIsLoading(false);
  };

  const usePresetDemo = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setPhone(selectedRole === 'citizen' ? '9876543210' : '9876543211');
    setUserName(selectedRole === 'citizen' ? 'Aarav Sharma' : 'Rajesh Kumar');
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        phone,
        setPhone,
        userName,
        setUserName,
        step,
        setStep,
        otp,
        setOtp,
        generatedMockOtp,
        session,
        error,
        isLoading,
        sendMockOtp,
        verifyOtpAndLogin,
        logout,
        usePresetDemo,
        resetAuthFlow,
        updateUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
