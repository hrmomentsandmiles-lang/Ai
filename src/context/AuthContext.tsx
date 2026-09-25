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
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);
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

    try {
      const rawDigits = phone.replace(/\D/g, '');
      const formattedPhone = `+91 ${rawDigits.slice(-10)}`;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/users/request-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formattedPhone,
            role,
            displayName: userName.trim(),
          }),
        },
      );
      let result: {
        success?: boolean;
        error?: string;
        challengeId?: string;
        mockOtp?: string;
      };
      try {
        result = (await response.json()) as typeof result;
      } catch {
        throw new Error(`CivicFlow API returned an invalid response (${response.status}).`);
      }

      if (!response.ok || !result.success || !result.challengeId || !result.mockOtp) {
        throw new Error(result.error || 'Unable to request a CivicFlow OTP.');
      }

      setOtpChallengeId(result.challengeId);
      setGeneratedMockOtp(result.mockOtp);
      setOtp('');
      setStep('otp');
      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to connect to CivicFlow API.',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndLogin = async (): Promise<boolean> => {
    setError(null);

    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return false;
    }

    setIsLoading(true);

    try {
      if (!otpChallengeId) {
        throw new Error('Please request a new OTP before verifying.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/users/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: otpChallengeId,
            otp: otp.trim(),
          }),
        }
      );
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        user?: {
          id?: string;
          phone?: string;
          role?: UserRole;
          displayName?: string;
          badgeId?: string | null;
          department?: string | null;
        };
        sessionToken?: string;
      };

      if (!response.ok || !result.success || !result.user?.id || !result.sessionToken) {
        throw new Error(result.error || 'Unable to connect your account to CivicFlow.');
      }

      const newSession: UserSession = {
        userId: result.user.id,
        sessionToken: result.sessionToken,
        phone: result.user.phone || phone,
        role: result.user.role === 'officer' ? 'officer' : 'citizen',
        authenticatedAt: new Date().toISOString(),
        displayName: result.user.displayName || userName.trim(),
        badgeId: result.user.badgeId || undefined,
        department: result.user.department || undefined,
      };

      setSession(newSession);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      } catch {
        // Ignore storage errors.
      }

      navigate(newSession.role === 'citizen' ? '/citizen/dashboard' : '/officer');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to CivicFlow API.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
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
    setOtpChallengeId(null);
    setUserName('');
    setError(null);
    setIsLoading(false);
  };

  const usePresetDemo = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setPhone(selectedRole === 'citizen' ? '9876543210' : '9867452310');
    setUserName(selectedRole === 'citizen' ? 'Aarav Sharma' : 'priya');
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
