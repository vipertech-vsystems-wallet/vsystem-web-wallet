import { createBrowserHistory } from "history";
const HISTORY = createBrowserHistory();
const DONATION_ADDRESS = "AR82QAxrty3y6VxUEkuyx1dgHs4XHpXkdHp";
const DONATION_GOAL = 500 * 1000;
const APPLICATION_RELEASE = "0.1.0";
const ADDRESS_EXPLORER = "https://explorer.v.systems/address/";
const APP_URL = "https://vsys-gold-wallet.com/";
const NODES_IP = [
    "https://wallet.v.systems/api",
    "http://vnode.vcoin.systems:9922"
];
const CURRENCIES = ["usd","eur", "gbp", "chf", "rub", "jpy"];
const LANGUAGES = ["en","fr"];
const LOAD_NUMBER_BEFORE_LAST_TRANSACTION = 5;
const LOAD_NUMBER_OF_TRANSACTIONS = 20;

const PAGE_ROUTES = [
    {
        page_regex: /\//,
        page_name: "home"
    },
    {
        page_regex: /\/(menu)\/?/,
        page_name: "menu"
    },
    {
        page_regex: /\/(open)\/?/,
        page_name: "open"
    },
    {
        page_regex: /\/(receive)\/?/,
        page_name: "receive"
    },
    {
        page_regex: /\/(send)\/?/,
        page_name: "send"
    },
    {
        page_regex: /\/(settings)\/?/,
        page_name: "settings"
    },
    {
        page_regex: /\/(security)\/?/,
        page_name: "security"
    },
    {
        page_regex: /\/(terms)\/?/,
        page_name: "terms"
    },
    {
        page_regex: /\/(about)\/?/,
        page_name: "about"
    },
    {
        page_regex: /\/(how)\/?/,
        page_name: "how"
    },
    
];


module.exports = {
    HISTORY: HISTORY,
    DONATION_ADDRESS: DONATION_ADDRESS,
    DONATION_GOAL: DONATION_GOAL,
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