import React, { useEffect, useState } from 'react';
import './Games.css';
import InternalTopbar from '../internal-topbar/InternalTopbar'
import InternalSearch from '../internal-search/InternalSearch'
import HandleButton from '../handle-button/HandleButton';
import statistics from '../../images/statistics.png'
import { useSelector } from 'react-redux'
import {extractDate, extractHours} from '../../utils'
import AddGame from '../add-game/AddGame';

const imageCache = {};

const useCachedImage = (imageId) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(null);  // Reset the image when imageId changes
    setLoading(true);

    const fetchImage = async () => {
      if (imageCache[imageId]) {
        setImage(imageCache[imageId]);
        setLoading(false);
        return;
      }
      if (!imageId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:9876/api/games/${imageId}`, {
          headers: {
            'token': localStorage.getItem('accessToken')
          }
        });
        if (!response.ok) {
          throw new Error(response.error);
        }
        const blob = await response.blob();
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        imageCache[imageId] = imageUrl;
        setImage(imageUrl);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [imageId]);

  return { loading, image };
};




const Games = () => {
  const allGames = useSelector((state)=>state.games.allGames);
  const [shouldShowAddGame,setShouldShowAddGame] = useState(false);
  const [tableData,setTableData] = useState(allGames); 

  useEffect(()=>{
    setTableData(allGames)
  },[allGames])

  const onClickAddGame = () => {
    setShouldShowAddGame(true);
  }
  const addGameOnCancelClick = () =>{
    setShouldShowAddGame(false);
  }
  const onSearchInputChange = (e)=>{
    const value = e.target.value;
    if(value===''){setTableData(allGames);return;}
    const filteredGames = allGames.filter((data)=>data.name.toLowerCase().includes(value))
    setTableData(filteredGames);
  }
  return (
    <>
    {shouldShowAddGame&& <AddGame onCancelClick={addGameOnCancelClick}/>}
    <div className='games'>
      <InternalTopbar text={'Games'} useBorderBottom={true} />
      <div className="games-search-and-add">
        <InternalSearch onChange={onSearchInputChange} placeholderText={'Game...'} useBorderBottom={false} />
        <HandleButton onClick={onClickAddGame} text={'Add game'} className={'add-game-button'}/>
      </div>
      <div className="all-games">
        <GameRow className='custom-game-row' name={'Name'} zone={'Zone'} category={'Category'} lastModified={'Last Modified'} isJustIconText={true} isJustStatsText={true} isJustEnabledText={true}/>
        {tableData.map((game)=>(
          <GameRow key={game._id} name={game.name} imageId={game.image} zone={game.zone} category={game.category} lastModified={`${extractDate(game.lastModified)} - ${extractHours(game.lastModified)}`}/>
          ))}
      </div>
    </div>
    </>
  )
}

const GameRow = ({ name, imageId, zone, category, lastModified, isEnabled, isJustIconText = false, isJustStatsText = false, isJustEnabledText = false, useBorderRight = true, className = '', useCustomHeight }) => {
  const { image, loading } = useCachedImage(imageId);
  const [enabledText,setEnabledText] = useState('Yes');
  const onClickEnabled = (e)=>{
    // e.stopPropagation();
    // if(enabledText==='Yes') setEnabledText('No')
    // else setEnabledText('Yes')
  }

  if (loading) return null;

  return (
    <div className={`game-row ${className}`}>
      <div style={{height:`${!isJustIconText?'150px':'100%'}`}} className={`gr-icon  ${useBorderRight ? 'use-border-right' : ''}`}>
        {isJustIconText ? 'Icon' : <img alt='' src={image} className='gr-icon-img' />}
      </div>
      <div className={`gr-name ${useBorderRight ? 'use-border-right' : ''}`}>
        <p>{name}</p>
      </div>
      <div className={`gr-category ${useBorderRight ? 'use-border-right' : ''}`}>
        {zone}
      </div>
      <div className={`gr-last-modified ${useBorderRight ? 'use-border-right' : ''}`}>
        {lastModified}
      </div>
      <div className={`gr-open-stats ${useBorderRight ? 'use-border-right' : ''}`}>
        {isJustStatsText?'Stats': <img alt='' src={statistics} className="stats-img invertColor"/>}
      </div>
      <div onClick={onClickEnabled} className={`gr-is-enabled `}>
        {isJustEnabledText ? 'Enabled' :<p>{enabledText}</p>}
      </div>
    </div>
  )
}


export default Games