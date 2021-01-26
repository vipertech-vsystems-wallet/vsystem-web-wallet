import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

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
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                                </svg>
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