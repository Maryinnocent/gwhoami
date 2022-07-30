import React, { useCallback, useRef, useState } from "react";
import { InputText } from "../../component/forms";
import { Menu, MenuItem,MenuHeader } from "@szhsin/react-menu";
import Datetime from "react-datetime";

const SchoolForm = React.memo(({form, uiRefresh}) => {
    const formRef = useRef(form);
    const [, subRefresh] = useState(-1);
    const refresh = useCallback(()=>subRefresh(Date.now()), []);
    const schoolMenus = ['Pre KG', 'LKG', 'Standard I', 'Standard II','Standard III','Standard IV','Standard VI','Standard VII', 'Standard IX','Standard X','Standard XI','Standard XII'];
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
        subRefresh(Date.now());
    }
    let inputProps = {
        placeholder: 'Year',
        className: "w-full rounded"
    };
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
                        {schoolMenus.map((menu, idx)=>(
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
                    <InputText styleClass="mb-3 rounded-none" formKey="schoolName" formRef={formRef} callback={refresh} label="School Name" placeholder="School Name" required={true}/>
                    {formRef.current?.classes?.map((itm, idx)=>(
                        <React.Fragment key={idx}>
                            <div className="flex w-full justify-start items-center mt-5">
                                <div className="w-1/3 mr-3">
                                    <label>Class</label>
                                    <input type="text" value={itm.standard} className="w-full rounded" onChange={null} readOnly={true}/>
                                </div>
                                <div className="w-1/3 mr-3">
                                    <label>Select Year</label>
                                    <Datetime 
                                        className="w-full rounded" 
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
                                    <input type="text" value={itm.place} className="w-full rounded" onChange={e=>{itm.place = e.currentTarget.value; subRefresh(Date.now());}}/>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </form>
            </div>
        </div>
    );
});

export default SchoolForm;