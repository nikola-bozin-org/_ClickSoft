import React, { useContext, useRef, useState, useEffect } from 'react';
import './MapElementConfiguration.css';
import add from '../../../../images/add.png';
import { CenterContext, CenterContextProvider } from '../../../../contexts/CenterContext';
import { DndControllerContext } from '../../../../contexts/DndControllerContext';

const MapElementConfiguration = ({ workstationComponent, renderWorkstation,row,collumn }) => {
  const  centerContext  = useContext(CenterContext);
  const dndCC = useContext(DndControllerContext);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mapElementRef = useRef(null);

  const updatePosition = () => {
    if (mapElementRef.current) {
      const rect = mapElementRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const onClick = () => {
    if (!renderWorkstation) {
      centerContext.setLastWorkstationClickedPositionInGrid({x:row,y:collumn})
      centerContext.setShowAddWorkStation(true);
    }
  };

  const onMouseEnter = () => {
    // console.info(position)
    // console.info(dndCC.currentComponent);
  };

  const renderAddWorkstationElement = () => {
    return <img src={add} alt="" className="map-element-configuration-add invertColor" />;
  };

  return (
    <div
      ref={mapElementRef}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="map-element-configuration"
    >
      <div className="map-element-cfg-img-wrapper">
        {!renderWorkstation ? renderAddWorkstationElement() : workstationComponent}
      </div>
    </div>
  );
};

export default MapElementConfiguration;
