const statusCode = require('../statusCodes')
const service = require('../services/userService')


const getUserBalance = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserBalance(id);
    if(result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:`Server error: ${result.error}`});
    return res.status(statusCode.OK).json({ balance: result.balance });
}
const getUserDiscount = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserDiscount(id);
    if(result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:`Server error: ${result.error}`});
    return res.status(statusCode.OK).json({ discount: result.discount });
}
const getUserXp = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserXp(id);
    if(result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({error:`Server error: ${result.error}`});
    return res.status(statusCode.OK).json({ xp: result.xp });
}

const getUserRole = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserRole(id);
    if (result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: `Server error: ${result.error}` });
    return res.status(statusCode.OK).json({ role: result.role });
};

const getUserBasicInfo = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserBasicInfo(id);
    if (result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: `Server error: ${result.error}` });
    return res.status(statusCode.OK).json({ basicInfo: result.basicInfo });
};

const getActions = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserActions(id);
    if (result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: `Server error: ${result.error}` });
    return res.status(statusCode.OK).json({ actions: result.actions });
};
const getTickets = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserTickets(id);
    if (result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: `Server error: ${result.error}` });
    return res.status(statusCode.OK).json({ tickets: result.tickets });
};
const getUserPayments = async (req, res) => {
    const { id } = req.params;
    const result = await service._getUserPayments(id);
    if (result.error) return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error:`Server error: ${result.error}` });
    return res.status(statusCode.OK).json({ payments: result.payments });
};

module.exports = {
    getUserBalance,
    getUserDiscount,
    getUserXp,
    getUserRole,
    getUserBasicInfo,
    getActions,
    getTickets,
    getUserPayments,
}