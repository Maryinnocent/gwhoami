import React, { useCallback, useRef, useState } from "react";
import Datetime from "react-datetime";
import ReactFlagsSelect from "react-flags-select";
import Constants from "../../helper/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faFileAlt, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileWord, faSave, faSearch, faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../../toast";
import { ButtonLoader } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ModalDialog from "../../component/modal/modalDialog";
import { nanoid } from "nanoid";
import { formList } from "./formLists";


// import { UserContext } from "../../util/maincontext";
//import { Checkbox } from "./checkbox";

const FinanceForm = React.memo(({ form, uiRefresh, alertRef, pageData, recordIndex, financeAddedList }) => {
   
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
        financeAddedList.current[recordIndex].documents.push({ ...pageRef.current.file_record });
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
   const countryCallback = (code, itm, idx) => {
        itm.state = '';
       itm.country = code;
       subRefresh(Date.now());
    }
    const stateList = (country) => {
        return country === 'US' ? [...Constants.usa] : country === 'IN' ? [...Constants.india] : [];
    }
    let inputProps = {
        placeholder: 'MM/DD/YYYY',
       className: "w-full rounded"
    };
    const saveFinance = () => {
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
        let params = isNew ? [{ _modal: 'CrimeList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $push: { 'finance': arr } } }] :
            [{ _modal: 'CrimeList', _condition: 'update', _find: { _id: pageData.current._id, 'finance.id': arr.id }, _data: { $set: { "finance.$": arr } }, _options: { upsert: false } }];
        (async () => {
            const res = await apiPostCall('/api/common/common_mutiple_insert', { _list: params });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                arr.isSubmit = true;
                let newlist = [...financeAddedList.current];
                newlist[recordIndex] = arr;
                financeAddedList.current = newlist;
                pageRef.current.isSaving = false;
                formRef.current = { ...arr }
                uiRefresh(Date.now());
                ToastMessage({ type: 'success', message: 'Finance crime added succesfully!', timeout: 1200 });
            }
        })();
    }
    const openFileUpload = () => {
        if (typeof formRef.current.saved !== 'undefined') {
            ToastMessage({ type: 'error', message: 'Save the Finance Crime and upload!', timeout: 1200 });
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
            financeAddedList.current[recordIndex].documents.splice(idx, 1);
            subRefresh(Date.now());
            apiPostCall('/api/client/delete_document', { _id: pageData.current._id, recindex: recordIndex, fileid: itm.id, filename: itm.filename });
        }, 'Confirm?', 'Are you sure to delete this file?');
    }
    const removeFinance = () => {
        if (financeAddedList.current[recordIndex].saved === false) {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                financeAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Finance?');
        } else {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                let params = [{ _modal: 'CrimeList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $pull: { 'finance': { id: formRef.current.id } } } }];
                apiPostCall('/api/common/common_mutiple_insert', { _list: params });
                financeAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Finance?');
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
                    onClick={removeFinance}
                ></i>
                <div className="pt-5 pb-3">
                    <form>
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5"> 
                                    <label>Finance Crime Type</label>
                                    <select
                                        className={`border w-full p-2 rounded ${!formRef.current.financeCrime? 'border-red-500 err-input' : 'border-gray-400'}`} defaultValue={formRef.current.financeCrime} onChange={e => { formRef.current.financeCrime = e.currentTarget.value; subRefresh(Date.now()) }}>
                                       <option value="">Select</option>
                                       {formList.financeCrime.map((itm, idx) => <option key={idx} value={itm.key || itm}>{itm.name || itm}</option>)}
                                    </select>
                                </div>
                            <div className="w-1/3 mr-5">
                                <label>Organization Name</label>
                                <select
                                        className={`border w-full p-2 rounded ${!formRef.current.organizationName? 'border-red-500 err-input' : 'border-gray-400'}`} defaultValue={formRef.current.organizationName} onChange={e => { formRef.current.organizationName = e.currentTarget.value; subRefresh(Date.now()) }}>
                                       <option value="">Select</option>
                                       {formList.organizationName.map((itm, idx) => <option key={idx} value={itm.key || itm}>{itm.name || itm}</option>)}
                                    </select>
                            </div>
                            <div className="w-1/3 mr-5">
                                <label>Bank Name</label>
                                <select
                                        className={`border w-full p-2 rounded ${!formRef.current.bankName? 'border-red-500 err-input' : 'border-gray-400'}`} defaultValue={formRef.current.bankName} onChange={e => { formRef.current.bankName = e.currentTarget.value; subRefresh(Date.now()) }}>
                                       <option value="">Select</option>
                                       {formList.bankName.map((itm, idx) => <option key={idx} value={itm.key || itm}>{itm.name || itm}</option>)}
                                    </select>
                                </div>
                            </div>   
                            <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>First Name</label>
                                    <input
                                        type="text"
                                        value={formRef.current.firstName}
                                        placeholder="First Name"
                                        className={`w-full rounded border ${!formRef.current.firstName ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                        onChange={e => { formRef.current.firstName = e.currentTarget.value; subRefresh(Date.now()); }}
                                    />
                            </div>
                            <div className="w-1/3 mr-5">
                                <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={formRef.current.lastName}
                                        placeholder="Second Name"
                                        className={`w-full rounded border ${!formRef.current.lastName ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                        onChange={e => { formRef.current.lastName = e.currentTarget.value; subRefresh(Date.now()); }}
                                    />
                                </div>
                            <div className="w-1/3 mr-5"> 
                                    <label>Account Number</label>
                                    <input
                                        type="text"
                                        value={formRef.current.accountNumber}
                                        placeholder="Account Number"
                                        className={`w-full rounded border ${!formRef.current.accountNumber ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                        onChange={e => { formRef.current.accountNumber = e.currentTarget.value; subRefresh(Date.now()); }}
                                    />
                                </div>
                         </div>  
                         <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                            <label>Started On</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finStartedDate ? 'invalidyear' : ''}`}
                                    placeholder="MM/DD/YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finStartedDate ? new Date(formRef.current.finStartedDate) : ''}
                                    onChange={date => { formRef.current.finStartedDate = date; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>End Date</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finEndDate ? 'invalidyear' : ''}`}
                                    placeholder="MM/DD/YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finEndDate ? new Date(formRef.current.finEndDate) : ''}
                                    onChange={date => { formRef.current.finEndDate = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5"> 
                                    <label>Location</label>
                                            <input
                                                type="text"
                                                value={formRef.current.finLocation}
                                                placeholder="Location"
                                                className={`w-full rounded border ${!formRef.current.finLocation ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                                onChange={e => { formRef.current.finLocation = e.currentTarget.value; subRefresh(Date.now()); }}
                                            />
                                </div>
                        </div> 
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>Country</label>
                                <ReactFlagsSelect
                                    className={`w-full rounded border ${!formRef.current.country ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    selected={formRef.current.country}
                                    onSelect={(code) => countryCallback(code, formRef.current)}
                                    countries={["US", "IN"]}
                                    placeholder="Country"
                                />
                            </div>
                            <div className="w-1/3 mr-5">
                                <label>State</label>
                                <select className={`border w-full p-2 rounded ${!formRef.current.state ? 'border-red-500 err-input' : 'border-gray-400'}`} defaultValue={formRef.current.state} onChange={e => { formRef.current.state = e.currentTarget.value; subRefresh(Date.now()) }}>
                                    <option value="">-- Select State --</option>
                                    {stateList(formRef.current.country).map((itm, idx) => <option key={idx} value={itm.key || itm}>{itm.name || itm}</option>)}
                                </select>
                            </div>
                            <div className="w-1/3 mr-5">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter Zip code"
                                    value={formRef.current.zipcode}
                                    className={`w-full rounded border ${!formRef.current.zipcode ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.zipcode = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finYear ? 'invalidyear' : ''}`}
                                    placeholder="MM/DD/YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finYear ? new Date(formRef.current.finYear) : ''}
                                    onChange={date => { formRef.current.finYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                 <label>Disposition</label>
                                    <input
                                        type="text"
                                        value={formRef.current.finDisposition}
                                        placeholder="Location"
                                        className={`w-full rounded border ${!formRef.current.finDisposition ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                        onChange={e => { formRef.current.finDisposition = e.currentTarget.value; subRefresh(Date.now()); }}
                                    />
                                </div>
                                <div className="w-1/3 mr-5"> 
                                </div>
                        </div> 
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>Any Bankruptcy case filled?</label>
                                <div className="flex ml-5">
                                    <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                        checked={formRef.current.isBankruptcy }
                                        onChange={e => { formRef.current.isBankruptcy = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault1">
                                        Yes
                                    </label>
                                    </div>
                                    <div class="form-check">
                                     <input
                                         class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                         checked={!formRef.current.isBankruptcy}
                                         onChange={e => { formRef.current.isBankruptcy = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault2">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finRuptcyYear ? 'invalidyear' : ''}`}
                                    placeholder="YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finRuptcyYear ? new Date(formRef.current.finRuptcyYear) : ''}
                                    onChange={date => { formRef.current.finRuptcyYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Ruptcy Details"
                                    value={formRef.current.finRuptcyDetails}
                                    className={`w-full rounded border ${!formRef.current.finRuptcyDetails ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.finRuptcyDetails = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                    </div> 
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                            <label>Any online Crime or fraud case?</label>
                                <div className="flex ml-5">
                                    <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault3" id="flexRadioDefault3"
                                        checked={formRef.current.isFraud }
                                        onChange={e => { formRef.current.isFraud = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault3">
                                        Yes
                                    </label>
                                    </div>
                                    <div class="form-check">
                                     <input
                                         class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault3" id="flexRadioDefault4"
                                         checked={!formRef.current.isFraud}
                                         onChange={e => { formRef.current.isFraud = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault4">
                                            No
                                        </label>
                                    </div>
                                    </div>
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finFraudYear ? 'invalidyear' : ''}`}
                                    placeholder="YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finFraudYear ? new Date(formRef.current.finFraudYear) : ''}
                                    onChange={date => { formRef.current.finFraudYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Fraud Details"
                                    value={formRef.current.finFraudDetails}
                                    className={`w-full rounded border ${!formRef.current.finFraudDetails ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.finFraudDetails = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                    </div> 
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>Any check bounse?</label>
                                <div className="flex ml-5">
                                    <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault5" id="flexRadioDefault5"
                                        checked={formRef.current.isCheckBounce }
                                        onChange={e => { formRef.current.isCheckBounce = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault5">
                                        Yes
                                    </label>
                                    </div>
                                    <div class="form-check">
                                     <input
                                         class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault5" id="flexRadioDefault6"
                                         checked={!formRef.current.isCheckBounce}
                                         onChange={e => { formRef.current.isCheckBounce = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault6">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finCheckBounceYear ? 'invalidyear' : ''}`}
                                    placeholder="YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finCheckBounceYear ? new Date(formRef.current.finCheckBounceYear) : ''}
                                    onChange={date => { formRef.current.finCheckBounceYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Check Bounce Details"
                                    value={formRef.current.finCheckBounceDetails}
                                    className={`w-full rounded border ${!formRef.current.finCheckBounceDetails ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.finCheckBounceDetails = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                    </div> 
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>Any Loan or Margage due?</label>
                                <div className="flex ml-5">
                                    <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault7" id="flexRadioDefault7"
                                        checked={formRef.current.isMargageDue }
                                        onChange={e => { formRef.current.isMargageDue = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault7">
                                        Yes
                                    </label>
                                    </div>
                                    <div class="form-check">
                                     <input
                                         class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault7" id="flexRadioDefault8"
                                         checked={!formRef.current.isMargageDue}
                                         onChange={e => { formRef.current.isMargageDue = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault8">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finMargageDueYear ? 'invalidyear' : ''}`}
                                    placeholder="Loan/Margage year YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finMargageDueYear ? new Date(formRef.current.finMargageDueYear) : ''}
                                    onChange={date => { formRef.current.finMargageDueYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Loan/Margage Due Details"
                                    value={formRef.current.finMargageDueDetails}
                                    className={`w-full rounded border ${!formRef.current.finMargageDueDetails ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.finMargageDueDetails = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                    </div> 
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                                <label>Any other fine or Penalty?</label>
                                <div className="flex ml-5">
                                    <div class="mr-5">
                                    <input
                                        class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault9" id="flexRadioDefault9"
                                        checked={formRef.current.isFine }
                                        onChange={e => { formRef.current.isFine = e.currentTarget.checked; subRefresh(Date.now()); }}
                                    />
                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault9">
                                        Yes
                                    </label>
                                    </div>
                                    <div class="form-check">
                                     <input
                                         class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault9" id="flexRadioDefault10"
                                         checked={!formRef.current.isFine}
                                         onChange={e => { formRef.current.isFine = !e.currentTarget.checked; subRefresh(Date.now()); }}
                                        />
                                        <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault10">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.finFineYear ? 'invalidyear' : ''}`}
                                    placeholder="Fine Year YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.finFineYear ? new Date(formRef.current.finFineYear) : ''}
                                    onChange={date => { formRef.current.finFineYear = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Fine Details"
                                    value={formRef.current.finFineDetails}
                                    className={`w-full rounded border ${!formRef.current.finFineDetails ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.finFineDetails = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                    </div> 
             <div className="flex w-full justify-start items-center mt-3">
                            <div className="flex flex-col w-full">
                                <label>Comments</label>
                                <textarea
                                    className={`w-full rounded border ${!formRef.current.financeComments ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    value={formRef.current.financeComments}
                                    onChange={e => { formRef.current.financeComments = e.currentTarget.value; subRefresh(Date.now()); }}
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
                                    onClick={saveFinance}
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

export default FinanceForm;