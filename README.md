# Google Spreadsheet Reader 

This [Dexter](http://rundexter.com) module allows you to read 1-5 
columns from a Google Apps Spreadsheet into your App.  It uses the 
[Edit Google Spreadsheet](https://github.com/jpillora/node-edit-google-spreadsheet) 
library under the hood.

# Configuring the Step

## Getting the spreadsheet key

Look in your spreadsheet's URL. Betweed the d/ and /edit is a bunch
of random-looking characters.  This is your spreadsheet's key.

## Creating credentials

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

## App-wide credentials

If you want EVERYONE who uses the app to add to the same spreadsheet, 
you can put the credentials in as private keys:

 google_app_client_email: <the email in the json file>
 google_app_client_private_key: <the ENTIRE private key in the JSON file, including line breaks>

Or as fixed entries in the email/private_key settings in the step itself.

## User-specific credentials

If you want each user to be to bring their own spreadsheet, leave the 
spreadsheet, email, and private key fields as user-driven, and share
the credential generating process above with them.

# Forking &amp; Testing
If you'd like to customize this module, fork it in Github, clone your
fork to your computer, then take the following steps:

1. Change the package.json:name to a unique package name (dexter check_name will help you here)
1. COPY env.example.js into a new env.js file and hook it up as instructed
1. Make sure your test spreadsheet has some values that match the queries in fixtures/default.js
1. dexter run to make sure everything's working
1. run dexter init inside your newly cloned repo
