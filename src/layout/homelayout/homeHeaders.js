import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Link, useLocation, useRouteMatch } from "react-router-dom";

const HomeHeaders = React.memo(forwardRef(({empty}, ref) => {
    const location = useLocation();
    const [, menuRefresh] = useState(-1);
    let { url } = useRouteMatch();
    useImperativeHandle(ref, ()=>({
        goToMenu(idx) {
            goTo(idx);

        }
    }));
    const menuRef = useRef({
        menu: 0,
        list: [
            {p: '/home', name: 'Home'},
            {p: '/about', name: 'About Us'},
            {p: '/login', name: 'Login'},
            {p: '/register', name: 'Register'},
            //{p: '/verification', name: 'OTP Test'}
        ]
    });
    const goTo = (idx) => {
        menuRef.current.menu = idx;
        menuRefresh(Date.now());
        document.querySelector('#menu-toggle').checked = !document.querySelector('#menu-toggle').checked;
    }
    useEffect(()=> {
        let idx = menuRef.current.list.findIndex(i=>i.p === location.pathname.replace('/home', ''));
        if (idx !== -1) {
            menuRef.current.menu = idx;
            menuRefresh(Date.now());
        }
        // eslint-disable-next-line
    }, []);
    return (
        <header className="px-6 bg-white flex flex-wrap items-center lg:py-0 py-2 sticky top-0 z-100">
            <div className="flex-1 flex justify-between items-center font-black text-gray-700">
                <div>Gwhoami</div>
            </div>
            <label htmlFor="menu-toggle" className="cursor-pointer lg:hidden block">
                <svg 
                    className="fill-current text-gray-600 hover:text-gray-800" 
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                >
                    <title>menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                </svg>
            </label>
            <input className="hidden" type="checkbox" id="menu-toggle" />
            <div className="hidden lg:flex lg:items-center lg:w-auto w-full" id="menu">
                <nav>
                    <ul className="lg:flex items-center justify-between text-sm font-medium text-gray-700 pt-4 lg:pt-0">
                        {menuRef.current.list.map((itm, idx)=>{
                            return( 
                                <li key={idx}>
                                    <Link  
                                        className={`lg:p-4 py-3 px-0 block border-b-2 border-transparent font-bold ${menuRef.current.menu === idx ? 'border-dodge-b text-dodge-b' : 'text-gray-600 hover:text-gray-900'}`} 
                                        to={idx !== 0 ? `${url}${itm.p}` : `${url}`}
                                        onClick={_=>goTo(idx)}
                                    >{itm.name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}));

export default HomeHeaders;