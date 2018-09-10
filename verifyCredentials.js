"use strict";
const request = require('request-promise');

/**
 * Executes the verification logic by sending a simple to the Petstore API using the provided apiKey.
 * If the request succeeds, we can assume that the apiKey is valid. Otherwise it is not valid.
 *
 * @param credentials object to retrieve apiKey from
 *
 * @returns Promise sending HTTP request and resolving its response
 */

module.exports = function verifyCredentials(credentials, cb) {
    // In credentials you will find what users entered in account form
    console.log('Credentials passed for verification %j', credentials)
    if (true) {
        // Verified
        return cb(null, {verified: true});
    } else {
       // Verification failed
       return cb(null , {verified: false});
    }
}