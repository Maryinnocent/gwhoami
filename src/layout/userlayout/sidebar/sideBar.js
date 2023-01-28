import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import NavList from "./navList";

const SideBar = React.memo(() => {
    const history = useHistory();
    useEffect(()=>{
        let arrows = document.querySelectorAll('.arrow');
        let sidebar = document.querySelector('div.sidebar');
        let sidebarBtn = document.querySelector('i.bx-menu');
        Array.from(arrows).forEach(itm=> {
            itm.addEventListener('click', (e)=> {
                e.target.parentElement.parentElement.classList.toggle('showMenu');
            }, false);
        });
        sidebarBtn.addEventListener('click', (e)=> {
            sidebar.classList.toggle('close');
        }, false);
    }, []);
    const goToPage = (e, path) => {
        e.preventDefault();
        if (!path) return;
        history.push(path);
    }
    return (
        <div className="sidebar">
            <div className="logo-details">
                <i className='bx bxl-c-plus-plus'></i>
                <span className="logo_name">GWhoami</span>
            </div>
            <ul className="nav-links">
                {NavList.user.map((itm, idx)=>(
                    <React.Fragment key={itm.menu}>
                    {itm.sub.length === 1 ?
                    <li>
                        <a href="#/" onClick={e=>goToPage(e, itm.sub[0].path)}>{itm.icon}<span className="link_name">{itm.menu}</span></a>
                        <ul className="sub-menu blank">
                            <li><a href="#/" onClick={e=>goToPage(e, itm.sub[0].path)} className="link_name">{itm.sub[0].name}</a></li>
                        </ul>
                    </li>: 
                    <li>
                        <div className="icon_links">
                            <a href="#/" onClick={e=>goToPage(e, undefined)}>{itm.icon}<span className="link_name">{itm.menu}</span></a>
                            <i className='bx bxs-chevron-down arrow'></i>
                        </div>
                        <ul className="sub-menu">
                            {itm.sub.map((sub, subidx,icon)=>(
                                <React.Fragment key={sub.name}>
                                {subidx === 0 ? 
                                    <li><a href="#/" onClick={e=>goToPage(e, undefined)} className="link_name">{sub.name}</a></li> :
                                    <li><a href="#/" onClick={e=>goToPage(e, sub.path)}>{sub.icon}{sub.name}</a></li>
                                }
                                </React.Fragment>
                            ))}
                        </ul>
                    </li>}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
});

export default SideBar;