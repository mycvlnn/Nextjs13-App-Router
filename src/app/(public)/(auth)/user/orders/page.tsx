"use client"

import Currency from "@/components/client/currency";
import { clientSignIn } from "@/components/server/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { Fingerprint, Heart, LayoutList, Trash2, UserCog2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formLogin = z.object({
  name: z.string()
    .min(1, "Tên là bắt buộc")
    .min(6, "Tối thiểu 6 ký tự")
        .max(50, "Bạn chỉ có thể nhập tối đa 50 ký tự."),
  address: z.any(),
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
  password: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự"),
  password_confirm: z.string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu là 8 ký tự")
    .max(20, "Bạn chỉ có thể nhập tối đa 20 ký tự"),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [errorEmail, setErrorEmail] = useState('');
  
  useEffect(() => {
    const checkLogin = async () => {
    const user = await getCookie('user');
      if (!user) {
        window.location.href = '/user/login';
      }
    }
    checkLogin();
  });

  const form = useForm({
    resolver: zodResolver(formLogin),
    defaultValues: {
        name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        password_confirm: "",
    },
  });
    
   useEffect(() => {
    const user = getCookie('user');
    if (user) {
        const userParse = JSON.parse(user);
        form.setValue("name", userParse.name);
        form.setValue("email", userParse.email);
        form.setValue("phone", userParse.phone);
    }
  }, []);

   const onSubmit = async (data: z.infer<typeof formLogin>) => {
    try {
      setIsLoading(true);
      const res = await clientSignIn(data) || "";
      if(res==""){
        toast.success("Đăng nhập thành công");
        window.location.href = '/';
      }

      if (res && res?.response.data.statusCode == 400 && res?.response.data.message) {
        setErrorEmail(res?.response.data.message);
        return;
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <>
        <div className="flex flex-col items-center justify-center py-12">   
            <Card>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="space-y-1 w-[800px] h-auto">
                    <div className="grid grid-cols-12">
                      <div className="col-span-6">
                        <CardTitle className="text-2xl">Lịch sử đặt hàng</CardTitle>
                        <CardDescription>
                            Danh sách đơn đặt hàng gần đây
                        </CardDescription>
                      </div>
                  <div className="col-span-6 flex justify-end align-middle">
                        <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                              <Button variant="default" size="icon" className="ml-2" type="button" onClick={()=>(router.push('/user/orders'))}>
                                <LayoutList className="w-4 h-4"/>
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                              <p>Đơn đặt hàng</p>
                              </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/wishlist'))}>
                                    <Heart className="w-4 h-4"/>
                                  </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                  <p>Wishlist</p>
                                  </TooltipContent>
                              </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                              <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/profile'))}>
                                <UserCog2 className="w-4 h-4"/>
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                              <p>Thông tin cá nhân</p>
                              </TooltipContent>
                          </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button variant="outline" size="icon"className="ml-2" type="button" onClick={()=>(router.push('/user/changepassword'))}>
                                <Fingerprint className="w-4 h-4"/>
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Đổi mật khẩu</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="destructive" size="icon"className="ml-2">
                                      <Trash2 className="w-4 h-4"/>
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Yêu cầu xóa tài khoản</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                      </div>
                    </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {/* <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="w-[50px]">#</TableHead>
                                  <TableHead className="w-[100px]">Hình ảnh</TableHead>
                                  <TableHead className="w-[250px]">Tên sản phẩm</TableHead>
                                  <TableHead className="">Mẫu mã</TableHead>
                                  <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                                  <TableHead className="w-[100px] text-right">Số lượng</TableHead>
                                  <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {initialData?.children_orders.map((child: any, index) => (
                                  <TableRow key={index}>
                                      <TableCell className="font-medium">{ index + 1 }</TableCell>
                                      <TableCell className="text-center">
                                          <img className="w-12 h-12 object-cover" src={`${child?.product.image.path}`}/>
                                      </TableCell>
                                      <TableCell className="text-left">
                                          {child.product.name}
                                      </TableCell>
                                      <TableCell className="text-left">
                                          {
                                              child.sku && (
                                                  child.sku.property_options.map((option: any) => (
                                                      <>
                                                          <span key={child.name}>
                                                              {option.name}
                                                          </span><br/>
                                                      </>
                                                  ))
                                              )
                                          }
                                      </TableCell>
                                      <TableCell className="text-right">
                                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(child.price)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                          {child.quantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                          <Currency value={child.quantity * child.price}/>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                        </Table> */}
                      </CardContent>
                      <CardFooter>
                    </CardFooter>
                </form>
                </Form>
            </Card>
        </div>
    </>
  );
}