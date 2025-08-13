import { TEntryAction, TEntryActionType } from "@/content/watcher/gameParser/types";

export const parseDice = (entry: Element, action: TEntryAction) => {
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
