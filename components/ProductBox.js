import styled from 'styled-components';
import Button, { StyledButtons } from './Button';
import CardIcon from './CardIcon';
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./HeartOutlineIcon";
import { useState } from "react";
import HeartSolidIcon from "./HeartSolidIcon";
import axios from "axios";
import Notification from "./Notification";

const WhiteBox = styled.a`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    img {
        max-width: 100%;
        max-height: 80px;
    }
`;

const ProductWrapper = styled.div`
    margin-bottom: 20px; /* Adjust margin as needed */
`;

const ProductTitle = styled.a`
    font-weight: normal;
    text-decoration: none;
    font-size: 1rem;
    color: inherit;
    margin: 0;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`;

const ButtonWrapper = styled.div`
    button {
        ${StyledButtons};
        background-color: transparent;
        border: 1px solid #5542F6;
        color: #5542F6;
    }
`;

const WishListButton = styled.button`
    border: 0;
    width: 40px!important;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    cursor: pointer;
    ${props => props.$wished ? `color: red;` : `color: black;`}
    svg {
        width: 16px;
    }
`;

export default function ProductBox({ _id, title, description, price, images, wished = null,onRemoveWishList=()=>{} }) {
    const [isWished, setIsWished] = useState(wished);

    const [error, setError] = useState(null);
    const uri = '/product/' + _id;

    const truncateTitle = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    async function addToWishList(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const nextValue = !isWished;
        if (nextValue === false){
            onRemoveWishList(_id);
        }
        try {
            await axios.post('/api/wishlist', { product: _id });
            setIsWished(nextValue);
        } catch (error) {
            setError('An error occurred while updating the wishlist. Please try again.');
        }
    }

    return (
        <ProductWrapper>
            <WhiteBox href={uri}>
                <div>
                    <WishListButton $wished={isWished} onClick={addToWishList}>
                        {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
                    </WishListButton>
                    <img src={images?.[0]} alt='' />
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <ProductTitle href={uri}>
                    {truncateTitle(title, 15)}
                </ProductTitle>
                <PriceRow>
                    <Price>£ {price}</Price>
                    <FlyingButton _id={_id} src={images?.[0]}>
                        <CardIcon />
                    </FlyingButton>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}
