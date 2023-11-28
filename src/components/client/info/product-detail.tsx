"use client";

import { Heart, Minus, Plus, ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { RadioGroup } from "@headlessui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface InfoProps {
  data: Product | null,
  options: any,
  newData: any
};

const Info: React.FC<InfoProps> = ({ data, options, newData }) => {
  const cart = useCart();
  const price = data?.many_version ? data?.skus[0].price : data?.price || 0;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isTrustAdd, setIsTrustAdd] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const loadAddCart = () => {
    if (!data?.many_version) {
      setIsTrustAdd(false);
      return;
    }
  
    if (Object.keys(options).length > 0) {
      let count = 0;
      for (const [key, value] of searchParams.entries()) {
        count++;
      }
  
      if (Object.keys(options).length == count) {
        setIsTrustAdd(false);
        return;
      }
  
      setIsTrustAdd(true);
    }
  };
  
  const handleOptionSelect = (optionType: string, value: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionType]: value,
    }));
    loadAddCart();
  };
  
  useEffect(() => {
    loadAddCart();
  }, [options, searchParams, setIsTrustAdd]);
  

  useEffect(() => {
    const queryString = createQueryString(selectedOptions);
  
    router.push(`${pathname}?${queryString}`, {
      scroll: false,
    });
  }, [selectedOptions]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const onAddToCart = () => {
    const convertData = {
      id: data?.id || "",
      image: data?.image.path || "",
      name: data?.name || "",
      price: (newData && Array.isArray(newData) && newData.length > 0 && newData[0].price !== undefined) ? newData[0].price : price || "",
      quantity: quantity,
      sku_id: newData && newData[0].id || null,
      property_options: newData && newData[0].property_options || null,
    }
    cart.addItem(convertData);
  }

  return ( 
    <div>
      <h1 className="text-3xl font-bold">{data?.name}</h1>
      <div className="flex pt-2 align-middle text-sm">SKU: <p className="ml-2 text-sm font-semibold">{data?.sku}</p></div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            (newData && Array.isArray(newData) && newData.length > 0 && newData[0].price !== undefined) ? newData[0].price : price
          )}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
      {data?.many_version && (
          Object.keys(options).map((key: string, index: number) => (
            <div key={index} className="flex items-center gap-x-4">
              <h3 className="font-semibold">{key}:</h3>
              <div>
                <RadioGroup
                  value={selectedOptions[key]}
                  onChange={(value) => handleOptionSelect(key, value)}
                  className="flex"
                >
                  {options[key].map((opt: any, index: number) => (
                    <RadioGroup.Option
                      key={index}
                      value={opt.id}
                      className={({ checked }) =>
                        `${checked ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white'}
                          relative flex cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none mr-2`
                      }
                    >
                      {({ checked }) => (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                              >
                                {opt.name}
                              </RadioGroup.Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          size="icon"
          onClick={decreaseQuantity}
        >
          <Minus className="w-4 h-4"/>
        </Button>
        <Input
          className="w-[60px]"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <Button
          size="icon"
          onClick={increaseQuantity}
        >
          <Plus className="w-4 h-4"/>
        </Button>
        <Button
          disabled={isTrustAdd}
          onClick={onAddToCart}
          className="flex items-center gap-x-2">
          <ShoppingBasket className="w-4 h-4" />
          Thêm vào giỏ hàng
        </Button>
        <Button className="flex items-center gap-x-2" variant="outline">
          <Heart className="w-4 h-4 text-red-400" />
          Thêm vào wishlist
        </Button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: data?.description !== undefined ? data.description : '' }} className="my-8 text-justify"/>
    </div>
  );
}
 
export default Info;