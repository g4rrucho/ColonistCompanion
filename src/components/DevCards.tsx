import { TCards } from "@/content/watcher/gameParser/types";
import CardKnight from "@/assets/card_knight.svg?react";
import CardYearOfPlenty from "@/assets/card_yearofplenty.svg?react";
import CardMonopoly from "@/assets/card_monopoly.svg?react";
import CardRoadBuilding from "@/assets/card_roadbuilding.svg?react";
import CardDev from "@/assets/card_dev.svg?react";

const DevCards: React.FC<TCards> = ({
  knight,
  monopoly,
  roadBuilding,
  yearOfPlenty,
  dev,
}) => {
  return (
    <div className="cc-flex cc-flex-wrap cc-justify-around cc-gap-1">
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
      <div className="cc-flex cc-items-center">
        <CardDev className="cc-w-8 cc-h-8" />
        <div className="cc-text-black">{dev}/25</div>
      </div>
    </div>
  );
};

export default DevCards;
