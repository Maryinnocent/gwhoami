import { Link } from "react-router-dom";

const ProductDetails = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full bg-red-100">
            <h1 className="text-2xl">Product Details</h1>
            <Link to="/shopping/products" className="underline mt-5">All Products</Link><br/>
            <Link to="/shopping/home" className="underline mt-1">Shopping home</Link>
        </div>
    );
}

export default ProductDetails;