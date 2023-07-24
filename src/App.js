import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Papa from 'papaparse';
import Data from './dataset_small.csv';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parsedData);
      setFilteredData(parsedData); 
      setFilterOptions(getFilterOptions(parsedData));
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: 'Number',
      selector: 'number',
    },
    {
      name: 'Modulo 3',
      selector: 'mod3',
    },
    {
      name: 'Modulo 4',
      selector: 'mod4',
    },
    {
      name: 'Modulo 5',
      selector: 'mod5',
    },
    {
      name: 'Modulo 6',
      selector: 'mod6',
    },
  ];

  const getFilterOptions = (data) => {
    const filterOptions = {};
    columns.forEach((column) => {
      const columnName = column.selector;
      const uniqueValues = [...new Set(data.map((item) => item[columnName]))];
      filterOptions[columnName] = uniqueValues;
    });
    return filterOptions;
  };

  const handleFilterChange = (columnName, selectedValue) => {
    setFilteredData((prevData) =>
      prevData.filter((item) => item[columnName] === selectedValue)
    );
  };

  return (
    <div>
      <h1>Filter for small dataset</h1>
      <FilterComponent filterOptions={filterOptions} onFilterChange={handleFilterChange} />
      <TableComponent columns={columns} data={filteredData} />
    </div>
  );
};

const FilterComponent = ({ filterOptions, onFilterChange }) => {
  const handleFilterChange = (columnName, event) => {
    const selectedValue = event.target.value;
    onFilterChange(columnName, selectedValue);
  };

  return (
    <div>
      {Object.entries(filterOptions).map(([columnName, options]) => (
        <div key={columnName}>
          <h3>{columnName}</h3>
          <select onChange={(event) => handleFilterChange(columnName, event)}>
            <option value="">Select {columnName}...</option>
            {options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

const TableComponent = ({ columns, data }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={100}
      paginationRowsPerPageOptions={[100]}
      paginationComponentOptions={{ rowsPerPageText: 'Rows per page:' }}
      fixedHeader
    />
  );
};

export default App;
