import React, { useRef, useState } from "react";
import { Animated } from "react-animated-css";
import MyLocalStorage from "../../util/mylocalStorage";

const ProfilePhoto = (({userInfo, pageInfo}) => {
    const [,formRefresh] = useState(-1);
    const uploadData = useRef({
        isUploading: false,
        showProgress: false,
        opacity: '0',
        phototick: Date.now()
    })
    const fileRef = useRef();
    const progress = useRef({value: 0});
    const progressHandler = (event) => {
		let percent = (event.loaded / event.total) * 100;
		progress.current.value = Math.round(percent);
		formRefresh(Date.now());
	}
    const completeHandler = (event) => {
        let dom = document.querySelector("div.animate-progress");
        const anim = ()=> {
            dom.removeEventListener('animationend', anim);
            uploadData.current.isUploading = false;
            let res = JSON.parse(event.currentTarget.response);
            userInfo.current.photo = res.ext;
            MyLocalStorage.setLoginInfo(userInfo.current);
            uploadData.current.phototick = Date.now();
            formRefresh(Date.now());
        }
        dom.addEventListener('animationend', anim);
        uploadData.current.showProgress = false;
        formRefresh(Date.now());
    }
    const errorHandler = (event) => {}
    const abortHandler = (event) => {}
    const uploadFile = (evt) => {
        let file = evt.currentTarget.files[0];
		if (typeof file === 'undefined') return;
        //userInfo.current.bannerPath = file.name;
        uploadData.current.isUploading = true;
        uploadData.current.showProgress = true;
        let formdata = new FormData();
        formdata.append("userid", userInfo.current._id);
        formdata.append("photo", userInfo.current.photo||'');
        formdata.append("file1", file);
        progress.current.value = 0;
        (async() => {
            var ajax = new XMLHttpRequest();
            ajax.upload.addEventListener("progress", progressHandler, false);
            ajax.addEventListener("load", completeHandler, false);
            ajax.addEventListener("error", errorHandler, false);
            ajax.addEventListener("abort", abortHandler, false);
            ajax.open("POST", process.env.REACT_APP_API_URL + '/api/client/profileupload');
            ajax.send(formdata);
        })();
    }
    if (uploadData.current.isUploading) return (
        <Animated animationOut="fadeOut" animationIn="fadeIn" className={`animate-progress`} animationOutDuration={300} animationInDuration={500} isVisible={uploadData.current.showProgress}>
            <div className="bg-gray-100 w-full flex justify-center items-center" style={{height: "180px",width: "180px"}}>
                <progress 
                    value={progress.current.value} 
                    max="100"
                    style={{width: "70%"}}
                ></progress>
            </div>
        </Animated>
    );
    else if (!userInfo.current.photo) {
        return (
            <>
            <div className="border border-gray-500 self-center flex justify-center items-center bg-center bg-no-repeat bg-contain" style={{width: "180px", height: "180px"}}>
                <button 
                    className="border border-gray-400 rounded-full text-xs w-24 h-7 bg-gray-200 opacity-60 text-black hover:bg-black hover:text-white hover:border-black hover:opacity-100"
                    onClick={_=>fileRef.current.click()}
                >Pick photo</button>
            </div>
            <input type="file" name="image_file" id="image_file" className="hidden" ref={fileRef} onChange={e=>uploadFile(e)} accept="image/png, image/gif, image/jpeg" />
            </>
        );
    } else {
        return (
        <>
        <div
            onMouseEnter={_=>{uploadData.current.opacity = '0.4'; formRefresh(Date.now);}}
            onMouseLeave={_=>{uploadData.current.opacity = '0'; formRefresh(Date.now);}}
            className="border border-gray-500 self-center flex justify-center items-center bg-center bg-no-repeat bg-contain" 
            style={{width: "180px", height: "180px", backgroundImage: `url('${process.env.REACT_APP_API_URL}/photos/${userInfo.current._id}${userInfo.current.photo}?${uploadData.current.phototick}')`}}>
            <button 
                className={`border rounded-full text-xs w-24 h-7 bg-gray-200 transition-opacity text-black`}
                onMouseEnter={_=>{uploadData.current.opacity = '1'; formRefresh(Date.now);}}
                onMouseLeave={_=>{uploadData.current.opacity = '0.4'; formRefresh(Date.now);}}
                style={{opacity: uploadData.current.opacity}}
                onClick={_=>fileRef.current.click()}
            >Pick photo</button>
        </div>
        <input type="file" name="image_file" id="image_file" className="hidden" ref={fileRef} onChange={e=>uploadFile(e)} accept="image/png, image/gif, image/jpeg" />
        </>);
    }
});

export default React.memo(ProfilePhoto);