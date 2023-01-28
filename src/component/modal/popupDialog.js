//import React, {forwardRef, useEffect, useImperativeHandle} from "react";
import React from "react";

const PopupDialog = (({maxWidth="max-w-lg", width="w-full",title="Title",show=false, showCallback, children}) => {
    if (!show) return null;
    else return (
        <div className="fixed w-full w-full h-full left-0 top-0 archpan flex justify-center items-start py-16" style={{backgroundColor: "rgba(102 98 98 / 70%", zIndex: 99999}}>
            <div className={`p-5 relative bg-white ${width} archbody rounded ${maxWidth}`} style={{animation: "fadein 1s"}}>
                <div className="close-container" onClick={_=>{showCallback(false)}}>
                    <div className="leftright"></div>
                    <div className="rightleft"></div>
                    <label className="popclose">close</label>
                </div>
                <div className="text-2xl pb-2">{title}</div>
                {children}
            </div>
        </div>
    );
});

export default React.memo(PopupDialog);