import React, { useCallback, useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { CountrySelect, InputDOB, InputEmail, InputPhone, InputRadio, InputSelect, InputText, PasswordCheck } from "../component/forms";
import Constants from "../helper/Constants";
import { apiPostCall } from "../helper/API";
import ToastMessage from "../toast";

const RegisterUser = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const regRef = useRef({ ...Constants.user_empty_form });
    const stateList = useRef({
        'US': [...Constants.usa],
        'IN': [...Constants.india]
    });

    const formSubmit = (e) => {
        e.preventDefault();
        regRef.current.isSubmit = true;
        regRef.current.formChanges = Date.now();
        uiRefresh(Date.now());
        //console.log(document.querySelectorAll('.mark-err').length);
    }
    const countryCallback = useCallback(() => {
        regRef.current.state = '';
        regRef.current.phonecode = Constants.phoneCode[regRef.current.country];
        document.querySelector('#state').selectedIndex = 0;
        uiRefresh(Date.now());
    }, []);
    const stateCallback = useCallback(() => {
        uiRefresh(Date.now());
    }, []);
    const dobCallback = useCallback(() => {
        uiRefresh(Date.now());
    }, []);

    useEffect(() => {
        if (regRef.current.formChanges === -1) return;
        let first_err = document.querySelector('.mark-err');
        if (first_err) {
            first_err.scrollIntoView({ block: 'end', behavior: 'smooth' });
            return;
        }
        regRef.current.isLoading = true;
        uiRefresh(Date.now());
        let data = { ...regRef.current }
        delete data.isSubmit;
        delete data.formChanges;
        delete data.isLoading;
        //console.log(JSON.stringify(data));

        const apiCall = async () => {
            const res = await apiPostCall('/api/user/userbasicreg', { ...data });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                regRef.current.isLoading = false;
                uiRefresh(Date.now());
            } else {
                regRef.current = { ...Constants.user_empty_form }
                ToastMessage({ type: "success", message: "Registration successfull!", timeout: 1500 });
                uiRefresh(Date.now());
            }
        };
        apiCall();
    }, [regRef.current.formChanges]);
    return (
        <div className="flex flex-col my-20">
            <form noValidate onSubmit={e => formSubmit(e)}>
                <div className="container max-w-xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl items-center">Registration</h1>
                        <div>
                            <div class="flex ...">
                                <div class="w-1/2 ... ">
                                    <div class="row border border-slate-300 hover:border-red-800 ...">
                                        <div class="icon">
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <InputText styleClass="flex flex-row mb-0 " formKey="fname" formRef={regRef} uiRefresh={ui} label="" placeholder="First Name" required="required" />
                                    </div>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div class="w-1/2 ... ">
                                    <div class="row  border border-slate-300 hover:border-red-800 ...">
                                        <div class="icon">
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <InputText styleClass="flex flex-row mb-0" formKey="Lname" formRef={regRef} uiRefresh={ui} label="" placeholder="Last Name" required="required" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex ... ">
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <div class="icon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                    <InputDOB styleClass="flex flex-row mb-0" formKey="dob" ID="dob" formRef={regRef} uiRefresh={ui} label="" placeholder="DOB" required="required" callback={dobCallback} />
                                </div>
                            </div>
                            &nbsp;&nbsp;&nbsp;
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <div class="icon">
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <InputEmail styleClass="flex flex-row mb-0" formKey="username" formRef={regRef} uiRefresh={ui} label="" placeholder="Email" required="required" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <PasswordCheck styleClass="flex flex-row mb-0" formKey="password" ui={ui} formRef={regRef} uiRefresh={ui} />
                        </div>
                        <div class="flex ... ">
                            <div class="w-1/2 ... ">
                                <div class="">
                                    <CountrySelect styleClass="flex flex-row mb-4" formKey="country" formRef={regRef} uiRefresh={ui} label="" placeholder="Select country" required="required" callback={countryCallback} />
                                </div>
                            </div>
                            &nbsp;&nbsp;&nbsp;
                            <div class="w-1/2 ... ">
                                <div class="">
                                    <InputSelect styleClass="flex flex-row mb-4" formKey="state" ID="state" formRef={regRef} uiRefresh={ui} label="" options={stateList.current[regRef.current.country] || []} placeholder="Select state" required="required" callback={stateCallback} />
                                </div>
                            </div>
                        </div>

                        <div class="flex ... ">
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <InputPhone styleClass="flex flex-col mb-0" formKey="phone" ID="phone" formRef={regRef} uiRefresh={ui} label="Phone" code="phonecode" placeholder="Phone/Mobile" required="required" />
                                </div>
                            </div>
                            &nbsp;&nbsp;&nbsp;
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <div class="icon">
                                        <i class="fa fa-address-card-o"></i>
                                    </div>
                                    <InputText styleClass="flex flex-row mb-0" formKey="address" formRef={regRef} uiRefresh={ui} label="" placeholder="Address" required="required" />
                                </div>
                            </div>
                        </div>


                        <div class="flex ... ">
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <div class="icon">
                                        <i class="fa fa-map-pin"></i>
                                    </div>
                                    <InputText styleClass="flex flex-row mb-0" formKey="zipcode" formRef={regRef} uiRefresh={ui} label="" placeholder="Zip/Postal" required="required" />
                                </div>
                            </div>
                            &nbsp;&nbsp;&nbsp;
                            <div class="w-1/2 ... ">
                                <div class="row border border-slate-300 hover:border-red-800 ...">
                                    <div class="icon">
                                        <i class="fas fa-city"></i>
                                    </div>
                                    <InputText styleClass="flex flex-row mb-0" formKey="city" formRef={regRef} uiRefresh={ui} label="" placeholder="County/City" required="required" />
                                </div>
                            </div>
                        </div>
                        <InputRadio styleClass="flex flex-col mb-3" formKey="business" formRef={regRef} ui={ui} name="business" label="Individual/Business" values={['Individual', 'Business']} required="Individual/Business is required" />
                        <InputRadio styleClass="flex flex-col mb-3" formKey="gender" formRef={regRef} ui={ui} name="gender" label="Gender" values={['Male', 'Female', 'Other']} icons={[faMale, faFemale]} required="This field is required" />
                        {/* <InputSelect styleClass="flex flex-col mb-4" formKey="country" formRef={regRef} uiRefresh={ui} label="Country" options={["United State", "India"]} placeholder="Select country" required="Country is required" callback={countryCallback}/> */}
                        <InputRadio styleClass="flex flex-col mb-4" formKey="minor" formRef={regRef} ui={ui} name="minor" label="Is the user being minor (less than 18 years old)" values={['Yes', 'No']} required="This field is required" />
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
    );
});

export default RegisterUser;