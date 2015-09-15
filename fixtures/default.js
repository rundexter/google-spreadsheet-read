var _ = require('lodash')
    , env = require('./env')
    ;

module.exports = _.merge({
    /*
     * Some default settings. 
     *
     * You can generally leave this as is for general testing purposes.
     */
    simulation: true
    , instance_id: 'local_test_instance'
    , urls: {
        home: "http://rundexter.com/"
    }
    , instance_state: {
        active_step :  "local_test_step"
    }
    , workflow: {
        "id" : "local_test_workflow"
        , "title": "Local test workflow"
        , "description": "A fixture workflow used to test a module"
    }
    , steps: {
        local_test_step: {
            id: 'local_test_step'
            , type: 'module'
            //The test runner will change YOUR_MODULE_NAME to the correct module name
            , name: 'YOUR_MODULE_NAME'
            , next: []
        }
    }
    , modules: {
        //The test runner will add the proper data here
    }
    /*
     * End defaults
     */
    , environment: {
       /*
        * Any API keys you might need should go in the env.js.
        * For example:
        *
        "parse_app_id": "abc123"
        , "parse_app_key": "foobar"
        */
    }
    , user: {
        /*
         * Your dexter user settings should go in the env.js file and remain uncommitted.  
         * For example:
         *
        profile: {
            id: 1,
            api_key: 'apikeytest'
        }
         */
    }
    , data: {
        local_test_step: {
            input: {
                //spreadsheet name will come from env
                //spreadsheet: 'aaabbbbccc',
                //worksheet will default to 0
                //worksheet: 0
                col1_idx: 5,
                col2_idx: 'foo',
                col3_idx: 'xxx',
                col4_idx: 'bar',
                //col5_dix will default to '4'
                start_row: 2,
                end_row: 3
            }
        }
    }
}, env);
