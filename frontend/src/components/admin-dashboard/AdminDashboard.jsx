import React, { useState } from 'react'
import './adminDashboard.css'
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [shouldChangeToLogin,setShouldChangeToLogin]= useState(false);

  const logout = async (e)=>{


    e.preventDefault();
    try{
        const response = await fetch(
        "https://click-net-test.onrender.com/api/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token":localStorage.getItem('accessToken')
          },
        }
      );
      const data = await response.json();
      if(data.error){
        console.error(data.error);
        return;
      }
      localStorage.clear();
      console.info(data.message);
      setShouldChangeToLogin(true);

    }catch(e){
      console.error("Something went wrong. " + e);
    }
  }

  if(shouldChangeToLogin) return <Navigate to="/login" />

  if(!localStorage.getItem('accessToken')) return <div>Unauthorized</div>
  return (
    <div className='admin-dashboard'>
      <button onClick={(e)=>{logout(e)}}>Logout</button>
    </div>
  )
}

export default AdminDashboard