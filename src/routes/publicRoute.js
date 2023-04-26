import { Redirect, Route, useLocation } from "react-router-dom";
import MyLocalStorage from "../util/mylocalStorage";

const PublicRoute = ({
    comp:Component, 
    isAuthenticated, 
    ...rest
}) => {
    const location = useLocation();
    return (
    <Route
        {...rest}
        render={props => location.pathname.indexOf('/loginverify') !== -1 ? (<Component {...props} />) : isAuthenticated  ? (MyLocalStorage.isAdmin()  ? <Redirect to="/admin" /> : <Redirect to="/user" />) : (<Component {...props} />)}
    />
);
}
export default PublicRoute;