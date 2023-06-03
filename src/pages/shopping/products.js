import { Link } from "react-router-dom";

const Products = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full bg-orange-100">
            <h1 className="text-2xl">Product</h1>
            <Link to="/shopping/details" className="underline mt-5">More Info</Link><br/>
            <Link to="/shopping/home" className="underline mt-1">Shopping home</Link>
        </div>
    );
}
export default Products;
