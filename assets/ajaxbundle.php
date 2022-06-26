<?php
// main class
 class AjaxBundle{

    var $query;

    var $querytags = false;

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

       add_action('pre_get_posts', array( $this, 'tag_relevance_query'));

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

     public function tag_relevance_query($query){
           if( !$query->is_main_query() ){
             //Do something outside the main query
           }
     }

     public function allCombi( $array = array( 'zee', 'plaats', 'werk' ,'land' ) ) {
       $unique = [];
       $copy = $array;
       foreach( $array as $i => $val){
         $unique[$val] = [];
         foreach( $array as $p => $var){
           if( $var != $val){
             $unique[$val][] = $var;
           }
         }
       }
       $combi = [];
       foreach( $unique as $i => $arr){
         $combi[] = array( $i );
         $substr = $arr;
         foreach( $arr as $j => $str){
           //if( $str != $i ){
             $combi[] = array( $i, $str);
           //}
         }
       }
       return $combi;
     }

     public function calculateTagWeight( $itemtags, $selectedtags){
        $count = 0;
        if( !is_array($itemtags)){
          return 99;
        }
        if( !is_array($selectedtags)){
          return 999;
        }
        if( is_array($itemtags) && is_array($selectedtags) ){

          	foreach( $itemtags as $postslug){
              if (in_array($postslug, $selectedtags)){
                $count++;
              }
            }
            return ''.$count.'';
        }else{
          return ''.$count.'';
        }
      }

      public function preparePostsTagweight( $tags, $notcats = false, $notids = false ){

        $preargs = array(
         'post_type'         => 'post',
         'post_status'       => 'publish',
         'orderby'           => 'date',
         'order'             => 'DESC',
         'posts_per_page'    => -1, // all
       );

       if($notids){
         $preargs['post__not_in'] =  $notids;//array(1817,3,1988,1983),
       }
       /*
       if($notcats){
         $tax_query[] = array(
                'taxonomy' => 'category',
                'field'    => 'slug',
                'terms'    => $notcats,
                'operator' => 'NOT IN'
          );
       }
       $preargs['tax_query'] = $tax_query;
       */

       $prequery = new WP_Query( $preargs );
       if ( $prequery->have_posts() ) :
         while ( $prequery->have_posts() ) : $prequery->the_post();
           $pid = get_the_ID();
           $post = get_post($pid);

             $posttags = wp_get_post_terms( $pid, 'post_tag', array("fields" => "slugs"));
             if(is_array($posttags) && count($posttags) > 0){
             $tagweight = $this->calculateTagWeight( $posttags,  $tags );

             $post_metas = get_post_meta( $pid );
             $post_metas = array_combine( array_keys( $post_metas ), array_column( $post_metas, '0' ) );

             update_post_meta( $pid, '_tagweight', $tagweight );
           }else{
             delete_post_meta( $pid, '_tagweight' ); // if no tags found
           }
         endwhile;
       endif;
       wp_reset_query();
       ob_clean(); //wp_die();
       return $prequery;
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
       $notcategory = $data['notcategory'];
       $orderby  = $data['orderby'];
       $order = $data['order'];
       $amount  = $data['ppp'];

       $paged = (isset($paged) || !(empty($paged))) ? $paged : 1;

       $tax_query = array();
       // .. https://wordpress.stackexchange.com/questions/313622/nested-tax-query-that-allows-specified-categories-or-tags-but-not-other-categor
       if( $posttype != 'page' ){

         $tax_query = array('relation' => $relation);

         if (isset($tax1) && isset($terms1) && $terms1 != '' && count($terms1) > 0){
           $tax_query[] =  array(
           'taxonomy' => $tax1,
           'field' => 'slug',
           'terms' => $terms1
           );
         }

         if(isset($tax2) && isset($terms2) && $terms2 != '' && count($terms2) > 0){

            if( $tax2 == 'post_tag'){

            $tax_query[] =  array(
              'taxonomy' => $tax2,
              'field' => 'slug',
              'terms' => $terms2,
              'operator' => 'IN', // AND only shows true relevance
            );
            /*
             $tax_query['reltags'] = array(
               'relation' => 'OR',
               'orderby' => 'tagweight',
             );

             $tagcombi = $this->allCombi($terms2);

             // count down slugs array
             foreach($tagcombi as $tags){
                 $tax_query['reltags'][] = array(
                   'taxonomy' => 'post_tag',
                   'field' => 'slug',
                   'terms' => $tags,
                   'operator' => 'AND',
                 );
             }*/

         }else{
           $tax_query[] =  array(
             'taxonomy' => $tax2,
             'field' => 'slug',
             'terms' => $terms2,
             'operator' => 'IN'
          );

         }


         } // post_tag is filter by tag__


         if(isset($notcategory) && $notcategory != '' && count($notcategory) > 0 ){

           $tax_query[] = array(
                  'taxonomy' => 'category',
                  'field'    => 'slug',
                  'terms'    => $notcategory,
                  'operator' => 'NOT IN'
            );
         }
       }

       // complete query args bundle
       $get_post_args = array(
         'post_type'        => $posttype,   // post type
         'post__not_in'     => $notinpostid,// not these post ids
         'status'           => 'published', // only published visible
         'posts_per_page'   => $amount,     // amount of post each request(page)
         'orderby'          => $orderby,    // 'menu_order', // date
         //'meta_key'         => 'tagweight',
         //'orderby'          => 'meta_value_num',
         'order'            => $order,
         'suppress_filters' => false,       // remove plugin ordenings (?)
         'paged'            => $paged,      // loaded requests (pages)
         'ignore_sticky_posts' => 1,
         'tax_query'        => $tax_query,  // taxonomy request variables array,
       );

       // should become tax query

       if($data['tax2'] == 'post_tag' && $data['terms2'] != '' ){

         $prequery = $this->preparePostsTagweight( $data['terms2'], $notcategory, explode(",",$notinpostid) );
         //$get_post_args['orderby'] = 'tagweight';
         $get_post_args['meta_key'] = '_tagweight';
         $get_post_args['orderby'] = 'meta_value_num';
         $get_post_args['order'] = 'DESC';
         //$order_args = array( 'field'=>'slug','orderby'=>'count', 'order'=>'DESC' );
         //$termorder = wp_parse_args( $terms2, $order_args );

         //$get_post_args['relation'] = 'OR';
         //$get_post_args['post_tag'] = $data['terms2'];
         //$get_post_args['tag_slug__in'] = $terms2;
         //$get_post_args['order'] = 'ASC';
         /*
         $chk = new WP_Query( $get_post_args );
         if ( count( $chk->posts() ) < $amount ) {
           wp_reset_query();
           unset( $get_post_args['tag_slug__and'] );
           $get_post_args['tag_slug__in'] = $data['terms2'];
           $get_post_args['orderby'] = 'tag_slug__in';
         }
         */
       }

       //if( $prequery ){
      //   $postdata = $prequery;
      // }else{
         $postdata = new WP_Query( $get_post_args );
      // }
       // ? https://wordpress.stackexchange.com/questions/173949/order-posts-by-tags-count
       // >> https://wordpress.stackexchange.com/questions/326497/how-to-display-related-posts-based-on-number-of-taxonomy-terms-matched

       // run query with requested args
       //$postdata = new WP_Query($get_post_args);
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

            $posttags = wp_get_post_terms( get_the_ID(), 'post_tag', array("fields" => "slugs"));
            if(is_array($posttags) && count($posttags) > 0){
              $tagweight = get_post_meta(get_the_ID(), '_tagweight'); //$this->calculateTagWeight( $posttags,  $data['terms2'] );//get_post_meta($post->id, '_tagweight'),
            }
            if( is_numeric( $tagweight[0] ) ){
              $tagweight = $tagweight[0];
            }

            $result[] = array(
                    'id' => get_the_ID(),
                    'type' => $post->post_type,
                    'link' => get_the_permalink(),
                    'title' => get_the_title(),
                    'slug' => $post->post_name,
                    'tagweight' => $tagweight,
                    'image' => get_the_post_thumbnail( get_the_ID(), 'large'),
                    'imgurl' => wp_get_attachment_url( get_post_thumbnail_id( get_the_ID(), 'large' ) ),
                    'imgorient' => check_image_orientation( get_the_ID() ),
                    'excerpt' => get_the_excerpt(),
                    'content' => $content,
                    'htmlbody' => $htmlbody,
                    'cats' => wp_get_post_terms( get_the_ID(), 'category', array("fields" => "slugs")),
                    'tags' => $posttags,
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
 $ajaxbundle = new AjaxBundle();


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
