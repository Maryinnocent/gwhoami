const NavList = {
    user: [{
        menu: 'Home',
        icon: <i className="bx bx-grid-alt"></i>,
        sub: [
            {name: 'Home'},
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