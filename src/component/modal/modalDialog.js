import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Animated } from "react-animated-css";

const TinyLoader = React.memo(({color="currentColor"}) =>(
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4"></circle>
        <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
));
const ModalDialog = React.memo(forwardRef(({title="Modal Title", buttonText="Save Changes", saveCallback=null, inDuration=500, outDuration=500, closeCallback=null, cssClass="max-w-2xl", showSaveButton=true, children}, ref) => {
    const [, uiRefresh] = useState(-1);
    const diaRef = useRef();
    const modalRef = useRef({
        overlay: false,
        show: false,
        visible: false,
        loading: false
    });
    useImperativeHandle(ref, ()=>({
        showLoader() {
            modalRef.current.loading = true;
            uiRefresh(Date.now());
        },
        hideLoader() {
            modalRef.current.loading = false;
            uiRefresh(Date.now());
        },
        closeModal() { close(); }
    }));
    useEffect(()=> {
        modalRef.current.overlay = true;
        modalRef.current.show = true;
        modalRef.current.visible = true;
        uiRefresh(Date.now());
    }, []);
    const animateEnd = () => {
        diaRef.current.querySelector('div.modal-content').removeEventListener('animationend', animateEnd);
        modalRef.current.show = false;
        uiRefresh(Date.now());
        if (closeCallback) closeCallback();
    }
    const close = () => {
        diaRef.current.querySelector('div.modal-content').addEventListener('animationend', animateEnd);
        modalRef.current.overlay = false;
        modalRef.current.visible = false;
        uiRefresh(Date.now());
    }
    return (
        <>
            <div className={`modal${modalRef.current.show ? ' active' : ''}`}>
                <div className={`modal-dialog ${cssClass}`} ref={diaRef}>
                    <Animated animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={modalRef.current.visible} className="modal-content w-full" animationInDuration={inDuration} animationOutDuration={outDuration}>
                        <div className="modal-header">
                            <h2 className="modal-title">{title}</h2>
                            {/* <button type="button" className="close la la-times" data-dismiss="modal" onClick={close}></button> */}
                            <FontAwesomeIcon icon={faTimes} className="close cursor-pointer" onClick={close}/>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                            <div className="flex ltr:ml-auto rtl:mr-auto">
                                <button type="button" className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b" data-dismiss="modal" onClick={close}>Close</button>
                                {showSaveButton && <button type="button" className="bg-red-600 px-3 h-8 mr-5 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500 ml-5" onClick={saveCallback}>
                                    {modalRef.current.loading ?<div className="w-12 flex justify-center"><TinyLoader color="#000"/></div>: <>{buttonText}</>}
                                </button>}
                            </div>
                        </div>
                    </Animated>
                </div>
            </div>
            {modalRef.current.overlay && <div className="overlay active"></div>}
        </>
    );
}));

export default ModalDialog;

