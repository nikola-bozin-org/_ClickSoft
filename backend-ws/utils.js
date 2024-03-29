const axios = require('axios');
const { staffClients, clients } = require('./server-storage');
const url = require('url');

const extractUserFromToken = async (token) => {
    try {
      const response = await axios.get(`${process.env.API_BASE_URL_LOCAL}/session/verifyToken`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'secret': process.env.SERVER_SECRET,
        },
      });
      if (response.data.isValid) return response.data.verifyResult;
      return false;
    } catch (error) {
      return false;
    }
};
const setUserBalance = async(token,username,balance,onSuccess,onFail)=>{
  try{
    const data = {
      balance:balance,
      username:username
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'secret': process.env.SERVER_SECRET,
      },
    }
    const response = await axios.post(`${process.env.API_BASE_URL_LOCAL}/user/setUserBalance`,data,config)
    if(response.data.balanceUpdated) onSuccess();
    else onFail();
  }catch(e){
    console.info(e.response.data);
  }
}
const getUserBalance = async(username)=>{
  try{
    const response = await axios.get(`${process.env.API_BASE_URL_LOCAL}/user/balance/${username}`);
    return response.data.balance;
  }catch(e){
    console.info(e.response.data);
  }
}
const logoutUser = async (token) => {
    try {
      const response = await axios.post(`${process.env.API_BASE_URL_LOCAL}/session/logout`,{}, {
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'secret': process.env.SERVER_SECRET,
        },
      })
      console.info(response.data)
    } catch (e) {
      console.info(e.response.data.error)
    }
}
const sendMessageToClient = (senderUsername, recipientUsername, message) => {
    const recipientWs = clients.get(recipientUsername);
    if (recipientWs) {
      recipientWs.send(JSON.stringify({
        event: "message",
        data: {
          sender: senderUsername,
          message: message
        }
      }));
    } else {
      console.error(`Recipient with username ${recipientUsername} not found`);
    }
};
const grabAccessToken = (req)=>{
  const queryParams = new URLSearchParams(url.parse(req.url).search);
  return queryParams.get('jwt');
}
const informStaffAboutNewConnection = ()=>{
  staffClients.forEach((staffClient)=>{
    staffClient.ws.send(JSON.stringify({event:'newConnection'}))
  });
}
const storeConnection = (ws,extractedUser)=>{
  const username = extractedUser.username;
  if(extractedUser.role==='Admin' || extractedUser.role==='Employee'){
    staffClients.set(username,{ws:ws,user:extractedUser});
  } 
  else{
    clients.set(username,{ws:ws,user:extractedUser});
  } 
}


module.exports = {
    extractUserFromToken,
    logoutUser,
    sendMessageToClient,
    grabAccessToken,
    informStaffAboutNewConnection,
    storeConnection,
    setUserBalance,
    getUserBalance
}