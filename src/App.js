import React, {useContext} from 'react';
import './App.css';
import Map from './components/Map';
import Card from './components/Card';

import { StateContext } from './context/Context';



function App() {

  const [card, setCard, addComment, setAddComment] = useContext(StateContext)


  const handleCard = () => {
    setCard(!card)
  }

  return (
    <div className="App">
    <button onClick={handleCard}>Context</button>
      <Map/>

     {card ?  <Card/>  :  ""}

    </div>
  );
}

export default App;
