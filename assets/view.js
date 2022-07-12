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

    /* load content */
    if( postdata && postdata.length > 0 ){
      //rightcontainer.append(JSON.stringify(postdata) );

        $.each(postdata, function( n, p ){
          if( p.group == 1 ){
            $('#leftmenu-container .itemcontainer').append(p.output);
          }else if( p.group == 3 ){
            $('#infocontainer .contentarea').append(p.output);
          }else if( p.group == 0 ){
            $('#rightcontainer .itemcontainer').append(p.output);
          }
        });

    }

    var pagebox = $('#maincontainer');
		var leftmenu = $('#leftmenu-container');
		var rightmenu = $('#rightmenu-container');

		$('#menutoggle').on('click touchstart', function() {
      pagebox.toggleClass("pagemenu");
			//pagebox.removeClass("leftview");
		});

		$('#contentswitch .placeholder').on('click touchstart', function() {
			if( !pagebox.hasClass('leftview') && !pagebox.hasClass('leftmenu')){
				pagebox.removeClass("rightmenu");
				pagebox.addClass("leftmenu"); // switch left
			}else if( pagebox.hasClass('leftview') && pagebox.hasClass('leftmenu') ){
				pagebox.removeClass("leftmenu"); // switch right
			}
      pagebox.toggleClass("leftview");
			pagebox.removeClass("pagemenu");
		});

		$('#leftmenu-toggle .placeholder').on('click touchstart', function() {
      pagebox.toggleClass("leftmenu");
		});
		$('#rightmenu-toggle .placeholder').on('click touchstart', function() {
      pagebox.toggleClass("rightmenu");
		});



    var resizeId;
    $(window).resize(function() {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneGlobalResizing, 20);
    });

    function doneGlobalResizing(){

      // swap left menu
      let items = $('#leftmenu-container .itemcontainer').html();
      let menu = $('<div class="leftmenu">'+items+'</div>');

      if( $(window).width() < 960  ){
        if( $('#leftcontainer .contentarea .leftmenu').length < 1){
          $('#leftcontainer .contentarea').append( menu );
        }
      }else{
        $('#leftcontainer .contentarea .leftmenu').remove();
      }

    }

    $('body').imagesLoaded( function( instance ) {
          doneGlobalResizing();
          unsetPageLoader();

    });

  });
});
