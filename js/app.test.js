/** Note: We could add the logic from app.js here to start the app and then use jQuery to perform
          DOM manipulation to test the view/template logic to ensure that the form submits, images load, etc */

/* Require modules */
var $         = require('jquery'),
    Backbone  = require('backbone'),
    Router    = require('./common/router'),    
    events    = require('./common/eventChannel'),
    utils     = require('./common/utilities'),
    globals   = require('./common/globals'),
    models    = require('./models/global'),
    qunit     = require('./_vendor/qunit');


/**
 * Set the module for the following tests
 */
QUnit.module('Fetch Feeds');


// Test that when we send a valid feed name, we get data back
test("Pass-Check: Server fetch with valid feed name", 1, function () {

	// Object containing our test data
	var oTests = {
		0: { 
			params:  'topstories',
			testMessage: 'We should have data for this valid name'
		},
	};

	// Set array to contain each collection
	var aCollections = [];

	// Loop for each test in array
	for (var i in oTests) {

	    // Stop QUnit
	    stop(); 		

		// Get the current test
		var oTest = oTests[i];

		// Define instance of collection
		aCollections[i] = new models.BasicCollection();
		aCollections[i].params = oTest.params;
		aCollections[i].testMessage = oTest.testMessage;
		aCollections[i].urlRoot = globals.api.getFeed;

	    // Make call to server
	    aCollections[i].fetch({
	        success: function (collection, response) {

	        	// Check that we've got data
	        	var bGotData = collection.length > 0;

	        	// Check that we have a collection with data
	        	ok(bGotData, collection.testMessage);

	        	// Start QUnit
	        	start();
	        }
	    });
	    // END fetch
	}
	// END loop
});

// Let's make sure we get errors for submitting these values
test("Fail-Check: Server conversion to numerals", 1, function () {

	// Object containing our test data
	var oTests = {
		0: { 
			params:  'topstoriessdgsg',
			testMessage: 'We should not have data for this invalid name'
		},
	}; 

	// Set array to contain each collection
	var aCollections = [];

	// Loop for each test in array
	for (var i in oTests) {

	    // Stop QUnit
	    stop(); 		

		// Get the current test
		var oTest = oTests[i];

		// Define instance of collection
		aCollections[i] = new models.BasicCollection();
		aCollections[i].params = oTest.params;
		aCollections[i].testMessage = oTest.testMessage;
		aCollections[i].urlRoot = globals.api.getFeed;

	    // Make call to server
	    aCollections[i].fetch({
	        success: function (collection, response) {

	        	// Check that collection.errors is true
	        	ok(collection.errors, collection.testMessage);

	        	// Start QUnit
	        	start();
	        }
	    });
	    // END fetch
	}
	// END loop
});