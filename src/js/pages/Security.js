import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { HISTORY } from "../utils/constants";
import { download } from "../utils/file-api";
import actions from "../actions/utils";
import api from "../utils/api";

import Loader from "../components/Loader"; 

export default class Security extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.SECURITY,
            account: props.account,
            _history: HISTORY,
            _old_password: "",
            _new_password: "",
            _new_name: props.account.name,
            _old_password_incorrect: false,
            _new_password_the_same: false,
            _current_change: false
        };
    };
    
    _handle_old_password_change = (event) => {
        
        this.setState({_old_password: event.target.value});
    };

    _handle_new_password_change = (event) => {

        this.setState({_new_password: event.target.value});
    };

    _handle_new_name_change = (event) => {

        this.setState({_new_name: event.target.value});
    };
    
    _backup = (voice = true) => {
    
        const { account } = this.state;
        const file_name = account.name + ".txt";

        const text_content = JSON.stringify({
            name: account.name,
            address: account.address,
            public_key: account.public_key,
            encrypted_private_key: account.encrypted_private_key
        });

        //window.open(encodeURI("mailto:" + account.name + "@encrypted.v.systems?subject={{SEND THIS TO YOURSELF}} - ACCOUNT:" + account.name + "!&body=Copy the text below when trying to backup your account and REMEMBER YOUR PASSWORD (Don't write it anywhere). \n" + account.encrypted_private_key + "\nYou can also send it to the addresse email above for later use!, theses data are encrypted using the password you provided", "_blank"));
    
        if(voice) {
            actions.trigger_vocal("backup_file_downloaded.mp3", 1);
        }
        download(file_name, text_content);
        
    };

    _process_change_password = (account) => {
        
        const { _history } = this.state;
        
        if(account !== null) {
            
            this.setState({account});
            this._backup(false);
            actions.trigger_vocal("password_changed.mp3", 1);
            _history.push("/", {});
            
        }else {
            
            this.setState({_old_password_incorrect: true, _current_change: false});
            actions.trigger_vocal("wrong_password.mp3", 1);
        }
    }

    _validate_password_change = () => {

        const { _old_password, _new_password, account, _current_change, _new_name } = this.state;
        let { _old_password_incorrect, _new_password_the_same } = this.state;
    
        if(_old_password.length && _new_password.length && _current_change == false) {
            
            this.setState({_current_change: true});
            
            if(_old_password == _new_password) {

                _new_password_the_same = true;
                this.setState({_new_password_the_same, _current_change: false});
                actions.trigger_vocal("passwords_are_identical.mp3", 1);
            }else {

                _new_password_the_same = false;
                this.setState({_new_password_the_same});
                
                if(!_new_name.length) {

                    actions.trigger_vocal("the_name_can_not_be_empty.mp3", 1);
                }else {

                    api.change_password(account.public_key, _old_password, _new_password, _new_name, this._process_change_password);
                }
                
            }
        }
    };
    
    render() {
        
        const { L, _old_password, _new_password, _current_change, _new_name } = this.state;
        const { _old_password_incorrect, _new_password_the_same } = this.state;
        
        const old_password_input_class = _old_password_incorrect ? "is-invalid": "";
        const old_password_feedback_text = _old_password_incorrect ? L.WRONG_PASSWORD : L.WRITE_OLD_PASSWORD;

        const new_password_input_class = _new_password_the_same ? "is-invalid": "";
        const new_password_feedback_text = _new_password_the_same ? L.PASSWORD_IDENTICAL : L.WRITE_NEW_PASSWORD;
        
        const new_name_input_class = _new_name.length ? "is-valid": "is-invalid";
        const new_name_feedback_text = _new_name.length ? L.NEW_NAME_VALID : L.NEW_NAME_CANNOT_EMPTY;

        const change_password_button_class = _old_password.length && _new_password.length ? "": "disabled";
        const change_password_button_content = _current_change ? <span><Loader /> {L.WAIT}</span>: L.CHANGE_PASSWORD;
        
        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.SECURITY}</div>
                        <NavLink to={``} class="nav-link">
                            <button class="circle toolbar-menu-button">
                                <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                                </svg>
                            </button>
                        </NavLink>
                    </div>
                </div>
                
                <div class="security-content">
                    
                    <h1>Password</h1>
                    <div class="input-group">
                        <input type="password" class={old_password_input_class} placeholder={L.OLD_PASSWORD} value={_old_password} onChange={this._handle_old_password_change}/>
                        <div class="feedback-input">{old_password_feedback_text}</div>
                    </div>
                    <div class="input-group">
                        <input type="password" class={new_password_input_class} placeholder={L.NEW_PASSWORD} value={_new_password} onChange={this._handle_new_password_change}/>
                        <div class="feedback-input">{new_password_feedback_text}</div>
                    </div>
                    <div class="input-group">
                        <input type="text" class={new_name_input_class} placeholder={L.NEW_NAME} value={_new_name} onChange={this._handle_new_name_change}/>
                        <div class="feedback-input">{new_name_feedback_text}</div>
                    </div>
        
                    <button class={"password-change-button rounded " + change_password_button_class} onClick={this._validate_password_change}>{change_password_button_content}</button>
        
                    <h1>Backup</h1>
                    <button class="rounded" onClick={this._backup}>{L.BACKUP}</button>
                </div>
            </div>
        );
    }
}