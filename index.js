var _ = require('lodash')
    , http = require('http');

module.exports = {

    /**
     * @param {*} arg1 {string} message, {number} http statusCode or {object} message: {string}, status: {number}
     * @param {*=} arg2 {string} message
     * @return {Error}
     */
    create: function(arg1, arg2){

        var message,
            statusCode;

        if(arg1 && arg2){
            statusCode = getStatusCode(arg1);
            message = getMessage(arg2);
        }

        else if(arg1){
            statusCode = getStatusCode(arg1);
            message = getMessage(arg1);
        }

        else if(arg2){
            message = getMessage(arg2);
        }

        if(statusCode && !message){
            message = http.STATUS_CODES[statusCode];
        }

        if(message && message.length){
            message = message.trim();
        }

        if(message && statusCode && message === String(statusCode).trim()){
            message = getMessage(statusCode);
        }

        var error = new Error(message || (http.STATUS_CODES[statusCode || 500]));
            error.statusCode = statusCode || 500;

        return error;
    }
};

/**
 * Parse http status code
 * @param {*=} arg
 * @return {number|null}
 */
var getStatusCode = function(arg){

    var statusCode;

    if(!arg){
        return null;
    }

    if(_.isObject(arg)){

        if(_.isNumber(arg.status)){
            statusCode = arg.status;
        }

        else if(_.isNumber(arg.statusCode)){
            statusCode = arg.statusCode;
        }

        else if(_.isNumber(arg.code)){
            statusCode = arg.code;
        }

        else if(_.isNumber(arg.errorCode)){
            statusCode = arg.errorCode;
        }
    }

    if(_.isString(arg)){

        var t = parseInt(getDigits(arg));

        if(_.isNumber(t) && !isNaN(t)){
            statusCode = t;
        }
    }

    if(_.isNumber(arg)){
        statusCode = arg;
    }

    /**
     * Reject non standard HTTP status codes
     */
    if(statusCode && http.STATUS_CODES[statusCode] === undefined){
        statusCode = null;
    }

    return statusCode;
};

/**
 * Parse error message
 * @param {*=} arg
 * @return {string|null}
 */
var getMessage = function(arg){

    var message;

    if(!arg){
        return null;
    }

    if(_.isObject(arg)){

        if(_.isString(arg.message) && arg.message.length){
            message = arg.message;
        }

        else if(_.isString(arg.error) && arg.error.length){
            message = arg.error;
        }
    }

    if(_.isString(arg) && arg.length){
        message = arg;
    }

    if(_.isArray(arg) && arg.length && _.isString(arg[0])){
        message = arg[0].trim();
    }

    // If the arg is a valid HTTP status code then set the default message for the corresponding status code
    if(_.isNumber(arg) && http.STATUS_CODES[arg] !== undefined){
        message = http.STATUS_CODES[arg];
    }

    return message;
};

/**
 * Returns digits from a string (if any)
 * @param {string} s
 * @return {string}
 */
var getDigits = function(s){
    if(!_.isString(s)) return '';
    return s.replace(/[^\d]/g, '').trim();
};
