"use client";

import { Order } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { Copy, FileDown, PenSquareIcon } from "lucide-react";
import toast from "react-hot-toast";

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

  const activeValue = {
    0: "Đang đợi xác nhận",
    1: "Đã giao cho đơn vị vận chuyển",
    2: "Đang giao hàng",
    3: "Đã giao hàng",
    "-1": "Hủy đơn",
  }

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code.toString());
    toast.success("Sao chép thành công");
  };

  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mã đơn hàng" className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "customer_id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Người đặt"  className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ngày đặt hàng"  className="w-[100px]"/>
        ),
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tổng tiền"  className="w-[100px]"/>
        ),
        cell: ({ row }) => (
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.total)
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
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/orders/${row.original.id}`}
                >
                  <PenSquareIcon className="w-4 h-4 mr-2"/> Cập nhật đơn hàng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={()=>onCopy(row.original.code)}>
                  <Copy className="w-4 h-4 mr-2"/> Sao chép mã đơn hàng
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`${URL}/storage/${row.original.filename}`}
                  target="_blank"
                  download
                >
                  <FileDown className="w-4 h-4 mr-2"/>Tải xuống hóa đơn
                </Link>
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
          id: "code",
          title: "đơn hàng",
        },
      ]}
      newRowLink={""}
    />
    </>
  );
}