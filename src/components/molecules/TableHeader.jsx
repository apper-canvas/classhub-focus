import React from "react";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({ columns, sortBy, sortOrder, onSort }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
            }`}
            onClick={column.sortable ? () => onSort(column.key) : undefined}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && (
                <ApperIcon
                  name={
                    sortBy === column.key
                      ? sortOrder === "asc"
                        ? "ChevronUp"
                        : "ChevronDown"
                      : "ChevronsUpDown"
                  }
                  className="h-4 w-4"
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;