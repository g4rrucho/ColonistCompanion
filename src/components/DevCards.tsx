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

export default DevCards;
