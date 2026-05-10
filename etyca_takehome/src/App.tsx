import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { getDataUseOptions, groupByDataUse ,getCategoryOptions, groupBySystemType, filterSystems } from './mappers/response-model.mapper'
import { systeData } from './system_data/system_data'
import { SystemTypeGrid } from './component/system-grid/system-grid.component';
import { FilterControlBar } from './component/filter-bar/filter-bar.component';
import Box from '@mui/material/Box';
import type { GroupByMode } from './system_data/model/model';

function App() {
  const [selectedDataUse, setSelectedDataUse] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);;
  const [groupBy, setGroupBy] = useState<GroupByMode>("system_type");
  const [dataUseOptions, setDataUseOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const filteredData = useMemo(() => {
    if(systeData) {
      return filterSystems(systeData, selectedDataUse, selectedCategories);
    }
  }, [selectedDataUse, selectedCategories]);
  
  const groupedData = useMemo(() => {
    if(filteredData) {
      if (groupBy === "system_type") {
        return groupBySystemType(filteredData);
      }
    
      return groupByDataUse(filteredData);
    }
  }, [filteredData, groupBy]);

  useEffect(() => {
    setDataUseOptions(getDataUseOptions(systeData));
    setCategoryOptions(getCategoryOptions(systeData));
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedDataUse('');
    setSelectedCategories([]);
  }, [])

  return (
    <>
    <Box sx={{ p: 3 }}>
      <FilterControlBar
        dataUseOptions={dataUseOptions}
        categoryOptions={categoryOptions}
        selectedDataUse={selectedDataUse}
        selectedCategories={selectedCategories}
        groupBy={groupBy}
        onDataUseChange={setSelectedDataUse}
        onCategoriesChange={setSelectedCategories}
        onGroupByChange={setGroupBy}
        resetFilters={resetFilters}
      />
    </Box>
    { groupedData ? <SystemTypeGrid groupedData={groupedData} /> : null }
    </>
  )
}

export default App
