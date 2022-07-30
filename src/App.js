import React, { Suspense,  useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import DotSpinner from './component/DotSpinner';
import { MainContext } from './util/maincontext';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import MyLocalStorage from './util/mylocalStorage';
import PublicRoute from './routes/publicRoute';
import 'boxicons/css/boxicons.min.css';
import 'react-responsive-tabs/styles.css';
import 'react-datetime/css/react-datetime.css';
//import HomeLanding from './layout/homelayout/homeLanding';
import UserRoute from './routes/userRoute';
const HomeLanding = React.lazy(()=>import('./layout/homelayout/homeLanding'));
const UserLanding = React.lazy(()=>import('./layout/userlayout/userLanding'));
//import { apiGetCall } from './helper/API';

const App = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);

    useState(()=> {
        setAuthenticated(MyLocalStorage.isLoggedIn());
    }, []);
    
    return (
        <MainContext.Provider value={{setAuthenticated}}>
            <Suspense fallback={<DotSpinner/>}>
                <ToastContainer/>
                <Switch>
                    <PublicRoute path="/home" isAuthenticated={isAuthenticated} comp={HomeLanding}></PublicRoute>
                    <UserRoute path="/user" isAuthenticated={isAuthenticated} comp={UserLanding}></UserRoute>
                    <Route path="/" exact><Redirect to="/home"/></Route>
                    <Route path="*"><h1>Not found</h1></Route>
                </Switch>
            </Suspense>
        </MainContext.Provider>
    );
}

export default App;

