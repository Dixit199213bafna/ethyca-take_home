import * as React from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { GroupByMode } from "../../system_data/model/model";

type FilterControlBarProps = {
  dataUseOptions: string[];
  categoryOptions: string[];
  selectedDataUse: string;
  selectedCategories: string[];
  groupBy: GroupByMode;
  onDataUseChange: (value: string) => void;
  onCategoriesChange: (value: string[]) => void;
  onGroupByChange: (value: GroupByMode) => void;
  resetFilters: () => void;
};

export function FilterControlBar({
  dataUseOptions,
  categoryOptions,
  selectedDataUse,
  selectedCategories,
  groupBy,
  onDataUseChange,
  onCategoriesChange,
  onGroupByChange,
  resetFilters,
}: FilterControlBarProps) {
  const handleDataUseChange = (event: SelectChangeEvent<string>) => {
    onDataUseChange(event.target.value);
  };

  const handleCategoriesChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const value = event.target.value;
    onCategoriesChange(typeof value === "string" ? value.split(",") : value);
  };

  const handleToggleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onGroupByChange(event.target.checked ? "data_use" : "system_type");
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr auto" },
        gap: 2,
        alignItems: "center",
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      { groupBy === 'system_type' ? <FormControl fullWidth size="small">
        <InputLabel id="data-use-label">Data Use</InputLabel>
        <Select
          labelId="data-use-label"
          value={selectedDataUse}
          label="Data Use"
          onChange={handleDataUseChange}
        >

          {dataUseOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl> : null }

      <FormControl fullWidth size="small">
        <InputLabel id="categories-label">Categories</InputLabel>
        <Select
          labelId="categories-label"
          multiple
          value={selectedCategories}
          onChange={handleCategoriesChange}
          input={<OutlinedInput label="Categories" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
        <FormControlLabel
          control={
            <Switch
              checked={groupBy === "data_use"}
              onChange={handleToggleChange}
            />
          }
          label={
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">
                {groupBy === "data_use" ? "Grouped by Data Use" : "Grouped by System Type"}
              </Typography>
            </Box>
          }
        />
      </Box>
      <Button variant="contained" onClick={resetFilters}>Reset Filters</Button>
    </Box>
  );
}