import mongoose from "mongoose";
import Product from "../../../models/Product";
import { Order } from "../../../models/Order";
const stripe = require('stripe')
(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Method Not Allowed" });
    }

    try {
        const { name, email, city, postalCode, streetAddress, country, cartProducts } = req.body;
        const productsId = cartProducts;
        const productsInfos = await Product.find({ _id:  productsId  });

        let line_items = [];
        let calculatedTotal = 0;

        const productQuantityMap = productsId.reduce((acc, productId) => {
            acc[productId] = (acc[productId] || 0) + 1;
            return acc;
        }, {});

        const uniqueProductIds = Object.keys(productQuantityMap);
        for (const productId of uniqueProductIds) {

            const productInfo = productsInfos.find(p => p._id.toString() === productId);
            const quantity = productQuantityMap[productId];

            if (productInfo) {
                calculatedTotal += productInfo.price * quantity;
                line_items.push({
                    price_data: {
                        currency: "GBP",
                        product_data: {name: productInfo.title,},
                        unit_amount: Math.round(productInfo.price * 100),
                    },
                    quantity: quantity,
                });
            }
        }

        const orderDoc = await Order.create({
            line_items,
            name,
            email,
            city,
            postalCode,
            streetAddress,
            country,
            paid: false,
            totalAmount: calculatedTotal,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            customer_email: email,
            success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
            cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
            metadata: { orderId: orderDoc._id.toString(), test: "ok" },
        });
        console.log(session);


        res.json({
            url: session.url
        });
    } catch (error) {
        console.error('Checkout API Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}
