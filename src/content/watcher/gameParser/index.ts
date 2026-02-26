import {
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
} from "@/content/watcher/gameParser/types";
import { parseAction } from "./parseAction";
import { isPlayerTrade, isEntrySeparator } from "./detectors";
import { getPlayerName } from "./utils";
import { TEXT_PATTERNS, DEFAULT_RESOURCES } from "./constants";
import { logger } from "@/utils/logger";

// Fragments
import { parseDice } from "./fragments/dice";
import {
  parseResources,
  parseDiscardedResources,
  parseYearOfPlenty,
} from "./fragments/resources";
import { parseBankTrade } from "./fragments/bankTrade";
import { parseDevCard, parseUsedDevCard } from "./fragments/devCard";
import { parseBuilding } from "./fragments/building";
import { parseStolenResource } from "./fragments/robber";
import { parseMonopolyRobbery } from "./fragments/monopoly";
import { parsePlayerTrade } from "./fragments/playerTrade";

const textOf = (el: Element) => el.textContent?.toLowerCase() ?? "";

const parseEntry = (entry: Element, config: TColonistCompanion) => {
  const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
  if (isNaN(index)) return;
  const text = textOf(entry);

  if (isEntrySeparator(entry)) return;
  if (entry.textContent?.includes(TEXT_PATTERNS.DISCONNECTED)) return;
  if (entry.textContent?.includes(TEXT_PATTERNS.RECONNECTED)) return;
  if (entry.textContent?.includes(TEXT_PATTERNS.RULEBOOK)) return;
  if (entry.textContent?.includes(TEXT_PATTERNS.NO_PLAYER_TO_STEAL)) return;
  if (entry.textContent?.includes(TEXT_PATTERNS.WANTS_TO_GIVE)) return;

  const action: TEntryAction = {
    index,
    type: TEntryActionType.Ignore,
    diceNumber: 0,
    playerName: getPlayerName(entry),
    resources: { ...DEFAULT_RESOURCES },
  };

  if (text.includes(TEXT_PATTERNS.ROLLED)) parseDice(entry, action);
  else if (isPlayerTrade(entry)) parsePlayerTrade(entry, action);
  else if (
    text.includes(TEXT_PATTERNS.GOT) ||
    text.includes(TEXT_PATTERNS.RECEIVED_STARTING)
  )
    parseResources(entry, action);
  else if (text.includes(TEXT_PATTERNS.DISCARDED)) parseDiscardedResources(entry, action);
  else if (text.includes(TEXT_PATTERNS.GAVE_BANK)) parseBankTrade(entry, action);
  else if (text.includes(TEXT_PATTERNS.BOUGHT)) parseDevCard(entry, action);
  else if (text.includes(TEXT_PATTERNS.BUILT)) parseBuilding(entry, action);
  else if (text.includes(TEXT_PATTERNS.STOLE)) {
    if (text.includes(TEXT_PATTERNS.FROM))
      parseStolenResource(entry, action, config.playerName);
    else parseMonopolyRobbery(entry, action);
  } else if (text.includes(TEXT_PATTERNS.TOOK_FROM_BANK))
    parseYearOfPlenty(entry, action);
  else if (text.includes(TEXT_PATTERNS.USED)) parseUsedDevCard(entry, action);

  logger.log("Action parsed:", JSON.stringify(action));
  parseAction(action, config);
};

export default parseEntry;
