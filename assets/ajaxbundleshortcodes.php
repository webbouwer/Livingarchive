<?php
class AjaxBundleShortcodes{

  private $nr = 0;

  public function __construct() {

    add_shortcode('ajaxposts', array( $this, 'ajax_shortcode') );

  }

  // Shortcode function
  public function ajax_shortcode($atts, $content = null) {

    // [wpajaxposts tax1="category" terms1="blog" tax2="post_tag" terms2="planet,earth" ppp="2" button="hidden"]Ajax load test[/wpajaxposts]
    $default = array(
        'id' => '',
        'button' => '',
        'tax1' => '', // {0: 'category'}
        'terms1' => '', // { 0: 'blog'}
        'tax2' => '', // { 0: 'planet',1: 'earth'}
        'terms2' => '', // { 0: 'planet',1: 'earth'}
        'relation' => 'AND',
        'orderby' => '',
        'order' => '',
        'ppp' => '10',
        'load' => '',
    );
    $att = shortcode_atts($default, $atts);
    $content = do_shortcode($content);

    $button = '';
    if($att['button'] != 'hidden'){
      $button = '<div class="wpajaxbundlebutton">'.$content.'</div>';
    }


    $this->nr++;
    if( $att['id'] != '' ){
      $elementid = ' id="'.$att['id'].'"';
    }else{
      $elementid = ' id="wpajaxbundle_'.$this->nr.'"';
    }

    $html = '<div'.$elementid.' class="wpajaxbundle section-inner"'
    .' data-tax1="'.$att['tax1'].'" data-terms1="'.$att['terms1'].'" data-tax2="'.$att['tax2'].'" data-terms2="'.$att['terms2'].'"'
    .' data-relation="'.$att['relation'].'" data-orderby="'.$att['orderby'].'" data-order="'.$att['order'].'"'
    .' data-ppp="'.$att['ppp'].'" data-load="'.$att['load'].'">'
    .'<div class="container"></div>'.$button.'</div>';
    //print_r($att);
    return $html;

  }

}
new AjaxBundleShortcodes();
