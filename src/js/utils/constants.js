import { createBrowserHistory } from "history";
const HISTORY = createBrowserHistory();
const APPLICATION_RELEASE = "0.0.13";
const ADDRESS_EXPLORER = "https://explorer.v.systems/address/";
const APP_URL = "https://vsys-gold-wallet.com/";
const NODES_IP = ["https://wallet.v.systems/api/"];
const CURRENCIES = ["usd","eur", "chf", "rub", "jpy"];
const LANGUAGES = ["en","fr"];
const LOAD_NUMBER_BEFORE_LAST_TRANSACTION = 5;
const LOAD_NUMBER_OF_TRANSACTIONS = 20;

const PAGE_ROUTES = [
    {
        page_regex: /\//,
        page_name: "home",
    },
    {
        page_regex: /\/(menu)\/?/,
        page_name: "menu",
    },
    {
        page_regex: /\/(open)\/?/,
        page_name: "open",
    },
    {
        page_regex: /\/(receive)\/?/,
        page_name: "receive",
    },
    {
        page_regex: /\/(send)\/?/,
        page_name: "send",
    },
    {
        page_regex: /\/(settings)\/?/,
        page_name: "settings",
    },
    {
        page_regex: /\/(security)\/?/,
        page_name: "security",
    },
    {
        page_regex: /\/(terms)\/?/,
        page_name: "terms",
    },
    {
        page_regex: /\/(about)\/?/,
        page_name: "about",
    }
    
];


module.exports = {
    HISTORY: HISTORY,
    PAGE_ROUTES: PAGE_ROUTES,
    ADDRESS_EXPLORER: ADDRESS_EXPLORER,
    APPLICATION_RELEASE: APPLICATION_RELEASE,
    APP_URL: APP_URL,
    NODES_IP: NODES_IP,
    CURRENCIES: CURRENCIES,
    LANGUAGES: LANGUAGES,
    LOAD_NUMBER_BEFORE_LAST_TRANSACTION: LOAD_NUMBER_BEFORE_LAST_TRANSACTION,
    LOAD_NUMBER_OF_TRANSACTIONS: LOAD_NUMBER_OF_TRANSACTIONS
};