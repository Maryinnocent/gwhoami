import { lazy } from "react";

const OpenRoutes = [
    {
        path: '',
        component: lazy(()=> import('../pages/home/homePage')),
        exact: true
    },
    {
        path: '/about',
        component: lazy(()=> import('../pages/home/aboutus')),
        exact: true
    },
    {
        path: '/login',
        component: lazy(()=> import('../pages/home/login')),
        exact: true
    },
    {
        path: '/register',
        component: lazy(()=> import('../pages/home/register')),
        exact: true
    },
    {
        path: '/forgotpassword/:Id',
        component: lazy(()=> import('../pages/home/forgotPassword')),
        exact: true
    },
    {
        path: '/loginverify/:userId',
        component: lazy(()=> import('../pages/home/loginVerify')),
        exact: true
    }
    // {
    //     path: '/verification',
    //     component: lazy(()=> import('../pages/home/mobile')),
    //     exact: true
    // }
];

export default OpenRoutes;