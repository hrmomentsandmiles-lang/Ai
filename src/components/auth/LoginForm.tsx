import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldAlert, KeyRound, RefreshCw, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleSelector } from './RoleSelector';

export const LoginForm: React.FC = () => {
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format input as user types
    const raw = e.target.value;
    setPhone(raw);
  };

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

  const handleAutofillMockOtp = () => {
    setOtp(generatedMockOtp);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Prototype Banner */}
      <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl text-amber-900 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-950 uppercase tracking-wide text-[11px]">
                Prototype Sandbox Authentication
              </span>
              <span className="bg-amber-200/70 text-amber-900 font-mono text-[10px] px-1.5 py-0.2 rounded font-medium">
                Simulated SMS
              </span>
            </div>
            <p className="text-amber-800 text-xs leading-relaxed">
              This system uses simulated one-time passwords for hackathon prototyping.
              <strong> No government identity verification</strong> (national IDs, civic registries, or official credentials) is claimed or connected.
            </p>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Quick Demo Pre-fill Bar */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Prototype Quick Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              id="preset-citizen-btn"
              type="button"
              onClick={() => usePresetDemo('citizen')}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Citizen Demo
            </button>
            <button
              id="preset-officer-btn"
              type="button"
              onClick={() => usePresetDemo('officer')}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              Officer Demo
            </button>
          </div>
        </div>

        {step === 'input' ? (
          /* STEP 1: Role Selection & Phone Input */
          <form onSubmit={handleSendOtp} className="space-y-6">
            <RoleSelector
              selectedRole={role}
              onSelectRole={setRole}
              disabled={isLoading}
            />

            <div>
              <label
                htmlFor="mobile-number-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="mobile-number-input"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 019-2831"
                  disabled={isLoading}
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-slate-400 font-mono transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                Any 10-digit number accepted for local prototype evaluation.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <button
              id="send-otp-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Prototype OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Prototype Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center pb-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Verify Mobile Number
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Prototype verification code simulated for{' '}
                <span className="font-mono font-medium text-slate-800">{phone}</span>{' '}
                as <span className="capitalize font-semibold text-slate-800">{role}</span>
              </p>
            </div>

            {/* Mock OTP display box for easy testing */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-500 block">
                  Simulated Mock Code
                </span>
                <span className="text-lg font-mono font-bold tracking-widest text-slate-900">
                  {generatedMockOtp}
                </span>
              </div>
              <button
                id="autofill-otp-btn"
                type="button"
                onClick={handleAutofillMockOtp}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Fill Code</span>
              </button>
            </div>

            <div>
              <label
                htmlFor="otp-code-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                6-Digit Mock Verification Code
              </label>
              <input
                id="otp-code-input"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                disabled={isLoading}
                autoFocus
                className="w-full text-center tracking-[0.6em] text-lg font-mono py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-slate-300 transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                Enter <code className="font-mono font-bold text-slate-700">{generatedMockOtp}</code> or fallback test code <code className="font-mono font-bold text-slate-700">123456</code>.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                id="verify-otp-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Routing...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue to {role === 'citizen' ? '/citizen' : '/officer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  id="back-to-phone-btn"
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-slate-500 hover:text-slate-800 font-medium"
                >
                  Change phone or role
                </button>

                <button
                  id="resend-otp-btn"
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleSendOtp}
                  className="text-slate-600 hover:text-slate-900 font-medium disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Target Routing Hint */}
      <div className="mt-4 text-center text-xs text-slate-500">
        Authentication routes to:{' '}
        <code className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px]">
          {role === 'citizen' ? '/citizen' : '/officer'}
        </code>
      </div>
    </div>
  );
};
