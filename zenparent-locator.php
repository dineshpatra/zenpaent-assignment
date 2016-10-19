<?php 
/*
Plugin Name: ZENPARENT Locator
Plugin URI: https://github.com/dineshpatra/zenparent-locator
Description: Display the photos of five nearest locations to a place.
Version: 1.0
Author: Dinesh Patra
Author URI: https://github.com/dineshpatra/
*/

# Stop accessing this directly.
if (!function_exists( 'add_action' ) ) {
    exit(1);
}

require_once dirname(__FILE__).DIRECTORY_SEPARATOR.'includes'.DIRECTORY_SEPARATOR.'Admin.php';
require_once dirname(__FILE__).DIRECTORY_SEPARATOR.'includes'.DIRECTORY_SEPARATOR.'Functions.php';

/**
* Admin section initializationwp_enqueue_style('zenparent-locator-design', plugin_dir_url(__FILE__).'/css/style.css', array(), '1.0', 'all');
*/
add_action('admin_init', array('zenparent\Admin', 'adminInit'));
add_action('admin_menu', array('zenparent\Admin', 'adminMenu'));
register_activation_hook( __FILE__, array('zenparent\Admin', 'install'));
register_deactivation_hook( __FILE__, array('zenparent\Admin', 'uninstall'));
add_action('admin_enqueue_scripts', function() {
    wp_enqueue_style('zenparent-locator-design', plugin_dir_url(__FILE__).'/css/style.css', array(), '1.0', 'all');
});


/**
* Adding action for shortcode
*/
add_shortcode("ZENPARENT-LOCATOR", array('zenparent\Functions', 'display'));

add_action('wp_enqueue_scripts', function() {
    $options = get_option(zenparent\Admin::$optionName); 
    wp_enqueue_style('zenparent-locator-design', plugin_dir_url(__FILE__).'css/style.css', array(), '1.0', 'all');
    wp_enqueue_script("zenparent-google-map-plugin", "https://maps.googleapis.com/maps/api/js?key={$options['google_map_key']}", array(), false, true);
    wp_enqueue_script("zenparent-google-map-script", plugin_dir_url(__FILE__).'js/script.js', array('jquery', 'zenparent-google-map-plugin', 'zenparent-foursquare-script'), '1.0', true);
    wp_enqueue_script("zenparent-foursquare-script", plugin_dir_url(__FILE__).'js/foursquare-api.js', array('jquery'), '1.0', true);
});

add_action('wp_head', function() {
    $options = get_option(zenparent\Admin::$optionName); 
    ?>
    <script type="text/javascript">
    var _ZENPARENT_LOCATOR = {
        "google-map" : {
            "key": "<?php echo addslashes($options['google_map_key']); ?>"
        },
        "foursquare" : {
            "client-id" : "<?php echo addslashes($options['foursquare_api_client_id']); ?>",
            "client-secret" : "<?php echo addslashes($options['foursquare_api_client_secret']); ?>"
        }
    }
    </script>
    <?php
});

?>