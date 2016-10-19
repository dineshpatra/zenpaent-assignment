(function($) { 
    var foursquare  = undefined,
        geocoder    = undefined;

    /**
    * Function to get latitude and longitude from a given address
    *
    * @Arguments:
    *   <address>: Address need to be converted to lat and lng
    *   <callback>: Callback function need to be executed after geocding.
    *               It takes two argument, result and status
    *
    * @Returns: None
    */
    function getLatLngFromAddress(address, callback) { 

        // If geocoder object is not initialized, then initalize it
        if (!geocoder) {
            geocoder = new google.maps.Geocoder();
        }
        geocoder.geocode( { 'address': address}, callback);
        return
    }

    /**
    * Function to get address from a given latitude and longitude
    *
    * @Arguments:
    *   <latitude>: latitude of the place
    *   <longitude>: longitude of the place
    *   <callback>: Callback function need to be executed after geocding.
    *               It takes two argument, result and status
    *
    * @Returns: None
    */
    function getAddressFromLatLng(latitude, longitude, callback) { 

        // If geocoder object is not initialized, then initalize it
        if (!geocoder) {
            geocoder = new google.maps.Geocoder();
        }
        var latlng = new google.maps.LatLng(latitude, longitude);
        geocoder.geocode( {'latLng': latlng}, callback);
        return
    }

    $(document).ready(function() {
        geocoder = new google.maps.Geocoder();

        $("#zenparent-locator-form").on('submit',  function(e) {
            e.preventDefault();
            var address = $("#zenparent-locator-address-input").val();
            if (!address) {
                return;
            }
            var categories = $(".zp-categories").find(".zp-categories-checkbox:checked");
            var categoryIds = "";
            for (var i = 0; i < categories.length; i++) {
                categoryIds += categories.eq(i).attr("zp-category-id") + ',';
            }

            categoryIds = categoryIds.replace(/,+$/g, '');
            getLatLngFromAddress(address, function(result, status) {
                $('.zp-results').html('');
                if (status != 'OK') {
                    return;
                }
                var lat = result[0].geometry.location.lat();
                var lng = result[0].geometry.location.lng();
                var locations = fourSquare.venues.search({
                    "ll" : lat.toString() + ',' + lng.toString(),
                    "categoryId": categoryIds,
                    "limit": 4 
                });
                console.log(locations);
                for (var l in locations) {
                    // Create a closure
                    (function(venue) {
                        var photo = fourSquare.venues.photos(venue.id, {limit:1});
                        var imgSrc = "http://placehold.it/150x150/FF0000/FFFFFF&text="+encodeURIComponent("No image found.");
                        // If any image found, then locate that.
                        if (photo.count == 1) {
                            imgSrc = photo.items[0].prefix+'150'+photo.items[0].suffix;
                        }
                        var name      = venue.name;
                        var verified  = venue.verified;
                        var distance  = venue.location.distance;
                        var latitude  = venue.location.lat;
                        var longitude = venue.location.lng;
                        var verifiedText = (verified) ? '<small style="color:green;">Verified</small>'
                                                      : '<small style="color:red;">Not Verified</small>'
                        getAddressFromLatLng(latitude, longitude, function(result, status) {
                            var location = "Address not found."; 
                            if (status == 'OK') {
                                location =  result[0].formatted_address;
                            }
                            var html = '<div class="zp-result-item" id="zp-venue-'+ venue.id+ '">'
                                     + '<img src="'+imgSrc+'">'
                                     + '<h3>'+name+'</h3>'
                                     + '<p class="venue-address">' + location + '</p>'
                                     + '<p class="venue-distance">' + distance + ' meters away.</p>'
                                     + verifiedText
                                     + '</div>';
                            $('.zp-results').append(html);
                        });
                    })(locations[l]); 
                }
            });
            return false;
        });

        //$("#zenparent-locator-btn").prop("disabled", btnDisable);

        var mapContainer = document.getElementById('zenparent-locator-map-container');
        if (!mapContainer) {
            console.error("Something went wrong. No element found.");
            return;
        }

        var _MAP = new google.maps.Map(mapContainer, {
                center: {lat: -34.397, lng: 150.644},
                zoom: 6
        }); 

        /**
        * function to mark the current position
        *
        * @Arguments: 
        *   <position>: HTML5 navigator position object
        *
        * This function will be executed, if the browser supports
        * navigation object, and it has found location 
        */
        function html5_displayCurrentPosition(position) {
            reverse_geoCode(position.coords.latitude, position.coords.longitude, function(address) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                foursquareAPI(pos.lat, pos.lng); 
                _MAP.setCenter(pos);
                var marker = new google.maps.Marker({
                    position: pos,
                    map: _MAP,
                    title: address
                });
                marker.setMap(_MAP);
                var infowindow = new google.maps.InfoWindow({
                    content: "<div>"+address+"</div>"
                });
                marker.addListener('click', function() {
                    infowindow.open(_MAP, marker);
                });
                $("#zenparent-locator-address-input").val(address);
            });
        }


        function html5_geolocationError(){
            console.log("Error in geolocation.");
        }
        var fourSquare = undefined;

        /**
        * Function to display categories
        *
        * @Arguments: Void
        *
        * @Returns: None
        */
        function displayCategories(categories, parentId, lavel=0){ 
            for (var cat in categories) { 
                var catId = categories[cat].id;
                var html = '<div class="zp-category-item">'
                         + '<label for="zp-category-id-'+catId+'">'
                         + '<input type="checkbox" class="zp-categories-checkbox" zp-category-id = "' + catId+ '" zp-category-name="'+categories[cat].name+'" id="zp-category-id-'+catId+'">'
                         + categories[cat].name
                         + '</label>'
                         + '</div>'
                $(".zp-categories").append(html); 
            }
        }

        /**
        * Initilazing our plugin demo
        *
        * @Arguments: None
        *
        * @Returns: None
        */
        function init() { 
            var fsCred = _ZENPARENT_LOCATOR['foursquare'];
            fourSquare = new FourSquare(fsCred['client-id'], fsCred['client-secret']);
            var categories = fourSquare.venues.categories();
            displayCategories(categories); 
            return;
            // If the geolocation is supported in browser
            // then proceed, otherwise no need to do anything 
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(html5_displayCurrentPosition, html5_geolocationError);
            } else {
                html5_geolocationError();
            }
        }
        init();
     });
})(jQuery);