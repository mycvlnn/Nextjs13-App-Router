"use client";

import { ErrorCard } from "@/components/card/error-card";
import { Shell } from "@/components/wrapper/shell-variant";
import { useRouter } from "next/navigation";

interface BrandNotFoundProps {
}


export default function NotFound({}) {
    const router = useRouter();

    return (
        // <div className="flex flex-col items-center justify-center h-screen">
        //     <h1 className="text-8xl font-bold text-red-500">404</h1>
        //     <h2 className="text-4xl font-semibold">Page Not Found</h2>
        //     <h3 className="my-4 text-lg">Đường dẫn bạn đang đến có thể không tồn tại</h3>
        //     <div className="flex items-center justify-center">
        //         <Button variant="outline" className="mr-4"  onClick={() => router.back()} ><ChevronLeft className="w-4 h-4 mr-2" onClick={() => router.push('/admin/dashboards', { scroll: false })} />Trở lại</Button>
        //         <Button><Rocket className="w-4 h-4 mr-2"/>Đến vũ trụ</Button>
        //     </div>
        // </div>

    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Không tìm thấy trang này"
        description="Trang bạn đang tìm kiếm có thể đã hết hạn hoặc bạn có thể đã được cập nhật rồi."
        retryLink={`/admin/dashboards`}
        retryLinkText="Đến trang chủ"
      />
    </Shell>
    );
  }