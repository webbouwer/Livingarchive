<?php
/**
 * Theme main index file
 */
require_once ('functions.php');

global $wp; //print_r($wp->query_vars);

get_header();

$q = $wp->query_vars;

$tgs = '';
$cts = '';

if( isset( $q['cats'] ) ){
    $cts = $q['cats'];
}
if( isset( $q['p'] ) && $q['p'] == 'cats'){
    $cts = $q['tags'];
}else{
  if( isset( $q['tags'] ) || $q['p'] == 'tags'){
    $tgs = $q['tags'];
  }
}
$pageid = '';
if( is_single() || is_page() ){
  $pageid = get_the_ID();
}
echo '<div id="developerbox">page: '.json_encode( $q ).'<br /><div class="query"></div></div>';

echo '<div id="maincontainer" class="site" data-item="'.$pageid.'" data-tags="'.$tgs.'" data-cats="'.$cts.'">';

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

					<div id="infomenutoggle">
					 menu
					</div>

					<div id="logo">
            <!-- <div class="logoanimated"></div> -->
						<?php wp_main_theme_toplogo_html(); ?>
					</div>

					<div id="rightside">
            <input id="searchbox" class="basic-search" placeholder="Zoek" size="24">
          </div>

          <div id="searchhints">
            <div class="resultcontent"></div>
          </div>

				</div>

			</div>

			<div id="infocontainer">
				<div class="placeholder">
					<div class="contentmenu">
					       <?php wp_main_theme_menu_html( 'main' , true ); ?>
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
					<div class="itemcontainer"></div>
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
      <div class="menucontainer rightmenu">
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
      <div class="menucontainer leftmenu">
			     	<!-- left-menu -->
      </div>
		</div>

	</div>

<?php
echo '</div>'; // maincontainer

get_footer();
?>
