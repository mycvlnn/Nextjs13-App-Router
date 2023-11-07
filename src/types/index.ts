export type USER = {
    id: number;
    name: string,
    phone: string,
    dob: string,
    gender: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    address: string,
    email: string,
    password: string,
    accessToken: string,
    refreshToken: string,
    active: number
}

export type Role = {
    id: number,
    name: string,
}

export type Banner = {
    id: number,
    name: string,
    url: string,
    image: {
        id: number,
        imageable_id: number,
        path: string,
        imageable_type: number
    },
    description: string,
    active: boolean,
    slug: string,
}

export type Category = {
    id: number,
    name: string,
    description: string,
    active: boolean,
    slug: string,
}

export type Brand = {
    id: number,
    image: {
        id: number,
        imageable_id: number,
        path: string,
        imageable_type: number
    },
    name: string,
    description: string,
    slug: string,
}

export type Product = {
    id: number,
    name: string,
    sku: string,
    quantity: number,
    sold_quantity: number,
    many_version: boolean,
    price: number,
    active: boolean,
    is_discount: boolean,
    type_discount: number,
    percent_discount: number,
    price_discount: number,
    trending: boolean,
    image: {
        id: number,
        imageable_id: number,
        path: string,
        imageable_type: number
    },
    category_id: {
        id: number,
        name: string
    },
    brand_id: {
        id: number,
        name: string
    },
    slug: string,
    description: string,
}

export type ProductGallery = {
    id: number,
    product_id: number,
    image: {
        id: number,
        imageable_id: number,
        path: string,
        imageable_type: number
    },
}