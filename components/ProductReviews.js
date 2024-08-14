import Title from "./Title";
import styled from "styled-components";
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`
const ColsWrapper =  styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`
export default function ProductReviews({product}) {
    return(
        <>
            <Title>Reviews</Title>
            <ColsWrapper>
                <WhiteBox>
                    <Subtitle>Add Review</Subtitle>
                    <div>
                        <StarsRating/>
                    </div>
                    <Input placeholder={'Title'}/>
                </WhiteBox>
                <div>
                    <Subtitle>All Review</Subtitle>

                </div>
            </ColsWrapper>
        </>
    )
}
