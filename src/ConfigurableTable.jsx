import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, TextField, MenuItem, Avatar, Typography, Chip } from "@mui/material";
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
  const [filters, setFilters] = useState({ name: "", role: [] });
  const debouncedName = useDebounce(filters.name, 500);
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
    <Box sx={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 2, backgroundColor: "#fff" }}>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}>
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          value={filters.name}
          onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          sx={{ width: 250 }}
        />
        <TextField
          select
          label="Filter by Role"
          variant="outlined"
          size="small"
          value={filters.role}
          onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
          sx={{ width: 250 }}
          SelectProps={{ multiple: true }}
        >
          {[...new Set(users.map((d) => d.role))].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <Box sx={{ width: "95%", flexGrow: 1, backgroundColor: "white", borderRadius: 2, padding: 2, overflow: "auto" }}>
      <MaterialReactTable
  columns={tableConfig.columns.map((col) => ({
    ...col,
    size: col.accessorKey === "age" ? 50 : col.accessorKey === "teams" ? 280 : undefined, 
    Cell:
      col.accessorKey === "name"
        ? ({ row }) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={`https://i.pravatar.cc/40?u=${row.original.name}`} alt={row.original.name} />
              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: 14, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                  {row.original.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "gray", fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                  @{row.original.username}
                </Typography>
              </Box>
            </Box>
          )
        : col.accessorKey === "teams"
        ? ({ row }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {row.original.teams.slice(0, 3).map((team, index) => (
                <Chip
                  key={index}
                  label={team}
                  sx={{
                    backgroundColor: index === 0 ? "#E3F2FD" : index === 1 ? "#BBDEFB" : "#42A5F5",
                    color: index === 0 ? "#1565C0" : index === 1 ? "#0D47A1" : "#082974",
                    fontWeight: "bold"
                  }}
                />
              ))}
              {row.original.teams.length > 3 && (
                <Chip label={`+${row.original.teams.length - 3}`} sx={{ backgroundColor: "#E0E0E0", color: "#424242", fontWeight: "bold" }} />
              )}
            </Box>
          )
        : col.accessorKey === "status"
        ? ({ row }) => (
            <Chip
              label={row.original.status}
              sx={{
                backgroundColor: row.original.status === "Working" ? "#E3F2FD" : "#E0E0E0",
                color: row.original.status === "Working" ? "#1565C0" : "#424242",
                fontWeight: "bold"
              }}
            />
          )
        : undefined,
  }))}
  data={filteredData}
  enableSorting
  enablePagination
  enableGlobalFilter={false} // Disable search
  enableColumnFilters={false} // Disable filters
  enableColumnResizing={false} // Disable column resizing
  enableHiding={false} // Disable column visibility toggle (removes three-line menu)
  enableFullScreenToggle={false} // Disable full-screen mode
  enableDensityToggle={false} // Disable density options
  enableTopToolbar={false} // Completely remove the top toolbar
  muiTableContainerProps={{ sx: { maxHeight: "75vh" } }}
/>

      </Box>
    </Box>
  );
}