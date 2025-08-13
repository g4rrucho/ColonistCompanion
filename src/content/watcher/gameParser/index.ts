import {
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
} from "@/content/watcher/gameParser/types";
import { parseAction } from "./parseAction";
import { isPlayerTrade, isEntrySeparator } from "./detectors";
import { getPlayerName } from "./utils";

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

const parseEntry = async (entry: Element, config: TColonistCompanion) => {
  const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
  if (isNaN(index)) return;
  const text = textOf(entry);

  if (isEntrySeparator(entry)) return;
  if (entry.textContent?.includes("has disconnected")) return;
  if (entry.textContent?.includes("has reconnected")) return;
  if (entry.textContent?.includes("rulebook")) return;
  if (entry.textContent?.includes("No player to steal from")) return;
  if (entry.textContent?.includes("wants to give")) return;

  const action: TEntryAction = {
    index,
    type: TEntryActionType.Ignore,
    diceNumber: 0,
    playerName: getPlayerName(entry),
    resources: { brick: 0, lumber: 0, grain: 0, wool: 0, ore: 0 },
  };

  if (text.includes("rolled")) parseDice(entry, action);
  else if (isPlayerTrade(entry)) parsePlayerTrade(entry, action);
  else if (text.includes("got") || text.includes("received starting resources"))
    parseResources(entry, action);
  else if (text.includes("discarded")) parseDiscardedResources(entry, action);
  else if (text.includes("gave bank")) parseBankTrade(entry, action);
  else if (text.includes("bought")) parseDevCard(entry, action);
  else if (text.includes("built")) parseBuilding(entry, action);
  else if (text.includes("stole")) {
    if (text.includes("from"))
      parseStolenResource(entry, action, config.playerName);
    else parseMonopolyRobbery(entry, action);
  } else if (text.includes("took from bank")) parseYearOfPlenty(entry, action);
  else if (text.includes("used")) parseUsedDevCard(entry, action);

  // TODO Show only in debug mode
  console.log("Action parsed:", JSON.stringify(action));
  parseAction(action, config);
};

export default parseEntry;
