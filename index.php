<?php
/**
 * Theme main index file
 */
require_once('functions.php');

// the current page/post data
global $post;

// determine header image
$header_image = get_header_image();

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <?php
    if ( ! isset( $content_width ) ) $content_width = 360; // mobile first
    echo
    //'<link rel="canonical" href="'.home_url(add_query_arg(array(),$wp->request)).'">'
    '<link rel="pingback" href="'.get_bloginfo( 'pingback_url' ).'" />'
    .'<meta name="viewport" content="initial-scale=1.0, width=device-width" />'
    .'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
    .'<meta name="robots" content="index,follow">'."\r\n"
    .'<title>'.get_bloginfo( 'name' ).'</title>'."\r\n"
    .'<meta name="description" content="'.get_bloginfo( 'description' ).'">'."\r\n"
    .'<meta name="author" content="Zee plaats werk land">'."\r\n";

    echo '<meta name="keywords" content="zee-plaats-werk-land, delta werken, design, zee, delta, plaats, werk, land, research, map, source, urban, re-cycle, design award, ontwerp, ontwerpen, residual, reflect, strategy, empatic, field, mapping, ontwerppraktijk, resource-platform, platform, material, practice, process, Ester van de Wiel, Joost Adriaanse, info, theory, praktijk, flow, reframe, re-frame, onderzoeksproject, education, Biotopische slibfabriek, papierbeheer, groene intocht, publiek depot, tijdsteen, steentijd, stadshovenier, dutch design award, dutch design, dda, re-duce, re-manufacture, re-order, re-pair, re-purpose, re-shape, re-tell, recycle, ontwerpers, We-Are-Amp, Tim Heijmans, Moniek Ellen, Oddsized, Webdesign Den Haag, Carl Muller, Design Academy Eindhoven, lectoraat Places and Traces, Vrije Universiteit Amsterdam, Design Cultures, Faculty of Humanities, Gemeente Rotterdam, NWO, NWO+SIA smart culture">'."\r\n";

    // more info for og api's
    echo '<meta property="og:title" content="' . get_the_title() . '"/>'
        .'<meta property="og:type" content="website"/>'
		.'<meta property="og:url" content="' . get_permalink() . '"/>'
		.'<meta property="og:site_name" content="'.esc_attr( get_bloginfo( 'name', 'display' ) ).'"/>'
		.'<meta property="og:description" content="'.get_bloginfo( 'description' ).'"/>';
    $default_image = 'https://avatars3.githubusercontent.com/u/36711733?s=400&u=222c42bbcb09f7639b152cabbe1091b640e78ff2&v=4';
    if( !has_post_thumbnail( $post->ID )) { //the post does not have featured image, use a default image
        if( !empty($header_image) ){
            $default_image = get_header_image();
        }else{
            $default_image = get_theme_mod( 'wp_main_theme_identity_logo', $default_image );
        }
    }else{
        $thumbnail_src = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'medium' );
        $default_image = esc_attr( $thumbnail_src[0] );
    }
    echo '<meta property="og:image" content="' . $default_image . '"/>';

    $stylesheet = get_template_directory_uri().'/style.css';
    echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$stylesheet.'" type="text/css" media="all" />';
    //if( is_front_page() ){
      $customstyles = get_template_directory_uri().'/assets/grid.css';
      echo '<link rel="stylesheet" id="wp-theme-main-style"  href="'.$customstyles.'" type="text/css" media="all" />';
    //}
    // include wp head
    wp_head();
    echo '</head>';
    echo '<body '.$headerbgstyle.' '; body_class(); echo '>';
    ?>

    <div id="maincontainer" class="site">

      <div id="header">

        <?php //if( is_front_page() ){ ?>
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
      			</div>

      	</div>
        <?php //} ?>

      </div>

      <div id="mainbody">
      <?php
        $tags_selected = false;
        if( is_front_page() ){
          $tags_selected = array('zee','plaats','werk','land');
        }else{
          if( is_single() ){

            // get post tags
            $tags = wp_get_post_terms( get_the_ID(), 'post_tag', array("fields" => "slugs"));
            $cats = wp_get_post_terms( get_the_ID(), 'category', array("fields" => "slugs"));

            $tags_selected = array();
            foreach($tags as $tag){
                $tags_selected[] = $tag;
            }

          }else if( is_page() ){

            // get page tags / parent..
            $tags = wp_get_post_terms( get_the_ID(), 'post_tag', array("fields" => "slugs"));
            $cats = wp_get_post_terms( get_the_ID(), 'category', array("fields" => "slugs"));

            $tags_selected = array();
            foreach($tags as $tag){
                $tags_selected[] = $tag;
            }

          }else if( is_tag() ){

            // get post tags
            $tag_id = get_queried_object()->term_id;
            $tag_slug = get_queried_object()->slug;

            $tags_selected = array($tag_slug);

          }else if(is_category()){

            $cat_id = get_queried_object()->term_id;
            $cat_slug = get_queried_object()->slug;

          }
        }
        // default loop
        //wp_default_postdata();
        // grid with selected tags (from post or tag selected)
    

        theme_display_postgrid( $tags_selected );

      ?>
      </div>

    </div>
    <?php
    wp_footer();

    echo '</body></html>';
    ?>
