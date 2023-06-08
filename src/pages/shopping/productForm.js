import React, { useCallback, useRef, useState } from 'react';
import Datetime from 'react-datetime';
import { faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactFlagsSelect from 'react-flags-select';
import Constants from '../../helper/Constants';
import
{
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
import
{
  CountrySelect,
  DatePicker,
  GroupEmail,
  GroupInput,
  InputDOB,
  InputPhone,
  InputRadio,
  InputSelect,
  PasswordCheck,
} from '../../component/forms';

import
{
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
import MyLocalStorage from '../../util/mylocalStorage';

const ProductForm = React.memo(
  ({ form, uiRefresh, alertRef, pageData, recordIndex, productAddedList }) =>
  {
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
    const progressHandler = (event) =>
    {
      let percent = (event.loaded / event.total) * 100;
      progress.current.value = Math.round(percent);
      subRefresh(Date.now());
    };

    const completeHandler = (event) =>
    {
      productAddedList.current[recordIndex].documents.push({
        ...pageRef.current.file_record,
      });
      pageRef.current.file_record = {};
      uiRefresh(Date.now());
      modalClose();
    };
    const errorHandler = (event) => { };
    const abortHandler = (event) => { };
    const fileChange = (evt) =>
    {
      let file = evt.currentTarget.files[0];
      if (typeof file === 'undefined') return;
      pageRef.current.selFileName = file.name;
      pageRef.current.showProgress = true;
      progress.current.value = 0;
      subRefresh(Date.now());
    };
    const countryCallback = (code, itm, idx) =>
    {
      itm.state = '';
      itm.country = code;
      subRefresh(Date.now());
    };
    const stateList = (country) =>
    {
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
    const saveProduct = () =>
    {
      if (currentDom.current.querySelector('.err-input'))
      {
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
            _modal: 'ProductList',
            _condition: 'update',
            _find: { _id: pageData.current._id },
            _data: { $push: { product: arr } },
          },
        ]
        : [
          {
            _modal: 'ProductList',
            _condition: 'update',
            _find: { _id: pageData.current._id, 'product.id': arr.id },
            _data: { $set: { 'product.$': arr } },
            _options: { upsert: false },
          },
        ];
      (async () =>
      {
        const res = await apiPostCall('/api/common/common_mutiple_insert', {
          _list: params,
        });
        if (res.isError)
        {
          ToastMessage({
            type: 'error',
            message: res.Error.response.data.message,
            timeout: 2000,
          });
          return;
        } else
        {
          arr.isSubmit = true;
          let newlist = [...productAddedList.current];
          newlist[recordIndex] = arr;
          productAddedList.current = newlist;
          pageRef.current.isSaving = false;
          formRef.current = { ...arr };
          uiRefresh(Date.now());
          ToastMessage({
            type: 'success',
            message: 'Product Deatails added succesfully!',
            timeout: 1200,
          });
        }
      })();
    };
    const openFileUpload = () =>
    {
      if (typeof formRef.current.saved !== 'undefined')
      {
        ToastMessage({
          type: 'error',
          message: 'Save the Product and upload!',
          timeout: 1200,
        });
        return;
      }
      pageRef.current.showProgressModal = true;
      subRefresh(Date.now());
    };
    const modalRef = useRef();
    const modalClose = useCallback((name, idx) =>
    {
      pageRef.current.title = '';
      pageRef.current.selFileName = '';
      pageRef.current.showProgress = false;
      pageRef.current.file_record = {};
      progress.current.value = 0;
      pageRef.current.showProgressModal = !pageRef.current.showProgressModal;
      subRefresh(Date.now());
      // eslint-disable-next-line
    }, []);
    const modalSave = useCallback(() =>
    {
      if (!pageRef.current.title)
      {
        ToastMessage({
          type: 'error',
          message: 'Please enter title',
          timeout: 1000,
        });
        return;
      } else if (file_ref.current.files.length === 0)
      {
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
      (async () =>
      {
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

    const openfilePicker = () =>
    {
      file_ref.current.click();
    };
    const modalViewClose = useCallback(() =>
    {
      pageRef.current.showUploadWin = !pageRef.current.showUploadWin;
      subRefresh(Date.now());
      // eslint-disable-next-line
    }, []);
    const getFileIcon = (ext) =>
    {
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
    const downloadFile = (itm) =>
    {
      window.location.href = `${process.env.REACT_APP_API_URL
        }/api/client/download_document?oriname=${itm.oriname}&filename=${itm.filename
        }&dt=${Date.now()}`;
    };
    const removeFile = (itm, idx) =>
    {
      alertRef.current.showConfirm(
        (res) =>
        {
          if (res === 'no') return;
          productAddedList.current[recordIndex].documents.splice(idx, 1);
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
    const removeProduct = () =>
    {
      if (productAddedList.current[recordIndex].saved === false)
      {
        alertRef.current.showConfirm(
          (res) =>
          {
            if (res === 'no') return;
            productAddedList.current.splice(recordIndex, 1);
            uiRefresh(Date.now());
          },
          'Confirm?',
          'Are you sure to delete this Product?'
        );
      } else
      {
        alertRef.current.showConfirm(
          (res) =>
          {
            if (res === 'no') return;
            let params = [
              {
                _modal: 'ProductList',
                _condition: 'update',
                _find: { _id: pageData.current._id },
                _data: { $pull: { product: { id: formRef.current.id } } },
              },
            ];
            apiPostCall('/api/common/common_mutiple_insert', { _list: params });
            productAddedList.current.splice(recordIndex, 1);
            uiRefresh(Date.now());
          },
          'Confirm?',
          'Are you sure to delete this product?'
        );
      }
    };
    const calculateAge = (birthDate, otherDate) =>
    {
      birthDate = new Date(birthDate);
      otherDate = new Date(otherDate);

      var years = otherDate.getFullYear() - birthDate.getFullYear();

      if (
        otherDate.getMonth() < birthDate.getMonth() ||
        (otherDate.getMonth() === birthDate.getMonth() &&
          otherDate.getDate() < birthDate.getDate())
      )
      {
        years--;
      }

      return years;
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
                  className={`w-full rounded border py-1.5 px-2 ${!pageRef.current.title
                    ? 'err-input border-red-500'
                    : 'border-gray-400'
                    }`}
                  onChange={(e) =>
                  {
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
          {/* <i
            className="bx bxs-trash absolute right-2 top-2 text-2xl cursor-pointer text-gray-300 hover:text-red-500"
            onClick={removeProduct}
          ></i> */}
          <div className="pt-5 pb-3">
            <form>
              <div key={formRef.current._id} className="card">
                <a href={`/user/product/product/${formRef.current._id}`}>
                  <img className="medium" src={formRef.current.image} alt={formRef.current.name} />
                </a>
                <div className="card-body">
                  <a href={`/user/product/product/${formRef.current._id}`}>
                    <h2>{formRef.current.name}</h2>
                  </a>
                  {/* <Rating
                    rating={formRef.current.rating}
                    numReviews={formRef.current.numReviews}
                  ></Rating> */}
                  <div className="price">${formRef.current.price}</div>
                </div>
              </div>
              {/* <div className="flex w-full justify-start items-center mt-3">
                <div key={formRef.current._id} className="card">
                  <a href={`/user/product/product/${formRef.current._id}`}>
                    <img className="medium" src={formRef.current.image} alt={formRef.current.name} />
                  </a>
                </div>
                <div className="row center">
                  {formRef.current.name}
                </div>

                <div className="row center">
                  {formRef.current.category}
                </div>
                <div className="row center">
                  <p>Price : $ </p><h1>{formRef.current.price}</h1>
                </div>
                <div className="row center">
                  {formRef.current.brand}
                </div>
              </div> */}

              {/* <div className="flex w-full justify-start items-center mt-3">
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="productType"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Product Type[Men/Women]"
                    placeholder="Product Type"
                    required="Product Type is required"
                    icon={faMoneyCheck}
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="shopName"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Shop Name"
                    placeholder="Shop Name"
                    required="Shop Name is required"
                    icon={faBuildingNgo}
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="invoiceNumber"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Invoice Number"
                    placeholder="Invoice Number"
                    required="Invoice Number is required"
                    icon={faMoneyBills}
                  />
                </div>
              </div>
              <div className="flex w-full justify-start items-center mt-3">
                <div className="w-1/3 mr-5">
                  <DatePicker
                    styleClass="flex flex-col mb-4"
                    formKey="paymentdate"
                    ID="paymentdate"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Payment date"
                    placeholder="Payment date"
                    required="Payment date is required"
                  // callback={dobCallback}
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <InputSelect
                    styleClass="flex flex-col mb-4"
                    formKey="paymentType"
                    ID="paymentType"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Payment Type"
                    placeholder="--Select--"
                    options={formList.paymentType}
                    required="Payment Type is required"
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="cardNumber"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Credit Card Number"
                    placeholder="Credit Card Number"
                    required="Credit Card Number is required"
                    icon={faMoneyBillAlt}
                  />
                </div>
              </div>
              <div className="flex w-full justify-start items-center mt-3">
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="address"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="Address"
                    placeholder="Adress"
                    required="Address is required"
                    icon={faAddressCard}
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="county"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="County"
                    placeholder="County"
                    required="County is required"
                    icon={faTreeCity}
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <GroupInput
                    styleClass="flex flex-col mb-4"
                    formKey="city"
                    formRef={regRef}
                    uiRefresh={ui}
                    label="City"
                    placeholder="City"
                    required="City is required"
                    icon={faCity}
                  />
                </div>
              </div>

              <div className="flex w-full justify-start items-center mt-3">
                <div className="w-1/3 mr-5">
                  <label>Country</label>
                  <ReactFlagsSelect
                    className={`w-full rounded border ${!formRef.current.country
                        ? 'border-red-500 err-input'
                        : 'border-gray-400'
                      }`}
                    selected={formRef.current.country}
                    onSelect={(code) => countryCallback(code, formRef.current)}
                    countries={['US', 'IN']}
                    placeholder="Country"
                  />
                </div>
                <div className="w-1/3 mr-5">
                  <label>State</label>
                  <select
                    className={`border w-full p-2 rounded ${!formRef.current.state
                        ? 'border-red-500 err-input'
                        : 'border-gray-400'
                      }`}
                    defaultValue={formRef.current.state}
                    onChange={(e) =>
                    {
                      formRef.current.state = e.currentTarget.value;
                      subRefresh(Date.now());
                    }}
                  >
                    <option value="">-- Select State --</option>
                    {stateList(formRef.current.country).map((itm, idx) => (
                      <option key={idx} value={itm.key || itm}>
                        {itm.name || itm}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3 mr-5">
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
              </div>

              <div className="flex w-full justify-start items-center mt-3">
                <div className="flex flex-col w-full">
                  <label>Comments</label>
                  <textarea
                    className={`w-full rounded border ${!formRef.current.productComments
                        ? 'border-red-500 err-input'
                        : 'border-gray-400'
                      }`}
                    value={formRef.current.productComments}
                    onChange={(e) =>
                    {
                      formRef.current.productComments = e.currentTarget.value;
                      subRefresh(Date.now());
                    }}
                    rows={4}
                  ></textarea>
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
                      {formRef.current.documents.length} document(s) uploded
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
                    onClick={saveProduct}
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
              </div> */}
            </form>
          </div>
        </div>
      </>
    );
  }
);

export default ProductForm;