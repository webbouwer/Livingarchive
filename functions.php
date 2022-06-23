<?php
require_once ('assets/datagrid.php');
require_once ('assets/truncate.php');

function getCurrentUrl()
{
    global $wp;
    return home_url(add_query_arg(array() , $wp->request));
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
