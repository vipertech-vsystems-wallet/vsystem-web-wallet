import triplesec from "triplesec";
import PouchDB from "pouchdb";
import vsys from "@virtualeconomy/js-v-sdk";
import converters from "../utils/converters";
import base58 from "base-58";

import { clean_json_text } from "../utils/json";

import { NODES_IP, CURRENCIES } from "../utils/constants";

/* VSYS SETUP */
const constants = vsys.constants;
const node_address = NODES_IP[0];
const network_byte = constants.MAINNET_BYTE;
var chain = new vsys.Blockchain(node_address, network_byte);

/* DB */
const query_db = new PouchDB("query_db", {revs_limit: 1, auto_compaction: true});
const accounts_db = new PouchDB("accounts_db", {revs_limit: 1, auto_compaction: true});
/*const logged_accounts_db = new PouchDB("logged_accounts_db", {revs_limit: 1, auto_compaction: true});*/
const all_settings_db = new PouchDB("all_settings_db", {revs_limit: 1, auto_compaction: true});

let logged_account = null;
let all_settings = null;

function _loadJSON(url, callback_function) {
    let data_file = url;
    let http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    }catch (e) {
        // Internet Explorer Browsers
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        }catch (e) {

            try{
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e) {
                // Something went wrong
                callback_function(null);
            }

        }
    }

    http_request.onreadystatechange = function() {

        if (http_request.readyState == 4  ) {
            // Javascript function JSON.parse to parse JSON data
            let jsonObj = JSON.parse(http_request.responseText);

            callback_function(jsonObj);
        }
    }

    http_request.open("GET", data_file, true);
    http_request.send();
}

function _makeId(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+*%&/()=?!$";
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function _format_amount(amount) {
    
    const amount_scaled = amount / 100000000;
    const amount_rounded = Math.round(amount_scaled * 100) / 100
    const amount_fixed_two = amount_rounded .toFixed(2);
    
    return amount_fixed_two;
}

function _format_attachment(attachment) {

    const attachment_bytes = base58.decode(attachment);
    return converters.byteArrayToString(attachment_bytes);
}

function _format_transaction(transaction) {
    
    
    const formated_transaction = {
        id: transaction.id,
        fee: _format_amount(transaction.feeCharged),
        timestamp: transaction.timestamp / 1000000,
        sender: transaction.proofs[0].address,
        recipient: transaction.recipient,
        amount: _format_amount(transaction.amount),
        memo: _format_attachment(transaction.attachment)
    };
    
    return formated_transaction;
}

function _merge_object(obj1, obj2){

    let merged_object = obj1 || {};

    for (let attrname in obj2) {

        if(typeof obj2[attrname] !== "undefined") {

            merged_object[attrname] = obj2[attrname];
        }
    }

    return merged_object;
}

function get_settings(callback_function) {
    
    if(all_settings !== null) {
        
        callback_function(all_settings);
    }

    function cache_callback_function(error, response) {

        let doc_valid = false;
        let all_docs_query_error = false;

        if(!error) {

            // Get settings docs
            const settings = response.rows.map(function (row) {

                return row.doc;
            });

            // Choose the first
            if(typeof settings[0] !== "undefined") {


                if(settings[0].data !== "undefined") {

                    const setting = JSON.parse(settings[0].data);

                    if(typeof setting.node_address !== "undefined") {

                        doc_valid = true;
                        all_settings = _merge_object(all_settings, setting);
                        callback_function(all_settings);
                    }
                }

                // Delete all others
                for(let i = 1; i < settings.length; i++) {

                    all_settings_db.remove(settings[i]);
                }

            }
        }else {

            all_docs_query_error = true;
        }

        // Create new
        if(!doc_valid || all_docs_query_error) {

            all_settings = {
                node_address: node_address,
                explorer_address: "https://explorer.v.systems/address/"
            };

            all_settings_db.put({
                _id: '1',
                data: JSON.stringify(all_settings)
            });

            callback_function(all_settings);
        }
    }

    all_settings_db.allDocs({
        include_docs: true
    }, cache_callback_function);
    
}

function set_settings(settings, callback_function) {

    let all_setting_doc = null;

    function cache_callback_function(error, response) {

        if(!error) {

            // Get settings docs
            const settings_docs = response.rows.map(function (row) {

                return row.doc;
            });

            // Choose the first
            if(typeof settings_docs[0] !== "undefined") {

                if(settings_docs[0].data !== "undefined") {

                    const setting = JSON.parse(settings_docs[0].data);

                    if(typeof setting.node_address !== "undefined") {

                        all_setting_doc = settings_docs[0];
                    }
                }

                // Delete all others
                for(let i = 1; i < settings_docs.length; i++) {

                    all_settings_db.remove(settings_docs[i]);
                }

            }
        }

        // Create new
        if(!all_setting_doc) {

            const default_all_settings = {
                node_address: node_address,
                explorer_address: "https://explorer.v.systems/address/",
                sfx_enabled: false,
                vocal_enabled: false,
                selected_currency: "usd",
                selected_language: "en"
            };

            all_settings = _merge_object(default_all_settings, settings);


            all_settings_db.post({
                data: JSON.stringify(all_settings)
            });

            callback_function(all_settings);
        }else { // Update

            const stored_settings = JSON.parse(all_setting_doc.data);
            all_settings = _merge_object(stored_settings, settings);

            all_settings_db.put({
                _id: all_setting_doc._id,
                _rev: all_setting_doc._rev,
                data: JSON.stringify(all_settings)
            });

            callback_function(all_settings);

        }
    }

    all_settings_db.allDocs({
        include_docs: true
    }, cache_callback_function);
}

function is_logged() {
    
    return (logged_account !== null);
}

function create_account(password, name, callback_function) {
    
    let seed = _makeId(32);
    let new_account = new vsys.Account(network_byte);
    new_account.buildFromSeed(seed, 0);
    
    // Encrypt using triplesec
    triplesec.encrypt({

        data: new triplesec.Buffer(new_account.private_key),
        key: new triplesec.Buffer(password)

    }, function(error, buffer) {

        if(!error) {

            let pushed_account = {
                name: name,
                address: new_account.address,
                public_key: new_account.public_key,
                encrypted_private_key: buffer.toString('hex')
            };
            
            
            // Push account into DB
            accounts_db.put({
                _id: pushed_account.address,
                data: JSON.stringify(pushed_account),
                timestamp: Date.now(),
            });
            

            let new_logged_account = {
                name: name,
                address: new_account.address,
                public_key: new_account.public_key,
                private_key: new_account.private_key,
                encrypted_private_key: buffer.toString('hex')
            };

            logged_account = new_logged_account;
            callback_function(logged_account);
            
        }else {
            
            callback_function(null);
        }

    });
}

function get_accounts(callback_function) {

    function accounts_callback_function(error, response) {
        
        if(!error) {
            
            // Get settings docs
            const accounts_docs = response.rows.map(function (row) {
                
                let account = JSON.parse(row.doc.data);
                account._rev = row.doc._rev;
                return account;
            });

            callback_function(accounts_docs);   
        }else {
            
            callback_function(null);
        }
    }
    
    accounts_db.allDocs({
        include_docs: true
    }, accounts_callback_function);
}

function change_password(public_key = "", old_password = "", new_password = "", _new_name = "", callback_function) {

    
    function set_new_password(new_account) {

        // Encrypt using triplesec
        triplesec.encrypt({

            data: new triplesec.Buffer(new_account.private_key),
            key: new triplesec.Buffer(new_password)

        }, function(error, buffer) {

            if(!error) {

                const account = {
                    name: _new_name,
                    address: new_account.address,
                    public_key: new_account.public_key,
                    encrypted_private_key: buffer.toString('hex')
                };

                
                // Push account into DB
                accounts_db.put({
                    _id: account.address,
                    _rev: new_account._rev,
                    data: JSON.stringify(account),
                    timestamp: Date.now(),
                });

                logged_account = account;
                logged_account.private_key = new_account.private_key;
                callback_function(logged_account);

            }else {

                callback_function(null);
            }

        });
    }
    
    // Find the account in DB
    if(public_key !== "" && old_password !== "") {

        function accounts_callback_function(all_accounts) {

            for(let i = 0; i < all_accounts.length; i++) {

                let account = all_accounts[i];

                if(account.public_key == public_key) {

                    // Is it the right password ?
                    triplesec.decrypt({

                        data:          new triplesec.Buffer(account.encrypted_private_key, "hex"),
                        key:           new triplesec.Buffer(old_password)

                    }, function (error, buffer) {

                        if(!error) {

                            account.private_key = buffer.toString();
                            logged_account = account;
                            set_new_password(logged_account);
                        }else {

                            callback_function(null);
                        }

                    });

                }
            }

        }

        get_accounts(accounts_callback_function);
    }else {

        callback_function(null);
    }
}

function login(public_key = "", password = "", callback_function) {
    
    if(public_key == "" && password == "" && logged_account !== null) {
        
        return callback_function(logged_account);
    }
    
    // Find the account in DB
    if(public_key !== "" && password !== "") {

        function accounts_callback_function(all_accounts) {

            for(let i = 0; i < all_accounts.length; i++) {

                let account = all_accounts[i];

                if(account.public_key == public_key) {
                    
                    // Is it the right password ?
                    triplesec.decrypt({
                    
                        data:          new triplesec.Buffer(account.encrypted_private_key, "hex"),
                        key:           new triplesec.Buffer(password)
                    
                    }, function (error, buffer) {
                        
                        if(!error) {

                            account.private_key = buffer.toString();
                            logged_account = account;
                            callback_function(logged_account);
                        }else {
                            
                            callback_function(null);
                        }
                    
                    });
                    
                }
            }

        }

        get_accounts(accounts_callback_function);
    }else {
        
        callback_function(null);
    }
}

function login_from_backup(account = "", password = "", callback_function) {

    function compare_private_public_key(account) {

        // Create new account by private key
        let account_from_pk = new vsys.Account(network_byte);
        account_from_pk.buildFromPrivateKey(account.private_key);

        if(account_from_pk.public_key == account.public_key) {


            // Push account in DB
            const new_account = {
                address: account.address,
                public_key: account.public_key,
                encrypted_private_key: account.encrypted_private_key
            };

            try {
                accounts_db.put({
                    _id: new_account.address,
                    data: JSON.stringify(account),
                    timestamp: Date.now(),
                });
            } catch (error) {


            }

            logged_account = account;
            callback_function(logged_account);

        }else {

            callback_function(null);
        }
    }

    // Decrypt private key
    triplesec.decrypt({

        data:          new triplesec.Buffer(account.encrypted_private_key, "hex"),
        key:           new triplesec.Buffer(password)

    }, function (error, buffer) {

        if(!error) {

            account.private_key = buffer.toString();
            compare_private_public_key(account);
        }else {

            callback_function(null);
        }

    });
}

function logout(address = "", callback_function = function(){}) {

    logged_account = null;
    callback_function(logged_account);
}

function delete_accounts(callback_function) {

    accounts_db.allDocs().then(function (result) {

        result.rows.map(function (row) {
            accounts_db.remove(row.id, row.value.rev);
        });

    }).then(function () {

        callback_function(true);
    }).catch(function (err) {

        callback_function(error);
    });
}

function get_balance(address = "", callback_function) {

    const query_id = "get_balance_" + address;
    const cache_time = 1 * 1000;

    query_db.get(query_id, function(err, doc) {
        if (!err) { 
            
            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                callback_function(doc.balance);
            }else { // if old update

                chain.getBalance(address).then(response => {
    
                    const formatted_balance = _format_amount(response.balance);

                    query_db.put({
                        _id: doc._id,
                        _rev: doc._rev,
                        timestamp: Date.now(),
                        balance: formatted_balance
                    });
                    
                    callback_function(formatted_balance);
                    
                }, respError => {
    
                        callback_function(null);
                });
            }
                
        }else {
            
            // Get data from network
            chain.getBalance(address).then(response => {

                const formatted_balance = _format_amount(response.balance);

                query_db.put({
                    _id: query_id,
                    timestamp: Date.now(),
                    balance: formatted_balance
                });
    
                callback_function(formatted_balance);
    
            }, respError => {
    
                    callback_function(null);
            });
        }
        
    });
}

function get_transactions(address = "", number_of_record = 0, offset = 0, callback_function) {

    const query_id = "get_transactions_" + address + "_" + number_of_record + "_" + offset;
    const cache_time = 1 * 1000;

    query_db.get(query_id, function(err, doc) {
        if (!err) {

            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                const formated_transactions = clean_json_text(doc.transactions);
                
                
                callback_function(JSON.parse(formated_transactions));
            }else { // if old update

                chain.getTxHistory(address, number_of_record, offset).then(response => {

                    if(typeof response[0] !== "undefined") {

                        const formated_transactions = response[0].map(transaction => _format_transaction(transaction));
    
                        query_db.put({
                            _id: doc._id,
                            _rev: doc._rev,
                            timestamp: Date.now(),
                            transactions: JSON.stringify(formated_transactions)
                        });
        
                        callback_function(formated_transactions);
                    }else {
    
                        callback_function(null);
                    }

                }, respError => {
    
                        callback_function(null);
                });
            }

        }else {

            // Get data from network
            chain.getTxHistory(address, number_of_record, offset).then(response => {

                if(typeof response[0] !== "undefined") {

                    const formated_transactions = response[0].map(transaction => _format_transaction(transaction));

                    query_db.put({
                        _id: query_id,
                        timestamp: Date.now(),
                        transactions: JSON.stringify(formated_transactions)
                    });
                    
                    callback_function(formated_transactions);
                }else {
    
                    callback_function(null);
                }
    
            }, respError => {
    
                    callback_function(null);
            });

        }
    });

}

function send_transaction(private_key, address, amount, memo, callback_function) {

    let transaction = new vsys.Transaction(network_byte);
    let account = new vsys.Account(network_byte);
    account.buildFromPrivateKey(private_key);
    const public_key = account.getPublicKey();
    const timestamp = Date.now() * 1e6;

    transaction.buildPaymentTx(public_key, address, amount, memo, timestamp);
    const bytes = transaction.toBytes();
    const signature = account.getSignature(bytes);
    const send_transaction = transaction.toJsonForSendingTx(signature);

    account.sendTransaction(chain, send_transaction).then(response => {

        callback_function(response);
}, respError => {

        callback_function(null);
    });

}

function get_currencies_change(callback_function) {

    const query_id = "get_currencies_change";
    const cache_time = 60 * 1000;
    
    const crypto_id = "v-systems";
    const currencies_string = CURRENCIES.join(",");
    const url="https://api.coingecko.com/api/v3/simple/price?ids=" + crypto_id + "&vs_currencies=" + currencies_string;
    
    


    query_db.get(query_id, function(err, doc) {
        if (!err) {

            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                const currencies_change = clean_json_text(doc.change);


                callback_function(JSON.parse(currencies_change));
            }else { // if old update

                _loadJSON(url, function (response) {

                    const currencies_change = response[crypto_id];

                    query_db.put({
                        _id: query_id,
                        _rev: doc._rev,
                        timestamp: Date.now(),
                        change: JSON.stringify(currencies_change)
                    });
                    
                    callback_function(currencies_change);
                });
            }

        }else {

            // Get data from network
            _loadJSON(url, function (response) {

                const currencies_change = response[crypto_id];

                query_db.put({
                    _id: query_id,
                    timestamp: Date.now(),
                    change: JSON.stringify(currencies_change)
                });

                callback_function(currencies_change);
            });
        }
    });
    
}


module.exports = {
    get_settings: get_settings,
    set_settings: set_settings,
    create_account: create_account,
    get_accounts: get_accounts,
    login: login,
    is_logged: is_logged,
    login_from_backup: login_from_backup,
    change_password: change_password,
    delete_accounts: delete_accounts,
    logout: logout,
    get_balance: get_balance,
    get_transactions: get_transactions,
    send_transaction: send_transaction,
    get_currencies_change: get_currencies_change
};