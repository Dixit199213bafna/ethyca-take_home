import type { GroupedSystemItem } from "../../system_data/model/model";
import { SystemCard } from "../card-detail/card-detail.component";

type GroupedBySystemTypeResponse = Record<string, GroupedSystemItem[]>;

type SystemTypeGridProps = {
  groupedData: GroupedBySystemTypeResponse;
};

export function SystemTypeGrid({ groupedData }: SystemTypeGridProps) {
  return (
    <div className="space-y-8 flex gap-10">
      {Object.entries(groupedData).map(([systemType, items]) => (
        <section key={systemType}>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {systemType}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <SystemCard key={item.name} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}