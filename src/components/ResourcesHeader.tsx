import CardLumber from "@/assets/card_lumber.svg?react";
import CardBrick from "@/assets/card_brick.svg?react";
import CardWool from "@/assets/card_wool.svg?react";
import CardGrain from "@/assets/card_grain.svg?react";
import CardOre from "@/assets/card_ore.svg?react";

const ResourcesHeader = () => (
  <div className="cc-flex">
    <strong className="cc-mb-1 cc-w-[100px] cc-text-lg"></strong>
    <div className="cc-flex cc-gap-2">
      <CardLumber className="cc-h-8 cc-w-8" />
      <CardBrick className="cc-h-8 cc-w-8" />
      <CardWool className="cc-h-8 cc-w-8" />
      <CardGrain className="cc-h-8 cc-w-8" />
      <CardOre className="cc-h-8 cc-w-8" />
    </div>
  </div>
);

export default ResourcesHeader;
