import { buffer } from 'micro';
import { mongooseConnect } from '../../../lib/mongoose';
import { Order } from '../../../model/Order';
const stripe = require('stripe')(process.env.STRIPE_SK);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    await mongooseConnect();

        const sig = req.headers['stripe-signature'];
        let event;

        try {
            const rawBody = await buffer(req);
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(event.type);
        switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId;
            const paid = data.payment_status === 'paid';
            if (orderId && paid) {
                await Order.findByIdAndUpdate(orderId,{
                    paid:true,
                })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
