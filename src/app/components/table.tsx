import React, { useState, useEffect } from "react";
import { parseISO, isValid } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";

interface Column {
  type?: string;
  value?: any;
  color?: string;
}

interface DynamicTableProps {
  columns: string[];
  rows: Record<string, any>[];
  columnDisplayMap: { [key: string]: string };
}

function DynamicTable({ columns, rows, columnDisplayMap }: DynamicTableProps) {
  const [visibleRows, setVisibleRows] = useState(5);
  const [page, setPage] = useState(1);
  const [paginatedRows, setPaginatedRows] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const startIndex = (page - 1) * visibleRows;
    setPaginatedRows(rows.slice(startIndex, startIndex + visibleRows));
  }, [rows, page, visibleRows]);

  interface CellValue {
    type?: string;
    value?: any;
    color?: string;
  }



  const renderCellContent = (value: CellValue | number | string | null, column?: string) => {
    if (typeof value === "object" && value !== null) {
      if (value.type === "date" && value.value) {
        const parsedDate = parseISO(value.value);
        return isValid(parsedDate) ? format(parsedDate, "dd MMM yyyy, hh:mm a") : value.value;
      }
      if (value.type === "category") {
        return (
          <Chip
            label={value.value}
            color={
              (value.color as
                | "default"
                | "primary"
                | "secondary"
                | "error"
                | "info"
                | "success"
                | "warning") || "default"
            }
          />
        );
      }
      return JSON.stringify(value);
    }
    if (column === "id") {
      return (
        <a
          href={`/products/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {value}
        </a>
      );
    }
  
    if (typeof value === "number" && column === "price") {
      return `$${value.toFixed(2)}`;
    }
  
    if (typeof value === "number") {
      return value.toLocaleString();
    }
  
    if (typeof value === "string") {
      const parsedDate = parseISO(value);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd MMM yyyy, hh:mm a");
      }
  
      if (/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        return (
          <a href={`mailto:${value}`} className="text-blue-400 hover:underline">
            {value}
          </a>
        );
      }
  
      return value;
    }
  
    return value;
  };
  
  
  

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div style={{ maxWidth: '100%', padding: '16px', boxSizing: 'border-box', margin: 'auto', marginTop: 4 }}>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <FormControl sx={{ minWidth: 120, color: '#000', marginBottom: { xs: 2, sm: 0 } }}>
        <InputLabel sx={{ color: '#000' }}>Rows per page</InputLabel>
        <Select
          value={visibleRows}
          onChange={(e) => {
            setPage(1);
            setVisibleRows(Number(e.target.value));
          }}
          label="Rows per page"
          sx={{ color: '#000' }}
        >
          {[5, 10, 15, 20].map((num) => (
            <MenuItem key={num} value={num} sx={{ color: '#333' }}>
              {num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    <TableContainer component={Paper} sx={{ backgroundColor: '#f0f0f0', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650, color: '#000' }} aria-label="styled table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#d6d6d6' }}>
            {columns.map((column, index) => (
              <TableCell key={index} sx={{ fontWeight: 'bold', color: '#000' }}>
                {columnDisplayMap[column] || column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                '&:nth-of-type(odd)': { backgroundColor: '#f7f7f7' },
                '&:nth-of-type(even)': { backgroundColor: '#e0e0e0' },
              }}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} sx={{ color: '#000' }}>
                  {renderCellContent(row[column], column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Pagination
      count={Math.ceil(rows.length / visibleRows)}
      page={page}
      onChange={handleChangePage}
      color="primary"
      sx={{
        marginTop: 2,
        display: 'flex',
        justifyContent: 'center',
        '& .MuiPaginationItem-root': {
          color: '#000',
        },
      }}
    />
  </div>
  );
}

DynamicTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnDisplayMap: PropTypes.object.isRequired,
};

export default DynamicTable;
