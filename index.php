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
    .'<link rel="shortcut icon" href="images/favicon.ico" />'
    // tell devices wich screen size to use by default
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

    // include wp head
    wp_head();

    echo '</head>';
    echo '<body '.$headerbgstyle.' '; body_class(); echo '>';
    ?>
    <div id="pagecontainer" class="site">
    </div>
    <?php
    wp_footer();
    ?>
    <!-- Global site tag -->
    <script>
    jQuery(function($) {
    });
    </script>
    <?php
    echo '</body></html>';
    ?>
