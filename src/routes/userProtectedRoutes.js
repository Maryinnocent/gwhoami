import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import DotSpinner from "../DotSpinner";
import userPagePath from "./userPagePath";

const UserProctedRoutes  = () => (
    <Switch>
        <Suspense fallback={<div className="w-full h-full justify-center items-center bg-bgback"><DotSpinner/></div>}>
            {userPagePath.map(({component: Component, path, exact})=>(
                <Route
                    path={`/user${path}`}
                    key={path}
                    exact={exact}
                >
                    <Component/>
                </Route>
            ))}
        </Suspense>
    </Switch>
);

export default UserProctedRoutes;
