import Header from "../../components/Header";
import styled from "styled-components";
import Center from "../../components/Center";
import { mongooseConnect } from "../../lib/mongoose";
import {Product} from "../../model/Product";
import ProductsGrid from "../../components/ProductsGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "../../model/WishedProduct"; // Correct import for WishedProduct model

const Title = styled.h1`
    font-size: 1.5rem;
`;

export default function Products({ products, wishedProducts }) {
    return (
        <>
            <Header />
            <Center>
                <Title>All Products</Title>
                <ProductsGrid products={products} wishedProducts={wishedProducts} />
            </Center>
        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { '_id': -1 } });
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    let wishedProducts = [];
    const UserEmail = session?.user.email;

    if (session?.user) {
        wishedProducts = await WishedProduct.find({
            userEmail: UserEmail,
            product: products.map(p => p._id.toString()),
        }).select('product');
    }else {
        wishedProducts = [];
    }

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString())
        }
    };
}
