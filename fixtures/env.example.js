//  WARNING!
//  IF THIS FILE IS NAMED env.example.js
//  **DON'T** edit it - copy it to env.js FIRST

//Go through the steps in the readme to generate credentials for your spreadsheet.
//Then put the resulting JSON in the fixtures folder and include it here:
var creds = require('./???????.json');
module.exports = {
    environment: {
        google_app_client_email: creds.client_email,
        google_app_client_private_key: creds.private_key
    },
    data: {
        local_test_step: {
            input: {
                //Add the ID of the spreadsheet here
                spreadsheet: '?????'
            }
        }
    }
};
