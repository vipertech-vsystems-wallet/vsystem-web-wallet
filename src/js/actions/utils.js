import dispatcher from "../dispatcher";

function trigger_sfx(name, volume = 1) {
    
    dispatcher.dispatch({
        type: 'TRIGGER_SFX',
        data: {
            name,
            volume
        }
    });
}

function trigger_vocal(name, volume = 1) {

    dispatcher.dispatch({
        type: 'TRIGGER_VOCAL',
        data: {
            name,
            volume
        }
    });
}

function trigger_settings_update() {

    dispatcher.dispatch({
        type: 'SETTINGS_UPDATE',
        data: {}
    });
}

function trigger_login_update(account = null) {

    dispatcher.dispatch({
        type: 'LOGIN_UPDATE',
        data: {
            account
        }
    });
}

function trigger_logout() {

    dispatcher.dispatch({
        type: 'LOGOUT',
        data: {}
    });
}

module.exports = {
    trigger_sfx: trigger_sfx,
    trigger_vocal: trigger_vocal,
    trigger_settings_update: trigger_settings_update,
    trigger_login_update: trigger_login_update,
    trigger_logout: trigger_logout
};