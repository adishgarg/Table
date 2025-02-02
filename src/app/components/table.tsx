import React, { useState, useEffect } from "react";
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

type CellValue = {
  type: string;
  value: any;
  color?: string;
};

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

  const renderCellContent = (value: CellValue | number | string | null) => {
    if (typeof value === "object" && value !== null) {
      if (value.type === "date") {
        return format(new Date(value.value), "dd/MM/yyyy");
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

      if (!Array.isArray(value)) {
        return (
          <div>
            {Object.entries(value).map(([key, nestedValue]) => (
              <div key={key}>
                <strong>{key}:</strong> {JSON.stringify(nestedValue)}
              </div>
            ))}
          </div>
        );
      }

      return value.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ));
    }

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    return value;
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#fff", boxShadow: 3, borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="styled table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
            {columns.map((column, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold", color: "#fff" }}>
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
                "&:nth-of-type(odd)": { backgroundColor: "#f4f4f4" },
                "&:nth-of-type(even)": { backgroundColor: "#e9e9e9" },
                "&:hover": { backgroundColor: "#cfe2f3" },
              }}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {renderCellContent(row[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(rows.length / visibleRows)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </TableContainer>
  );
}

DynamicTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnDisplayMap: PropTypes.object.isRequired,
};

export default DynamicTable;
