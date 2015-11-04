var _ = require('lodash')
    , Q = require('q')
    , assert = require('assert')
    , GoogleSpreadsheet = require('edit-google-spreadsheet')
    ;

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spreadsheetId = dexter.environment('google_spreadsheet')
            , worksheetId = 1 //parseInt(step.input('worksheet').first() || 1, 10)
            , col1 = step.input('col1_idx').first()
            , col2 = step.input('col2_idx').first()
            , col3 = step.input('col3_idx').first()
            , col4 = step.input('col4_idx').first()
            , col5 = step.input('col5_idx').first()
            , startRow = parseInt(step.input('start_row').first() || 2, 10)
            , endRow = parseInt(step.input('end_row').first() || -1, 10)
            , email = dexter.environment('google_app_client_email')
            , privateKey = dexter.environment('google_app_client_private_key')
            , columns
            , self = this
            ;
        //console.log(spreadsheetId, worksheetId, col1, col2, col3, col4, col5, startRow, endRow);
        //A few simple assertions
        assert(spreadsheetId, 'Spreadsheet key requried (look for it in the spreadsheet\'s URL');
        assert(!isNaN(worksheetId) && worksheetId >= 0, 'Worksheet ID must be an integer, and will default to 0 if left out');
        assert(!isNaN(startRow) && startRow >= 1, 'Start row must be an integeter, and will default to 2 if left out');
        assert(!isNaN(endRow), 'End row must be an integer - negative values mean "to the very end"');
        assert(endRow < 0 || endRow >= startRow, 'End row must come after start row');
        //Make sure we have both email and privatekey
        assert(Boolean(email) && Boolean(privateKey), 'Email and private key are required, either as private settings or step inputs');

        //Assemble the passed columns
        columns = { col1: col1, col2: col2, col3: col3, col4: col4, col5: col5 };

        options = {
            //debug: true,
            spreadsheetId: spreadsheetId,
            worksheetId: worksheetId,
            oauth: {
                email: email,
                key: privateKey
            }
        };
        Q.ninvoke(GoogleSpreadsheet, 'load', options)
            .then(function(spreadsheet) {
                return Q.ninvoke(spreadsheet, 'receive', { getValues: true });
            })
            .then(function(response) {
                self.complete(self.parseRows(response[0], columns, startRow, endRow));
            })
            .fail(function(err) {
                if(err.stack) {
                    console.log(err.stack);
                }
                self.fail(err);
            })
            ;
    },
    parseRows: function(rows, columns, start, end) {
        //Get out quick if there aren't any rows
        if(Object.keys(rows).length === 0) {
            return [];
        }
        var colMap = _.clone(columns)
            , headerMap = {}
            , results = []
            ;
        //Treat the first row like a header row...if it's not, and the app doesn't treat it like one, there's no harm done.
        _.each(rows[1], function(val, key) {
            headerMap[val] = key; 
        });
        //If any of the columns are non-numeric, assume there's a header in the 1st row and look them up
        _.each(colMap, function(userKey, outKey) {
            if(_.isNaN(parseInt(userKey, 10))) {
                colMap[outKey] = headerMap[userKey] || null;
            }
        });
        //Assemble the data
        _.each(rows, function(row, idx) {
            var o = {};
            idx = parseInt(idx, 10);
            if(idx < start) {
                return;
            }
            if(end > 0 && end < idx) {
                return false;
            }
            o.idx = idx;
            _.each(colMap, function(userKey, outKey) {
                o[outKey] = row[String(userKey)];
            });
            results.push(o);
        });
        return results;
    }
};
