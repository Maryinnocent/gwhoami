import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HomeContext, MainContext } from "../../util/maincontext";
import { apiGetCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
//import { MenuContext } from "../util/maincontext";

const LoginPage = React.memo(() => {
    const {menuRef} = useContext(HomeContext);
    const {setAuthenticated} = useContext(MainContext);
    const history = useHistory();
    const [, uiRefresh] = useState(-1);
    const passRef = useRef(null);
    const formData = useRef({
        username: '',
        password: '',
        isEyeToggle: false,
        isLoading: false,
        isSubmit: false,
        formChanges: -1
    });
    const setFormValue = (e, key) => {
        formData.current[key] = e.currentTarget.value;
        uiRefresh(Date.now());
    }
    const toggleEye = () => {
        formData.current.isEyeToggle = !formData.current.isEyeToggle;
        uiRefresh(Date.now());
    }
    const formSubmit = async(e) => {
        e.preventDefault();
        formData.current.isSubmit = true;
        formData.current.formChanges = Date.now();
        uiRefresh(Date.now());
    }
    useEffect(()=> {
        if (formData.current.formChanges === -1) return;
        if (!formData.current.username || !formData.current.password) return;
        (async()=> {
            const isEmail = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}').test(formData.current.username);
            formData.current.isLoading = true;
            uiRefresh(Date.now());
            const res = await apiGetCall(`/api/user/${isEmail ? 'logincheck' : 'adminlogincheck'}`,{username: formData.current.username, password: formData.current.password});
            if (res.isError) {
                let msg = res.Error.response?.data?.success || false;
                if (!msg) {
                    ToastMessage({ type: "error", message: "Invalid username or password", timeout: 1500 });
                } else ToastMessage({ type: "error", message: res.Error.stack, timeout: 1500 });
                formData.current.isLoading = false;
                uiRefresh(Date.now());
            } else {
                MyLocalStorage.setLoginInfo(res);
                setAuthenticated(true);
                // if (!isEmail) history.push('/admin/users');
                // else history.push('/user/home');
                //history.push('/user');
                history.push('/user/profile/general');
            }
        })();
        return () => {}
        // eslint-disable-next-line
    }, [formData.current.formChanges]);
    return (
        <div className="flex flex-col my-20">
            <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form className="w-full" noValidate onSubmit={e=>formSubmit(e)}>
                    <div className="bg-white px-6 py-8 rounded-xl shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-left">Sign In</h1>
                        <div className="relative text-gray-700 mb-8">
                            <input 
                                className={`w-full h-10 pl-9 pr-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline${formData.current.isSubmit && !formData.current.username ? ' border-red-500' : ''}`} 
                                type="text"
                                placeholder="Email"
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
                        <div className="relative text-gray-700 mb-7">
                            <input 
                                className={`w-full h-10 pl-9 pr-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline${formData.current.isSubmit && !formData.current.password ? ' border-red-500' : ''}`}
                                type={formData.current.isEyeToggle ? "text" : "password"}
                                placeholder="password"
                                value={formData.current.password}
                                ref={passRef}
                                onChange={e=>setFormValue(e, 'password')}
                            />
                            <div className="absolute inset-y-0 left-1 mt-0.5 flex items-center px-2 pointer-events-none">
                                <FontAwesomeIcon 
                                    icon={faLock} 
                                    className="text-xl"
                                />
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                <FontAwesomeIcon 
                                    icon={formData.current.isEyeToggle ? faEyeSlash : faEye} 
                                    className="text-xl opacity-50 hover:opacity-100 hover:cursor-pointer" 
                                    onClick={toggleEye}
                                />
                            </div>
                            {formData.current.isSubmit && !formData.current.password && <div className="absolute text-xs mt-1 text-red-500">Password is required</div>}
                        </div>
                        <div className="mb-5">
                            <Link 
                                to="/home/forgotpassword/sendlink" 
                                className="text-dodge-b font-bold"
                            >Forgot Password</Link>
                        </div>
                        <div className="flex justify-center mb-5">
                            <button
                                type="submit"
                                className="h-14 w-80 m-2 text-indigo-100 transition-colors duration-150 bg-dodge-b rounded-full shadow-md shadow-gray-500 focus:shadow-outline hover:bg-dodge-d flex justify-center items-center"
                                //onClick={makeLogin}
                            >
                                {formData.current.isLoading ?
                                    <div className="w-12 flex justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg></div>
                                : <>Sign In</>}
                            </button>
                        </div>
                        <div className="mb-2 text-center font-bold">
                            <span>New to whoami? </span><Link to="/home/register" onClick={_=>menuRef.current.goToMenu(3)} className="text-dodge-b">Register here</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default LoginPage;