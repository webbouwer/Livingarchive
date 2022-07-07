<?php
function getWPPostData(){

  $get_post_args = array(
    'post_type'        => 'post',   // post type
    'status'           => 'published', // only published visible
    'posts_per_page'   => -1,     // amount of post each request(page)
  );

  $postdata = new WP_Query( $get_post_args );

  $result = [];
  //print_r($postdata);
  if($postdata->have_posts()) :
    while($postdata->have_posts()) : $postdata->the_post();

       $pid = get_the_ID();
       $post = get_post( $pid );

       $result[] = array(
         'id' => $pid,
         'link' => get_the_permalink(),
         'title' => get_the_title(),
         'cats' => wp_get_post_terms( $pid, 'category', array("fields" => "slugs")),
         'tags' => wp_get_post_terms( $pid, 'post_tag', array("fields" => "slugs")),
       );

     endwhile;
   endif;
   wp_reset_query();
   return $result;
}
/*
function getWPPostData(){

    global $wp;

       // complete query args bundle
       $get_post_args = array(
         'post_type'        => 'post',   // post type
         'status'           => 'published', // only published visible
         'posts_per_page'   => -1,     // amount of post each request(page)
       );


       $postdata = new WP_Query( $get_post_args );
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

       //header('Content-Type: application/json');
       //print json_encode($result);

       print_r($result);

       wp_reset_query();
       //wp_die();


     }

 }
 */
