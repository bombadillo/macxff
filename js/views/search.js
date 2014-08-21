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

    // Array containing possible feeds
    aFeeds: [
        'topstories',
        'world',
        'uk',
        'business',
        'politics',
        'health',
        'education',
        'science',
        'technology',
        'entertainment'
    ],

    // Capture events
    events: {
        'click .feed-item' : 'getFeed'
    },
 
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
        this.$el.html( template({ feeds: this.aFeeds }));

        // Enable chaining
        return this;
    },

    // Gets the name of the feed clicked and triggers event
    getFeed: function (e) {
        // Get the item clicked
        var elClicked = $(e.currentTarget);

        // Get the name of the feed
        var sFeedName = elClicked.html();

        // Trigger event, passing the feed name
        events.trigger('feed:get', sFeedName);
    }

});  