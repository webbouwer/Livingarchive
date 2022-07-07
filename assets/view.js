jQuery( function($) {



  // global view loaderbox
  function setPageLoader(){
    var box;
    if( $('body').find('#pageloadbox').length < 1 ){
      box = $('<div id="pageloadbox"><div class="visual"></div><div class="text">Loading</div></div>').hide();
      $('body').append( box );
    }else{
      box = $('#pageloadbox');
    }
    box.fadeIn();

  }

  function unsetPageLoader(){
    $('#pageloadbox').fadeOut();
  }

  setPageLoader();

	$(document).ready(function(){ 

    if( postdata && postdata.length > 0 ){
      alert(postdata);
    }
    $('body').imagesLoaded( function( instance ) {

          //alert('Loaded');
          unsetPageLoader();


    });

  });

  /*
  $(window).load(function() {
  });
  */
});
