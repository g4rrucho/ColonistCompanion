export enum TEntryActionType {
  Resources = "Resources",
  Dice = "Dice",
  Ignore = "Ignore",
}

export type TCards = {
  Knight: number;
  Monopoly: number;
  YearOfPlenty: number;
  RoadBuilding: number;
};

export type TEntryAction = {
  playerName: string;
  type: TEntryActionType;
  index: number;
  diceNumber: number;
  resources: TResources;
};

export enum EColonistResource {
  Lumber = "Lumber",
  Brick = "Brick",
  Wool = "Wool",
  Grain = "Grain",
  Ore = "Ore",
}

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
  players: Record<string, TPlayer>;
  cards: TCards;
  dices: Array<number>;
};
