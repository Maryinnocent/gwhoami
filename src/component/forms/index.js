import { faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
//import DatePicker from "react-datepicker";
//import PasswordStrengthBar from 'react-password-strength-bar';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import ReactFlagsSelect, { In, Us } from 'react-flags-select';
import PasswordStrengthBar from 'react-password-strength-bar';

export const InputText = React.memo(({styleClass, formKey, formRef, uiRefresh, label, placeholder, required="", callback=null}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? ' border-red-500' : '';
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
        if (callback) callback();
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className={`text-gray-600 mb-1${required?' required':''}`}>{label}</label>
            <input type="text" required={!!required} className={`w-full p-2 rounded${inValidBorder()}`} placeholder={placeholder} value={formRef.current[formKey]} onChange={e=>setFormVal(e)} />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const InputEmail = React.memo(({styleClass, formKey, formRef, uiRefresh, label, placeholder, required="", readonly=false, disabled=false}) => {
    const isEmail = useRef(new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}'))
    const isNotValid = () =>required && formRef.current.isSubmit && (!formRef.current[formKey] || !isEmail.current.test(formRef.current[formKey]));
    const inValidBorder = ()=>isNotValid() ? ' border-red-500' : `${disabled ? ' bg-gray-200' : ''}`;
    const errorNum = () => !formRef.current[formKey] ? 1 : !isEmail.current.test(formRef.current[formKey]) ? 2 : 0;
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className={`text-gray-600 mb-1${required?' required':''}`}>{label}</label>
            <input type="text" required={!!required} className={`w-full p-2 rounded${inValidBorder()}`} placeholder={placeholder} value={formRef.current[formKey]} onChange={e=>setFormVal(e)} readOnly={readonly} disabled={disabled} />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{errorNum() === 1 ? required : 'Invalid email address'}</div>}
        </div>
    );
});

export const InputRadio = React.memo(({styleClass="",formKey, formRef, ui, name, label, values = [], icons = [], required="", colors=[]}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border-red-500' : 'border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb-1 required">{label}</label>
            <div className="flex">
                {values.map((r, i)=> (
                    <label key={i} className={`inline-flex items-center${i > 0 ? ' ml-5' : ''}`}>
                        <input 
                            type="radio" 
                            className={`rounded-full ${inValidBorder()} text-blue-400 shadow-sm focus:border-blue-700 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50`}
                            name={name}
                            value={r}
                            defaultChecked={formRef.current[formKey] === r}
                            onChange={e=>setFormVal(e)}
                        />
                        <span className="ml-2 text-gray-600">
                            {icons[i] && <FontAwesomeIcon icon={icons[i]} className="text-2xl mr-1" style={{color: formRef.current[formKey] === r ? colors[i]||'rgb(75 85 99)' : 'rgb(75 85 99)' }} />}
                            <span>{r}</span>
                        </span>
                    </label>
                ))}
            </div>
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const InputSelect = React.memo(({styleClass, formKey, formRef, ui, label, options = [], callback = null,placeholder="", required="", ID=""}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border-red-500' : 'border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        if (callback) callback();
        else refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 required">{label}</label>
            <select className={`border ${inValidBorder()} w-full p-2 rounded`} defaultValue={formRef.current[formKey]} onChange={e=>setFormVal(e)} id={ID}>
                <option value="">{placeholder}</option>
                {options.map((itm, idx)=><option key={idx} value={itm.key||itm}>{itm.name||itm}</option>)}
            </select>
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const InputPhone = React.memo(({styleClass, formKey, formRef, ui, label, callback = null, code, placeholder="", required="", ID=""}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border-red-500' : 'border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        if (callback) callback();
        else refresh(Date.now());
    }
    const numberCheck = (evt) => {
        const charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) evt.preventDefault();
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb-1 required">{label}</label>
            <div className="flex">
                <span 
                    className={`inline-flex items-center justify-center px-3 text-sm text-gray-900 bg-gray-100 rounded-l-md border border-r-0 ${inValidBorder()} dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 w-15`}
                >
                    {formRef.current[code] === '-' ? '-' : <><span className='mr-2'>{formRef.current[code]}</span><span>{formRef.current[code] === '+1' ? <Us/> : <In/>}</span></>}
                </span>
                <input 
                    type="text" 
                    className={`rounded-none rounded-r-lg border ${inValidBorder()} text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder={placeholder}
                    value={formRef.current[formKey]}
                    onKeyPress={e=>numberCheck(e)}
                    onChange={e=>setFormVal(e)}
                />
            </div>
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const InputDOB = React.memo(({styleClass, formKey, formRef, ui, label, callback = null, code, placeholder="", required="", ID=""}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border-red-500' : 'border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (date) => {
        formRef.current[formKey] = date;
        if (callback) callback();
        else refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb-1 required">DOB</label>
            <DatePickerInput 
                onChange={date=>setFormVal(date)} 
                value={formRef.current[formKey]}
                displayFormat="MMMM/DD/YYYY" 
                showOnInputClick
                placeholder='DOB'
                maxDate={new Date()}
                className={`w-full p-0.5 rounded border ${inValidBorder()}`}
            />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const DatePicker = React.memo(({styleClass, formKey, formRef, ui, label, callback = null, code, placeholder="", required="", ID="", dateFormat="MMMM/DD/YYYY"}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border-red-500' : 'border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (date) => {
        formRef.current[formKey] = date;
        if (callback) callback();
        else refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb-1 required">{label}</label>
            <DatePickerInput 
                onChange={date=>setFormVal(date)} 
                value={formRef.current[formKey]}
                displayFormat={dateFormat}
                showOnInputClick
                placeholder={placeholder}
                maxDate={new Date()}
                className={`w-full p-0.5 rounded border ${inValidBorder()}`}
            />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const PasswordCheck = React.memo(({styleClass, formKey, formRef, ui, ID=""}) => {
    const isNotValid = () =>formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=> {
        return isNotValid() ? 'border-red-500' : (formRef.current.isSubmit && feed >=0 && feed < 2) ? 'border-red-500' : 'border-gray-400';
    }
    const [feed, setFeed] = useState(0);
    const [isEyeToggle, setEyToggle] = useState(false);
    const [isEyeToggle2, setEyToggle2] = useState(false);
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
    }
    const rePass = (e) => {
        formRef.current[`${formKey}_re`] = e.currentTarget.value;
        refresh(Date.now());
    }
    const scoreFeed = (score, feed) => {
        setFeed(score);
    }
    const comparePass = () => {
        return (formRef.current[formKey] !== formRef.current[`${formKey}_re`] );
    }
    const toggleEye = () =>setEyToggle(!isEyeToggle);
    const toggleEye2 = () =>setEyToggle2(!isEyeToggle2);
    const mouseOutToggle = ()=> {
        if (isEyeToggle) setEyToggle(false);
    }
    const mouseOutToggle2 = () => {
        if (isEyeToggle2) setEyToggle2(false);
    }
    return (
        <>
            <div className={`flex flex-col${(isNotValid() || (formRef.current.isSubmit && feed >=0 && feed < 2)) ? ' mark-err' : ''}${formRef.current[formKey].length ? '': ' mb-4'}`}>
                <label className="text-gray-600 mb-1 required">Password</label>
                <div className='relative'>
                    <input 
                        type={isEyeToggle ? "text" : "password"}
                        className={`border ${inValidBorder()} w-full py-2 pl-11 pr-10 rounded focus:border-dodge-b`} 
                        placeholder="Password"
                        value={formRef.current[formKey]}
                        maxLength={25}
                        onChange = {evt=>setFormVal(evt)}
                    />
                    <div className="absolute inset-y-0 left-1 flex items-center px-2 pointer-events-none text-gray-600"><FontAwesomeIcon icon={faLock} className="text-lg"/></div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        {/* <FontAwesomeIcon icon={isEyeToggle ? faEyeSlash : faEye} className="text-xl opacity-50 hover:opacity-100 hover:cursor-pointer" onClick={toggleEye}/> */}
                        <FontAwesomeIcon icon={faEye} className="text-xl opacity-50 hover:opacity-100 hover:cursor-pointer" onClick={toggleEye} onMouseOut={mouseOutToggle}/>
                    </div>
                </div>
                {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>Password is required</div>}
                {formRef.current[formKey].length > 0 && <PasswordStrengthBar password={formRef.current[formKey]} minLength={8} className="mt-2" onChangeScore={(score, feed)=>scoreFeed(score, feed)}/>}
            </div>
            <div className={`flex flex-col mb-4${comparePass() ? ' mark-err' : ''}`}>
                <label className="text-gray-600 mb-1 required">Re-Password</label>
                <div className='relative'>
                    <input 
                        type={isEyeToggle2 ? "text" : "password"}
                        className={`border ${comparePass() ? 'border-red-500' : 'border-gray-400'} w-full py-2 pl-11 pr-10 rounded focus:border-dodge-b`} 
                        placeholder="Re-type password"
                        value={formRef.current[`${formKey}_re`]}
                        onChange={e=>rePass(e)}
                    />
                    <div className="absolute inset-y-0 left-1 flex items-center px-2 pointer-events-none text-gray-600"><FontAwesomeIcon icon={faLock} className="text-lg"/></div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        {/* <FontAwesomeIcon icon={isEyeToggle2 ? faEyeSlash : faEye} className="text-xl opacity-50 hover:opacity-100 hover:cursor-pointer" onClick={toggleEye2}/> */}
                        <FontAwesomeIcon icon={faEye} className="text-xl opacity-50 hover:opacity-100 hover:cursor-pointer" onClick={toggleEye2} onMouseOut={mouseOutToggle2}/>
                    </div>
                </div>
                {comparePass() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>Password not matched</div>}
            </div>
        </>
    );
});

export const CountrySelect = React.memo(({styleClass, formKey, formRef, ui, label, callback = null,placeholder="", required="", ID=""}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? 'border rounded border-red-500' : 'border rounded border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (code) => {
        formRef.current[formKey] = code;
        if (callback) callback();
        else refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb required">{label}</label>
            <ReactFlagsSelect
                className={`${inValidBorder()} w-full`}
                id={ID}
                selected={formRef.current[formKey]}
                onSelect={(code) => setFormVal(code)}
                countries={["US", "IN"]}
                placeholder={placeholder}
                // customLabels={{
                //     "US": { primary: "United States", secondary: "+1" },
                //     "IN": { primary: "India", secondary: "+91" },
                // }}
            />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const GroupInput = React.memo(({styleClass, formKey, formRef, uiRefresh, label, placeholder, required="", icon=null}) => {
    const isNotValid = () =>required && formRef.current.isSubmit && !formRef.current[formKey];
    const inValidBorder = ()=>isNotValid() ? ' border-red-500' : '';
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className={`text-gray-600 mb-1${required?' required':''}`}>{label}</label>
            <div className='relative'>
                <input type="text" required={!!required} className={`w-full py-2 pl-11 pr-2 rounded${inValidBorder()}`} placeholder={placeholder} value={formRef.current[formKey]} onChange={e=>setFormVal(e)} />
                <div className="absolute inset-y-0 left-1 flex items-center px-2 pointer-events-none text-gray-600"><FontAwesomeIcon icon={icon} className="text-lg"/></div>
            </div>
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const GroupEmail = React.memo(({styleClass, formKey, formRef, uiRefresh, label, placeholder, required="", readonly=false, disabled=false, icon=null}) => {
    const isEmail = useRef(new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}'))
    const isNotValid = () =>required && formRef.current.isSubmit && (!formRef.current[formKey] || !isEmail.current.test(formRef.current[formKey]));
    const inValidBorder = ()=>isNotValid() ? ' border-red-500' : `${disabled ? ' bg-gray-200' : ''}`;
    const errorNum = () => !formRef.current[formKey] ? 1 : !isEmail.current.test(formRef.current[formKey]) ? 2 : 0;
    const [, refresh] = useState(-1);
    const setFormVal = (e) => {
        formRef.current[formKey] = e.currentTarget.value;
        refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className={`text-gray-600 mb-1${required?' required':''}`}>{label}</label>
            <div className='relative'>
                <input type="text" required={!!required} className={`w-full py-2 pl-11 pr-2 rounded${inValidBorder()}`} placeholder={placeholder} value={formRef.current[formKey]} onChange={e=>setFormVal(e)} readOnly={readonly} disabled={disabled} />
                <div className="absolute inset-y-0 left-1 flex items-center px-2 pointer-events-none text-gray-600"><FontAwesomeIcon icon={icon} className="text-lg"/></div>
            </div>
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{errorNum() === 1 ? required : 'Invalid email address'}</div>}
        </div>
    );
});

export const CountryDropdown = React.memo(({styleClass, passForm, valueKey, ui, label, callback = null, placeholder="", idx, required="" }) => {
    const isNotValid = () =>!passForm[valueKey];
    const inValidBorder = ()=>isNotValid() ? 'border rounded border-red-500' : 'border rounded border-gray-400';
    const [, refresh] = useState(-1);
    const setFormVal = (code) => {
        passForm[valueKey] = code;
        if (callback) callback(idx, passForm);
        else refresh(Date.now());
    }
    return (
        <div className={`${styleClass}${isNotValid() ? ' mark-err' : ''}`}>
            <label className="text-gray-600 mb required">{label}</label>
            <ReactFlagsSelect
                className={`${inValidBorder()} w-full`}
                selected={passForm[valueKey]}
                onSelect={(code) => setFormVal(code)}
                countries={["US", "IN"]}
                placeholder={placeholder}
                // customLabels={{
                //     "US": { primary: "United States", secondary: "+1" },
                //     "IN": { primary: "India", secondary: "+91" },
                // }}
            />
            {isNotValid() && <div className='flex justify-start items-center text-red-500 text-xs mt-1'>{required}</div>}
        </div>
    );
});

export const Spinner = React.memo(({size="50"})=>(
    <svg className="my-spinner" viewBox="0 0 50 50" style={{width: `${size}px`, height: `${size}px`}}>
        <circle className="path strokecolor" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
));

export const ButtonLoader = React.memo(() => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
));