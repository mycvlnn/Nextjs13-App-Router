"use client";

import { Order } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Switch } from "../ui/switch";
import { getSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface OrdersTableShellProps {
  data: Order[];
  pageCount: number;
}

export function OrdersTableShell({
  data,
  pageCount,
}: OrdersTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);  
  const [category, setCategory] = React.useState("");  

  // const handleSwitchChange = async(isChecked: boolean, categoryId: string) => {
  //     setIsLoading(true);
  //     const session = await getSession();
  //     try {
  //       const response = await axios.post(`${URL}/api/orders/active/${categoryId}`, { "active": isChecked }, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 Authorization: `Bearer ${session?.accessToken}`,
  //             }
  //         });

  //       if (response.status === 200) {
  //         toast.success("Cập nhật thành công!");
  //         window.location.reload();
  //       }
  //     } catch (error) {
  //     } finally {
  //       setIsLoading(false);
  //     }
  // }

  const activeValue = {
    0: "Đang đợi xác nhận",
    1: "Đã giao cho đơn vị vận chuyển",
    2: "Đang giao hàng",
    3: "Đã giao hàng",
    "-1": "Hủy đơn",
  }

  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" className="w-[10px]"/>
        ),
      },
      {
        accessorKey: "customer_id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Người đặt"  className="w-[150px]"/>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ngày đặt hàng"  className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Mô tả"  className="w-[350px]"/>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Mở menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/orders/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setOpen(true)
                setCategory(row.original.id.toString())
              }}
              >
                Xóa
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending],
  );

  return (
    <>
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
      {
          id: "status",
          title: "Trạng thái đơn hàng",
          options: Object.entries(activeValue).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "customer_id",
          title: "đơn hàng",
        },
      ]}
      newRowLink={""}
    />
    </>
  );
}