let isFirstVisit = true
let responseTime = null

const makeRequest = async () => {
    const afterDisclosureIndex = getLastSeenDisclosureIndex()
    const requestURL = !isFirstVisit && afterDisclosureIndex ?   
        `http://localhost:3003?afterDisclosureIndex=${parseInt(afterDisclosureIndex)}` :
        'http://localhost:3003'
    isFirstVisit = false

    try {
        const response = await fetch(requestURL)
        const results = await response.json()
        if (results.length > 0) {
            setLastSeenDisclosureIndex(results[0].basic.disclosureIndex)
        }

        responseTime = new Date()

        // if this is the first request there will be hundreds of records
        // first 50 records are enough to present
        return results.slice(0, 50)
    } catch (error) {
        return []
    }
}

const createNotification = (title, text) => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  } else {
    const notification = new Notification(title, {
      icon: "https://png2.cleanpng.com/sh/3ad3e85458f9e84cbeafaf37d0988b39/L0KzQYm3V8E1N5Q0g9t8c4Dxd37qgfxqbpD3httqLXfyfLW0kwV0cF5sh95tLXH2PbL1TflvfpZ4jN9uboSwd7FzhL1jaV5sh95tLXLkgn68gsQ6a5M2fqhuNnTmQnAAVsQyPGo5TqMAM0G4RoOAWMM1PWM4RuJ3Zx==/kisspng-california-gold-rush-gold-as-an-investment-gold-ba-gold-bar-5b49cb1f6e6dc2.7641494615315627834523.png",
      body: text,
    })

    const audio = new Audio("https://notificationsounds.com/soundfiles/d7a728a67d909e714c0774e22cb806f2/file-sounds-1150-pristine.mp3")
    audio.play()

    notification.onclick = function () {
      console.log("Notification clicked")
    }
  }
}

const getLastSeenDisclosureIndex = () => {
    const lastDisclosureIndex = localStorage.getItem('lastDisclosureIndex')
    return lastDisclosureIndex
}

const setLastSeenDisclosureIndex = (disclosureIndex) => {
    const lastDisclosureIndex = localStorage.setItem('lastDisclosureIndex', disclosureIndex)
    return lastDisclosureIndex
}

const formatResults = (results) => {
    let formattedResults = ""

    results.forEach((result) => {
        formattedResults +=`<div class="box">
            <div class="time">
                <p>${result.basic.publishDate}</p>
            </div>
            <div class="time">
                <p>${responseTime.getHours()}:${responseTime.getMinutes()}:${responseTime.getSeconds()}</p>
            </div>
            <div class="notification">
                <p style="display: inline;">${result.basic.companyName}</p><br/>
                <a href="https://www.kap.org.tr/tr/Bildirim/${result.basic.disclosureIndex}" target="_blank">
                    ${result.basic.summary || "Buraya tiklayin"}
                </a>
            </div>
        </div>`
    })
    return formattedResults
}

const playAlarm = () => {
    const snd = new Audio('https://notificationsounds.com/soundfiles/df877f3865752637daa540ea9cbc474f/file-sounds-1106-serious-strike.mp3')
    snd.play()
}

document.getElementById('start').addEventListener('click', () => {
    app.innerHTML = ''
    setInterval(async () => {
        const app = document.getElementById('app')
        const results = await makeRequest()
        const itemsToAppend = formatResults(results)
        if (itemsToAppend) {
            app.innerHTML = itemsToAppend + app.innerHTML
            playAlarm()
            // createNotification('KAP', 'Yeni bildirim var')
        }
    }, 10000)
})