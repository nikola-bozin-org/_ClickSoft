import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './topbar.css'
import user from '../../images/user.png'
// import more from '../../images/settings.png'
const Topbar = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(format(new Date(), 'HH:mm:ss'));
        setCurrentDate(format(new Date(), 'EEEE, MMMM do, yyyy'));
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
  
    const handleClick = () => {
      // Handle user image click event
    };

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        <div onClick={()=>{window.open('https://clicksoft.us/','_blank','noopener,noreferrer')}} className="topbar-left-logoWrapper">
          <p>ClickSoft</p>
        {/* <img src={clickLogo} alt="Logo" className="topbar-logo" /> */}
        </div>
        <div className="topbar-time-date">
          <span className="topbar-time">{currentTime}</span>
          <span className="topbar-date">{currentDate}</span>
        </div>
      </div>
      <div className="topbar-right" onClick={handleClick}>
        <img src={user} alt="User" className="topbar-user-image" />
        {/* <img src={more} alt="" className="topbar-user-more" /> */}
      </div>
    </div>
  )
}

export default Topbar