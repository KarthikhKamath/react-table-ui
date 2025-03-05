# Configurable Table

This project is a configurable React table built using `material-react-table` and MUI components. It loads data and table configurations from JSON files and has filtering abilities.

## Features
- Dynamically generated table columns from `tableConfig.json`
- Filters (text and multi-select) based on configuration
- Debounced search for optimized performance
- Avatar display for specific columns

## Prerequisites
Make sure you have the following installed:
- Node.js (>= 14.x)
- npm or yarn

## Getting Started

### 1. Unzip the file
```sh
cd json-table-ui
```

### 2. Install dependencies
Using npm:
```sh
npm install
```
Using yarn:
```sh
yarn install
```

### 3. Start the development server
Using npm:
```sh
npm run dev
```
Using yarn:
```sh
yarn dev
```

The app will be available at `http://localhost:5173`.

## Configuration
The table is powered by `tableData.json` and `tableConfig.json`. You can modify these files to change the table structure and data.

### `tableConfig.json`
Defines table columns, filters, and sorting options.
```json
{
    "columns": [
        { "accessorKey": "name", "header": "Name", "filterType": "text", "enableSorting": true, "showAvatar": true },
        { "accessorKey": "role", "header": "Role", "filterType": "multi-select", "enableSorting": false }
    ],
    "filters": {
        "name": "",
        "role": []
    }
}
```

### `tableData.json`
Contains the data displayed in the table.
```json
{
  "users": [
    { "name": "Amit Sharma", "role": "Developer", "age": 28, "email": "amit.sharma@example.com" }
  ]
}
```

## Customization
- Modify `tableConfig.json` to add/remove columns.
- Update `tableData.json` to load different data sets.

