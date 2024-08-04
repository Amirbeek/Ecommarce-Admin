import mongoose, { Schema, model } from 'mongoose';
const { ObjectId } = Schema.Types;

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: ObjectId, ref: 'Category' },
    properties: { type: Object },
},{
    timestamps:true
});

const Product = mongoose.models?.Product || model('Product', ProductSchema);
export default Product;
