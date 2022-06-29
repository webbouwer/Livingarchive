<?php
/**
 * Theme main index file
 */
require_once ('functions.php');

global $wp; //print_r($wp->query_vars);

get_header();
?>
<div id="maincontainer" class="site">
  <h1>collection</h1>
  <?php 


  echo getCurrentUrl();

  echo '<hr />';
  print_r($wp->query_vars);


  //wp_main_theme_menu_html('info', false);
  wp_mainquery_postdata();
?>
</div>
<?php get_footer(); ?>
