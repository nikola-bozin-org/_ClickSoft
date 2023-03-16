const jwt = require("../jwt");
const { Tickets,User,CurrentCashRegisterSession } = require("../schemas");
const statusCode = require("../statusCodes");
const UserActions = require("../helpers/userActions");
const UserActionsDescriptions = require("../helpers/userActionsDescriptions");

const addUserBalance = async(req,res) =>{
    const token = req.headers.token;
    if (!token) return res.status(statusCode.UNAUTHORIZED).json({ error: "Unathorized." });
    const verifyResult = jwt.verify(token);
    if (!verifyResult) return res.status(statusCode.ERROR).json({ error: "Invalid token" });
    const currentCashRegisterSession = await CurrentCashRegisterSession.findOne({});
    if(!currentCashRegisterSession) return res.status(statusCode.ERROR).json({error:'Cash register is not open.'});
    if(!(verifyResult.role==="Admin") && !(verifyResult.role==="Employee")) return res.status(statusCode.ERROR).json({error:`User ${username} is not Admin or Employee`});
    
    const { username, payment } = req.body;
    const user = await User.findOne({ username });
    if (user === null) return res.status(statusCode.ERROR).json({ error: `User ${username} does not exist.` });
    const balance = parseInt(user.balance);
    const newBalance = balance + parseInt(payment);


    try {
      const date = Date.now();
      const resultUser = await User.updateOne({username},{
        $set:{balance:newBalance},
        $push:{
          actions:{
            name:UserActions.Payment,
            description:UserActionsDescriptions.Payment,
            date:date,
            pcNumber:-1,
            balanceChange:payment
      }}});
      console.info("ovaj result payment i reuslt user vracaju uzera i cahsregister payment iz predhodnog stejta. pre updejta")
      const paymentDate = Date.now();
      const resultPayment = await CurrentCashRegisterSession.findOneAndUpdate({
            $push: { payments:{username:username,paymentAmount:payment,paymentDate:paymentDate} }
      })
      return res.status(statusCode.OK).json({ paymentProcessed: "true",resultUser:resultUser,resultPayment:resultPayment })
    }catch (e) {
      return res.status(statusCode.ERROR).json({ paymentProcessed: "false", error: e.message })
    }

}

const buyTicket = async (req, res) => {
  const token = req.headers.token;
  if(!token) return res.status(statuscode.ERROR).json({error:"Unauthorized."});
  const result = jwt.verify(token);
  if (!result) return res.status(statusCode.ERROR).json({ error: "Invalid token." });
  const username = result.username;
  console.info(result);
  console.info("videti dal je uzer ulogovan, al pre troga mora da ima baza ulogovanih uzera")
  const user = await User.findOne({username});
  if(!user) return res.status(statusCode.ERROR).json({error:`User ${username} does not exist.`});
  const { name } = req.body;
  const ticket = await Tickets.findOne({name});
  if(!ticket) return res.status(statusCode.ERROR).json({error:"Invalid ticket name."})
  const userBalance = parseInt(user.balance);
  const userDiscount = parseInt(user.discount);
  const ticketCost = parseInt(ticket.cost);
  const reduction = 100-userDiscount;
  const costForUser = (ticketCost*reduction)/100;
  console.info(`User balance ${userBalance}, User discount: ${userDiscount}, Ticket Price; ${ticketCost}, Reduction: ${reduction}, finalCost: ${costForUser}`)
  if(userBalance<costForUser) return res.status(statusCode.ERROR).json({error:`Not enough balance to buy ${name} ticket.`})
  console.info(`dodati xp`)
  console.info(`izracunati discount`)
  console.info("decrease user balance")
  console.info("add ticket to user  current tickets");
  res.status(statusCode.OK).json({ result: `Ticket ${name} bought.` });
};

module.exports = {
  buyTicket,
  addUserBalance,
};
