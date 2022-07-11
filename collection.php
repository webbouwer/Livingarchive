<?php
/**
 * Theme main index file
 */
require_once ('functions.php');

global $wp; //print_r($wp->query_vars);

get_header();

$q = $wp->query_vars;
$tgs = '';
if( isset( $q['tags'] ) ){
    $tgs = $q['tags'];
}
$cts = '';
if( isset( $q['cats'] ) ){
    $cts = $q['cats'];
}

echo '<div id="maincontainer" class="site" data-tags="'.$tgs.'" data-cats="'.$cts.'">';

//print_r( $wp->query_vars);
//print_r( getWPPostData() );
//echo getCurrentUrl();
//print_r($wp->query_vars);menu_html('info', false);
//wp_mainquery_postdata();
?>

<div id="toparea">


		<div id="topcontainer">

			<div id="topbar">
				<div class="placeholder">
					<div id="menutoggle">
					 menu
					</div>
					<div id="logo">
						logo
					</div>
					<div id="searchbox">
						search
					</div>
				</div>
			</div>

			<div id="infocontainer">
				<div class="placeholder">
					<div class="contentmenu">
						menu
					</div>
					<div class="contentarea">
						info pages
					</div>
				</div>
			</div>

		</div>


	</div>

	<div id="mainarea">

		<div id="rightcontainer">
			<div class="placeholder">
				<div class="contentarea">
					<div class="itemcontainer">
					<!-- right-content -->
					</div>
				</div>
			</div>
		</div>

		<div id="contentswitch">
				<div class="placeholder">
					switch
				</div>
		</div>

		<div id="leftcontainer">
			<div class="placeholder">
				<div class="contentarea">
					<div class="itemcontainer">
						<!-- left-content -->
					</div>
				</div>
			</div>
		</div>

	</div>

	<div id="rightmenu-toggle" class="togglebox">
			<div class="placeholder">
				right-toggle
			</div>
	</div>

	<div id="rightmenu-container">

		<div class="placeholder">
      <div class="itemcontainer">
        	<!-- right-menu -->	
  			<?php build_tagmenu(); ?>
      </div>
		</div>

	</div>

	<div id="leftmenu-toggle" class="togglebox">
			<div class="placeholder">
				left-toggle
			</div>
	</div>

	<div id="leftmenu-container">

		<div class="placeholder">
      <div class="itemcontainer">
			     	<!-- left-menu -->
      </div>
		</div>

	</div>

<?php
echo '</div>'; // maincontainer
get_footer();
?>
