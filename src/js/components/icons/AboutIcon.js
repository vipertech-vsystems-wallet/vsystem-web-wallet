import React from "react";

export default class AboutIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {

        return (
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
        );
    }
}