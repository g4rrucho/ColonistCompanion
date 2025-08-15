import {
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
  TResourceKey,
  TRobbery,
} from "@/content/watcher/gameParser/types";
import { handleResourcesChange } from "@/content/watcher/gameParser/utils";

export const parseAction = (
  action: TEntryAction,
  config: TColonistCompanion
) => {
  const { playerName } = action;

  if (!config.players[playerName] && action.type !== TEntryActionType.Ignore)
    config.players[playerName] = {
      resources: { lumber: 0, brick: 0, wool: 0, grain: 0, ore: 0 },
    };

  switch (action.type) {
    case TEntryActionType.DevCard:
      config.cards.dev -= 1;
      handleResourcesChange(action, config);
      break;
    case TEntryActionType.MonopolyRobbery:
      const resource: TResourceKey = action.resource as TResourceKey;

      for (const playerKey in config.players)
        if (playerKey !== action.playerName)
          config.players[playerKey].resources[resource] = 0;

      config.players[action.playerName].resources[resource] +=
        action.resources[resource];
      break;
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
      handleResourcesChange(action, config);
      break;
    case TEntryActionType.PlayerTrade:
      console.log("Player trade action:", action);
      if (!action.playerTrade?.length) return;

      action.playerTrade.forEach((trade) => {
        for (const key in trade.resources) {
          config.players[trade.playerName].resources[key as TResourceKey] +=
            trade.resources[key as TResourceKey];
        }
      });
      break;
    case TEntryActionType.BuildRoad:
      config.cards.roadBuilding += 1;
      break;
    case TEntryActionType.Knight:
      config.cards.knight += 1;
      break;
    case TEntryActionType.YearOfPlenty:
      config.cards.yearOfPlenty += 1;
      break;
    case TEntryActionType.Monopoly:
      config.cards.monopoly += 1;
      break;
    case TEntryActionType.Dice:
      config.dices[action.diceNumber - 2] += 1;
      break;
    case TEntryActionType.Ignore:
    default:
      break;
  }
};
