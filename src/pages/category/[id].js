import Title from "../../../components/Title";
import Center from "../../../components/Center";
import { Category } from "../../../model/Category";
import Header from "../../../components/Header";
import {Product} from "../../../model/Product";
import ProductsGrid from "../../../components/ProductsGrid";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from 'lodash';
import Spinner from "../../../components/Spinner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "../../../model/WishedProduct";

// Styled Components
const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
        font-size: 1.5rem;
    }
`;

const FiltersWrapper = styled.div`
    display: flex;
    gap: 15px;
`;

const Filter = styled.div`
    padding: 5px 10px;
    background-color: #ddd;
    border-radius: 5px;
    display: flex;
    color: #444;
    gap: 5px;
    select {
        background-color: transparent;
        border: 0;
        font-size: inherit;
        color: #444;
    }
`;

// Main Component
export default function CategoryPage({ category, subCategories, products: originalProducts, wishedNewProducts }) {
    // Initial States
    const defaultFilterValue = category.properties.map(p => ({ name: p.name, value: 'all' }));
    const [filtersValue, setFiltersValue] = useState(defaultFilterValue);
    const [products, setProducts] = useState(originalProducts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const defaultSorting = '_id-desc'
    const [sort, setSort] = useState(defaultSorting);
    const [filtersChanged, setFiltersChanged] = useState(false);

    function handlerFilterChange(filterName, filterValue) {
        setFiltersValue(prev => (
            prev.map(f => ({
                name: f.name,
                value: f.name === filterName ? filterValue : f.value,
            }))
        ));
        setFiltersChanged(true);
    }

    const fetchProducts = debounce(async (filtersValue, sort) => {
        if (!filtersChanged) {
            return;
        }
        const categoryIds = [category._id, ...(subCategories?.map(c => c._id) || [])];
        const params = new URLSearchParams();
        params.set('categories', categoryIds.join(','));
        params.set('sort', sort);
        setLoading(true);
        filtersValue.forEach(f => {
            if (f.value !== 'all') {
                params.set(f.name, f.value);
            }
        });
        const url = `/api/products?${params.toString()}`;

        setLoading(true);
        try {
            const res = await axios.get(url);
            setProducts(res.data);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError('Error fetching products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, 300);

    // Effect Hook
    useEffect(() => {
        fetchProducts(filtersValue, sort);
    }, [filtersValue, sort, filtersChanged]);

    return (
        <>
            <Header />
            <Center>
                <CategoryHeader>
                    <h1>{category.name}</h1>
                    <FiltersWrapper>
                        {category.properties.map(prop => (
                            <Filter key={prop.name}>
                                <span>{prop.name}: </span>
                                <select
                                    onChange={ev => handlerFilterChange(prop.name, ev.target.value)}
                                    value={filtersValue.find(f => f.name === prop.name).value}
                                >
                                    <option value="all">All</option>
                                    {prop.values.map(val => (
                                        <option key={val} value={val}>{val}</option>
                                    ))}
                                </select>
                            </Filter>
                        ))}
                        <Filter>
                            <select value={sort} onChange={e => {
                                setSort(e.target.value);
                                setFiltersChanged(true);
                            }}>
                                <option value="price-asc">Lowest price</option>
                                <option value="price-desc">Highest price</option>
                                <option value="_id-desc">Newest first</option>
                                <option value="_id-asc">Oldest first</option>
                            </select>
                        </Filter>
                    </FiltersWrapper>
                </CategoryHeader>
                {loading && (
                    <Spinner fullWidth />
                )}
                {!loading && (
                    <ProductsGrid products={products} wishedProducts={wishedNewProducts.toString()} />

                )}
            </Center>
        </>
    );
}

// Server-Side Props
export async function getServerSideProps(context) {
    const category = await Category.findById(context.query.id);
    const subCategories = await Category.find({ parent: category._id });
    const categoryIds = [category._id, ...subCategories.map(c => c._id)];
    const products = await Product.find({ category: { $in: categoryIds } });
    const session = await getServerSession(context.req, context.res, authOptions);
    const user = session?.user;

    let wishedNewProducts = [];
    if (user) {
        wishedNewProducts = await WishedProduct.find({
            userEmail: user.email,
            product: products.map(p => p._id.toString()),
        }).lean();
        wishedNewProducts = wishedNewProducts.map(i => i.product.toString());
    }

    // console.log(wishedNewProducts);
    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            products: JSON.parse(JSON.stringify(products)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            wishedNewProducts,
        },
    };
}
