import {
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
  TResources,
} from "@/content/watcher/types";

const parseAction = (action: TEntryAction, config: TColonistCompanion) => {
  const {
    playerName,
    resources: { lumber, brick, wool, grain, ore },
  } = action;

  if (!config.players[playerName] && action.type !== TEntryActionType.Ignore)
    config.players[playerName] = {
      resources: { lumber: 0, brick: 0, wool: 0, grain: 0, ore: 0 },
    };

  switch (action.type) {
    case TEntryActionType.Ignore:
      return;
    case TEntryActionType.Resources:
      // const playerResources = config.players[playerName].resources;

      // config.players = {
      //   ...config.players,
      //   [playerName]: {
      //     resources: {
      //       lumber: playerResources.lumber + lumber,
      //       brick: playerResources.brick + brick,
      //       wool: playerResources.wool + wool,
      //       grain: playerResources.grain + grain,
      //       ore: playerResources.ore + ore,
      //     },
      //   },
      // };

      config.players[playerName].resources.lumber += lumber;
      config.players[playerName].resources.brick += brick;
      config.players[playerName].resources.wool += wool;
      config.players[playerName].resources.grain += grain;
      config.players[playerName].resources.ore += ore;
      break;
    case TEntryActionType.Dice:
      config.dices[action.diceNumber - 1] += 1;
      break;
    default:
      break;
  }
};

const getPlayerName = (entry: Element) => {
  return entry.children[0].querySelector("span")?.children[0].textContent || "";
};

const parseResources = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources) {
      action.resources[altText as keyof TResources] += 1;
    }
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

const parseEntry = async (entry: Element, config: TColonistCompanion) => {
  const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
  if (isNaN(index)) return;
  const text = entry.textContent?.toLowerCase() ?? "";

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

  console.log("Action parsed:", JSON.stringify(action));
  parseAction(action, config);
};

export { parseEntry };
