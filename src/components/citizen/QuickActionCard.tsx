import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  route: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  route,
}) => {
  const { navigate } = useRouter();

  return (
    <div
      onClick={() => navigate(route)}
      className="bg-white rounded-2xl p-6 border border-[#E4ECD8] shadow-xs hover:border-[#CAD8BC] hover:shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#F0F5E9] text-[#435322] flex items-center justify-center mb-4 group-hover:bg-[#435322] group-hover:text-white transition-colors duration-200">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-[#182315] tracking-tight">
          {title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[#576650] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#EEF3E8] flex items-center gap-1.5 text-xs font-semibold text-[#435322] group-hover:text-[#324016] transition-colors">
        <span>{actionText}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
