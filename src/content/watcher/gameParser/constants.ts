// Debug flag
export const DEBUG = import.meta.env.DEV;

// Game constants
export const TOTAL_DEV_CARDS = 25;
export const DICE_VALUES_COUNT = 11; // 2-12 inclusive (11 possible values)

// Parsing constants
export const MAX_SCROLL_ATTEMPTS = 300;
export const SCROLL_ATTEMPT_DELAY_MS = 100;
export const SCROLL_CHUNK_DELAY_MS = 100;

// Default player resources
export const DEFAULT_RESOURCES = {
  lumber: 0,
  brick: 0,
  wool: 0,
  grain: 0,
  ore: 0,
} as const;

// Default card counts
export const DEFAULT_CARDS = {
  knight: 0,
  monopoly: 0,
  yearOfPlenty: 0,
  roadBuilding: 0,
  dev: TOTAL_DEV_CARDS,
} as const;

// DOM selectors
export const SELECTORS = {
  GAME_CONTAINER: "#ui-game",
  PLAYER_NAME: ".web-header-username",
  DATA_INDEX: "[data-index]",
  RULEBOOK_LINK: "#open-rulebook",
} as const;

// Text patterns for parsing
export const TEXT_PATTERNS = {
  ROLLED: "rolled",
  GOT: "got",
  RECEIVED_STARTING: "received starting resources",
  DISCARDED: "discarded",
  GAVE_BANK: "gave bank",
  BOUGHT: "bought",
  BUILT: "built",
  STOLE: "stole",
  FROM: "from",
  TOOK_FROM_BANK: "took from bank",
  USED: "used",
  DISCONNECTED: "has disconnected",
  RECONNECTED: "has reconnected",
  RULEBOOK: "rulebook",
  NO_PLAYER_TO_STEAL: "No player to steal from",
  WANTS_TO_GIVE: "wants to give",
} as const;
