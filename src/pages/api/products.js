import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "../../../model/Product";

export default async function handle(req, res) {
    // Connect to the MongoDB database
    await mongooseConnect();
    const { categories, sort, phrase, ...filters } = req.query;
    let [sortField, sortOrder] = (sort || '_id-desc').split('-');
    const productsQuery = {};

    if (categories) {
        productsQuery.category = categories.split(',');
    }

    if (phrase) {
        productsQuery['title'] = { $regex: '^' + phrase, $options: 'i' };
    }

    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(filterName => {
            productsQuery['properties.' + filterName] = filters[filterName];
        });
    }

    let products = await Product.find(
        productsQuery,
        null,
        {
            sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
        }
    );

    if (products.length === 0 && phrase) {
        delete productsQuery.title; // Remove title search
        productsQuery['description'] = { $regex: '^' + phrase, $options: 'i' }; // Search in description

        products = await Product.find(
            productsQuery,
            null,
            {
                sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
            }
        );
    }

    // Return the found products as JSON
    res.json(products);
}
