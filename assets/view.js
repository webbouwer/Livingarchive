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


  /* tag & cat related */
  var tagfilter   = [];
  var catfilter   = [];
  var filterClass = '*';
  var selectedCat = false;

  // match tag weights

            var calculateTagWeight = function( obj ){
                    var mc = 0;
                    var tags = $(obj).data('tags').split(',');
                    if( tags.length > 0  && tagfilter.length > 0){
                        for(i=0;i<tags.length;i++){
                            if( $.inArray( tags[i], tagfilter ) > -1 ){
                                mc++;
                            }
                        }
                    }
                    $(obj).find('.matchweight').text(mc);

                    $(obj).removeClass('nonactive');
                    if( mc == 0 ){
                       $(obj).addClass('nonactive');
                    }
                    // Apply Item Matchweight Size
                    $(obj).removeClass('size-l size-m size-s');
                    var percent = 100 / tagfilter.length * mc;
                    var newSize = 'size-s';
                    if( percent > 65 ){
                        newSize = 'size-l';
                    }else if( percent > 30 ){
                        newSize = 'size-m';
                    }
                    $(obj).addClass(newSize);
                    if( $(obj).parent('#rightcontainer .itemcontainer').length  ){
                        $(obj).addClass(newSize);
                    }

            }

            // order items by tagweight
            var applyTagWeight = function (){
                // calc match weight
                $('.item').each( function( idx, obj ){
                    calculateTagWeight( obj );
                });


                    var menu = $('#leftcontainer .itemcontainer');
                    var options = $.makeArray(menu.children(".menubutton"));
                    options.sort(function(a, b) {
                      var textA = +$(a).find('.matchweight').text();
                      var textB = +$(b).find('.matchweight').text();
                      if (textA < textB) return 1;
                      if (textA > textB) return -1;
                      return 0;
                    });
                    menu.empty();
                    $.each(options, function( idx, obj) {
                        menu.append(obj);
                    });


                    rightIsotope();
                    //setIsotope( $('#leftmenu-container .itemcontainer') );
                    //setIsotope( $('#leftcontainer .leftmenu') );

                //}
                // TODO.. apply Masonry (isotope)
            }



            /* isotope ordening */
/*
            function activateIsotope(){

            // init isotope

            var container = $('#rightcontainer .itemcontainer, #leftmenu-container .itemcontainer, #leftcontainer .leftmenu');
            container.isotope({

                itemSelector: '.item',
                layoutMode: 'masonry',
                animationEngine: 'best-available',
                transitionDuration: '0.9s',
                masonry: {
                    //isFitWidth: true,
                    columnWidth: container.innerWidth()/4,
                    gutter: 5,
                },
                getSortData: {
                    byCategory: function (elem) { // sort randomly
                            return $(elem).data('category') === selectedCat ? 0 : 1;
                    },
                    byTagWeight: '.matchweight parseInt',
                },
                sortBy : [ 'byCategory', 'byTagWeight' ],//'byTagWeight', //
                sortAscending: {
                          byCategory: true, // name ascendingly
                          byTagWeight: false, // weight descendingly
                },
            });

          }
*/
          function rightIsotope( ){

            //var container = $('#rightcontainer .itemcontainer, #leftmenu-container .itemcontainer, #leftcontainer .leftmenu');
            let container = $('#rightcontainer .itemcontainer');
            let w = container.innerWidth()/4;

            if( !$.isFunction( 'isotope' ) ){

            container.isotope({

                itemSelector: '.item',
                layoutMode: 'masonry',
                animationEngine: 'best-available',
                transitionDuration: '0.9s',
                masonry: {
                    //isFitWidth: true,
                    columnWidth: w,
                    gutter: 0,
                },
                getSortData: {
                    byCategory: function (elem) { // sort randomly
                            return $(elem).data('category') === selectedCat ? 0 : 1;
                    },
                    byTagWeight: '.matchweight parseInt',
                },
                sortBy : [ 'byCategory', 'byTagWeight' ],//'byTagWeight', //
                sortAscending: {
                          byCategory: true, // name ascendingly
                          byTagWeight: false, // weight descendingly
                },
            });

          }else{

            container
              .isotope('reloadItems')
              .isotope('updateSortData')
              .isotope({ masonry: { columnWidth: w } })
              //.isotope({ filter: filterClass })
              .isotope({
                   sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
                   sortAscending: {
                   //byCategory: true, // name ascendingly
                   byTagWeight: false, // weight descendingly
                   },
                }).isotope( 'layout' );

            }

          }







  var rightcontainer = $('#rightcontainer .itemcontainer');
  var leftcontainer = $('#leftmenu-container .itemcontainer');
  var infocontainer = $('#infocontainer .contentarea');



	$(document).ready(function(){

    /* load content */
    if( postdata && postdata.length > 0 ){
      //rightcontainer.append(JSON.stringify(postdata) );

        $.each(postdata, function( n, p ){
          if( p.group == 1 ){
            leftcontainer.append(p.output);
          }else if( p.group == 3 ){
            infocontainer.append(p.output);
          }else if( p.group == 0 ){
            rightcontainer.append(p.output);
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

       /*$('#rightcontainer .itemcontainer')
       .isotope('reloadItems')
       .isotope('updateSortData')
       .isotope('layout');
       */
       rightIsotope();
       //setIsotope( $('#leftmenu-container .itemcontainer') );
       //setIsotope( $('#leftcontainer .leftmenu') );

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

      let items = $('#leftmenu-container .itemcontainer').html();
      let menu = $('<div class="leftmenu">'+items+'</div>');

      if( $(window).width() < 960  ){
        if( $('#leftcontainer .contentarea .leftmenu').length < 1){
          $('#leftcontainer .contentarea').append( menu );
        }
      }else{
        $('#leftcontainer .contentarea .leftmenu').remove();
      }

      //activateIsotope();

      rightIsotope();
      //setIsotope( $('#leftmenu-container .itemcontainer') );
      //setIsotope( $('#leftcontainer .leftmenu') );

      $('#rightcontainer .contentarea').animate({scrollTop:0}, 400);
    }

    $('body').imagesLoaded( function( instance ) {

          //alert('Loaded');
          if( $('#maincontainer').data('tags') == ''){
            $('#maincontainer').attr('data-tags', "zee,plaats,werk,land" );
          }
          // default
          tagfilter = $('#maincontainer').attr("data-tags").split(',');

          applyTagWeight();
          doneGlobalResizing(); //activateIsotope();
          unsetPageLoader();
    });

    $('body').on('click', '.tagbutton', function( event ){

      if(event.preventDefault){
        event.preventDefault();
      }else{
        event.returnValue = false;
      }
      event.stopPropagation();

      tagfilter = $('#maincontainer').attr("data-tags").split(',');
      let selected = $(this).data("tag");

      if(tagfilter.indexOf(selected) !== -1){
        for (var key in tagfilter) {
          if (tagfilter[key] == selected) {
              tagfilter.splice(key, 1);
              $('.tagbutton.'+selected).removeClass('selected');
          }
        }
      }else{
        tagfilter.push(selected);
        $('.tagbutton.'+selected).addClass('selected');
      }

      $('#maincontainer').attr("data-tags", tagfilter.toString() );

      $('#maincontainer').removeClass('leftview');
      $('#maincontainer').addClass('rightview');

      applyTagWeight();
      //reloadIsotope();


    });

    $('body').on('click', '#rightcontainer .item .itemcontent .intro', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#maincontainer').removeClass('leftview');
                $('#maincontainer').addClass('rightview');

                $('.item').removeClass('selected');
                var selecteditem =  $(this).parent().parent().addClass('selected');
                selecteditem.parent().prepend(selecteditem);

                tagfilter = selecteditem.attr("data-tags").split(',');

                $('.tagbutton').removeClass('selected');

                $.each(tagfilter, function( i, tag){
                  $('.tagbutton.'+tag).addClass('selected');
                });

                $('#maincontainer').attr("data-tags", tagfilter.toString() );

                applyTagWeight();


    });



  });
  /*
  $(window).load(function() {
  });
  */
});
