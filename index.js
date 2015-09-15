var _ = require('lodash')
    , Q = require('q')
    , assert = require('assert')
    , GoogleSpreadsheet = require('google-spreadsheet')
    ;
module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spreadsheetId = step.input('spreadsheet').first()
            , worksheetId = parseInt(step.input('worksheet').first() || 0, 10)
            , firstColumn = step.input('first_header').first()
            , secondColumn = step.input('second_header').first()
            , thirdColumn = step.input('third_header').first()
            , fourthColumn = step.input('fourth_header').first()
            , fifthColumn = step.input('fifth_header').first()
            , startRow = parseInt(step.input('start_row').first() || 0, 10)
            , endRow = parseInt(step.input('end_row').first() || -1, 10)
            , email = dexter.environment('google_app_client_email')
            , privateKey = dexter.environment('google_app_client_private_key')
            , data = []
            , columns
            , spreadsheet 
            , self = this
            ;
        //console.log(worksheetId, firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn, startRow, endRow);
        //A few simple assertions
        assert(!isNaN(worksheetId) && worksheetId >= 0, 'Worksheet ID must be an integer, and will default to 0 if left out');
        assert(!isNaN(startRow) && startRow >= 0, 'Start row must be an integeter, and will default to 0 if left out');
        assert(!isNaN(endRow), 'End row must be an integer - negative values mean "to the very end"');
        //Make sure we have both email and privatekey or neither
        assert(Boolean(email) === Boolean(privateKey));

        //Assemble the passed columns
        columns = { first: firstColumn, second: secondColumn, third: thirdColumn, fourth: fourthColumn, fifth: fifthColumn };

        spreadsheet = new GoogleSpreadsheet(spreadsheetId);
        Q.ninvoke(spreadsheet, 'getInfo')
            .fail(function(err) {
                if(!email) {
                    return self.fail('Unable to access spreadsheet:' + err.message);
                }
                //Try again with credentials
                return Q.ninvoke(spreadsheet, 'useServiceAccountAuth', {
                    client_email: email,
                    private_key: privateKey
                })
                    .then(function() {
                        return Q.ninvoke(spreadsheet, 'getInfo');
                    });
            })
            .then(function(info) {
                var worksheet = info.worksheets[worksheetId];
                return Q.ninvoke(worksheet, 'getRows');
            })
            .then(function(rows) {
                _.each(rows, function(row, idx) {
                    var o = {};
                    if(idx < startRow) {
                        return;
                    }
                    if(idx > endRow) {
                        return false;
                    }
                    _.each(columns, function(key, column) {
                        if(!key) {
                            return;
                        }
                        o[column ] = row[key];
                    });
                    data.push(o);
                });
                self.complete(data);
            })
            .fail(function(err) {
                self.fail(err);
            });
    }
};
