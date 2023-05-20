import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { Animated } from "react-animated-css";
import { useMutation } from "react-query";
import { Link, useParams } from "react-router-dom";
import { PasswordCheck, TinyLoader } from "../../component/forms";
import { qPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import { HomeContext } from "../../util/maincontext";

const ForgotPassword = () => {
    const [ui, uiRefresh] = useState();
    const {menuRef} = useContext(HomeContext);
    const {Id} = useParams();
    const formData = useRef({
        username: '',
        isSubmit: false,
        verifyLoading: false,
        formChange: -1,
        showSuccess: false
    });
    const formSubmit = (e) => {
        e.preventDefault();
        formData.current.isSubmit = true;
        formData.current.formChange = Date.now();
        uiRefresh(Date.now());
    }
    const setFormValue = (e, key) => {
        formData.current[key] = e.currentTarget.value;
        uiRefresh(Date.now());
    }
    const verifyMutate = useMutation(async(postData) => await qPostCall('/api/user/verifyemail', postData));
    useEffect(()=>{
        if (formData.current.formChange === -1) return;
        if (document.querySelector('.err-input')) {
            return;
        }
        let changeURL = encodeURIComponent(`${process.env.REACT_APP_BASE_URL}/home/forgotpassword`);
        verifyMutate.mutate({changeURL, username: formData.current.username}, {
            onSuccess: data => {
                formData.current.showSuccess = true;
                uiRefresh(Date.now());
            }, onError: e=> {
                if (e?.response?.data?.message) ToastMessage({ type: "error", message: e.response.data.message, timeout: 1500 });
                else ToastMessage({ type: "error", message: e.message, timeout: 1500 });
            }
        });
        return ()=> {}
        // eslint-disable-next-line
    }, [formData.current.formChange]);
    const changeData = useRef({
        isLoading: true,
        notvalid: false,
        showPanel: false,
        isSubmit: false,
        password: '',
        password_re: '',
        formChange: -1,
        userid: '',
        removeid: '',
        changeSuccess: false
    });
    const urlCheckMutate = useMutation(async(postData) => await qPostCall('/api/common/common_search', postData));
    const passwordMutate = useMutation(async(postData) => await qPostCall('/api/user/changepassword', postData));
    useEffect(()=> {
        if (Id === 'sendlink') return;
        urlCheckMutate.mutate({_list: [{ _modal: 'PasswordChangeList', _find: { _id: Id }, _mode: 'single', _select: 'email userid' }]}, {
            onSuccess: data => {
                if (Array.isArray(data)) {
                    changeData.current.notvalid = true;
                    uiRefresh(Date.now());
                } else {
                    changeData.current.showPanel = true;
                    changeData.current.userid = data.userid;
                    changeData.current.removeid = data._id;
                    uiRefresh(Date.now());
                }
            }, onError: e=> {
                if (e?.response?.data?.message) ToastMessage({ type: "error", message: e.response.data.message, timeout: 1500 });
                else ToastMessage({ type: "error", message: e.message, timeout: 1500 });
            }
        });
        return ()=> {}
        // eslint-disable-next-line
    }, []);
    const changeSubmit = (e) => {
        e.preventDefault();
        changeData.current.isSubmit = true;
        changeData.current.formChange = Date.now();
        uiRefresh(Date.now());
    }
    useEffect(()=> {
        if (changeData.current.formChange === -1) return;
        if (document.querySelector('.mark-err')) return;
        passwordMutate.mutate({userid: changeData.current.userid, removeid: changeData.current.removeid, password: changeData.current.password}, {
            onSuccess: data => {
                changeData.current.changeSuccess = true;
                changeData.current.showPanel = false;
                uiRefresh(Date.now());
            }, onError: e=> {
                if (e?.response?.data?.message) ToastMessage({ type: "error", message: e.response.data.message, timeout: 1500 });
                else ToastMessage({ type: "error", message: e.message, timeout: 1500 });
            }
        }); 
        return ()=> {}
        // eslint-disable-next-line
    }, [changeData.current.formChange]);
    if (Id === 'sendlink')
    return (
        <div className="flex flex-col my-20 items-center">
            <Animated animateOnMount={false} isVisible={formData.current.showSuccess} className="absolute max-w-xl bg-dodge-b px-5 py-10 w-full rounded-xl flex flex-col justify-center items-center text-white">
                <span className="text-2xl">Email Send</span>
                <span className="text-xl mt-2 text-center">
                    We have send you an email with change password link. Please check your email!.<br />
                </span>
            </Animated>
            <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
                {!formData.current.showSuccess &&
                <form className="w-full" noValidate onSubmit={e=>formSubmit(e)}>
                    <div className="bg-white px-6 py-8 rounded-xl shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-left">Forgot Password</h1>
                        <div className="relative text-gray-700 mb-3">
                            <input 
                                className={`w-full h-10 pl-9 pr-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline${formData.current.isSubmit && !formData.current.username ? ' border-red-500 err-input' : ''}`} 
                                type="text"
                                placeholder="Your email address"
                                value={formData.current.username}
                                onChange={e=>setFormValue(e, 'username')}
                            />
                            <div className="absolute inset-y-0 left-1 mt-0.5 flex items-center px-2 pointer-events-none">
                                <FontAwesomeIcon 
                                    icon={faEnvelope} 
                                    className="text-xl"
                                />
                            </div>
                            {formData.current.isSubmit && !formData.current.username && <div className="absolute text-xs mt-1 text-red-500">Email is required</div>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={`h-9 px-6 m-2 text-indigo-100 transition-colors duration-150 rounded-full shadow-gray-500 focus:shadow-outline hover:bg-dodge-d bg-dodge-b shadow-md`}
                            >
                                {verifyMutate.isLoading ? <TinyLoader color="#FFF"/> : <>Submit</>}
                            </button>
                        </div>
                    </div>
                </form>}
            </div>
        </div>
    );
    else return (
        <div className="flex flex-col my-20 items-center">
            <Animated animateOnMount={false} isVisible={changeData.current.notvalid} className="absolute max-w-xl bg-red-500 px-5 py-10 w-full rounded-xl flex flex-col justify-center items-center text-white">
                <span className="text-2xl">Invalid URL Request</span>
                <span className="text-xl mt-2 text-center">
                    This is not a valid URL to reset password.
                </span>
            </Animated>
            <Animated animateOnMount={false} isVisible={changeData.current.changeSuccess} className="absolute max-w-xl bg-green-500 px-5 py-10 w-full rounded-xl flex flex-col justify-center items-center text-white">
                <span className="text-2xl">Password Change Successfully</span>
                <span className="text-xl mt-2 text-center">
                    Please click <Link to="/home/login" onClick={_=>menuRef.current.goToMenu(2)} className="text-orange-400">here</Link> to login
                </span>
            </Animated>
            {changeData.current.showPanel &&
            <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form className="w-full" noValidate onSubmit={e => changeSubmit(e)}>
                    <div className="bg-white px-6 py-8 rounded-xl shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-left">New Password</h1>
                        <div className="px-2">
                            <PasswordCheck 
                                styleClass="flex flex-col mb-4" 
                                formKey="password"
                                passwordLabel="New Password"
                                passwordRLabel="Re-type Password"
                                ui={ui} 
                                formRef={changeData} 
                                uiRefresh={ui} 
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className={`h-12 px-10 m-2 text-indigo-100 transition-colors duration-150 rounded-full shadow-gray-500 focus:shadow-outline hover:bg-dodge-d bg-dodge-b shadow-md`}
                            >
                                {passwordMutate.isLoading ? <TinyLoader color="#FFF"/> : <>Submit</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>}
        </div>
    );
}

export default React.memo(ForgotPassword);