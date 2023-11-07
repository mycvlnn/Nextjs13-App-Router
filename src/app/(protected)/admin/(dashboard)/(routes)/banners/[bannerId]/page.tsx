"use client";

import { Banner } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BannerForm from "./components/banner-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const BannerPage = ({
  params
}: {
  params: { bannerId: string }
}) => {
  const [banner, setBanner] = useState<Banner | null>(null);

  if (params.bannerId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/banners/${params.bannerId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            setBanner(data.data);
          } else {
            setBanner(null);
          }
        } catch (error) {
        }
      };
  
      fetchRole();
    }, [params]);
  }

  return ( 
    <div className="flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <BannerForm initialData={banner} />
      </div>
    </div>
  );
}

export default BannerPage;