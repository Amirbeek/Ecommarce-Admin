import Center from './Center';
import ProductBox from './ProductBox';
import { RevealWrapper } from 'next-reveal';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const Title = styled.h2`
    font-size: 1.5rem;
    margin: 30px 0 20px;
    font-weight: normal;
    @media screen and (min-width: 768px) {
        font-size: 2rem;
    }
`;

export default function NewProducts({ products, wishedNewProducts = [] }) {
    return (
        <Center>
            <Title>New Arrivals</Title>
            <ProductsGrid>
                {products?.map(product => (
                    <RevealWrapper key={product._id} delay={0}>
                        <ProductBox
                            {...product}
                            wished={wishedNewProducts.includes(product._id)}
                        />
                    </RevealWrapper>
                ))}
            </ProductsGrid>
        </Center>
    );
}

NewProducts.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    wishedProductIds: PropTypes.arrayOf(PropTypes.string),
};
