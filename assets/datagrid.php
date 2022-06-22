<?php // Grid data functions (frontpage)


// grid content
function theme_display_postgrid(){

        $args = array(
            //'tag'               => json_encode($this->tagfilter),
            //'category_name'     => json_encode($this->catfilter),
            'post_type'         => 'any', //'post', //   = incl pages
            'post__not_in'      => array(1817,3,1988,1983), // $this->loadedID, for ajax return requests
            'post_status'       => 'publish',
            'orderby'           => 'date',
            'order'             => 'DESC',      // 'DESC', 'ASC' or 'RAND'
            'posts_per_page'  => -1, //-1,
            //'posts_offset'      => $ppload,
            //'suppress_filters'  => false,
        );
        $query = new WP_Query( $args );
        $response = array('page'=>array(),'article'=>array(),'post'=>array());
        $count = array();

				$articles = 'artikelen';

        if ( $query->have_posts() ) :
            while ( $query->have_posts() ) : $query->the_post();

              // this post
              $pid = $post->id;
              $post = get_post($pid);
              // is post or infomenu page
              //if( $post->post_type === 'post' || page_id_in_menu( 'info', $pid ) ){

                $excerpt_length = 120; // amount of words
                $fulltext = $post->post_content;//  str_replace( '<!--more-->', '',);

                // following is to prevent warning messages from displaying because of the bad HTML
                libxml_use_internal_errors(true);
                $doc = new DOMDocument();
                $doc->loadHTML(mb_convert_encoding($fulltext, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NODEFDTD);
                //$doc->loadHTML( utf8_decode( $fulltext ) );
                $doc->encoding = 'utf-8';
                $doc->normalizeDocument();
                $content = $doc->saveHTML();

                // filtered content
                $content = apply_filters('the_content', $content );
                $excerpt = truncate( $content, $excerpt_length, '', false, true );  // get_the_excerpt()

                // detect needed post types
                $type = 'post';
                if( $post->post_type === 'page' ){
                    $type = 'page';
                }
								if( has_category($articles,$post->id) ){
										$type = 'article';
								}

								$data = array(
                    'id' => get_the_ID(),
                    'type' => $type,
                    'link' => get_the_permalink(),
                    'title' => get_the_title(),
                    'slug' => $post->post_name,
                    'image' => get_the_post_thumbnail( $post->id, 'large'),
                    'imgurl' => wp_get_attachment_url( get_post_thumbnail_id( $post->id, 'large' ) ),
                    'imgorient' => check_image_orientation( $post->id ),
                    'excerpt' => $excerpt,
                    'content' => $content,
                    'cats' => wp_get_post_terms( get_the_ID(), 'category', array("fields" => "slugs")),
                    'tags' => wp_get_post_terms( get_the_ID(), 'post_tag', array("fields" => "slugs")),
                    'date' => get_the_date(),
                    'timestamp' => strtotime(get_the_date()),
                    'author' => get_the_author(),
                    'custom_field_keys' => get_post_custom_keys()
                );

								$catrev = array_reverse($data['cats']);

								$display_tags = gethtmlListTags( $data['tags'] );
								$display_cats = gethtmlListCats( $data['cats'] );

								$filterclasses = '';
								foreach($data['tags'] as $tag){
									$filterclasses .= ' '.$tag;
								}

								$html = '';
								$html .= '<div id="'.$data['type'].'-'.$data['id'].'" data-id="'.$data['id'].'" data-slug="'.$data['slug'].'" class="item '.$data['imgorient'].' '.$filterclasses.'" ';
								$html .= 'data-link="'.$data['link'].'" data-author="'.$data['author'].'" data-timestamp="'.$data['date'].'" data-category="'.$catrev[0].'" ';
								$html .= 'data-tags="'.implode(",", $data['tags']).'" data-cats="'.implode(",", $data['tags']).'">';

								//$html .= ''.$data['excerpt'].'';

								$html .= '<div class="itemcontent"><div class="intro">';

                $html .= '<div class="coverimage">';
								if($data['image'] != ''){
								  	$html .= '<div class="stage '.$data['imgorient'].'" data-url="'.$data['imgurl'].'">'.$data['image'];
								    $html .= '<div class="optionfullscreen button">[]</div>';
								    $html .= '</div>';
								}else if( $data['type'] == 'post' ){
								    $html .= '<div class="mediaplaceholder '.$data['imgurl'].'"><h3>'.$data['title'].'</h3><div class="optionfullscreen button">[]</div></div>';
								}
                //$html .= '<div class="excerpt">'.$data['excerpt'].'</div>';
								$html .= '</div>';


								$html .= '<div class="title">';
								if( $data['type'] == 'page' ){
								  $html .= '<h2>'.$data['title'].'</h2>';
                }else{
								  $html .= '<h3>'.$data['title'].' <span class="matchweight moderate">0</span></h3>';
									$html .= '<div class="author">'.$data['author'].'</div>';
								}
                $html .= '</div>';

								$html .= '<div class="itemcatbox">'.$display_cats.'</div>';
								$html .= '<div class="itemtagbox">'.$display_tags.'</div>';
								//html .= JSON.stringify( obj.tags );

								$html .= '<div class="main"><div class="textbox">'.$data['content'].'</div></div>'; // '.$data['content'].'
								$html .= '</div>';
								$html .= '<div class="infotoggle button"><span>+</span></div>';
								$html .= '</div></div>';

								$data['html'] = $html;

                $response[$type][] = $data;

            //  } // is post or infomenu page

            endwhile;

            // build post sections by type
            foreach( $response as $type => $list ){

              echo '<div id="'.$type.'-container" class="box">';
              if( $type == 'page' ){
                wp_main_theme_menu_html( 'info', false );
              }
            	foreach( $list as $nr => $post ){
            	   echo $post['html'];
            	}
            	echo '</div>';

            }

        else:
           $response[0] = 'No posts found';
        endif;
        wp_reset_query();
        ob_clean();
        //wp_die();
        //return $response;
				//print_r($response);


}


function wp_main_theme_get_all_tags(){

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

    return $taglist; //return json_encode( get_terms( $args ) );
}
function wp_main_theme_get_all_categories(){
    $args = array(
		'order'         => 'DESC'
    );
    return get_terms( 'category', $args ); //get_categories( array("type"=>"post") )
}

function gethtmlListTags( $itemtags ){

		$tags = wp_main_theme_get_all_tags();
		$html = '';
    foreach($tags as $obj){
    	foreach( $itemtags as $postslug){
      	if( $obj->slug == $postslug ){
        	$html .= '<a href="#tags='.$obj->slug.'" class="tagbutton '.$obj->slug.'" data-tag="'.$obj->slug.'">'.$obj->name.'</a> ';
        }
      }
    }
    return $html;
}


function gethtmlListCats( $itemcats ){

	$catlist = wp_main_theme_get_all_categories();
	$html = '';
	foreach( $itemcats as $postcat){
		foreach( $catlist as $obj){
			if( $obj->slug == $postcat &&  $obj->slug != 'artikelen'){
				if( $obj->parent == "2" ){ // person names first
					$html = '<a href="#cats='.$obj->slug.'" class="categoryname catbutton '.$obj->slug.'" data-cats="'.$obj->slug.'">'.$obj->name.'</a> ' . $html;
				}else{
					$html .= '<a href="#cats='.$obj->slug.'" class="categoryname catbutton '.$obj->slug.'" data-cats="'.$obj->slug.'">'.$obj->name.'</a> ';
				}

			}
		}
	}
	return $html;

}



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
