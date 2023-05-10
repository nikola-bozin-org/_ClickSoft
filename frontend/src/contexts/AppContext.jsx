import { useState } from "react";
import { createContext } from "react";


export const AppContext = createContext({});

export const AppContextProvider = ({children})=>{
    const [currentSidebarSelection,setCurrentSidebarSelection] = useState(4);
    const [isAuthorized,setIsAuthorized]=useState(false);
    const [shouldShowCreateUser, setShouldShowCreateUser] = useState(false);
    const [shouldShowCloseCashRegister,setShouldShowCloseCashRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [sessions,setSessions] = useState([]);
    const [currentCashRegisterSession,setCurrentCashRegisterSession] = useState(null);
    const [allUsersLimit,setAllUsersLimit] = useState(10);
    const [allUsersSkip,setAllUsersSkip] = useState(0);

    const updateUsers = (user) =>{
        setUsers([user,...users])
    }
    const deleteUser = (username) =>{
        setUsers(users.filter((user)=>user.username!==username))
    }

    const value = {
        allUsersLimit,
        allUsersSkip,
        setAllUsersLimit,
        setAllUsersSkip,
        currentSidebarSelection,
        setCurrentSidebarSelection,
        isAuthorized,
        setIsAuthorized,
        shouldShowCreateUser,
        setShouldShowCreateUser, 
        shouldShowCloseCashRegister,
        setShouldShowCloseCashRegister,
        isLoading,
        setIsLoading,
        users,
        setUsers,
        deleteUser,
        updateUsers,
        sessions,
        setSessions,
        currentCashRegisterSession,
        setCurrentCashRegisterSession,
    }

    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}