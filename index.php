<?php
/**
 * Theme main index file
 */
require_once ('functions.php');
get_header();
?>
<div id="maincontainer" class="site">
  Index
  <?php
  //echo getCurrentUrl();


    echo '<hr />';
    print_r($wp->query_vars);

  wp_main_theme_menu_html('info', false);
  wp_mainquery_postdata();
?>
</div>
<?php get_footer(); ?>
