import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useCallback,useRef } from "react";
import { ButtonLoader, CountrySelect, InputDOB, InputPhone, InputSelect } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import Constants from "../../helper/Constants";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import ProfilePhoto from "./profilePhoto";
const GeneralForm = (({userInfo}) => {
    const [sub, subRefresh] = useState(-1);
    const stateList = useRef({
        'US': [...Constants.usa],
        'IN': [...Constants.india]
    });
    const currentDom = useRef();
    const pageRef = useRef({isSaving: false});
    const countryCallback = useCallback(() => {
        userInfo.current.state = '';
        userInfo.current.phoneCode = Constants.phoneCode[userInfo.current.country];
        userInfo.current.phone = '';
        document.querySelector('#state').selectedIndex = 0;
        subRefresh(Date.now());
        // eslint-disable-next-line
    }, []);
    const saveGeneral = () => {
        if (currentDom.current.querySelector('.mark-err')) {
            ToastMessage({ type: 'error', message: `Please fill the required fields`, timeout: 1200 });
            return;
        }
        (async() => {
            pageRef.current.isSaving = true;
            subRefresh(Date.now());
            let list = ['titles','firstName','lastName','gender','dob','userName','country','state','phoneCode', 'phone','zipCode','nationality','language','ssnid','minor'];
            let data = list.reduce((pass, val)=> {
                pass[val] = userInfo.current[val];
                return pass;
            }, {});
            data._id = userInfo.current._id;
            await apiPostCall('/api/common/common_update',{_modal: 'UserBasicInfo',_data: data});
            pageRef.current.isSaving = false;
            subRefresh(Date.now());
            let user = MyLocalStorage.getLoginInfo();
            list.forEach(i=>user[i] = userInfo.current[i]);
            MyLocalStorage.setLoginInfo(user);
            ToastMessage({ type: 'success', message: 'Profile updated succesfully!', timeout: 1200 });
        })();
        
    }
    return (
        <div className="p-5 border rounded shadow-md relative" ref={currentDom}>
            <div className="pt-0 pb-3">
                <div className="flex justify-between items-center mb-3">
                    <div className="text-2xl">ID: {userInfo.current.accountId}</div>
                    <ProfilePhoto userInfo={userInfo}/>
                </div>
                <div className="flex flex-col gap-y-3 w-full justify-start items-start relative">
                    <div className="w-full flex gap-x-5">
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="titles" 
                                ID="titles" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Type"
                                options={['Mr.','Mrs.','Ms.','Miss.']} 
                                placeholder="Select type" 
                                required="Type is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            <label>First Name</label>
                            <input 
                                type="text" 
                                value={userInfo.current.firstName} 
                                className={`w-full rounded border ${!userInfo.current.firstName ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.firstName = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                        </div>
                        <div className="w-1/3">
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                value={userInfo.current.lastName} 
                                className={`w-full rounded border ${!userInfo.current.lastName ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.lastName = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                        </div>
                        
                    </div>
                    <div className="w-full flex gap-x-5">
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="gender" 
                                ID="gender" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Gender" 
                                options={['Male', 'Female', 'Other']} 
                                placeholder="Select gender" 
                                required="Gender is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            <InputDOB 
                                styleClass="flex flex-col" 
                                formKey="dob"
                                ID="dob" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="DOB" 
                                placeholder="DOB"
                                required="Date of birth is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            <label>Email</label>
                            <input 
                                type="text" 
                                value={userInfo.current.userName} 
                                className={`w-full rounded border ${!userInfo.current.userName ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.userName = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                        </div>
                    </div>
                    <div className="w-full flex gap-x-5">
                        <div className="w-1/3">
                            <CountrySelect
                                styleClass="flex flex-col" 
                                formKey="country" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Country" 
                                placeholder="Select country" 
                                required="Country is required" 
                                callback={countryCallback} 
                            />
                        </div>
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="state" 
                                ID="state" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="State" 
                                options={stateList.current[userInfo.current.country] || []} 
                                placeholder="Select state" 
                                required="State is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            <label>Zip Code</label>
                            <input 
                                type="text" 
                                value={userInfo.current.zipCode} 
                                className={`w-full rounded border ${!userInfo.current.zipCode ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.zipCode = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                        </div>
                    </div>
                    <div className="w-full flex gap-x-5">
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="nationality" 
                                ID="nationality" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Nationality" 
                                options={Constants.nationality} 
                                placeholder="Select nationality" 
                                required="Nationality is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="language" 
                                ID="language" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Language" 
                                options={Constants.langauges} 
                                placeholder="Select language" 
                                required="Language is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                        <div className="w-1/3">
                            {/* <label>SSN#/Tax-ID</label>
                            <input 
                                type="text" 
                                value={userInfo.current.ssnid||''} 
                                className={`w-full rounded border ${!userInfo.current.ssnid ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.ssnid = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                            {!userInfo.current.ssnid && <div className="flex justify-start items-center text-red-500 text-xs mt-1">SSN#/Tax-ID is required</div>} */}
                            <label>Address</label>
                            <input 
                                type="text" 
                                value={userInfo.current.address||''} 
                                className={`w-full rounded border ${!userInfo.current.address ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                onChange={e=>{userInfo.current.address = e.currentTarget.value; subRefresh(Date.now());}}
                            />
                            {!userInfo.current.address && <div className="flex justify-start items-center text-red-500 text-xs mt-1">SSN#/Tax-ID is required</div>}
                        </div>
                    </div>
                    <div className="w-full flex gap-x-5">
                        <div className="w-1/3">
                            <InputPhone 
                                styleClass="flex flex-col" 
                                formKey="phone" 
                                ID="phone" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Phone" 
                                code="phoneCode" 
                                placeholder="Phone/Mobile" 
                                required="Phone is required" 
                            />
                        </div>
                        <div className="w-1/3">
                            <label>Age</label>
                            <input 
                                type="text"
                                readOnly={true}
                                value={Constants.getAge(userInfo.current.dob)} 
                                className={`w-full rounded border border-gray-400`}
                                onChange={e=>{}}
                            />
                        </div>
                        <div className="w-1/3">
                            <InputSelect 
                                styleClass="flex flex-col" 
                                formKey="minor" 
                                ID="minor" 
                                formRef={userInfo} 
                                uiRefresh={sub} 
                                label="Minor?" 
                                options={['Yes','No']} 
                                placeholder="Select Minor" 
                                required="Minor is required" 
                                callback={()=>subRefresh(Date.now())} 
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <button
                        type="button"
                        onClick={saveGeneral}
                        className="bg-red-600 px-3 h-8 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500 ml-3"
                    >
                        {pageRef.current.isSaving ? <div className="flex justify-center items-center w-12"><ButtonLoader /></div> : <><FontAwesomeIcon icon={faSave} className="mr-2" />Save</>}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default React.memo(GeneralForm);