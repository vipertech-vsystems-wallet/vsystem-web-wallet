import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import clipboard from "clipboard-polyfill";

import { clean_json_text } from "../utils/json";
import { HISTORY, APP_URL } from "../utils/constants";
import { download } from "../utils/file-api";
import actions from "../actions/utils";
import api from "../utils/api";
import { get_password_strength_on_five } from "../utils/password";

import Loader from "../components/Loader";

import CloseIcon from "../components/icons/CloseIcon";
import EyeIcon from "../components/icons/EyeIcon";
import EyeOffIcon from "../components/icons/EyeOffIcon";

export default class Open extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            L: props.L.PAGES.OPEN,
            accounts: [],
            name: "",
            _history: HISTORY,
            _is_ok_button_disabled: true,
            _is_ok_in_progress: false,
            _is_reset_progress: false,
            _selected_wallet_name: "_select",
            _wallet_password: "",
            _wallet_name: "",
            _wallet_name_empty: false,
            _terms_agreed: false,
            _backup_agreed: true,
            _error_password: false,
            _file_name: props.L.PAGES.OPEN.OPEN_FILE,
            _error_file_type: false,
            _error_file_content: false,
            _valid_backup_file: false,
            _account_from_file: null,
            _text_account: "",
            _show_password: false,
            _is_logged: api.is_logged()
        };
    };

    componentDidMount() {
        
        // Get accounts from the DB
        this._get_accounts();
    }
    
    _get_account_by_name = (name) => {
    
        // Search an account in the state by name
        const { accounts } = this.state;
        
        for(let i = 0; i < accounts.length; i++) {
            
            const account = accounts[i];
            
            if(name == account.name) {
                
                return account;
            }
        }
    }
    
    _process_is_disabled = () => {
        
        const { _wallet_password, _terms_agreed, _wallet_name, _selected_wallet_name } = this.state;
        let _is_ok_button_disabled = true;
        
        
        if( // Wallet name must not be "_select" but they can either be something or not empty from the field
            (_wallet_password.length && _terms_agreed && _selected_wallet_name !== "_new" && _selected_wallet_name !== "_select") ||
            (_wallet_password.length && _terms_agreed && _selected_wallet_name == "_new" &&  _selected_wallet_name !== "_select" && _wallet_name.length !== 0)
        ) {
            
            // So if fields are correct, we enable the ok button
            _is_ok_button_disabled = false;
        }
        
        // Theses look for error or emptyness
        const _error_password = !_wallet_password.length;
        const _wallet_name_empty = !_wallet_name.length;
        
        // We set what we've computed
        this.setState({ _is_ok_button_disabled, _error_password, _wallet_name_empty});
    };   
    
    _process_get_accounts = (response) => {

        if(response !== null) {

            // We can also get an empty result if we've just cleaned the DB
            this.setState({accounts: response});
            
            // If we got a non-empty array, then we will create a new account
            if(!response.length) {
                
                this.setState({_selected_wallet_name: "_new"});
            }
        }
    };

    _process_login_result = (account) => {
        
        if(account !== null) { // Here we've got an account

            // So there is no longer a potential error in the password and we can login
            this.setState({account, _error_password: false});
            actions.trigger_login_update(account);
        }else {
            
            // So we didn't got an account, we suppose that the password is wrong
            this.setState({_error_password: true});
            actions.trigger_vocal("wrong_password.mp3", 1);
        }

        // No longer in progress
        this.setState({_is_ok_in_progress: false});
    };

    _validate_input = () => {

        this._process_is_disabled(); // Maybe we can remove this
        const { _is_ok_button_disabled, _selected_wallet_name, _wallet_password, _is_ok_in_progress, _account_from_file, _error_file_content, _error_file_type } = this.state;
        
        
        if(!_is_ok_button_disabled && !_is_ok_in_progress) { // Not disabled and not trying to login
            
            if(_selected_wallet_name == "_new") {
                
                // Create a new account
                this._create_new_account();
                this.setState({_wallet_password: "", _wallet_name: ""});
               
            }else if(_selected_wallet_name == "_backup" && !_error_file_content && !_error_file_type){ // Login from backup

                // Login from backup
                this.setState({_is_ok_in_progress: true});
                api.login_from_backup(_account_from_file, _wallet_password, this._process_login_result);
            }else { 
                
                // Login from address
                this.setState({_is_ok_in_progress: true});
                const account = this._get_account_by_name(_selected_wallet_name);
                api.login(account.public_key, _wallet_password, this._process_login_result);
            }
        }
    };
    
    _push_account = (account) => {

        let { accounts, _backup_agreed } = this.state;
        
        if(_backup_agreed) {

            // Dowload backup file
            const file_name = account.name + ".txt";
            const text_content = JSON.stringify({
                name: account.name,
                address: account.address,
                public_key: account.public_key,
                encrypted_private_key: account.encrypted_private_key
            });

            download(file_name, text_content);
            //window.open(encodeURI("mailto:" + account.name + "@encrypted.v.systems?subject={{SEND THIS TO YOURSELF}} - ACCOUNT:" + account.name + "!&body=Copy the text below when trying to backup your account and REMEMBER YOUR PASSWORD (Don't write it anywhere). \n" + account.encrypted_private_key + "\nYou can also send it to the addresse email above for later use!, theses data are encrypted using the password you provided", "_blank"));
        }
        
        // Push account, set not in progress, and login
        accounts.push({account});
        this.setState({accounts, _is_ok_in_progress: false});
        actions.trigger_login_update(account);
    };
    
    _create_new_account = () => {
        
        // Account creation in pgroess then create an account with a name and a password
        const { _wallet_password, _wallet_name } = this.state;
        const _is_ok_in_progress = true;
        this.setState({_is_ok_in_progress});
        
        api.create_account(_wallet_password, _wallet_name, this._push_account);
        
    };
    
    _get_accounts = () => {
        
        // Just get accounts
        api.get_accounts(this._process_get_accounts);
    };

    _handle_selected_wallet_name_change = (event) => {
        
        // Set the new wallet name and automatically update the checkbox for backup downlaod 
        const _selected_wallet_name = event.target.value;
        const _backup_agreed = _selected_wallet_name == "_new" ? true: false;
        
        this.setState({ _selected_wallet_name, _backup_agreed }, this._process_is_disabled);
    };
    
    _handle_wallet_password_change = (event) => {
        
        this.setState({_wallet_password: event.target.value}, this._process_is_disabled);
    };

    _handle_wallet_name_change = (event) => {

        this.setState({_wallet_name: event.target.value}, this._process_is_disabled);
    };

    _handle_terms_agreed_change = (event) => {
      
        this.setState({_terms_agreed: event.target.checked},  this._process_is_disabled);
    };

    _handle_backup_agreed_change = (event) => {
    
        this.setState({_backup_agreed: event.target.checked});
    };

    _handle_validate_file_paste = (event) => {

        const scope = this;
        const _text_account = clean_json_text(event.target.value);
        this.setState({_text_account});
        
        let _account_from_file = null;
    
    
        function set_valid_backup_file() {

            scope.setState({_account_from_file, _valid_backup_file: true});
            actions.trigger_vocal("valid_backup_file.mp3", 1);
        }
    
        function set_invalid_backup_file() {
    
            actions.trigger_vocal("invalid_backup_file.mp3", 1);
            scope.setState({_error_file_content: true,  _valid_backup_file: false});
        }
    
        try {
    
            _account_from_file = JSON.parse(_text_account);
    
            if(
                typeof _account_from_file.name !== "undefined" &&
                typeof _account_from_file.address !== "undefined" &&
                typeof _account_from_file.public_key !== "undefined" &&
                typeof _account_from_file.encrypted_private_key !== "undefined"
            ) {
    
                set_valid_backup_file();
            }else {
    
                set_invalid_backup_file();
            }
    
        }catch (error) {
    
            set_invalid_backup_file();
        }
        
    };
    
    _validate_file = () => {

        // Read a file
        let file = document.querySelector('#openInputFile').files[0];
        let reader = new FileReader();
        let textFile = /text.*/;
        let _account_from_file = null;
        const _file_name = file.name.split(".")[0].substring(0, 10) + "... " + file.name.split(".")[1];
        const scope = this;
        
        this.setState({_error_file_content: false, _error_file_type: false, _file_name});
        
        function set_valid_backup_file() {

            scope.setState({_account_from_file, _valid_backup_file: true});
            actions.trigger_vocal("valid_backup_file.mp3", 1);
        }
        
        function set_invalid_backup_file() {

            actions.trigger_vocal("invalid_backup_file.mp3", 1);
            scope.setState({_error_file_content: true,  _valid_backup_file: false});
        }

        function reader_onload(event) {
    
            const _text_account = clean_json_text(event.target.result); // Must parse specially the json cause there is special char
            scope.setState({_text_account});
            
            try {
                
                _account_from_file = JSON.parse(_text_account);
                
                if(
                    typeof _account_from_file.name !== "undefined" &&
                    typeof _account_from_file.address !== "undefined" &&
                    typeof _account_from_file.public_key !== "undefined" &&
                    typeof _account_from_file.encrypted_private_key !== "undefined"
                ) {

                    set_valid_backup_file();
                }else {

                    set_invalid_backup_file();
                }
                
            }catch (error) {
                
                set_invalid_backup_file();
            }
        }
        
        
        if (file.type.match(textFile)) {
            
            reader.onload = reader_onload;
        } else {
            
            set_invalid_backup_file();
        }
        
        reader.readAsText(file);
    };
    
    _reset_account_result = (result) => {
        
        // Get account again
        this._get_accounts();
        
        // Set progress false and trigger sound
        if(result) {
            this.setState({_is_reset_progress: false});
            actions.trigger_vocal("accounts_reset.mp3", 1);
        }
    };

    _set_selected_wallet_name = (selected_wallet_name) => {
      
        this.setState({_selected_wallet_name: selected_wallet_name});
    };

    _reset_account = () => {
      
        const { accounts } = this.state;
        
        if(accounts.length) {

            this.setState({_is_reset_progress: true});
            api.delete_accounts(this._reset_account_result);
        }
    };

    _handle_toggle_show_password = () => {
      
        const _show_password = !this.state._show_password;
        this.setState({_show_password});
    };
    
    render() {
        
        const { L, accounts, _selected_wallet_name, _is_ok_button_disabled, _wallet_password, _terms_agreed, _backup_agreed, _is_ok_in_progress, _is_reset_progress, address, name } = this.state;
        const { _error_password, _error_file_type, _error_file_content, _valid_backup_file, _file_name, _wallet_name, _wallet_name_empty, _is_logged, _text_account, _show_password } = this.state;
        
        // Login tab
        let login_tab_class = _selected_wallet_name !== "_new" && _selected_wallet_name !== "_backup" ? "gold": "";
        login_tab_class = !accounts.length ? "disabled": login_tab_class;
        const login_tab = <a onClick={() => this._set_selected_wallet_name("_select")} class={login_tab_class}>{L.LOGIN}</a>;
    
        // Register tab
        const register_tab_class = _selected_wallet_name == "_new" ? "gold": "";
        const register_tab = <a onClick={() => this._set_selected_wallet_name("_new")} class={register_tab_class}>{L.REGISTER}</a>;
    
        // Backup tab
        const backup_tab_class = _selected_wallet_name == "_backup" ? "gold": "";
        const backup_tab = <a onClick={() => this._set_selected_wallet_name("_backup")} class={backup_tab_class}>{L.BACKUP}</a>;
       
        // Reset button
        const reset_disabled_class = accounts.length ? "" : "disabled";
        const reset_button_content = _is_reset_progress ? <Loader />: L.RESET;
        
        // OK button
        const ok_button_content = _is_ok_in_progress ? <span><Loader /> {L.WAIT}</span> : L.OK;
        const ok_disabled_class = _is_ok_button_disabled ? "disabled": "";
        
        // Show hide password icon
        const show_hide_password_icon = _show_password ? <EyeOffIcon/>: <EyeIcon/>;
        
        // Passsword
        let password_text = _selected_wallet_name == "_new" ?
            L.CHOOSE_NEW_PASSWORD + " " + L.PASSWORD_STRENGTH + get_password_strength_on_five(_wallet_password) + "/5":
            L.PUT_PASSWORD;
        password_text = _error_password && _wallet_password.length ? L.WRONG_PASSWORD: password_text;
        const password_input_text_class = _error_password && _wallet_password.length ? "is-invalid": "";
        
        // File input
        let file_input_text = (_error_file_type || _error_file_content) ? L.INVALID_BACKUP : L.UPLOAD_BACKUP;
        file_input_text = _valid_backup_file ? L.VALID_BACKUP : file_input_text;
        let file_input_text_class = (_error_file_type || _error_file_content) ? "is-invalid": "";
        file_input_text_class = _valid_backup_file ? "is-valid": file_input_text_class;
        
        // New name
        const new_name_input_class = _wallet_name_empty && !_wallet_name.length ? "is-invalid": "";
        const name_input_text = _wallet_name_empty && !_wallet_name.length ? L.NAME_CANNOT_EMPTY: L.GIVE_WALLET_NAME;

        // File input
        const file_input_component = _selected_wallet_name == "_backup" ?
            <div class="input-group">
                <input id="openInputFile" class={file_input_text_class} type="file" onChange={this._validate_file} />
                <label for="openInputFile">{_file_name}</label>
                <div class="feedback-input">{file_input_text}</div>
                <textarea placeholder={L.PASTE_BACKUP} value={_text_account} onChange={this._handle_validate_file_paste}/>
            </div>: null;
    
        // Wallet name input
        const name_input_component = _selected_wallet_name == "_new" ?
            <div class="input-group">
                <input id="openInputName" class={new_name_input_class} type="text" value={_wallet_name} onChange={this._handle_wallet_name_change} placeholder={L.WALLET_NAME} />
                <div class="feedback-input">{name_input_text}</div>
            </div>: null;
        
        // Accounts item
        const optionItems = accounts.map((account) => {
            
            if(typeof account.name !== "undefined") {

                return <option key={account.address} value={account.name}>{account.name.substring(0, 15) + "..."}</option>;
            }
        });
        
        // Close menu
        const close_menu_component = _is_logged ?
            <NavLink to={``} class="nav-link">
                <button class="circle toolbar-menu-button">
                    <CloseIcon/>
                </button>
            </NavLink>: null;
    
        // Backup checkbox
        const backup_checkbox_component = _selected_wallet_name == "_new" ?
            <div class="input-group">
                <input type="checkbox" id="checkboxBackup" checked={_backup_agreed} onChange={this._handle_backup_agreed_change}/>
                <label class="checkbox" for="checkboxBackup">{L.BACKUP_ACCOUNT}</label>
            </div>: null;


       // Selected wallet name input
        const wallet_name_input_component = _selected_wallet_name !== "_backup" && _selected_wallet_name !== "_new" ?
            <div class="input-group">
                <select value={_selected_wallet_name} onChange={this._handle_selected_wallet_name_change}>
                    <option value="_select">{L.SELECT_WALLET}</option>
                    {optionItems}
                </select>
                <div class="feedback-input">{L.SELECT_CREATE_WALLET}</div>
            </div>: null;
    
        // Form component
        const open_form_component =
            <div class="open-form-group">
                <div class="open-form-tabs">
                    {login_tab}
                    {register_tab}
                    {backup_tab}
                </div>
                    {wallet_name_input_component}
                    {file_input_component}
                    {name_input_component}
                <div class="input-group">
                    <span class="toggle-show-password" onClick={this._handle_toggle_show_password}>{show_hide_password_icon}</span>
                    <input type={_show_password ? "text": "password"}
                            class={"open-password " + password_input_text_class}
                            placeholder={L.WALLET_PASSWORD}
                            value={_wallet_password}
                            onChange={this._handle_wallet_password_change}/>
                <div class="feedback-input">{password_text}</div>
                    </div>
                    <div class="input-group">
                    <input type="checkbox"
                            id="checkboxTerms"
                            checked={_terms_agreed}
                            onChange={this._handle_terms_agreed_change}/>
                    <label class="checkbox" for="checkboxTerms">{L.AGREED_TO} <Link to="/terms">{L.TERMS}</Link>.</label>
                </div>
                {backup_checkbox_component}
            </div>;
    
        // Button component
        const open_buttons_component =
            <div class="open-buttons">
                <button class={"rounded " + reset_disabled_class} onClick={this._reset_account}>{reset_button_content}</button>
                <button class={"rounded " + ok_disabled_class} onClick={this._validate_input}>{ok_button_content}</button>
            </div>;

        return (
            <div class="body-content">
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="toolbar-title">{L.OPEN}</div>
                        {close_menu_component}
                    </div>
                </div>
                
                {open_form_component}
            
                {open_buttons_component}
            </div>
        );
    }
}