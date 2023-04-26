import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { faAddressCard, faCity, faEnvelope, faFemale, faMale, faMapPin, faUser } from "@fortawesome/free-solid-svg-icons";
import { CountrySelect, GroupEmail, GroupInput, InputDOB, InputPhone, InputRadio, InputSelect, Mode, PasswordCheck, TinyLoader } from "../../component/forms";
import Constants from "../../helper/Constants";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import { Link } from "react-router-dom";
import {Animated} from 'react-animated-css';
import { HomeContext } from "../../util/maincontext";
import { auth} from './firebaseInit';
import firebase from 'firebase/compat/app';
import 'boxicons';
import PopupDialog from "../../component/modal/popupDialog";
import ReactCodeInput from 'react-verification-code-input';
import moment from "moment";

const RegisterUser = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const {menuRef} = useContext(HomeContext);
    const regRef = useRef({ ...Constants.user_empty_form });
    const [authRes, setAuthRes] = useState('');
    const minorRef = useRef();

    const verify = useRef({
        otpLoading: false,
        verifyLoading: false,
        isOTPDone: false,
        isVerifyError: false,
        otpCompleted: false,
        codeComplete: false,
        otpPopup: false,
        verifycode: '',
        hideOtpPopup: () => {
            verify.current = {...verify.current, isOTPDone: false, isVerifyError: false, otpCompleted: false, codeComplete: false, otpPopup: false, verifyLoading: false,otpLoading: false}
            uiRefresh(Date.now());
        }
    });

    const stateList = useRef({
        'US': [...Constants.usa],
        'IN': [...Constants.india]
    });
    const [showBox, setShowBox] = useState(false);

    const formSubmit = (e) => {
        e.preventDefault();
        regRef.current.isSubmit = true;
        regRef.current.formChanges = Date.now();
        uiRefresh(Date.now());
        //console.log(document.querySelectorAll('.mark-err').length);
    }
    const countryCallback = useCallback(() => {
        regRef.current.state = '';
        regRef.current.phoneCode = Constants.phoneCode[regRef.current.country];
        document.querySelector('#state').selectedIndex = 0;
        uiRefresh(Date.now());
    }, []);
    const stateCallback = useCallback(() => {
        uiRefresh(Date.now());
    }, []);
    const dobCallback = useCallback(() => {
        regRef.current.minor =  moment().diff(regRef.current.dob, 'years') <= 17 ? "Yes" : "No";
        let doms = minorRef.current.querySelectorAll('input');
        Array.from(doms).forEach(i=>i.disabled = false);
        minorRef.current.querySelector(`input[value="${regRef.current.minor}"]`).click();
        Array.from(doms).forEach(i=>i.disabled = true);
        uiRefresh(Date.now());
    }, []);

    useEffect(()=>{
        setTimeout(()=>setShowBox(true), 1000);
    }, []);

    const submitUser = useCallback(async() => {
        regRef.current.isLoading = true;
        uiRefresh(Date.now());
        let data = { ...regRef.current }
        data.accountId = `${data.country}-${moment(data.dob).format('YYYYMMDD')}-${Math.floor(Math.random()*90000) + 10000}`
        delete data.isSubmit;
        delete data.formChanges;
        delete data.isLoading;
        const res = await apiPostCall('/api/user/userbasicreg', { ...data });
        if (res.isError) {
            ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
            regRef.current.isLoading = false;
            uiRefresh(Date.now());
        } else {
            //regRef.current = { ...Constants.user_empty_form }
            regRef.current.message = 1;
            setShowBox(true);
            uiRefresh(Date.now());
        }
    }, []);

    useEffect(() => {
        if (regRef.current.formChanges === -1) return;
        let first_err = document.querySelector('.mark-err');
        if (first_err) {
            first_err.scrollIntoView({ block: 'end', behavior: 'smooth' });
            return;
        }
        verify.current.otpPopup = true;
        uiRefresh(Date.now());
        // eslint-disable-next-line
    }, [regRef.current.formChanges]);
    const sendOTP = async () => {
        verify.current.otpLoading = true;
        uiRefresh(Date.now());
        let phone = `${regRef.current.phoneCode}${regRef.current.phone}`;
        let verify_ref = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        auth.signInWithPhoneNumber(phone, verify_ref).then((result) => {
            setAuthRes(result);
            verify.current.otpLoading = false;
            verify.current.isOTPDone = true;
            uiRefresh(Date.now());
        }).catch((err) => {
            ToastMessage({ type: "error", message: err, timeout: 2000 });
        });
    }
    const verifyOTP = async() => {
        if (authRes === null) return;
        verify.current.verifyLoading = true;
        verify.current.isVerifyError = false;
        uiRefresh(Date.now());

        authRes.confirm(verify.current.verifycode).then((result) => {
            verify.current.hideOtpPopup();
            submitUser();
        }).catch((err) => {
            verify.current.verifyLoading = false;
            verify.current.isVerifyError = true;
            uiRefresh(Date.now());
        });
    }

    if (regRef.current.message === 1) return (
        <div className="flex my-20 justify-center">
           {showBox &&  
            <Animated  isVisible={showBox} className="max-w-2xl bg-dodge-b px-5 py-10 w-full rounded-xl flex flex-col justify-center items-center text-white">
                <span className="text-2xl">Registration succesfull!</span>
                <span className="text-xl mt-2">
                    Please click <Link to="/home/login" onClick={_=>menuRef.current.goToMenu(2)} className="text-orange-400">here</Link> to login
                </span>
            </Animated>}
        </div>
    );
    else return (
        <>
        <div className="flex flex-col my-20">
            <form noValidate onSubmit={e => formSubmit(e)}>
                <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl">Registration</h1>
                        <div className="w-full flex">
                            <div className="w-1/2 px-2">
                                <GroupInput 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="firstName" formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="First Name"
                                    mode={Mode.onlyAlphabets}
                                    maxLength={30} 
                                    placeholder="First Name" 
                                    required="First Name is required" 
                                    icon={faUser} 
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <GroupInput 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="lastName" 
                                    formRef={regRef}
                                    maxLength={30} 
                                    mode={Mode.onlyAlphabets}
                                    uiRefresh={ui} label="Last Name" 
                                    placeholder="Last Name" 
                                    required="Last Name is required" 
                                    icon={faUser} 
                                />
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/2 px-2">
                                <InputDOB 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="dob"
                                    ID="dob" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="DOB" 
                                    placeholder="DOB"
                                    required="Date of birth is required" 
                                    callback={dobCallback} 
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <GroupEmail 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="userName" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="Email" 
                                    placeholder="Email" 
                                    required="Email is required" 
                                    icon={faEnvelope} 
                                />
                            </div>
                        </div>
                        <div className="px-2">
                            <PasswordCheck 
                                styleClass="flex flex-col mb-4" 
                                formKey="password" 
                                ui={ui} 
                                formRef={regRef} 
                                uiRefresh={ui} 
                            />
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/2 px-2">
                                <CountrySelect 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="country" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="Country" 
                                    placeholder="Select country" 
                                    required="Country is required" 
                                    callback={countryCallback} 
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <InputSelect 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="state" 
                                    ID="state" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="State" 
                                    options={stateList.current[regRef.current.country] || []} 
                                    placeholder="Select state" 
                                    required="State is required" 
                                    callback={stateCallback} 
                                />
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/2 px-2">
                                <GroupInput 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="address" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="Address" 
                                    placeholder="Address" 
                                    required="Address is required" 
                                    icon={faAddressCard} 
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <GroupInput 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="city" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="County/City" 
                                    placeholder="County/City" 
                                    required="County/City is required" 
                                    icon={faCity} 
                                />
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/2 px-2">
                                <GroupInput 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="zipCode" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="Zip/Postal" 
                                    placeholder="Zip/Postal" 
                                    required="Zip/Postal is required" 
                                    icon={faMapPin} 
                                />
                            </div>
                            <div className="w-1/2 px-2">
                                <InputPhone 
                                    styleClass="flex flex-col mb-4" 
                                    formKey="phone" 
                                    ID="phone" 
                                    formRef={regRef} 
                                    uiRefresh={ui} 
                                    label="Phone" 
                                    code="phoneCode" 
                                    placeholder="Phone/Mobile" 
                                    required="Phone is required" 
                                />
                            </div>
                        </div>
                        <div className="px-2">
                            <InputRadio 
                                styleClass="flex flex-col mb-3" 
                                formKey="business" 
                                formRef={regRef} 
                                ui={ui} 
                                name="business" 
                                label="Individual/Business" 
                                values={['Individual', 'Business']} 
                                required="Individual/Business is required" 
                            />
                        </div>
                        <div className="px-2">
                            <InputRadio 
                                styleClass="flex flex-col mb-3" 
                                formKey="gender" 
                                formRef={regRef} 
                                ui={ui} 
                                name="gender" 
                                label="Gender" 
                                values={['Male', 'Female', 'Other']} 
                                icons={[faMale, faFemale]} 
                                required="This field is required" 
                            />
                        </div>
                        <div className="px-2">
                            <InputRadio 
                                styleClass="flex flex-col mb-4" 
                                formKey="minor" 
                                formRef={regRef} 
                                ui={ui} 
                                name="minor"
                                label="Is the user being minor (less than 18 years old)" 
                                values={['Yes', 'No']}
                                disabled={true}
                                passRef={minorRef}
                                required="This field is required" 
                            />
                        </div>
                        <div className="flex mb-4 justify-center">
                            <button
                                className="h-14 px-12 m-2 text-indigo-100 transition-colors duration-150 bg-dodge-b rounded-full shadow-md shadow-gray-500 focus:shadow-outline hover:bg-dodge-d"
                            >
                                {regRef.current.isLoading ?
                                    <div className="w-12 flex justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg></div>
                                    : <>Submit</>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <PopupDialog 
            show={verify.current.otpPopup} 
            showCallback={verify.current.hideOtpPopup}
            title="OTP Verfication"
        >
            <div className="w-full">
                {!verify.current.isOTPDone ? <>
                <div className="absolute">
                    <div id="recaptcha-container"></div>
                </div>
                <InputPhone 
                    styleClass="flex flex-col mb-4" 
                    formKey="phone" 
                    ID="phone" 
                    formRef={regRef} 
                    uiRefresh={ui} 
                    label="Mobile No" 
                    code="phoneCode" 
                    placeholder="Phone/Mobile" 
                    required="Phone is required" 
                />
                <div className="flex justify-end">
                    <button
                        className="h-9 px-6 m-2 text-indigo-100 transition-colors duration-150 bg-dodge-b rounded-full shadow-md shadow-gray-500 focus:shadow-outline hover:bg-dodge-d"
                        onClick={sendOTP}
                    >
                        {verify.current.otpLoading ? <TinyLoader color="#FFF"/> : <>Send OTP</>}
                    </button>
                </div></> : 
                <div className="flex flex-col mb-5">
                    <label>Enter 6 digit code</label>
                    <div className="flex items-center justify-between">
                        <ReactCodeInput
                            className="codetxt"
                            fieldHeight={40} onChange={e=>{
                                if (e.length === 6) {
                                    verify.current.codeComplete = true;
                                    verify.current.verifycode = e;
                                    uiRefresh(Date.now());
                                } else if (verify.current.codeComplete) {
                                    verify.current.codeComplete = false;
                                    uiRefresh(Date.now());
                                }
                            }}
                        />
                        <button
                            className={`h-9 px-6 m-2 text-indigo-100 transition-colors duration-150 rounded-full shadow-gray-500 focus:shadow-outline hover:bg-dodge-d${verify.current.codeComplete ? ' bg-dodge-b shadow-md' : ' bg-gray-100 pointer-events-none'}`}
                            onClick={verifyOTP}
                        >
                            {verify.current.verifyLoading ? <TinyLoader color="#FFF"/> : <>Verify</>}
                        </button>
                    </div>
                    {verify.current.isVerifyError && <div className="text-xs text-red-500">Verification code not matched!</div>}
                </div>}
            </div>            
        </PopupDialog>
        </>
    );
});

export default RegisterUser;