import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import DotSpinner from "../DotSpinner";
import OpenRoutes from "./openRoutes";


const NonProtectedRoutes  = () => (
    <Switch>
        <Suspense fallback={<div className="w-full h-full justify-center items-center bg-bgback"><DotSpinner/></div>}>
            {OpenRoutes.map(({component: Component, path, exact})=>(
                <Route
                    path={`/home${path}`}
                    key={path}
                    exact={exact}
                >
                    <Component/>
                </Route>
            ))}
        </Suspense>
    </Switch>
);

export default NonProtectedRoutes;
