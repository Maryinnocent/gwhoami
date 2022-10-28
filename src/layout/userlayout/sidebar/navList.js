import React from "react";

const NavList = {
    user: [{
        menu: 'Home',
        icon: <i className="bx bx-grid-alt"></i>,
        sub: [
            {name: 'Home', path:"/user"},
        ]
    },{
        menu: 'Profile',
        icon: <i className="bx bxs-graduation"></i>,
        sub: [
            {name: 'Profile'},
            {name: 'General', path:"/user/profile/general"},
            {name: 'Job', path:"/user/profile/job"},
            {name: 'Business', path:"/user/profile/business"}
        ]
    },{
        menu: 'Education',
        icon: <i className="bx bxs-graduation"></i>,
        sub: [
            {name: 'Education'},
            {name: 'School', path:"/user/education/school"},
            {name: 'College', path:"/user/education/college"},
            {name: 'Others', path:"/user/education/other"}
        ]
    },{
        menu: 'Settings',
        icon: <i className="bx bx-cog"></i>,
        sub: [
            {name: 'Settings'},
        ]
    }]
}
export default NavList;