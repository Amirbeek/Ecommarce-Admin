import Title from "./Title";

export default function ProductReviews({product}) {
    return(
        <>
            <Title>Reviews</Title>
            {product.title}
        </>
    )
}
