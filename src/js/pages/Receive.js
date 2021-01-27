import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import clipboard from "clipboard-polyfill";
import actions from "../actions/utils";

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import CloseIcon from "../components/icons/CloseIcon";

export default class Receive extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.RECEIVE,
            account: props.account,
            _is_address_copied: false
        };
    };
    
    _copy_address = () => {
        
        // Copy the address to the clipboard and trigger some shit
        clipboard.writeText(this.state.account.address);    
        this.setState({_is_address_copied: true});
        actions.trigger_sfx("copy.mp3", 1);
        actions.trigger_vocal("address_copied.mp3", 1);
    }

    render() {
        
        const { L, account, _is_address_copied } = this.state;
        
        const QR_code_value = JSON.stringify({
            protocol: "v.systems",
            api: 1,
            opc: "account",
            address: account.address
        });
        
        let svg_copy_icon = !_is_address_copied ?
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
            </svg>:
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
            </svg>;

        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.RECEIVE}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                    </div>
                </div>

                <div class="qr-card-zone">
                    <div class="card-inset qr-card">
                        <QRCode value={QR_code_value} bgColor="#e6e7ee" fgColor="#31344b" size={216}/>
                    </div>
                </div>
            
                <div class="address-zone">
                    <input class="input-right-button" defaultValue={account.address}/>
                    <button class="input-right-button" onClick={this._copy_address}>
                        {svg_copy_icon}
                    </button>
                </div>
            
                <div class="receive-buttons">
                    <NavLink to={`/`}>
                        <button class="receive-ok-button rounded">OK</button>
                    </NavLink>
                </div>
            </div>
        );
    }
}