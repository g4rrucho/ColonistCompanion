export enum TEntryActionType {
  Dice = "Dice",
  Ignore = "Ignore",
  MonopolyRobbery = "MonopolyRobbery",
  Resources = "Resources",
  Robbery = "Robbery",
  PlayerTrade = "PlayerTrade",
  BuildRoad = "BuildRoad",
  Knight = "Knight",
  YearOfPlenty = "YearOfPlenty",
  Monopoly = "Monopoly",
}

export type TCards = {
  knight: number;
  monopoly: number;
  yearOfPlenty: number;
  roadBuilding: number;
};

export type PlayerRobbery = {
  playerName: string;
  resources: TResources;
};

export type TRobbery = {
  victim: PlayerRobbery;
  robber: PlayerRobbery;
};

export type TPlayerTrade = {
  playerName: string;
  resources: TResources;
};

export type TEntryAction = {
  playerName: string;
  type: TEntryActionType;
  index: number;
  diceNumber: number;
  resources: TResources;
  robbery?: TRobbery;
  playerTrade?: TPlayerTrade[];
  resource?: TResourceKey;
};

export type TResourceKey = "lumber" | "brick" | "wool" | "grain" | "ore";

export type TResources = {
  lumber: number;
  brick: number;
  wool: number;
  grain: number;
  ore: number;
};

export type TPlayer = {
  resources: TResources;
};

export type TColonistCompanion = {
  playHistoryEl: HTMLElement | null;
  logs: Map<number, Element>;
  playerName: string;
  players: Record<string, TPlayer>;
  cards: TCards;
  dices: Array<number>;
};
