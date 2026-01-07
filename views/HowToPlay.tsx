import React from 'react';
import { ArrowLeft, Target, ShieldAlert, Skull, Check } from 'lucide-react';

interface HowToPlayProps {
  onBack: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  return (
    <div className="bg-white border-2 border-black rounded-3xl p-6 h-[550px] overflow-y-auto neo-shadow relative">
      <div className="flex items-center gap-4 mb-8 sticky top-0 bg-white border-b-2 border-black pb-4 z-10 pt-2">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-black transition-all">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-xl font-black uppercase">How to Play</h2>
      </div>

      <div className="space-y-8 pb-4">
        <section>
          <div className="bg-[#b75555] text-white px-4 py-2 rounded-lg border-2 border-black inline-flex items-center gap-2 font-bold mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Target size={20} /> OBJECTIVE
          </div>
          <p className="text-black font-medium leading-relaxed">
            Be the first to find <span className="text-[#b75555] font-black">6 Safe Spots</span> on your opponent's grid. Avoid the hidden bombs!
          </p>
        </section>

        <section>
          <h3 className="font-black text-lg mb-3 flex items-center gap-2 uppercase">
             1. Place Bombs
          </h3>
          <p className="text-gray-600 text-sm font-bold leading-relaxed mb-3">
            Hide <span className="text-[#b75555]">3 Bombs</span> on your grid in 15 seconds.
          </p>
          <div className="bg-gray-50 border-2 border-black rounded-xl p-4 text-sm font-bold space-y-2">
             <div className="flex items-center gap-2"><div className="w-2 h-2 bg-black rounded-full"></div> Tap a cell to place bomb</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 bg-black rounded-full"></div> Lock to confirm</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 bg-black rounded-full"></div> Auto-place if time runs out</div>
          </div>
        </section>

        <section>
          <h3 className="font-black text-lg mb-3 flex items-center gap-2 uppercase">
             2. Battle Phase
          </h3>
          <div className="grid grid-cols-1 gap-3">
             <div className="bg-green-100 p-4 rounded-xl border-2 border-black flex items-center justify-between">
               <div>
                 <span className="font-black text-black block mb-1">FIND SAFE SPOT</span>
                 <span className="text-xs font-bold text-gray-600">+1 POINT (Target: 6)</span>
               </div>
               <Check size={24} className="text-black" strokeWidth={3} />
             </div>
             <div className="bg-[#b75555] p-4 rounded-xl border-2 border-black flex items-center justify-between">
               <div>
                 <span className="font-black text-white block mb-1">HIT BOMB</span>
                 <span className="text-xs font-bold text-white/80">-1 HP (Game Over at 0)</span>
               </div>
               <Skull size={24} className="text-white" strokeWidth={3} />
             </div>
          </div>
        </section>
        
        <section>
           <h3 className="font-black text-lg mb-2 flex items-center gap-2 uppercase">
             <ShieldAlert size={20} /> Rewards
           </h3>
           <p className="text-black font-medium text-sm border-l-4 border-[#b75555] pl-4 py-1">
             Winner takes the Prize Pool. Loser loses their bet.
           </p>
        </section>
      </div>
    </div>
  );
};

export default HowToPlay;