/* Require modules */
var $        = require('jquery'),
    Backbone = require('backbone'),
    models   = require('../models/global'),
    template = require("../templates/feed.html"),
    utils    = require("../common/utilities"),
    events   = require('../common/eventChannel'),
    globals  = require('../common/globals');

// Assign jQuery instance to Backbone.$
Backbone.$ = $;

// Set the view as the module export
module.exports = Backbone.View.extend({
 
    // Number of items per page
    itemsPerPage: 5,

	// Is called at instantiation
    initialize: function () {
 
        // Set view scope
        var $this = this;

        // Set the view collection
        this.collection = new models.BasicCollection();
        // Set the URL
        this.collection.urlRoot = globals.api.getFeed;
 
        // Listen for feed:get event
        events.on('feed:get', $this.getFeed, $this);
    },  

    // Capture events
    events: {
        'click .pagination li a' : 'changePage'
    },

    // Populates the view's element with the new HTML
    render: function (page) {     	
        // Log status
        utils.log("Feed", "viewRender");

        // If the page is set use it, otherwise set as 1
        var page = page || 1;
        
        // Get the models from the collection using the current page and number of items per page
        var collection = this.collection.pagination(this.itemsPerPage, page);

    	// Populate template with data
        this.$el.html( template({ 
            feedItems: collection, 
            errors: this.collection.errors,
            numPages: Math.ceil( this.collection.length / this.itemsPerPage ),
            currentPage: page
        }) );

        // Enable chaining
        return this;
    },

    // Call server to get feed
    getFeed: function (sFeedName) {

        // Set view scope
        var $this = this;

        // Set the params for the collection
        this.collection.params = sFeedName;

        // Call server
        this.collection.fetch({
            success: function (collection, response) {
                // Call render function
                $this.render();
            },
            error: function (collection, response) {

            }
        });
        // END fetch
    },

    // Change the page to a certain number or go back/forward one page
    changePage: function (e) {
        // Get the clicked element
        var elClicked = $(e.currentTarget);
        // Var to hold new page number
        var pageNo = undefined;
        // Get the page count.
        var pageCount = Math.ceil( this.collection.length / this.itemsPerPage );
        // Get the current active page
        var currentPageNo = this.$el.find('.pagination .active a').html();

        // Check to see if it's a page number
        if (elClicked.data('page-number')) {
            // Set the page to the new number
            pageNo = elClicked.data('page-number');
        // Otherwise it's back or forward   
        } else {
            // If it is forward add to current page, else deduct
            pageNo = elClicked.data('page-move') === 'forward' ? +currentPageNo + 1 : +currentPageNo - 1;
        } 
        // END if page number

        // If the page number is within range
        if ( pageNo > 0 && pageNo <= pageCount ) {
            // Call view's render function
            this.render(pageNo);             
        }


    }

});  