"use client"

import Gallery from "@/components/client/gallery";
import Info from "@/components/client/info/product-detail";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [options, setOptions] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/${params.slug}/findWithProperty`);

                if (response.status === 200) {
                    const data = response.data;
                    setProduct(data.data);
                    setOptions(data.options);
                } else {
                    setProduct(null);
                    setOptions([]);
                }
            } catch (error) {
            }
        };

        fetchBanners();
    }, [params]);

    return (
        <>
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product?.galleries} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info data={product} options={options} />
            </div>
            </div>
            <Separator className="my-4"/>
            {/* <ProductList title="Related Items" items={suggestedProducts} /> */}
        </>
    );
}