<?php
function getWPPostData(){

  $theoryCategory = 'artikelen';
  $parentCategory = 'reststromen';
  $overviewCategory = 'bulletin';

  $get_post_args = array(
    //'post_type'        => 'post',   // post type
    'post_type'         => 'any',
    'status'           => 'published', // only published visible
    'posts_per_page'   => -1,     // -1 = all ..amount of post each request(page)
  );

  $postdata = new WP_Query( $get_post_args );

  $result = [];
  $count = 0;
  //print_r($postdata);
  if($postdata->have_posts()) :
    while($postdata->have_posts()) : $postdata->the_post();

      $group = 0;

      $pid = get_the_ID();
      $post = get_post( $pid );
      $type = $post->post_type;
      $slug = $post->post_name;
      $link = get_the_permalink();
      $author = get_the_author();
      $timestamp = strtotime(get_the_date());

      $title = get_the_title();

      $fulltext = $post->post_content;
      $excerpt_length = 120; // words
      libxml_use_internal_errors(true); //use this to prevent warning messages from displaying because of the bad HTML
      $doc = new DOMDocument();
      $doc->loadHTML(mb_convert_encoding($fulltext, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NODEFDTD);
      //$doc->loadHTML( utf8_decode( $fulltext ) );
      $doc->encoding = 'utf-8';
      $doc->normalizeDocument();
      $content = $doc->saveHTML();
      $htmlbody = apply_filters('the_content', $content );
      $content = apply_filters('the_content', $fulltext );
      $excerpt = truncate( $content, $excerpt_length, '', false, true );  // get_the_excerpt()

      $featuredimage = get_the_post_thumbnail( $post->id, 'large');
      $imageurl = wp_get_attachment_url( get_post_thumbnail_id( $post->id, 'large' ) );
      $imgorient = check_image_orientation( $pid );

      $postcats = wp_get_post_terms( $pid, 'category', array("fields" => "slugs"));
      $posttags = wp_get_post_terms( $pid, 'post_tag', array("fields" => "slugs"));

      // list tags to links
      $objfilterclasses = '';
      $catlist = '';
      $taglist = '';

      foreach( $posttags as $tag){
        $taglist .= '<a href="'.site_url().'/tags/'.$tag.'" class="tagbutton '.$tag.'" data-tag="'.$tag.'">'.$tag.'</a> ';
        $objfilterclasses .= ' '.$tag;
      }

      foreach( $postcats as $cat){
        if( $cat == $theoryCategory ){
          $group = 1; // left content
          $objfilterclasses .= ' menubutton';
        }else if( $cat == $overviewCategory ){
          $group = 2; // start content
          $objfilterclasses .= ' overviewcontent';
        }else{
          $objfilterclasses .= ' '.$cat;
        }

        if( $cat != $overviewCategory && $cat != $theoryCategory ){
          $catlist .= '<a href="'.site_url().'/cats/'.$cat.'" class="categoryname catbutton '.$cat.'" data-cats="'.$cat.'">'.$cat.'</a> ';
        }
      }
      $catsreversedlist = array_reverse($postcats);

      if($count == 0){
        $objfilterclasses .= ' base';
      }

      if( $type == 'page' ){
        $group = 3; // info page content
        $objfilterclasses .= ' contentpage';
      }

      $output = '';
      $output .= '<div id="'.$type.'-'.$pid.'" data-id="'.$pid.'" data-slug="'.$slug.'" class="item '.$imgorient.' '.$objfilterclasses.'" ';
      $output .= 'data-link="'.$link .'" data-author="'.$author.'" data-timestamp="'.$timestamp.'" data-category="'.$catsreversedlist[0].'" ';
      $output .= 'data-tags="'.implode(',',$posttags).'" data-cats="'.implode(',',$postcats).'">';
      $output .= '<div class="itemcontent"><div class="intro">';

      $output .= '<div class="coverimage">';
      if( isset($featuredimage) ){
        $output .= '<div class="stage '.$imgorient.'" data-url="'.$imageurl.'">'.$featuredimage;
        $output .= '<div class="optionfullscreen button">[]</div>';
        $output .= '</div>';
      }else if( $type == 'post' ){
        $output .= '<div class="mediaplaceholder '.$imgorient.'"><h3>'.$title.'</h3><div class="optionfullscreen button">[]</div></div>';
      } //html += '<div class="excerpt">'+obj.excerpt+'</div>';
      $output .= '</div>';

      if( $type != 'page' ){
        $output .= '<div class="title">';
        $output .= '<h3><a href="'.$link.'">'.$title.' <span class="countbox">[<span class="matchweight moderate">0</span>]</span></a></h3>';
        //$output .= '<div class="author">'.$author.'</div>';
        $output .= '</div></div>';
      }

      $output .= '<div class="itemcatbox">'.$catlist.'</div><div class="itemtagbox">'.$taglist.'</div>';
      //$output .= '<div class="main"><div class="textbox">'.$content.'</div></div>'; // '.$content.'
      $output .= '<div class="main"><div class="textbox"></div></div>';
      $output .= '</div>';
      $output .= '<div class="infotoggle button"><span>+</span></div>';
      $output .= '</div>';

      $result[] = array(

        'id' => $pid,
        'group' => $group,
        'link' => $link,
        'slug' => $slug,
        'title' => $title,
        'cats' => $postcats,
        'tags' => $posttags,
        'image' => $featuredimage,
        'imgurl' => $imageurl,
        'imgorient' => $imgorient,
        'excerpt' => get_the_excerpt(),
        'content' => $content,
        'htmlbody' => $htmlbody,

        'date' => get_the_date(),
        'timestamp' => $timestamp,
        'author' => get_the_author(),
        'custom_field_keys' => get_post_custom_keys(),

        'output' => $output,
      );

      $count++;

     endwhile;
   endif;
   wp_reset_query();
   return $result;
}

function build_tagmenu(){

    $args = array(
        'orderby'           => 'name',
        'order'             => 'ASC',
        'hide_empty'        => false,
        'fields'            => 'all',
        'parent'            => 0,
        'hierarchical'      => true,
        'child_of'          => 0,
        'childless'         => false,
        'pad_counts'        => false,
        'cache_domain'      => 'core'
    );

    $taglist = get_terms( 'post_tag', $args );

    usort($taglist, function($a, $b){
        return strcmp($a->name, $b->name);
    });

    $html = '<div id="tagmenu"></div>';

    foreach($taglist as $tag){
       $html .= '<a href="'.site_url().'/tags/'.$tag->slug.'" class="tagbutton '.$tag->slug.'" data-tag="'.$tag->slug.'">#'.$tag->name.'</a>';
    }
    echo $html;
    //return json_encode( $taglist );

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
