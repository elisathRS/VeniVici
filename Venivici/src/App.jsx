import { useState, useEffect } from 'react';
import './App.css';

const ACCESSKEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  
  const URL = `https://api.thedogapi.com/v1/images/search?api_key=${ACCESSKEY}?include_breeds=true&has_breeds=true`;

  const [url, setUrl] = useState(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [lifespan, setLifespan] = useState('');
  const [prevItems, setPrevItems] = useState([]);
  const [bannedItems, setBannedItems] = useState([]);
  const [currentName, setCurrentName] = useState('');

  const attributes = [
    { label: 'Breed', value: name },
    { label: 'Weight', value: weight },
    { label: 'Height', value: height },
    { label: 'Lifespan', value: lifespan },
  ];
  
  const mainContent = (
    <div className="attributes-container">
      <div className="flex gap-2">
        {attributes.map((attribute) => (
          <button key={attribute.label} onClick={() => updateBanList(attribute.value)}>
            <p>{`${attribute.label}: ${attribute.value}`}</p>
          </button>
        ))}
      </div>
      <br />
      <div>
        <img className="dog-img" src={url} alt="" />
      </div>
    </div>
  );
  
  useEffect(() => {
    getData();
  }, []); 

  async function getData() {
    try {
      const response = await fetch(URL);
      const data = await response.json();

      const dogUrl = data[0].url;
      const dogBreed = data[0].breeds[0].name;
      const dogWeight = data[0].breeds[0].weight.imperial;
      const dogHeight = data[0].breeds[0].height.imperial;
      const dogLifespan = data[0].breeds[0].life_span;

      if (
        bannedItems.includes(dogWeight) ||
        bannedItems.includes(dogHeight) ||
        bannedItems.includes(dogBreed) ||
        bannedItems.includes(dogLifespan)
      ) {
        getData();
      } else {
        setUrl(dogUrl);
        setWeight(dogWeight);
        setHeight(dogHeight);
        setName(dogBreed);
        setLifespan(dogLifespan);
        setCurrentName(dogBreed);
        getprevDog();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function getprevDog() {
    if (currentName.length >= 1) {
      setPrevItems([...prevItems, currentName]);
    }
  }

  function updateBanList(item) {
    if (!bannedItems.includes(item)) {
      setBannedItems([...bannedItems, item]);
    }
  }

  return (
    <div className="container">
      <div className="header-container">
        <h1>Veni Vici!</h1>
        <h3>Beyond Breeds: Exploring the World of Dogs</h3>
      </div>
      <div className="main-container">
        <div className="prev-item">
          <div>
            <h2>Previously Seen Items</h2>
            {prevItems.map((item, index) => (
              <ul key={index}>
                {item }
              </ul>
            ))}
          </div>
        </div>
        <div className="container-center">
          {url ? mainContent : "Click the button to start"}
          <br /><br />
          <button className='discover-button' onClick={getData}>
            Discover
          </button>
        </div>
        <div className="banned-item">
          <div>
            <h2>Banned Items</h2>
            {bannedItems.map((item, index) => (
              <ul className='itemBan' key={index}>
                {item}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
