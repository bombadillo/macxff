<?php

// Require the interface
require_once __DIR__ . '/../interfaces/RssFeed.interface.php';

class RssFeed implements iRssFeed {

    // Set private variables
    private $sCurrentXml;

    // Set pulbic variables
    public $aCurrentParsedXml, $sCurrentError;


    /**
     *  Name     getFeed
     *  Purpose  To get the RSS feed using the pased in URL
     *  Params   {string}  sFeedUrl  The URL of the RSS feed
     *  Returns  +ve  true 
     *           -ve  false
     */
    public function getFeed($sFeedUrl) {

        // This will hold the status of the method, whether it was successful or not
        $bStatus = false;

        // Call method to check that file the URL points to exists
        $bExists = $this->checkFeed($sFeedUrl);

        // If the file exists
        if ($bExists) {
            // Disable any errors. We only want to check if it's been loaded or not
            libxml_use_internal_errors(true); 
            // Use simple XML to load XML into object
            $oXml = simplexml_load_string($this->sCurrentXml);

            // Ensure that the XML has loaded
            if ( $oXml ) { 
                // Call method to parse the feed
                if ( $this->parseFeed($oXml) ) {
                    // Set to true since we have a parsed array
                    $bStatus = true;
                } else {
                    // Set to false since the XML did not parse
                    $bStatus = false;
                    // Set message to define the error
                    $this->sCurrentError = 'Parsed XML array is empty';
                }
                // END if 
            } else {
                // Set to false since the file did not parse
                $bStatus = false;
                // Set message to define the error
                $this->sCurrentError = 'XML could be loaded into Simplexml object.';
            }   
            // END if loaded    
        } else {
            // Set to false since the file does not exist
            $bStatus = false;
            // Set message to define the error
            $this->sCurrentError = 'File does not exists.';
        }
        // END if exists

        // Return the boolean
        return $bStatus;

    }


    /**
     *  Name     checkFeed
     *  Purpose  To check if the URL links to an existing file
     *  Params   {string}  sFeedUrl  The URL of the RSS feed
     *  Returns  +ve  true (sets $this->sCurrentXml)
     *           -ve  false
     */
    private function checkFeed($sFeedUrl) {

        // This will hold the status of the cURL, whether it was successful or not
        $bStatus = false;

        // Initial cURL
        $ch = curl_init($sFeedUrl);   

        // Don't output the return data on execution
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        
        // Execute the cURL
        $sData = curl_exec($ch);

        // Get the HTTP status code
        $iCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Check that the code is the 'OK' code
        if ($iCode == 200) {
            // Set to true since we have found the file
            $bStatus = true;

            // Set the class variable to the data returned from the cURL
            $this->sCurrentXml = $sData;
        } else {
            // Set to false since the code is not 'OK'
            $bStatus = false;
        }

        // Close the cURL
        curl_close($ch);        

        // Return boolean
        return $bStatus;
     
    }

    /**
     *  Name     parseFeed
     *  Purpose  To 
     *  Params   {object}  oXml  Simplexml object of RSS feed
     *  Returns  +ve  true   
     *           -ve  false
     */    
    private function parseFeed($oXml) {

        // This will hold the status of the parse, whether it was successful or not
        $bStatus = false;

        // Define array that we'll use to push each parsed item into
        $aParsedXml = array();

        // Get the namespaces of the XML
        $namespaces = $oXml->getNamespaces(true);

        // Loop each channel->item node
        foreach ($oXml->channel->item as $item)
        {
            // To get thumbnail, we loop the child nodes with media namespace.
            if ( isset($namespaces['media']) )
            {
                // Get the thumbnail
                $thumbnail = $item->children($namespaces['media'])->thumbnail;
                // Add simplexml image element and assign it to the $image variable
                $image = $item->addChild('image');

                // If the thumbnail exists
                if ($thumbnail) {
                    // Loop each of the attributes and add as a child node.
                    foreach($thumbnail->attributes() as $attr => $value)
                    {
                        // Add the thumbnail attributes to the newly added element
                        $image->addChild($attr, $value);
                    }
                    // END loop attributes
                }
                // END if thumbnail
            }
            // END if media namespace

            // Add item to the array of parsed items
            array_push($aParsedXml, $item);
        }        
        // END loop

        // If the count of the array is less than 1, then the parse has not worked or there is no XML to parse
        if ( count($aParsedXml) > 1 ) {

            // Set to true since we have array items
            $bStatus = true;
            // Set the class variable to the parsed XML array
            $this->aCurrentParsedXml = $aParsedXml;

        } else {

            // Set status to false since we don't have any array items
            $bStatus = false; 

        }
        // END if

        // Return the array
        return $aParsedXml;
    }

}