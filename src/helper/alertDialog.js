import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ReactConfirmAlert from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'

const AlertDialog = React.memo(forwardRef(({empty}, ref) => {
    const alertRef = useRef({
        show: false,
        onCallback: null,
        message: '',
        title: '', 
        confirmLabel: "Yes",
        cancelLabel: "No"
    });
    const [,uiRefresh] = useState(-1);
    useImperativeHandle(ref, ()=>({
        showConfirm(callback, title="Confirm to submit", message="Are you sure?", confirmLabel="Yes", cancelLabel="No") {
            alertRef.current.onCallback = callback;
            alertRef.current.title = title;
            alertRef.current.message = message;
            alertRef.current.show = true;
            uiRefresh(Date.now())
        }
    }));
    const okCall = () => {
        alertRef.current.show = false;
        uiRefresh(Date.now());
        alertRef.current.onCallback('yes')
    }
    const noCall = () => {
        alertRef.current.show = false;
        uiRefresh(Date.now());
        alertRef.current.onCallback('no')
    }
    if (!alertRef.current.show) return null;
    else return (
        <ReactConfirmAlert
            title={alertRef.current.title}
            message={alertRef.current.message}
            confirmLabel={alertRef.current.confirmLabel}
            cancelLabel={alertRef.current.cancelLabel}
            overlayClassName="confirm-overlay"
            buttons={[{
                label: alertRef.current.cancelLabel,
                className: "btn-red bg-red-600 px-8 py-1.5 h-8 text-white text-sm shadow-md flex justify-center items-center hover:bg-red-500",
                onClick: noCall
            },{
                label: alertRef.current.confirmLabel,
                className: "btn-blue bg-dodge-d px-8 py-1.5 text-white text-sm shadow-md flex hover:bg-dodge-b ml-5",
                onClick: okCall
            }]}
        ></ReactConfirmAlert>
    );    
}));

export default AlertDialog;