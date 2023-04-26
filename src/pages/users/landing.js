import React, { useRef, useState } from "react";
import MyLocalStorage from "../../util/mylocalStorage";

const UserLanding = React.memo(() => {
    const [, uiRefresh] = useState(-1);
    const pageRef = useRef({
        frameUrl: 'about:blank',
        showFrame: false,
    });
    const showProfile = () => {
        pageRef.current.frameUrl = `${process.env.PUBLIC_URL}/profile/student/theme_1/index.htm`;
        pageRef.current.showFrame = true;
        uiRefresh(Date.now());
    }
    const closeFrame = () => {
        pageRef.current.frameUrl = "about:blank";
        pageRef.current.showFrame = false;
        uiRefresh(Date.now());
    }
    return (
        <>
            <div className="flex flex-col px-6 w-full container mx-auto pb-5">
                <div className="mt-10">
                    <h3 className="text-2xl">Welcome {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <div className="flex flex-wrap w-full h-full mt-5 gap-x-20 gap-y-20">
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer" onClick={showProfile}>Profile</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer">Education</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer">Sports</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer">Medical</div>
                </div>
            </div>
            {pageRef.current.showFrame &&
            <div className="fixed flex justify-center w-full h-full bg-gray-700 left-0 top-0 bg-opacity-80" style={{zIndex: 99999}}>
                <div className="flex relative justify-center items-center px-6 pb-5 pt-10 bg-white" style={{width: "calc(100% - 100px)"}}>
                    <div className="close-container" onClick={closeFrame} style={{top: "-5px", right: "0px"}}>
                        <div className="leftright" style={{backgroundColor: "#000"}}></div>
                        <div className="rightleft" style={{backgroundColor: "#000"}}></div>
                        <label className="popclose">close</label>
                    </div>
                    <iframe src={pageRef.current.frameUrl} title="Profile" className="w-full h-full"></iframe>
                </div>
            </div>}
        </>
    );
});

export default UserLanding;