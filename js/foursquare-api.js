// ****************************************************
// * File Name: foursquare-api.js                     *
// *                                                  *
// * This file is to handel the foursquare api        *
// ****************************************************
// * Author: Dinesh Patra <dineshpatra28@gmail.com>   *
// ****************************************************
(function(global, $) {
    /****************************
    * HELPER FUNCTION           *
    *****************************/
    /**
    * Function to trim a charcter from left side from string
    *
    * @Arguments:
    *   <str>: String which will be trimmed
    *   <char>: characters needed to be trimmed. Default <space>
    *
    * @Returns: Left trimmed string
    */
    function ltrim(str, char=" ") {
        // If both the charcter and string are not
        // string, then no need to proceed.
        if (typeof(str) != 'string' || typeof(char) != 'string') {
            return;
        }
        var pattern = new RegExp('^' + char + '+', 'g');
        return str.replace(pattern, '');
    }

    /**
    * Function to trim a charcter from right side from string
    *
    * @Arguments:
    *   <str>: String which will be trimmed
    *   <char>: characters needed to be trimmed. Default <space>
    *
    * @Returns: Left trimmed string
    */
    function rtrim(str, char=" ") {
        // If both the charcter and string are not
        // string, then no need to proceed.
        if (typeof(str) != 'string' || typeof(char) != 'string') {
            return;
        }
        var pattern = new RegExp(char + '+$', 'g');
        return str.replace(pattern, '');
    }

    /**
    * Function to trim a charcter from both side from string
    *
    * @Arguments:
    *   <str>: String which will be trimmed
    *   <char>: characters needed to be trimmed. Default <space>
    *
    * @Returns: Left trimmed string
    */
    function trim(str, char=" ") {
        // If both the charcter and string are not
        // string, then no need to proceed.
        if (typeof(str) != 'string' || typeof(char) != 'string') {
            return;
        }
        return ltrim(rtirm(str));
    }

    /**
    * Function to convert an integer to string
    *
    * @Afrguments:
    *   <num>: The integre need to be converted
    *   <lengthReq>: required length of the string
    *
    * @Returns: String
    */
    function intToString(num, lengthReq = 1) {
        num = num.toString();
        var diff = lengthReq - num.length;

        // If the diffrence is greater then
        // 0
        if (diff > 0) {
            var tmp = "";
            while (diff > 0) {
                tmp = tmp + '0';
                diff--
            }
            num = tmp + num;
        }
        return num;
    }

    /**
    * Function to make ajax request to the foursqauare api
    *
    * @Arguments: 
    *   <endpoint>: Endpoint to the url
    *   <args>: Object containg diffrent args
    *
    * @Returns: It will return the success tresult.
    */
    function ajax(endpoint, args = {}) {
        var url = rtrim(_apiUrl, '/') + '/' + ltrim(endpoint, '/') + '?';
        args['client_id']     = _clientId;
        args['client_secret'] = _clientSecret;
        args['v']             = _v;
        args['m']             = _m;
        for (var arg in args) {
            url += arg + '=' + encodeURIComponent(args[arg]) + '&';
        }
        url = rtrim(url, '&');
        var returnObj = undefined;
        $.ajax({
            "method"  : "GET",
            "url"     : url,
            "async"   : false,
            "timeout" : _timeout,
            "dataType": 'json',
            "success" : function(data) {
                returnObj = data;
            }
        });
        return returnObj;
    }

    /****************************
    * API Varibales             *
    *****************************/
    var _d = new Date();
    var _clientId     = undefined,
        _clientSecret = undefined,
        _apiUrl       = "https://api.foursquare.com/v2",
        _m            = 'foursquare',
        _v            = intToString(_d.getFullYear(), 4)
                      + intToString(_d.getMonth(),    2)
                      + intToString(_d.getDate(),     2),
        _timeout      = 60;
    
    /*************************************
    * Venues services                    *
    **************************************/
    var venues = (function() {
        function venue() {}

        /**
        * Categories service
        *
        * @Arguments: Void
        *
        * @Returns: nested categories object
        */
        venue.prototype.categories = function() {
            var endpoint = "venues/categories";
            var cat = ajax(endpoint);
            return cat['response']['categories'];
        }

        /**
        * Function to search a venue
        *
        * @Arguments: arguments containgg different paramaeter
        *   <ll>: comma seprated latitude and longitude
        *   <near>: Near as baddress
        *   <query>: A search term to be applied against venue names.
        *   <limit>: Number of serach results to be included
        *   <intent>:
        *           <checkin>: Finds results that the current user is likely to check in 
        *           <browse>:  Search the entire location
        *           <global>:  search venues globally. Ignores ll
        *           <match>:   Finds venues that are are nearly-exact matches for the given parameters.
        *           defaultis checkin
        *   <radius>: in meters
        *   <categoryId>: Comma seprated the category ids
        *
        * @Returns: venues object
        */
        venue.prototype.search = function(args = {}) {
            var endpoint = "venues/search";
            var cat = ajax(endpoint, args);
            return cat['response']['venues'];
        }

        /**
        * Function to get photo for a venues
        *
        * @Arguments:
        *   <venueId>: Id of the venue for which we need to get the photo; 
        *   arguments containgg different paramaeter 
        *   <group>:
        *           <checkin>: Finds results that the current user is likely to check in 
        *           <browse>:  Search the entire location
        *           <global>:  search venues globally. Ignores ll
        *           <match>:   Finds venues that are are nearly-exact matches for the given parameters.
        *           defaultis checkin
        *   <limit>: Number of results to return, up to 200.
        *   <offset>: Used to page through results.
        *
        * @Returns: venues object
        */
        venue.prototype.photos = function(venueId, args = {}) {
            if (typeof(venueId) != 'string') {
                return;
            }

            var endpoint = "venues/" + venueId + "/photos";
            var cat = ajax(endpoint, args);
            return cat['response']['photos'];
        }
        return new venue();
    })();

    /**
    * Foursquare object
    *
    * @Arguments: None
    *
    * @RETURNS: nONE
    */
    global.FourSquare = (function() {

        /**
        * Constructor function 
        *
        * @Arguments: 
        *   <clientId>: Client Id to access the foursquaree api
        *   <clientSecret>: ClientSecret to access the foursquare
        *
        * @Returns: Instance
        */
        function fourSquare(clientId, clientSecret, timeout = 60) {
            if (typeof(clientId) != "string") {
                throw "Expected value for `clientId` is string.";
            }
            if (!clientId) {
                throw "`clientId` can not be empty."
            }
            if (typeof(clientSecret) != "string") {
                throw "Expected value for `clientSecret` is string.";
            }
            if (!clientSecret) {
                throw "`clientSecret` can not be empty."
            }
            _clientId     = clientId;
            _clientSecret = clientSecret;
            _timeout      = timeout;
        }

        // Adding endpoints
        fourSquare.prototype.venues = venues;

        return fourSquare;
    })();
})(window, jQuery);