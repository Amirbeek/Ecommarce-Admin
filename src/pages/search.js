import Header from "../../components/Header";
import Center from "../../components/Center";
import Input from "../../components/Input";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ProductsGrid from "../../components/ProductsGrid";
import { debounce } from "lodash";
import Spinner from "../../components/Spinner";

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.4rem;
`;

const InputWrapper = styled.div`
    position: sticky;
    top: 70%;
    padding: 5px 0;
    margin: 20px 0;
    background-color: #eee;
`;

export default function Search() {  // Removed the 'message' parameter
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [wishLoaded, setWishLoaded] = useState(false);

    const debounceSearch = useCallback(
        debounce((phrase) => {
            searchProducts(phrase);
        }, 500), []
    );

    useEffect(() => {
        if (phrase.length > 0) {
            setIsLoading(true);
            debounceSearch(phrase);
        } else {
            setProducts([]);
        }
    }, [phrase, debounceSearch]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const wishlistResponse = await axios.get('/api/wishlist');
            console.log('Wishlist Response:', wishlistResponse);
            const wishlistData = wishlistResponse.data;
            console.log('Search Wishlist Data:', wishlistData);
            setWishlist(wishlistData.map(item => item.product?._id));
            setWishLoaded(true);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishLoaded(false);
        }
    };

    async function searchProducts(phrase) {
        try {
            const productsResponse = await axios.get('/api/products?phrase=' + encodeURIComponent(phrase));
            setProducts(productsResponse.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Header />
            <Center>
                <InputWrapper>
                    <SearchInput
                        autoFocus
                        value={phrase}
                        placeholder={'Search for Product...'}
                        onChange={ev => setPhrase(ev.target.value)}
                    />
                    {!isLoading && phrase !== '' && products.length === 0 && (
                        <h2>No product found for query "{phrase}"</h2>
                    )}

                    {isLoading && (
                        <Spinner fullWidth={true} />
                    )}

                    {!isLoading && products.length > 0 && (
                        <ProductsGrid products={products} wishedProducts={wishlist} />
                    )}
                </InputWrapper>
            </Center>
        </>
    );
}
