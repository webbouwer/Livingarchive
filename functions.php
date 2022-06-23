<?php
require_once('assets/truncate.php');
require_once('assets/datagrid.php');

function getCurrentUrl(){
	global $wp;
	return home_url( add_query_arg( array(), $wp->request ) );
}

// register options
function theme_post_thumbnails() {
	add_theme_support( 'custom-background' );
    add_theme_support( 'custom-header' );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'theme_post_thumbnails' );

// register menu's
function basic_setup_register_menus() {
	register_nav_menus(
		array(
		'top' => __( 'Top menu' , 'la' ),
		'info' => __( 'Info menu' , 'la' ),
		'main' => __( 'Main menu' , 'la' ),
		'side' => __( 'Side menu' , 'la' ),
		'bottom' => __( 'Bottom menu' , 'la' )
		)
	);

}
add_action( 'init', 'basic_setup_register_menus' );


// frontend
function theme_scripts() {
  wp_enqueue_script('jquery');
}
add_action('wp_enqueue_scripts', 'theme_scripts');


// Category metabox Hierarchy
function wp_terms_checklist_args( $args, $post_id ) {
   $args[ 'checked_ontop' ] = false;
   return $args;
}
add_filter( 'wp_terms_checklist_args', 'wp_terms_checklist_args', 1, 2 );

// check active widgets
function is_sidebar_active( $sidebar_id ){
    $the_sidebars = wp_get_sidebars_widgets();
    if( !isset( $the_sidebars[$sidebar_id] ) )
        return false;
    else
        return count( $the_sidebars[$sidebar_id] );
}


function wp_default_postdata(){
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
                    echo $content; //$excerpt;
                    echo '</div>';
                }

            echo '</div>';

        endwhile;
    endif;
    wp_reset_query();
}


// theme html output menu's by name (str or array, default primary)
function wp_main_theme_menu_html( $menu, $primary = false ){

    if( $menu != '' || is_array( $menu ) ){
        $chk = 0;
        if( is_array( $menu ) ){

            // multi menu
            foreach( $menu as $nm ){
                if( has_nav_menu( $nm ) ){
                    echo '<div id="'.$nm.'menubox"><div id="'.$nm.'menu" class=""><nav><div class="innerpadding">';
                    wp_nav_menu( array( 'theme_location' => $nm ) );
                    echo '<div class="clr"></div></div></nav></div></div>';
                    $chk++;
                }
            }

        }else if( has_nav_menu( $menu ) ){

            // single menu
            echo '<div id="'.$menu.'menubox"><div id="'.$menu.'menu" class=""><nav><div class="innerpadding">';
            wp_nav_menu( array( 'theme_location' => $menu , 'menu_class' => 'nav-menu' ) );
            echo '<div class="clr"></div></div></nav></div></div>';
            $chk++;

        }

        if( $chk == 0 && $primary ){

            // default pages menu
            if( is_customize_preview() ){
            echo '<div id="area-default-menu" class="customizer-placeholder">Default menu</div>';
            }
            wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'nav-menu' ) ); // wp_page_menu();

        }

    }
}
