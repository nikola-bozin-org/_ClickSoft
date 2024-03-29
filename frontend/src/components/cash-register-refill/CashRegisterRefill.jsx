import React, { useContext } from 'react'
import './CashRegisterRefill.css'
import Table from '../table/Table'
import { useState, useEffect, useRef } from 'react';
import { fixPaymentsDate, formatNumber } from '../../utils'
import coins from '../../images/dollar.png'
import { getCurrentSessionPayments, payment, zReport } from '../../config'
import FetchError from '../fetch-error/FetchError';
import FetchSuccess from '../fetch-success/FetchSuccess';
import { AppContext } from '../../contexts/AppContext';
import HandleButton from '../handle-button/HandleButton'
import { CashRegisterContext } from '../../contexts/CashRegisterContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sendRefillEvent } from '../../clientRemoteController'


const CashRegisterRefill = () => {
  const appContext = useContext(AppContext)
  const inputAmountRef = useRef(null);
  const inputUsernameRef = useRef(null);
  const [shouldDisableRefill, setShouldDisableRefill] = useState(false);
  const [shouldShowError, setShouldShowError] = useState(false);
  const [shouldShowSuccess, setShouldShowSuccess] = useState(false);
  const [informationText, setInformationText] = useState('');
  const [amount, setAmount] = useState('');
  const [username, setUsername] = useState('');
  const cashRegisterContext = useContext(CashRegisterContext)
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownUsers,setDropdownUsers] = useState([])

  useEffect(() => {
    const currentCashRegisterPayments = async () => {
      const response = await fetch(`${getCurrentSessionPayments}?limit=${appContext.fetchLimit}&skip=${appContext.fetchPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('accessToken')
        }
      });
      const result = await response.json();
      if (result.error) { console.error(result.error); return }
      cashRegisterContext.setCurrentCashRegisterSessionPayments(result.currentSessionPayments)
      const total = result.currentSessionPayments.reduce((total, objectData) => total + objectData.paymentAmount, 0)
      cashRegisterContext.setCashierBalance(total);
      cashRegisterContext.setTotalRevenue(total);
    };
    currentCashRegisterPayments();
  }, []);

  const handleRefill = async () => {
    setShouldDisableRefill(true);
    setShouldShowError(false);
    setShouldShowSuccess(false);
    inputAmountRef.current.value = '';
    inputUsernameRef.current.value = '';
    setUsername('');
    setAmount('');
    const response = await fetch(payment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        username: username,
        payment: amount
      }),
    });
    setShouldDisableRefill(false);
    const result = await response.json();
    if (result.error) {
      setInformationText(result.error)
      setShouldShowError(true);
      return;
    } else if (result.paymentProcessed) {
      sendRefillEvent(username, amount)
      console.info("DO I HAVE A RESPONSE HERE FROM REFILL EVENT? PLEASE?")
      cashRegisterContext.setCurrentCashRegisterSessionPayments([...cashRegisterContext.currentCashRegisterSessionPayments, result.tableData])
      setInformationText("Payment Accepted!")
      setShouldShowSuccess(true);
      cashRegisterContext.setTotalRevenue(cashRegisterContext.totalRevenue + result.tableData.paymentAmount)
      cashRegisterContext.setCashierBalance(cashRegisterContext.cashierBalance + result.tableData.paymentAmount)
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    setShowDropdown(value!=='');
  }

  return (
    <div className='cash-register-refill'>
      <div className="cash-register-refill-left">
        <input min={1} ref={inputAmountRef} onChange={(e) => setAmount(e.target.value)} className="cash-register-refill-amount" type='number' placeholder='Amount' />
        <div>
          <input ref={inputUsernameRef} onChange={(e) => handleUsernameChange(e.target.value)} className="cash-register-refill-username" type='text' placeholder='Username' />
          {showDropdown &&
            <div className="dropdown">
              {(appContext.users.
              filter(user=> user.username.includes(username)))
              .map((user,index) =>{
                return <div onClick={() => {handleUsernameChange(user.username); inputUsernameRef.current.value=user.username; setShowDropdown(false)}} key={index} className="dropdown-item">
                  {user.username}
                </div>}
              )}
            </div>
          }
        </div>
        <HandleButton shouldDisable={shouldDisableRefill} onClick={handleRefill} text={"Refill"} className={`cash-register-refill-button ${shouldDisableRefill ? `halfOpacity` : ``}`} />
        <FetchError showMessage={shouldShowError} message={informationText} onDelayCompleted={() => { setShouldShowError(false) }} />
        <FetchSuccess showMessage={shouldShowSuccess} message={informationText} onDelayCompleted={() => { setShouldShowSuccess(false) }} />
      </div>
      <PaymentsTable totalRevenue={cashRegisterContext.totalRevenue} cashierBalance={cashRegisterContext.cashierBalance} currentCashRegisterSessionPayments={cashRegisterContext.currentCashRegisterSessionPayments} />
    </div>
  )
}

export const PaymentsTable = ({ totalRevenue, cashierBalance, currentCashRegisterSessionPayments }) => {
  const [showDailyRevenue, setShowDailyRevenue] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const fetchZReport = async () => {
    const url = `${zReport}/?startDate=${startDate}&endDate=${endDate}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'xlsx'); // replace with actual filename and extension if known
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="cash-register-refill-right">
      <div className="cash-register-refill-right-topbar">
        <div className="cash-register-refill-right-topbar-right">
          <HandleButton onClick={fetchZReport} text={'Z Report'} className={'cash-register-refill-right-topbar-zReport'} />
          <div className="cash-register-refill-right-topbar-right-dates">
            <div className="cash-register-refill-right-topbar-right-date">
              <p>Start:</p>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div className="cash-register-refill-right-topbar-right-date">
              <p>End:</p>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
          </div>
        </div>
        <div
          onMouseEnter={() => setShowDailyRevenue(true)}
          onMouseLeave={() => setShowDailyRevenue(false)}
          className="cash-register-refill-right-topbar-current-cash-register-total-balance">
          <p>Balance:</p>
          <img src={coins} alt="" className="cash-register-refill-right-topbar-coins" />
          {showDailyRevenue && <DailyRevenue dailyRevenue={totalRevenue} cashierBalance={cashierBalance} />}
        </div>
      </div>
      <Table headers={['username', 'Amount', 'Date', 'Receipt']}
        tableData={fixPaymentsDate(currentCashRegisterSessionPayments).reverse()}
        shouldRoundEdges={false}
      />
    </div>
  )
}

const DailyRevenue = ({ dailyRevenue, cashierBalance }) => {
  return (
    <div className="daily-revenue">
      <div className='daily-revenue-total'>
        <p>Daily revenue:</p>
        <p className='revnue-value'> {formatNumber(dailyRevenue)}</p>
      </div>
      <div className="daily-revenue-cashier">
        <p>Cashier balance:</p>
        <p className='revnue-value'>{formatNumber(cashierBalance)}</p>
      </div>
    </div>
  )
}

export default CashRegisterRefill