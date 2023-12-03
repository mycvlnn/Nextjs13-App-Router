"use client"

import { RolesTableShell } from "@/components/common/roles-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface RoleClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const RoleClient: React.FC<RoleClientProps> = ({ params }) => {
    const [roles, setRoles] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchRoles = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/roles`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setRoles(data.data);
                    setTotal(data.meta.total);
                } else {
                    setRoles([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchRoles();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách vai trò"
                    description="Quản lý vai trò"
                />
            </div>
            <Separator />
            <RolesTableShell
                data={roles}
                pageCount={pageCount}
            />
        </>
    );
}