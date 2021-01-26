import React from "react";

export default class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    render() {
    
        return (
            <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        width="24"
        height="30"
        x="0"
        y="0"
        enableBackground="new 0 0 50 50"
        version="1.1"
        viewBox="0 0 24 30"
        xmlSpace="preserve"
            >
            <path fill="#333" d="M0 6.274H4V23.726000000000003H0z" opacity="0.2">
            <animate
        attributeName="opacity"
        attributeType="XML"
        begin="0s"
        dur="0.6s"
        repeatCount="indefinite"
        values="0.2; 1; .2"
            ></animate>
            <animate
        attributeName="height"
        attributeType="XML"
        begin="0s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 20; 10"
            ></animate>
            <animate
        attributeName="y"
        attributeType="XML"
        begin="0s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 5; 10"
            ></animate>
            </path>
            <path fill="#333" d="M8 6.226H12V23.773999999999997H8z" opacity="0.2">
            <animate
        attributeName="opacity"
        attributeType="XML"
        begin="0.15s"
        dur="0.6s"
        repeatCount="indefinite"
        values="0.2; 1; .2"
            ></animate>
            <animate
        attributeName="height"
        attributeType="XML"
        begin="0.15s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 20; 10"
            ></animate>
            <animate
        attributeName="y"
        attributeType="XML"
        begin="0.15s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 5; 10"
            ></animate>
            </path>
            <path fill="#333" d="M16 8.726H20V21.274H16z" opacity="0.2">
            <animate
        attributeName="opacity"
        attributeType="XML"
        begin="0.3s"
        dur="0.6s"
        repeatCount="indefinite"
        values="0.2; 1; .2"
            ></animate>
            <animate
        attributeName="height"
        attributeType="XML"
        begin="0.3s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 20; 10"
            ></animate>
            <animate
        attributeName="y"
        attributeType="XML"
        begin="0.3s"
        dur="0.6s"
        repeatCount="indefinite"
        values="10; 5; 10"
            ></animate>
            </path>
            </svg>
        );
    }
}