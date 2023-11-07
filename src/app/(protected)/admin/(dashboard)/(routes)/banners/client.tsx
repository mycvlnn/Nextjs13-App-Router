"use client"

import { BannersTableShell } from "@/components/common/banners-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface BannerClientProps {
    params: {
        sort_key: any,
        order_by: any,
        per_page: number,
        page: any,
        keywords: any,
        active: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const BannerClient: React.FC<BannerClientProps> = ({ params }) => {
    const [banners, setBanners] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/banners`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setBanners(data.data);
                    setTotal(data.meta.total);
                } else {
                    setBanners([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };

        fetchBanners();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách banner"
                    description="Quản lý banner"
                />
            </div>
            <Separator />
            <BannersTableShell
                data={banners}
                pageCount={pageCount}
            />
        </>
    );
}