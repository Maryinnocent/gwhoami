import React, { useCallback, useRef, useState } from "react";
import Datetime from "react-datetime";
import Constants from "../../helper/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faFileAlt, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileWord, faSave, faSearch, faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../../toast";
import { ButtonLoader } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ModalDialog from "../../component/modal/modalDialog";
import { nanoid } from "nanoid";
//import { formList } from "./formLists";
// import { UserContext } from "../../util/maincontext";
import { InputRadio } from "../../component/forms";

const MonthlyexpenseForm = React.memo(({formAmounts, form, uiRefresh, alertRef, pageData, recordIndex, monthlyexpenseAddedList }) => {
    const [ui] = useState(-1);
    const regRef = useRef({ ...Constants.user_empty_form });
    const formRef = useRef(form);
    const currentDom = useRef();
    const formAmt = useRef(formAmounts);
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
        monthlyexpenseAddedList.current[recordIndex].documents.push({ ...pageRef.current.file_record });
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
    let inputProps = {
        placeholder: 'MM/DD/YYYY',
        className: "w-full rounded"
    };
    const saveMonthlyexpense = () => {
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
        let params = isNew ? [{ _modal: 'FinancialList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $push: { 'monthlyexpense': arr } } }] :
            [{ _modal: 'FinancialList', _condition: 'update', _find: { _id: pageData.current._id, 'monthlyexpense.id': arr.id }, _data: { $set: { "monthlyexpense.$": arr } }, _options: { upsert: false } }];
        (async () => {
            const res = await apiPostCall('/api/common/common_mutiple_insert', { _list: params });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                arr.isSubmit = true;
                let newlist = [...monthlyexpenseAddedList.current];
                newlist[recordIndex] = arr;
                monthlyexpenseAddedList.current = newlist;
                pageRef.current.isSaving = false;
                formRef.current = { ...arr }
                uiRefresh(Date.now());
                ToastMessage({ type: 'success', message: 'Monthly Expense Details are added succesfully!', timeout: 1200 });
            }
        })();
    }
    const openFileUpload = () => {
        if (typeof formRef.current.saved !== 'undefined') {
            ToastMessage({ type: 'error', message: 'Save the Monthly Expense details and upload!', timeout: 1200 });
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
            monthlyexpenseAddedList.current[recordIndex].documents.splice(idx, 1);
            subRefresh(Date.now());
            apiPostCall('/api/client/delete_document', { _id: pageData.current._id, recindex: recordIndex, fileid: itm.id, filename: itm.filename });
        }, 'Confirm?', 'Are you sure to delete this file?');
    }
    const removeMonthlyexpense = () => {
        if (monthlyexpenseAddedList.current[recordIndex].saved === false) {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                monthlyexpenseAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Certificate Details?');
        } else {
            alertRef.current.showConfirm((res) => {
                if (res === 'no') return;
                let params = [{ _modal: 'FinancialList', _condition: 'update', _find: { _id: pageData.current._id }, _data: { $pull: { 'monthlyexpense': { id: formRef.current.id } } } }];
                apiPostCall('/api/common/common_mutiple_insert', { _list: params });
                monthlyexpenseAddedList.current.splice(recordIndex, 1);
                uiRefresh(Date.now());
            }, 'Confirm?', 'Are you sure to delete this Monthly Expense details?');
        }
    }






    //
    const totalExpense = (
        water
        ,trash
        ,gas
        ,transport
        ,automa
        ,carReg
        ,carIns
        ,homeMa
        ,homeIns
        ,healthCare
        ,clothing
        ,gifts
        ,charitable
        ,transportFin
        ,compFin
        ,software
        ,entertainment
        ,vacation
        ,gymFin
        ,education
        ,gaming
        ,celebration
        ,beauty
        ,propTax
        ,movie
        ,phone
        ,lifeIns
        ,membership
        ,cCard
        ,houseMain
        ,banking
        ,houseHold
        ,petCare
        ,childCare
        ,kidsActivity
        ,schoolFees
        ,weddings
        ,taxes
        ,lawnCare
        ,otherFin   ) =>{

        const total  = Number(0) 
        + Number(water)
        +Number(trash)
        +Number(gas)
        +Number(transport)
        +Number(automa)
        +Number(carReg)
        +Number(carIns)
        +Number(homeMa)
        +Number(homeIns)
        +Number(healthCare)
        +Number(clothing)
        +Number(gifts)
        +Number(charitable)
        +Number(transportFin)
        +Number(compFin)
        +Number(software)
        +Number(entertainment)
        +Number(vacation)
        +Number(gymFin)
        +Number(education)
        +Number(gaming)
        +Number(celebration)
        +Number(beauty)
        +Number(propTax)
        +Number(movie)
        +Number(phone)
        +Number(lifeIns)
        +Number(membership)
        +Number(cCard)
        +Number(houseMain)
        +Number(banking)
        +Number(houseHold)
        +Number(petCare)
        +Number(childCare)
        +Number(kidsActivity)
        +Number(schoolFees)
        +Number(weddings)
        +Number(taxes)
        +Number(lawnCare)
        +Number(otherFin);
        return total;
    }
    //


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
                    className='bx bx-x absolute right-2 top-2 text-2xl cursor-pointer text-gray-300 hover:text-red-500'
                    onClick={removeMonthlyexpense}
                ></i>
                <div className="pt-5 pb-3">
                    <form>
                    <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Water $</label>
                                <input
                                    type="number"
                                    value={formRef.current.water}
                                    className={`w-full rounded border ${!formRef.current.water ? 'border-red-500' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.water = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Trash $</label>
                                <input
                                    type="number"
                                    value={formRef.current.trash}
                                    className={`w-full rounded border ${!formRef.current.trash ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.trash = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Gas $</label>
                                <input
                                    type="number"
                                    value={formRef.current.gas}
                                    className={`w-full rounded border ${!formRef.current.gas ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.gas = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Transport $</label>
                                <input
                                    type="number"
                                    value={formRef.current.transport}
                                    className={`w-full rounded border ${!formRef.current.transport ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.transport = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Auto Ma $</label>
                                <input
                                    type="number"
                                    value={formRef.current.automa}
                                    className={`w-full rounded border ${!formRef.current.automa ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.automa = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Car Reg $</label>
                                <input
                                    type="number"
                                    value={formRef.current.carReg}
                                    className={`w-full rounded border ${!formRef.current.carReg ? 'border-red-500' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.carReg = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Car Ins $</label>
                                <input
                                    type="number"
                                    value={formRef.current.carIns}
                                    className={`w-full rounded border ${!formRef.current.carIns ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.carIns = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Home Ma $</label>
                                <input
                                    type="number"
                                    value={formRef.current.homeMa}
                                    className={`w-full rounded border ${!formRef.current.homeMa ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.homeMa = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>home Ins $</label>
                                <input
                                    type="number"
                                    value={formRef.current.homeIns}
                                    className={`w-full rounded border ${!formRef.current.homeIns ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.homeIns = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Health Care $</label>
                                <input
                                    type="number"
                                    value={formRef.current.healthCare}
                                    className={`w-full rounded border ${!formRef.current.healthCare ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.healthCare = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Clothing $</label>
                                <input
                                    type="number"
                                    value={formRef.current.clothing}
                                    className={`w-full rounded border ${!formRef.current.clothing ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.clothing = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Gifts $</label>
                                <input
                                    type="number"
                                    value={formRef.current.gifts}
                                    className={`w-full rounded border ${!formRef.current.gifts ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.gifts = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Chaitable $</label>
                                <input
                                    type="number"
                                    value={formRef.current.charitable}
                                    className={`w-full rounded border ${!formRef.current.charitable ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.charitable = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Transport $</label>
                                <input
                                    type="number"
                                    value={formRef.current.transportFin}
                                    className={`w-full rounded border ${!formRef.current.transportFin ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.transportFin = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Maintanence $</label>
                                <input
                                    type="number"
                                    value={formRef.current.compFin}
                                    className={`w-full rounded border ${!formRef.current.compFin ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.compFin = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>

                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Software $</label>
                                <input
                                    type="number"
                                    value={formRef.current.software}
                                    className={`w-full rounded border ${!formRef.current.software ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.software = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Entertainment $</label>
                                <input
                                    type="number"
                                    value={formRef.current.entertainment}
                                    className={`w-full rounded border ${!formRef.current.entertainment ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.entertainment = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Vacation $</label>
                                <input
                                    type="number"
                                    value={formRef.current.vacation}
                                    className={`w-full rounded border ${!formRef.current.vacation ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.vacation = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Gym $</label>
                                <input
                                    type="number"
                                    value={formRef.current.gymFin}
                                    className={`w-full rounded border ${!formRef.current.gymFin ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.gymFin = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Education $</label>
                                <input
                                    type="number"
                                    value={formRef.current.education}
                                    className={`w-full rounded border ${!formRef.current.education ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.education = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Gaming $</label>
                                <input
                                    type="number"
                                    value={formRef.current.gaming}
                                    className={`w-full rounded border ${!formRef.current.gaming ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.gaming = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Celebration $</label>
                                <input
                                    type="number"
                                    value={formRef.current.celebration}
                                    className={`w-full rounded border ${!formRef.current.celebration ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.celebration = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Beauty $</label>
                                <input
                                    type="number"
                                    value={formRef.current.beauty}
                                    className={`w-full rounded border ${!formRef.current.beauty ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.beauty = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Property Tax $</label>
                                <input
                                    type="number"
                                    value={formRef.current.propTax}
                                    className={`w-full rounded border ${!formRef.current.propTax ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.propTax = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Movie $</label>
                                <input
                                    type="number"
                                    value={formRef.current.movie}
                                    className={`w-full rounded border ${!formRef.current.movie ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.movie = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Phone $</label>
                                <input
                                    type="number"
                                    value={formRef.current.phone}
                                    className={`w-full rounded border ${!formRef.current.phone ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.phone = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Life Ins $</label>
                                <input
                                    type="number"
                                    value={formRef.current.lifeIns}
                                    className={`w-full rounded border ${!formRef.current.lifeIns ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.lifeIns = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Membership $</label>
                                <input
                                    type="number"
                                    value={formRef.current.membership}
                                    className={`w-full rounded border ${!formRef.current.membership ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.membership = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Credit Card $</label>
                                <input
                                    type="number"
                                    value={formRef.current.cCard}
                                    className={`w-full rounded border ${!formRef.current.cCard ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.cCard = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>House Maintan $</label>
                                <input
                                    type="number"
                                    value={formRef.current.houseMain}
                                    className={`w-full rounded border ${!formRef.current.houseMain ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.houseMain = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>Banking $</label>
                                <input
                                    type="number"
                                    value={formRef.current.banking}
                                    className={`w-full rounded border ${!formRef.current.banking ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.banking = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Household $</label>
                                <input
                                    type="number"
                                    value={formRef.current.houseHold}
                                    className={`w-full rounded border ${!formRef.current.houseHold ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.houseHold = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Pet Care $</label>
                                <input
                                    type="number"
                                    value={formRef.current.petCare}
                                    className={`w-full rounded border ${!formRef.current.petCare ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.petCare = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Child Care $</label>
                                <input
                                    type="number"
                                    value={formRef.current.childCare}
                                    className={`w-full rounded border ${!formRef.current.childCare ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.childCare = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Kids Activities $</label>
                                <input
                                    type="number"
                                    value={formRef.current.kidsActivity}
                                    className={`w-full rounded border ${!formRef.current.kidsActivity ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.kidsActivity = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/4 mr-5">
                                <label>School Fees $</label>
                                <input
                                    type="number"
                                    value={formRef.current.schoolFees}
                                    className={`w-full rounded border ${!formRef.current.schoolFees ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.schoolFees = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Weddings $</label>
                                <input
                                    type="number"
                                    value={formRef.current.weddings}
                                    className={`w-full rounded border ${!formRef.current.weddings ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.weddings = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Taxes $</label>
                                <input
                                    type="number"
                                    value={formRef.current.taxes}
                                    className={`w-full rounded border ${!formRef.current.taxes ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.taxes = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Lawn Care $</label>
                                <input
                                    type="number"
                                    value={formRef.current.lawnCare}
                                    className={`w-full rounded border ${!formRef.current.lawnCare ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.lawnCare = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/4 mr-5">
                                <label>Other $</label>
                                <input
                                    type="number"
                                    value={formRef.current.otherFin?formRef.current.otherFin : 0 }
                                    className={`w-full rounded border ${!formRef.current.otherFin ? 'border-red-500  ' : 'border-gray-400'}`}
                                    onChange={e => { formRef.current.otherFin = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>

                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                            <InputRadio 
                                styleClass="flex flex-col mb-3" 
                                formKey="optFName" 
                                formRef={regRef} 
                                ui={ui} 
                                name="optFName" 
                                label="Is this all in your $ First Name only?" 
                                values={['Yes', 'No']} 
                                required="Yes/No is required" 
                            />
                            </div>
                            <div className="w-1/3 mr-5">
                            
                            </div>
                            <div className="w-1/3">
                            
                            </div>
                        </div>

                        <div className="flex w-full justify-start items-center relative">
                            <div className="w-1/3 mr-5">
                                <label>Total $</label>
                                <input
                                    type="number"
                                    value={totalExpense(
                                        formRef.current.water,
                                        formRef.current.trash,
                                        formRef.current.gas,
                                        formRef.current.transport,
                                        formRef.current.automa,
                                        formRef.current.carReg,
                                        formRef.current.carIns,
                                        formRef.current.homeMa,
                                        formRef.current.homeIns,
                                        formRef.current.healthCare,
                                        formRef.current.clothing,
                                        formRef.current.gifts,
                                        formRef.current.charitable,
                                        formRef.current.transportFin,
                                        formRef.current.compFin,
                                        formRef.current.software,
                                        formRef.current.entertainment,
                                        formRef.current.vacation,
                                        formRef.current.gymFin,
                                        formRef.current.education,
                                        formRef.current.gaming,
                                        formRef.current.celebration,
                                        formRef.current.beauty,
                                        formRef.current.propTax,
                                        formRef.current.movie,
                                        formRef.current.phone,
                                        formRef.current.lifeIns,
                                        formRef.current.membership,
                                        formRef.current.cCard,
                                        formRef.current.houseMain,
                                        formRef.current.banking,
                                        formRef.current.houseHold,
                                        formRef.current.petCare,
                                        formRef.current.childCare,
                                        formRef.current.kidsActivity,
                                        formRef.current.schoolFees,
                                        formRef.current.weddings,
                                        formRef.current.taxes,
                                        formRef.current.lawnCare,
                                        formRef.current.otherFin,
                                    )}
                                    className={`w-full rounded border ${!formRef.current.total ? ' pointer-events-none' : 'border-blue-400'}`}
                                    onChange={e => { formRef.current.total = e.currentTarget.value; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/3 mr-5">
                                <label>Month</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.monthFin ? 'invalidMonth' : ''}`}
                                    placeholder="MM"
                                    dateFormat="MM"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.monthFin ? new Date(formRef.current.monthFin) : ''}
                                    onChange={date => { formRef.current.monthFin = date; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/3">
                            <label>Year</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.yearFin ? 'invalidYear' : ''}`}
                                    placeholder="YYYY"
                                    dateFormat="YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.yearFin ? new Date(formRef.current.yearFin) : ''}
                                    onChange={date => { formRef.current.yearFin = date; subRefresh(Date.now()); }}
                                />
                            </div>
                        </div>                        
                    
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="flex flex-col w-full">
                                <label>Comments</label>
                                <textarea
                                    className={`w-full rounded border ${!formRef.current.incomeComments ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                    placeholder="Note: Please Upload the bils"
                                    value={formRef.current.incomeComments}
                                    onChange={e => { formRef.current.incomeComments = e.currentTarget.value; subRefresh(Date.now()); }}
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
                                    onClick={saveMonthlyexpense}
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

export default MonthlyexpenseForm;