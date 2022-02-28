<?php
/**
 * Template Name: Update Home Page
 * Theme custom start file
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
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="http://gmpg.org/xfn/11">
<!-- Google Tag Manager
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W5CXPXH');</script>
End Google Tag Manager -->

    <?php
    if ( ! isset( $content_width ) ) $content_width = 360; // mobile first


    echo
    //'<link rel="canonical" href="'.home_url(add_query_arg(array(),$wp->request)).'">'
	'<link rel="pingback" href="'.get_bloginfo( 'pingback_url' ).'" />'
	.'<link rel="shortcut icon" href="images/favicon.ico" />'
	// tell devices wich screen size to use by default
	.'<meta name="viewport" content="initial-scale=1.0, width=device-width" />'."\r\n"
	.'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'."\r\n"
    .'<meta name="robots" content="index,follow">'."\r\n"

    .'<title>'.get_bloginfo( 'name' ).'</title>'."\r\n"
    .'<meta name="description" content="'.get_bloginfo( 'description' ).'">'."\r\n"
    .'<meta name="author" content="Zee plaats werk land">'."\r\n"
    .'<meta name="keywords" content="zee-plaats-werk-land, delta werken, design, zee, delta, plaats, werk, land, research, map, source, urban, re-cycle, design award, ontwerp, ontwerpen, residual, reflect, strategy, empatic, field, mapping, ontwerppraktijk, resource-platform, platform, material, practice, process, Ester van de Wiel, Joost Adriaanse, info, theory, praktijk, flow, reframe, re-frame, onderzoeksproject, education, Biotopische slibfabriek, papierbeheer, groene intocht, publiek depot, tijdsteen, steentijd, stadshovenier, dutch design award, dutch design, dda, re-duce, re-manufacture, re-order, re-pair, re-purpose, re-shape, re-tell, recycle, ontwerpers, We-Are-Amp, Tim Heijmans, Moniek Ellen, Oddsized, Webdesign Den Haag, Carl Muller, Design Academy Eindhoven, lectoraat Places and Traces, Vrije Universiteit Amsterdam, Design Cultures, Faculty of Humanities, Gemeente Rotterdam, NWO, NWO+SIA smart culture">'."\r\n";

    // more info for og api's
    echo '<meta property="og:title" content="' . get_the_title() . '"/>'."\r\n"
        .'<meta property="og:type" content="website"/>'."\r\n"
		.'<meta property="og:url" content="' . get_permalink() . '"/>'."\r\n"
		.'<meta property="og:site_name" content="'.esc_attr( get_bloginfo( 'name', 'display' ) ).'"/>'."\r\n"
		.'<meta property="og:description" content="'.get_bloginfo( 'description' ).'"/>'."\r\n";
        if( !has_post_thumbnail( $post->ID )) { //the post does not have featured image, use a default image
            if( !empty($header_image) ){
                $default_image = get_theme_mod( 'wp_main_theme_identity_logo', get_header_image() );
                echo '<meta property="og:image" content="' . $default_image . '"/>';
            }
		}else{
			$thumbnail_src = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'medium' );
			echo '<meta property="og:image" content="' . esc_attr( $thumbnail_src[0] ) . '"/>';
		}

    // include wp head
    wp_head();

    // https://css-tricks.com/perfect-full-page-background-image/
    $bgposition = get_theme_mod('background_position', 'bottom center');
    $bgattacht = get_theme_mod('background_attachment', 'fixed');
    $bgrepeat = get_theme_mod('background_repeat', 'no-repeat');
    $bgsize = get_theme_mod('background_size', 'cover');
    $headerbgstyle = ' style="background-image:url('.esc_url( get_background_image() ).');background-position:'.$bgposition.';background-attachment:'.$bgattacht.';background-size:'.$bgsize.';background-repeat:'.$bgrepeat.';"';



    $isotopestyle = get_template_directory_uri().'/assets/isotope.css';
    echo '<link rel="stylesheet" id="wp-theme-isotope-style"  href="'.$isotopestyle.'" type="text/css" media="all" />';

    $stylesheet = get_template_directory_uri().'/home.css';
    echo '<link rel="stylesheet" id="wp-theme-custom-style"  href="'.$stylesheet.'" type="text/css" media="all" />';

	$nicescroll = get_template_directory_uri().'/assets/jquery.nicescroll.min.js';
    echo '<script type="text/javascript" src="'.$nicescroll.'"></script>';

    $imagesloaded = get_template_directory_uri().'/assets/imagesloaded.js';
    echo '<script type="text/javascript" src="'.$imagesloaded.'"></script>';
    $isotope = get_template_directory_uri().'/assets/isotope.js';
    echo '<script type="text/javascript" src="'.$isotope.'"></script>';
    $javascript = get_template_directory_uri().'/home.js';
    echo '<script type="text/javascript" src="'.$javascript.'"></script>';

    echo '</head>';
    echo '<body '.$headerbgstyle.' '; body_class('startpage'); echo '>';
    ?>

    <!-- Google Tag Manager (noscript)
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5CXPXH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
 End Google Tag Manager (noscript) -->

    <div id="pagecontainer" class="site">

        <div id="topcontentcontainer">
            <div id="topcontentbox">
                <div id="topspace">

                    <div id="topbar">
                        <div class="leftside">
                            <div class="menubutton"><span><img src="<?php echo get_template_directory_uri().'/images/menu.svg'; ?>" /></span></div>
                            <?php wp_main_theme_toplogo_html(); ?>
                        </div>
                        <div class="rightside"><input id="searchbox" class="basic-search" placeholder="Zoek" size="24" /></div>
                        <div class="clr"></div>
                    </div>

                    <div id="topcontent">
                        <div id="infocontainer">
                            <div id="infomenu">

                                <?php wp_main_theme_menu_html( 'main' , true  ); ?>
                                <!--
                                <div class="nav-menu"><ul>
                                <li class="page_item page-item-508"><a href="<?php echo get_permalink(); ?>">Wat</a></li>
                                <li class="page_item page-item-812"><a href="<?php echo get_permalink(); ?>hoe/">Hoe</a></li>
                                <li class="page_item page-item-2"><a href="<?php echo get_permalink(); ?>wie/">Wie</a></li>
                                <li class="page_item page-item-332"><a href="<?php echo get_permalink(); ?>waar/">Waar</a></li>
                                </ul></div>
                                -->
                            </div>
                            <div id="infocontent">
                                <div class="contentbox"><?php wp_main_theme_loop_html(); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="closebutton"><span>close menu</span></div>

                </div>
            </div>
        </div>
        <div id="leftmenuplaceholder">
        </div>
        <div id="leftmenucontainer">
            <div class="togglebox"><h4>Notities</h4></div>
            <div class="contentbox"></div>
        </div>
        <div id="leftcontentcontainer">
            <div class="topplaceholder"></div>
            <div class="contentbox"></div>

            <div id="contentswitch">
                    <div class="switchbutton"><div class="leftswapbutton"><span>Dialoog en Reflectie</span></div><div class="rightswapbutton"><span>Praktijk- & Veldwerk</span></div></div>
            </div>
        </div>


        <div id="maincontentcontainer">
            <div class="topplaceholder"></div>
            <div class="contentbox"></div>
        </div>

        <div id="rightcontentcontainer">
            <div class="topplaceholder"></div>
            <div class="contentbox"></div>
        </div>
        <div id="rightmenucontainer">
            <div class="topplaceholder"></div>
            <div class="contentbox"></div>
        </div>
        <div id="rightmenuplaceholder">
            <div class="togglebox"><h4>Labels<span class="tagcount"></span></h4></div>
        </div>

      </div>
        <div id="messageOverlay"><div class="overlayContent">
        <?php
            wp_main_theme_widgetarea_html( 'widgets-mobile-layer' );
        ?>
        </div></div>
    <?php
    wp_footer();
    ?>
    <!-- Global site tag (gtag.js) - Google Analytics
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-3063830-64"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-3063830-64');
    </script>
    -->
    <?php
    echo '</body></html>';
?>
