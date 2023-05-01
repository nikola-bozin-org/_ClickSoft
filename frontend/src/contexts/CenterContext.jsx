import { createContext,useState } from "react";

export const CenterContext = createContext({});



export const CenterContextProvider = ({children})=>{
    const [currentSelectionInternalOption,setCurrentSelectionInternalOption] = useState(0);
    const [showAddWorkStation,setShowAddWorkStation] = useState(false);
    const [lastWorkstationGridElementPosition,setLastWorkstationGridElementPosition] = useState([]);
    const [workstationLimit,setWorkstationLimit] = useState(0);
    const [workstations,setWorkstations] = useState([
        {
            x:2,
            y:2,
            number:10,
        },
        {
            x:0,
            y:0,
            number:2,
        },
        {
            x:10,
            y:2,
            number:3,
        },
        {
            x:1,
            y:5,
            number:6
        },
        {
            x:5,
            y:5,
            number:1
        },
        {
            x:0,
            y:1,
            number:4
        }
    ]);

    const onOptionClicked = (optionId)=>{
        setCurrentSelectionInternalOption(optionId)
    }
    const value ={
        currentSelectionInternalOption,
        onOptionClicked,
        showAddWorkStation,
        setShowAddWorkStation,
        lastWorkstationGridElementPosition,
        setLastWorkstationGridElementPosition,
        workstations,
        setWorkstations,
        workstationLimit,
        setWorkstationLimit
    }

    return (
        <CenterContext.Provider value={value}>{children}</CenterContext.Provider>
    )
}