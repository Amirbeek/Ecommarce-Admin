import  {model, models, Schema} from "mongoose";

const ReviewsSchema = new Schema({
    title:String,
    description: String,
    stars:Number,
    product:{type:Schema.Types.ObjectId}
},{timestamps:true});

export const Reviews = models?.Reviews || model('Reviews', ReviewsSchema);