import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, TextField, MenuItem, Avatar, Typography } from "@mui/material";
import tableData from "./tableData.json";
import tableConfig from "./tableConfig.json";

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function ConfigurableTable() {
  const [filters, setFilters] = useState(tableConfig.filters);
  const debouncedName = useDebounce(filters.name, 500); // 500ms debounce
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (tableData && tableData.users) {
      setUsers(tableData.users);
    }
  }, []);

  const filteredData = useMemo(() => {
    return users.filter((row) => {
      return (
        (!debouncedName || row.name.toLowerCase().includes(debouncedName.toLowerCase())) &&
        (filters.role.length === 0 || filters.role.includes(row.role))
      );
    });
  }, [debouncedName, filters.role, users]);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        padding: 2,
      }}
    >
      {/* Dynamic Filters */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        {tableConfig.columns.map((col) => {
          if (col.filterType === "text") {
            return (
              <TextField
                key={col.accessorKey}
                label={`Filter by ${col.header}`}
                variant="outlined"
                size="small"
                value={filters[col.accessorKey] || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, [col.accessorKey]: e.target.value }))}
                sx={{ backgroundColor: "white", width: 250 }}
              />
            );
          }
          if (col.filterType === "multi-select") {
            return (
              <TextField
                key={col.accessorKey}
                select
                label={`Filter by ${col.header}`}
                variant="outlined"
                size="small"
                value={filters[col.accessorKey] || []}
                onChange={(e) => setFilters((prev) => ({ ...prev, [col.accessorKey]: e.target.value }))}
                sx={{ backgroundColor: "white", width: 250 }}
                SelectProps={{ multiple: true }}
              >
                {[...new Set(users.map((d) => d[col.accessorKey]))].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            );
          }
          return null;
        })}
      </Box>
  
      {/* Dynamic Table */}
      <Box
        sx={{
          width: "95%",
          flexGrow: 1, 
          backgroundColor: "white",
          borderRadius: 2,
          padding: 2,
          overflow: "auto",
        }}
      >
        <MaterialReactTable
          columns={tableConfig.columns.map((col) => ({
            ...col,
            Cell: col.showAvatar
              ? ({ row }) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={`https://i.pravatar.cc/40?u=${row.original.name}`} alt={row.original.name} />
                    <Typography>{row.original.name}</Typography>
                  </Box>
                )
              : undefined,
          }))}
          data={filteredData}
          enableSorting
          enablePagination
          muiTableContainerProps={{
            sx: { maxHeight: "75vh" },
          }}
        />
      </Box>
    </Box>
  );
  
}
