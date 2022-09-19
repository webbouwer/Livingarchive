<?php
/**
 * Theme main index file
 */
require_once ('functions.php');

get_header();

global $wp; //print_r($wp->query_vars);
$q = $wp->query_vars;
$tgs = '';
$cts = '';
$pageid = '';



    $tgs = '';
    $cts = '';

    if( isset( $q['cats'] ) ){
      $cts = $q['cats'];
    }
    if( isset( $q['tags'] ) ){
      $tgs = $q['tags'];
    }

    if( isset( $q['p'] ) && $q['p'] == 'cats'){
        $cts = $q['tags'];
    }else{
      if( isset( $q['tags'] ) || $q['p'] == 'tags'){
        $tgs = $q['tags'];
      }
    }

  if (have_posts()) :
    while (have_posts()) : the_post();

      if( is_single() || is_page() ){
        $pageid = get_the_ID();
      }

    endwhile;
  endif;
  wp_reset_query();




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
					 <span>menu</span>
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

      <!-- <div class="closebutton active"><span>close menu</span></div> -->

			<div id="infocontainer">
				<div class="placeholder">
					<div class="contentmenu">
					       <?php wp_main_theme_menu_html( 'main' , true ); ?>
					</div>
					<div class="contentarea">
						<!-- info pages -->
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

          <div class="switchbutton">
            <div class="leftswapbutton"><span>Dialoog en Reflectie</span></div>
            <div class="rightswapbutton"><span>Praktijk- &amp; Veldwerk</span></div>
          </div>

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
				labels
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
				notities
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
