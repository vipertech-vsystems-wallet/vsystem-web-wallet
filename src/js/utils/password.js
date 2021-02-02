import zxcvbn from "zxcvbn";

function get_password_strength_on_five(password) {
    
    // 0 - 4 -> 1-5
    return zxcvbn(password).score + 1;
    
}

module.exports = {
    get_password_strength_on_five: get_password_strength_on_five
};