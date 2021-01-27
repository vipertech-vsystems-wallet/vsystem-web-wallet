import React from "react";

export default class SecurityIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {

        return (
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" />
            </svg>

        );
    }
}