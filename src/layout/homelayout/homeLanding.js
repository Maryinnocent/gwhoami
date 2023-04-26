import React, { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useLocation } from "react-router-dom";
import NonProtectedRoutes from "../../routes/nonProctedRoute";
import { HomeContext } from "../../util/maincontext";
import HomeHeaders from "./homeHeaders";

const HomeLanding = React.memo(() => {
    const menuRef = useRef();
    const location = useLocation();
    const [showHead, setShowHead] = useState(true);
    useEffect(()=> {
        if (location.pathname.indexOf('/loginverify') !== -1) {
            setShowHead(false);
        } else if (!showHead) setShowHead(true);
        return ()=> {}
        // eslint-disable-next-line
    }, [location.pathname])
    return (
        <HomeContext.Provider value={{menuRef}}>
            <div className="bg-bgback h-full">
                {showHead && <HomeHeaders ref={menuRef}/>}
                <Scrollbars autoHide className="px-4 overflow-auto" style={{height: "calc(100% - 54px)"}}>
                    <NonProtectedRoutes/>
                </Scrollbars>
            </div>
        </HomeContext.Provider>
    );
});

export default HomeLanding;