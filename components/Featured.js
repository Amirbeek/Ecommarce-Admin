import React from 'react';
import styled from 'styled-components';
import Center from './Center';
import ButtonLink from './ButtonLink';
import CardIcon from './CardIcon';
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from 'next-reveal';

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

const CenterImg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    .main-image {
        max-width: 100%;
        max-height: 300px;
        display: block;
        margin: 0 auto;
        zoom: 150%;
    }
    div:nth-child(1) {
        order: 2;
        margin-left: auto;
        margin-right: auto;
    }

    @media screen and (min-width: 768px) {
        grid-template-columns: 0.9fr 1.1fr;
        margin-top: 0;
        gap: 40px;
        & > div:nth-child(1) {
            margin-left: auto;
            margin-right: auto;
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

const ImgColumn = styled(Columns)`
    & > div {
        width: 100%;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const ContentWrapper = styled.div``;

export default function Featured({ product }) {
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Columns>
                        <div>
                            <RevealWrapper origin={'left'}>
                                <ContentWrapper>
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
                                </ContentWrapper>
                            </RevealWrapper>
                        </div>
                    </Columns>
                    <ImgColumn>
                        <RevealWrapper delay={0}>
                            <CenterImg>
                                <img className='main-image' src={product.images?.[0]} alt={product.title} />
                            </CenterImg>
                        </RevealWrapper>
                    </ImgColumn>
                </ColumnsWrapper>
            </Center>
        </Bg>
    );
}
