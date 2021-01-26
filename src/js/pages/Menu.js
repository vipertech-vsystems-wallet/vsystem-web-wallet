import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import actions from "../actions/utils";
import { HISTORY } from "../utils/constants";

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
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                                </svg>
                            </button>
                        </NavLink>
                    </div>
                </div>
        
                <div class="menu-links">

                    <NavLink to={`/about`} class="nav-link card gold">
                        <button class="circle button-inset">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            </svg>
                        </button>
                        <span>{L.ABOUT}</span>
                    </NavLink>
                    
                    <NavLink to={`/open`} class="nav-link card">
                        <button class="circle button-inset">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                        </button>
                        <span>{L.ACCOUNTS}</span>
                    </NavLink>

                    <NavLink to={`/security`} class="nav-link card">
                        <button class="circle button-inset">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" />  
                            </svg>
                        </button>
                        <span>{L.SECURITY}</span>
                    </NavLink>
                    
                    <NavLink to={`/settings`} class="nav-link card">
                        <button class="circle button-inset">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                            </svg>
                        </button>
                        <span>{L.SETTINGS}</span>
                    </NavLink>
                    
                    <a onClick={this._logout} class="nav-link card">
                        <button class="circle button-inset">
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />                        </svg>
                            </button>
                        <span>{L.LOGOUT}</span>
                    </a>
        
                </div>
            </div>
        );
    }
}