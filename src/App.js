import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState([]);
    const [error, setError] = useState('');

    const integer_formatter = new Intl.NumberFormat("en-us", {
      maximumFractionDigits: 0,
    })
    
    const formatOperand = (operand) => {
      if (operand == null) return
      const [integer, decimal] = operand.split(".")
      if (decimal == null) return integer_formatter.format(integer)
      return `${integer_formatter.format(integer)}.${decimal}`
    }

    const convertToString = (number) => formatOperand(number.toString());

    useEffect(() => {
      if (search.length > 0) {
        const time = setTimeout(() => {
          document.querySelector(".countries-grid").style.display='grid'
          setError(null)
          axios.get(`https://restcountries.com/v3.1/name/${search}`)
            .then(res => {
              setCountry(res.data);
            }).catch((err) => {
              setError(`No results with the query "${search}"`)
              document.querySelector(".countries-grid").style.display='none'
            })
        }, 100)
        return () => clearTimeout(time);
      }
      else {
        document.querySelector(".countries-grid").style.display='none'
      }
    }, [search])

    return (
        <div className="App">
          <div className='search'>
              <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search countries.." />
          </div>
          <div className='error-msg'>
            <p>{error}</p>
          </div>
          <div className="countries-grid">
            {
              country.map((item, i) => (
                <div key={i} className="grid-item">
                  <img src={item.flags.png} alt={"Flag of " + item.name.common} title={item.name.common} />
                  <div className='country-info'>
                    <p>Country: {item.name.common}</p>
                    <p>Capital: {item.capital}</p>
                    <p>Population: {convertToString(item.population)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    );
}

export default App;