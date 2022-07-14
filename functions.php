<?php
require_once ('assets/rewrite.php');
require_once ('assets/truncate.php');
require_once ('assets/collection.php');

require_once( 'customizer.php'); // customizer functions


// register functions
global $post; // the current page/post data
$pagetags = false;
if( is_single() ){
  $pagetags = get_the_tags ( $post->ID );
}

// register options
function theme_post_thumbnails()
{
    add_theme_support('custom-background');
    add_theme_support('custom-header');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'theme_post_thumbnails');

// register menu's
function basic_setup_register_menus()
{
    register_nav_menus(array(
        'top' => __('Top menu', 'la') ,
        'info' => __('Info menu', 'la') ,
        'main' => __('Main menu', 'la') ,
        'side' => __('Side menu', 'la') ,
        'bottom' => __('Bottom menu', 'la')
    ));

}
add_action('init', 'basic_setup_register_menus');

// frontend
function theme_scripts()
{
    wp_enqueue_script('jquery');
}
add_action('wp_enqueue_scripts', 'theme_scripts');

// Category metabox Hierarchy
function wp_terms_checklist_args($args, $post_id)
{
    $args['checked_ontop'] = false;
    return $args;
}
add_filter('wp_terms_checklist_args', 'wp_terms_checklist_args', 1, 2);


function show_template() {
    global $template;
    return basename($template);
}

/**
 * Date display in tweet('time ago') format
 */
function wp_time_ago( $t ) {
	// https://codex.wordpress.org/Function_Reference/human_time_diff
	//get_the_time( 'U' )
	printf( _x( '%s ago', '%s = human-readable time difference', 'onepiece' ), human_time_diff( $t, current_time( 'timestamp' ) ) );

}

// image orient
function check_image_orientation($pid){
	$orient = 'landscape';
    $image = wp_get_attachment_image_src( get_post_thumbnail_id($pid), '');
    if($image){
        $image_w = $image[1];
        $image_h = $image[2];
        if ($image_w > $image_h) {
            $orient = 'landscape';
        }elseif ($image_w == $image_h) {
            $orient = 'square';
        }else {
            $orient = 'portrait';
        }
    }
    return $orient;
}



// theme html output menu's by name (str or array, default primary)
function wp_main_theme_menu_html($menu, $primary = false){

    if ($menu != '' || is_array($menu)){
        $chk = 0;
        if (is_array($menu)){
            // multi menu
            foreach ($menu as $nm){
              if (has_nav_menu($nm)){
                    echo '<div id="' . $nm . 'menubox"><div id="' . $nm . 'menu" class=""><nav><div class="innerpadding">';
                    wp_nav_menu(array(
                        'theme_location' => $nm
                    ));
                    echo '<div class="clr"></div></div></nav></div></div>';
                    $chk++;
              }
            }
        }else if (has_nav_menu($menu)){
            // single menu
            echo '<div id="' . $menu . 'menubox"><div id="' . $menu . 'menu" class=""><nav><div class="innerpadding">';
            wp_nav_menu(array(
                'theme_location' => $menu,
                'menu_class' => 'nav-menu'
            ));
            echo '<div class="clr"></div></div></nav></div></div>';
            $chk++;
        }
        if ($chk == 0 && $primary){
            // default pages menu
            if (is_customize_preview()){
                echo '<div id="area-default-menu" class="customizer-placeholder">Default menu</div>';
            }
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'nav-menu'
            )); // wp_page_menu();
        }

    }
}

// theme html output toplogo (custom_logo) or site title home link
function wp_main_theme_toplogo_html(){

    if( is_customize_preview() ){
        echo '<div id="area-custom-image" class="customizer-placeholder">Logo image</div>';
    }
    if( get_theme_mod('wp_main_theme_identity_logo', '') != '' ){
        $custom_logo_url = get_theme_mod('wp_main_theme_identity_logo');
        $custom_logo_attr = array(
            'class'    => 'custom-logo',
            'itemprop' => 'logo',
        );
        echo sprintf( '<a href="%1$s" class="custom-logo-link image" rel="home" itemprop="url">%2$s</a>',
        esc_url( home_url( '/' ) ),
        '<img id="toplogo" src="'.$custom_logo_url.'" border="0" />'
        );
    }else if( get_theme_mod('custom_logo', '') != '' ){
        $custom_logo_id = get_theme_mod('custom_logo');
        $custom_logo_attr = array(
            'class'    => 'custom-logo',
            'itemprop' => 'logo',
        );
        echo sprintf( '<a href="%1$s" class="custom-logo-link image" rel="home" itemprop="url">%2$s</a>',
        esc_url( home_url( '/' ) ),
        wp_get_attachment_image( $custom_logo_id, 'full', false, $custom_logo_attr )
        );
    }else{
        echo sprintf( '<a href="%1$s" class="custom-logo-link text" rel="home" itemprop="url"><span>%2$s</span></a>',
        esc_url( home_url( '/' ) ),
        esc_attr( get_bloginfo( 'name', 'display' ) ) //get_bloginfo( 'description' )
        );
    }


    /*
        $custom_logo_url = get_template_directory_uri().'/images/logo2.svg';
        $custom_logo_attr = array(
            'class'    => 'custom-logo',
            'itemprop' => 'logo',
        );
        echo sprintf( '<a href="%1$s" class="custom-logo-link image" rel="home" itemprop="url">%2$s</a>',
        esc_url( home_url( '/' ) ),
        '<img id="toplogo" src="'.$custom_logo_url.'" border="0" />'
        );
    */
}

function wp_mainquery_postdata( ){



    if (have_posts()) :
		while (have_posts()) : the_post();

            echo '<div class="post-container">';

                // post title section
                $title_html = '<a href="'.get_the_permalink().'" target="_self" title="'.get_the_title().'">'.get_the_title().'</a>';

                echo '<div class="post-title">';
                if(is_page()){
                    echo '<h1>'.$title_html.'</h1>';
                }else if( is_single() ){
                    echo '<h1>'.$title_html.'</h1>';
                }else{
                    echo '<h2>'.$title_html.'</h2>';
                }

								//$theme = get_page_template_slug( get_the_ID() );

                echo '</div>';

                // post content section
                $excerpt_length = 24; // char count
                $post = get_post($post->id);
                $fulltext = $post->post_content;//  str_replace( '<!--more-->', '',);
                $content = apply_filters('the_content', $fulltext );

                $excerpt = truncate( $content, $excerpt_length, '', false, true );  // get_the_excerpt()

                $post_tags = get_the_tags();
                $taglist = '';
                if ( $post_tags ) {
                    foreach( $post_tags as $tag ) {
                    $strlist .= $tag->name . ', ';
                    }
                    $strlist = preg_replace('/\s+/', '', $strlist);
                    $taglist = rtrim($strlist,',');
                }

                if(is_page()){

                    echo '<div class="post-content" data-tags="'.$taglist.'">';
                    echo $content;
                    echo '</div>';

                }else if( is_single() ){

                    echo '<div class="post-content" data-tags="'.$taglist.'">';
                    echo $content;
                    echo '</div>';
                    previous_post_link('%link', __('previous', 'resource' ), TRUE);
                    next_post_link('%link', __('next', 'resource' ), TRUE);

                }else{
                    echo '<div class="post-content post-excerpt" data-tags="'.$taglist.'">';
                    echo $excerpt;
                    echo '</div>';
                }

            echo '</div>';

        endwhile;

    else :

      echo '<div class="post-container">';
      echo 'Page not found.';
      echo '</div>';

    endif;
    wp_reset_query();
}

function wp_main_theme_get_all_tags(){

    $args = array(
        'orderby'           => 'name',
        'order'             => 'ASC',
        'hide_empty'        => false,
        'fields'            => 'all',
        'parent'            => 0,
        'hierarchical'      => true,
        'child_of'          => 0,
        'childless'         => false,
        'pad_counts'        => false,
        'cache_domain'      => 'core'
    );

    $taglist = get_terms( 'post_tag', $args );

    usort($taglist, function($a, $b){
        return strcmp($a->name, $b->name);
    });

    return json_encode( $taglist );

    //return json_encode( get_terms( $args ) );
}
function wp_main_theme_get_all_categories(){

    $args = array(
		'order'         => 'DESC'
    );
    return json_encode( get_terms( 'category', $args ) ); //get_categories( array("type"=>"post") )
}
