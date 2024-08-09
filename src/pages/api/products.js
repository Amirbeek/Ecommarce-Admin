import { mongooseConnect } from "../../../lib/mongoose";
import Product from "../../../model/Product";

export default async function handle(req, res) {
    await mongooseConnect();
    const { categories,sort,phrase, ...filters } = req.query;
    let [sortField, sortOrder] = (sort || '_id-desc').split('-');

    const productQuery = {};
    if (categories){
        productQuery.category =  categories.split(',');
    }

    if (phrase){
        productQuery['$or'] = [
            {title:{$regex:phrase,$options:'i'}},
            {description:{$regex:phrase}}
        ]
    }
    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(key => {
            if (filters[key] !== 'all') {
                productQuery[`properties.${key}`] = filters[key];
            }
        });
    }

    const products = await Product.find(productQuery,null,{sort:{[sortField]:sortOrder === 'asc' ? 1 : -1}});
    res.json(products);
}
