const { utils } = require("xlsx");
const { Utils } = require("../schemas");

const _getUtility = async () => {
  try {
    let utility = await Utils.findOne({});
    if(!utility) await _createUtility(0,'ClickEsports','RSD','0.0.0')
    utility = await Utils.findOne({});
    return { utility: utility};
  } catch (e) {
    return { error: e.message };
  }
};

const _setWorkstationLimit = async (newLimit) => {
  try {
    await Utils.findOneAndUpdate({}, { 'utility.workstationLimit': newLimit });
    return { message: "New Limit Set: " + newLimit };
  } catch (e) {
    return { error: e.message };
  }
};
const _setUtilityCenterName = async (newCenterName) => {
    try {
      await Utils.findOneAndUpdate({}, { 'utility.centerName': newCenterName });
      return { message: "New Center Name is: " + newCenterName};
    } catch (e) {
      return { error: e.message };
    }
  };

const _createUtility = async (limit, centerName,currency,gamesVersion) => {
  try {
    const utility = await Utils.findOne({});
    if(utility) return {error:'Utility aleady exists.'}
    await Utils.create({
      utility: {
        workstationLimit: limit,
        centerName: centerName,
        numberOfWorkstations:0,
        currency:currency,
        gamesVersion:gamesVersion,
      },
    });
    return { message: "Utility created." };
  } catch (e) {
    return { error: e.message };
  }
};

const _numberOfWorkstations = async()=>{
  try{
    const utility = await Utils.findOne({});
    return {numberOfWorkstations:utility.utility.numberOfWorkstations};
  }catch(e){
    return {error:e.message}
  }
}
const _incrementNumberOfWorkstations = async()=>{
  try{
    const utility = await Utils.findOne({});
    utility.utility.numberOfWorkstations+=1;
    utility.save();    
  }catch(e){
    return {error:e.message}
  }
}

const _workstationLimit = async()=>{
  try{
    const utility = await Utils.findOne({});
    return {workstationLimit:utility.utility.workstationLimit}
  }catch(e){
    return {error:e.message}
  }
}
const _incrementGamesVersion = async()=>{
  try{
    const utility = await Utils.findOne({});
    const currentVersion = utility.utility.gamesVersion; 
    utility.utility.gamesVersion+=1;
    utility.save();
    return {message:`New Games Version: ${currentVersion}`}
  }catch(e){
    return {error:e.message}
  }
}
const _getCurrency = async()=>{
  try{
    const utility = await Utils.findOne({});
    const currency = utility.utility.currency; 
    return {currency:currency}
  }catch(e){
    return {error:e.message}
  }
}



module.exports = {
  _getUtility,
  _setWorkstationLimit,
  _setUtilityCenterName,
  _createUtility,
  _numberOfWorkstations,
  _workstationLimit,
  _incrementNumberOfWorkstations,
  _incrementGamesVersion,
  _getCurrency
};
