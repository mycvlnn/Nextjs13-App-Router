"use client"

import { Role } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
  },
]
