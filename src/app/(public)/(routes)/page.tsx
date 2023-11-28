"use client"

import Carousel from "@/components/client/carousel";
import { ProductGrid, ProductSkeletonGrid } from "@/components/client/product-grid";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Banner } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

interface HomePageProps {
};

const URL = process.env.NEXT_PUBLIC_URL_API;

const HomePage: React.FC<HomePageProps> = async ({ }) => {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [productTrendings, setProductTrendings] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${URL}/api/banners/get-all/store`);

                if (response.status === 200) {
                    const data = response.data;
                    setBanners(data.data);
                } else {
                    setBanners([]);
                }
            } catch (error) {
            }
        };
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/all-product`);

                if (response.status === 200) {
                    const data = response.data;
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
            }
        };
        const fetchProductTrendings = async () => {
            try {
                const response = await axios.get(`${URL}/api/products/public-store/product-trending`);
                if (response.status === 200) {
                    const data = response.data;
                    setProductTrendings(data.data);
                } else {
                    setProductTrendings([]);
                }
            } catch (error) {
            }
        };

        fetchProducts();
        fetchProductTrendings();
        fetchBanners();
    }, []);

    return (
        <>
            <div className="container">
                <div className="my-8">
                    <Carousel images={banners.map((obj: Banner) => obj.image.path)} />
                    <Separator className="mt-4 mb-8"/>
                    <Separator className="mt-4 mb-8"/>
                    <Heading
                        title="Sản phẩm nổi bật"
                        description="Dưới đây là danh sách các sản phẩm nổi bật chúng tôi đề xuất cho bạn."
                    />
                    <div className="my-4">
                     {productTrendings.length > 0 ? (
                        <ProductGrid products={productTrendings} />
                    ) : (
                        <ProductSkeletonGrid />
                    )}
                    </div>
                    <Heading
                        title="Sản phẩm mới nhất"
                        description="Dưới đây là danh sách các sản phẩm chúng tôi có sẵn cho bạn."
                    />
                    <div className="my-4">
                     {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <ProductSkeletonGrid />
                    )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;