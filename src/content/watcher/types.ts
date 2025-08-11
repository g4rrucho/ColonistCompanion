export enum TEntryActionType {
  Resources = "Resources",
  Robbery = "Robbery",

  Dice = "Dice",
  Ignore = "Ignore",
}

export type TCards = {
  Knight: number;
  Monopoly: number;
  YearOfPlenty: number;
  RoadBuilding: number;
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

export type TTrade = {
  players: TPlayerTrade[];
};

export type TEntryAction = {
  playerName: string;
  type: TEntryActionType;
  index: number;
  diceNumber: number;
  resources: TResources;
  robbery?: TRobbery;
};

export enum EColonistResource {
  Lumber = "Lumber",
  Brick = "Brick",
  Wool = "Wool",
  Grain = "Grain",
  Ore = "Ore",
}

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
