import { lazy } from 'react';

const userPagePath = [
    {
        path: '',
        component: lazy(() => import('../pages/users/landing')),
        exact: true,
    },
    {
        path: '/profile/:tabid',
        component: lazy(() => import('../pages/profile/index')),
        exact: true,
    },

    {
        path: '/education/:tabid',
        component: lazy(() => import('../pages/education/index')),
        exact: true,
    },
    {
        path: '/marriage/:tabid',
        component: lazy(() => import('../pages/marriage/index')),
        exact: true,
    },
    {
        path: '/saving/:tabid',
        component: lazy(() => import('../pages/saving/index')),
        exact: true,
    },
    {
        path: '/donation/:tabid',
        component: lazy(() => import('../pages/donation/index')),
        exact: true,
    },
    {
        path: '/tax/:tabid',
        component: lazy(() => import('../pages/tax/index')),
        exact: true,
    },
    {
        path: '/medical/:tabid',
        component: lazy(() => import('../pages/medical/index')),
        exact: true,
    },
    {
        path: '/insurance/:tabid',
        component: lazy(() => import('../pages/insurance/index')),
        exact: true,
    },
    {
        path: '/properties/:tabid',
        component: lazy(() => import('../pages/properties/index')),
        exact: true,
    },
    {
        path: '/Bankcredit/:tabid',
        component: lazy(() => import('../pages/bankcredit/index')),
        exact: true,
    },
    {
        path: '/Certificates/:tabid',
        component: lazy(() => import('../pages/certificates/index')),
        exact: true,
    },
    {
        path: '/Financial/:tabid',
        component: lazy(() => import('../pages/financial/index')),
        exact: true,
    },
    {
        path: '/Crime/:tabid',
        component: lazy(() => import('../pages/crime/index')),
        exact: true,
    },
    {
        path: '/Billing/:tabid',
        component: lazy(() => import('../pages/billing/index')),
        exact: true,
    },
    {
        path: '/Memberof/:tabid',
        component: lazy(() => import('../pages/memberof/index')),
        exact: true,
    },
    {
        path: '/tree/:tabid',
        component: lazy(() => import('../pages/tree/index')),
        exact: true,
    },
    {
        path: '/sports/:tabid',
        component: lazy(() => import('../pages/sports/index')),
        exact: true,
    },

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
