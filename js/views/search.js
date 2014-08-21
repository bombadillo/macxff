/* Require modules */
var $        = require('jquery'),
    Backbone = require('backbone'),
    models   = require('../models/global'),
    template = require("../templates/search.html"),
    utils    = require("../common/utilities"),
    events   = require('../common/eventChannel');

// Assign jQuery instance to Backbone.$
Backbone.$ = $;

// Set the view as the module export
module.exports = Backbone.View.extend({

	// Is called at instantiation
    initialize: function () {
 
        // Call function to render the view
        this.render();
    },  

    // Populates the view's element with the new HTML
    render: function () {     	
        // Log status
        utils.log("Search", "viewRender");
        
    	// Populate template with data
        this.$el.html( template({ feeds: this.aFeeds.toJSON() ) );

        // Enable chaining
        return this;
    },

});  