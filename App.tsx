import React, { useState } from 'react';
import { AppView, GameResult, Room } from './types';
import Home from './views/Home';
import RoomList from './views/RoomList';
import Game from './views/Game';
import HowToPlay from './views/HowToPlay';
import { Wallet, Trophy, CircleUser, Swords } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isMatchmaking, setIsMatchmaking] = useState(false);

  // Mock Wallet Connection
  const handleConnectWallet = () => {
    if (walletAddress) {
      setWalletAddress(null);
    } else {
      // Simulate a Base address
      setWalletAddress('0x71C...9A23');
    }
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
  };

  const handleJoinRoom = (room: Room) => {
    setActiveRoom(room);
    // Start transition
    setIsMatchmaking(true);
    
    // Simulate connection delay / matchmaking transition
    setTimeout(() => {
        setIsMatchmaking(false);
        navigateTo(AppView.GAME);
    }, 2500);
  };

  const handleLeaveGame = () => {
    setActiveRoom(null);
    navigateTo(AppView.ROOM_LIST);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      
      <div className="w-full max-w-md md:max-w-lg z-10 py-6">
        {/* Header / Top Bar */}
        {/* Hide header during matchmaking for immersion */}
        {currentView !== AppView.HOME && !isMatchmaking && (
           <div className="flex justify-between items-center mb-8 bg-white border-2 border-black p-4 rounded-xl neo-shadow">
             <div className="flex items-center gap-2">
               <div className="bg-[#b75555] p-1.5 rounded-lg border-2 border-black">
                 <Trophy size={20} className="text-white" strokeWidth={2.5} />
               </div>
               <span className="font-bold text-lg tracking-tight">CRYPTOBOMBER</span>
             </div>
             
             <button 
                onClick={handleConnectWallet}
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border-2 border-black transition-colors"
             >
                <div className="w-2 h-2 rounded-full bg-[#b75555]"></div>
                <span className="font-mono font-bold text-black">{walletAddress || 'Connect'}</span>
             </button>
           </div>
        )}

        <main>
          {isMatchmaking ? (
             <div className="flex flex-col items-center justify-center h-[60vh] w-full animate-fadeIn">
                <div className="mb-10 text-center">
                    <div className="inline-block bg-black text-white px-4 py-1 mb-2 rounded-full font-bold text-xs tracking-widest border-2 border-black">MATCH FOUND</div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter animate-pulse">Entering Battle</h2>
                </div>
                
                <div className="flex items-center justify-center w-full gap-2 md:gap-6">
                    {/* Player */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.1s'}}>
                        <div className="w-24 h-24 bg-[#86efac] border-2 border-black rounded-2xl neo-shadow flex items-center justify-center relative overflow-hidden">
                            <CircleUser size={48} className="text-black/80" strokeWidth={2} />
                        </div>
                        <span className="font-black bg-white border-2 border-black px-3 py-1 rounded-lg text-sm shadow-[2px_2px_0px_0px_#000]">YOU</span>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center justify-center animate-bounce z-10">
                        <Swords size={48} className="text-[#b75555]" strokeWidth={2.5} />
                        <span className="text-2xl font-black italic text-black">VS</span>
                    </div>

                    {/* Enemy */}
                    <div className="flex flex-col items-center gap-3 animate-slideUp" style={{animationDelay: '0.3s'}}>
                        <div className="w-24 h-24 bg-[#b75555] border-2 border-black rounded-2xl neo-shadow flex items-center justify-center relative overflow-hidden">
                            <CircleUser size={48} className="text-white/90" strokeWidth={2} />
                        </div>
                        <span className="font-black bg-white border-2 border-black px-3 py-1 rounded-lg text-sm shadow-[2px_2px_0px_0px_#000]">#{activeRoom?.id}</span>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center gap-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Connecting to Network</div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
             </div>
          ) : (
             <>
                {currentView === AppView.HOME && (
                    <Home 
                    isConnected={!!walletAddress} 
                    onConnect={handleConnectWallet}
                    onPlay={() => navigateTo(AppView.ROOM_LIST)}
                    onHowToPlay={() => navigateTo(AppView.HOW_TO_PLAY)}
                    />
                )}

                {currentView === AppView.HOW_TO_PLAY && (
                    <HowToPlay onBack={() => navigateTo(AppView.HOME)} />
                )}

                {currentView === AppView.ROOM_LIST && (
                    <RoomList 
                    walletAddress={walletAddress}
                    onBack={() => navigateTo(AppView.HOME)}
                    onJoinRoom={handleJoinRoom}
                    />
                )}

                {currentView === AppView.GAME && activeRoom && (
                    <Game 
                    room={activeRoom}
                    onExit={handleLeaveGame}
                    />
                )}
             </>
          )}
        </main>
      </div>
      
      <div className="fixed bottom-4 text-xs font-bold text-gray-400">
        BUILD ON BASE
      </div>
    </div>
  );
};

export default App;