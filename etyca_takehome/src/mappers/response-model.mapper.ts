import type { GroupedBySystemTypeResponse, GroupedSystemItem, SystemRecord } from "../system_data/model/model";

/**
 * Returns the last segment of a dot-delimited string.
 *
 * @param value Full dot-delimited string value.
 * @returns The last segment of the provided value.
 *
 * @example
 * getLastSegment("user.derived.identifiable.device.cookie_id");
 * // "cookie_id"
 */
export const getLastSegment = (value: string): string => {
    return value.split(".").pop() || value;
  }

/**
 * Filters systems by selected data use and selected data categories.
 *
 * Matching rules:
 * - If no data use is selected, all systems are eligible for the data use filter.
 * - If no categories are selected, all systems are eligible for the category filter.
 * - A system matches categories only when **all** selected categories are present
 *   somewhere in its privacy declarations.
 *
 * @param data Full list of systems to evaluate.
 * @param selectedDataUse Selected single data use filter value.
 * @param selectedCategories Selected category filter values using normalized last-segment keys.
 * @returns A filtered list of systems matching the active filters.
 *
 * @example
 * filterSystems(data, "provide.system", ["email", "financial"]);
 */
export const filterSystems = (
    data: SystemRecord[],
    selectedDataUse: string,
    selectedCategories: string[]
  ): SystemRecord[] => {
    return data.filter((system) => {
      const declarations = system.privacy_declarations ?? [];
  
      const matchesDataUse =
        !selectedDataUse ||
        declarations.some(
          (declaration) => declaration.data_use === selectedDataUse
        );
  
    const systemCategories = declarations.flatMap((declaration) =>
        declaration.data_categories.map(getLastSegment)
      );
      
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.every((selectedCategory) =>
          systemCategories.includes(selectedCategory)
        );
  
      return matchesDataUse && matchesCategories;
    });
}
  
/**
 * Groups systems by `system_type`.
 *
 * Each item in a group contains:
 * - `name`: the system name
 * - `data_categories`: unique normalized category values for that system
 * - `data_use`: unique data use values for that system
 *
 * This is useful when the UI is grouped by system type and each group renders a list of cards.
 *
 * @param data Systems to group.
 * @returns An object keyed by `system_type`, where each value is a list of transformed system items.
 *
 * @example
 * const grouped = groupBySystemType(data);
 * // grouped["Application"] => [{ name, data_categories, data_use }]
 */
export const  groupBySystemType = (
    data: SystemRecord[]
  ): GroupedBySystemTypeResponse => {
    const grouped = data.reduce<Record<string, SystemRecord[]>>((acc, item) => {
      const key = item.system_type;
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push(item);
      return acc;
    }, {});
    return Object.fromEntries(
      Object.entries(grouped).map(([key, items]) => [
        key,
        items.map((value) => ({
          name: value.name,
          data_categories: Array.from(
            new Set(
              value.privacy_declarations.flatMap((declaration) => {
                return declaration.data_categories.map(getLastSegment)
              }
              )
            )
          ),
          data_use: Array.from(
            new Set(
              value.privacy_declarations.map((declaration) => declaration.data_use)
            )
          ),
        })),
      ])
    );
    }


/**
 * Groups systems by each privacy declaration's `data_use` value.
 *
 * @param data Systems to group.
 * @returns An object keyed by `data_use`, where each value is a list of transformed system items.
 *
 */    
export const groupByDataUse = (
    data: SystemRecord[]
  ): GroupedBySystemTypeResponse => {
    const grouped = data.reduce<Record<string, GroupedSystemItem[]>>(
      (acc, system) => {
        for (const declaration of system.privacy_declarations) {
          const key = declaration.data_use;
  
          if (!acc[key]) {
            acc[key] = [];
          }
  
          const existingItem = acc[key].find(
            (item) => item.name === system.name
          );
  
          if (existingItem) {
            existingItem.data_use = Array.from(
              new Set([...existingItem.data_use, declaration.data_use])
            );
  
            existingItem.data_categories = Array.from(
              new Set([
                ...existingItem.data_categories,
                ...declaration.data_categories.map(getLastSegment),
              ])
            );
          } else {
            acc[key].push({
              name: system.name,
              data_categories: Array.from(
                new Set(declaration.data_categories.map(getLastSegment))
              ),
              data_use: [declaration.data_use],
            });
          }
        }
  
        return acc;
      },
      {}
    );
  
    return grouped;
  }

/**
 * Extracts all unique `data_use` values from the system list for use in UI filter controls.
 *
 * Values are returned exactly as stored in the privacy declarations, such as
 * `provide.system` or `advertising.third_party`.
 *
 * @param data Systems to scan.
 * @returns A deduplicated list of data use values.
 */
export const getDataUseOptions = (data) =>  Array.from(
    new Set(
      data.flatMap((system) =>
        system.privacy_declarations.map((declaration) => declaration.data_use)
      )
    )
  );

/**
 * Extracts all unique data category values from the system list for use in UI filter controls.
 *
 * Returned category values are normalized to the last segment of the category path
 * to keep filter labels short and user-friendly.
 *
 * @param data Systems to scan.
 * @returns A deduplicated list of normalized category values.
 */
export const getCategoryOptions = (data) => Array.from(
    new Set(
      data.flatMap((system) =>
        system.privacy_declarations.flatMap((declaration) =>
          declaration.data_categories.map(
            (category) => category.split(".").pop() || category
          )
        )
      )
    )
  );