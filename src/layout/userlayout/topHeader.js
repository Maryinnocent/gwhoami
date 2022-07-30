import { Menu, MenuItem, MenuDivider,MenuHeader } from "@szhsin/react-menu";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "../../util/maincontext";
import MyLocalStorage from "../../util/mylocalStorage";
import '@szhsin/react-menu/dist/core.css';

const TopHeader = React.memo(() =>{
    const history = useHistory();
    const {setAuthenticated} = useContext(MainContext);
    const logout = () => {
        MyLocalStorage.empty();
        setAuthenticated(false);
        history.push('/home');
    }
    const menuClassName = ({ state }) =>
    `box-border absolute z-50 pb-3 bg-white p-1.5 text-gray-600 border rounded-md shadow-lg select-none focus:outline-none min-w-[15rem] ${
        state === "closed" && "hidden"
    } ${state === "opening" && "animate-fadeIn"} ${
        state === "closing" && "animate-fadeOut"
    }`;
    const menuItemClassName = ({ hover, disabled, submenu }) =>
    `focus:outline-none ${
        hover && "text-sky-b bg-white"
    }`;
    return (
        <header className="z-10 bg-white shadow-md dark:bg-gray-800 flex justify-center">
            <div className="container flex items-center justify-between px-6">
                <div className="home-content">
                    <i className='bx bx-menu' ></i>
                </div>
                <div className="flex items-center">
                    <div className="mr-5 relative flex">
                        <i className='bx bx-bell text-2xl text-dodge-b'></i>
                        <span aria-hidden="true" className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                    </div>
                    <Menu
                        direction="bottom"
                        position="anchor"
                        viewScroll="auto"
                        arrow
                        offsetX={-190}
                        offsetY={-3}
                        transition={true}
                        menuClassName={menuClassName}
                        menuButton={
                            <button className="focus:shadow-outline-purple focus:outline-none">
                                <div className="flex justify-center w-9 h-9 items-center bg-sky-b rounded-full">
                                    <span className="font-bold text-xs text-white">AD</span>
                                </div>
                            </button>
                        }
                    >
                        <MenuHeader className="px-5 pt-4 pb-2 flex flex-col items-start text-lg">
                            <span>Suman Savio</span>
                            <span></span>
                        </MenuHeader>
                        <MenuDivider />
                        <MenuItem className={menuItemClassName} style={{backgroundColor: "#FFF"}}>
                            <div className="px-5 py-2 flex justify-start items-center">
                                <i className='bx bxs-user-circle mr-2 text-2xl'></i><span>View Profile</span>
                            </div>
                        </MenuItem>
                        <MenuItem className={menuItemClassName} style={{backgroundColor: "#FFF"}}>
                            <div className="px-5 py-2 flex justify-start items-center">
                                <i className='bx bxs-key mr-2 text-2xl'></i><span>Change Password</span>
                            </div>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem  className={menuItemClassName} onClick={logout} style={{backgroundColor: "#FFF", borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px"}}>
                            <div className="px-5 pt-2 pb-4 flex justify-start items-center">
                                <i className='bx bxs-log-out-circle mr-2 text-2xl'></i><span>Logout</span>
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    );
});

export default TopHeader;