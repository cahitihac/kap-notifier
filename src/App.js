import React from 'react';
import logo from './logo.svg';
import './App.css';

const makeRequest = async () => {
  const afterDisclosureIndex = getLastSeenDisclosureIndex()
  const requestURL = afterDisclosureIndex ?   
                  `https://www.kap.org.tr/tr/api/disclosures?afterDisclosureIndex=${parseInt(afterDisclosureIndex)}` :
                  'https://www.kap.org.tr/tr/api/disclosures'
  try {
      const response = await fetch(requestURL)
      const results = await response.json()
      if (results.length > 0) {
          setLastSeenDisclosureIndex(results[0].basic.disclosureIndex)
      }
      return results
  } catch (error) {
      return [];   
  }
}

const setLastSeenDisclosureIndex = (disclosureIndex) => {
  const lastDisclosureIndex = localStorage.setItem('lastDisclosureIndex', disclosureIndex)
  return lastDisclosureIndex
}

const getLastSeenDisclosureIndex = () => {
  const lastDisclosureIndex = localStorage.getItem('lastDisclosureIndex')
  return lastDisclosureIndex
}

const formatResult = (results) => {
  const formattedResults = results.map((result) => {
      return (
          `<div class="box">
              <div class="time">
                  <p>${result.publishDate}</p>
              </div>
              <div class="notification">
                  <p style="display: inline;">${result.companyName}</p><br/>
                  <a href="https://www.kap.org.tr/tr/Bildirim/${result.disclosureIndex}" target="_blank">
                      ${result.summary}
                  </a>
              </div>
          </div>`
      )
  })
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
