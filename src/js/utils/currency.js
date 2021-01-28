const CURRENCY_SYMBOLS = {
    CHF: ".-",// Swiss franc
    USD: "$", // US Dollar
    EUR: "€", // Euro
    GBP: "£", // British Pound Sterling
    JPY: "¥", // Japanese Yen
};

const CURRENCY_COUNTRIES = {
    CHF: ["CH"],
    USD: ["AS", "IO", "EC", "SV", "GU", "HT", "MH", "FM", "MP", "PW", "PA", "PR", "TL", "TC", "US", "VG", "VI"],
    EUR: ["AD", "AT", "BE", "FI", "FR", "GF", "TF", "DE", "GR", "GP", "VA", "IE", "IT", "LU", "MQ", "YT", "MC", "NL", "PT", "RE", "PM", "SM", "CS", "ES"],
    GBP: ["GB"],
    JPY: ["JP"]
};

function get_currency_by_country_code(country_code) {
    
    const country_code_alpha_2 = country_code.toUpperCase();
    let currency = null;
    
    for (let key in CURRENCY_COUNTRIES) {
        
        const currency_array_countries = CURRENCY_COUNTRIES[key];
        
        if(currency_array_countries.includes(country_code_alpha_2)) {
            
            currency = key;
        }
        
    }
    
    return currency;
    
}

function get_amount_from_locales(locales, amount) {
    
    const locales_array = locales.split("-");
    
    if(locales_array.length == 2) {
        
        const language_code = locales_array[0];
        const country_code = locales_array[1];

        const currency = get_currency_by_country_code(country_code);
        
        if(currency !== null) {

            const amount_formatted = new Intl.NumberFormat(locales, { style: 'currency', currency: currency }).format(amount);
            return amount_formatted;

        }else {
            
            return null;
        }
        
    }else {

        return null;
    }
}

module.exports = {
    get_currency_by_country_code: get_currency_by_country_code,
    get_amount_from_locales: get_amount_from_locales
};