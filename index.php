<?php
/**
 * Theme main index file
 */
require_once ('functions.php');
get_header();
?>
<div id="maincontainer" class="site">
    <div id="topcontainer">

      <?php
          wp_main_theme_menu_html('info', false);
      ?>

    </div>
    <?php
    //echo getCurrentUrl();

    echo '<h1>'.get_the_title().'</h1>';
    echo '<hr />';
    print_r($wp->query_vars);

    wp_mainquery_postdata();
    ?>


    <div id="bottomcontainer">
    </div>
</div>
<?php get_footer(); ?>
