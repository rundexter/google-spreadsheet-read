# Google Spreadsheet Reader 

This [Dexter](http://rundexter.com) module allows you to read 1-5 
columns from a Google Apps Spreadsheet into your App.  It uses the 
[Edit Google Spreadsheet](https://github.com/jpillora/node-edit-google-spreadsheet) 
library under the hood.

# Configuring the Step

## Input parameters

Parameter|Required|Multiple?|Details
---------|--------|---------|-------
spreadsheet | Yes | No | The ID of the spreadsheet you're reading
worksheet | No | No | The index of the target worksheet (defaults to 1)
start_row | No | No | Which row to start reading from (defaults to 2: assumes there's a header in 1)
end_row | No | No | Which row to end at, or -1 to read everything below start_row (defaults to -1)
email | No | No | Your Service Account's email.  If not set, it will try to use the matching environment variable as a default.
private_key | No | No | Your Service account's entire private key (not the filename!).  If not set, it will try to use the matching environment variable as a default.
col1_idx | No | No | Either the column index (1+) or the header name (EXACT, case included) of the data that should fill your col1 output
col2_idx | No | No | Either the column index (1+) or the header name (EXACT, case included) of the data that should fill your col2 output
col3_idx | No | No | Either the column index (1+) or the header name (EXACT, case included) of the data that should fill your col3 output
col4_idx | No | No | Either the column index (1+) or the header name (EXACT, case included) of the data that should fill your col4 output
col5_idx | No | No | Either the column index (1+) or the header name (EXACT, case included) of the data that should fill your col5 output

## Private Keys

Parameter|Required?|Details
---------|---------|-------
google_app_client_email | No | Your Service Account's email - will be used if input.email is not present.
google_app_client_private_key | No | Your Service Account's private key (the key itself, NOT the filename!) - will be used if input.private_key is not present.

## Managing credentials

### Getting the spreadsheet key

Look in your spreadsheet's URL. Betweed the d/ and /edit is a bunch
of random-looking characters.  This is your spreadsheet's key.

### Creating credentials

To use this module, you must have a Google spreadsheet with oAuth
credentials established.  To accomplish this, follow these steps:

1. Create a spreadsheet
1. Create a new project in the [Developers's Console](https://console.developers.google.com/project)
1. In the sidebar, go to APIs &amp; Auth &gt; APIs
1. Search for "drive", choose "Drive API", and "Enable API"
1. In the sidebac, go to APIs &amp; Auth &gt; Credentials
1. Go to Add Credentials &gt; Service Account
1. Choose JSON and "Create"
1. Move the downloaded JSON file someplace safe - you won't be able to download it again!
  * (you can always create a new service account if you lose your credentials)
1. Go back to your spreadsheet and share the doc with the email in the JSON file

Once you've got your credentials, you can use them in your App in one of two ways

### App-wide credentials

If you want EVERYONE who uses the app to add to the same spreadsheet, 
you can put the credentials in as private keys:

 google_app_client_email: <the email in the json file>
 google_app_client_private_key: <the ENTIRE private key in the JSON file, including line breaks>

Or as fixed entries in the email/private_key settings in the step itself.

### User-specific credentials

If you want each user to be to bring their own spreadsheet, leave the 
spreadsheet, email, and private key fields as user-driven, and share
the credential generating process above with them.

### Misc.

You CANNOT use your Google email and password to access these files.
It used to be an option, but Google wisely removed it.  You should never
add non-API credentials to Dexter!

# Forking &amp; Testing
If you'd like to customize this module, fork it in Github, clone your
fork to your computer, then take the following steps:

1. Change the package.json:name to a unique package name (dexter check_name will help you here)
1. COPY env.example.js into a new env.js file and hook it up as instructed
1. Make sure your test spreadsheet has some values that match the queries in fixtures/default.js
1. dexter run to make sure everything's working
1. run dexter init inside your newly cloned repo
