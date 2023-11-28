"use client"

import ProductCard from "@/components/client/info/card";
import NoResults from "@/components/client/info/no-results";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ }) => {
    const [products, setProducts] = useState([]);
    const params = useParams();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/categories/public-store/${params.slug}`);

                if (response.status === 200) {
                    const data = response.data;
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
            }
        };

        fetchProducts();
    }, [params]);

    return (
        <>
            <h2 className="text-3xl font-bold">Danh sách sản phẩm tìm thấy</h2>
            <h3 className="text-md py-2 pb-8">Có { products.length } sản phẩm được tìm thấy.</h3>
            <div className="px-4 sm:px-6 lg:px-8 pb-24">
                <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                    {/* <div className="hidden lg:block">
                    <Filter
                        valueKey="sizeId" 
                        name="Sizes" 
                        data={sizes}
                    />
                    </div> */}
                        <div className="mt-6 lg:col-span-4 lg:mt-0">
                        {products.length === 0 && <NoResults />}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {products.map((item, index) => (
                                <ProductCard key={index} data={item} />
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}