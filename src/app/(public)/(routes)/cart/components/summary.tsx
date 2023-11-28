"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Currency from "@/components/client/currency";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import CartItem from "./cart-item";

const URL = process.env.NEXT_PUBLIC_URL_API;

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const router = useRouter();
  const pathname = usePathname();
  const removeAll = useCart((state) => state.removeAll);
  const cart = useCart();

  useEffect(() => {

  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price*item.quantity)
  }, 0);

  const totalItem = items.reduce((total, item) => {
    return total + Number(item.quantity)
  }, 0);

  const onCheckout = async () => {
    router.push('/cart/checkout');
    // const response = await axios.post(`${URL}/checkout`, {
    //   productIds: items.map((item) => item.id)
    // });

    // window.location = response.data.url;
  }

  return ( 
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium">
        Chi tiết đơn hàng
      </h2>
      {
        pathname.includes('checkout') && (
          <>
            {cart.items.length === 0 && <p className="">Không có sản phẩm nào trong giỏ hàng.</p>}
            <ul>
                { cart.items.map((item, index) => (
                  <CartItem key={index} data={item} />
                ))}
            </ul>
          </>
        )
      }
      <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <div className="text-base font-medium">Số lượng sản phẩm</div>
          {totalItem}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-medium">Tổng tiền</div>
         <Currency value={totalPrice}/>
        </div>
      </div>
      {
        !pathname.includes('checkout') && (
          <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
            Thanh toán
          </Button>
        )
      }
    </div>
  );
}
 
export default Summary;