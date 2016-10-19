<?php namespace zenparent;
// ****************************************************
// * File Name: Admin.php                             *
// *                                                  *
// * This file is to handel the admin option page for *
// * zenparent                                        *
// ****************************************************
// * Author: Dinesh Patra <dineshpatra28@gmail.com>   *
// ****************************************************
class Functions{

	public static function display() {
		?>

		<div class="zenparent-locator-wrap">
			<div class="zenparent-locator-current-address-container">
				<form method="post" action="" id="zenparent-locator-form">
					<label>Your current address</label>
					<input type="text" id="zenparent-locator-address-input" placeholder="Address">
					<input type="submit" class="zenparent-locator-btn" id="zenparent-locator-btn" value="Locate">
				</form>
			</div>
			<div class="zp-categories">
			</div>

			<div class="zp-results">
			</div>
			<div class="zenparent-locator-map-container" id="zenparent-locator-map-container">
			</div>
		</div> 
		<?php 
	}
}

?>