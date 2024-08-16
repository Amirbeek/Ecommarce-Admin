import {mongooseConnect} from "../../../lib/mongoose";
import {Reviews} from "../../../model/Reviews";

export default async function handle(req,res){
    await mongooseConnect();
    if (req.method === "POST"){
        const {title,description,stars,product} = req.body;
        res.json(await Reviews.create({title,description,stars,product}));
    }
    if (req.method === "GET"){
        const {product} = req.query;
        res.json(await Reviews.find({product}))
    }
}