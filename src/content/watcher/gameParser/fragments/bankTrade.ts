import {
  TEntryAction,
  TEntryActionType,
  TResourceKey,
} from "@/content/watcher/gameParser/types";

export const parseBankTrade = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entrySpan = entry.querySelector("span");
  if (!entrySpan) return;

  const nodes = Array.from(entrySpan.childNodes);

  const givenIndex = nodes.findIndex((node) => node.textContent?.includes("gave bank"));
  const receivedIndex = nodes.findIndex((node) => node.textContent?.includes("took"));

  const givenElements = nodes
    .slice(givenIndex + 1, receivedIndex)
    .filter((el) => el.nodeName === "IMG");
  const receivedElements = nodes
    .slice(receivedIndex + 1)
    .filter((el) => el.nodeName === "IMG");

  givenElements.forEach((el) => {
    const imgEl = el as HTMLImageElement;
    const resourceName = imgEl.getAttribute("alt")?.toLowerCase();
    action.resources[resourceName as TResourceKey] -= 1;
  });
  receivedElements.forEach((el) => {
    const imgEl = el as HTMLImageElement;
    const resourceName = imgEl.getAttribute("alt")?.toLowerCase();
    action.resources[resourceName as TResourceKey] += 1;
  });
};
