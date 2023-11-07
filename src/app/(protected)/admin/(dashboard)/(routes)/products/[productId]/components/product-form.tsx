"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    UncontrolledFormMessage
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brand, Category, Product } from "@/types";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileWithPreview } from "@/types/types";
import { Zoom } from "@/lib/zoom-image";
import Image from "next/image";
import { FileDialog } from "@/components/ui/file-dialog";
import { isArrayOfFile } from "@/lib/utils";

const URL = process.env.NEXT_PUBLIC_URL_API;

interface ProductFormProps {
    initialData: Product | null;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Tên sản phẩm là bắt buộc.",
    }).max(191, {
        message: "Tối đa 191 ký tự.",
    }),
    category_id: z.string().min(1, {
        message: "Vui lòng chọn danh mục sản phẩm.",
    }),
    brand_id: z.string().min(1, {
        message: "Vui lòng chọn thương hiệu sản phẩm",
    }),
    sku: z.string().min(1, {
        message: "SKU sản phẩm là bắt buộc.",
    }).max(191, {
        message: "Tối đa 191 ký tự.",
    }),
    quantity: z.string().min(1, {
        message: "Số lượng sản phẩm tối thiểu là 1.",
    }).max(100000, {
        message: "Số lượng sản phẩm tối đa là 100.000.",
    }),
    price: z.string().min(1, {
        message: "Đơn giá sản phẩm tối thiểu là 1 đồng.",
    }).max(100000000, {
        message: "Đơn giá sản phẩm tối đa là 100.000.000 đồng.",
    }),
    images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Phải là một mảng Tệp")
    .optional()
    .nullable()
    .default(null),
    active:z.boolean().default(false).optional(),
    trending:z.boolean().default(false).optional(),
    many_version:z.boolean().default(false).optional(),
    description: z.any(),
});

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
    const [galleries, setGalleries] = React.useState<FileWithPreview[] | null>(null);
    const { isUploading, startUpload } = useUploadThing("productImage");
    
    const title        = "Quản lý sản phẩm";
    const description  = initialData ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm";
    const toastMessage = initialData ? "Cập nhật thành công" : "Thêm mới thành công";
    const action = initialData ? "Cập nhật" : "Thêm mới";

    const defaultValues = {
        name: '',
        sku: '',
        quantity: '',
        brand_id: '',
        category_id: '',
        price: '',
        images: [],
        description: '',
        active: false, 
        many_version: false, 
        trending: false, 
    }
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    useEffect(() => {
        if (initialData?.image) {
            const imageURL = initialData?.image.path;
            const fileName = imageURL.match(/[^/]+$/)?.[0];
            if (fileName) {
              const file = new File([], fileName, {
                type: 'image',
              });
    
              const fileWithPreview = Object.assign(file, {
                preview: imageURL,
              });
    
              setFiles([fileWithPreview]);
            }
        }
      }, [initialData?.image]);

    useEffect(() => {
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
        if (initialData) {
            form.setValue("name", initialData?.name);
            form.setValue("sku", initialData?.sku);
            form.setValue("brand_id", initialData?.brand_id.toString());
            form.setValue("category_id", initialData?.category_id.toString());
            form.setValue("quantity", (initialData?.quantity - initialData?.sold_quantity).toString());
            form.setValue("price", (initialData?.price).toString());
            form.setValue("description", initialData?.description);
            form.setValue("active", initialData?.active);
            form.setValue("many_version", initialData?.many_version);
            form.setValue("trending", initialData?.trending);
        }
    }, [initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const session = await getSession();
            const images = isArrayOfFile(data.images)
            ? await startUpload(data.images).then((res) => {
                const formattedImages = res?.map((image) => ({
                  id: image.key,
                  name: image.key.split("_")[1] ?? image.key,
                  url: image.url,
                }));
                return formattedImages ?? null;
              })
                : null;
            
            const datas = {
                ...data,
                images
            };

            if (initialData) {
                const response = await axios.put(`${URL}/api/products/${params.productId}`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                }
            } else {
                const response = await axios.post(`${URL}/api/products`, datas, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                  }); 
                if (response.status === 200) {
                    router.push('/admin/products');
                    toast.success(toastMessage);
                } else if (response.status = 422) {
                    
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const session = await getSession();
            const response = await axios.delete(`${URL}/api/products/${initialData?.id}`,{
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
              })
            if (response.status === 200) {
                router.push('/admin/products');
                toast.success("Xóa thành công");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={ onDelete }
                loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />
                {initialData && (
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}>
                            <Trash className="h-4 w-4" />
                        </Button> 
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Xóa sản phẩm</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên sản phẩm</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="Tên sản phẩm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="SKU"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="brand_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thương hiệu</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn thương hiệu"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {brands.map((brand: Brand) => (
                                            <SelectItem key={brand.id} value={brand.id.toString()}>
                                            {brand.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Chọn danh mục"
                                            />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {categories.map((category: Category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="many_version"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                    <Checkbox
                                        disabled={loading}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Có nhiều phiên bản
                                        </FormLabel>
                                        <FormDescription>
                                        Khi chọn điều này, sản phẩm sẽ có thể tạo được nhiều thuộc tính (đang bảo trì).
                                        </FormDescription>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số lượng</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            disabled={loading}
                                            placeholder="Số lượng"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Đơn giá</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            disabled={loading}
                                            placeholder="Đơn giá"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormItem className="w-full flex flex-col gap-1.5">
                        <FormLabel>Hình ảnh</FormLabel>
                        {files?.length ? (
                            <div className="flex items-center gap-2">
                            {files.map((file, i) => (
                                <Zoom key={i}>
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                                    width={80}
                                    height={80}
                                />
                                </Zoom>
                            ))}
                            </div>
                        ) : null}
                        <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name="images"
                            maxFiles={1}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={loading}
                        />
                        </FormControl>
                        <UncontrolledFormMessage
                            message={form.formState.errors.images?.message}
                        />
                    </FormItem>
                    <div className="grid grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Hiển thị
                                </FormLabel>
                                <FormDescription>
                                Sản phẩm sẽ hiển thị ở trang chủ.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="trending"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Nổi bật
                                </FormLabel>
                                <FormDescription>
                                Sản phẩm được đưa vào trang nổi bật.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Button disabled={loading} variant="outline" onClick={()=>router.push('/admin/products')} className="ml-auto mr-2" type="button">
                            Hủy
                        </Button>
                        <Button disabled={loading} type="submit">
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default ProductForm;