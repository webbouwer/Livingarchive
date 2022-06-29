<?php

// https://developer.wordpress.org/reference/functions/add_rewrite_rule/
// https://stackoverflow.com/questions/30712428/wordpress-rewrite-rules-with-multiple-parameters
add_action( 'init',  function() {

    // without /[],[],[]/ :: add_rewrite_rule( 'tags/([a-z0-9-]+)[/]?$', 'index.php?tags=$matches[1]', 'top' );
    // postslug/tags/zee,land/
    //add_rewrite_rule( '([^/]*)/tags/([^/]*)[/]?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'top' );

    /*
    add_rewrite_rule( 'tags[/]?$', 'index.php?tags=all', 'top' );
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

    add_rewrite_rule( '([^/]*)/([^/]*)?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'top' );
    add_rewrite_rule( '([^/]*)/tags[/]?$', 'index.php?p=$matches[1]&tags=all', 'bottom' );
    add_rewrite_rule( '([^/]*)/tags[/]([^/]*)[/]?$', 'index.php?p=$matches[1]&tags=$matches[2]', 'bottom' );
    */


    add_rewrite_rule( 'tags[/]?$', 'index.php?tags=all', 'top' );
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
    if ( get_query_var( 'tags' ) == false || get_query_var( 'tags' ) == '' ) {
        return $template;
    }
    if ( get_query_var( 'cats' ) && get_query_var( 'tags' ) == false ) {
        return $template;
    }

    return get_template_directory() . '/collection.php';
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
    global $wp; //rint_r($wp->query_vars);
    return home_url(add_query_arg(array() , $wp->request));
}
