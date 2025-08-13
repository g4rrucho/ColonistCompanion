import { TResources } from "@/content/watcher/gameParser/types";

const PlayerResources = ({ resources }: { resources: TResources }) => (
  <div className="cc-flex cc-gap-2 cc-text-black">
    {Object.entries(resources).map(([resource, amount]) => (
      <div key={resource} className="cc-w-8 cc-text-center cc-text-black">
        {amount}
      </div>
    ))}
  </div>
);

export default PlayerResources;
