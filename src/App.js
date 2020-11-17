import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disclosures: [],
      responseTime: new Date(),
      isFirstVisit: true,
    };
  }

  render() {
    const { disclosures, responseTime } = this.state;

    return disclosures.length > 0 ? (
      disclosures.map((result) => {
        return (
          <div className="box" key={result.basic.disclosureIndex}>
            <div className="time">
              <p className="bold">Bildirim Zamanı</p>
              <p>{result.basic.publishDate.replace("Bugün", "")}</p>
            </div>
            <div className="time">
              <p className="bold">Gösterim Zamanı</p>
              <p>{`${responseTime.getHours()}:${responseTime.getMinutes()}:${responseTime.getSeconds()}`}</p>
            </div>
            <div className="stockCodes">
              <p className="bold">İlgili Hisseler</p>
              <p>{result.basic.stockCodes || result.basic.relatedStocks}</p>
            </div>
            <div className="notification">
              <div>
                <p>{result.basic.companyName}</p>
              </div>
              <div>
                <a
                  href={`https://www.kap.org.tr/tr/Bildirim/${result.basic.disclosureIndex}`}
                  target="_blank"
                >
                  {result.basic.summary && result.basic.summary.length > 1
                    ? result.basic.summary
                    : "Buraya tiklayin"}
                </a>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="start">
        <a href="#" onClick={this.startPolling}>
          Başlamak için buraya tıklayın
        </a>
      </div>
    );
  }

  startPolling = () => {
    setInterval(async () => {
      const { disclosures } = this.state;
      const results = await this.makeRequest();
      if (results.length > 0) {
        this.playAlarm();
        this.setState({
          disclosures: [...results, ...disclosures],
          responseTime: new Date()
        });
      }
    }, 2000);
  };

  makeRequest = async () => {
    const { isFirstVisit } = this.state;
    const afterDisclosureIndex = this.getLastDisclosureIndex();
    const requestURL =
      !isFirstVisit && afterDisclosureIndex
        ? `http://localhost:3003?afterDisclosureIndex=${parseInt(
            afterDisclosureIndex
          )}`
        : "http://localhost:3003";

    this.setState({ isFirstVisit: false });

    try {
      const response = await fetch(requestURL);
      const results = await response.json();
      if (results.length > 0) {
        this.setLastDisclosureIndex(results[0].basic.disclosureIndex);
      }

      // if this is the first request there will be hundreds of records
      // first 50 records are enough to present
      return results.slice(0, 50);
    } catch (error) {
      return [];
    }
  };

  getLastDisclosureIndex = () => {
    const lastDisclosureIndex = localStorage.getItem("lastDisclosureIndex");
    return lastDisclosureIndex;
  };

  setLastDisclosureIndex = (disclosureIndex) => {
    const lastDisclosureIndex = localStorage.setItem(
      "lastDisclosureIndex",
      disclosureIndex
    );
    return lastDisclosureIndex;
  };

  playAlarm = () => {
    const snd = new Audio(
      "definite-555.mp3"
    );
    snd.play();
  };
}

export default App;
