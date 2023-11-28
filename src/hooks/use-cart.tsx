import { toast } from 'react-hot-toast';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

import { Cart } from '@/types';

interface CartStore {
  items: Cart[];
  addItem: (data: Cart) => void;
  removeItem: (id: string, sku_id:number) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>((set, get) => ({
  items: [],
  addItem: (data: Cart) => {
    const currentItems = get().items;
    let existingProductIndex = -1;

    if (data.sku_id != null) {
      existingProductIndex = currentItems.findIndex((item) => item.id === data.id && item.sku_id === data.sku_id);
    } else {
      existingProductIndex = currentItems.findIndex((item) => item.id === data.id);
    }

    if (existingProductIndex>=0) {
      const updatedItems = [...currentItems];
      updatedItems[existingProductIndex].quantity += data.quantity;
      set({ items: updatedItems });
      toast.success('Sản phẩm đã được thêm vào giỏ hàng');
    } else {
      set({ items: [...get().items, data] });
      toast.success('Thêm vào giỏ hàng thành công');
    }
  },
  removeItem: (id: string, sku_id: number) => {
    if (sku_id>=0) {
      set({ items: [...get().items.filter((item) => !(item.id === id && item.sku_id === sku_id))] });
    } else {
      set({ items: [...get().items.filter((item) => item.id !== id)] });
    }
    toast.success('Gỡ sản phẩm thành công');
  },
  removeAll: () => set({ items: [] }),
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage)
}));

export default useCart;