import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import CloseIcon from "../components/icons/CloseIcon";

export default class Terms extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.TERMS
        };
    };

    render() {

        const { L } = this.state;
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.TERMS}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                    </div>  
                </div>
            
                <div class="terms-content">
                    <h1>{L.DISCLAIMER}</h1>
                    <p>{L.AS_IS}</p>
                </div>
            </div>
        );
    }
}