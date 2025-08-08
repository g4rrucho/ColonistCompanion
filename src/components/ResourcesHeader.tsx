import CardLumber from "@/assets/card_lumber.svg?react";
import CardBrick from "@/assets/card_brick.svg?react";
import CardWool from "@/assets/card_wool.svg?react";
import CardGrain from "@/assets/card_grain.svg?react";
import CardOre from "@/assets/card_ore.svg?react";

const ResourcesHeader = () => (
  <div className="cc-flex">
    <strong className="cc-text-lg cc-mb-1 cc-w-[100px]"></strong>
    <div className="cc-flex cc-gap-2">
      <CardLumber className="cc-w-8 cc-h-8" />
      <CardBrick className="cc-w-8 cc-h-8" />
      <CardWool className="cc-w-8 cc-h-8" />
      <CardGrain className="cc-w-8 cc-h-8" />
      <CardOre className="cc-w-8 cc-h-8" />
    </div>
  </div>
);

export default ResourcesHeader;
