import Header from '../../components/Header';
import Featured from '../../components/Featured';
import Product from '../../models/Product';
import { mongooseConnect } from '../../lib/mongoose';
import NewProducts from '../../components/NewProducts';
import { Helmet } from 'react-helmet';
import WishedProducts from '../../models/WishedProduct';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
    const featuredProductId = '666da1d81a8b0808d100018f';
    const featuredProduct = await Product.findById(featuredProductId).lean();
    const newProducts = await Product.find({}, null, { sort: { '_id': -1 }, limit: 4 }).lean();
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const user = session?.user;

    let wishedNewProducts = [];
    if (user) {
        wishedNewProducts = await WishedProducts.find({
            userEmail: user.email,
            product: newProducts.map(p => p._id.toString()),
        }).lean();
        wishedNewProducts = wishedNewProducts.map(i => i.product.toString());
    }

    return {
        props: {
            featuredProduct:JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts,
        },
    };
}
