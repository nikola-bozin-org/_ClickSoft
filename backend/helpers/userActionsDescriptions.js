const UserActionDescription = {
    AccountCreation:(creator,username)=> `Staff ${creator} created new user: ${username}.`,
    Login:(rate)=>`Login: ${rate}/hour.`,
    Logout:`Logout.`,
    LogoutByStaff:(staff)=>`Logout by ${staff}.`,
    TicketBought:`Ticket Bought.`,
    Payment:`User Cash Payment.`,
    Refund:(refundedBy,amount)=>`Refunded ${amount} by ${refundedBy}.`,
    PasswordChange:`Password Changed.`
}


module.exports=UserActionDescription;