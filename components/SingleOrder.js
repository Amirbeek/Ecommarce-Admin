

import styled from "styled-components";
import {Address} from "../models/Address";

const StyledOrder =  styled.div`
    //background-color: #aaa;
    margin:5px 0;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 20px;
    align-items: center;
    time{
        font-size: 1rem;
        //font-weight: bold;
        //color: #777;
    }
`
const ProductRow = styled.div`
    span{
        color: #aaa;
    }
`
const Addresss= styled.div`
    font-size: .8rem;
    line-height: .8rem;
    margin-top: 10px;
    color: #aaa;
`
export default function SingleOrder({line_items,createdAt,...res}) {
    return(
        <>
            <StyledOrder>
                <div>
                    <time>{(new Date(createdAt)).toLocaleString('sv-SE')}</time>
                    <Addresss>
                        {res.name}<br/>
                        {res.streetAddress}<br/>
                        {res.postalCode}, {res.city}, {res.country}

                    </Addresss>
                </div>
                <div>
                    {line_items.map(item => (
                        <ProductRow>
                            <span>{item.quantity} x </span>{item.price_data.product_data.name}
                        </ProductRow>
                    ))}
                </div>

            </StyledOrder>
        </>
    )
}