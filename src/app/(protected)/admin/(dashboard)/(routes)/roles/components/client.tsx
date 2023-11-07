"use client";

import { DataTableColumnHeader } from "@/components/common";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import axios from "axios";
import { Plus } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Action } from "./action";
  
import { DataTablePagination } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import fetchClient from "@/lib/fetch-client";

const URL = process.env.NEXT_PUBLIC_URL_API;

export type RoleColumn = {
    id: number
    name: string
  }
  
export const columns: ColumnDef<RoleColumn>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên quyền" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Action data={row.original} />
  },
];

export const UserClient = () => {
    const router = useRouter();
    const [roles, setRoles] = useState([]);
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] =
     useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
      []
    )
    const [sorting, setSorting] = useState<SortingState>([])
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const data: RoleColumn[] = roles.length > 0
    ? roles.map((item: any) => ({
        id: item.id,
        name: item.name
        }))
        : [];
    
    const table = useReactTable({
        data,
        columns,
        state: {
          sorting,
          columnVisibility,
          rowSelection,
          columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      try {
        const session = await getSession();
        if (searchInputRef.current) {
          const inputValue = (searchInputRef.current as HTMLInputElement).value;
          const param = `?name=${inputValue}`;
          const response = await axios.get(`${URL}/api/roles${param?param:''}`, {
              headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              },
          });
    
          if (response.status === 200) {
            const data = response.data;
            setRoles(data.data); 
          } else {
            setRoles([]);
          }
        }
      } catch (error) {
          console.log(error);
      }
    };


const fetchRoles = async () => {
    try {
      const response = await fetchClient({
        method: "get",
        url: `${URL}/api/roles`,
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
      fetchRoles();
  }, [roles]);

    return (
          <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách vai trò"
                    description="Quản lý vai trò"
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="default" size="default" onClick={()=>window.location.href=('/admin/roles/new')}>
                                <Plus className="w-4 h-4" /> Thêm mới
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Thêm mới</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Separator />
            <div className="space-y-4">
            <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                ref={searchInputRef}
                placeholder="Nhập tên quyền..."
                className="h-10 w-[150px] lg:w-[250px]"
              />
              <Button variant="default" size="icon" onClick={(e) => handleSearch}>
                <Search className="w-4 h-4 p-0" />
              </Button>
            </div>
          </div>
            <div className="my-2">
            <DataTablePagination table={table} />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                          Không tìm thấy kết quả nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <DataTablePagination table={table} />
          </div>
        </>
    )
}