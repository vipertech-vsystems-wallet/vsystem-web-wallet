import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import clipboard from "clipboard-polyfill";
import actions from "../actions/utils";
import api from "../utils/api";

import { DONATION_ADDRESS, DONATION_GOAL } from"../utils/constants";

import FacebookIcon from "../components/icons/FacebookIcon";
import TwitterIcon from "../components/icons/TwitterIcon";
import GithubIcon from "../components/icons/GithubIcon";
import CloseIcon from "../components/icons/CloseIcon";

import { APPLICATION_RELEASE,HISTORY } from "../utils/constants";

export default class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.ABOUT,
            _history: HISTORY,
            _donation_balance: 0
        };
    };

    _set_donation_balance_query_result = (result) => {

        // Set balance on request result
        this.setState({_donation_balance: result});
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
        
        clipboard.writeText(DONATION_ADDRESS);
        actions.trigger_sfx("copy.mp3", 1);
        actions.trigger_vocal("address_copied.mp3", 1);
        _history.push("/send", {});
        
    };   
    
    componentDidMount() {
        
        api.get_balance(DONATION_ADDRESS, this._set_donation_balance_query_result)
    }

    render() {

        const { L, _donation_balance } = this.state;

        const donation_goal_k = (DONATION_GOAL / 1000).toFixed(0);
        const donation_balance_k = (_donation_balance / 1000).toFixed(0); 
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.ABOUT}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
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
                            <FacebookIcon/>
                        </button>
                        <button class="circle twitter" onClick={this._open_twitter}>
                            <TwitterIcon/>
                        </button>
                        <button class="circle github" onClick={this._open_github}>
                            <GithubIcon/>
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
                    <img src="../images/0rthona.jpg" onClick={this._copy_donation_address} />
                    <p class="gold" onClick={this._copy_donation_address}>{DONATION_ADDRESS}</p>
                    <p>{L.DONATION_A} ({donation_balance_k + "K / " + donation_goal_k + "K VSYS"})</p>
        
                    <h1>{L.CONTACT}</h1>
                    <p><a href="mailto:contact@vipertech.ch">contact@vipertech.ch</a> // <a href="https://forms.gle/169at48GsDXSLsKD7" target="_blank">Google forms (Feedback)</a></p>
                </div>
            </div>
        );
    }
}