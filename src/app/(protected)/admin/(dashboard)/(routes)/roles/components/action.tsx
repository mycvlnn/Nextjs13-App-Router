"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { RoleColumn } from "./client";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface ActionProps {
    data: RoleColumn,
}

export const Action: React.FC<ActionProps> = ({
    data
}) => {

    const router = useRouter();
    const [open, setOpen] = useState(false);  
    const [loading, setLoading] = useState(false);
    
    const onCopy = (id: number) => {
        navigator.clipboard.writeText(id.toString());
        toast.success("Sao chép thành công");
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/roles/${data.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                toast.success("Xóa thành công");
            }
            window.location.reload();
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={ onDelete }
                loading={loading} />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-4 h-4 p-0">
                    <span className="sr-only">
                        Hành động
                    </span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Hành động
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Sao chép id
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>window.location.href=(`/admin/roles/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Cập nhật
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Xóa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
};