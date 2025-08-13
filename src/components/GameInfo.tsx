import { useCompanion } from "@/contexts/companion";
import PlayerList from "@/components/PlayerList";
import ResourcesHeader from "@/components/ResourcesHeader";

import DiceChart from "@/components/DiceChart";

import { TCards } from "@/content/watcher/types";
import CardKnight from "@/assets/card_knight.svg?react";
import CardYearOfPlenty from "@/assets/card_yearofplenty.svg?react";
import CardMonopoly from "@/assets/card_monopoly.svg?react";
import CardRoadBuilding from "@/assets/card_roadbuilding.svg?react";

const DevCards: React.FC<TCards> = ({
  knight,
  monopoly,
  roadBuilding,
  yearOfPlenty,
}) => {
  return (
    <div className="cc-flex cc-justify-around">
      <div className="cc-flex cc-items-center">
        <CardKnight className="cc-w-8 cc-h-8" />
        <div className="cc-text-black">{knight}/14</div>
      </div>
      <div className="cc-flex cc-items-center">
        <CardYearOfPlenty className="cc-w-8 cc-h-8" />
        <div className="cc-text-black">{yearOfPlenty}/2</div>
      </div>
      <div className="cc-flex cc-items-center">
        <CardMonopoly className="cc-w-8 cc-h-8" />
        <div className="cc-text-black">{monopoly}/2</div>
      </div>
      <div className="cc-flex cc-items-center">
        <CardRoadBuilding className="cc-w-8 cc-h-8" />
        <div className="cc-text-black">{roadBuilding}/2</div>
      </div>
    </div>
  );
};

const GameInfo = () => {
  const config = useCompanion();
  if (!config) return null;

  return (
    <div className="cc-flex cc-flex-col cc-w-full cc-gap-2">
      <ResourcesHeader />
      <PlayerList />
      <div className="cc-h-[1px] cc-mx-4 cc-bg-gray-500" />
      <DevCards {...config.cards} />
      <DiceChart dices={config.dices} />
    </div>
  );
};

export default GameInfo;
