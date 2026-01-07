import React from 'react';
import { Button } from '../components/Button';
import { Wallet, Gamepad2, BookOpen, Bomb } from 'lucide-react';

interface HomeProps {
  isConnected: boolean;
  onConnect: () => void;
  onPlay: () => void;
  onHowToPlay: () => void;
}

const Home: React.FC<HomeProps> = ({ isConnected, onConnect, onPlay, onHowToPlay }) => {
  return (
    <div className="flex flex-col items-center bg-white border-2 border-black rounded-3xl p-8 neo-shadow">
      <div className="text-center space-y-4 mb-10 w-full">
        <div className="w-24 h-24 bg-[#b75555] border-2 border-black rounded-2xl mx-auto flex items-center justify-center neo-shadow -rotate-6 mb-6">
          <Bomb size={48} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tighter uppercase leading-none">
          Crypto<br/>Bomber
        </h1>
        <div className="inline-block bg-black text-white px-3 py-1 text-xs font-bold rounded-full tracking-widest">
          STRATEGIC WARFARE
        </div>
      </div>

      <div className="w-full space-y-4">
        {isConnected ? (
          <Button 
            variant="danger" 
            fullWidth 
            onClick={onConnect}
          >
            <Wallet size={20} strokeWidth={2.5} />
            Disconnect Wallet
          </Button>
        ) : (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onConnect}
          >
            <Wallet size={20} strokeWidth={2.5} />
            Connect Wallet
          </Button>
        )}

        <Button 
          variant="secondary" 
          fullWidth 
          onClick={onPlay}
          disabled={!isConnected}
        >
          <Gamepad2 size={20} strokeWidth={2.5} />
          Play Game
        </Button>

        <Button 
          variant="outline" 
          fullWidth 
          onClick={onHowToPlay}
        >
          <BookOpen size={20} strokeWidth={2.5} />
          How to Play
        </Button>
      </div>
      
      {!isConnected && (
        <p className="mt-6 text-xs text-center font-bold text-gray-500 max-w-[200px] leading-tight">
          CONNECT YOUR WALLET TO START EARNING ETH
        </p>
      )}
    </div>
  );
};

export default Home;