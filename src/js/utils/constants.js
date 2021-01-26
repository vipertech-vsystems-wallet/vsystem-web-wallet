import { createBrowserHistory } from "history";
const HISTORY = createBrowserHistory();
const APPLICATION_RELEASE = "0.0.12";
const ADDRESS_EXPLORER = "https://explorer.v.systems/address/";
const APP_URL = "https://vsys-gold-wallet.com/";
const NODES_IP = ["https://wallet.v.systems/api/"];
const CURRENCIES = ["usd","eur", "chf", "rub", "jpy"];
const LANGUAGES = ["en","fr"];
const LOAD_NUMBER_BEFORE_LAST_TRANSACTION = 5;
const LOAD_NUMBER_OF_TRANSACTIONS = 20;
const CACHE_NAME = "v1";
const IMMUTABLE_FILES = [
    "fonts/Saira-Regular.ttf",
    "sounds/sfx/copy.mp3",
    "sounds/sfx/error.mp3",
    "sounds/sfx/logout.mp3",
    "sounds/sfx/page.mp3",
    "sounds/sfx/refresh.mp3",
    "sounds/sfx/scan.mp3",
    "sounds/sfx/scanner.mp3",
    "sounds/sfx/sent.mp3",
    "sounds/vocal/accounts_reset.mp3",
    "sounds/vocal/address_copied.mp3",
    "sounds/vocal/backup_file_downloaded.mp3",
    "sounds/vocal/code_successfully_scanned.mp3",
    "sounds/vocal/connection_established.mp3",
    "sounds/vocal/currency_changed.mp3",
    "sounds/vocal/invalid_backup_file.mp3",
    "sounds/vocal/language_changed.mp3",
    "sounds/vocal/password_changed.mp3",
    "sounds/vocal/passwords_are_identical.mp3",
    "sounds/vocal/sound_effects_disabled.mp3",
    "sounds/vocal/sound_effects_enabled.mp3",
    "sounds/vocal/transaction_failed.mp3",
    "sounds/vocal/transaction_received.mp3",
    "sounds/vocal/transaction_sent.mp3",
    "sounds/vocal/valid_backup_file.mp3",
    "sounds/vocal/vocal_disabled.mp3",
    "sounds/vocal/vocal_enabled.mp3",
    "sounds/vocal/wallet_updated.mp3",
    "sounds/vocal/wrong_password.mp3"
];
const MUTABLE_FILES = [
    "css/pages.css",
    "css/theme.css",
    "/",
    "index.html",
    "404.html",
    "client.min.js",
    "manifest.json"
];


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
    LOAD_NUMBER_OF_TRANSACTIONS: LOAD_NUMBER_OF_TRANSACTIONS,
    CACHE_NAME: CACHE_NAME,
    IMMUTABLE_FILES: IMMUTABLE_FILES,
    MUTABLE_FILES: MUTABLE_FILES
};