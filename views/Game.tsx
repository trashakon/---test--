import React, { useState, useEffect } from 'react';
import { Room, GamePhase, CellContent, GameResult } from '../types';
import { Button } from '../components/Button';
import { Timer, Lock, Heart, Bomb, Skull, Share2, LogOut, Hash, Check } from 'lucide-react';

// Game Constants
const GRID_SIZE = 9; // 3x3
const BOMBS_COUNT = 3;
const WIN_SCORE = 6;
const MAX_HEALTH = 3;
const TURN_DURATION = 15; // seconds

interface GameProps {
  room: Room;
  onExit: () => void;
}

const TrophyIcon = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const Game: React.FC<GameProps> = ({ room, onExit }) => {
  // Game State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.PLACEMENT);
  const [timer, setTimer] = useState(TURN_DURATION);
  const [turn, setTurn] = useState<'PLAYER' | 'ENEMY'>('PLAYER');
  
  // Player State
  const [myHealth, setMyHealth] = useState(MAX_HEALTH);
  const [myScore, setMyScore] = useState(0);
  const [myGrid, setMyGrid] = useState<CellContent[]>(Array(GRID_SIZE).fill(CellContent.SAFE));
  const [myMovesOnEnemy, setMyMovesOnEnemy] = useState<(CellContent | null)[]>(Array(GRID_SIZE).fill(null)); 
  
  // Enemy State
  const [enemyHealth, setEnemyHealth] = useState(MAX_HEALTH);
  const [enemyScore, setEnemyScore] = useState(0);
  const [enemyGrid, setEnemyGrid] = useState<CellContent[]>([]); 
  const [enemyMovesOnMe, setEnemyMovesOnMe] = useState<number[]>([]); 

  // Setup / Result
  const [placedBombsCount, setPlacedBombsCount] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  // --- Helper Functions ---
  
  const generateRandomGrid = () => {
    const grid = Array(GRID_SIZE).fill(CellContent.SAFE);
    let bombsPlaced = 0;
    while (bombsPlaced < BOMBS_COUNT) {
      const idx = Math.floor(Math.random() * GRID_SIZE);
      if (grid[idx] !== CellContent.BOMB) {
        grid[idx] = CellContent.BOMB;
        bombsPlaced++;
      }
    }
    return grid;
  };

  const formatTimer = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  // --- Effects ---

  useEffect(() => {
    setEnemyGrid(generateRandomGrid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === GamePhase.RESULT) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimerExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, myGrid, placedBombsCount]);

  useEffect(() => {
    if (phase === GamePhase.COMBAT && turn === 'ENEMY') {
      const reactionTime = Math.random() * 2000 + 1000; // 1-3 seconds
      const timeout = setTimeout(() => {
        handleEnemyMove();
      }, reactionTime);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn]);

  useEffect(() => {
    if (phase === GamePhase.COMBAT) {
        if (myScore >= WIN_SCORE || enemyHealth <= 0) {
            handleGameOver('PLAYER');
        } else if (enemyScore >= WIN_SCORE || myHealth <= 0) {
            handleGameOver('ENEMY');
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myScore, enemyScore, myHealth, enemyHealth]);


  // --- Handlers ---

  const handleTimerExpiry = () => {
    if (phase === GamePhase.PLACEMENT) {
      const autoGrid = generateRandomGrid();
      setMyGrid(autoGrid);
      setPhase(GamePhase.COMBAT);
      setTimer(TURN_DURATION);
    } else if (phase === GamePhase.COMBAT) {
        if (turn === 'PLAYER') {
            setMyHealth(h => h - 1);
            setTurn('ENEMY');
            setTimer(TURN_DURATION);
        } else {
            setEnemyHealth(h => h - 1);
            setTurn('PLAYER');
            setTimer(TURN_DURATION);
        }
    }
  };

  const handlePlaceBomb = (index: number) => {
    if (phase !== GamePhase.PLACEMENT) return;
    
    const newGrid = [...myGrid];
    if (newGrid[index] === CellContent.BOMB) {
      newGrid[index] = CellContent.SAFE;
      setPlacedBombsCount(c => c - 1);
    } else {
      if (placedBombsCount >= BOMBS_COUNT) return;
      newGrid[index] = CellContent.BOMB;
      setPlacedBombsCount(c => c + 1);
    }
    setMyGrid(newGrid);
  };

  const handleLockIn = () => {
    if (placedBombsCount === BOMBS_COUNT) {
      setPhase(GamePhase.COMBAT);
      setTimer(TURN_DURATION);
      setTurn('PLAYER'); 
    }
  };

  const handlePlayerMove = (index: number) => {
    if (phase !== GamePhase.COMBAT || turn !== 'PLAYER') return;
    if (myMovesOnEnemy[index] !== null) return; 

    const content = enemyGrid[index];
    const newMoves = [...myMovesOnEnemy];
    newMoves[index] = content;
    setMyMovesOnEnemy(newMoves);

    if (content === CellContent.BOMB) {
       setMyHealth(h => h - 1);
    } else {
       setMyScore(s => s + 1);
    }

    setTurn('ENEMY');
    setTimer(TURN_DURATION);
  };

  const handleEnemyMove = () => {
    const availableIndices = myGrid.map((_, i) => i).filter(i => !enemyMovesOnMe.includes(i));
    if (availableIndices.length === 0) return;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    setEnemyMovesOnMe(prev => [...prev, randomIndex]);

    if (myGrid[randomIndex] === CellContent.BOMB) {
        setEnemyHealth(h => h - 1);
    } else {
        setEnemyScore(s => s + 1);
    }

    setTurn('PLAYER');
    setTimer(TURN_DURATION);
  };

  const handleGameOver = (winner: 'PLAYER' | 'ENEMY') => {
    setPhase(GamePhase.RESULT);
    setResult({
        winner,
        payout: winner === 'PLAYER' ? room.betAmount * 1.9 : 0, 
        blockHash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("")
    });
  };

  // --- Render Helpers ---

  const renderCell = (index: number, isEnemyGrid: boolean) => {
    // PLAYER GRID (Visualizing placement or Enemy Hits)
    if (!isEnemyGrid) {
        const isBomb = myGrid[index] === CellContent.BOMB;
        const isHitByEnemy = enemyMovesOnMe.includes(index);

        let bgClass = "bg-white border-black";
        let hoverClass = "";

        // Handle Placement Hover Logic
        if (phase === GamePhase.PLACEMENT) {
            if (isBomb) {
                bgClass = "bg-[#b75555]";
                // If it IS a bomb, hover should be dark red, not gray
                hoverClass = "cursor-pointer active:scale-95 hover:bg-[#a04444]"; 
            } else {
                // If it is empty, hover is gray
                hoverClass = "cursor-pointer active:scale-95 hover:bg-gray-50";
            }
        }
        
        // During combat, show my bombs as muted, unless hit
        if (phase === GamePhase.COMBAT && isBomb) bgClass = "bg-[#b75555]/20";

        if (isHitByEnemy) {
            bgClass = isBomb ? "bg-[#b75555]" : "bg-gray-200";
        }

        return (
            <div 
                key={`my-${index}`}
                onClick={() => handlePlaceBomb(index)}
                // Removed transition-all, strictly using transition-transform for scale.
                className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-transform duration-100 ${bgClass} ${hoverClass}`}
            >
                {isBomb && <Bomb size={isEnemyGrid ? 12 : 24} className={phase === GamePhase.PLACEMENT || isHitByEnemy ? "text-white" : "text-[#b75555]"} strokeWidth={2.5} />}
                {isHitByEnemy && !isBomb && <div className="w-3 h-3 bg-black rounded-full"></div>}
            </div>
        );
    }

    // ENEMY GRID (Interaction Layer)
    const moveResult = myMovesOnEnemy[index];
    let bgClass = "bg-white border-black hover:bg-gray-50 cursor-pointer active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    
    if (moveResult === CellContent.SAFE) bgClass = "bg-[#86efac] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    if (moveResult === CellContent.BOMB) bgClass = "bg-[#b75555] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

    return (
        <div 
            key={`enemy-${index}`}
            onClick={() => handlePlayerMove(index)}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${bgClass}`}
        >
            {moveResult === CellContent.SAFE && <Check size={36} className="text-black" strokeWidth={3.5} />}
            {moveResult === CellContent.BOMB && <Skull size={36} className="text-white" strokeWidth={2.5} />}
        </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col">
      
      {/* --- PLACEMENT PHASE --- */}
      {phase === GamePhase.PLACEMENT && (
        <div className="bg-white border-2 border-black p-6 rounded-3xl flex-1 flex flex-col items-center justify-between animate-fadeIn neo-shadow relative">
          
          <div className="absolute top-4 left-4">
             <span className="font-bold font-mono text-xs bg-gray-200 px-2 py-1 rounded border border-black text-gray-600">ROOM #{room.id}</span>
          </div>

          <div className="mt-8 mb-4 flex flex-col items-center w-full">
            {/* Timer container fixed width. Text uses padStart(2, '0') to ensure consistent character count. */}
            <div className="h-16 flex items-center justify-center w-40">
                <div className={`text-6xl font-black font-mono tabular-nums leading-none ${timer <= 5 ? 'text-[#b75555]' : 'text-black'}`}>
                    {formatTimer(timer)}s
                </div>
            </div>
            
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Time Remaining</div>
            
            {/* Timer Progress Bar */}
            <div className="w-full max-w-[220px] h-3 bg-gray-100 rounded-full mt-3 border-2 border-black overflow-hidden relative">
                 <div 
                    className={`h-full transition-all duration-1000 ease-linear ${timer <= 5 ? 'bg-[#b75555]' : 'bg-black'}`} 
                    style={{ width: `${(timer / TURN_DURATION) * 100}%` }}
                 ></div>
            </div>
          </div>

          <div className="text-center mb-2">
            <h2 className="text-2xl font-black text-black uppercase mb-1">Place Bombs</h2>
            <div className="mt-2 text-[#b75555] font-black flex items-center justify-center gap-2 text-xl">
               <Bomb size={24}/> {placedBombsCount}/{BOMBS_COUNT}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-[300px] aspect-square">
            {Array.from({ length: GRID_SIZE }).map((_, i) => renderCell(i, false))}
          </div>

          <div className="w-full mt-8">
            <Button 
                fullWidth 
                onClick={handleLockIn}
                disabled={placedBombsCount !== BOMBS_COUNT}
            >
                <Lock size={20} strokeWidth={2.5} /> LOCK FORMATION
            </Button>
          </div>
        </div>
      )}

      {/* --- COMBAT PHASE --- */}
      {phase === GamePhase.COMBAT && (
        <div className="flex-1 flex flex-col">
            
            {/* Top Bar: Enemy Info */}
            <div className="bg-white border-2 border-black rounded-xl p-4 mb-4 flex justify-between items-start neo-shadow">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#b75555] text-white text-xs px-2 py-0.5 rounded border border-black font-bold uppercase">Enemy</span>
                        {turn === 'ENEMY' && <span className="text-xs font-bold animate-pulse text-gray-500">THINKING...</span>}
                    </div>
                    <div className="flex gap-1 mb-2">
                        {[...Array(MAX_HEALTH)].map((_, i) => (
                            <Heart 
                                key={i} 
                                size={20} 
                                className={`${i < enemyHealth ? "fill-[#b75555] text-[#b75555]" : "text-gray-300"}`} 
                                strokeWidth={2.5}
                            />
                        ))}
                    </div>
                    <div className="text-xs font-bold text-gray-400 font-mono uppercase">
                        Safe Points: <span className="text-black text-sm">{enemyScore}/{WIN_SCORE}</span>
                    </div>
                </div>

                {/* Small Grid: My Defense */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 mb-1 tracking-widest">YOUR DEFENSE</span>
                    <div className="grid grid-cols-3 gap-1 w-16 h-16 bg-white p-1 rounded border-2 border-black">
                        {Array.from({ length: GRID_SIZE }).map((_, i) => (
                             <div 
                                key={`def-${i}`} 
                                className={`rounded-sm border border-black/20 ${
                                    enemyMovesOnMe.includes(i) 
                                        ? (myGrid[i] === CellContent.BOMB ? 'bg-[#b75555]' : 'bg-gray-300')
                                        : (myGrid[i] === CellContent.BOMB ? 'bg-[#b75555]/30' : 'bg-white')
                                }`}
                             />
                        ))}
                    </div>
                </div>
            </div>

            {/* Prize Pool Banner */}
            <div className="text-center mb-8 relative z-0">
                <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold border-2 border-black shadow-lg">
                    PRIZE POOL: {(room.betAmount * 2).toFixed(4)} ETH
                </div>
            </div>

            {/* Middle: Player Turn UI */}
            <div className="flex-1 flex flex-col items-center justify-center relative bg-white border-2 border-black rounded-3xl p-4 neo-shadow pt-10">
                 
                 {/* Floating Player Timer */}
                 {turn === 'PLAYER' && (
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 border-2 border-black w-40 h-14 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 z-20 ${timer <= 5 ? 'bg-[#b75555] text-white' : 'bg-yellow-400 text-black'}`}>
                        <Timer size={24} strokeWidth={3} />
                        <span className="font-black text-3xl font-mono leading-none">{formatTimer(timer)}s</span>
                    </div>
                 )}

                 {/* Enemy Turn Overlay */}
                 {turn === 'ENEMY' && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-3xl">
                        <div className="bg-[#b75555] text-white px-8 py-3 rounded-xl border-2 border-black font-black text-lg neo-shadow animate-pulse">
                            ENEMY TURN
                        </div>
                    </div>
                 )}

                 <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
                    {Array.from({ length: GRID_SIZE }).map((_, i) => renderCell(i, true))}
                 </div>
            </div>

            {/* Bottom: Player Info */}
            <div className="bg-white border-2 border-black rounded-xl p-4 mt-4 neo-shadow">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="font-black text-lg uppercase">YOU</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                            {[...Array(MAX_HEALTH)].map((_, i) => (
                                <Heart 
                                    key={i} 
                                    size={24} 
                                    className={`${i < myHealth ? "fill-[#b75555] text-[#b75555]" : "text-gray-300"}`} 
                                    strokeWidth={2.5}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SAFE POINTS</div>
                        <div className="text-4xl font-black text-black leading-none">
                            {myScore}<span className="text-gray-300 text-2xl">/{WIN_SCORE}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- RESULT MODAL --- */}
      {phase === GamePhase.RESULT && result && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-3xl">
            <div className="bg-white border-2 border-black p-8 rounded-2xl w-full max-w-sm text-center neo-shadow relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-4 ${result.winner === 'PLAYER' ? 'bg-[#86efac]' : 'bg-[#b75555]'} border-b-2 border-black`}></div>

                <div className="mb-6 mt-4">
                    {result.winner === 'PLAYER' ? (
                        <div className="w-24 h-24 bg-[#86efac] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 neo-shadow">
                            <TrophyIcon className="text-black w-12 h-12" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-[#b75555] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 neo-shadow">
                            <Skull className="text-white w-12 h-12" strokeWidth={2.5} />
                        </div>
                    )}
                    
                    <h2 className="text-4xl font-black uppercase mb-1 text-black">
                        {result.winner === 'PLAYER' ? 'VICTORY' : 'DEFEAT'}
                    </h2>
                    <p className="text-gray-500 font-bold text-sm">
                        {result.winner === 'PLAYER' ? 'Winner takes all.' : 'Better luck next time.'}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-black">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm font-bold uppercase">Payout</span>
                        <span className="text-black font-black font-mono text-lg">{result.payout.toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-500 uppercase">Room ID</span>
                        <span className="text-black">#{room.id}</span>
                    </div>
                     <div className="mt-3 pt-3 border-t-2 border-gray-200 text-[10px] text-gray-400 font-mono break-all text-left">
                        Block Hash: {result.blockHash}
                    </div>
                </div>

                <div className="space-y-3">
                    <Button fullWidth onClick={onExit} variant="secondary">
                        <LogOut size={18} strokeWidth={2.5} /> RETURN TO LOBBY
                    </Button>
                    {result.winner === 'PLAYER' && (
                        <button className="w-full py-3 text-black text-sm font-black flex items-center justify-center gap-2 hover:bg-gray-100 border-2 border-transparent hover:border-black rounded-xl transition-all uppercase tracking-wide">
                            <Share2 size={16} strokeWidth={2.5} /> Share Result
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Game;