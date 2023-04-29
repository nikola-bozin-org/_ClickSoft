import React, { useContext,useRef } from 'react'
import './MapElementConfiguration.css'
import add from '../../../../images/add.png'
import { CenterContext } from '../../../../contexts/CenterContext'

const MapElementConfiguration = ({}) => {
  const {setShowAddWorkStation,setLastWorkstationGridElementPosition} = useContext(CenterContext)
  const mapElementRef = useRef(null);

  const onClick = () =>{
    // const rect = mapElementRef.current.getBoundingClientRect()
    // const x = rect.left
    // const y = rect.top
    // setLastWorkstationGridElementPosition([x,y]);
    setShowAddWorkStation(true);
  }

  return (
    <div ref={mapElementRef} onClick={onClick} className='map-element-configuration'>
      <div className="map-element-cfg-img-wrapper">
        <img src={add} alt="" className="map-element-configuration-add invertColor" />
      </div>
    </div>
  )
}

export default MapElementConfiguration