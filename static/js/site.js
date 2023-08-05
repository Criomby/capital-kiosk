"use strict";
const VERSION = "v0.3.0";
const titleVersionNumber = document.getElementById("title-version-number");
const darkTheme = document.getElementById("darkStyle");
const navBtn1 = document.getElementById("btn-alert");
const updateTime = document.querySelector("#body > nav > div > span:nth-child(5) > span");
const marquee = document.getElementById("marquee");
const marquee2 = document.getElementById("marquee2");
const DAX = {
    "value": document.querySelector("#dax > div.value > span:nth-child(2)"),
    "change": document.querySelector("#change"),
    "changeIcon": document.querySelector("#arrow"),
    "changeClass": document.querySelector("#dax > div.change-block")
};
const SP500 = {
    "value": document.querySelector("#sp500 > div.value > span:nth-child(2)"),
    "change": document.querySelector("#sp500 > div.change-block > span:nth-child(2)"),
    "changeIcon": document.querySelector("#sp500 > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": document.querySelector("#sp500 > div.change-block")
};
const FTSE100 = {
    "value": document.querySelector("#ftse100 > div.value > span:nth-child(2)"),
    "change": document.querySelector("#ftse100 > div.change-block > span:nth-child(2)"),
    "changeIcon": document.querySelector("#ftse100 > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": document.querySelector("#ftse100 > div.change-block")
};
const NIKKEI = {
    "value": document.querySelector("#nikkei > div.value > span:nth-child(2)"),
    "change": document.querySelector("#nikkei > div.change-block > span:nth-child(2)"),
    "changeIcon": document.querySelector("#nikkei > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": document.querySelector("#nikkei > div.change-block")
};
const cryptoMktVol = {
    "value": document.querySelector("#crypto-mkt-vol > div:nth-child(2) > span.value"),
    "change": document.querySelector("#crypto-mkt-vol > div:nth-child(3) > span:nth-child(2)"),
    "changeIcon": document.querySelector("#crypto-mkt-vol > div:nth-child(3) > span:nth-child(1)"),
    "changeClass": document.querySelector("#crypto-mkt-vol > div:nth-child(3)")
};
const BtcVsEthCap = {
    "valueBtc": document.querySelector("#crypto-24h-chng > div:nth-child(2) > span:nth-child(2)"),
    "valueEth": document.querySelector("#crypto-24h-chng > div:nth-child(3) > span:nth-child(2)"),
};
const BTC = {
    "value": document.querySelector("#btc > div:nth-child(2) > span:nth-child(2)"),
    "change": document.querySelector("#btc > div:nth-child(3) > span:nth-child(2)"),
    "changeIcon": document.querySelector("#btc > div:nth-child(3) > span.material-symbols-outlined"),
    "changeClass": document.querySelector("#btc > div:nth-child(3)")
};
const ETH = {
    "value": document.querySelector("#eth > div:nth-child(2) > span:nth-child(2)"),
    "change": document.querySelector("#eth > div:nth-child(3) > span:nth-child(2)"),
    "changeIcon": document.querySelector("#eth > div:nth-child(3) > span.material-symbols-outlined"),
    "changeClass": document.querySelector("#eth > div:nth-child(3)"),
};
const newsArticles = document.getElementById("news-articles");
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
function switchSiteTheme() {
    if (darkTheme?.disabled) {
        darkTheme.disabled = false;
    }
    else if (darkTheme?.disabled === false) {
        darkTheme.disabled = true;
    }
}
document.getElementById("themeSlider")?.addEventListener("click", () => {
    switchSiteTheme();
});
const cryptoUrls = [
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true&precision=2",
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur&include_24hr_change=true&precision=2",
    "https://api.coingecko.com/api/v3/global"
];
const stockSymbols = [
    "AMZN",
    "AAPL",
    "META",
    "JPM",
    "PEP",
];
const stockUrls = stockSymbols.map((symbol) => {
    return `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ApiKeyAlphavantage}`;
});
const newsUrl = [
    `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${ApiKeyNYTimes}`
];
const ChangeClasses = ["positive", "negative", "neutral"];
function getChangeCSSClass(num) {
    if (typeof num === "string") {
        num = parseFloat(num);
    }
    if (num > 0) {
        return "positive";
    }
    else if (num < 0) {
        return "negative";
    }
    else {
        return "neutral";
    }
}
function getChangeIcon(num) {
    if (typeof num === "string") {
        num = parseFloat(num);
    }
    if (num > 0) {
        return "arrow_drop_up";
    }
    else if (num < 0) {
        return "arrow_drop_down";
    }
    else {
        return "arrow_right";
    }
}
function triggerAlert(message, type) {
    const alertWrapper = document.createElement("div");
    alertWrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible show fade" role="alert">`,
        `<div>${message}</div>`,
        '<button id="closeAlert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder?.append(alertWrapper);
    setTimeout(() => {
        document.getElementById("closeAlert")?.click();
    }, 10000);
}
function putPlaceholders(section) {
    const placeholderElement = `<span class="placeholder">00.00</span>`;
    switch (section) {
        case "runner": {
            const runnerPlaceholder = `
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
                <li>____________</li>
                <li>——</li>
            `;
            if (marquee && marquee2) {
                marquee.innerHTML = runnerPlaceholder;
                marquee2.innerHTML = runnerPlaceholder;
            }
            break;
        }
        case "indices": {
            const indices = [DAX, SP500, FTSE100, NIKKEI];
            const elements = ["value", "change"];
            indices.forEach((card) => {
                elements.forEach((elm) => {
                    if (card[elm]) {
                        card[elm].innerHTML = placeholderElement;
                    }
                });
            });
            break;
        }
        case "crypto": {
            const crypto = [cryptoMktVol, BTC, ETH];
            const elements2 = ["value", "change"];
            crypto.forEach((card) => {
                elements2.forEach((elm) => {
                    if (card[elm]) {
                        card[elm].innerHTML = placeholderElement;
                    }
                });
            });
            if (BtcVsEthCap["valueBtc"] && BtcVsEthCap["valueEth"]) {
                BtcVsEthCap["valueBtc"].innerHTML = placeholderElement;
                BtcVsEthCap["valueEth"].innerHTML = placeholderElement;
            }
            break;
        }
        case "news": {
            if (newsArticles) {
                newsArticles.innerHTML = `<p class="placeholder">Copyright (c) 2023 The New York Times Company. All Rights Reserved.</p>`;
            }
            break;
        }
    }
}
async function updateVersion() {
    let data = [];
    let err = false;
    await fetchUrls([GitBranchApiUrl]).then((res) => {
        data = res;
    }).catch((error) => {
        triggerAlert(error, "danger");
        err = true;
    });
    if (err) {
        return;
    }
    try {
        if (data[0]["status"] === "OK") {
            let branchName = data[0]["branchName"];
            if (branchName === "main") {
                titleVersionNumber.innerHTML = VERSION;
            }
            else {
                titleVersionNumber.innerHTML = VERSION + `-${branchName}`;
            }
        }
        else {
            titleVersionNumber.innerHTML = VERSION + `-<span style="color: red;">ERR</span>`;
            console.log(data);
        }
    }
    catch (error) {
        console.log(error, data);
        triggerAlert("Couldn't fetch git branch name.", "danger");
        titleVersionNumber.innerHTML = VERSION;
    }
}
async function updateRunner() {
    let data = [];
    let err = false;
    await fetchUrls(stockUrls).then((res) => {
        data = res;
    }).catch((error) => {
        triggerAlert(error, "danger");
        err = true;
    });
    if (err) {
        return;
    }
    try {
        let elements = "";
        data.forEach((element) => {
            const perc = roundTo(parseFloat(element["Global Quote"]["10. change percent"].slice(0, 5)));
            elements = elements + `<li>
<span style="color: lightgrey;">${element["Global Quote"]["01. symbol"]}</span> 
${roundTo(element["Global Quote"]["05. price"])} 
<span class="${getChangeCSSClass(perc)}">${perc + "%"}</span>
</li>
<li>——</li>`;
        });
        if (marquee != undefined && marquee2 != undefined) {
            marquee.innerHTML = elements;
            marquee2.innerHTML = elements;
        }
    }
    catch (error) {
        console.error(error);
        console.log("Runner data:", data);
        putPlaceholders("runner");
        triggerAlert("Couldn't fetch runner data.", "danger");
    }
}
async function updateIndexStats() {
    let data = [];
    let err = false;
    await fetchUrls([IndicesApiUrl]).then((res) => {
        data = res;
    }).catch((error) => {
        triggerAlert(error, "danger");
        err = true;
    });
    if (err) {
        return;
    }
    try {
        const indicesData = data[0]["content"];
        const daxData = indicesData["DAX"];
        if (DAX["value"] && DAX["change"] && DAX["changeIcon"] && DAX["changeClass"]) {
            DAX["value"].innerHTML = daxData["value"];
            DAX["change"].innerHTML = daxData["change"];
            DAX["changeIcon"].innerHTML = getChangeIcon(daxData["change"]);
            DAX["changeClass"].classList.remove(...ChangeClasses);
            DAX["changeClass"].classList.add(getChangeCSSClass(daxData["change"]));
        }
        const spData = indicesData["SP500"];
        if (SP500["value"] && SP500["change"] && SP500["changeIcon"] && SP500["changeClass"]) {
            SP500["value"].innerHTML = spData["value"];
            SP500["change"].innerHTML = spData["change"];
            SP500["changeIcon"].innerHTML = getChangeIcon(spData["change"]);
            SP500["changeClass"].classList.remove(...ChangeClasses);
            SP500["changeClass"].classList.add(getChangeCSSClass(spData["change"]));
        }
        const ftseData = indicesData["FTSE100"];
        if (FTSE100["value"] && FTSE100["change"] && FTSE100["changeIcon"] && FTSE100["changeClass"]) {
            FTSE100["value"].innerHTML = ftseData["value"];
            FTSE100["change"].innerHTML = ftseData["change"];
            FTSE100["changeIcon"].innerHTML = getChangeIcon(ftseData["change"]);
            FTSE100["changeClass"].classList.remove(...ChangeClasses);
            FTSE100["changeClass"].classList.add(getChangeCSSClass(ftseData["change"]));
        }
        const nikkeiData = indicesData["N225"];
        if (NIKKEI["value"] && NIKKEI["change"] && NIKKEI["changeIcon"] && NIKKEI["changeClass"]) {
            NIKKEI["value"].innerHTML = nikkeiData["value"];
            NIKKEI["change"].innerHTML = nikkeiData["change"];
            NIKKEI["changeIcon"].innerHTML = getChangeIcon(nikkeiData["change"]);
            NIKKEI["changeClass"].classList.remove(...ChangeClasses);
            NIKKEI["changeClass"].classList.add(getChangeCSSClass(nikkeiData["change"]));
        }
    }
    catch (error) {
        console.error(error);
        console.log("Indices data:", data);
        putPlaceholders("indices");
        triggerAlert("Couldn't fetch indices.", "danger");
    }
}
async function updateCryptoStats() {
    let [btcData, ethData, marketData] = ["", "", ""];
    let err = false;
    await fetchUrls(cryptoUrls).then((res) => {
        [btcData, ethData, marketData] = res;
    }).catch((error) => {
        triggerAlert(error, "danger");
        err = true;
    });
    if (err) {
        return;
    }
    try {
        if (cryptoMktVol["value"] && cryptoMktVol["change"] && cryptoMktVol["changeIcon"] && cryptoMktVol["changeClass"]) {
            cryptoMktVol["value"].innerHTML = nFormatter(marketData["data"]["total_market_cap"]["eur"], 2);
            const change = roundTo(marketData["data"]["market_cap_change_percentage_24h_usd"]);
            cryptoMktVol["change"].innerHTML = change;
            cryptoMktVol["changeIcon"].innerHTML = getChangeIcon(change);
            cryptoMktVol["changeClass"].classList.remove(...ChangeClasses);
            cryptoMktVol["changeClass"].classList.add(getChangeCSSClass(change));
        }
        else {
            console.log("ERROR updating cryptoMktVol element", cryptoMktVol);
        }
        if (BtcVsEthCap["valueBtc"] && BtcVsEthCap["valueEth"]) {
            BtcVsEthCap["valueBtc"].innerHTML = "BTC " + roundTo(marketData["data"]["market_cap_percentage"]["btc"]);
            BtcVsEthCap["valueEth"].innerHTML = "ETH " + roundTo(marketData["data"]["market_cap_percentage"]["eth"]);
        }
        else {
            console.log("ERROR updating BtcVsEthCap element", BtcVsEthCap);
        }
        if (BTC["value"] && BTC["change"] && BTC["changeIcon"] && BTC["changeClass"]) {
            BTC["value"].innerHTML = btcData["bitcoin"]["eur"].toLocaleString();
            const btc24Change = roundTo(btcData["bitcoin"]["eur_24h_change"]);
            BTC["change"].innerHTML = btc24Change;
            BTC["changeIcon"].innerHTML = getChangeIcon(btc24Change);
            BTC["changeClass"].classList.remove(...ChangeClasses);
            BTC["changeClass"].classList.add(getChangeCSSClass(btc24Change));
        }
        else {
            console.log("ERROR updating BTC element", BTC);
        }
        if (ETH["value"] && ETH["change"] && ETH["changeIcon"] && ETH["changeClass"]) {
            ETH["value"].innerHTML = ethData["ethereum"]["eur"].toLocaleString();
            const eth24Change = roundTo(ethData["ethereum"]["eur_24h_change"]);
            ETH["change"].innerHTML = eth24Change;
            ETH["changeIcon"].innerHTML = getChangeIcon(eth24Change);
            ETH["changeClass"].classList.remove(...ChangeClasses);
            ETH["changeClass"].classList.add(getChangeCSSClass(eth24Change));
        }
        else {
            console.log("ERROR updating ETH element", ETH);
        }
    }
    catch (error) {
        console.error(error);
        console.log("Crypto data:", btcData, ethData, marketData);
        putPlaceholders("crypto");
        triggerAlert("Couldn't fetch crypto.", "danger");
    }
}
async function updateNewsSection() {
    let data;
    let err = false;
    await fetchUrls(newsUrl).then((res) => {
        data = res;
    }).catch((error) => {
        triggerAlert(error, "danger");
        err = true;
    });
    if (err) {
        return;
    }
    try {
        const titles = [];
        const results = data[0]["results"];
        results.forEach((article) => {
            titles.push(article["title"]);
        });
        let titlesList = "";
        titles.forEach((title) => {
            titlesList = titlesList + `<p class="news-article glasstile">${title}</p>`;
        });
        if (newsArticles) {
            newsArticles.innerHTML = titlesList;
        }
    }
    catch (error) {
        console.error(error);
        console.log("News data:", data);
        putPlaceholders("news");
        triggerAlert("Couldn't fetch news.", "danger");
    }
}
function updateTimestamp(ts) {
    if (updateTime != undefined) {
        updateTime.innerHTML = ts;
    }
}
async function updateDashboard(wait = true) {
    if (wait) {
        await sleep(3000);
    }
    if (checkEnvVars()) {
        await Promise.all([
            updateVersion(),
            updateRunner(),
            updateIndexStats(),
            updateCryptoStats(),
            updateNewsSection(),
        ]);
        updateTimestamp(getTimestamp());
        triggerAlert("Stats updated.", "primary");
    }
    else {
        triggerAlert(`No API keys set in ENV (AV: ${ApiKeyAlphavantage.length}, NYT: ${ApiKeyNYTimes.length})`, "danger");
        console.log("ApiKeyAlphavantage", ApiKeyAlphavantage, typeof ApiKeyAlphavantage, ApiKeyAlphavantage.length);
        console.log("ApiKeyNYTimes", ApiKeyNYTimes, typeof ApiKeyNYTimes, ApiKeyNYTimes.length);
        console.log(checkEnvVars());
    }
}
function main() {
    navBtn1.addEventListener("click", () => {
        updateDashboard(false);
    });
    updateDashboard();
    setInterval(() => {
        updateDashboard();
    }, 1800000);
}
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        main();
    }
};
async function fetchUrls(urls) {
    const responses = await Promise.all(urls.map((url) => fetch(url, {
        method: "GET",
    })
        .then((res) => res.json())));
    return responses;
}
function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}
function roundTo(num, decimal_places = 2) {
    if (typeof num === "string") {
        num = parseFloat(num);
    }
    return num.toFixed(decimal_places);
}
function getTimestamp() {
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    return `${(h > 9) ? h : ("0" + h)}:${(m > 9) ? m : ("0" + m)}:${(s > 9) ? s : ("0" + s)}`;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bootstrapStyleTypes = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
function checkEnvVars() {
    if (ApiKeyAlphavantage === "" && ApiKeyNYTimes === "") {
        return false;
    }
    return true;
}
