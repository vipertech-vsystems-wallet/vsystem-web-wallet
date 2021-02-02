import React from "react";

import { PAGE_ROUTES, HISTORY, CURRENCIES } from "../utils/constants";
import LANGUAGES from "../language/index";
import { update_meta_title } from "../utils/meta-tags";
import sound_api from "../utils/sound-api";
import dispatcher from "../dispatcher";
import api from "../utils/api";
import actions from "../actions/utils";

import Home from "./Home";
import Menu from "./Menu";
import Send from "./Send";
import Receive from "./Receive";
import Open from "./Open";
import Terms from "./Terms";
import How from "./How";
import About from "./About";
import Security from "./Security";
import Settings from "./Settings";

export default class Index extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            pathname: "/open",
            _history: HISTORY,
            _unlisten: null,
            _sfx_enabled: false,
            _vocal_enabled: false,
            _logged_account: null,
            _currencies_change: {
                usd: "0",
                eur: "0",
                chf: "0"
            },
            _selected_language: "en",
            _width: 0,
            _height: 0
        };
    };

    componentWillMount() {

        const { _history, pathname } = this.state;
        
        // Update settings
        this._update_settings();

        // Register the event handler
        dispatcher.register(this._handle_events.bind(this));

        // Get currencies change
        api.get_currencies_change(this._process_get_currencies_change_query_result);
    }

    componentWillReceiveProps(new_props) {

        const old_pathname = this.state.pathname;
        const new_pathname = new_props.location.location.pathname; // WHY THE FUCK IS THERE TWO TIMES "location" in new props, this took me 2 hours to even know why it not longer worked
        
        // Is there any change in the new pathname ?
        if(old_pathname !== new_pathname) {
            
            // Trigger a function to set the new pathname or redirect the url
            this._set_new_pathname_or_redirect(new_pathname);
        }
    }

    _process_get_currencies_change_query_result = (_currencies_change) => {

        // Set all currency change from query result
        this.setState({_currencies_change})
    };
    
    _process_settings_query_result = (settings) => {
        
        // Set new settings from query result
        
        if (typeof settings.sfx_enabled !== "undefined") {
    
            this.setState({_sfx_enabled: settings.sfx_enabled});
        }
    
        if (typeof settings.vocal_enabled !== "undefined") {
    
            this.setState({_vocal_enabled: settings.vocal_enabled});
        }
    
        if (typeof settings.hypesquad_enabled !== "undefined") {
    
            this.setState({_hypesquad_enabled: settings.hypesquad_enabled});
        }

        if (typeof settings.selected_language !== "undefined") {
            
            this.setState({_selected_language: settings.selected_language});
            
        }
    };
    
    _update_settings() {
        
        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _trigger_sound(category, name, volume) {
        
        // Call an api to play a sound
        sound_api.play_sound(category, name, volume);
    }

    _handle_events(event) {

        const { _sfx_enabled, _vocal_enabled, _history } = this.state;

        // Make different actions send from a dispatcher binded to this function
        switch(event.type) {

            case "TRIGGER_SFX":
                if(_sfx_enabled) { this._trigger_sound("sfx", event.data.name, event.data.volume); }
                break;

            case "TRIGGER_VOCAL":
                if(_vocal_enabled) { this._trigger_sound("vocal", event.data.name, event.data.volume); }
                break;

            case "SETTINGS_UPDATE":
                this._update_settings();
                break;
                
            case "LOGIN_UPDATE":
                // Push a new pathname into browser history (the homepage)
                this.setState({_logged_account: event.data.account})
                _history.push("/");

                // Play sound if enabled
                if(_vocal_enabled) { this._trigger_sound("vocal", "connection_established.mp3", 1);}
                if(_sfx_enabled) { this._trigger_sound("sfx", "login.mp3", 1);}
                
                break;

            case "LOGOUT":
                
                // Set logged account then push a new pathname (the one to log in) into browser history
                this.setState({_logged_account: null});
                _history.replace("/open")
                
                // Play sound if enabled
                if(_sfx_enabled) { this._trigger_sound("sfx", "logout.mp3", 1);}
                break;

        }
    }

    _set_meta_title = (pathname) => {
        
        // Remove the first slash and then replace following slash by " > " so it nice in the meta title
        pathname = pathname.replace("/", "").replace(/\//g, " > ");
        
        // trigger a function that update the meta title (title displayed in browser tab)
        update_meta_title("Vsys Wallet / " + pathname);
    };
    
    _set_new_pathname_or_redirect = (new_pathname) => {
        
        const { pathname, _history, _sfx_enabled, _logged_account } = this.state;
        
        if(_logged_account == null && (new_pathname !== "/open" && new_pathname !== "/terms" && new_pathname !== "/how")) {
            
            // Redirect before changing the pathname cause the user should not access other pages
            _history.push("/open");

        }else {
            
            // Just update pathname meta title and play sound
            
            // Set pathname
            this.setState({pathname: new_pathname});

            // set meta title
            this._set_meta_title(new_pathname);

            // Trigger sound if enabled
            if(_sfx_enabled) { this._trigger_sound("sfx", "page.mp3", 1); }
        }
    };
    
    render() {
        
        const { pathname, _logged_account, _currencies_change, _selected_language } = this.state;
        
        // This is the constant where the right language object is set
        const _language_object = LANGUAGES[_selected_language];

        // key property with selected language trigger the component to re render on change
        let page_component = null;
        const page_components = {
            home:   <Home
                        account={_logged_account}
                        currencies_change={_currencies_change}
                        L={_language_object}
                        key={_selected_language}>
                    </Home>,
            terms:  <Terms
                        L={_language_object}
                        key={_selected_language}>
                    </Terms>,
            how:  <How
                        L={_language_object}
                        key={_selected_language}>
                    </How>,
            menu:   <Menu
                        L={_language_object}
                        key={_selected_language}>
                    </Menu>,
            send:   <Send
                        account={_logged_account}
                        currencies_change={_currencies_change}
                        L={_language_object}
                        key={_selected_language}>
                    </Send>,
            receive: <Receive
                        account={_logged_account} 
                        L={_language_object}
                        key={_selected_language}>
                    </Receive>,
            open:   <Open
                        account={_logged_account}
                        L={_language_object}
                        key={_selected_language}>
                    </Open>,
            about:  <About
                        L={_language_object}
                        key={_selected_language}>
                    </About>,
            settings: <Settings
                        account={_logged_account}
                        currencies_change={_currencies_change}
                        L={_language_object}
                        key={_selected_language}>
                    </Settings>,
            security: <Security
                        account={_logged_account}
                        L={_language_object}
                        key={_selected_language}>
                    </Security>
        };
    
        // Page route contain information to know which component display from which pathname, the code below will select a page component from the page route page name
        for(let i = 0; i < PAGE_ROUTES.length; i++) {
    
            const page_route = PAGE_ROUTES[i];
    
            if(page_route.page_regex.test(pathname)){
    
                page_component = page_components[page_route.page_name];
            }
        }

        return (
            <div id="page">
                <div class="overlay-download-chrome-ext">
                    <div class="overlay-download-chrome-ext-int">
                        <img src="../images/chrome-e.jpg"/>
                        <span>
                            <a class="gold" href="https://chrome.google.com/webstore/detail/vsys-gold-wallet/fokhhpjdgkfibbapdlphembbgpkmceej">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                </svg>
                                {_language_object.PAGES.INDEX.DOWNLOAD}
                            </a>
                            <span>{_language_object.PAGES.INDEX.OR_USE_MOBILE}</span>
                        </span>
                    </div>
                </div>
                {page_component}
            </div>
        );
    }
}