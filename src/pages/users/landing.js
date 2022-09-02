import React from "react";
import MyLocalStorage from "../../util/mylocalStorage";

const UserLanding = React.memo(() => {
    return (
        <div className="flex px-6 w-full container mx-auto pb-5">
            <div className="mt-10">
                <h3 className="text-2xl">Welcome {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
            </div>
        </div>
    );
});

export default UserLanding;