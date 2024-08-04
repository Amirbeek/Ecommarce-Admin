import { model, models, Schema } from 'mongoose';
import Product from "./Product";

const WishedProductSchema = new Schema({
    userEmail: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: Product }
});

const WishedProduct = models?.WishedProduct || model('WishedProduct', WishedProductSchema);
export default WishedProduct;
