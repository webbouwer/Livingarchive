<?php
/**
 * Theme main index file
 */
require_once ('functions.php');
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<?php
    echo '<title>'.get_bloginfo( 'name' ).'</title>';
    echo '<meta name="description" content="'.get_bloginfo( 'description' ).'">';
    echo '<meta name="keywords" content="zee-plaats-werk-land, delta werken, design, zee, delta, plaats, werk, land, research, map, source, urban, re-cycle, design award, ontwerp, ontwerpen, residual, reflect, strategy, empatic, field, mapping, ontwerppraktijk, resource-platform, platform, material, practice, process, Ester van de Wiel, Joost Adriaanse, info, theory, praktijk, flow, reframe, re-frame, onderzoeksproject, education, Biotopische slibfabriek, papierbeheer, groene intocht, publiek depot, tijdsteen, steentijd, stadshovenier, dutch design award, dutch design, dda, re-duce, re-manufacture, re-order, re-pair, re-purpose, re-shape, re-tell, recycle, ontwerpers, We-Are-Amp, Tim Heijmans, Moniek Ellen, Oddsized, Webdesign Den Haag, Carl Muller, Design Academy Eindhoven, lectoraat Places and Traces, Vrije Universiteit Amsterdam, Design Cultures, Faculty of Humanities, Gemeente Rotterdam, NWO, NWO+SIA smart culture">'."\r\n";

    $stylesheet = get_template_directory_uri().'/style.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$stylesheet.'" type="text/css" media="all" />';

    $isotopecss = get_template_directory_uri().'/assets/isotope.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$isotopecss.'" type="text/css" media="all" />';


    $customstyles = get_template_directory_uri().'/assets/grid.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$customstyles.'" type="text/css" media="all" />';

    wp_head();

        $isotope = get_template_directory_uri().'/assets/isotope.js';
        echo '<script src="'.$isotope.'" type="text/javascript" media="all" /></script>';

        $imagesloaded = get_template_directory_uri().'/assets/imagesloaded.js';
        echo '<script src="'.$imagesloaded.'" type="text/javascript" media="all"></script>';

        $viewscript = get_template_directory_uri().'/assets/view.js';
        echo '<script src="'.$viewscript.'" type="text/javascript" media="all" /></script>';
?>

</head>
<?php
echo '<body '.$headerbgstyle.' '; body_class(); echo '>';
?>
<div id="maincontainer" class="site">
  <div id="header">
    <div id="navbar">
      <div class="outerspace">
  			<div class="togglebox">
  				<div class="menu-icon column">
  					<img src="https://zee-plaats-werk-land.nl/devsite/wp-content/themes/Livingarchive/images/menu.svg" />
  				</div>
  				<div class="logo column">
  					<img src="https://zee-plaats-werk-land.nl/devsite/wp-content/themes/Livingarchive/images/ZPWL_weblogo.gif" />
  				</div>
  				<div class="search column">
  					<input id="searchbox" class="basic-search" placeholder="Zoek" size="24" style="background-color: white;">
  				</div>
  			</div>

        <div id="info-container">
              <?php
              wp_main_theme_menu_html('info', false);
              //wp_default_postdata();
              echo do_shortcode('[ajaxposts id="infocontentbox" posttype="page" notinpostid="3,1817,1983,1988" ppp="8" load="all" button=""]Ajax load test[/ajaxposts]');
              ?>
        </div>

  		</div>
  	</div>
  </div>

  <div id="mainbody">

    <div id="article-container">
          <?php
          //wp_default_postdata();
          echo do_shortcode('[ajaxposts posttype="post" tax1="category" terms1="artikelen" relation="AND" tax2="post_tag" terms2="zee,land,werk,plaats" ppp="25" load="" orderby="post_tag" order="ASC" button=""]Ajax load test[/ajaxposts]');
          ?>
    </div>
    <div id="post-container">
          <?php
          echo do_shortcode('[ajaxposts posttype="post" notcategory="artikelen" relation="AND" tax2="post_tag" terms2="zee,land,werk,plaats" ppp="25" load="" orderby="post_tag" order="ASC" button=""]Ajax load test[/ajaxposts]');
          ?>
    </div>
  </div>
</div>
<?php
    wp_footer();
    echo '</body></html>';
?>
