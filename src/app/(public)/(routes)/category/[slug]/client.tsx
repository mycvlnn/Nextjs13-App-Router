"use client"

import ProductCard from "@/components/client/info/card";
import NoResults from "@/components/client/info/no-results";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Property } from "@/types";
import axios from "axios";
import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ, FilterIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Filter from "./components/filters";
  
interface ProductClientProps {
}

const URL = process.env.NEXT_PUBLIC_URL_API;

export const ProductClient: React.FC<ProductClientProps> = ({ }) => {
    const [products, setProducts] = useState([]);
    const [options, setOptions] = useState([]);
    const [brands, setBrands] = useState([]);
    const params = useParams();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/${params.slug}/categories`);

                if (response.status === 200) {
                    const data = response.data;
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
            }
        };
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/new-product/get-option`);

                if (response.status === 200) {
                    const data = response.data;
                    setOptions(data.data);
                } else {
                    setOptions([]);
                }
            } catch (error) {
            }
        };
        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/new-product/get-brand`);

                if (response.status === 200) {
                    const data = response.data;
                    setBrands(data.data);
                } else {
                    setBrands([]);
                }
            } catch (error) {
            }
        };

        fetchOptions();
        fetchBrands();
        fetchProducts();
    }, [params]);

    return (
        <>
            <h2 className="text-3xl font-bold">Danh sách sản phẩm tìm thấy</h2>
            <div className="flex justify-between items-center pb-4 pt-2">
                <h3 className="text-md">Có {products.length} sản phẩm được tìm thấy.</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                                    <FilterIcon className="w-4 h-4"/>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Sắp xếp theo</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Tên từ A-Z
                        <DropdownMenuShortcut><ArrowDownAZ className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Tên từ Z-A
                        <DropdownMenuShortcut><ArrowUpAZ className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Giá tiền từ thấp đến cao
                        <DropdownMenuShortcut><ArrowDown01 className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Giá tiền từ cao đến thấp
                        <DropdownMenuShortcut><ArrowUp01 className="w-4 h-4"/></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator className="mb-8"/>
            <div className="pb-24">
                <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                    <div className="hidden lg:block">
                        {brands && (
                            <Filter
                                valueKey="brand_id"
                                name="Thương hiệu"
                                data={brands}
                            />
                        )}
                        {options && (
                            options.map((option:Property) => (
                                <Filter
                                    valueKey={option.name} 
                                    name={option.name} 
                                    data={option.property_options}
                                />
                            ))
                        )}
                    </div>
                    <div className="mt-6 lg:col-span-4 lg:mt-0">
                    {products.length === 0 && <NoResults />}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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