"use client"

import { ProductsTableShell } from "@/components/common/products-table-shell";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProductClientProps {
    params: {
        sort_key: any,
        order_by: any,
        brand_id: any,
        category_id: any,
        per_page: number,
        page: any,
        keywords: any,
        active: any
    }
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ params }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const session = await getSession();
            try {
                const response = await axios.get(`${URL}/api/products`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                });

                if (response.status === 200) {
                    const data = response.data;
                    setProducts(data.data);
                    setTotal(data.meta.total);
                } else {
                    setProducts([]);
                    setTotal(0);
                }
            } catch (error) {
            }
        };
        const fetchBrand = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-brand`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                  setBrands(data);
                  console.log(data);
              } else {
                setBrands([]);
              }
            } catch (error) {
            }
            };
        const fetchCategory = async () => {
            const session = await getSession();
      
            try {
              const response = await axios.get(`${URL}/api/products/new-product/get-category`, {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`
                }
              });
      
              if (response.status === 200) {
                const data = response.data.data;
                setCategories(data);
                console.log(data);
              } else {
                setCategories([]);
              }
            } catch (error) {
            }
          };
      
          fetchBrand();
          fetchCategory();

        fetchProducts();
    }, [params]);

    const pageCount = Math.ceil(total / params.per_page);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Danh sách sản phẩm"
                    description="Quản lý sản phẩm"
                />
            </div>
            <Separator />
            <ProductsTableShell
                categories={categories}
                brands={brands}
                data={products}
                pageCount={pageCount}
            />
        </>
    );
}