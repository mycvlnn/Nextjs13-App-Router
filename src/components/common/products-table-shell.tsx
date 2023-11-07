"use client";

import { Brand, Category, Product } from "@/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface ProductsTableShellProps {
  categories: Category[];
  brands: Brand[];
  data: Product[];
  pageCount: number;
}

export function ProductsTableShell({
  categories,
  brands,
  data,
  pageCount,
}: ProductsTableShellProps) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSwitchChange = async(isChecked: boolean, productId: string) => {
      setIsLoading(true);
      const session = await getSession();
      try {
        const response = await axios.post(`${URL}/api/products/active/${productId}`, { "active": isChecked }, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session?.accessToken}`,
              }
          });

        if (response.status === 200) {
          toast.success("Cập nhật thành công!");
          window.location.reload();
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
  }

  const activeValue = {
    0: "Ẩn",
    1: "Hiển thị"
  }
  const brandValue: { [key: number]: string } = {};
  const categoryValue: { [key: number]: string } = {};

  brands.forEach((brand) => {
      brandValue[brand.id] = brand.name;
  });
  categories.forEach((category) => {
    categoryValue[category.id] = category.name;
  });

  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="#" className="w-[10px]"/>
        ),
      },
      {
        accessorKey: "image",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hình ảnh" className="w-[50px]"/>
          ),
        cell: ({ row }) => (
          <Avatar>
            <AvatarImage src={row.original.image} className="max-w-full w-12 h-12 object-cover rounded-full"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tên sản phẩm" />
        ),
          cell: ({ row }) => (
            <>
              <div>
                <span className="">{ row.original.name }</span>
              </div>
              SKU: <span className="text-gray-900 font-semibold">{ row.original.sku }</span>
              </>
          )
          },
          {
            accessorKey: "category_id",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Danh mục" />
            ),
          },
          {
            accessorKey: "brand_id",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Thương hiệu" />
            ),
          },
          {
            accessorKey: "quantity",
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Số lượng" />
            ),
          },
      {
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => (
          <Switch
            id={row.original.id.toString()}
            checked={row.original.active}
            disabled={isLoading}
            onCheckedChange={(isChecked)=>handleSwitchChange(isChecked, row.original.id.toString())}
          />
        )
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
                  href={`/admin/products/${row.original.id}`}
                >
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
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
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
      {
          id: "active",
          title: "Trạng thái",
          options: Object.entries(activeValue).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
          })),
       },
        {
        id: "brand_id",
        title: "Thương hiệu",
        options: Object.entries(brandValue).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
        })),
        },
        {
        id: "category_id",
        title: "Danh mục",
        options: Object.entries(categoryValue).map(([value, label]) => ({
            label: `${label.charAt(0).toUpperCase()}${label.slice(1)}`,
            value: value,
        })),
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "sản phẩm",
        },
      ]}
      newRowLink={`/admin/products/new`}
    />
  );
}