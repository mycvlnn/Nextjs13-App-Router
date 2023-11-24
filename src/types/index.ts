export type USER = {
    id: string;
    name: string;
    phone: string;
    dob: string;
    gender: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    address: string;
    email: string;
    password: string;
    accessToken: string;
    refreshToken: string;
    active: string
}

export type Role = {
    id: string;
    name: string;
}

export type Banner = {
    id: string;
    name: string;
    url: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    description: string;
    active: boolean;
    slug: string;
}

export type Category = {
    id: string;
    name: string;
    description: string;
    active: boolean;
    slug: string;
}

export type Brand = {
    id: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    name: string;
    description: string;
    slug: string;
}

export type Product = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    sold_quantity: number;
    brand_id: number;
    category_id: number;
    many_version: boolean;
    price: number;
    active: boolean;
    is_discount: boolean;
    type_discount: number;
    percent_discount: number;
    price_discount: number;
    trending: boolean;
    galleries: {
        id: string;
        product_id: number;
        image: {
            id: string;
            imageable_id: string;
            path: string;
            imageable_type: string
        };
    }[];
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
    category: {
        id: string;
        name: string
    };
    brand: {
        id: string;
        name: string
    };
    slug: string;
    description: string;
    skus: Sku[];
    properties: {
        id: string;
        price: string;
        quantity: string;
        property_options: PropertyValueType[];
    }[];
}

export type PropertyValueType = {
    id: number;
    label: string;
    value: string;
    properties: {
      id: number;
      label: string;
      value: string;
    };
  };

export type Property = {
    id: string;
    name: string;
    active: boolean;
    property_options: PropertyOption[];
}

export type PropertyOption = {
    id: string;
    name: string;
    active: boolean;
    property_id: Property;
}

export type Sku = {
    id: string;
    quantity: number;
    sold_quantity: number;
    many_version: boolean;
    price: number;
    is_discount: boolean;
    type_discount: string;
    percent_discount: number;
    price_discount: number;
    product_id: Product
}

export type PropertyOptionSku = {
    sku_id: Sku;
    property_option_id: PropertyOption;
}

export type ProductGallery = {
    id: string;
    product_id: string;
    image: {
        id: string;
        imageable_id: string;
        path: string;
        imageable_type: string
    };
}