// making api calls
async function fetchUrls(urls: Array<string>) {
    const responses: Array<any> = await Promise.all(
        urls.map((url) =>
            fetch(url,
                {
                    method: "GET",
                })
                .then((res) => res.json())
        )
    );
    // update global vars
    return responses;
}

// formatting numbers into string notations (e.g. 63K, ...)
function nFormatter(num: number, digits: number) {
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
    const item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

// round number
function roundTo(num: number | string, decimal_places = 2) {
    if (typeof num === "string") {
        num = parseFloat(num);
    }
    // round number to 2 decimal places by default
    return num.toFixed(decimal_places);
}

// get formatted TS
function getTimestamp() {
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    return `${(h > 9) ? h : ("0" + h)}:${(m > 9) ? m : ("0" + m)}:${(s > 9) ? s : ("0" + s)}`;
}

// sleep
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// TYPES //

// bootstrap alert/button/badge style types
const bootstrapStyleTypes = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
type BootstrapStyle = typeof bootstrapStyleTypes[number];

// card element
interface CardObject {
    "value": HTMLSpanElement,
    "change": HTMLSpanElement,
    "changeIcon": HTMLSpanElement,
    "changeClass": HTMLDivElement
}

// check if env vars are set
// env vars contain the external API keys
function checkEnvVars(): boolean {
    // @ts-ignore: vars defined in HTML header from env vars
    if (ApiKeyAlphavantage === "" && ApiKeyNYTimes === "") {
        return false;
    }
    return true;
}