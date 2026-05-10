type PrivacyDeclaration = {
    name: string;
    data_use: string;
    data_categories: string[];
    data_subjects: string[];
};
  
export type SystemRecord = {
    fides_key: string;
    name: string;
    description: string;
    system_type: string;
    system_dependencies: string[];
    privacy_declarations: PrivacyDeclaration[];
};

export type GroupedSystemItem = {
    name: string;
    data_categories: any;
    data_use: string[];
  };
  
export type GroupedBySystemTypeResponse = Record<string, GroupedSystemItem[]>;

export type GroupByMode = "system_type" | "data_use";
