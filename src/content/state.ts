import { TColonistCompanion } from "@/content/watcher/types";

let listeners: ((config: TColonistCompanion) => void)[] = [];

let config: TColonistCompanion = {
  playHistoryEl: null,
  logs: new Map<number, HTMLElement>(),
  dices: new Array(12).fill(0),
  players: {},
  cards: { Knight: 0, Monopoly: 0, YearOfPlenty: 0, RoadBuilding: 0 },
};

export const setCompanionConfig = (newConfig: TColonistCompanion) => {
  config = { ...config, ...newConfig };
  listeners.forEach((cb) => cb(config));
};

export const subscribeToConfig = (cb: (config: TColonistCompanion) => void) => {
  listeners.push(cb);
  cb(config);

  return () => {
    listeners = listeners.filter((listener) => listener !== cb);
  };
};

export const getCompanionConfig = (): TColonistCompanion => {
  return config;
};

export const resetCompanionConfig = () => {
  config = {
    playHistoryEl: null,
    logs: new Map<number, HTMLElement>(),
    dices: new Array(12).fill(0),
    players: {},
    cards: { Knight: 0, Monopoly: 0, YearOfPlenty: 0, RoadBuilding: 0 },
  };
  listeners.forEach((cb) => cb(config));
};
