import { AutodartsLigaGameData } from "./game-data-storage";

export interface ISegment {
  name: string;
  number: number;
  bed: string;
  multiplier: number;
}

export interface ICoords {
  x: number;
  y: number;
}

export interface IThrow {
  id: string;
  throw: number;
  createdAt: string;
  segment: ISegment;
  coords?: ICoords;
  entry: string;
  marks: any | null;
}

export interface ITurn {
  id: string;
  createdAt: string;
  finishedAt: string;
  round: number;
  turn: number;
  playerId: string;
  score: number;
  points: number;
  marks: any | null;
  busted: boolean;
  throws: IThrow[];
}

export interface IUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface IPlayer {
  id: string;
  name: string;
  userId: string;
  hostId: string;
  boardId: string;
  avatarUrl: string;
}

export interface IMatchSettings {
  mode: string;
  gameMode: string;
  baseScore?: number;
  bullMode?: string;
  inMode?: string;
  maxRounds?: number;
  outMode?: string;
}

export interface IScore {
  legs: number;
  sets: number;
}

export interface IMatch {
  id: string;
  activated?: -1 | 0 | 1 | 2;
  createdAt: string;
  variant: string;
  settings: IMatchSettings;
  players: IPlayer[];
  scores: IScore[] | null;
  type: string;
  set: number;
  leg: number;
  sets?: number;
  legs?: number;
  finished: boolean;
  winner: number;
  turns: ITurn[];
  round: number;
  player: number;
  turnScore: number;
  turnBusted: boolean;
  gameScores: number[];
  gameFinished: boolean;
  gameWinner: number;
  state: Record<string, any>;
}

export async function processWebSocketMessage(channel: string, data: IMatch | string) {
  switch (channel) {
    case "autodarts.matches": {
      const matchData = data as IMatch;
      if (matchData.body) return;

      const id = window.location.href.match(/matches\/([0-9a-f-]+)/)?.[1];
      const playersBoard = matchData.players?.find(player => player.boardId === window.location.href.match(/boards\/([0-9a-f-]+)/)?.[1]);
      if ((id !== matchData.id && !playersBoard) && matchData.activated === undefined) return;

      const gameData = await AutodartsLigaGameData.getValue();
      if (matchData.activated !== undefined) {
        // Merge activated state with existing match data
        AutodartsLigaGameData.setValue({
          ...gameData,
          match: gameData.match
            ? {
                ...gameData.match,
                activated: matchData.activated,
              }
            : {
                ...matchData,
              },
        });
      } else {
        // Replace entire match data
        AutodartsLigaGameData.setValue({
          ...gameData,
          match: matchData,
        });
      }

      break;
    }
    default: {
      // Ignore other channels
      break;
    }
  }
}

