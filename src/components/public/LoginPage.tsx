import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { CivicFlowLoginCard } from '../auth/CivicFlowLoginCard';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EEF4E5]/60 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            id="login-back-to-home-btn"
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52634C] hover:text-[#182315] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CivicFlow Home</span>
          </button>
        </div>

        {/* Reusable Login Card */}
        <CivicFlowLoginCard />
      </div>
    </div>
  );
};
