import { mongooseConnect } from "../../../lib/mongoose";
import { Setting } from "../../../model/Setting";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        const { name } = req.query;
        const setting = await Setting.findOne({ name });
        res.json(setting);
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
