import { TColonistCompanion } from "@/content/watcher/gameParser/types";
import {
  DICE_VALUES_COUNT,
  DEFAULT_CARDS,
} from "@/content/watcher/gameParser/constants";

let listeners: ((config: TColonistCompanion) => void)[] = [];

let config: TColonistCompanion = {
  playHistoryEl: null,
  logs: new Map<number, HTMLElement>(),
  dices: new Array(DICE_VALUES_COUNT).fill(0),
  playerName: "",
  players: {},
  cards: { ...DEFAULT_CARDS },
  config: {
    showCards: true,
    showDices: true,
  },
};

// Load settings from storage on initialization
if (typeof chrome !== "undefined" && chrome.storage?.sync) {
  chrome.storage.sync.get(["showCards", "showDices"], (result) => {
    if (result.showCards !== undefined || result.showDices !== undefined) {
      config.config = {
        showCards: result.showCards ?? true,
        showDices: result.showDices ?? true,
      };
      listeners.forEach((cb) => cb(config));
    }
  });
}

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
    dices: new Array(DICE_VALUES_COUNT).fill(0),
    playerName: "",
    players: {},
    cards: { ...DEFAULT_CARDS },
    config: {
      showCards: true,
      showDices: true,
    },
  };
  listeners.forEach((cb) => cb(config));
};
