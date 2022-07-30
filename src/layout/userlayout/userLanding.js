import React from "react";
import Scrollbars from "react-custom-scrollbars";
import UserProctedRoutes from "../../routes/userProtectedRoutes";
import { UserContext } from "../../util/maincontext";
import SideBar from "./sidebar/sideBar";
import TopHeader from "./topHeader";

const UserLanding = React.memo(() => {
    return (
        <UserContext.Provider value={{}}>
            <div>
                <SideBar/>
                <section className="home-section bg-gray-50">
                    <TopHeader/>
                    <Scrollbars autoHide className="px-4 overflow-auto" style={{height: "calc(100% - 72px)"}}>
                        <UserProctedRoutes/>
                    </Scrollbars>
                </section>
            </div>
        </UserContext.Provider>
    );
});

export default UserLanding;