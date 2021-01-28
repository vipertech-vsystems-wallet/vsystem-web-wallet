import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import api from "../utils/api";
import { download } from "../utils/file-api";
import actions from "../actions/utils";
import { LANGUAGES, NODES_IP } from "../utils/constants";

import CloseIcon from "../components/icons/CloseIcon";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.SETTINGS,
            account: props.account,
            currencies_change: props.currencies_change,
            _sfx_enabled: false,
            _vocal_enabled: false,
            _selected_currency: "usd",
            _selected_language: "en",
            _selected_node: "https://wallet.v.systems/api/"
        };
    };

    componentDidMount() {
        
        api.get_settings(this._process_settings_query_result);
    }

    _process_settings_query_result = (settings) => {

        const _sfx_enabled = (typeof settings.sfx_enabled !== "undefined") ? settings.sfx_enabled: false;
        const _vocal_enabled = (typeof settings.vocal_enabled !== "undefined") ? settings.vocal_enabled: false;
        const _selected_currency = (typeof settings.selected_currency !== "undefined") ? settings.selected_currency: "usd";
        const _selected_language = (typeof settings.selected_language !== "undefined") ? settings.selected_language: "en";
        const _selected_node = (typeof settings.selected_node !== "undefined") ? settings.selected_node: "https://wallet.v.systems/api/";
    
        this.setState({ _sfx_enabled, _vocal_enabled, _selected_currency, _selected_language, _selected_node });
    };
    
    _sfx_settings_updated = () => {

        const { _sfx_enabled } = this.state;

        actions.trigger_settings_update();
        
        _sfx_enabled ?
            actions.trigger_vocal("sound_effects_enabled.mp3", 1):
            actions.trigger_vocal("sound_effects_disabled.mp3", 1);
        
    };

    _vocal_settings_updated = () => {
        
        const { _vocal_enabled } = this.state;
        
        actions.trigger_settings_update();
        
        _vocal_enabled ?
            actions.trigger_vocal("vocal_enabled.mp3", 1):
            actions.trigger_vocal("vocal_disabled.mp3", 1);
    };

    _selected_currency_settings_updated = () => {
        
        actions.trigger_settings_update();
        actions.trigger_vocal("currency_changed.mp3", 1)
    };

    _selected_language_settings_updated = () => {
    
        actions.trigger_settings_update();
        actions.trigger_vocal("language_changed.mp3", 1)
    };

    _selected_node_settings_updated = () => {
    
        actions.trigger_settings_update();
        actions.trigger_vocal("the_node_has_changed.mp3", 1)
    };
   
    _handle_SFX_toggle = (event) => {
    
        const _sfx_enabled = event.target.checked;
            
        this.setState({_sfx_enabled});
        
        api.set_settings({
            sfx_enabled: _sfx_enabled
        }, this._sfx_settings_updated);
    };
    
    _handle_vocal_toggle = (event) => {
    
        const _vocal_enabled = event.target.checked;
        
        this.setState({_vocal_enabled});
        
        api.set_settings({
            vocal_enabled: _vocal_enabled
        }, this._vocal_settings_updated);
    };

    _handle_selected_language_change = (event) =>{
    
        const _selected_language = event.target.value;
    
        this.setState({_selected_language});
    
        api.set_settings({
            selected_language: _selected_language
        }, this._selected_language_settings_updated);
    
    };

    _handle_selected_currency_change = (event) =>{
        
        const _selected_currency = event.target.value;
        
        this.setState({_selected_currency});
    
        api.set_settings({
            selected_currency: _selected_currency
        }, this._selected_currency_settings_updated);
        
    };

    _handle_selected_node_change = (event) =>{
        
        const _selected_node = event.target.value;
        
        this.setState({_selected_node});
    
        api.set_settings({
            selected_node: _selected_node
        }, this._selected_node_settings_updated);
        
    };
    

    render() {

        const { L, _sfx_enabled, _vocal_enabled, _selected_currency, currencies_change, _selected_language, _selected_node } = this.state;
        
        const currencies_change_keys = Object.keys(currencies_change);
        const currencies_change_item = currencies_change_keys.map((key) => {
            
            return <option key={key} value={key}>{currencies_change[key] + " " + key.toUpperCase()}</option>;
        });
        
        const languages_change_item = LANGUAGES.map((key) => {
            
            return <option key={key} value={key}>{key.toUpperCase()}</option>;
        });
        
        const nodes_change_item = NODES_IP.map((key) => {
            
            return <option key={key} value={key}>{key}</option>;
        });
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.SETTINGS}</div>
                        <NavLink to={`/`} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <CloseIcon/>
                            </button>
                        </NavLink>
                     </div>  
                </div>
        
                <div class="settings-content">
                    <h1>{L.LANGUAGE}</h1>
                    <div class="input-group">
                        <select value={_selected_language} onChange={this._handle_selected_language_change}>
                            {languages_change_item}
                        </select>
                    </div>
                    <p>{L.ADD_LANGUAGE_A} <a href="mailto:contact@vipertech.ch">contact@vipertech.ch</a> {L.ADD_LANGUAGE_B}</p>
                    <h1>{L.CURRENCY}</h1>
                    <div class="input-group">
                        <select value={_selected_currency} onChange={this._handle_selected_currency_change}>
                            {currencies_change_item}
                         </select>
                    </div>
                    <p>{L.SEE_MORE} <a href="https://coinmarketcap.com/currencies/v-systems/" target="_blank">coinmarketcap.com</a>.</p>
                    <h1>{L.SOUNDS}</h1>
                    <div class="input-group">
                        <input type="checkbox" id="checkboxSfx" checked={_sfx_enabled} onChange={this._handle_SFX_toggle}/>
                        <label class="toggle" for="checkboxSfx">{L.ENABLE_SFX}</label>
                    </div>
                    <div class="input-group">
                        <input type="checkbox" id="checkboxVocal" checked={_vocal_enabled} onChange={this._handle_vocal_toggle}/>
                        <label class="toggle" for="checkboxVocal">{L.ENABLE_VOCALS}</label>
                    </div>
                    <h1>{L.NETWORK}</h1>
                    <div class="input-group">
                        <select value={_selected_node} onChange={this._handle_selected_node_change}>
                        {nodes_change_item}
                    </select>
                    </div>
                </div>
            </div>
        );
    }
}