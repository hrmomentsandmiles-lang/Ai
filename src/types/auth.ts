export type UserRole = 'citizen' | 'officer';

export type AuthStep = 'input' | 'otp';

export interface UserSession {
  phone: string;
  role: UserRole;
  authenticatedAt: string;
  displayName: string;
  badgeId?: string;
  department?: string;
}

export interface AuthState {
  session: UserSession | null;
  role: UserRole;
  phone: string;
  step: AuthStep;
  otp: string;
  generatedMockOtp: string;
  error: string | null;
  isLoading: boolean;
}
