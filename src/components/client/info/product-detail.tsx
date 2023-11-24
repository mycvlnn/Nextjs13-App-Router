"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface InfoProps {
  data: Product | null,
  options: any
};

const Info: React.FC<InfoProps> = ({ data, options }) => {
  const cart = useCart();
  const price = data?.many_version ? data?.skus[0].price : data?.price || 0;

  const onAddToCart = () => {
    cart.addItem(data);
  }

  return ( 
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        {
          Object.keys(options).map((key: string) => (
            <div key={key} className="flex items-center gap-x-4">
              <h3 className="font-semibold text-black">{key}:</h3>
              <div>
                {options[key].map((opt: any) => (
                  <Button key={opt.id} variant="outline" className="mr-2">
                    {opt.name}
                  </Button>
                ))}
              </div>
            </div>
          ))
        }
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Thêm vào giỏ hàng
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
}
 
export default Info;