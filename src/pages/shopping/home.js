
import React from "react";
import data from "./data";
import { Link } from "react-router-dom";

const ShoppingHome = () =>
{
    return (
        // <div className="flex flex-col justify-center items-center w-full h-full bg-green-100">
        //     <h1 className="text-2xl">Welcome to shopping home</h1>
        //     <Link to="/shopping/products" className="underline mt-5">Show products</Link>

        //     <main>
        //         <div className="products">
        //             {data.products.map((product) => (
        //                 <div className="product" key={product.slug}>
        //                     <Link to={`/shopping/details/${product.slug}`}>
        //                         <img src={product.image} alt={product.name} />
        //                     </Link>
        //                     <div className="product-info">
        //                         <Link to={`/shopping/details/${product.slug}`}>
        //                             <p>{product.name}</p>
        //                         </Link>
        //                         <p>
        //                             <strong>${product.price}</strong>
        //                         </p>
        //                         <button>Add to cart</button>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </main>
        // </div>
        <div>
            <header>
                <a className="text-2xl" href="/">Welcome to Gwhoami Marketplace</a>
                <h1 className="text-2xl">Welcome to shopping home</h1>
                <Link to="/shopping/products" className="underline mt-5">Show products</Link>
            </header>
            <main>
                <h1>Featured Products</h1>
                <div className="products">
                    {data.products.map((product) => (
                        <div className="product" key={product.slug}>
                            <a href={`/shopping/details/${product.slug}`}>
                                <img src={product.image} alt={product.name} />
                            </a>
                            <div className="product-info">
                                <a href={`/shopping/details/${product.slug}`}>
                                    <p>{product.name}</p>
                                </a>
                                <p>
                                    <strong>${product.price}</strong>
                                </p>
                                <button>Add to cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
export default ShoppingHome;