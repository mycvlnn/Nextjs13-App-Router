"use client";

import { Order } from "@/types";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderForm from "./components/order-form";

const URL = process.env.NEXT_PUBLIC_URL_API;

const OrderPage = ({
  params
}: {
  params: { orderId: string }
}) => {
  const [order, setOrder] = useState<Order | null>(null);

  if (params.orderId !== 'new') {
    useEffect(() => {
      const fetchRole = async () => {
        const session = await getSession();
  
        try {
          const response = await axios.get(`${URL}/api/orders/${params.orderId}`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`
            }
          });
  
          if (response.status === 200) {
            const data = response.data;
            setOrder(data.data);
          } else {
            setOrder(null);
          }
        } catch (error) {
        }
      };
  
      fetchRole();
    }, [params]);
  }

  return ( 
    <div className="flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={order} />
      </div>
    </div>
  );
}

export default OrderPage;