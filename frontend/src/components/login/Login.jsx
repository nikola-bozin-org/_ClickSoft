import { useState } from "react";
import "./login.css";
import {Navigate} from 'react-router-dom'
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import {login} from '../../redux/authSlice'
import {useDispatch} from 'react-redux'
import { loginStaff } from "../../config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentNotificationTimeout,setCurrentNotificationTimeout] = useState(null);
  const [isFetching,setIsFetching] = useState(false);
  const [shouldNavigate,setShouldNavigate] = useState(false);
  const [disableLoginButton,setDisableLoginButton] = useState(false);

  const dispatch = useDispatch();
  const {setIsAuthorized} = useContext(AppContext);

  const handleSubmit = async (e) => {
    setDisableLoginButton(true);
    if(currentNotificationTimeout){
      clearTimeout(currentNotificationTimeout);
      setCurrentNotificationTimeout(null);
      setShowNotification(false);
    }
    setIsFetching(true);
    console.info("This")
    // if(username==='admin')
    dispatch(login({isAdmin:true}))
    e.preventDefault();
      const response = await fetch(
        loginStaff,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            'username':'admin',
            'password':'admin'
          })
        }
      );
      const data = await response.json();
      setIsFetching(false);
      setDisableLoginButton(false);
      if (data.error) {
        setShowNotification(true);
        setNotificationMessage(data.error);
        let timeout = setTimeout(() => {
          setShowNotification(false);
        }, 6000);
        setCurrentNotificationTimeout(timeout);
        return;
      }
      localStorage.setItem("user", data.user);
      localStorage.setItem("accessToken", data.accessToken);
      setShouldNavigate(true);
      setIsAuthorized(true);
  };
  const loginAsViewer = () =>{
  }

  if(shouldNavigate) { return <Navigate to='/dashboard'/> }

  return (
    <>
    <div className="topbarClickNET">ClickNET</div>
    <div className="login-container">
      <form onSubmit={(e)=>{handleSubmit(e,false)}} className="login-form">
      <input type="text" style={{display:"none"}}/>
        <label htmlFor="username">Username</label>
        <input
          autoComplete="off"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete="off"
          type="new-password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={disableLoginButton} type="submit" className={`${disableLoginButton?'halfOpacity':''}`}>Login</button>
      </form>
      <button onClick={(e)=>{handleSubmit(e,true)}} disabled={true} type="submit" className={` login-as-viewer-btn halfOpacity`}>Login As Viewer</button>
        <div className={`notification-container  ${showNotification?'show-notification-container':'hide-notification-container'}`}><p className={`notificationText`}>{notificationMessage}</p></div>
      {isFetching && (
        <div className="fetching-notification"></div>
      )}
    </div>
    </>
  );
}



export default Login;
