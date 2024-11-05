import React, { useEffect, useState } from 'react';
import "./App.css";

const App = () => {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState({ mktCap: null, percentage: null });

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
      setFilterData(json);
    };
    getData();
  }, []);

  function handleSearchInput(e) {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const newFilterData = data.filter(item => 
      item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value)
    );
    setFilterData(newFilterData);
  }

  const sortByMarketCap = () => {
    const sorted = [...filterData].sort((a, b) => {
      return sortOrder.mktCap === 'asc'
        ? a.market_cap - b.market_cap
        : b.market_cap - a.market_cap;
    });
    setFilterData(sorted);
    setSortOrder({ mktCap: sortOrder.mktCap === 'asc' ? 'desc' : 'asc', percentage: null });
  };

  const sortByPercentage = () => {
    const sorted = [...filterData].sort((a, b) => {
      return sortOrder.percentage === 'asc'
        ? a.price_change_percentage_24h - b.price_change_percentage_24h
        : b.price_change_percentage_24h - a.price_change_percentage_24h;
    });
    setFilterData(sorted);
    setSortOrder({ percentage: sortOrder.percentage === 'asc' ? 'desc' : 'asc', mktCap: null });
  };

  return (
    <>
      <div className="search-container">
        <input 
          type="text" 
          placeholder='Search by name or symbol' 
          value={searchValue} 
          onChange={handleSearchInput} 
        />
        <button onClick={sortByMarketCap}>Sort By Mkt Cap</button>
        <button onClick={sortByPercentage}>Sort By Percentage</button>
      </div>
      <div className='container'>
        {
          filterData.length > 0 ? (
            filterData.map(item => (
              <div className="container-item" key={item.id}>
                <div>
                  <img src={item.image} alt={item.name} /> 
                </div>
                <div>
                  <p>{item.name}</p>
                </div>
                <div className="symbol">
                  <p>{item.symbol}</p>
                </div>
                <div>
                  <p className='current-price'>${item.current_price}</p>
                </div>
                <div>
                  <p>${item.total_volume}</p>
                </div>
                <div>
                  <p 
                    className='percentage' 
                    style={{ color: item.price_change_percentage_24h > 0 ? "green" : "red" }}
                  >
                    {item.price_change_percentage_24h}%
                  </p>
                </div>
                <div>
                  <p><span>Mkt cap:</span> ${item.market_cap}</p>
                </div>
              </div>
            ))
          ) : (
            <h1>Data not found</h1>
          )
        }   
      </div>
    </>
  );
};

export default App;
