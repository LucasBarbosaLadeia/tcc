import type { LucideIcon } from 'lucide-react';

type Color = 'teal' | 'green' | 'blue' | 'orange' | 'purple' | 'red';

const colorMap: Record<Color, { bg: string; icon: string; value: string }> = {
  teal:   { bg: 'bg-teal-50',   icon: 'text-teal-500',   value: 'text-teal-700'   },
  green:  { bg: 'bg-green-50',  icon: 'text-green-500',  value: 'text-green-700'  },
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   value: 'text-blue-700'   },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', value: 'text-orange-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500', value: 'text-purple-700' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-500',    value: 'text-red-700'    },
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: Color;
}

export function StatCard({ label, value, icon: Icon, color = 'teal' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium leading-none mb-1.5 truncate">{label}</p>
        <p className={`text-2xl font-bold leading-none ${c.value}`}>{value}</p>
      </div>
    </div>
  );
}
