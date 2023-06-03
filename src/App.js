import React, { Suspense, useState } from 'react';
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
import { QueryClient, QueryClientProvider } from 'react-query';
//import { useBeforeunload } from 'react-beforeunload';
//import { ReactQueryDevtools } from 'react-query-devtools';
//import { ReactQueryDevtools } from 'react-query/devtools';
//import ToastMessage from './toast';
const HomeLanding = React.lazy(() => import('./layout/homelayout/homeLanding'));
const UserLanding = React.lazy(() => import('./layout/userlayout/userLanding'));
const ShoppingLanding = React.lazy(() => import('./layout/userlayout/shoppingLanding'));
//import { apiGetCall } from './helper/API';
const queryClient = new QueryClient({
    // queryCache: new QueryCache({
    //     onError: (error, query) => {
    //       if (query.state.data !== undefined) {
    //         ToastMessage({ type: "error", message: 'errpr', timeout: 1500 });
    //       }
    //     },
    // })
});
const App = () =>
{
    const [isAuthenticated, setAuthenticated] = useState(false);
    useState(() =>
    {
        setAuthenticated(MyLocalStorage.isLoggedIn());
    }, []);
    // useBeforeunload(()=> {
    //     MyLocalStorage.empty();
    //     setAuthenticated(false);
    // });

    return (
        <QueryClientProvider client={queryClient}>
            <MainContext.Provider value={{ setAuthenticated }}>
                <Suspense fallback={<div className='w-full h-full flex justify-center items-center bg-gray-300'><DotSpinner /></div>}>
                    <ToastContainer />
                    <Switch>
                        <PublicRoute path="/home" isAuthenticated={isAuthenticated} comp={HomeLanding}></PublicRoute>
                        <UserRoute path="/user" isAuthenticated={isAuthenticated} comp={UserLanding}></UserRoute>
                        <UserRoute path="/shopping" isAuthenticated={isAuthenticated} comp={ShoppingLanding}></UserRoute>
                        <Route path="/" exact><Redirect to="/home" /></Route>
                        <Route path="*"><h1>Not found</h1></Route>
                    </Switch>
                </Suspense>
            </MainContext.Provider>
            {/* <ReactQueryDevtools initialIsOpen={true}/> */}
        </QueryClientProvider>
    );
}

export default App;

