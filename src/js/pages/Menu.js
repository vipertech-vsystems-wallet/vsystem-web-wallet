import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import actions from "../actions/utils";
import { HISTORY } from "../utils/constants";

import CloseIcon from "../components/icons/CloseIcon";
import AboutIcon from "../components/icons/AboutIcon";
import OpenIcon from "../components/icons/OpenIcon";
import SecurityIcon from "../components/icons/SecurityIcon";
import SettingsIcon from "../components/icons/SettingsIcon";
import LogOutIcon from "../components/icons/LogOutIcon";

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            _history: HISTORY,
            L: props.L.PAGES.MENU
        };
    };
    
    // Trigger a dispatched action 
    _logout = () => {

        actions.trigger_logout();
    };
    
    render() {
        
        const { L } = this.state;
    
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.MENU}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                    </div>
                </div>
        
                <div class="menu-links">

                    <NavLink to={`/about`} class="nav-link card gold">
                        <button class="circle button-inset">
                            <AboutIcon/>
                        </button>
                        <span>{L.ABOUT}</span>
                    </NavLink>
                    
                    <NavLink to={`/open`} class="nav-link card">
                        <button class="circle button-inset">
                            <OpenIcon/>
                        </button>
                        <span>{L.ACCOUNTS}</span>
                    </NavLink>

                    <NavLink to={`/security`} class="nav-link card">
                        <button class="circle button-inset">
                            <SecurityIcon/>
                        </button>
                        <span>{L.SECURITY}</span>
                    </NavLink>
                    
                    <NavLink to={`/settings`} class="nav-link card">
                        <button class="circle button-inset">
                            <SettingsIcon/>
                        </button>
                        <span>{L.SETTINGS}</span>
                    </NavLink>
                    
                    <a onClick={this._logout} class="nav-link card">
                        <button class="circle button-inset">
                            <LogOutIcon/>
                        </button>
                        <span>{L.LOGOUT}</span>
                    </a>
        
                </div>
            </div>
        );
    }
}