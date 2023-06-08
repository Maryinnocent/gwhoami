import React, { useCallback, useRef, useState } from 'react';
import Datetime from 'react-datetime';
import ReactFlagsSelect from 'react-flags-select';
import Constants from '../../helper/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faEye,
  faLaptopCode,
  faLaptopFile,
  faLock,
  faUser,
  faWind,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircleDollarToSlot,
  faBuildingNgo,
  faMoneyBills,
  faCalendarTimes,
  faMoneyBillAlt,
  faMoneyCheck,
  faAddressCard,
  faCity,
  faTreeCity,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import {
  CountrySelect,
  DatePicker,
  GroupEmail,
  GroupInput,
  InputDOB,
  InputPhone,
  InputRadio,
  InputSelect,
  InputText,
  PasswordCheck,
} from '../../component/forms';
import {
  faDownload,
  faFile,
  faFileAlt,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
  faSave,
  faSearch,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import ToastMessage from '../../toast';
import { ButtonLoader } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ModalDialog from '../../component/modal/modalDialog';
import { nanoid } from 'nanoid';
import { formList } from './formLists';
// import { UserContext } from "../../util/maincontext";
//import { InputRadio } from '../../component/forms';

const MediaForm = React.memo(
  ({
    form,
    uiRefresh,
    alertRef,
    pageData,
    recordIndex,
    constructionAddedList,
  }) => {
    const [ui] = useState(-1);
    const regRef = useRef({ ...Constants.user_empty_form });
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
      showUploadWin: false,
    });
    const [, subRefresh] = useState(-1);
    const progress_ref = useRef();
    const file_ref = useRef();
    const progress = useRef({ value: 0 });
    const progressHandler = (event) => {
      let percent = (event.loaded / event.total) * 100;
      progress.current.value = Math.round(percent);
      subRefresh(Date.now());
    };

    const completeHandler = (event) => {
        constructionAddedList.current[recordIndex].documents.push({
        ...pageRef.current.file_record,
      });
      pageRef.current.file_record = {};
      uiRefresh(Date.now());
      modalClose();
    };
    const errorHandler = (event) => {};
    const abortHandler = (event) => {};
    const fileChange = (evt) => {
      let file = evt.currentTarget.files[0];
      if (typeof file === 'undefined') return;
      pageRef.current.selFileName = file.name;
      pageRef.current.showProgress = true;
      progress.current.value = 0;
      subRefresh(Date.now());
    };
    const countryCallback = (code, itm, idx) => {
      itm.state = '';
      itm.country = code;
      subRefresh(Date.now());
    };
    const stateList = (country) => {
      return country === 'US'
        ? [...Constants.usa]
        : country === 'IN'
        ? [...Constants.india]
        : [];
    };
    let inputProps = {
      placeholder: 'MM/DD/YYYY',
      className: 'w-full rounded',
    };
    const saveConstruction = () => {
      if (currentDom.current.querySelector('.err-input')) {
        ToastMessage({
          type: 'error',
          message: `Please fill the required fields`,
          timeout: 1200,
        });
        return;
      }
      pageRef.current.isSaving = true;
      uiRefresh(Date.now());
      let arr = { ...formRef.current };
      let isNew = typeof arr['saved'] !== 'undefined';
      if (isNew) delete arr['saved'];
      delete arr['isSubmit'];
      let params = isNew
        ? [
            {
              _modal: 'MemberofList',
              _condition: 'update',
              _find: { _id: pageData.current._id },
              _data: { $push: { construction: arr } },
            },
          ]
        : [
            {
              _modal: 'MemberofList',
              _condition: 'update',
              _find: { _id: pageData.current._id, 'construction.id': arr.id },
              _data: { $set: { 'construction.$': arr } },
              _options: { upsert: false },
            },
          ];
      (async () => {
        const res = await apiPostCall('/api/common/common_mutiple_insert', {
          _list: params,
        });
        if (res.isError) {
          ToastMessage({
            type: 'error',
            message: res.Error.response.data.message,
            timeout: 2000,
          });
          return;
        } else {
          arr.isSubmit = true;
          let newlist = [...constructionAddedList.current];
          newlist[recordIndex] = arr;
          constructionAddedList.current = newlist;
          pageRef.current.isSaving = false;
          formRef.current = { ...arr };
          uiRefresh(Date.now());
          ToastMessage({
            type: 'success',
            message: 'Construction Details added succesfully!',
            timeout: 1200,
          });
        }
      })();
    };
    const openFileUpload = () => {
      if (typeof formRef.current.saved !== 'undefined') {
        ToastMessage({
          type: 'error',
          message: 'Save the Construction Details and upload!',
          timeout: 1200,
        });
        return;
      }
      pageRef.current.showProgressModal = true;
      subRefresh(Date.now());
    };
    const modalRef = useRef();
    const modalClose = useCallback((name, idx) => {
      pageRef.current.title = '';
      pageRef.current.selFileName = '';
      pageRef.current.showProgress = false;
      pageRef.current.file_record = {};
      progress.current.value = 0;
      pageRef.current.showProgressModal = !pageRef.current.showProgressModal;
      subRefresh(Date.now());
      // eslint-disable-next-line
    }, []);
    const modalSave = useCallback(() => {
      if (!pageRef.current.title) {
        ToastMessage({
          type: 'error',
          message: 'Please enter title',
          timeout: 1000,
        });
        return;
      } else if (file_ref.current.files.length === 0) {
        ToastMessage({
          type: 'error',
          message: 'Please select document to upload',
          timeout: 1000,
        });
        return;
      }
      let file = file_ref.current.files[0];
      let formdata = new FormData();
      let ext = `.${file.name.split('.').pop().toLowerCase()}`;
      let id = nanoid();
      let filename = `${id}${ext}`;
      let info = {
        id,
        filename,
        title: pageRef.current.title,
        oriname: file.name,
        ext,
      };
      pageRef.current.file_record = { ...info };
      formdata.append('file1', file);
      formdata.append('file_record', JSON.stringify(info));
      formdata.append('_id', pageData.current._id);
      formdata.append('recindex', recordIndex);
      //subRefresh(Date.now());
      (async () => {
        var ajax = new XMLHttpRequest();
        ajax.upload.addEventListener('progress', progressHandler, false);
        ajax.addEventListener('load', completeHandler, false);
        ajax.addEventListener('error', errorHandler, false);
        ajax.addEventListener('abort', abortHandler, false);
        ajax.open(
          'POST',
          process.env.REACT_APP_API_URL + '/api/client/document_upload'
        );
        ajax.send(formdata);
      })();
      // eslint-disable-next-line
    }, []);
    const openfilePicker = () => {
      file_ref.current.click();
    };
    const modalViewClose = useCallback(() => {
      pageRef.current.showUploadWin = !pageRef.current.showUploadWin;
      subRefresh(Date.now());
      // eslint-disable-next-line
    }, []);
    const getFileIcon = (ext) => {
      return ext === '.pdf'
        ? faFilePdf
        : ext === '.png' ||
          ext === '.jpg' ||
          ext === '.jpeg' ||
          ext === '.bmp' ||
          ext === 'gif'
        ? faFileImage
        : ext === '.doc' || ext === '.docx'
        ? faFileWord
        : ext === '.xls' || ext === '.xlsx'
        ? faFileExcel
        : ext === '.ppt' || ext === '.pptx'
        ? faFilePowerpoint
        : faFile;
    };
    const downloadFile = (itm) => {
      window.location.href = `${
        process.env.REACT_APP_API_URL
      }/api/client/download_document?oriname=${itm.oriname}&filename=${
        itm.filename
      }&dt=${Date.now()}`;
    };
    const removeFile = (itm, idx) => {
      alertRef.current.showConfirm(
        (res) => {
          if (res === 'no') return;
          constructionAddedList.current[recordIndex].documents.splice(idx, 1);
          subRefresh(Date.now());
          apiPostCall('/api/client/delete_document', {
            _id: pageData.current._id,
            recindex: recordIndex,
            fileid: itm.id,
            filename: itm.filename,
          });
        },
        'Confirm?',
        'Are you sure to delete this file?'
      );
    };
    const removeConstruction = () => {
      if (constructionAddedList.current[recordIndex].saved === false) {
        alertRef.current.showConfirm(
          (res) => {
            if (res === 'no') return;
            constructionAddedList.current.splice(recordIndex, 1);
            uiRefresh(Date.now());
          },
          'Confirm?',
          'Are you sure to delete this construction Details?'
        );
      } else {
        alertRef.current.showConfirm(
          (res) => {
            if (res === 'no') return;
            let params = [
              {
                _modal: 'MemberofList',
                _condition: 'update',
                _find: { _id: pageData.current._id },
                _data: { $pull: { construction: { id: formRef.current.id } } },
              },
            ];
            apiPostCall('/api/common/common_mutiple_insert', { _list: params });
            constructionAddedList.current.splice(recordIndex, 1);
            uiRefresh(Date.now());
          },
          'Confirm?',
          'Are you sure to delete this Construction  Details?'
        );
      }
    };
    return (
      <>
        {pageRef.current.showUploadWin && (
          <ModalDialog
            closeCallback={modalViewClose}
            title="Uploaded Documents"
            showSaveButton={false}
            cssClass="max-w-2xl"
            ref={modalRef}
          >
            <div className="w-full">
              <table className="table-fixed border-collapse w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-blue-100 border border-gray-400 w-10 px-3 py-1 text-center">
                      #
                    </th>
                    <th className="bg-blue-100 border border-gray-400 w-96 px-3">
                      Title
                    </th>
                    <th className="bg-blue-100 border border-gray-400 w-24 text-center">
                      Type
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {formRef.current.documents.map((itm, idx) => (
                    <tr key={itm.id}>
                      <td className="border border-gray-400 w-10 px-3 py-1 text-center">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-400 w-96 px-3 truncate">
                        {itm.title}
                      </td>
                      <td className="border border-gray-400 text-center">
                        <FontAwesomeIcon
                          icon={getFileIcon(itm.ext)}
                          className="mr-2"
                        />
                        {itm.ext}
                      </td>
                      <th className="text-base">
                        <FontAwesomeIcon
                          icon={faDownload}
                          onClick={(_) => downloadFile(itm)}
                          className="mr-2 hover:text-dodge-b cursor-pointer"
                          title="Download"
                        />
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          onClick={(_) => removeFile(itm, idx)}
                          className="hover:text-red-500 cursor-pointer"
                          title="Remove"
                        />
                      </th>
                    </tr>
                  ))}
                  {formRef.current.documents.length === 0 && (
                    <tr>
                      <td
                        className="h-20 w-full border border-gray-400 text-center text-red-500"
                        colSpan={3}
                      >
                        No document uploaded!
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ModalDialog>
        )}
        {pageRef.current.showProgressModal && (
          <ModalDialog
            closeCallback={modalClose}
            title="Document Upload"
            buttonText="Upload"
            saveCallback={modalSave}
            cssClass="max-w-xl"
            ref={modalRef}
          >
            <div className="w-full">
              <div className="mb-3 flex flex-col">
                <label>Title</label>
                <input
                  type="text"
                  value={pageRef.current.title}
                  className={`w-full rounded border py-1.5 px-2 ${
                    !pageRef.current.title
                      ? 'err-input border-red-500'
                      : 'border-gray-400'
                  }`}
                  onChange={(e) => {
                    pageRef.current.title = e.currentTarget.value;
                    subRefresh(Date.now());
                  }}
                />
              </div>
              <div className="mb-1 flex items-center">
                <button
                  type="button"
                  onClick={openfilePicker}
                  className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex hover:bg-dodge-b"
                >
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Pick document
                </button>
                <span className="ml-3">{pageRef.current.selFileName}</span>
              </div>
              <div className="">
                <input
                  type="file"
                  onChange={fileChange}
                  ref={file_ref}
                  className="hidden"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow, image/*"
                />
                {pageRef.current.showProgress && (
                  <progress
                    value={progress.current.value}
                    max="100"
                    ref={progress_ref}
                    className="h-2 w-full"
                  ></progress>
                )}
              </div>
            </div>
          </ModalDialog>
        )}
        <div className="p-5 border rounded shadow-md relative" ref={currentDom}>
          <i
            className="bx bx-x absolute right-2 top-2 text-2xl cursor-pointer text-gray-300 hover:text-red-500"
            onClick={removeConstruction}
          ></i>
          <div className="pt-5 pb-3">
            <form>
            <div className="flex w-full justify-start items-center mt-3">
                             <div className="w-1/3 mr-5">
                        <InputSelect
                    styleClass="flex flex-col mb-4"
                    formKey="comGroupName"
                    ID="comGroupName"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Group Name"
                    placeholder="--Select--"
                    options={formList.comGroupName}
                    required="Group Name is required"
                  />
               
                </div>
                <div className="w-1/3 mr-5">
                        <InputSelect
                    styleClass="flex flex-col mb-4"
                    formKey="comGroupType"
                    ID="comGroupType"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Group Type"
                    placeholder="--Select--"
                    options={formList.comGroupType}
                    required="Group Type is required"
                  />
               
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="comOrgName"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Organization Name"
                    placeholder="Organization Name"
                    required="COrganization Name # is required"
                    icon={faUser}
                  />
                </div>
                      </div>
                           
                         <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">
                            <label>Group Since</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.comGroupSince ? 'invalidyear' : ''}`}
                                    placeholder="MM/DD/YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.comGroupSince ? new Date(formRef.current.comGroupSince) : ''}
                                    onChange={date => { formRef.current.comGroupSince = date; subRefresh(Date.now()); }}
                                />
                            </div>
                            <div className="w-1/3 mr-5">
                            <label>Member of Since</label>
                                <Datetime
                                    className={`w-full rounded ${!formRef.current.comMemberSince? 'invalidyear' : ''}`}
                                    placeholder="MM/DD/YYYY"
                                    dateFormat="MM/DD/YYYY"
                                    closeOnSelect={true}
                                    timeFormat={false}
                                    inputProps={inputProps}
                                    value={formRef.current.comMemberSince ? new Date(formRef.current.comMemberSince) : ''}
                                    onChange={date => { formRef.current.comMemberSince = date; subRefresh(Date.now()); }}
                                />
                                </div>
                                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="comNumberMember"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Number of Members"
                    placeholder="Number of Members"
                    required="Number of Members is required"
                    icon={faUser}
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
                  <InputRadio
                    styleClass="flex flex-col mb-4"
                    formKey="isConstruction"
                    formRef={formRef}
                    ui={ui}
                    name="isConstruction"
                    label="Is this group Construction?"
                    values={['Yes', 'No']}
                    required="Yes /No  is required"
                  />
                  </div>
                  <div className="w-1/3 mr-5">
                  <InputRadio
                    styleClass="flex flex-col mb-4"
                    formKey="isComBoardMember"
                    formRef={formRef}
                    ui={ui}
                    name="isComBoardMember"
                    label="Are you a member of Board?"
                    values={['Yes', 'No']}
                    required="Yes /No  is required"
                  />
                  </div>
                
                   <div className="w-1/3 mr-5">
                   </div>
                    </div> 
                    <div className="flex w-full justify-start items-center mt-3">
                            <div className="w-1/3 mr-5">                                
                            </div>
                            <div className="w-1/3 mr-5">
                        <InputSelect
                    styleClass="flex flex-col mb-4"
                    formKey="comPosition"
                    ID="comPosition"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Position"
                    placeholder="--Select--"
                    options={formList.comPosition}
                    required="Position is required"
                  />
               
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="comNumYears"
                    formRef={formRef}
                    uiRefresh={ui}
                    label="Number Of Years"
                    placeholder="Number Of Years"
                    required="Number Of Years is required"
                    icon={faUser}
                  />
                </div>
                  </div>         
                           
                        <div className="flex w-full justify-start items-center mt-3">
                            <div className="flex flex-col w-full">
                                <label>Comments</label>
                                    <textarea
                                        className={`w-full rounded border ${!formRef.current.comComments ? 'border-red-500 err-input' : 'border-gray-400'}`}
                                        value={formRef.current.comComments}
                                        placeholder="Description / Activity"
                                        onChange={e => { formRef.current.comComments = e.currentTarget.value; subRefresh(Date.now()); }}
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
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload
                  </button>

                  <div
                    onClick={modalViewClose}
                    className="border border-gray-400 flex justify-between items-center text-sm px-4 py-1.5 ml-3 cursor-pointer hover:bg-gray-100 hover:border-dodge-d"
                  >
                    <div>
                      {formRef.current.documents.length} document(s) uploaded
                    </div>
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="ml-2 text-dodge-d"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={saveConstruction}
                    className="bg-red-600 px-3 h-8 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500 ml-3"
                  >
                    {pageRef.current.isSaving ? (
                      <div className="flex justify-center items-center w-12">
                        <ButtonLoader />
                      </div>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
);

export default MediaForm;
