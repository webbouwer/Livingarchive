
jQuery( function($) {

var navigate = function(){

  var root = this;
  var mobile = false;
  var tagfilter = [];
  var selectedCat = '';
  var classfilter = '';

  var defaulttags = 'zee,plaats,werk,land';
  var previoustags = defaulttags;

  var infocontainer;
  var rightcontainer;
  var leftcontainer;
  var leftmenu;
  var rightmenu;
  var tagmenu;

  this.construct = function(){

    this.rightcontainer = $('#rightcontainer .itemcontainer');
    this.rightmenu = $('#rightmenu-container .itemcontainer');
    this.tagmenu = $('#rightmenu-container #tagmenu');

    this.setLeftMenu();

    let selectedTags = $('#maincontainer').data('tags');
    let selectedCats = $('#maincontainer').data('cats');

    if( selectedTags == '' ){
      selectedTags = 'zee,plaats,werk,land'
      $('#maincontainer').attr('data-tags', selectedTags);
    }
    this.tagfilter = selectedTags.split(',');
    $.each(this.tagfilter, function( n, tag ){
      $('.tagbutton.'+tag).addClass('selected');
    });
    if( selectedCats != ''){
      this.catfilter = selectedCats.split(',')
      $.each(this.catfilter, function( n, cat ){
        $('.catbutton.'+cat).addClass('selected');
      });
    }

    root.rightmenu.find('.tagbutton.selected').clone().appendTo( root.tagmenu );

    console.log(JSON.stringify( postdata) );
    console.log(JSON.stringify(this.tagfilter));
    console.log(JSON.stringify(this.catfilter));

  };

  this.setLeftMenu = function(){
    // check swap responsive
    if( $(window).width() < 960  ){
      this.leftmenu = $('#leftcontainer .leftmenu');
    }else{
      this.leftmenu = $('#leftmenu-container .itemcontainer');
    }
  }

  this.tagSelect = function(){

    let taglist = '';
    root.previoustags = root.tagfilter;
    root.tagfilter  = [];
    root.tagmenu.html('');

    $.each( root.rightmenu.find('.tagbutton.selected'), function(){
      let tag = $(this).data('tag');
      root.tagfilter.push(tag);
      $(this).clone().appendTo( root.tagmenu );
    });
    taglist = root.tagfilter.join(',');

    $('#maincontainer').attr('data-tags', taglist);

    $('.catbutton').removeClass('selected');
    root.selectedCat = '';
    $('#maincontainer').attr('data-cats', '');

    console.log(JSON.stringify(this.tagfilter));

  }


  /* click tagbutton (anywhere) */
  $('body').on('click','.tagbutton', function( e ){
    e.stopPropagation();
    if(e.preventDefault){
      e.preventDefault();
    }else{
      e.returnValue = false;
    }
    let tag = $(this).data('tag');
    $('.tagbutton.'+tag).toggleClass('selected');
    root.tagSelect();
  });

  $('body').on('click','.catbutton', function( e ){

    e.stopPropagation();
    if(e.preventDefault){
      e.preventDefault();
    }else{
      e.returnValue = false;
    }
    if( $(this).hasClass('selected') ){
      $('.catbutton').removeClass('selected');
      root.selectedCat = '';
      $('#maincontainer').attr('data-cats', '');
    }else{
      $('.catbutton').removeClass('selected');
      $('.catbutton.'+$(this).data('cats')).addClass('selected');
      root.selectedCat = $(this).data('cats');
      $('#maincontainer').attr('data-cats', root.selectedCat );
    }

  });


  /* click main item */
  $('body').on('click','#rightcontainer .item .intro, #leftmenu-container .item .intro, #leftcontainer .leftmenu .item .intro', function( e ){

    e.stopPropagation();
    if(e.preventDefault){
      e.preventDefault();
    }else{
      e.returnValue = false;
    }
    $('body').find('.item.selected').removeClass('selected');

    let item = $(this).closest('.item');
    item.toggleClass('selected');

    if( item.hasClass('selected')){

      item.prependTo( item.parent() );

      if( item.attr('data-cats').includes('artikelen') ){
        $('#leftcontainer .itemcontainer').html( item.clone() );
        $('#maincontainer').removeClass('rightview,rightmenu').addClass('leftview');
      }
      //alert( item.data('tags') );
      taglist = item.data('tags').split(',');
    }else{
      taglist = root.previoustags;
    }

    $('.tagbutton').removeClass('selected');
    $.each( taglist, function( n, tag ){
      $('.tagbutton.'+tag).addClass('selected');
    });

    // >> order isotope

    root.rightcontainer.parent().animate({
       scrollTop: 0
    }, 'slow');
    root.setLeftMenu();
    root.leftmenu.parent().animate({
       scrollTop: 0
    }, 'slow');
    $('#leftcontainer').animate({
       scrollTop: 0
    }, 'slow');

    root.tagSelect(); 

  });

  this.construct();

}

$('body').imagesLoaded( function( instance ) {

      var navi = navigate();

});

});
