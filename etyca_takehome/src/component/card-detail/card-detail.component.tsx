type SystemCardProps = {
    item: {
      name: string;
      data_categories: string[];
    };
  };
  
  export function SystemCard({ item }: SystemCardProps) {
    return (
      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">{item.name}</h3>
  
        <div className="flex flex-wrap gap-2">
          {item.data_categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
            >
              {category}
            </span>
          ))}
        </div>
      </article>
    );
  }