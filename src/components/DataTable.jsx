// src/components/DataTable.jsx

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function DataTable({ objData, onClickEdit, onClickDelete }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    ID: false, // oculta la columna Id por defecto
  });
  const [pageSize, setPageSize] = useState(10); // filas por página
  const [pageIndex, setPageIndex] = useState(0); // índice de página


  const columns = useMemo(() => {
    const cols = objData.columns.map((col) => {
      // Si la columna es un string simple, lo convertimos a objeto
      if (typeof col === "string") {
        col = {
          accessorKey: col,
          header: col,
          id: col,
          size: 150,
          minSize: 40,
          maxSize: 400,
        };
      } else {
        col.id = col.id || col.accessorKey;
      }

      // Columna Logo: mostrar imagen
      if (col.accessorKey.toLowerCase() === "imagen") {
        return {
          ...col,
          cell: ({ getValue }) => {
            // Si no hay valor, usar logo por defecto
            const src = getValue() || "/src/assets/images/Logo_gris.png";
            return (
              <img
                src={src}
                alt="Logo"
                className="h-10 w-10 object-contain rounded"
              />
            );
          },
        };
      }

      // Estilo para columna "status"
      if (col.accessorKey.toLowerCase() === "status" || col.accessorKey.toLowerCase() === "estado") {
        return {
          ...col,
          id: "status",
          cell: ({ getValue }) => (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${getValue().toLowerCase() === "activo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {getValue()}
            </span>
          ),
        };
      }

      // Estilo para columna "id"
      if (col.accessorKey.toLowerCase() === "id") {
        return {
          ...col,
          id: "ID",
          size: 40,
          enableResizing: false,
          enableHiding: true,
        };
      }
      
      return col;
    });

    // Columna de acciones siempre al final
    cols.push({
      id: "acciones",
      accessorKey: "acciones",
      header: "Acciones",
      size: 80,
      minSize: 80,
      maxSize: 400,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onClickEdit(row)}
            className="p-1 text-blue-700 rounded hover:bg-blue-500 hover:text-white"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onClickDelete(row)}
            className="p-1 text-red-700 rounded hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    });

    return cols;
  }, [objData.columns]);

  const table = useReactTable({
    data: objData.data,
    columns,
    state: { globalFilter, sorting, columnVisibility, pagination: { pageIndex, pageSize } },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <input
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar..."
        className="mb-4 w-full rounded-md border px-3 py-2"
      />

      <div className="relative overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#47351A] text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="relative px-4 py-2 text-left text-sm font-semibold select-none border-r border-gray-300"
                  >
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                    </div>

                    {/* Resizer */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-green-400"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"} hover:bg-green-50 transition-colors`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }} className="px-4 py-2 text-sm truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span>Filas por página:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

      </div>


      <div className="mt-4 flex items-center justify-between">
        <div className="space-x-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded border px-3 py-1 disabled:opacity-50">
            Anterior
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded border px-3 py-1 disabled:opacity-50">
            Siguiente
          </button>


        </div>
        <span className="text-sm">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
