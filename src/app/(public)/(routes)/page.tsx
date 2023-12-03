"use client"

import Carousel from "@/components/client/carousel";
import { ProductGrid, ProductSkeletonGrid } from "@/components/client/product-grid";
import { Heading } from "@/components/ui/heading-home";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";

interface HomePageProps {
};

const URL = process.env.NEXT_PUBLIC_URL_API;

async function getBanners() {
    const response = await axios.get(`${URL}/api/banners/get-all/store`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.data.data;
}

async function getProducts() {
    const response = await axios.get(`${URL}/api/products/public-store/all-product`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.data.data;
}

async function getProductTrendings() {
    const response = await axios.get(`${URL}/api/products/public-store/product-trending`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.data.data;
}

const HomePage: React.FC<HomePageProps> = () => {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [productTrendings, setProductTrendings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const [bannersData, productsData, trendingsData] = await Promise.all([
                getBanners(),
                getProducts(),
                getProductTrendings()
            ]);
    
            setBanners(bannersData);
            setProducts(productsData);
            setProductTrendings(trendingsData);
            } catch (error) {
            console.error("Error fetching data: ", error);
            }};

        fetchData();
    }, []);

    return (
        <>
            <div className="container">
                <div className="my-8">
                    {
                        (banners && banners.length > 0) && (
                            <Carousel images={banners.map((obj:any) => obj.image.path)}/>
                        )
                    }
                    <Separator className="mt-4 mb-8"/>
                    <Heading
                        title="Sản phẩm nổi bật"
                        description="Dưới đây là danh sách các sản phẩm nổi bật chúng tôi đề xuất cho bạn."
                    />
                    <div className="my-4">
                    {productTrendings.length > 0 ? (
                        <ProductGrid products={productTrendings}/>
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