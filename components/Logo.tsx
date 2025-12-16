import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', invert?: boolean }> = ({ size = 'md', invert = false }) => {
    const sizeClasses = {
        sm: 'h-8 text-xl',
        md: 'h-12 text-2xl',
        lg: 'h-16 text-4xl'
    };

    const textColor = invert ? 'text-white' : 'text-black';
    const subTextColor = invert ? 'text-teal-200' : 'text-black';

    return (
        <div className={`flex items-center gap-3 select-none ${textColor}`}>
            {/* Visual Representation of the Logo described */}
            <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-brand-900 shadow-lg ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-20 h-20'}`}>
                <div className="absolute inset-1 rounded-full border-2 border-white/30"></div>
                {/* Stylized Flower Icon Center */}
                <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" opacity="0.5"/>
                    <circle cx="12" cy="12" r="3" fill="white" />
                </svg>
            </div>
            
            <div className="flex flex-col leading-none">
                <span className={`font-serif font-bold ${sizeClasses[size]}`}>
                    V-&.C
                </span>
                <span className={`text-[0.65em] font-semibold tracking-widest uppercase ${subTextColor}`}>
                    Consultoria, Lda
                </span>
            </div>
        </div>
    );
};