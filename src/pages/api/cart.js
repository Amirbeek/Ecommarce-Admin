// pages/api/get/cart.js

import { mongooseConnect } from '../../../lib/mongoose';
import {Product} from '../../../model/Product';

export default async function handle(req, res) {
    await mongooseConnect();
    const ids = req.body.ids;
    try {
        const products = await Product.find({ _id: { $in: ids } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
}
