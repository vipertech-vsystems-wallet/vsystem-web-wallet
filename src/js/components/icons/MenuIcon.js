import React from "react";

export default class MenuIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {

        return (
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
    );
    }
}