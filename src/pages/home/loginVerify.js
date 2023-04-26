import { useRef,useEffect,useCallback,useContext, useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import { apiPostCall } from "../../helper/API";
import { MainContext } from "../../util/maincontext";
import MyLocalStorage from "../../util/mylocalStorage";

const LoginVerify = () => {
    const {userId} = useParams();
    const [,uiRefresh] = useState(-1);
    const prog = useRef();
    const {setAuthenticated} = useContext(MainContext);
    // eslint-disable-next-line
    const history = useHistory();
    const count = useRef(0);
    const complete = useCallback(() => {
        count.current = count.current + 1;
        uiRefresh(Date.now());
    }, []);
    useEffect(()=> {
        if (!userId) window.location.href=`${process.env.REACT_APP_SITE}`;
        (async()=> {
            let search = [{ _modal: 'UserBasicInfo', _find: { _id: userId }, _mode: 'single', _select: '' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                window.location.href=`${process.env.REACT_APP_SITE}`;
                return;
            }
            delete res['password'];
            delete res['created_on'];
            MyLocalStorage.setLoginInfo(res);
            count.current = count.current + 1;
            uiRefresh(Date.now());
        })();
        prog.current.addEventListener('transitionend', complete, false);
        setTimeout(()=>prog.current.style.width = '100%', 200);
        return ()=> {}
        // eslint-disable-next-line
    }, []);
    useEffect(()=> {
        if (count.current === 2) {
            setAuthenticated(true);
            history.push('/user/profile/general');
        }
        return ()=> {}
        // eslint-disable-next-line
    }, [count.current]);
    return (
        <div className="meter red">
            <span style={{width: "0%"}} ref={prog} id="prog"></span>
        </div>
    );
}

export default LoginVerify;