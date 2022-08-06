import React, {  useRef, useState } from "react";
import { Menu, MenuItem,MenuHeader } from "@szhsin/react-menu";
import Datetime from "react-datetime";
import ReactFlagsSelect from "react-flags-select";
import Constants from "../../helper/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSearch, faUpload } from "@fortawesome/free-solid-svg-icons";

const SchoolForm = React.memo(({form, uiRefresh, schoolMenus, alertRef}) => {
    const formRef = useRef(form);
    const [, subRefresh] = useState(-1);
    const menuClassName = ({ state }) =>
    `box-border absolute z-50 p-5 bg-white text-gray-600 border rounded-md shadow-lg select-none focus:outline-none min-w-[8rem] ${
        state === "closed" && "hidden"
    } ${state === "opening" && "animate-fadeIn"} ${
        state === "closing" && "animate-fadeOut"
    }`;
    const menuItemClassName = ({ hover, disabled, submenu }) =>
    `focus:outline-none px-5 ${
        hover && "text-sky-b bg-white"
    }`;
    const addClass = (standard) => {
        if (!formRef.current.classes) {
            formRef.current.classes = [{standard, year: '', place: '', country: '', state: '', zipcode: ''}]
        } else {
            formRef.current.classes.push({standard, year: '', place: '', country: '', state: '', zipcode: ''});
        }
        schoolMenus.current.splice(schoolMenus.current.indexOf(standard), 1);
        subRefresh(Date.now());
    }
    const countryCallback = (code, itm, idx) => {
        itm.state = '';
        itm.country = code;
        subRefresh(Date.now());
    }
    const stateList = (country)=> {
        return country === 'US' ? [...Constants.usa] : country === 'IN' ? [...Constants.india] : [];
    }
    let inputProps = {
        placeholder: 'Year',
        className: "w-full rounded"
    };
    const yearRange = () => {
        const years = formRef.current.classes.map(i=>i.year||0);
        const min = Math.min(...years);
        const max = Math.max(...years);
        let min_val = 0, max_val = 0;
        if (min === 0 && max === 0) return <>&nbsp;</>
        if (min === 0 && max > 0) {min_val = max; max_val = max}
        else {min_val = min; max_val = max;}
        return (
            <>
            <span>{min_val}</span>
                <div className="px-2 text-center">~</div>
            <span>{max_val}</span>
            </>
        );
    }
    const removeStandard = (idx) => {
        alertRef.current.showConfirm((res)=> {
            if (res === 'no') return;
            formRef.current.classes.splice(idx, 1);
            subRefresh(Date.now());
        });
    }
    return (
        <div className="p-5 border rounded shadow-md relative">
            <i className='bx bx-x absolute right-2 top-2 text-2xl cursor-pointer'></i>
            <div className="flex justify-between items-center w-full mt-5">
                <h1 className="font-bold mr-2">{formRef.current.schoolName}</h1>
                <div>
                    <Menu
                        direction="bottom"
                        position="anchor"
                        align="center"
                        arrow
                        transition={true}
                        menuClassName={menuClassName}
                        menuButton={
                            <button 
                                className="bg-red-600 w-32 py-1.5 h-8 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500"
                            >
                                <i className='bx bx-plus mr-1 text-lg'></i> Add Class
                            </button>
                        }
                    >
                        <MenuHeader><div className="py-1"></div></MenuHeader>
                        {schoolMenus.current.map((menu, idx)=>(
                            <MenuItem className={menuItemClassName} style={{backgroundColor: "#FFF"}} key={idx}>
                                <div className="px-3 py-1 flex justify-start items-center text-sm" onClick={_=>addClass(menu)}>{menu}</div>
                            </MenuItem>
                        ))}
                        <MenuHeader><div className="py-1"></div></MenuHeader>
                    </Menu>
                </div>
            </div>
            <div className="pt-5">
                <form>
                    <div className="mb-10">
                        <label>School Name</label>
                        <input 
                            type="text" 
                            value={formRef.current.schoolName} 
                            className={`w-full rounded border ${!formRef.current.schoolName ? 'border-red-500' : 'border-gray-400'}`}
                            onChange={e=>{formRef.current.schoolName = e.currentTarget.value; subRefresh(Date.now());}}
                        />
                    </div>
                    
                    {formRef.current?.classes?.map((itm, idx)=>(
                        <React.Fragment key={idx}>
                            <React.Fragment>
                                <div className="flex w-full justify-start items-center relative">
                                    <i 
                                        className='bx bx-x absolute right-2 -top-4 text-2xl cursor-pointer text-gray-300 hover:text-red-500' 
                                        title="Remove Standard"
                                        onClick={_=>removeStandard(idx)}
                                    ></i>
                                    <div className="w-1/3 mr-5">
                                        <label>Class</label>
                                        <input type="text" value={itm.standard} className="w-full rounded" onChange={null} readOnly={true}/>
                                    </div>
                                    <div className="w-1/3 mr-5">
                                        <label>Select Year</label>
                                        <Datetime 
                                            className={`w-full rounded ${!itm.year ? 'invalidyear' : ''}`}
                                            placeholder="Year"
                                            dateFormat="YYYY"
                                            closeOnSelect={true}
                                            timeFormat={false}
                                            inputProps={inputProps} 
                                            onChange={date =>{itm.year = date.year(); subRefresh(Date.now()); }}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label>Place</label>
                                        <input 
                                            type="text" 
                                            value={itm.place} 
                                            className={`w-full rounded border ${!itm.place ? 'border-red-500' : 'border-gray-400'}`}
                                            onChange={e=>{itm.place = e.currentTarget.value; subRefresh(Date.now());}}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full justify-start items-center mt-3">
                                    <div className="w-1/3 mr-5">
                                        <label>Country</label>
                                        <ReactFlagsSelect
                                            className={`w-full rounded border ${!itm.country ? 'border-red-500' : 'border-gray-400'}`}
                                            selected={itm.country}
                                            onSelect={(code) => countryCallback(code, itm, idx)}
                                            countries={["US", "IN"]}
                                            placeholder="Country"
                                        />
                                    </div>
                                    <div className="w-1/3 mr-5">
                                        <label>State</label>
                                        <select className={`border w-full p-2 rounded ${!itm.state ? 'border-red-500' : 'border-gray-400'}`} defaultValue={itm.state} onChange={e=>{itm.state = e.currentTarget.value; subRefresh(Date.now())}}>
                                            <option value="">State</option>
                                            {stateList(itm.country).map((itm, idx)=><option key={idx} value={itm.key||itm}>{itm.name||itm}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-1/3">
                                        <label>Zip Code</label>
                                        <input 
                                            type="text" 
                                            value={itm.zip} 
                                            className={`w-full rounded border ${!itm.zipcode ? 'border-red-500' : 'border-gray-400'}`}
                                            onChange={e=>{itm.zipcode = e.currentTarget.value; subRefresh(Date.now());}}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                            <div className="pt-8 pb-5"><hr className="border-gray-400"/> </div>
                       </React.Fragment>
                    ))}
                    {formRef.current?.classes?.length > 0 && 
                    <div className="flex justify-between items-end">
                        <div className="flex">
                            <button 
                                className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex hover:bg-dodge-b"
                            ><FontAwesomeIcon icon={faUpload} className="mr-2"/>Upload</button>

                            <div className="border border-gray-400 flex justify-between items-center text-sm px-4 py-1.5 ml-3 cursor-pointer hover:bg-gray-100 hover:border-dodge-d">
                                <div>10 file(s) uploded</div>
                                <FontAwesomeIcon icon={faSearch} className="ml-2 text-dodge-d"/>
                            </div>

                        </div>
                        <div className="flex items-end">
                            <button 
                                className="bg-red-600 px-3 h-8 mr-5 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500 ml-3"
                            ><FontAwesomeIcon icon={faSave} className="mr-2"/>Save</button>
                            <div className="flex flex-col">
                                <span className="text-sm">Year of studied</span>
                                <div className="border border-gray-400 flex justify-between items-center text-sm px-4 py-1.5 font-bold">
                                    {yearRange()}
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </div>
    );
});

export default SchoolForm;