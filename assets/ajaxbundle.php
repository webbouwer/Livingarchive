<?php
// main class
 class AjaxBundle{

    var $query;

    public function __construct() {

       // add if statements accoording to view types (if is_single etc.)
       // Enqueue the wp ajax php scripts
       add_action('wp_enqueue_scripts', array( $this, 'getPostData_localize_ajax') );
       add_action( 'wp_enqueue_scripts', array( $this, 'getPostData_ajax_script' ) );
       // Enqueue the wp ajax script on the back end (wp-admin)
       add_action( 'admin_enqueue_scripts', array( $this, 'getPostData_ajax_script' ) );
       // assign php function for ajax request (bind the nonce)
       add_action('wp_ajax_getWPPostData', array( $this, 'getWPPostData') );
       add_action('wp_ajax_nopriv_getWPPostData', array( $this, 'getWPPostData') );

     }

     public function getPostData_localize_ajax(){
       // secure with unique id (nonce)
       wp_localize_script('jquery', 'ajax', array(
       'url' => admin_url('admin-ajax.php'),
       'nonce' => wp_create_nonce('getPostData_nonce'),
       ));
     }

     public function getPostData_ajax_script(){
       // secure with local script file assigned
       wp_enqueue_script( 'ajax-script', get_template_directory_uri().'/assets/post_ajax.js', array( 'jquery' ), null, true );
       wp_localize_script( 'ajax-script', 'ajax_data', array(
       'ajaxurl' => admin_url( 'admin-ajax.php' ),
       ) );
     }

     public function getWPPostData(){

       // verify nonce
       if( !wp_verify_nonce($_POST['nonce'], 'getPostData_nonce') ){
          die('Permission Denied.');
       }

       $data = $_POST['data'];

       // collect data from post request
       $paged  = $data['page'];
       $posttype  = $data['posttype'];
       $notinpostid  = $data['notinpostid'];
       $relation = $data['relation'];
       $tax1 = $data['tax1'];          // category array..
       $terms1  = $data['terms1'];     // slugs array..
       $tax2 = $data['tax2'];          // category array..
       $terms2  = $data['terms2'];      //$_POST['data']['slug']; // slugs array..
       $orderby  = $data['orderby'];
       $order = $data['order'];
       $amount  = $data['ppp'];

       $paged = (isset($paged) || !(empty($paged))) ? $paged : 1;

       // .. https://wordpress.stackexchange.com/questions/313622/nested-tax-query-that-allows-specified-categories-or-tags-but-not-other-categor

       $tax_query = array('relation' => $relation);
       if (isset($tax1) && isset($terms1) && $terms1 != '' && count($terms1) > 0){
         $tax_query[] =  array(
         'taxonomy' => $tax1,
         'field' => 'slug',
         'terms' => $terms1
         );
       }
       if(isset($tax2) && isset($terms2) && $terms2 != '' && count($terms2) > 0){
         $tax_query[] =  array(
           'taxonomy' => $tax2,
           'field' => 'slug',
           'terms' => $terms2
         );
       }
       /* related to post
       if( $tax2 == 'post_tag' ){
         $custom_taxterms = wp_get_object_terms($post->ID, 'post_tag', array('fields' => 'slugs'));
         $tax_query[] = array(
            'taxonomy' => 'post_tag',
            'field' => 'slug',
            'terms' => $custom_taxterms
          );
        }
        */

       // complete query args bundle
       $get_post_args = array(
         'post_type'        => $posttype,   // post type
         'post__not_in'     => $notinpostid, // not these post ids
         'status'           => 'published', // only published visible
         'posts_per_page'   => $amount,     // amount of post each request(page)
         'orderby'          => $orderby,    // 'menu_order', // date
         'order'            => $order,      //'ASC', // desc
         'suppress_filters' => false,        // remove plugin ordenings (?)
         'paged'            => $paged,      // loaded requests (pages)
         'tax_query'        => $tax_query   // taxonomy request variables array
       );

       //   'post__not_in'  skip previous loaded items
       $query = $get_post_args;

       // ? https://wordpress.stackexchange.com/questions/173949/order-posts-by-tags-count
       // >> https://wordpress.stackexchange.com/questions/326497/how-to-display-related-posts-based-on-number-of-taxonomy-terms-matched

       // run query with requested args
       $postdata = new WP_Query($query);
       $result = [];

       // check and bundle needed postdata returned
       if($postdata->have_posts()) :
         while($postdata->have_posts()) : $postdata->the_post();

            $post = get_post( get_the_ID() );
            $fulltext = $post->post_content; // str_replace( '<!--more-->', '',);

            libxml_use_internal_errors(true); // use this to prevent warning messages from displaying because of the bad HTML
            $doc = new DOMDocument();
            $doc->loadHTML(mb_convert_encoding($fulltext, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NODEFDTD);
            //$doc->loadHTML( utf8_decode( $fulltext ) );
            $doc->encoding = 'utf-8';
            $doc->normalizeDocument();
            $content = $doc->saveHTML();

            $htmlbody = apply_filters('the_content', $content );
            $content = apply_filters('the_content', $fulltext );


            $result[] = array(
                    'id' => get_the_ID(),
                    'type' => $post->post_type,
                    'link' => get_the_permalink(),
                    'title' => get_the_title(),
                    'slug' => $post->post_name,

                    'image' => get_the_post_thumbnail( $post->id, 'large'),
                    'imgurl' => wp_get_attachment_url( get_post_thumbnail_id( $post->id, 'large' ) ),
                    'imgorient' => check_image_orientation( $post->id ),
                    'excerpt' => get_the_excerpt(),
                    'content' => $content,
                    'htmlbody' => $htmlbody,
                    'cats' => wp_get_post_terms( get_the_ID(), 'category', array("fields" => "slugs")),
                    'tags' => wp_get_post_terms( get_the_ID(), 'post_tag', array("fields" => "slugs")),
                    'date' => get_the_date(),
                    'timestamp' => strtotime(get_the_date()),
                    'author' => get_the_author(),
                    'custom_field_keys' => get_post_custom_keys()

                );

         endwhile;
       endif;

       header('Content-Type: application/json');
       print json_encode($result);

       wp_reset_query();
       wp_die();

     }

 }
 new AjaxBundle();


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
