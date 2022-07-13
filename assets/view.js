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

  var tagfilter = [];
  var prevtags = [];
  var catfilter = [];
  var prevcats = []
  var itemfilter = ''; // item classes
  var selectedCat = '';

  // set content panels
  var pagebox = $('#maincontainer');
  var leftmenu = $('#leftmenu-container');
  var rightmenu = $('#rightmenu-container');
  var tagmenu =   $('#rightmenu-container #tagmenu')


	$(document).ready(function(){

    /* load content */
    if( postdata && postdata.length > 0 ){
      //rightcontainer.append(JSON.stringify(postdata) );

        $.each(postdata, function( n, p ){
          if( p.group == 1 ){
            $('#leftmenu-container .menucontainer').append(p.output);
          }else if( p.group == 3 ){
            $('#infocontainer .contentarea').append(p.output);
          }else if( p.group == 0 ){
            $('#rightcontainer .itemcontainer').append(p.output);
          }
        });

    }

    // set start tags
    let startTags = pagebox.data('tags');
    if( startTags == '' ){
        startTags = 'zee,plaats,werk,land';
        tagfilter = startTags.split(',');
        pagebox.attr('data-tags', startTags);
    }



    // top menu icon toggle
		$('#infomenutoggle').on('click touchstart', function() {
      pagebox.toggleClass("pagemenu");//pagebox.removeClass("leftview");
		});

    // switch content
		$('#contentswitch .placeholder').on('click touchstart', function() {

			if( !pagebox.hasClass('leftview') && !pagebox.hasClass('leftmenu')){
				pagebox.removeClass("rightmenu");
				pagebox.addClass("leftmenu"); // switch left
			}else if( pagebox.hasClass('leftview') && pagebox.hasClass('leftmenu') ){
				pagebox.removeClass("leftmenu"); // switch right
			}
      //if( $('#leftcontainer .itemcontainer').html() == '' ){
      let item = $('#leftmenu-container .menucontainer.leftmenu .menubutton:first-child').clone();
      $('#leftcontainer .itemcontainer').html( item );
      //}
      pagebox.toggleClass("leftview");
			pagebox.removeClass("pagemenu");

      layoutIsotope();
		});

		$('#leftmenu-toggle .placeholder').on('click touchstart', function() {
      pagebox.toggleClass("leftmenu");
		});

		$('#rightmenu-toggle .placeholder').on('click touchstart', function() {
      pagebox.toggleClass("rightmenu");
		});

    $('body').on('click','#rightcontainer .item .intro, #leftmenu-container .item .intro, #leftcontainer .leftmenu .item .intro', function( e ){

      e.stopPropagation();
      if(e.preventDefault){
        e.preventDefault();
      }else{
        e.returnValue = false;
      }
      $('body').find('.item.selected').removeClass('selected');

      let item = $(this).closest('.item');
      item.toggleClass('selected'); // ? :

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

      tagSelect();

    });

    $('body').on('click','.tagbutton', function( e ){
      e.stopPropagation();
      if(e.preventDefault){
        e.preventDefault();
      }else{
        e.returnValue = false;
      }
      let tag = $(this).data('tag');
      $('.tagbutton.'+tag).toggleClass('selected');
      tagSelect();
    });

    function tagSelect(){

      let taglist = '';
      prevtags = tagfilter;
      tagfilter  = [];
      tagmenu.html('');

      $.each( $('.menucontainer.rightmenu').find('.tagbutton.selected'), function(){
        let tag = $(this).data('tag');
        tagfilter.push(tag);
        $(this).clone().appendTo( tagmenu );
      });
      taglist = tagfilter.join(',');

      pagebox.attr('data-tags', taglist);

      checkSelected();
      applyTagWeight();
      reorderIsotope();
      //console.log(JSON.stringify(this.tagfilter));

    }


    function checkSelected(){

      let selectedTags = pagebox.data('tags');
      if( selectedTags != '' ){
        tagfilter = selectedTags.split(',');
      }

      let selectedCats = pagebox.data('cats');
      if( selectedCats != ''){
        catfilter = selectedCats.split(',');
      }

      itemfilter = '';
      if( tagfilter.length > 0 ){
        itemfilter = '.'+tagfilter.join(',.');
      }
      if( catfilter.length > 0 ){
        itemfilter += '.'+catfilter.join(',.');
      }
      console.log( itemfilter );

    }

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

    function applyTagWeight(){
      // calc match weight
      $('.item').each( function( idx, obj ){
          calculateTagWeight( obj );
      });

      var menu = $('.menucontainer.leftmenu');
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
    }

    function initIsotope(){

      var container = $('#rightcontainer .itemcontainer');
            container.isotope({

                itemSelector: '.item',
                layoutMode: 'masonry',
                animationEngine: 'best-available',
                transitionDuration: '0.9s',
                masonry: {
                    //isFitWidth: true,
                    columnWidth: container.innerWidth()/4,
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
            reorderIsotope();

    }

    function reorderIsotope(){

      var container = $('#rightcontainer .itemcontainer');
      var w = container.innerWidth()/4;
      container
           .isotope('reloadItems')
           .isotope('updateSortData')
           .isotope({ masonry: { columnWidth: w } })
           .isotope({ filter: itemfilter })
           .isotope({
               sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
               sortAscending: {
                   //byCategory: true, // name ascendingly
                   byTagWeight: false, // weight descendingly
               },
           }).isotope( 'layout' );

           scrollPanelsTop();

    }

    function layoutIsotope(){

      var box = $('#rightcontainer');

      box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){

        var container = $('#rightcontainer .itemcontainer');
        var w = container.innerWidth()/4; //container.isotope('updateSortData')
        container.isotope({ masonry: { columnWidth: w } });
        container.isotope('layout'); //container.isotope('reLayout');

      });

      scrollPanelsTop();

    }

    function scrollPanelsTop(){

      $('#rightcontainer .itemcontainer').parent().animate({
         scrollTop: 0
      }, 'slow');

      $('.menucontainer.leftmenu').parent().animate({
         scrollTop: 0
      }, 'slow');
      $('#leftcontainer').animate({
         scrollTop: 0
      }, 'slow');

    }








    var resizeId;
    $(window).resize(function() {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneGlobalResizing, 20);
    });

    function doneGlobalResizing(){

      // swap left menu
      let leftmenu = $('#leftmenu-container .menucontainer.leftmenu').clone();

      if( $(window).width() < 960  ){
        if( $('#leftcontainer .contentarea .menucontainer.leftmenu').length < 1){
          $('#leftcontainer .contentarea').append( leftmenu );
        }
      }else{
        $('#leftcontainer .contentarea .menucontainer.leftmenu').remove();
      }
      layoutIsotope();

    }

    $('body').imagesLoaded( function( instance ) {

          checkSelected();
          applyTagWeight();
          initIsotope();
          doneGlobalResizing();
          unsetPageLoader();
    });

  });

  /*
  $(window).load(function(){
    var nice= $('.itemcontainer').niceScroll({cursorborder:"",cursorcolor:"#333333",cursorwidth:"8px", boxzoom:true, autohidemode:false});
  });
  */
});
