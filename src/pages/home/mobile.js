import React, {useEffect, useState} from "react";
import { auth} from './firebaseInit';
import firebase from 'firebase/compat/app';
const MobileVerify = () => {
    const [mynumber, setnumber] = useState("");
    const [otp, setotp] = useState('');
    const [show, setshow] = useState(false);
    const [final, setfinal] = useState('');
    const [isSuccess, setSuccess] = useState(false);

    useEffect(()=> {
        return () => {}
    }, []);
    const signin = () => {
  
        if (mynumber === "" || mynumber.length < 10) return;
  
        let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        auth.signInWithPhoneNumber(mynumber, verify).then((result) => {
            setfinal(result);
            alert("code sent")
            setshow(true);
        }).catch((err) => {
            alert(err);
            window.location.reload()
        });
    }
    const ValidateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            // success
            setSuccess(true);
        }).catch((err) => {
            alert("Wrong code");
        })
    }
    const signout = () => {
        auth.signOut();
        setSuccess(false);
    }
    return (
        <div style={{ "marginTop": "200px" }}>
            <center>
                <div style={{ display: !show ? "block" : "none" }}>
                    <input value={mynumber} onChange={(e) => { 
                       setnumber(e.target.value) }}
                        placeholder="phone number" />
                    <br /><br />
                    <div id="recaptcha-container"></div>
                    <button onClick={signin}>Send OTP</button>
                </div>
                <div style={{ display: show ? "block" : "none" }}>
                    <input type="text" placeholder={"Enter your OTP"}
                        onChange={(e) => { setotp(e.target.value) }}></input>
                    <br /><br />
                    <button onClick={ValidateOtp}>Verify</button><br/>
                    {isSuccess && <button onClick={signout}>Signout</button>}
                </div>
            </center>
        </div>
    );
}

export default React.memo(MobileVerify);