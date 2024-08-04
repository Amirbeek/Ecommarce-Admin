import React, { useState, useEffect, useContext } from 'react';
import Center from './Center';
import styled from 'styled-components';
import ButtonLink from './ButtonLink';
import CardIcon from './CardIcon';
import FlyingButton from "./FlyingButton";
import {RevealWrapper} from 'next-reveal';

const Bg = styled.div`
    color: #fff;
    background-color: #222;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 1.8rem;
    @media screen and (min-width: 768px) {
        font-size: 3rem;
    }
`;

const Desc = styled.p`
    color: #aaa;
    font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 0px;
    .main-image {
        max-width: 100%;
        max-height: 300px;
        display: block;
        margin: 0 auto;
        zoom:150%;
    }
    div:nth-child(1){
        order: 2;
    }
    
    @media screen and (min-width: 768px){
        grid-template-columns: 0.9fr 1.1fr;
        margin-top: 0;
        gap: 40px;
        div:nth-child(1){
            order: 0;
        }
        .main-image {
            max-width: 100%;
        }
    }

`;

const Columns = styled.div`
    display: flex;
    align-items: center;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

export default function Featured({ product }) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (product) {
            setIsLoading(false);
        }
    }, [product]);

    if (isLoading) return <div>Loading...</div>;
    const addFeaturedToCart = () => {
        addProducts(product._id);
    };
    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Columns>
                        <div>
                            <RevealWrapper origin={'left'}>
                                <Title>{product.title}</Title>
                                <Desc>{product.description}</Desc>
                                <ButtonWrapper>
                                    <ButtonLink href={`/product/${product._id}`} outline={1} white={1}>
                                        Read More
                                    </ButtonLink>
                                    <FlyingButton white _id={product._id} src={product.images?.[0]}>
                                        <CardIcon />
                                        Add to Cart
                                    </FlyingButton>
                                </ButtonWrapper>
                            </RevealWrapper>

                        </div>
                    </Columns>
                    <Columns>
                        <RevealWrapper>
                            <img className='main-image' src="https://amir-next-ecommerce.s3.amazonaws.com/1718700277171.webp" alt=""/>
                        </RevealWrapper>
                    </Columns>
                </ColumnsWrapper>
            </Center>
        </Bg>
    );
}
