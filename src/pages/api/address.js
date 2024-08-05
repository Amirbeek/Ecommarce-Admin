
import { mongooseConnect } from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { Address } from "../../../models/Address";
import Joi from 'joi';
import {authOptions} from "@/pages/api/auth/[...nextauth]";


export default async function handler(req, res) {
    await mongooseConnect();

    const session = await getServerSession(req, res, authOptions);
    const { user } = session;
    if (req.method === 'PUT') {
        // const { error } = addressSchema.validate(req.body);
        // if (error) {
        //     return res.status(400).json({ message: error.details[0].message });
        // }
        let address = await Address.findOne({ userEmail: user.email });
        if (address) {
            address = await Address.findByIdAndUpdate(address._id, req.body, { new: true });
            return res.json(address);
        } else {
            address = await Address.create({ userEmail: user.email, ...req.body });
            return res.json(address);
        }
    }

    if (req.method === 'GET') {
        const address = await Address.findOne({ userEmail: user.email });
        return res.json(address || {});
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);

}
