import React from 'react'
import './CloseCashRegister.css'
import { useContext } from 'react'
import { AppContext } from '../../contexts/AppContext'
import { closeCashRegisterSession } from '../../config'
import { useState } from 'react'

const CloseCashRegister = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const onYesClicked = async ()=>{
    const response = await fetch(closeCashRegisterSession,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'token': localStorage.getItem('accessToken')
      },
      // body:JSON.stringify({username,password})
    })
    const result = await response.json();
    if (result.error) { console.error(result.error); return; };
    console.info(result)
  }

  const { setShouldShowCloseCashRegister } = useContext(AppContext)
  return (
    <div onClick={() => { setShouldShowCloseCashRegister(false) }} className='close-cash-register'>
      <div onClick={(e) => e.stopPropagation()} className="close-cash-register-wrap">
        Close Cash Register Session?
        {/* <div className="close-cash-register-inputs">
          <input type="text" style={{ display: "none" }} />
          <p htmlFor="username">Username:</p>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} autoComplete='off' type="text" id="username" name="username" required />
          <p htmlFor="password">Password:</p>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete='off' type="password" id="password" name="password" required />
        </div> */}
        <div className="close-cash-register-control-buttons">
          <button onClick={() => { setShouldShowCloseCashRegister(false) }} className="close-cash-register-cancel">Cancel</button>
          <button onClick={onYesClicked} className="close-cash-register-yes">Yes</button>
        </div>
      </div>
    </div>
  )
}

export default CloseCashRegister