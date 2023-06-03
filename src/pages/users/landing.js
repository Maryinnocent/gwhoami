import React, { useCallback, useEffect, useRef, useState } from "react";
import DotSpinner from "../../component/DotSpinner";
import MyLocalStorage from "../../util/mylocalStorage";

const LinkButton = (({ url, buttonText }) =>
{
    return (
        <a href="#_" className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 text-white">
            <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
            <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease">{buttonText}</span>
        </a>
    );
});

const UserLanding = React.memo(() =>
{
    const [, uiRefresh] = useState(-1);
    const pageRef = useRef({
        frameUrl: 'about:blank',
        showFrame: false,
        frameLoader: false,
    });
    const showProfile = () =>
    {
        //pageRef.current.frameUrl = `${process.env.PUBLIC_URL}/profile/student/theme_2/index.htm`;
        pageRef.current.showFrame = true;
        pageRef.current.frameLoader = true;
        pageRef.current.frameUrl = `${process.env.PUBLIC_URL}/profile/student/theme_2/index.htm`;
        uiRefresh(Date.now());
    }
    const showSport = () =>
    {
        //pageRef.current.frameUrl = `${process.env.PUBLIC_URL}/profile/student/theme_2/index.htm`;
        pageRef.current.showFrame = true;
        pageRef.current.frameLoader = true;
        pageRef.current.frameUrl = `${process.env.PUBLIC_URL}/sports/sportsactivites/theme_2/index.htm`;
        uiRefresh(Date.now());
    }
    const frameLoad = useCallback(() =>
    {
        const info = { userid: MyLocalStorage.getUserId(), public_url: process.env.PUBLIC_URL, api_url: process.env.REACT_APP_API_URL }
        frameRef.current.contentWindow.reportCall(info);
    }, []);
    useEffect(() =>
    {
        if (!pageRef.current.showFrame)
        {
            frameRef?.current?.removeEventListener('load', frameLoad);
        } else
        {
            frameRef.current.addEventListener('load', frameLoad);
            frameRef.current.setAttribute('src', pageRef.current.frameUrl);
        }
        return () => { }
        // eslint-disable-next-line
    }, [pageRef.current.showFrame]);

    useEffect(() =>
    {
        window.fromChild = function ()
        {
            pageRef.current.frameLoader = false;
            frameRef.current.classList.remove('opacity-0')
            uiRefresh(Date.now());
            frameRef.current.contentWindow.showCall();
        }
        return () =>
        {
            window.fromChild = null;
        }
    }, []);
    const closeFrame = () =>
    {
        pageRef.current.frameUrl = "about:blank";
        pageRef.current.showFrame = false;
        uiRefresh(Date.now());
    }
    const frameRef = useRef();
    return (
        <>
            <div className="flex flex-col px-6 w-full container mx-auto pb-5">
                <div className="mt-10">
                    <h3 className="text-2xl">Welcome {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <div className="flex flex-wrap w-full h-full mt-5 gap-x-20 gap-y-20">
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer" onClick={showProfile}><i className=" bx bx-user-circle xxl"> </i>  &nbsp;Profile</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer">Education</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer" onClick={showSport}>Sports</div>
                    <div className="w-56 h-40 bg-blue-700 rounded-xl flex justify-center items-center text-gray-200 homeboxshadow cursor-pointer">Medical</div>
                </div>
            </div>
            {pageRef.current.showFrame &&
                <div className="fixed flex justify-center w-full h-full bg-gray-700 left-0 top-0 bg-opacity-80" style={{ zIndex: 99999 }}>
                    <div className="flex flex-col relative justify-center items-center px-6 pb-5 bg-white" style={{ width: "calc(100% - 100px)" }}>
                        <div className="flex w-full lg:container px-20 gap-x-10 py-5">
                            <LinkButton url="" buttonText="My Profile" />
                            <LinkButton url="" buttonText="My Education" />
                        </div>
                        <div className="close-container" onClick={closeFrame} style={{ top: "-5px", right: "0px" }}>
                            <div className="leftright" style={{ backgroundColor: "#000" }}></div>
                            <div className="rightleft" style={{ backgroundColor: "#000" }}></div>
                            <label className="popclose">close</label>
                        </div>
                        {pageRef.current.frameLoader &&
                            <div className="absolute w-full h-full left-0 top-0 bg-gray-500 bg-opacity-10 flex justify-center items-center" style={{ zIndex: "99999" }}>
                                <DotSpinner />
                            </div>}
                        {/* <iframe src={pageRef.current.frameUrl} title="Profile" className="w-full h-full" ref={frameRef}></iframe> */}
                        <iframe src="about:blank" title="Profile" className="w-full h-full opacity-0" ref={frameRef}></iframe>
                    </div>
                </div>}
        </>
    );
});

export default UserLanding;