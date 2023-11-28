"use client"

import { useEffect, useState } from "react";
import Summary from "../components/summary";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next";
import { Icons } from "@/lib/icons";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL_API;

const formOrder = z.object({
  name: z.string()
    .min(1, "Tên là bắt buộc")
    .min(6, "Tối thiểu 6 ký tự")
    .max(50, "Bạn chỉ có thể nhập tối đa 50 ký tự."),
  phone: z.string()
    .min(1, "Điện thoại là bắt buộc")
    .min(10, "Tối thiểu 10 ký tự")
    .max(15, "Bạn chỉ có thể nhập tối đa 15 ký tự.")
    .regex(/^[0-9]{10,15}$/, "Không đúng định dạng số điện thoại"),
  email: z.string()
    .min(1, "Email là bắt buộc")
    .email("Phải là email")
    .max(60, "Bạn chỉ có thể nhập tối đa 60 ký tự.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Không đúng định dạng email"),
  address: z.string()
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự.").optional(),
  description: z.string()
    .max(191, "Bạn chỉ có thể nhập tối đa 191 ký tự.").optional(),
  cart: z.any(),
});

interface CheckoutCLientProps {
}

export const CheckoutClient: React.FC<CheckoutCLientProps> = ({ }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = getCookie('user');
    const [customerId, setCustomerId] = useState("");
    const cart = useCart();
    const removeAll = useCart((state) => state.removeAll);

    const form = useForm({
        resolver: zodResolver(formOrder),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            description: ""
        },
    });

    const onSubmit = async(data: z.infer<typeof formOrder>) => {
        try {
            setIsLoading(true);
            const carts = cart.items;
            const datas = {
                ...data,
                carts,
                customerId
            }
            const response = await axios.post(`${URL}/api/orders`, datas, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success("Đặt hàng thành công!");
            removeAll();
            window.location.href = "/";
        } catch (error: any) {
            toast.error("Đã xảy ra lỗi");
            
        } finally {
            setIsLoading(false);
        }
   }

    useEffect(() => {
        // const fetchSelect = async () => {
        //     const session = await getSession();
      
        //     try {
        //       const response = await axios.get(`${URL}/api/products/new-product/get-option`, {
        //         headers: {
        //           Authorization: `Bearer ${session?.accessToken}`
        //         }
        //       });
      
        //       if (response.status === 200) {
        //         const data = response.data.data;
        //           setSelects(data);
        //       } else {
        //         setSelects([]);
        //       }
        //     } catch (error) {
        //     }
        // };
        //   fetchSelect();
        if (user) {
            const userParse = JSON.parse(user);
            form.setValue("name", userParse.name);
            form.setValue("email", userParse.email);
            form.setValue("phone", userParse.phone);
            setCustomerId(userParse.id);
        }
    }, [user]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }


    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold">Thông tin liên hệ</h1>
                <p className="text-sm">Vui lòng cung cấp thông tin liên hệ để chúng tôi giao hàng đến cho bạn.</p>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                    <div className="lg:col-span-7">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Họ tên</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập họ tên"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập số điện thoại"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={true}
                                    placeholder="Nhập email"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Địa chỉ nhận hàng</FormLabel>
                                <FormControl>
                                    <Input
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Nhập địa chỉ nhận hàng"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="grid grid-cols-12 gap-x-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-8 col-span-6"
                            disabled={isLoading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2"/> Tiếp tục mua sắm
                        </Button>
                        <Button
                            type="submit"
                            className="w-full mt-8 col-span-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                            <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <ShoppingBag className="h-4 w-4 mr-2"/>   
                            )}
                            Đặt hàng
                        </Button>
                        </div>   
                    </form>
                    </Form>
                    </div>
                    <Summary />
                </div>
            </div>
        </>
    );
}