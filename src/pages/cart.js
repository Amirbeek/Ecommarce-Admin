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
import Spinner from "../../components/Spinner";

const ColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.3fr 0.7fr;
    }
    table thead tr th:nth-child(3),
    table tbody tr td:nth-child(3),
    table tr.subtotal td:nth-child(2){
        text-align: right;
    }
    tr.total td{
        font-weight: bold;
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
    font-size: 18px;
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
    const { data: session } = useSession();
    const [shipping, setShipping] = useState(0);  // Default to 0

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
        setIsLoaded(false);
        try {
            const response = await axios.get('/api/address');
            setName(session?.user?.name || "");
            setEmail(session?.user?.email || '');
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
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);

        }
        const fetchShipping = async () => {
            try {
                const res = await axios.get('/api/settings?name=shippingFee');
                const shippingFee = res.data?.value || '0';
                setShipping(parseFloat(shippingFee));
            } catch (error) {
                console.error('Error fetching shipping fee:', error);
            }
        };

        fetchShipping();
        if (session?.user) {
            fetchAddressData();
        }
    }, [fetchAddressData, emptyArray, session]);

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
                window.location.href = response.data.url;
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

    const productTotal = total.toFixed(2);
    const shippingTotal = shipping.toFixed(2);
    const grandTotal = (parseFloat(productTotal) + parseFloat(shippingTotal)).toFixed(2);

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
                                                        <Image src={product.images[0]} alt={product.title} width={80} height={80} />
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
                                        <tr className={'subtotal'}>
                                            <td colSpan={2}>Products</td>
                                            <TotalTD>£{productTotal}</TotalTD>
                                        </tr>
                                        <tr className={'subtotal'}>
                                            <td colSpan={2}>Shipping</td>
                                            <TotalTD>£{shippingTotal}</TotalTD>
                                        </tr>
                                        <tr className={'subtotal total'}>
                                            <td colSpan={2}>Total</td>
                                            <TotalTD>£{grandTotal}</TotalTD>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Box>
                    </RevealWrapper>
                    {!!cartProducts?.length && (
                        <RevealWrapper origin={'right'}>
                            <Box>
                                <h2>Order information</h2>
                                {!isLoaded ? (
                                    <Spinner fullWidth={true} />
                                ) : (
                                    <>
                                        <Input type='text'
                                               placeholder='Name'
                                               value={name}
                                               name={'name'}
                                               onChange={ev => setName(ev.target.value)} />
                                        <Input type='text'
                                               placeholder='Email'
                                               value={email}
                                               name={'email'}
                                               onChange={ev => setEmail(ev.target.value)} />
                                        <CityHolder>
                                            <Input type='text'
                                                   placeholder='City'
                                                   value={city}
                                                   name={'city'}
                                                   onChange={ev => setCity(ev.target.value)} />
                                            <Input type='text'
                                                   placeholder='Postal Code'
                                                   value={postalCode}
                                                   name={'postalCode'}
                                                   onChange={ev => setPostalCode(ev.target.value)} />
                                        </CityHolder>
                                        <Input type='text'
                                               placeholder='Street Address'
                                               value={streetAddress}
                                               name={'streetAddress'}
                                               onChange={ev => setStreetAddress(ev.target.value)} />
                                        <Input type='text'
                                               placeholder='Country'
                                               value={country}
                                               name={'country'}
                                               onChange={ev => setCountry(ev.target.value)} />
                                        <Button black block onClick={goToPayment}>Continue to Payment</Button>
                                    </>
                                )}
                            </Box>
                        </RevealWrapper>
                    )}
                </ColumnWrapper>
            </Center>
        </>
    );
}
