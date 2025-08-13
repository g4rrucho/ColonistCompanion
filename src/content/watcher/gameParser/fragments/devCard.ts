import { TEntryAction, TEntryActionType } from "@/content/watcher/gameParser/types";

export const parseUsedDevCard = (entry: Element, action: TEntryAction) => {
  const images = Array.from(entry.querySelectorAll("img"));
  if (images.length === 0) {
    action.type = TEntryActionType.Ignore;
    console.error("❌ Dev card image not found in used dev card entry");
    return;
  }

  const devCardImage = images.find((el) =>
    el.getAttribute("src")?.toLowerCase().includes("card_")
  );
  if (!devCardImage) {
    action.type = TEntryActionType.Ignore;
    console.error("❌ Dev card not found in used dev card entry");
    return;
  }

  const devCard = devCardImage?.getAttribute("alt")?.toLowerCase();
  if (!devCard) {
    action.type = TEntryActionType.Ignore;
    console.error("❌ Dev card name not found in used dev card entry");
    return;
  }

  if (devCard.includes("knight")) action.type = TEntryActionType.Knight;
  else if (devCard.includes("year of plenty"))
    action.type = TEntryActionType.YearOfPlenty;
  else if (devCard.includes("road building"))
    action.type = TEntryActionType.BuildRoad;
  else if (devCard.includes("monopoly"))
    action.type = TEntryActionType.Monopoly;
};

export const parseDevCard = (entry: Element, action: TEntryAction) => {
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
