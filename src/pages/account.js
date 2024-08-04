import Header from "../../components/Header";
import Center from "../../components/Center";
import styled from "styled-components";
import Title from "../../components/Title";
import { useSession, signOut, signIn } from "next-auth/react";
import Button from "../../components/Button";
import WhiteBox from "../../components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "../../components/Input";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import ProductBox from "../../components/ProductBox";

const WishlistP = styled.p`
    font-size: small;
    color: darkgray;
`
const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    margin: 40px 0;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;
const WishedProductGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`
export default function AccountPage() {
    const { data: session, status } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [Wishloaded, setWishLoaded] = useState(false);
    const [error, setError] = useState('');
    const [wishedProduct, setWishedProduct] =useState('');

    const fetchAddressData = useCallback(async () => {


        try {
            const response = await axios.get('/api/address');
            setEmail(session.user.email || '');
            setName(session.user.name || '');
            setCity(response.data.city || '');
            setPostalCode(response.data.postalCode || '');
            setStreetAddress(response.data.streetAddress || '');
            setCountry(response.data.country || '');
            setLoaded(true);

            const wishlistResponse = await axios.get('/api/wishlist');
            // console.log(wishlistResponse.data);
            if (wishlistResponse){
                setWishLoaded(true);
            }
            setWishedProduct(wishlistResponse.data.map(wp => wp.product));
        } catch (err) {
            setError('Failed to load address data');
            setLoaded(true);
        }
    }, [session]);

    useEffect(() => {
        fetchAddressData();
    }, [fetchAddressData]);

    async function saveAddress() {
        try {
            const data = { name, email, city, postalCode, streetAddress, country };
            await axios.put('/api/address', data);
            alert('Address saved successfully!');
        } catch (error) {
            setError('Error saving address.');
            console.error('Error saving address:', error);
        }
    }

    async function logout() {
        await signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_URL}/account` });
    }

    async function login() {
        signIn('google');
    }
    function productRemovedFromWishList(id) {
        setWishedProduct(product =>{
            return[...product.filter(p => p._id.toString() !== id)]
        })
    }
    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <WhiteBox>
                            <RevealWrapper delay={100}>
                                <Title>Wishlist</Title>


                                    <div>
                                        {session && !Wishloaded && (
                                            <Spinner fullWidth={true}/>
                                        )}

                                    </div>

                                {!session && (
                                    <WishlistP>You don't have Wishlist. Please you need to Login</WishlistP>
                                )}

                                {Wishloaded && (
                                    <WishedProductGrid>
                                        {wishedProduct.length > 0 && wishedProduct.map(wp => (
                                            <ProductBox key={wp._id} {...wp} wished={true} onRemoveWishList={productRemovedFromWishList}/>
                                        ))}
                                    </WishedProductGrid>
                                )}
                                {Wishloaded && wishedProduct.length === 0 && (
                                    <WishlistP>Your Wishlist is empty.</WishlistP>
                                )}
                            </RevealWrapper>
                        </WhiteBox>
                    </div>

                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                        {session ? (
                                                <div>
                                                    {!session && !loaded ? <Spinner fullWidth={true} /> : (
                                                    <div>
                                                        <h2>Account Details</h2>
                                                        <Input
                                                            type='text'
                                                            placeholder='Name'
                                                            value={name}
                                                            onChange={e => setName(e.target.value)}
                                                        />
                                                        <Input
                                                            type='text'
                                                            placeholder='Email'
                                                            value={email}
                                                            onChange={e => setEmail(e.target.value)}
                                                            disabled
                                                        />
                                                        <CityHolder>
                                                            <Input
                                                                type='text'
                                                                placeholder='City'
                                                                value={city}
                                                                onChange={e => setCity(e.target.value)}
                                                            />
                                                            <Input
                                                                type='text'
                                                                placeholder='Postal Code'
                                                                value={postalCode}
                                                                onChange={e => setPostalCode(e.target.value)}
                                                            />
                                                        </CityHolder>
                                                        <Input
                                                            type='text'
                                                            placeholder='Street Address'
                                                            value={streetAddress}
                                                            onChange={e => setStreetAddress(e.target.value)}
                                                        />
                                                        <Input
                                                            type='text'
                                                            placeholder='Country'
                                                            value={country}
                                                            onChange={e => setCountry(e.target.value)}
                                                        />
                                                        <Button block black outline onClick={saveAddress}>
                                                            Save
                                                        </Button>
                                                        <hr />
                                                    </div>
                                                    )}
                                                </div>
                                        ) : (<>
                                            <WishlistP>Please you need to Login</WishlistP>
                                        </>)}


                                {session ? (
                                    <Button primary onClick={logout}>Log out</Button>
                                ) : (
                                    <Button primary onClick={login}>Login Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    );
}