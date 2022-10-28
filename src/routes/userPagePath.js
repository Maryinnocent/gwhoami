import { lazy } from "react";

const userPagePath = [
    {
        path: '',
        component: lazy(()=> import('../pages/users/landing')),
        exact: true
    },
    {
        path: '/profile/:tabid',
        component: lazy(()=>import('../pages/profile/index')),
        exact: true
    },
    {
        path: '/education/:tabid',
        component: lazy(()=>import('../pages/education/index')),
        exact: true
    }
    // {
    //     path: '/settings',
    //     component: lazy(()=> import('../container/user/userSettings')),
    //     exact: true
    // },
    // {
    //     path: '/singlequote/:productid',
    //     component: lazy(()=> import('../container/user/products/singleQuotation')),
    //     exact: true
    // },
    // {
    //     path: '/profile/:tabname',
    //     component: lazy(()=> import('../container/user/profile/profileHome')),
    //     exact: true
    // },
];

export default userPagePath;