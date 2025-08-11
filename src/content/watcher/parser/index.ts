import {
  TRobbery,
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
  TResourceKey,
  TResources,
} from "@/content/watcher/types";

const parseAction = (action: TEntryAction, config: TColonistCompanion) => {
  const { playerName } = action;

  if (!config.players[playerName] && action.type !== TEntryActionType.Ignore)
    config.players[playerName] = {
      resources: { lumber: 0, brick: 0, wool: 0, grain: 0, ore: 0 },
    };

  switch (action.type) {
    case TEntryActionType.Robbery:
      const robbery = action.robbery as TRobbery;
      for (const key in action.robbery?.victim.resources) {
        config.players[robbery.victim.playerName].resources[
          key as TResourceKey
        ] += robbery.victim.resources[key as TResourceKey];
      }
      for (const key in action.robbery?.robber.resources) {
        config.players[robbery.robber.playerName].resources[
          key as TResourceKey
        ] += robbery.robber.resources[key as TResourceKey];
      }
      break;
    case TEntryActionType.Resources:
      for (const key in action.resources)
        config.players[playerName].resources[key as TResourceKey] +=
          action.resources[key as TResourceKey];
      break;
    case TEntryActionType.Dice:
      config.dices[action.diceNumber - 2] += 1;
      break;
    case TEntryActionType.Ignore:
    default:
      break;
  }
};

const getPlayerName = (entry: Element) =>
  entry.children[0].querySelector("span")?.children[0]?.textContent || "";

const parseResources = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources)
      action.resources[altText as TResourceKey] += 1;
  }
};

const parseBankTrade = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entrySpan = entry.querySelector("span");
  if (!entrySpan) return;

  const nodes = Array.from(entrySpan.childNodes);

  const givenIndex = nodes.findIndex((node) =>
    node.textContent?.includes("gave bank")
  );
  const receivedIndex = nodes.findIndex((node) =>
    node.textContent?.includes("took")
  );

  const givenElements = nodes
    .slice(givenIndex + 1, receivedIndex)
    .filter((el) => el.nodeName === "IMG");
  const receivedElements = nodes
    .slice(receivedIndex + 1)
    .filter((el) => el.nodeName === "IMG");

  givenElements.forEach((el) => {
    const imgEl = el as HTMLImageElement;
    const resourceName = imgEl.getAttribute("alt")?.toLowerCase();
    action.resources[resourceName as keyof TResources] -= 1;
  });
  receivedElements.forEach((el) => {
    const imgEl = el as HTMLImageElement;
    const resourceName = imgEl.getAttribute("alt")?.toLowerCase();
    action.resources[resourceName as keyof TResources] += 1;
  });
};

const parseDice = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Dice;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText?.includes("dice_")) {
      const diceValue = parseInt(altText.replace("dice_", ""), 10);
      if (!isNaN(diceValue)) action.diceNumber += diceValue;
    }
  }
};

const parseDiscardedResources = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources) {
      action.resources[altText as keyof TResources] -= 1;
    }
  }
};

const parseDevCard = (entry: Element, action: TEntryAction) => {
  const imageAltName = entry
    .querySelector("span")
    ?.querySelector("img")
    ?.getAttribute("alt")
    ?.toLowerCase();
  if (imageAltName?.includes("development card")) {
    action.type = TEntryActionType.Resources;
    action.resources.wool -= 1;
    action.resources.grain -= 1;
    action.resources.ore -= 1;
  }
};

const parseBuilding = (entry: Element, action: TEntryAction) => {
  const imageName = entry
    .querySelector("span")
    ?.querySelector("img")
    ?.getAttribute("alt")
    ?.toLowerCase();
  if (!imageName) return;
  action.type = TEntryActionType.Resources;

  if (imageName?.includes("road")) {
    action.resources.lumber -= 1;
    action.resources.brick -= 1;
  } else if (imageName?.includes("settlement")) {
    action.resources.lumber -= 1;
    action.resources.brick -= 1;
    action.resources.wool -= 1;
    action.resources.grain -= 1;
  } else if (imageName?.includes("city")) {
    action.resources.ore -= 3;
    action.resources.grain -= 2;
  }
};

const parseStolenResource = (
  entry: Element,
  action: TEntryAction,
  playerName: string
) => {
  action.type = TEntryActionType.Robbery;
  action.robbery = {
    victim: {
      playerName: "",
      resources: { lumber: 0, brick: 0, wool: 0, grain: 0, ore: 0 },
    },
    robber: {
      playerName: "",
      resources: { lumber: 0, brick: 0, wool: 0, grain: 0, ore: 0 },
    },
  };

  const entrySpan = entry.querySelector("span");
  if (!entrySpan) return;

  const nodes = Array.from(entrySpan.childNodes);

  // Find the player who stole
  if (
    nodes.findIndex((node) => node.textContent?.includes("You stole")) !== -1
  ) {
    action.robbery.robber.playerName = playerName;
  } else {
    action.robbery.robber.playerName =
      entrySpan.querySelectorAll("span")[0].textContent || "";
  }

  // Find the player who was stolen from
  if (
    nodes.findIndex((node) => node.textContent?.includes("from you")) !== -1
  ) {
    action.robbery.victim.playerName = playerName;
  } else {
    if (action.robbery.robber.playerName === playerName) {
      action.robbery.victim.playerName =
        entrySpan.querySelectorAll("span")[0].textContent || "";
    } else {
      action.robbery.victim.playerName =
        entrySpan.querySelectorAll("span")[1].textContent || "";
    }
  }

  if (
    action.robbery.victim.playerName.length === 0 ||
    action.robbery.robber.playerName.length === 0
  ) {
    console.error("❌ Victim player name not found in stolen resource entry");
    action.type = TEntryActionType.Ignore;
    return;
  }

  // Get the resource stolen
  const resourceImage = entry.querySelector("span")?.querySelector("img");
  if (!resourceImage) {
    action.type = TEntryActionType.Ignore;
    console.error("❌ Resource image not found in stolen resource entry");
    return;
  }

  const resourceName = resourceImage.getAttribute("alt")?.toLowerCase();
  if (resourceName && resourceName in action.resources) {
    action.robbery.robber.resources[resourceName as keyof TResources] += 1;
    action.robbery.victim.resources[resourceName as keyof TResources] -= 1;
  }
};
const parseYearOfPlenty = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources) {
      action.resources[altText as keyof TResources] += 1;
    }
  }
};

const parsePlayerTrade = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
}

const isEntrySeparator = (entry: Element) => {
  return entry.querySelector("hr");
};

const parseEntry = async (entry: Element, config: TColonistCompanion) => {
  const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
  if (isNaN(index)) return;
  const text = entry.textContent?.toLowerCase() ?? "";

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
  else if (text.includes("got") || text.includes("received starting resources"))
    parseResources(entry, action);
  else if (text.includes("discarded")) parseDiscardedResources(entry, action);
  else if (text.includes("gave bank")) parseBankTrade(entry, action);
  else if (text.includes("bought")) parseDevCard(entry, action);
  else if (text.includes("built")) parseBuilding(entry, action);
  else if (text.includes("stole"))
    parseStolenResource(entry, action, config.playerName);
  else if (text.includes("took from bank")) parseYearOfPlenty(entry, action);
  else if (text.includes("gave")) parsePlayerTrade(entry, action);

  // TODO Show only in debug mode
  console.log("Action parsed:", JSON.stringify(action));
  parseAction(action, config);
};

export default parseEntry;
