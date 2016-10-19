<?php namespace zenparent;
// ****************************************************
// * File Name: Admin.php                             *
// *                                                  *
// * This file is to handel the admin option page for *
// * zenparent                                        *
// ****************************************************
// * Author: Dinesh Patra <dineshpatra28@gmail.com>   *
// ****************************************************
class Admin {

    # | Option name. In this name our all settings will be 
    # | stored in database.
    public static $optionName = "zenparent_locator_setting";

    /**
    * Function to be executed during admin login to dashboard
    *
    * @Arguments: Null
    *
    * @Returns: Null
    */
    public static function adminInit() {
        register_setting('zenparent_locator', self::$optionName, array('zenparent\Admin', 'validateOptions'));
    }

    /**
    * Function to register the admin menu
    *
    * @Arguments: Null
    *
    * @Returns: Null
    */
    public static function adminMenu() {
        add_options_page(
            'Zenparent Locator', 
            'Zenparent Locator Settings', 
            'manage_options',
            'zenparent_locator', 
            array('zenparent\Admin', 'settingPage')
        );
    }
/**
AIzaSyBVaAZjEYtKN5-jfmVihIz1a5jh9iu6Z1A

WIV2UECSNE4CXUFNA01W4K2R0OFEHRAOK5FARI1KV35BRISO
Y0Z2WYUXPLT1TW2BKZ3PLIMTISXVYMUGA1E25ZNI1GHTDEHC
*/
    /**
    * Function to be executed during plugin install
    *
    * @Arguments: Null
    *
    * @Returns: Null
    */
    public static function install() { 
        add_option(self::$optionName, array(
            "google_map_key"               => "",
            "google_map_zoom"              => 6,
            "google_map_latitude"          => 0,
            "google_map_longitude"         => 0,
            "foursquare_api_client_id"     => "",
            "foursquare_api_client_secret" => ""
        ));
    }

    /**
    * Function to be executed during plugin uninstall
    *
    * @Arguments: Null
    *
    * @Returns: Null
    */
    public static function uninstall() { 
        delete_option(self::$optionName);
    }

    /**
    * Function to display the setting page
    *
    * @Arguments: None
    *
    * @Returns: None
    */
    public static function settingPage() {
        $options = get_option(self::$optionName);
        $googleApiKey = isset($options['google_map_key']) ? $options['google_map_key'] : "";
        $googleMapZoom = isset($options['google_map_zoom']) ? $options['google_map_zoom'] : "";
        $googleMapLatitude = isset($options['google_map_latitude']) ? $options['google_map_latitude'] : "";
        $googleMapLongitude = isset($options['google_map_longitude']) ? $options['google_map_longitude'] : "";
        $fourSquareClientId = isset($options['foursquare_api_client_id']) ? $options['foursquare_api_client_id'] : "";
        $fourSquareClientSecret = isset($options['foursquare_api_client_secret']) ? $options['foursquare_api_client_secret'] : '';

        ?>
        <div class="wrap">
            <h2>ZenParent Locator Settings</h2> 
            <hr>
            <form method="post" action="options.php">
                <?php settings_fields('zenparent_locator'); ?>
                <div class="zenparent-admin-section">
                    <h4>Google MAP API Version 3 settings:</h4>
                    <table class="form-table" cellspacing="0" cellpadding="0">
                        <tr valign="top">
                            <th scope="row">API key:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[google_map_key]" value="<?php echo $googleApiKey; ?>" 
                                       size="50" placeholder="Google Map API key"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Initial Zoom Level:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[google_map_zoom]" value="<?php echo $googleMapZoom; ?>" 
                                       size="50" placeholder="Zoom level, Example: 6"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Initial Latitude:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[google_map_latitude]" value="<?php echo $googleMapLatitude; ?>" 
                                       size="50" placeholder="Latitude"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Initial Longitude:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[google_map_longitude]" value="<?php echo $googleMapLongitude; ?>" 
                                       size="50" placeholder="Longitude"/>
                            </td>
                        </tr>
                    </table>
                    <hr>
                    <h4>FourSquar API Settings:</h4> 
                    <table class="form-table" cellspacing="0" cellpadding="0">
                        <tr valign="top">
                            <th scope="row">Client ID:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[foursquare_api_client_id]" value="<?php echo $fourSquareClientId; ?>" 
                                       size="50" placeholder="FourSquare API Client ID"/>
                            </td>
                        </tr>
                        <tr valign="top">
                            <th scope="row">Client Secret:</th>
                            <td>
                                <input type="text" name="<?php echo self::$optionName?>[foursquare_api_client_secret]" value="<?php echo $fourSquareClientSecret; ?>" 
                                       size="50" placeholder="FourSquare Client Secret"/>
                            </td>
                        </tr>
                    </table>
                </div>
                <p class="submit">
                    <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
                </p>
            </form>
        </div>
        <?php
    }

    /**
    * Function to validate the options page
    *
    * @Arguments: Input
    *
    * @Returns: None
    */
    public static function validateOptions($input) { 
        $valid = array();
        $valid['google_map_key'] = sanitize_text_field($input['google_map_key']);
        $valid['google_map_zoom'] = sanitize_text_field($input['google_map_zoom']);
        $valid['google_map_zoom']  = is_numeric($valid['google_map_zoom']) ? intval($valid['google_map_zoom']) : null;
        $valid['google_map_latitude'] = sanitize_text_field($input['google_map_latitude']);  
        $valid['google_map_latitude'] = is_numeric($valid['google_map_latitude']) ? (double) $valid['google_map_latitude'] : null;
        $valid['google_map_longitude'] = sanitize_text_field($input['google_map_longitude']);
        $valid['google_map_longitude'] = is_numeric($valid['google_map_longitude']) ? (double) $valid['google_map_longitude'] : null;
        $valid['foursquare_api_client_id'] = sanitize_text_field($input['foursquare_api_client_id']);
        $valid['foursquare_api_client_secret'] = sanitize_text_field($input['foursquare_api_client_secret']);

        $hasError = false;

        # Validating google map api key
        if (strlen(trim($valid['google_map_key'])) == 0) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_g_m_error', 
                'Please enter a valid Google Map API key.', 
                'error'
            );
            $hasError = true;
        }
        
        # Validating google map zoom
        if ($valid['google_map_zoom'] <= 0) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_g_z_error', 
                'Please enter a valid Google Map zoom level.', 
                'error'
            );
            $hasError = true;
        }

        # Validating google map latitude
        if (!( $valid['google_map_latitude'] >=-90 and $valid['google_map_latitude'] <= 90)) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_g_l_error', 
                'Please enter a valid Google Map latitude.', 
                'error'
            );
            $hasError = true;
        }

        # Validating google map latitude
        if (!( $valid['google_map_longitude'] >=-180 and $valid['google_map_longitude'] <= 180)) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_g_l_error', 
                'Please enter a valid Google Map longitude.', 
                'error'
            );
            $hasError = true;
        }

        # Validating foursquare client id
        if (strlen(trim($valid['foursquare_api_client_id'])) == 0) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_f_s_error', 
                'Please enter a valid FourSquare client id.', 
                'error'
            );
            $hasError = true;
        }


        # Validating foursquare client name
        if (strlen(trim($valid['foursquare_api_client_id'])) == 0) {
            add_settings_error(
                'zenparent_error', 
                'zenparent_locator_f_i_error', 
                'Please enter a valid FourSquare client secret.', 
                'error'
            );
            $hasError = true;
        }


        return $valid;
    }
}
?>