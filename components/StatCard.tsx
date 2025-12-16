import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    icon: LucideIcon;
    color: 'blue' | 'teal' | 'orange' | 'purple' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, color }) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600',
        teal: 'bg-teal-50 text-teal-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-black mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-black">{value}</h3>
                    {trend && <p className="text-xs font-medium text-green-700 mt-2">{trend}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};