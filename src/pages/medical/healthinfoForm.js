import React, { useCallback, useRef, useState } from "react";
//import Datetime from "react-datetime";
//import ReactFlagsSelect from "react-flags-select";
//import Constants from "../../helper/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faFileAlt, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileWord, faSave, faSearch, faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../../toast";
import { ButtonLoader } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ModalDialog from "../../component/modal/modalDialog";
import { nanoid } from "nanoid";
import { formList } from "./formLists";
import { Checkbox } from "../medical/checkbox";

// import { UserContext } from "../../util/maincontext";
//import { Checkbox } from "./checkbox";

const HealthinfoForm = React.memo(({ form, uiRefresh, alertRef, pageData, recordIndex, healthinfoAddedList }) => {
   
    const [userinfo, setUserInfo] = useState({
        healthInfos: [],
        response: [],
      });
      
      const handleChange = (e) => {
        // Destructuring
        const { value, checked } = e.target;
        const { healthInfos } = userinfo;
          
        console.log(`${value} is ${checked}`);
         
        // Case 1 : The user checks the box
        if (checked) {
          setUserInfo({
            healthInfos: [...healthInfos, value],
            response: [...healthInfos, value],
              
          });
        }
        
        // Case 2  : The user unchecks the box
        else {
          setUserInfo({
            healthInfos: healthInfos.filter((e) => e !== value),
            response: healthInfos.filter((e) => e !== value),
          });
        }
      }

    const formRef = useRef(form);
    const currentDom = useRef();
    // const { scrollRef } = useContext(UserContext);
    const pageRef = useRef({
        isSaving: false,
        showProgressModal: false,
        selFileName: '',
        showProgress: false,
        title: '',
        file_record: {},
        showUploadWin: false
    });
    const [, subRefresh] = useState(-1);
    const progress_ref = useRef();
    const file_ref = useRef();
    const progress = useRef({ value: 0 });
    const progressHandler = (event) => {
        let percent = (event.loaded / event.total) * 100;
        progress.current.value = Math.round(percent);
        subRefresh(Date.now());
    }

    const completeHandler = (event) => {
        healthinfoAddedList.current[recordIndex].documents.push({ ...pageRef.current.file_record });
        pageRef.current.file_record = {}
        uiRefresh(Date.now());
        modalClose();
    }
    const errorHandler = (event) => { }
    const abortHandler = (event) => { }
    const fileChange = (evt) => {
        let file = evt.currentTarget.files[0];
        if (typeof file === 'undefined') return;
        pageRef.current.selFileName = file.name;
        pageRef.current.showProgress = true;
        progress.current.value = 0;
        subRefresh(Date.now());
    }
   // const countryCallback = (code, itm, idx) => {
   //     itm.state = '';
   //     itm.country = code;
   //     subRefresh(Date.now());
   // }
   // const stateList = (country) => {
   //     return country === 'US' ? [...Constants.usa] : country === 'IN' ? [...Constants.india] : [];
   // }
    //let inputProps = {
    //    placeholder: 'MM/DD/YYYY',
    //    className: "w-full rounded"
   // };
    const saveHealthinfo = () => {
        if (currentDom.current.querySelector('.err-input')) {
            ToastMessage({ type: 'error', message: `Please fill the required fields`, timeout: 1200 });
            return;
        }
        pageRef.current.isSaving = true;
        uiRefresh(Date.now());
        let arr = { ...formRef.current }
        let isNew = typeof arr['saved'] !== 'undefined';
        if (isNew) delete arr['saved'];
        delete arr['isSubmit'];
        let params = isNew ? [{ _modal: 'MedicalList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $push: { 'healthinfo': arr } } }] :
            [{ _modal: 'MedicalList', _condition: 'update', _find: { _id: pageData.current._id, 'healthinfo.id': arr.id }, _data: { $set: { "healthinfo.$": arr } }, _options: { upsert: false } }];
        (async () => {
            const res = await apiPostCall('/api/common/common_mutiple_insert', { _list: params });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                arr.isSubmit = true;
                let newlist = [...healthinfoAddedList.current];
                newlist[recordIndex] = arr;
                healthinfoAddedList.current = newlist;
                pageRef.current.isSaving = false;
                formRef.current = { ...arr }
                uiRefresh(Date.now());
                ToastMessage({ type: 'success', message: 'Healthinfo added succesfully!', timeout: 1200 });
            }
        })();
    }
    const openFileUpload = () => {
        if (typeof formRef.current.saved !== 'undefined') {
            ToastMessage({ type: 'error', message: 'Save the Healthinfo and upload!', timeout: 1200 });
            return;
        }
        pageRef.current.showProgressModal = true;
        subRefresh(Date.now());
    }
    const modalRef = useRef();
    const modalClose = useCallback((name, idx) => {
        pageRef.current.title = '';
        pageRef.current.selFileName = '';
        pageRef.current.showProgress = false;
        pageRef.current.file_record = {}
        progress.current.value = 0;
        pageRef.current.showProgressModal = !pageRef.current.showProgressModal; subRefresh(Date.now());
        // eslint-disable-next-line
    }, []);
    const modalSave = useCallback(() => {
        if (!pageRef.current.title) {
            ToastMessage({ type: 'error', message: 'Please enter title', timeout: 1000 });
            return;
        } else if (file_ref.current.files.length === 0) {
            ToastMessage({ type: 'error', message: 'Please select document to upload', timeout: 1000 });
            return;
        }
        let file = file_ref.current.files[0];
        let formdata = new FormData();
        let ext = `.${file.name.split('.').pop().toLowerCase()}`;
        let id = nanoid();
        let filename = `${id}${ext}`;
        let info = { id, filename, title: pageRef.current.title, oriname: file.name, ext }
        pageRef.current.file_record = { ...info }
        formdata.append("file1", file);
        formdata.append("file_record", JSON.stringify(info));
        formdata.append("_id", pageData.current._id);
        formdata.append("recindex", recordIndex);
        //subRefresh(Date.now());
        (async () => {
            var ajax = new XMLHttpRequest();
            ajax.upload.addEventListener("progress", progressHandler, false);
            ajax.addEventListener("load", completeHandler, false);
            ajax.addEventListener("error", errorHandler, false);
            ajax.addEventListener("abort", abortHandler, false);
            ajax.open("POST", process.env.REACT_APP_API_URL + '/api/client/document_upload');
            ajax.send(formdata);
        })();
        // eslint-disable-next-line
    }, []);
    const openfilePicker = () => {
        file_ref.current.click()
    }
    const modalViewClose = useCallback(() => {
        pageRef.current.showUploadWin = !pageRef.current.showUploadWin;
        subRefresh(Date.now());
        // eslint-disable-next-line
    }, []);
    const getFileIcon = (ext) => {
        return ext === '.pdf' ? faFilePdf :
            ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.bmp' || ext === 'gif' ? faFileImage :
                ext === '.doc' || ext === '.docx' ? faFileWord :
                    ext === '.xls' || ext === '.xlsx' ? faFileExcel :
                        ext === '.ppt' || ext === '.pptx' ? faFilePowerpoint :
                            faFile;
    }
    const downloadFile = (itm) => {
        window.location.href = `${process.env.REACT_APP_API_URL}/api/client/download_document?oriname=${itm.oriname}&filename=${itm.filename}&dt=${Date.now()}`
    }
    const removeFile = (itm, idx) => {
        alertRef.current.showConfirm((res) => {
            if (res === 'no') return;
            healthinfoAddedList.current[recordIndex].documents.splice(idx, 1);
            subRefresh(Date.now());
            apiPostCall('/api/client/delete_document', { _id: pageData.current._id, recindex: recordIndex, fileid: itm.id, filename: itm.filename });
        }, 'Confirm?', 'Are you sure to delete this file?');
    }
    const removeHealthinfo = () => {
        if (healthinfoAddedList.current[recordIndex].saved === false) {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                healthinfoAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Healthinfo?');
        } else {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                let params = [{ _modal: 'MedicalList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $pull: { 'healthinfo': { id: formRef.current.id } } } }];
                apiPostCall('/api/common/common_mutiple_insert', { _list: params });
                healthinfoAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Healthinfo?');
        }
    }
    
        
    return (
        <>
            {pageRef.current.showUploadWin &&
                <ModalDialog closeCallback={modalViewClose} title="Uploaded Documents" showSaveButton={false} cssClass="max-w-2xl" ref={modalRef}>
                    <div className="w-full">
                        <table className="table-fixed border-collapse w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="bg-blue-100 border border-gray-400 w-10 px-3 py-1 text-center">#</th>
                                    <th className="bg-blue-100 border border-gray-400 w-96 px-3">Title</th>
                                    <th className="bg-blue-100 border border-gray-400 w-24 text-center">Type</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formRef.current.documents.map((itm, idx) => (
                                    <tr key={itm.id}>
                                        <td className="border border-gray-400 w-10 px-3 py-1 text-center">{idx + 1}</td>
                                        <td className="border border-gray-400 w-96 px-3 truncate">{itm.title}</td>
                                        <td className="border border-gray-400 text-center">
                                            <FontAwesomeIcon icon={getFileIcon(itm.ext)} className="mr-2" />{itm.ext}
                                        </td>
                                        <th className="text-base">
                                            <FontAwesomeIcon icon={faDownload} onClick={_ => downloadFile(itm)} className="mr-2 hover:text-dodge-b cursor-pointer" title="Download" />
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={_ => removeFile(itm, idx)} className="hover:text-red-500 cursor-pointer" title="Remove" />
                                        </th>
                                    </tr>
                                ))}
                                {formRef.current.documents.length === 0 && <tr><td className="h-20 w-full border border-gray-400 text-center text-red-500" colSpan={3}>No document uploaded!</td><td></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </ModalDialog>}
            {pageRef.current.showProgressModal &&
                <ModalDialog closeCallback={modalClose} title="Document Upload" buttonText="Upload" saveCallback={modalSave} cssClass="max-w-xl" ref={modalRef}>
                    <div className="w-full">
                        <div className="mb-3 flex flex-col">
                            <label>Title</label>
                            <input
                                type="text"
                                value={pageRef.current.title}
                                className={`w-full rounded border py-1.5 px-2 ${!pageRef.current.title ? 'err-input border-red-500' : 'border-gray-400'}`}
                                onChange={e => { pageRef.current.title = e.currentTarget.value; subRefresh(Date.now()); }}
                            />
                        </div>
                        <div className="mb-1 flex items-center">
                            <button
                                type="button"
                                onClick={openfilePicker}
                                className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex hover:bg-dodge-b"
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />Pick document
                            </button>
                            <span className="ml-3">{pageRef.current.selFileName}</span>
                        </div>
                        <div className="">
                            <input type="file" onChange={fileChange} ref={file_ref} className="hidden" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow, image/*" />
                            {pageRef.current.showProgress && <progress value={progress.current.value} max="100" ref={progress_ref} className="h-2 w-full"></progress>}
                        </div>
                    </div>
                </ModalDialog>}
            <div className="p-5 border rounded shadow-md relative" ref={currentDom}>
                <i
                    className='bx bxs-trash absolute right-2 top-2 text-2xl cursor-pointer text-gray-300 hover:text-red-500'
                    onClick={removeHealthinfo}
                ></i>
                <div className="pt-5 pb-3">
                    <form>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/3 mr-5"> 
                            </div>
                            <div className="w-1/3 mr-5">
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Do you have any allergies?</label>
                            <div className="flex ml-5">
                                <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault1" id="flexRadioDefault1"
                                        checked={formRef.current.anyAllergies}
                                        onChange={e => { formRef.current.anyAllergies = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault1">
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault1" id="flexRadioDefault2"
                                        checked={!formRef.current.anyAllergies}
                                        onChange={e => { formRef.current.anyAllergies = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault2">
                                        No
                                    </label>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                        <div className="w-full">
                        <table className="table-fixed border-collapse w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="bg-blue-100 border border-gray-400 w-20 px-5 py-1 text-center">Condition</th>
                                    <th className="bg-blue-100 border border-gray-400 w-60 text-center">Comment</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="bg-red-100 border border-gray-400 w-20 px-5 py-1 text-center">
                                    Severe Allergies</td> 
                                
                                <td className="bg-red-100 border border-gray-400">
                                    <div className="mr-5">                                   
                                    <input
                                         type="checkbox"
                                         name="healthInfos"
                                         value="Food"
                                         id="flexCheckDefault"
                                         checked={formRef.current.food}
                                        onChange={e => { formRef.current.food = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label htmlFor="flexCheckDefault">Food</label>
                                    <input
                                        //value={userinfo.response}
                                        type="checkbox"
                                        name="healthInfos"
                                        value="Insect"
                                        id="flexCheckDefault"
                                        checked={formRef.current.insect}
                                        onChange={e => { formRef.current.insect = e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label htmlFor="flexCheckDefault">Insect</label>

                                        <input
                                         type="checkbox"
                                         name="healthInfos"
                                         value="latex"
                                         id="flexCheckDefault"
                                         checked={formRef.current.latex}
                                        onChange={e => { formRef.current.latex = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label htmlFor="flexCheckDefault">Latex</label>
                                    </div>
                                    <div className="mr-5">
                                        <h3>Prescribed?</h3> 
                                      <input
                                         type="checkbox"
                                         name="healthInfos"
                                         value="prescribed"
                                         id="flexCheckDefault"
                                         checked={formRef.current.prescribed}
                                        onChange={e => { formRef.current.prescribed = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label htmlFor="flexCheckDefault">yes</label>
                                    </div>

                                    <div className="mr-5">
                                            <h3>Injection previously given?</h3>
                                        <input
                                             class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault3" id="flexRadioDefault3"
                                            checked={formRef.current.prevInjection}
                                            onChange={e => { formRef.current.prevInjection = e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault3">
                                            Yes
                                        </label>
                                    </div>
                                <div class="form-check">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault3" id="flexRadioDefault4"
                                        checked={!formRef.current.prevInjection}
                                        onChange={e => { formRef.current.prevInjection = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault4">
                                        No
                                    </label>
                                </div>
                                <h3>Date :-----------</h3>
                                </td>  
                            </tr>
                            <tr>
                                <td className="bg-red-100 border border-gray-400 w-20 px-5 py-1 text-center">
                                    Asthma</td> 
                                   <td className="bg-red-100 border border-gray-400">
                                    <div className="mr-5">
                                        <h3>Inhaler prescribed?</h3>
                                        <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault5" id="flexRadioDefault5"
                                        checked={formRef.current.prevInhaler}
                                        onChange={e => { formRef.current.prevInhaler = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault5">
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault5" id="flexRadioDefault6"
                                        checked={!formRef.current.prevInhaler}
                                        onChange={e => { formRef.current.prevInhaler = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault6">
                                        No
                                    </label>
                                    </div>
                                    
                                    
                                    
                                    <div className="mr-5">
                                        <h3>Nebulizer Treatment prescribed?</h3>
                                       <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault7" id="flexRadioDefault7"
                                        checked={formRef.current.isNebulizer}
                                        onChange={e => { formRef.current.isNebulizer = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault7">
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault7" id="flexRadioDefault8"
                                        checked={!formRef.current.isNebulizer}
                                        onChange={e => { formRef.current.isNebulizer = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault8">
                                        No
                                    </label>

                                    </div>
                                </td>  
                            </tr>
                            <tr>
                                <td className="bg-red-100 border border-gray-400 w-20 px-5 py-1 text-center">
                                    diabetes</td> 
                                <td className="bg-red-100 border border-gray-400">
                                    <div className="mr-5">
                                        <h3>Type1</h3>
                                       <input
                                         type="checkbox"
                                         name="healthInfos"
                                         value="type1"
                                         id="flexCheckDefault"
                                         checked={formRef.current.type1}
                                         onChange={e => { formRef.current.type1 = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label htmlFor="flexCheckDefault"></label>
                                        <h3>Type2</h3>
                                        <input
                                           type="checkbox"
                                            name="healthInfos"
                                            value="type2"
                                            id="flexCheckDefault"
                                            checked={formRef.current.type2}
                                            onChange={e => { formRef.current.type2 = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                        <label htmlFor="flexCheckDefault"></label>
                                    </div>
                                    <div className="mr-5">
                                        <h3>Nebulizer Treatment prescribed?</h3>
                                        <input
                                           class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault9" id="flexRadioDefault9"
                                           checked={formRef.current.isNebulizertreat}
                                           onChange={e => { formRef.current.isNebulizertreat = e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault9">
                                           Yes
                                        </label>
                                    </div>
                                <div class="form-check">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault9" id="flexRadioDefault10"
                                        checked={!formRef.current.isNebulizertreat}
                                        onChange={e => { formRef.current.isNebulizertreat = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault10">
                                        No
                                    </label>
                                </div>
                                </td>  
                            </tr>
                            </tbody>
                            </table>
                        </div>
                        </div>
                        <div className="flex w-full justify-start mt-5 items-center relative">
                       </div>

                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="w-1/2 mr-5">
                            <input
                                        //value={userinfo.response}
                                        type="checkbox"
                                        name="healthInfos"
                                        value="cancer"
                                        id="flexCheckDefault"
                                        checked={formRef.current.cancer}
                                        onChange={e => { formRef.current.cancer = e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label htmlFor="flexCheckDefault">Cancer</label>
                            </div>

                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="fibrocis"
                                    id="flexCheckDefault"
                                    checked={formRef.current.fibrocis}
                                    onChange={e => { formRef.current.fibrocis = e.currentTarget.checked; subRefresh(Date.now()); }}
                                />
                                <label htmlFor="flexCheckDefault">Fibrocis</label>
                            </div>
                        </div>
                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="DentalOral"
                                    id="flexCheckDefault"
                                    checked={formRef.current.dentalOral}
                                    onChange={e => { formRef.current.dentalOral = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Dental/oral Health Condition</label>
                            </div>

                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="earNose"
                                    id="flexCheckDefault"
                                    checked={formRef.current.earNose}
                                    onChange={e => { formRef.current.earNose = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Ear Nose & Throat</label>
                            </div>
                        </div>
                        
                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="LungDisease"
                                    id="flexCheckDefault"
                                    checked={formRef.current.lungDecease}
                                    onChange={e => { formRef.current.lungDecease = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Lung Disease (other than Asthma)</label>
                            </div>

                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="MobileImpairment"
                                    id="flexCheckDefault"
                                    checked={formRef.current.MobileImpairment}
                                    onChange={e => { formRef.current.MobileImpairment = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Mobile Impairment</label>
                            </div>
                        </div>
                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="DietaryPreference"
                                    id="flexCheckDefault"
                                    checked={formRef.current.DietaryPreference}
                                    onChange={e => { formRef.current.DietaryPreference = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Food / Dietary Preference</label>
                            </div>

                            <div className="w-1/2 mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="Blood Disorder"
                                    id="flexCheckDefault"
                                    checked={formRef.current.bloodDisorder}
                                    onChange={e => { formRef.current.bloodDisorder = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Blood Disorder</label>
                           </div>
                        </div>
                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="Gastrointestinal"
                                    id="flexCheckDefault"
                                    checked={formRef.current.gastrointestinal}
                                    onChange={e => { formRef.current.gastrointestinal = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Gastrointestinal / Stomach / Bowel</label>
                           </div>
                        </div>
                        <div className="flex w-full justify-start ml-10 items-center relative">
                            <div className="mr-5">
                            <input
                                    //value={userinfo.response}
                                    type="checkbox"
                                    name="healthInfos"
                                    value="Hearing"
                                    id="flexCheckDefault"
                                    checked={formRef.current.hearing}
                                    onChange={e => { formRef.current.hearing = e.currentTarget.checked; subRefresh(Date.now()); }}
                                 />
                                 <label htmlFor="flexCheckDefault">Hearing Conditions Heart / Cardiovascular</label>
                           </div>
                        </div>
                                               
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="flex flex-col w-full">
                                <label>Comments/Recent Activity Weight and Length, Eye Drops, Vitamin K, Newborn Screening, Hepatities Vaccine</label>
                                <textarea
                                    className={`w-full rounded border ${!formRef.current.healthinfoComments ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    value={formRef.current.healthinfoComments}
                                    onChange={e => { formRef.current.healthinfoComments = e.currentTarget.value; subRefresh(Date.now()); }}
                                    rows={4}
                                >
                                </textarea>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-3">
                            <div className="flex">
                                <button
                                    type="button"
                                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex hover:bg-dodge-b"
                                    onClick={openFileUpload}
                                ><FontAwesomeIcon icon={faUpload} className="mr-2" />Upload</button>

                                <div
                                    onClick={modalViewClose}
                                    className="border border-gray-400 flex justify-between items-center text-sm px-4 py-1.5 ml-3 cursor-pointer hover:bg-gray-100 hover:border-dodge-d"
                                >
                                    <div>{formRef.current.documents.length} document(s) uploaded</div>
                                    <FontAwesomeIcon icon={faSearch} className="ml-2 text-dodge-d" />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={saveHealthinfo}
                                    className="bg-red-600 px-3 h-8 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500 ml-3"
                                >
                                    {pageRef.current.isSaving ? <div className="flex justify-center items-center w-12"><ButtonLoader /></div> : <><FontAwesomeIcon icon={faSave} className="mr-2" />Save</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
});

export default HealthinfoForm;