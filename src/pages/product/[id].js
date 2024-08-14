import Center from "../../../components/Center";
import Header from "../../../components/Header";
import Title from "../../../components/Title";
import { mongooseConnect } from "../../../lib/mongoose";
import {Product} from "../../../model/Product";
import styled from "styled-components";
import WhiteBox from "../../../components/WhiteBox";
import ProductImages from "../../../components/ProductImages";
import CardIcon from "../../../components/CardIcon";
import { useContext } from "react";
import CardContext from "../../../components/CardContext";
import FlyingButton from "../../../components/FlyingButton";
import ProductReviews from "../../../components/ProductReviews";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns:1fr;
    gap: 40px;
    margin-top: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 0.8fr 1.2fr;
    }
   
`;

const Price = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`;

const BoxOfPriceAndTitle = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default function ProductPage({ product }) {
    const { addProducts } = useContext(CardContext);
    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        {/*<span>{product.category}</span>*/}
                        <BoxOfPriceAndTitle>
                            <Price>£{product.price}</Price>
                            <FlyingButton main _id={product._id} src={product?.images?.[0]} >
                                <CardIcon/>
                                Add to cart
                            </FlyingButton>
                        </BoxOfPriceAndTitle>
                    </div>
                </ColWrapper>
                <ProductReviews product={product}/>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        },
    };
}
