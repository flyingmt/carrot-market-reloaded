import db from "@/lib/db";
import ProductList from "@/components/product-list";
import {Prisma} from "@prisma/client";

async function getIntialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc",
        },
    });

    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getIntialProducts>;

export default async function Products() {
    const initialProducts = await getIntialProducts();

    return (
        <div>
            <ProductList initialProducts={initialProducts} />
        </div>
    );
}