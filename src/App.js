import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: []
    }
  }

  async componentDidMount() {
    const results = await this.makeRequest()
    this.setState({ results })
  }

  render() {
    const { results } = this.state;

    return (
      results.map((result) => {
        return (
          <div className="box">
            <div className="time">
              <p>{result.basic.publishDate}</p>
            </div>
            <div className="notification">
              <p style="display: inline;">{result.basic.companyName}</p>
              <br />
              <a
                href="https://www.kap.org.tr/tr/Bildirim/${result.disclosureIndex}"
                target="_blank"
              >
                {result.basic.summary}
              </a>
            </div>
          </div>
        );
      })
    );
  }

  makeRequest = async () => {
    const afterDisclosureIndex = this.getLastSeenDisclosureIndex();
    const requestURL = afterDisclosureIndex
      ? `localhost:3003?afterDisclosureIndex=${parseInt(
          afterDisclosureIndex
        )}`
      : 'localhost:3003';

    try {
      const response = await fetch(requestURL, {headers: {}});
      const results = await response.json();
      if (results.length > 0) {
        this.setLastSeenDisclosureIndex(results[0].basic.disclosureIndex);
      }

      return results;
    } catch (error) {
      return [];
    }
  };

  setLastSeenDisclosureIndex = (disclosureIndex) => {
    const lastDisclosureIndex = localStorage.setItem(
      "lastDisclosureIndex",
      disclosureIndex
    );
    return lastDisclosureIndex;
  };
  
  getLastSeenDisclosureIndex = () => {
    const lastDisclosureIndex = localStorage.getItem("lastDisclosureIndex");
    return lastDisclosureIndex;
  };
}

export default App;


// const makeRequest = async () => {
//   const afterDisclosureIndex = getLastSeenDisclosureIndex();
//   const requestURL = afterDisclosureIndex
//     ? `https://www.kap.org.tr/tr/api/disclosures?afterDisclosureIndex=${parseInt(
//         afterDisclosureIndex
//       )}`
//     : "https://www.kap.org.tr/tr/api/disclosures";
//   try {
//     const response = await fetch(requestURL);
//     const results = await response.json();
//     if (results.length > 0) {
//       setLastSeenDisclosureIndex(results[0].basic.disclosureIndex);
//     }
//     return results;
//   } catch (error) {
//     return [];
//   }
// };

// const setLastSeenDisclosureIndex = (disclosureIndex) => {
//   const lastDisclosureIndex = localStorage.setItem(
//     "lastDisclosureIndex",
//     disclosureIndex
//   );
//   return lastDisclosureIndex;
// };

// const getLastSeenDisclosureIndex = () => {
//   const lastDisclosureIndex = localStorage.getItem("lastDisclosureIndex");
//   return lastDisclosureIndex;
// };

// const formatResult = (results) => {
//   const formattedResults = results.map((result) => {
//     return (
//       <div className="box">
//         <div className="time">
//           <p>{result.publishDate}</p>
//         </div>
//         <div className="notification">
//           <p style="display: inline;">{result.companyName}</p>
//           <br />
//           <a
//             href="https://www.kap.org.tr/tr/Bildirim/${result.disclosureIndex}"
//             target="_blank"
//           >
//             {result.summary}
//           </a>
//         </div>
//       </div>
//     );
//   });
//   return formattedResults;
// };