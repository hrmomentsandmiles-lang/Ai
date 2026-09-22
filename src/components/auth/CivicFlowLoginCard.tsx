import React, { useState } from 'react';
import { User, Shield, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface CivicFlowLoginCardProps {
  className?: string;
}

export const CivicFlowLoginCard: React.FC<CivicFlowLoginCardProps> = ({ className = '' }) => {
  const {
    role,
    setRole,
    phone,
    setPhone,
    step,
    setStep,
    otp,
    setOtp,
    generatedMockOtp,
    error,
    isLoading,
    sendMockOtp,
    verifyOtpAndLogin,
    usePresetDemo,
  } = useAuth();

  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendMockOtp();
    if (ok) {
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtpAndLogin();
  };

  return (
    <div className={`bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-[#E8ECE2] ${className}`}>
      {/* Top Brand inside Card */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-1.5 font-bold text-2xl tracking-tight text-[#182315]">
          <span>CivicFlow</span>
          <span className="text-[#4D602B] relative">
            AI
            <svg
              className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 text-[#556D2F]"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4 14C4 9.5 8.5 5 13 4C13 8.5 8.5 13 4 14Z" />
            </svg>
          </span>
        </div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#718069] uppercase mt-1">
          SMART CITIES. BETTER LIVES.
        </p>
      </div>

      {/* Role Selector Tabs matching reference */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <button
          id="role-citizen-tab"
          type="button"
          onClick={() => {
            setRole('citizen');
            setIsSignUpMode(false);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            role === 'citizen'
              ? 'bg-[#3A4B1F] text-white shadow-sm'
              : 'bg-white border border-[#DDE4D4] text-[#4F5E48] hover:bg-[#F5F8F0]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen Login</span>
        </button>

        <button
          id="role-officer-tab"
          type="button"
          onClick={() => {
            setRole('officer');
            setIsSignUpMode(false);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            role === 'officer'
              ? 'bg-[#3A4B1F] text-white shadow-sm'
              : 'bg-white border border-[#DDE4D4] text-[#4F5E48] hover:bg-[#F5F8F0]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Officer Login</span>
        </button>
      </div>

      {step === 'input' ? (
        /* STEP 1: Phone Input */
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="text-center pb-1">
            <h3 className="text-base font-bold text-[#182315]">
              {isSignUpMode ? 'Register on CivicFlow' : 'Login with OTP'}
            </h3>
            <p className="text-xs text-[#6F7E68] mt-0.5">
              Enter your mobile number to continue
            </p>
          </div>

          <div>
            <div className="flex rounded-xl border border-[#D4DCC9] bg-[#FDFCFB] overflow-hidden focus-within:ring-2 focus-within:ring-[#4D602B] focus-within:border-transparent transition-all">
              <span className="inline-flex items-center px-3.5 bg-[#F2F5ED] text-[#4A5943] text-sm font-semibold border-r border-[#D4DCC9]">
                +91
              </span>
              <input
                id="phone-number-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-3.5 py-2.5 text-sm text-[#182315] bg-transparent focus:outline-none placeholder:text-[#9AA695]"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <button
            id="login-send-otp-btn"
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4EAD9]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-semibold">
              <span className="bg-white px-3 text-[#83927D]">OR</span>
            </div>
          </div>

          <div className="text-center text-xs text-[#5D6B57]">
            {isSignUpMode ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                  className="font-semibold text-[#4D602B] hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to CivicFlow AI?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                  className="font-semibold text-[#4D602B] hover:underline"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </form>
      ) : (
        /* STEP 2: OTP Verification */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center pb-1">
            <div className="w-10 h-10 bg-[#EFF4E7] text-[#4D602B] rounded-full flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#182315]">Enter Verification Code</h3>
            <p className="text-xs text-[#6F7E68] mt-0.5">
              Enter the 6-digit code sent to <span className="font-semibold text-[#182315]">+91 {phone}</span>
            </p>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#F6F8F2] border border-[#DCE4D1] rounded-xl text-xs text-[#52634C]">
            <span>Verification code: <span className="font-mono font-bold text-[#182315]">{generatedMockOtp}</span></span>
            <button
              type="button"
              onClick={() => setOtp(generatedMockOtp)}
              className="text-xs text-[#4D602B] font-semibold hover:underline"
            >
              Auto-fill
            </button>
          </div>

          <div>
            <input
              id="otp-verification-input"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              className="w-full text-center tracking-[0.5em] text-lg font-mono py-2.5 bg-[#FDFCFB] border border-[#D4DCC9] rounded-xl focus:ring-2 focus:ring-[#4D602B] focus:border-transparent text-[#182315] placeholder:text-[#9AA695]"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <button
            id="verify-otp-btn"
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Enter {role === 'citizen' ? 'Citizen' : 'Officer'} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-[#687861] hover:text-[#182315]"
            >
              Change number
            </button>
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={handleSendOtp}
              className="text-[#4D602B] hover:underline font-semibold disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
