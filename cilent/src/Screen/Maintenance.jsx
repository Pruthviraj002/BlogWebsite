import React from 'react';
import { Settings, Wrench } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <Settings className="text-blue-500 animate-[spin_4s_linear_infinite]" size={48} />
                </div>
                <Wrench className="absolute -bottom-2 -right-2 text-indigo-400" size={32} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Under Maintenance
            </h1>
            
            <p className="text-slate-400 max-w-md text-lg font-medium leading-relaxed">
                CodeStories is currently undergoing scheduled upgrades to serve you better. We'll be back online shortly!
            </p>
            
            <div className="mt-12 flex flex-col items-center gap-2">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-4">
                    ESTIMATED DOWNTIME: 15 MINUTES
                </p>
            </div>

            <button 
                onClick={() => window.location.reload()}
                className="mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold transition-all text-sm"
            >
                Check Again
            </button>
        </div>
    );
};

export default Maintenance;
