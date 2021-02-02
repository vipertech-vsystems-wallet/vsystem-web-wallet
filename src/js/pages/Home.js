import React from "react";

import { Link } from "react-router-dom";

import { NavLink } from "react-router-dom";
import { ADDRESS_EXPLORER, LOAD_NUMBER_OF_TRANSACTIONS, LOAD_NUMBER_BEFORE_LAST_TRANSACTION } from "../utils/constants";
import api from "../utils/api";

import actions from "../actions/utils";
import { List, InfiniteLoader } from "react-virtualized";
import Loader from "../components/Loader";
import Transaction from "../components/Transaction";

import MenuIcon from "../components/icons/MenuIcon";
import RefreshIcon from "../components/icons/RefreshIcon";
import ArrowDownIcon from "../components/icons/ArrowDownIcon";
import ArrowUpIcon from "../components/icons/ArrowUpIcon";

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.HOME,
            name: props.account.name,
            address: props.account.address,
            currencies_change: props.currencies_change,
            _is_home_header_shown: true,
            _selected_currency: "usd",
            _balance: null,
            _transactions: null,
            _is_new_transactions_loaded: false,
            _width: 0,
            _height: 0
        };
    };

    componentDidMount() {

        // Listen to resize envent to trigger a function that update dimension in state
        window.addEventListener("resize", this._update_dimensions.bind(this));
        this._update_dimensions();

        const { address } = this.state;

        // Load transaction balance and settings if address is not null
        if(typeof address !== null) {

            this._load_more_transactions();
            api.get_balance(address, this._process_get_balance_query_result);
            api.get_settings(this._process_get_settings_query_result);
        }
    }
    
    componentWillUnmount() {
        
        // Unlisten to resize envent to trigger a function that update dimension in state
        window.removeEventListener("resize", this._update_dimensions.bind(this));
    }
    
    _update_dimensions() {

        // Update width and height in state
        let w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            _width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            _height = w.innerHeight|| documentElement.clientHeight || body.clientHeight;

        this.setState({_width, _height});
    }

    _process_get_settings_query_result = (settings) => {

        // Set the selected fiat currency in the component
        const _selected_currency = (typeof settings.selected_currency !== "undefined") ? settings.selected_currency: "usd";
        this.setState({_selected_currency});
    };

    _process_get_balance_query_result = (result) => {
    
        // Set balance on request result
        this.setState({_balance: result});
    };

    _process_get_more_transactions_query_result = (_new_transactions) => {
    
        console.log(_new_transactions);
        
        // Concat transactions or set first transactions if null
        const _transactions = this.state._transactions === null ? _new_transactions: this.state._transactions.concat(_new_transactions);
        
        // Set the new transactions in the state (normal) along with if it has been laoded (So it can load more after it has been set)
        this.setState({_transactions, _is_new_transactions_loaded: true});
    };

    _toggle_home_header_shown = () => {
        
        // Show or hide header (logo, balancem, and buttons)
        this.setState({_is_home_header_shown: !this.state._is_home_header_shown});
    };
    
    _open_explorer = () => {
        
        // Open the block explorer in a new tab for the account's address
        window.open(ADDRESS_EXPLORER + this.state.address);
    };

    _load_more_transactions = () => {
        
        // Get address, transactions and compute the number of transactions
        const { address, _transactions } = this.state;
        const number_of_transaction = _transactions === null ? 0: _transactions.length;
         
        // Tell the component that new transactions hasn't been loaded yet (So it doesn't try to load more yet)
        this.setState({_is_new_transactions_loaded: false});
        
        // Get some tranaactions with the offset corresponding to the number of transactions
        api.get_transactions(address, LOAD_NUMBER_OF_TRANSACTIONS, number_of_transaction, this._process_get_more_transactions_query_result);
    };

    
    /* TRICK: If transactions aren't loaded it will try to load more but only if "_is_new_transactions_loaded" is TRUE so
    * We tell trough this function that it hasn't been loaded since X (index + X) transactions back or 0 to never load anything
    */
    _is_transaction_loaded = ({index}) => {
        
        const { _transactions } = this.state;
        // Index + 0 and it don't works, just waiting for offset to work in the api
        return !!_transactions[index + LOAD_NUMBER_BEFORE_LAST_TRANSACTION]; 
    };

    _refresh_api_page = () => {
        
        const { address } = this.state;
    
        if(typeof address !== null) {
            
            // Get balance
            api.get_balance(address, this._process_get_balance_query_result);
            
            // Reset transaction THEN load more  
            this.setState({_transactions: null}, this._load_more_transactions);
            
            // Get settings
            api.get_settings(this._process_get_settings_query_result)

            // trigger sounds
            actions.trigger_vocal("wallet_updated.mp3", 1);
            actions.trigger_sfx("refresh.mp3", 1);
        }
    };
    
    // Render transaction at by index and apply style to work in absolute position (react virtualized)
    _render_transaction = ({key, index, isScrolling, isVisible, style}) => {

        const { _transactions, address, currencies_change, _selected_currency } = this.state;

        const transaction = _transactions[index];
        const currency_change = currencies_change[_selected_currency];
        const is_received = transaction.recipient == address;
       
        return (
            <Transaction
                key={index}
                style={style}
                transaction={transaction}
                currency_change={currency_change}
                is_received={is_received}
                selected_currency={_selected_currency}
            />
        );
        
    };

    render() {
        
        const {_is_home_header_shown, name, _balance, address, _transactions, _height, _width, _selected_currency, currencies_change, L } = this.state;
        const currency_change = currencies_change[_selected_currency];
        
        // Different height to know transactions area height thereafter
        const home_header_height = 344;
        const toolbar_height = 81;
        const transactions_header_height = 42 - 10;
        
        // Transactions area height
        const transactions_blocks_height = _is_home_header_shown ? 
            _height - (home_header_height + toolbar_height + transactions_header_height):
            _height - (toolbar_height + transactions_header_height);
        
        // Transaction area height in px with unit
        const no_transactions_blocks_height = (transactions_blocks_height - 32).toString() + "px";
        
        // Balance (VSYS and FIAT) or loader element
        const header_ammount_crypto_item = _balance == null ? <Loader />: _balance + " VSYS";
        const header_ammount_fiat_item = _balance == null ? L.LOADING: (_balance * currency_change).toFixed(2) + " " + _selected_currency.toUpperCase();
        
        // Home header if shown
        const home_header = _is_home_header_shown ?
            <div class="home-header">
                <div class="home-header-circle card-inset"><img src="../images/vsys-logo.png" /></div>
                <div class="home-header-ammount-crypto">{header_ammount_crypto_item}</div>
                <div class="home-header-ammount-fiat">{header_ammount_fiat_item}</div>
                <div class="home-header-buttons">
                    <NavLink to={`/send`}>
                        <button class="send rounded">
                            {L.SEND}
                        </button>
                    </NavLink>
                    <NavLink to={`/receive`}>
                        <button class="receive rounded">
                            {L.RECEIVE}
                        </button>
                    </NavLink>
                </div>
            </div>: null;
    
        // Transaction arrow DOWN (header shown) or UP (header hidden)
        const transaction_icon = _is_home_header_shown ? <ArrowDownIcon/>: <ArrowUpIcon/>;
    
        // Virtualized list of transactions if not not null or loader
        let transactions_things = _transactions == null ?
            <div style={{lineHeight: no_transactions_blocks_height}} class="no-transactions disabled">
                <Loader />
            </div>:
            <InfiniteLoader
                loadMoreRows={this._load_more_transactions} 
                rowCount={_transactions.length}
                isRowLoaded={this._is_transaction_loaded}
                minimumBatchSize={LOAD_NUMBER_OF_TRANSACTIONS}
                threshold={LOAD_NUMBER_BEFORE_LAST_TRANSACTION}>
                    
                {({onRowsRendered, registerChild}) => (
                    <List width={_width}
                          height={transactions_blocks_height}
                          ref={registerChild}
                          onRowsRendered={onRowsRendered}
                          rowCount={_transactions.length}
                          rowHeight={94}
                          rowRenderer={this._render_transaction}>
                    </List>
                )}
                
            </InfiniteLoader>;
    
        // if transactions aren't null
        if(_transactions !== null) {

            // but empty
            if(!_transactions.length) {
                
                // It means that there is no transactions to show
                transactions_things = <div style={{lineHeight: no_transactions_blocks_height}} class="no-transactions disabled">{L.NO_TRANSACTIONS}</div>;
            }
        }

        return (
            <div class="body-content">

                <div class="toolbar">
                    <div class="toolbar-inner">
                    <div class="toolbar-address" onClick={this._refresh_api_page}>
                        <RefreshIcon/>   
                        {name}
                    </div>
                        <NavLink to={`/menu`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <MenuIcon/>
                            </button>
                        </NavLink>
                    </div>
                </div>
    
                {home_header}  
    
                <div class="home-transactions">
                    <div class="transactions-header">
                        <div class="transactions-header-title" onClick={this._toggle_home_header_shown}>
                            {transaction_icon}
                            <span>{L.MY_TRANSACTIONS}</span>
                        </div>
                        <div class="transactions-header-explorer" onClick={this._open_explorer}>{L.EXPLORER}</div>
                    </div>
                    <div class="transactions-blocks" style={{height: transactions_blocks_height}}>
                        {transactions_things}
                    </div>
                </div>
        
            </div>
        );
    }
}