<?php

    // Require the class
    require_once 'classes/RssFeed.class.php';

	// Array to hold response values
	$aResponse = [];

	// Get the request feedUrl parameter if it exists
	$sFeedName = isset($_REQUEST['feedName']) ? $_REQUEST['feedName'] : null;

	// Check that the URL exists
	if ( !$sFeedName ) {
		// Set the response for an error
		$aResponse['errorCode'] = -1;
		$aResponse['message'] = 'The feed URL is required.';
		// End execution and output response as JSON
		die( json_encode($aResponse) );
	}

	// Create array to hold the values of the possible feeds
	$aFeeds = [
		'topstories' => 'http://feeds.bbci.co.uk/news/rss.xml',
		'world' => 'http://feeds.bbci.co.uk/news/world/rss.xml',
		'uk' => 'http://feeds.bbci.co.uk/news/uk/rss.xml',
		'business' => 'http://feeds.bbci.co.uk/news/business/rss.xml',
		'politics' => 'http://feeds.bbci.co.uk/news/politics/rss.xml',
		'health' => 'http://feeds.bbci.co.uk/news/health/rss.xml',
		'education' => 'http://feeds.bbci.co.uk/news/education/rss.xml',
		'science' => 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
		'technology' => 'http://feeds.bbci.co.uk/news/technology/rss.xml',
		'entertainment' => 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
	];

	// Check that the feedname exists as a key in the array
	if ( array_key_exists($sFeedName, $aFeeds) ) {
		// Set the feed URL to the value of the corresponding array index
		$sFeedUrl = $aFeeds[$sFeedName];
	} else {
		// Set the response for an error
		$aResponse['errorCode'] = -1;
		$aResponse['message'] = 'The feed name provided was not found.';
		// End execution and output response as JSON
		die( json_encode($aResponse) );		
	}

	// Create instance of class
	$RssFeed = new RssFeed();

	// Call method of class to get RSS feed
	$bFeedFetched = $RssFeed->getFeed($sFeedUrl);

	// If the feed fetch was successful
	if ($bFeedFetched) {
		// Set the converted value to the array
		$aResponse['data'] = $RssFeed->aCurrentParsedXml;
	} else {
		//
		$aResponse['message'] = $RssFeed->sCurrentError;
	}

	// Return the array, encoded as JSON
	echo json_encode($aResponse);