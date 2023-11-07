"use client"

import Carousel from "@/components/client/carousel";
import { Banner } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

interface HomePageProps {
};

const URL = process.env.NEXT_PUBLIC_URL_API;

const HomePage: React.FC<HomePageProps> = async ({ }) => {
    const [banners, setBanners] = useState([]);

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

        fetchBanners();
    }, []);

    return (
        <>
            <div className="container">
                <div className="my-8">
                    <Carousel images={banners.map((obj: Banner) => obj.image.path)}/>
                </div>
            </div>
        </>
    );
};

export default HomePage;