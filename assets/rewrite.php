<?php

// https://developer.wordpress.org/reference/functions/add_rewrite_rule/
// https://stackoverflow.com/questions/30712428/wordpress-rewrite-rules-with-multiple-parameters
add_action( 'init',  function() {

    // without /[],[],[]/ :: add_rewrite_rule( 'tags/([a-z0-9-]+)[/]?$', 'index.php?tags=$matches[1]', 'top' );
    //add_rewrite_rule( '([^/]*)/tags/([^/]*)[/]?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'top' );

    // post-slug/tags/
    add_rewrite_rule( '([^/]*)/tags[/]?$', 'index.php?p=$matches[1]&tags=all', 'top' );
    // post-slug/tag1,tag2,..
    add_rewrite_rule( '([^/]*)/([^/]*)[/]?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'top' );
    // post-slug/tags/tag1,tag2,..
    add_rewrite_rule( '([^/]*)/tags/([^/]*)[/]?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'top' );
    // tags/
    add_rewrite_rule( 'tags[/]?$', 'index.php?tags=all', 'top' );
    // tags/tag1,tag2,..
    add_rewrite_rule( 'tags/([^/]*)[/]?$', 'index.php?tags=$matches[1]', 'top' );

    add_rewrite_rule( 'cats[/]?$', 'index.php?tags=all', 'top' );
    add_rewrite_rule( 'cats/tags[/]?$', 'index.php?tags=all', 'top' );
    add_rewrite_rule( 'cats/tags/([^/]*)[/]?$', 'index.php?tags=$matches[1]', 'top' );
    add_rewrite_rule( 'cats/([^/]*)[/]tags[/]?$', 'index.php?cats=$matches[1]&tags=all', 'top' );
    add_rewrite_rule( 'cats/([^/]*)[/]([^/]*)[/]?$', 'index.php?cats=$matches[1]&tags=$matches[2]', 'top' );
    add_rewrite_rule( 'cats/([^/]*)[/]?$', 'index.php?cats=$matches[1]&tags=all', 'top' );

    add_rewrite_rule( 'cats/([^/]*)/tags/([^/]*)?$','index.php?cats=$matches[1]&tags=$matches[2]','top');

    add_rewrite_tag('%cats%', '([^&]+)');
    add_rewrite_tag('%tags%', '([^&]+)');
 
});

add_filter( 'query_vars', function( $query_vars ) {
    $query_vars[] = 'cats';
    $query_vars[] = 'tags';
    return $query_vars;
} );

add_action( 'template_include', function( $template ) {

    if ( is_home() || is_front_page() ){
      return get_template_directory() . '/collection.php';
    }
    if ( is_single() || is_page() ){
      return get_template_directory() . '/collection.php';
    }
    if ( get_query_var( 'tags' )  ) {
        return get_template_directory() . '/collection.php';
    }
    if ( get_query_var( 'cats' ) && get_query_var( 'tags' ) ) {
        return get_template_directory() . '/collection.php';
    }

    return $template;
});


function getCurrentPost()
{
  global $post; // the current page/post data
  $pagetags = false;
  if( is_single() ){
    $pagetags = get_the_tags ( $post->ID );
  }
  // ..
}

function getCurrentUrl()
{
    global $wp; //print_r($wp->query_vars);
    return home_url(add_query_arg(array() , $wp->request));
}
