import Header from "../../components/Header";
import Center from "../../components/Center";
import { Category } from "../../model/Category";
import {Product} from "../../model/Product";
import ProductBox from "../../components/ProductBox";
import styled from "styled-components";
import Link from "next/link";
import { RevealWrapper } from "next-reveal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "../../model/WishedProduct";
import { mongooseConnect } from "../../lib/mongoose";

const CatGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const CatTitle = styled.div`
    display: flex;
    margin-top: 40px;
    margin-bottom: 0;
    align-items: center;
    gap: 15px;
    h2 {
        margin-bottom: 10px;
        margin-top: 10px;
    }
    a {
        color: #555;
    }
`;

const ShowAllSquare = styled(Link)`
    background-color: #ddd;
    height: 160px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    text-align: center;
    justify-content: center;
    color: #555;
    text-decoration: none;
    cursor: pointer;
`;

const CatWrapper = styled.div`
    margin-bottom: 40px;
`;

export default function Categories({ mainCategories, categoriesProducts, wishedProducts=[] }) {
    return (
        <>
            <Header />
            <Center>
                {mainCategories.map((cat) => (
                    <CatWrapper key={cat._id}>
                        <CatTitle>
                            <h2>{cat.name}</h2>
                            <div>
                                <Link href={`/category/${cat._id}`}>Show All</Link>
                            </div>
                        </CatTitle>
                        <CatGrid>
                            {categoriesProducts[cat._id].map((p, index) => (
                                <RevealWrapper key={p._id} origin={"left"} delay={index * 100}>
                                    <ProductBox {...p} wished={wishedProducts?.includes(p._id)}/>
                                </RevealWrapper>
                            ))}
                            <RevealWrapper origin={"left"} delay={300}>
                                <ShowAllSquare href={`/category/${cat._id}`}>Show All</ShowAllSquare>
                            </RevealWrapper>
                        </CatGrid>
                    </CatWrapper>
                ))}
            </Center>
        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const categories = await Category.find();
    const mainCategories = categories.filter((c) => !c.parent);
    const categoriesProducts = {};
    const allFetchedProductId = [];

    for (const mainCat of mainCategories) {
        const MainCatId = mainCat._id.toString();
        const childCatId = categories
            .filter((c) => c?.parent?.toString() === MainCatId)
            .map((c) => c._id.toString());
        const CategoriesIds = [MainCatId, ...childCatId];
        const productCat = await Product.find({ category: { $in: CategoriesIds } }, null, { limit: 3, sort: { _id: -1 } });
        categoriesProducts[mainCat._id] = productCat;
        allFetchedProductId.push(...productCat.map((p) => p._id.toString()));
    }

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user.email;
    let wishedProducts = [];

    if (session?.user) {
        wishedProducts = await WishedProduct.find({
            userEmail: userEmail,
            product: { $in: allFetchedProductId }
        }).select('product');
    }else {
        wishedProducts = [];
    }

    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map((i) => i.product.toString())
        },
    };
}
