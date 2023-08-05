"use strict";

const VERSION = "v0.3.0";

// get elements
const titleVersionNumber = <HTMLSpanElement>document.getElementById("title-version-number");

const darkTheme = <HTMLLinkElement>document.getElementById("darkStyle");

const navBtn1 = <HTMLButtonElement>document.getElementById("btn-alert");
const updateTime = document.querySelector("#body > nav > div > span:nth-child(5) > span");

const marquee = document.getElementById("marquee");
const marquee2 = document.getElementById("marquee2");

const DAX: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#dax > div.value > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#change"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#arrow"),
    "changeClass": <HTMLDivElement>document.querySelector("#dax > div.change-block")
};
const SP500: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#sp500 > div.value > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#sp500 > div.change-block > span:nth-child(2)"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#sp500 > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": <HTMLDivElement>document.querySelector("#sp500 > div.change-block")
};
const FTSE100: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#ftse100 > div.value > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#ftse100 > div.change-block > span:nth-child(2)"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#ftse100 > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": <HTMLDivElement>document.querySelector("#ftse100 > div.change-block")
};
const NIKKEI: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#nikkei > div.value > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#nikkei > div.change-block > span:nth-child(2)"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#nikkei > div.change-block > span.material-symbols-outlined.change-arrow"),
    "changeClass": <HTMLDivElement>document.querySelector("#nikkei > div.change-block")
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
const BTC: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#btc > div:nth-child(2) > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#btc > div:nth-child(3) > span:nth-child(2)"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#btc > div:nth-child(3) > span.material-symbols-outlined"),
    "changeClass": <HTMLDivElement>document.querySelector("#btc > div:nth-child(3)")
};
const ETH: CardObject = {
    "value": <HTMLSpanElement>document.querySelector("#eth > div:nth-child(2) > span:nth-child(2)"),
    "change": <HTMLSpanElement>document.querySelector("#eth > div:nth-child(3) > span:nth-child(2)"),
    "changeIcon": <HTMLSpanElement>document.querySelector("#eth > div:nth-child(3) > span.material-symbols-outlined"),
    "changeClass": <HTMLDivElement>document.querySelector("#eth > div:nth-child(3)"),
};

const newsArticles = document.getElementById("news-articles");

const alertPlaceholder = document.getElementById("liveAlertPlaceholder");


// theme slider
// switch between light & dark mode
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

// apis
const cryptoUrls = [
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true&precision=2",
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur&include_24hr_change=true&precision=2",
    "https://api.coingecko.com/api/v3/global"
];

// stocks for runner
const stockSymbols = [
    // US
    "AMZN",
    "AAPL",
    //"MSFT",
    "META",
    //"TSLA",
    //"GOOGL",
    //"DIS",
    "JPM",
    //"BAC",
    "PEP",
    // EU
    //"",
    // DE
    //"MUV2",
    //"BMW",
    //"DPW",
    //"ADS",
    //"RWE",
    // UK
    //"",
    // ASIA
    //""
]
const stockUrls = stockSymbols.map((symbol: string) => {
    // @ts-ignore: API key defined in HTML header
    return `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ApiKeyAlphavantage}`;
});

const newsUrl = [
    // @ts-ignore: API key defined in HTML header
    `https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${ApiKeyNYTimes}`
];

const ChangeClasses: Array<string> = ["positive", "negative", "neutral"];

// functions
function getChangeCSSClass(num: number | string) {
    if (typeof num === "string") {
        // convert to float
        num = parseFloat(num);
    }

    if (num > 0) {
        return "positive";
    }
    else if (num < 0) {
        return "negative";
    }
    else {
        // num == 0, return no class
        return "neutral";
    }
}

function getChangeIcon(num: number | string) {
    if (typeof num === "string") {
        // convert to float
        num = parseFloat(num);
    }

    if (num > 0) {
        return "arrow_drop_up";
    }
    else if (num < 0) {
        return "arrow_drop_down";
    }
    else {
        // num == 0
        return "arrow_right";
    }
}

function triggerAlert(message: string, type: BootstrapStyle) {
    // trigger an alert which disappears after 10s
    const alertWrapper = document.createElement("div");
    alertWrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible show fade" role="alert">`,
        `<div>${message}</div>`,
        '<button id="closeAlert" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder?.append(alertWrapper);
    // destroy alert automatically after 10s
    setTimeout(() => {
        document.getElementById("closeAlert")?.click();
    }, 10000);
}

function putPlaceholders(section: "runner" | "indices" | "crypto" | "news") {
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
            const indices: Array<CardObject> = [DAX, SP500, FTSE100, NIKKEI];
            const elements: Array<string> = ["value", "change"];
            indices.forEach((card) => {
                elements.forEach((elm) => {
                    // @ts-ignore
                    if (card[elm]) {
                        // @ts-ignore
                        card[elm].innerHTML = placeholderElement;
                    }
                });
            });
            break;
        }
        
        case "crypto": {
            const crypto: Array<any> = [cryptoMktVol, BTC, ETH];
            const elements2: Array<string> = ["value", "change"];
            crypto.forEach((card) => {
                elements2.forEach((elm) => {
                    if (card[elm]) {
                        card[elm].innerHTML = placeholderElement;
                    }
                });
            });
            // manually adjust last element since different structure
            // TODO adjust naming of HTML object variables
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

// updating elements
async function updateVersion() {
    // append local git branch name to version number in board
    let data: Array<any> = [];

    let err = false;
    // @ts-expect-error: GitBranchApiUrl defined in HTML header
    await fetchUrls([GitBranchApiUrl]
        ).then((res) => {
            data = res
        }).catch((error) => {
            triggerAlert(error, "danger");
            err = true;
        });
    if (err) {
        return;
    }

    try {
        if (data[0]["status"] === "OK" ) {
            let branchName: string = data[0]["branchName"];
            // only display branch name if not "main" (prod)
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

async function updateRunner(): Promise<void> {
    // update marquee data content
    let data: Array<[Dict: string]> = [];

    let err = false;
    await fetchUrls(stockUrls
        ).then((res) => {
            data = res;
        }).catch((error) => {
            triggerAlert(error, "danger");
            err = true;
        });
    if (err) {
        return;
    }

    try {
        // populate element content
        let elements = "";
        data.forEach((element: [Dict: string]) => {
            const perc = roundTo(parseFloat(element[<any>"Global Quote"][<any>"10. change percent"].slice(0, 5)));
            elements = elements + `<li>
<span style="color: lightgrey;">${element[<any>"Global Quote"][<any>"01. symbol"]}</span> 
${roundTo(element[<any>"Global Quote"][<any>"05. price"])} 
<span class="${getChangeCSSClass(perc)}">${perc + "%"}</span>
</li>
<li>——</li>`;
        });
        // insert into runner elements
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

async function updateIndexStats(): Promise<void> {
    // update financial indices data
    let data: Array<any> = [];

    let err = false;
    // @ts-expect-error: IndicesApiUrl defined in HTML header
    await fetchUrls([IndicesApiUrl]
        ).then((res) => {
            data = res
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
    // update cryptocurrency data
    let [btcData, ethData, marketData] = ["", "", ""];

    let err = false;
    await fetchUrls(cryptoUrls
        ).then((res) => {
            [btcData, ethData, marketData] = res;
        }).catch((error) => {
            triggerAlert(error, "danger");
            err = true;
        });
    if (err) {
        return;
    }

    try {
        // update elements
        if (cryptoMktVol["value"] && cryptoMktVol["change"] && cryptoMktVol["changeIcon"] && cryptoMktVol["changeClass"]) {
            cryptoMktVol["value"].innerHTML = nFormatter(<number><unknown>marketData[<any>"data"][<any>"total_market_cap"][<any>"eur"], 2);
            const change = roundTo(marketData[<any>"data"][<any>"market_cap_change_percentage_24h_usd"]);
            cryptoMktVol["change"].innerHTML = change;
            cryptoMktVol["changeIcon"].innerHTML = getChangeIcon(change);
            cryptoMktVol["changeClass"].classList.remove(...ChangeClasses);
            cryptoMktVol["changeClass"].classList.add(getChangeCSSClass(change));
        }
        else {
            console.log("ERROR updating cryptoMktVol element", cryptoMktVol);
        }

        if (BtcVsEthCap["valueBtc"] && BtcVsEthCap["valueEth"]) {
            BtcVsEthCap["valueBtc"].innerHTML = "BTC " + roundTo(marketData[<any>"data"][<any>"market_cap_percentage"][<any>"btc"]);
            BtcVsEthCap["valueEth"].innerHTML = "ETH " + roundTo(marketData[<any>"data"][<any>"market_cap_percentage"][<any>"eth"]);
        }
        else {
            console.log("ERROR updating BtcVsEthCap element", BtcVsEthCap);
        }

        if (BTC["value"] && BTC["change"] && BTC["changeIcon"] && BTC["changeClass"]) {
            BTC["value"].innerHTML = btcData[<any>"bitcoin"][<any>"eur"].toLocaleString();
            const btc24Change = roundTo(btcData[<any>"bitcoin"][<any>"eur_24h_change"]);
            BTC["change"].innerHTML = btc24Change;
            BTC["changeIcon"].innerHTML = getChangeIcon(btc24Change);
            BTC["changeClass"].classList.remove(...ChangeClasses);
            BTC["changeClass"].classList.add(getChangeCSSClass(btc24Change));
        }
        else {
            console.log("ERROR updating BTC element", BTC);
        }

        if (ETH["value"] && ETH["change"] && ETH["changeIcon"] && ETH["changeClass"]) {
            ETH["value"].innerHTML = ethData[<any>"ethereum"][<any>"eur"].toLocaleString();
            const eth24Change = roundTo(ethData[<any>"ethereum"][<any>"eur_24h_change"]);
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
    // update news data
    let data;

    let err = false;
    await fetchUrls(newsUrl
        ).then((res) => {
            data = res;
        }).catch((error) => {
            triggerAlert(error, "danger");
            err = true;
        });
    if (err) {
        return;
    }

    try {
        // extract all titles only
        const titles: Array<string> = [];
        // @ts-expect-error: if data is undefined, catched by block
        const results: Array<[Dict: string]> = data[0]["results"];
        results.forEach((article) => {
            titles.push(article[<any>"title"]);
        });
        
        // update element
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

function updateTimestamp(ts: string) {
    if (updateTime != undefined) {
        updateTime.innerHTML = ts;
    }
}

async function updateDashboard(wait: boolean = true) {
    if (wait) {
        await sleep(3000); // delay b4 load
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
        // @ts-ignore: env vars defined in HTML header
        triggerAlert(`No API keys set in ENV (AV: ${ApiKeyAlphavantage.length}, NYT: ${ApiKeyNYTimes.length})`, "danger");
        // @ts-ignore: env vars defined in HTML header
        console.log("ApiKeyAlphavantage", ApiKeyAlphavantage, typeof ApiKeyAlphavantage, ApiKeyAlphavantage.length);
        // @ts-ignore: env vars defined in HTML header
        console.log("ApiKeyNYTimes", ApiKeyNYTimes, typeof ApiKeyNYTimes, ApiKeyNYTimes.length);
        console.log(checkEnvVars());
    }
    
}

function main() {
    navBtn1.addEventListener("click", () => {
        updateDashboard(false);
    });

    // main dashboard app
    updateDashboard();
        setInterval(() => {
            // update dashboard automatically every 30 mins
            updateDashboard();
        }, 1800000);
}

// init dashboard
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        main();
    }
}