import React, { useContext } from 'react';
import './sidebar.css';
import { AppContext } from '../../contexts/AppContext';
import { UsersContext } from '../../contexts/UsersContext';


const Sidebar = ({images}) => {
  const { currentSidebarSelection,setCurrentSidebarSelection,setShouldShowCreateUser } = useContext(AppContext);
  return (
    <div className="sidebar">
      <div className="sidebarButtons">
        {images.map((image, id) => {
          if(id===3)
            return (<SidebarElement exec={()=>{setShouldShowCreateUser(true)}} isSelected={currentSidebarSelection===id} key={id} img={image}/>)
            return (<SidebarElement exec={()=>{setShouldShowCreateUser(false)}} isSelected={currentSidebarSelection===id} key={id} img={image} onClick={setCurrentSidebarSelection} myId={id}/>)
          })}
      </div>
    </div>
  );
};

const SidebarElement = ({ img, onClick, myId, isSelected, exec }) => {
  const handleClick = (e) => {
    if (exec) {
      exec();
    }
    if(onClick)
    onClick(myId);
  };

  return (
    <div
      onClick={handleClick}
      className={`sidebarElement ${isSelected ? `blackBackground` : ``}`}
    >
      <img src={img} alt="" className={`sidebar-button invertColor`} />
    </div>
  );
};


export default Sidebar;
