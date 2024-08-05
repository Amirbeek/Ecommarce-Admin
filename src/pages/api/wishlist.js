import { mongooseConnect } from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import WishedProduct from "../../../models/WishedProduct";
import Product from "../../../models/Product";

export default async function handler(req, res) {
    try {
        // Connect to MongoDB
        await mongooseConnect();

        // Fetch session
        const session = await getServerSession(req, res, authOptions);

        const { user } = session;


        if (req.method === "POST") {
            const { product } = req.body;

            if (!product) {
                return res.status(400).json({ message: "Product field is required" });
            }

            const wishedDoc = await WishedProduct.findOne({ userEmail: user.email, product });

            if (wishedDoc) {
                await WishedProduct.findByIdAndDelete(wishedDoc._id);
                return res.json({ message: "Deleted" });
            } else {
                await WishedProduct.create({ userEmail: user.email, product });
                return res.json({ message: "Created" });
            }
        }
        if (req.method === "GET"){
            const session = await getServerSession(req, res, authOptions);
            const { user } = session;
            res.json(
                await WishedProduct.find({userEmail: user.email}).populate('product')
            )
        }
    } catch (error) {
        console.error("Error in API handler:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
