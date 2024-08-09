import Header from '../../components/Header';
import Featured from '../../components/Featured';
import {Product} from '../../model/Product';
import { mongooseConnect } from '../../lib/mongoose';
import NewProducts from '../../components/NewProducts';
import { Helmet } from 'react-helmet';
import {WishedProduct} from '../../model/WishedProduct';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {Setting} from "../../model/Setting";

export default function Home({ featuredProduct, newProducts, wishedNewProducts }) {
    return (
        <div>
            <Helmet>
                <title>My E-commerce Site</title>
                <meta name="description" content="Welcome to my e-commerce site." />
            </Helmet>
            <Header />
            <Featured product={featuredProduct} />
            <NewProducts products={newProducts} wishedNewProducts={wishedNewProducts}/>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const featuredProductSetting = await Setting.findOne({name:'featuredProductId'})
    const featuredProductId = featuredProductSetting.value;
    const featuredProduct = await Product.findById(featuredProductId).lean();
    const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 4 }).lean();
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const user = session?.user;

    let wishedNewProducts = [];
    if (user) {
        wishedNewProducts = await WishedProduct.find({
            userEmail: user.email,
            product: newProducts.map(p => p._id.toString()),
        }).lean();
        wishedNewProducts = wishedNewProducts.map(i => i.product.toString());
    }
    console.log(featuredProductSetting)
    return {
        props: {
            featuredProduct:JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts,
        },
    };
}
