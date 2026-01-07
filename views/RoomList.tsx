import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Room, RoomStatus } from '../types';
import { ArrowLeft, Users, Plus, X, Coins } from 'lucide-react';

interface RoomListProps {
  walletAddress: string | null;
  onBack: () => void;
  onJoinRoom: (room: Room) => void;
}

const MOCK_ROOMS: Room[] = [
  { id: 14, playerAddress: '0xA1...B2', betAmount: 0.005, status: RoomStatus.WAITING },
  { id: 18, playerAddress: '0xC4...D5', betAmount: 0.01, status: RoomStatus.WAITING },
  { id: 20, playerAddress: '0xE6...F7', betAmount: 0.0003, status: RoomStatus.WAITING },
  { id: 9, playerAddress: '0x88...11', betAmount: 0.02, status: RoomStatus.FULL },
];

const RoomList: React.FC<RoomListProps> = ({ walletAddress, onBack, onJoinRoom }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [betAmount, setBetAmount] = useState<string>('0.0003');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);

  const handleCreateRoom = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount < 0.0003) return;

    const newRoom: Room = {
      id: Math.floor(Math.random() * 100) + 21,
      playerAddress: 'You',
      betAmount: amount,
      status: RoomStatus.WAITING,
    };

    setRooms([newRoom, ...rooms]);
    setShowCreateModal(false);
  };

  return (
    <div className="relative">
      <div className="bg-white border-2 border-black rounded-3xl p-6 h-[600px] flex flex-col neo-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4 shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-black transition-all">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            LOBBY
          </h2>
          <div className="w-10"></div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {rooms.length === 0 ? (
            <div className="text-center font-bold text-gray-400 mt-10">NO ROOMS. CREATE ONE!</div>
          ) : (
            rooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white border-2 border-black rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">#{room.id}</span>
                    <span className="text-sm font-bold">{room.playerAddress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#b75555] text-sm font-bold mt-1">
                    <Coins size={14} strokeWidth={2.5} /> {room.betAmount} ETH
                  </div>
                </div>
                
                {room.playerAddress === 'You' ? (
                   <span className="text-xs font-bold bg-yellow-300 text-black border-2 border-black px-3 py-1.5 rounded-lg">
                     WAITING
                   </span>
                ) : (
                  <Button 
                    variant={room.status === RoomStatus.FULL ? 'outline' : 'primary'}
                    className="py-1.5 px-5 text-sm"
                    disabled={room.status === RoomStatus.FULL}
                    onClick={() => onJoinRoom(room)}
                  >
                    {room.status === RoomStatus.FULL ? 'FULL' : 'JOIN'}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t-2 border-black shrink-0">
          <Button fullWidth onClick={() => setShowCreateModal(true)}>
            <Plus size={20} strokeWidth={2.5} /> CREATE ROOM
          </Button>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-3xl">
          <div className="bg-white border-2 border-black p-6 rounded-2xl w-full max-w-sm neo-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase">Create Room</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-black hover:bg-gray-100 p-1 rounded-lg border-2 border-transparent hover:border-black transition-all">
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Bet Amount (ETH)</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3.5 text-black" size={18} />
                  <input 
                    type="number" 
                    step="0.0001"
                    min="0.0003"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full neo-input rounded-xl py-3 pl-10 pr-4 font-bold font-mono"
                  />
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2 text-right">MIN: 0.0003 ETH</p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  CANCEL
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleCreateRoom}
                  disabled={parseFloat(betAmount) < 0.0003}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;