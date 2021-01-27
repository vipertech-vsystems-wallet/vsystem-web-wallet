import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import QrReader from 'react-qr-reader';
import api from "../utils/api";

import Loader from "../components/Loader";
import { HISTORY } from "../utils/constants";

import actions from "../actions/utils";

import CloseIcon from "../components/icons/CloseIcon";

export default class Send extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            _history: HISTORY,
            L: props.L.PAGES.SEND,
            address: props.account.address,
            private_key: props.account.private_key,
            currencies_change: props.currencies_change,
            _selected_currency: "usd",
            _send_to_address: "",
            _is_qr: false,
            _balance: 0,
            _amount: 0,
            _amount_vsys: 0,
            _amount_fiat: 0,
            _memo: "",
            _is_send_button_disabled: true,
            _is_sending: false,
            _is_amount_fiat: false
        };
    };

    _process_settings_query_result = (settings) => {

        const _selected_currency = (typeof settings.selected_currency !== "undefined") ? settings.selected_currency: "usd";
        this.setState({_selected_currency});
    };

    _process_get_balance = (_balance) => {

        this.setState({_balance});
    };

    componentDidMount() {
    
        const { address } = this.state;
        api.get_balance(address, this._process_get_balance);
        api.get_settings(this._process_settings_query_result);
    }
    
    _handle_scan = (text) => {

        if (text) {
            
            try {
                
                const data_object = JSON.parse(text);
                
                if(typeof data_object.address !== "undefined") {

                    actions.trigger_sfx("scan.mp3", 1);
                    actions.trigger_vocal("code_successfully_scanned.mp3", 1);
                    this.setState({_send_to_address: data_object.address, _is_qr: false}, this._process_is_send_button_disabled);
                    
                }else {
                    
                    
                }
                
            } catch (error) {
                
            }
        }
    };

    _toggle_is_qr = () => {
        
        const _is_qr = !this.state._is_qr;
        
        if(_is_qr) { actions.trigger_sfx("scanner.mp3", 1); };
        
        this.setState({_is_qr});
    };

    _handle_send_to_input_change = (event) => {
        
        this.setState({_send_to_address: event.target.value}, this._process_is_send_button_disabled);
    };

    _toggle_is_amount_fiat = () => {
      
        let { _is_amount_fiat, _amount, currencies_change, _selected_currency } = this.state;
        _is_amount_fiat = !_is_amount_fiat;
        
        const _amount_vsys = _is_amount_fiat ?
            _amount / currencies_change[_selected_currency]: _amount;
        const _amount_fiat = _is_amount_fiat ?
            _amount: _amount * currencies_change[_selected_currency];
            
        this.setState({_is_amount_fiat, _amount_vsys, _amount_fiat});
    };

    _handle_amount_input_change = (event) => {

        let { _is_amount_fiat, currencies_change, _selected_currency }= this.state;
        
        const _amount = event.target.value;
        
        const _amount_vsys = _is_amount_fiat ?
            _amount / currencies_change[_selected_currency]:
            _amount;
        const _amount_fiat = _is_amount_fiat ?
            _amount:
            _amount * currencies_change[_selected_currency];
        
        this.setState({_amount, _amount_vsys, _amount_fiat}, this._process_is_send_button_disabled);  
    };

    _handle_memo_input_change = (event) => {

        this.setState({_memo: event.target.value}, this._process_is_send_button_disabled);
    };


    _process_send_transaction_results = (response) => {
        
        const { _history } = this.state;
        
        if(response !== null) {
            
            actions.trigger_vocal("transaction_sent.mp3", 1);
            actions.trigger_sfx("sent.mp3", 1);
            _history.push("/", {});
        }else {
            
            actions.trigger_vocal("transaction_failed.mp3", 1);
        }

        this.setState({_is_sending: false, _is_send_button_disabled: false});
    };
    
    _process_is_send_button_disabled = () => {
      
        const { _send_to_address, _amount, _memo, _balance } = this.state;
        const _is_send_button_disabled = !(_send_to_address.length && parseInt(_amount, 10) + 0.1 <= _balance && _memo.length <= 140);
        this.setState({_is_send_button_disabled});
    };
    
    _handle_transaction_submit = () => {
      
        const { private_key, _send_to_address, _amount_vsys, _memo, _is_send_button_disabled } = this.state;
        
        const final_vsys_amount = parseFloat(_amount_vsys).toFixed(2);
        
        if(!_is_send_button_disabled) {
            this.setState({_is_sending: true, _is_send_button_disabled: true});
            api.send_transaction(private_key, _send_to_address, final_vsys_amount, _memo, this._process_send_transaction_results);
        }
        
    };

    render() {
        
        let { L, _send_to_address, _is_qr, _balance, _amount, _memo, _is_send_button_disabled, _is_sending, _selected_currency, currencies_change, _is_amount_fiat, _amount_vsys, _amount_fiat } = this.state;
        
        _amount_vsys = parseFloat(_amount_vsys) || 0;
        _amount_fiat = parseFloat(_amount_fiat) || 0;
        const max_amount = _balance - 0.1;
        
        const send_ammount_in_fiat_currency = (currencies_change[_selected_currency] * (_amount_vsys + 0.1));
        const amount_input_class = (_balance - (_amount_vsys + 0.1) < 0) ? "is-invalid": ""; 
        const send_button_disabled_class = _is_send_button_disabled ? "disabled": "";
        const toggle_fiat_text = _is_amount_fiat ? _selected_currency.toUpperCase(): "VSYS";
        
        const qr_or_fields = _is_qr ?
            <QrReader delay={300} onScan={this._handle_scan} style={{ width: '100%' }}/>:
            <div class="send-inputs">
                <div class="input-group">
                    <input id="SendToInput" type="text" placeholder={L.SEND_TO} value={_send_to_address} onChange={this._handle_send_to_input_change}/>
                    <div class="feedback-input">{L.SELECT_ADDRESS}</div>
                </div>
                <div class="input-group">
                    <span class="toggle-fiat" onClick={this._toggle_is_amount_fiat}>{toggle_fiat_text}</span>
                    <input type="number" id="amount" class={amount_input_class} placeholder={L.AMOUNT} min="0" max={max_amount} value={_amount} onChange={this._handle_amount_input_change} step="0.01" />
                    <div class="feedback-input"><b>{_amount_vsys.toFixed(2) || 0.00}</b> + 0.10 ({send_ammount_in_fiat_currency.toFixed(2)} {_selected_currency.toUpperCase()}) / {_balance} VSYS</div>
                </div>
                <div class="input-group">
                    <textarea placeholder={L.MEMO} value={_memo} onChange={this._handle_memo_input_change}/>
                    <div class="feedback-input">{_memo.length} / 140</div>
                </div>
            </div>;
    
        const send_scan_button_text = _is_qr ? L.BACK: L.SCAN;
        const send_ok_button_component = _is_sending ? <span><Loader /> {L.WAIT}</span> : L.OK;
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.SEND}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                    </div>
                </div>
            
                {qr_or_fields}
            
                <div class="send-buttons">
                    <button class="send-scan-button rounded" onClick={this._toggle_is_qr}>{send_scan_button_text}</button>
                    <button class={"send-ok-button rounded " + send_button_disabled_class} onClick={this._handle_transaction_submit}>{send_ok_button_component}</button>
                </div>
            </div>
        );
    }
}