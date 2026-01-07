export enum AppView {
  HOME = 'HOME',
  HOW_TO_PLAY = 'HOW_TO_PLAY',
  ROOM_LIST = 'ROOM_LIST',
  GAME = 'GAME',
}

export enum GamePhase {
  PLACEMENT = 'PLACEMENT',
  COMBAT = 'COMBAT',
  RESULT = 'RESULT',
}

export enum RoomStatus {
  WAITING = 'Waiting',
  FULL = 'Full',
  PLAYING = 'Playing',
}

export interface Room {
  id: number;
  playerAddress: string;
  betAmount: number;
  status: RoomStatus;
}

export interface PlayerState {
  health: number;
  score: number; // Safe points collected (Target 6)
  grid: GridCell[]; // The grid belonging to this player (where they hid bombs)
  moves: number[]; // Indices on the ENEMY grid that this player has revealed
}

export enum CellContent {
  EMPTY = 'EMPTY',
  BOMB = 'BOMB',
  SAFE = 'SAFE', // Logically everything not a bomb is safe, but explicit for game logic
}

export interface GridCell {
  index: number;
  content: CellContent;
}

export interface GameResult {
  winner: 'PLAYER' | 'ENEMY';
  payout: number;
  blockHash: string;
}
