import Header from "../../components/Header";
import Center from "../../components/Center";
import styled from "styled-components";
import Button from "../../components/Button";
import { useContext, useState, useEffect, useCallback } from "react";
import { CardContext } from "../../components/CardContext";
import Table from "../../components/Table";
import axios from "axios";
import Image from "next/image";
import Input from "../../components/Input";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";

const ColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.3fr 0.7fr;
    }
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductImageBox = styled.div`
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img {
        max-width: 80px;
        max-height: 80px;
    }
`;

const CartEmptyMessage = styled.div`
    text-align: center;
    color: #888;
    font-size: 1.2rem;
`;

const QuantityLabel = styled.span`
    padding: 0 3px;
`;

const QuantityTD = styled.td`
    width: 100px;
`;

const TotalTD = styled.td`
    font-weight: bold;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

export default function CartPage() {
    const { cartProducts, addProducts, removeProducts, emptyArray } = useContext(CardContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [total, setTotal] = useState(0);
    const { data: session, status } = useSession();

    const fetchProducts = useCallback(async () => {
        if (cartProducts.length > 0) {
            try {
                const response = await axios.post('/api/cart', { ids: cartProducts });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching cart products:', error);
            }
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    const fetchAddressData = useCallback(async () => {
        try {
            const response = await axios.get('/api/address');
            setName(session.user.name || "");
            setEmail(session.user.email || '');
            setCity(response.data.city || '');
            setPostalCode(response.data.postalCode || '');
            setStreetAddress(response.data.streetAddress || '');
            setCountry(response.data.country || '');
            setIsLoaded(true);
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    }, [session]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.href.includes('success')) {
            setIsSuccess(true);
            emptyArray();
        }
        if (session?.user) {
            fetchAddressData();
        }
    }, [fetchAddressData, fetchProducts, emptyArray, session]);

    useEffect(() => {
        const newTotal = products.reduce((acc, product) => {
            const quantity = cartProducts.filter(id => id === product._id).length;
            return acc + product.price * quantity;
        }, 0);
        setTotal(newTotal);
    }, [products, cartProducts]);

    const moreThisProduct = (id) => {
        addProducts(id);
    };

    const lessThisProduct = (id) => {
        removeProducts(id);
    };

    const goToPayment = async () => {
        try {
            const response = await axios.post('/api/checkout', {
                name,
                email,
                city,
                postalCode,
                streetAddress,
                country,
                cartProducts,
            });

            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Stripe Checkout
            } else {
                console.error('Invalid response from API:', response);
            }
        } catch (error) {
            console.error('Error during payment request:', error);
            alert('There was an issue with the payment process. Please try again later.');
        }
    };

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </Box>
                    </ColumnWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <RevealWrapper origin={'left'}>
                        <Box>
                            {products.length === 0 ? (
                                <CartEmptyMessage>Your cart is empty</CartEmptyMessage>
                            ) : (
                                <>
                                    <h2>Cart</h2>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map(product => (
                                            <tr key={product._id}>
                                                <ProductInfoCell>
                                                    <ProductImageBox>
                                                        <Image src={product.images[0]} alt='' width={80} height={80} />
                                                    </ProductImageBox>
                                                    {product.title}
                                                </ProductInfoCell>
                                                <QuantityTD>
                                                    <Button onClick={() => lessThisProduct(product._id)}>-</Button>
                                                    <QuantityLabel>
                                                        {cartProducts.filter(id => id === product._id).length}
                                                    </QuantityLabel>
                                                    <Button onClick={() => moreThisProduct(product._id)}>+</Button>
                                                </QuantityTD>
                                                <td>£{product.price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <TotalTD>£{total.toFixed(2)}</TotalTD>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Box>
                    </RevealWrapper>
                    <RevealWrapper origin={'right'}>
                        {cartProducts.length > 0 && (
                            <Box>
                                <h2>Order Information</h2>
                                <Input type='text' placeholder='Name' name={'name'} value={name} onChange={ev => setName(ev.target.value)} />
                                <Input type='text' placeholder='Email' name={'email'} value={email} onChange={ev => setEmail(ev.target.value)} />
                                <CityHolder>
                                    <Input type='text' placeholder='City' name={'city'} value={city} onChange={ev => setCity(ev.target.value)} />
                                    <Input type='text' placeholder='PostalCode' name={'postalCode'} value={postalCode} onChange={ev => setPostalCode(ev.target.value)} />
                                </CityHolder>
                                <Input type='text' placeholder='Street Address' name={'streetAddress'} value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)} />
                                <Input type='text' placeholder='Country' name={'country'} value={country} onChange={ev => setCountry(ev.target.value)} />
                                <Button block black outline onClick={goToPayment} disabled={!isLoaded}>
                                    Continue to Payment
                                </Button>
                            </Box>
                        )}
                    </RevealWrapper>
                </ColumnWrapper>
            </Center>
        </>
    );
}
