import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import CloseIcon from "../components/icons/CloseIcon";

export default class How extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.HOW
        };
    };

    render() {

        const { L } = this.state;
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.HOW}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                    </div>  
                </div>
            
                <div class="how-content">
                    <h1>{L.HOW_1}</h1>
                    <p>{L.HOW_1A}</p>
                    <p>{L.HOW_1B}</p>
                    
                    <h1>{L.HOW_2}</h1>
                    <p>{L.HOW_2A}</p>
                    <p>{L.HOW_2B}</p>
                    
                    <h1>{L.HOW_3}</h1>
                    <p>{L.HOW_3A}</p>
                </div>
            </div>
        );
    }
}