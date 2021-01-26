import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import clipboard from "clipboard-polyfill";
import actions from "../actions/utils";

import { APPLICATION_RELEASE,HISTORY } from "../utils/constants";

export default class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.ABOUT,
            _history: HISTORY,
        };
    };
    
    _open_facebook = () => {

        const sharing_url = "https://www.facebook.com/sharer/sharer.php?u=";
        window.open(sharing_url + "https://vsys-gold-wallet.com/");
    };
    
    _open_twitter = () => {

        const sharing_url = "https://twitter.com/home?status=";
        window.open(sharing_url + "https://vsys-gold-wallet.com/");
    };
    
    _open_github = () => {

        const sharing_url = "https://github.com/vipertech-vsystems-wallet/";
        window.open(sharing_url);
    };
    
    _copy_donation_address = () => {

        const { _history } = this.state;
        
        clipboard.writeText("ARJjyYFMixaY7h5xaR8mGT42V9VSRfm5MvJ");
        actions.trigger_sfx("copy.mp3", 1);
        actions.trigger_vocal("address_copied.mp3", 1);
        _history.push("/send", {});
        
    };   

    render() {

        const { L } = this.state;
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.ABOUT}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                                </svg>
                            </button>
                        </NavLink>
                    </div>  
                </div>
            
                <div class="about-content">
                    <h1>{L.ABOUT}</h1>
                    <h2>{L.SOFTWARE}</h2>
                    <p>{L.SOFTWARE_A1}{APPLICATION_RELEASE}{L.SOFTWARE_A2} <a href="https://vipertech.ch/" target="_blank">vipertech.ch</a> {L.SOFTWARE_A3} <a href="https://v.systems/" target="_blank">v.systems</a>. {L.SOFTWARE_A4} <span class="gold">#LoveThoseWhoFight #AgainstTheOpression</span></p>
                    <p><b>{L.SOFTWARE_B1}</b> {L.SOFTWARE_B2}</p>
            
                    <h1>{L.BUY_VSYS}</h1>
                    <ol>
                        <li><b>{L.BUY_VSYS_A1}</b> {L.BUY_VSYS_A2} <a href="https://www.binance.com/en/register?ref=UUXCORYA" target="_blank">binance.com</a> {L.BUY_VSYS_A3}</li>
                        <li><b>{L.BUY_VSYS_B2}</b> {L.BUY_VSYS_B2} <a href="https://swapspace.co/" target="_blank">swapspace.co</a> {L.BUY_VSYS_B3}</li>
                    </ol>
        
                    <h1>{L.SHARE_HYPE}</h1>
                    <p>{L.SHARE_HYPE_A}</p>
                    <div class="terms-social-buttons">
                        <button class="circle facebook" onClick={this._open_facebook}>
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                            </svg>
                        </button>
                        <button class="circle twitter" onClick={this._open_twitter}>
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                            </svg>
                        </button>
                        <button class="circle github" onClick={this._open_github}>
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                            </svg>
                        </button>
                    </div>
        
                    <h1>{L.ADD_HOMESRCEEN}</h1>
                    <h2>{L.IPAD_OR_IPHONE}</h2>
                    <ol>
                        <li>{L.IPAD_OR_IPHONE_A}</li>
                        <li>{L.IPAD_OR_IPHONE_B}</li>
                        <li>{L.IPAD_OR_IPHONE_C}</li>
                    </ol>
                    <h2>{L.ANDROID}</h2>
                    <ol>
                        <li>{L.ANDROID_A}</li>
                        <li>{L.ANDROID_B}</li>
                    </ol>
        
                    <h1 class="gold">{L.DONATION}</h1>
                    <img src="../images/0rsic.jpg" onClick={this._copy_donation_address} />
                    <p class="gold" onClick={this._copy_donation_address}>ARJjyYFMixaY7h5xaR8mGT42V9VSRfm5MvJ</p>
                    <p>{L.DONATION_A}</p>
        
                    <h1>{L.CONTACT}</h1>
                    <p><a href="mailto:contact@vipertech.ch">contact@vipertech.ch</a> // <a href="https://forms.gle/169at48GsDXSLsKD7" target="_blank">Google forms (Feedback)</a></p>
                </div>
            </div>
        );
    }
}