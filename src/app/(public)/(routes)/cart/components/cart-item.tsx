"use client";

import { X } from "lucide-react";
import Image from "next/image";

import Currency from "@/components/client/currency";
import useCart from "@/hooks/use-cart";
import { Cart } from "@/types";
import IconButton from "../../../../../components/client/icon-button";

interface CartItemProps {
  data: Cart;
}

const CartItem: React.FC<CartItemProps> = ({
  data
}) => {
  const cart = useCart();

  const onRemove = () => {
    if (data.sku_id) {
      cart.removeItem(data.id, data.sku_id);
    } else {
      cart.removeItem(data.id, -1);
    }
  };

  return ( 
    cart && (
      <li className="flex py-6 border-b">
        <div className="relative h-16 w-16 rounded-md overflow-hidden sm:h-24 sm:w-24">
          <Image
            fill
            src={data.image}
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 top-0">
            <IconButton onClick={onRemove} icon={<X size={15} />} />
          </div>
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:pr-0">
            <div className="flex justify-between">
              <p className=" text-lg font-semibold">
                {data.name}
              </p>
            </div>
            <div className="text-sm mt-1">
            {data.sku_id && (
                  data.property_options.map((option: any, index) => (
                    <p key={index} className="pl-4">{ option.name }</p>
                  ))
                )
              }
            </div>
            <div>
              {cart.items.length>0 && (
                <>
                  <span className="text-sm font-medium">Số lượng: {data.quantity}</span>
                </>
              )}
              <Currency value={data.price}/>
            </div>
          </div>
        </div>
      </li>
    )
  );
}
 
export default CartItem;