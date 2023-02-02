// global reference variables

var tagfilter = [];
var prevtags = [];
var catfilter = [];
var prevcats = []
var itemfilter = '*'; // item classes
var selectedCat = '';
var itemid = '';


jQuery(function($) {

  var siteurl = 'https://zee-plaats-werk-land.nl/devsite/'; //$(location).attr("origin")+'/'; // + '/devsite/'; 

  // set content panels

  var pagebox = $('#maincontainer');
  var leftmenu = $('#leftmenu-container');
  var rightmenu = $('#rightmenu-container');
  var tagmenu = $('#rightmenu-container #tagmenu');

  // defaults
  var defaulttags = 'land,plaats,werk,zee';


  function setPageLoader() {

    var box;

    if ($('body').find('#pageloadbox').length < 1) {

      box = $('<div id="pageloadbox"><div class="visual"><div class="text">Loading</div></div></div>').hide();
      $('body').append(box);

    } else {

      box = $('#pageloadbox');

    }

    box.show();

  }



  function unsetPageLoader() {

    $('#pageloadbox').fadeOut();

    $('#menu-infomenu li a').each(function() {
      if ($(this).attr("href") == $(location).attr("href")) {
        $('body').find('#infomenutoggle').trigger('click');
        $(this).trigger('click');
      }
    });
    var windowSize = $(window).width();
    if( windowSize < 960 ){
      $('body').find('#infomenutoggle').trigger('click');
    }
    pagebox.addClass("leftmenu");

  }


  // loading
  setPageLoader();

  // touch detections
  var element = $('#rightcontainer .itemcontainer');
  var moved;

  var downListener = () => {

    moved = false;

  }

  element.on('mousedown', downListener);

  var moveListener = () => {

    moved = true;

  }

  element.on('mousemove', moveListener);

  var upListener = () => {

    if (moved) {

      console.log('moved');

    } else {

      console.log('not moved');

    }

  }

  element.on('mouseup', upListener);



  $(document).ready(function() {
    
    // load content
    if (postdata && postdata.length > 0) {

      // order content
      $.each(postdata, function(n, p) {

        if (p.group == 1) {
          $('#leftmenu-container .menucontainer').append(p.output);
        } else if (p.group == 3) {
          $('#infocontainer .contentarea').append(p.output);
          $('#infocontainer .contentarea .contentpage:first-child').addClass('active');
        } else if (p.group == 0) {
          $('#rightcontainer .itemcontainer').append(p.output);
        }

      });

    }

    // set start tags and cats
    let startid = pagebox.data('item');
    let startTags = pagebox.data('tags');
    let startCats = pagebox.data('cats');
    if (startTags == '' && startCats == '' && startid == '') {

      tagfilter = defaulttags.split(',');
      pagebox.attr('data-tags', defaulttags);

    }

    if (startTags != '') {
      tagfilter = startTags.split(',');
    }

    if (tagfilter.length > 0) {

      $.each(tagfilter, function(n, tag) {

        $('body').find('.tagbutton.' + tag).addClass('selected');
        rightmenu.find('.tagbutton.' + tag).addClass('selected');

      });

    }


    // ACTIONS PAGE
    // top menu icon toggle
    $('#infomenutoggle').on('click', function() {
      pagebox.toggleClass("pagemenu"); //pagebox.removeClass("leftview");
      $('body').find('#menu-infomenu li:first-child a').trigger('click');
      stopVideo();
    });

    $('#infomenuclose').on('click', function() {
      pagebox.removeClass("pagemenu"); //pagebox.removeClass("leftview");
      stopVideo();
    });

    // switch content
    $('#contentswitch .placeholder').on('click', function() {

      let item = $('#leftmenu-container .menucontainer.leftmenu .menubutton:first-child').addClass('selected').clone();
      $('#leftcontainer .itemcontainer').html(item);
      setLeftContent(item);

      $('#rightcontainer .itemcontainer .item').removeClass('selected');

      if (!pagebox.hasClass('leftview') && !pagebox.hasClass('leftmenu')) {
        pagebox.removeClass("rightmenu");
        pagebox.addClass("leftmenu"); // switch left
      } else if (pagebox.hasClass('leftview') && pagebox.hasClass('leftmenu')) {
        pagebox.removeClass("leftmenu"); // switch right
      }

      pagebox.toggleClass("leftview");
      pagebox.removeClass("pagemenu");
      if (pagebox.hasClass('leftview')) {
        $('#leftmenu-container .menucontainer.leftmenu .menubutton:first-child').addClass('selected');
      }

      stopVideo();
      checkSelected();
      layoutIsotope();

    });

    var setLeftContent = function(item) {

      item.find('.title').each(function() {
        $(this).parent().parent().find('.main').appendTo($(this).parent()); // .css({ 'top': '40px' })
        $(this).prependTo($(this).parent()); // .height('40px')
      });

    }


    var stopVideo = function() {

      var videos = document.querySelectorAll('iframe, video');
      Array.prototype.forEach.call(videos, function(video) {

        if (video.tagName.toLowerCase() === 'video') {
          video.pause();
        } else {
          var src = video.src;
          video.src = src;
        }

      });

    };

    // toggle left menu
    $('#leftmenu-toggle .placeholder').on('click', function() {
      pagebox.toggleClass("leftmenu");
      //layoutIsotope();
    });

    // toggle right menu
    $('#rightmenu-toggle .placeholder').on('click', function() {
      pagebox.toggleClass("rightmenu");
      //layoutIsotope();
    });


    // ACTIONS ITEM
    $('body').on('click', '#rightcontainer .item .intro, #leftmenu-container .item .intro, #leftcontainer .leftmenu .item .intro', function(e) {

      e.stopPropagation();

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }


      prevtags = tagfilter;
      prevcats = catfilter;

      // reset active selected
      $('body').find('.item.selected').removeClass('selected');
      $('body').find('.item.fullscreen').removeClass('fullscreen');
      $('body').find('.itemcontainer .active').removeClass('active');
      $('.catbutton').removeClass('selected');
      pagebox.removeClass("pagemenu");

      // set selected
      let item = $(this).closest('.item');
      item.toggleClass('selected'); // ? :

      // check selected
      if (item.hasClass('selected')) {

        item.prependTo(item.parent());

        if (item.attr('data-cats').includes('artikelen')) {

          let leftitemselected = item.clone();
          $('#leftcontainer .itemcontainer').html(leftitemselected);
          $('#maincontainer').removeClass('rightview,rightmenu').addClass('leftview');
          setLeftContent(leftitemselected);
          pagebox.removeClass("rightmenu");

        }

        taglist = item.data('tags').split(','); //alert( item.data('tags') );

      } else {

        taglist = previoustags; // deselect - get previous tags

      }

      $('.tagbutton').removeClass('selected');
      $.each(taglist, function(n, tag) {
        $('.tagbutton.' + tag).addClass('selected');
      });

      if (pagebox.hasClass('leftview') && !item.hasClass('menubutton') && !item.hasClass('contentpage')) {
        pagebox.removeClass("leftview");
        pagebox.addClass("rightview");
      }

      if (!pagebox.hasClass('leftmenu') && item.hasClass('menubutton')) {
        pagebox.addClass("leftmenu");
      }

      stopVideo();
      tagSelect();

    });


    $('body').on('click', '.selected .infotoggle.button', function(e) {

      e.stopPropagation();
      $(this).closest('.item').find('.main').toggleClass('active');
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
        $(this).closest('.item').find('.imagenav').fadeOut('fast');
      } else {
        $(this).closest('.item').find('.imagenav').fadeIn('fast');
      }

    });



    $('body').on('click', '.item .optionfullscreen', function(e) {
      e.stopPropagation();
      var fscrobj = $(this).closest('.item');
      fscrobj.toggleClass('fullscreen');
      setTimeout(function() {
        //setImageSlideArrowHeight(fscrobj);
        $('#rightcontainer .itemcontainer').isotope('layout');
      }, 300);
    });



    /* Postlinks */
    $('body').on('click', '.titlebutton', function(e) {
      e.stopPropagation();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      moved = false;
      let selecteditem = $(this).data('id');
      $('#post-' + selecteditem + ' .intro').trigger('click');
      //$('#post-'+ $(this).data('id') ).trigger('click');
      $('#searchhints').removeClass('active');
      stopVideo();
    });

    /**
    ACTIONS ITEM SLIDES
    **/
    $('body').on('click', '.navleft, .navright', function(event) {

      event.stopPropagation();
      var currentActive = $(this).parent().parent().find('.imageslides img.active').removeClass('active');
      if ($(this).hasClass('.navleft')) {
        var nextTarget = currentActive.prev('img');
        if (nextTarget.length == 0) {
          nextTarget = $(this).parent().parent().find('.imageslides img:last');
        }
        if (nextTarget.attr('src') == $(this).parent().parent().find('.coverimage .stage img').attr('src')) {
          var nextTarget = nextTarget.prev('img');
        }
      } else {
        var nextTarget = currentActive.next('img');
        if (nextTarget.length == 0) {
          nextTarget = $(this).parent().parent().find('.imageslides img:first');
        }
        if (nextTarget.attr('src') == $(this).parent().parent().find('.coverimage .stage img').attr('src')) {
          var nextTarget = nextTarget.next('img');
        }
      }

      nextTarget.addClass('active');
      var imgurl = nextTarget.attr('src');
      //console.log(imgurl);
      $(this).parent().parent().find('.coverimage .stage').fadeOut(200, function() {
        $(this).parent().parent().find('.coverimage .stage img').replaceWith('<img src="' + imgurl + '" />');
      }).fadeIn(200, function() {
        //setImageSlideArrowHeight($(this).parent().parent());
        $('#rightcontentcontainer .contentbox').isotope('layout');
      });
    });

    // ACTIONS TAGS
    $('body').on('click', '.tagbutton', function(e) {

      e.stopPropagation();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

      $('#searchhints').removeClass('active');
      stopVideo();

      prevtags = tagfilter;
      prevcats = catfilter;

      // reset active selected
      $('body').find('.item.selected').removeClass('selected');
      $('body').find('.item.fullscreen').removeClass('fullscreen');
      $('body').find('.itemcontainer .active').removeClass('active');
      $('.catbutton').removeClass('selected');

      pagebox.removeClass("pagemenu");
      let tag = $(this).data('tag');

      if ($(this).parent().parent().hasClass('tagresults')) {

        pagebox.attr('data-tags', tag);
        $('.tagbutton').removeClass('selected');
        $('.tagbutton.' + tag).addClass('selected');

      } else {

        // toggle tag to selection
        $('.tagbutton.' + tag).toggleClass('selected');

      }

      selectedCat = '';
      catfilter = [];
      pagebox.attr('data-cats', '');

      if (pagebox.hasClass('leftview')) {

        pagebox.removeClass("leftview");
        pagebox.addClass("rightview");

      }
      tagSelect();

    });



    $('body').on('click', '.catbutton', function(e) {

      e.stopPropagation();
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

      stopVideo();
      prevtags = tagfilter;
      prevcats = catfilter;
      catfilter = [];

      // reset active selected
      $('body').find('.item.selected').removeClass('selected');
      $('body').find('.item.fullscreen').removeClass('fullscreen');
      $('body').find('.itemcontainer .active').removeClass('active');
      $('.tagbutton').removeClass('selected');
      pagebox.removeClass("pagemenu");

      let cat = $(this).data('cats');

      $('.catbutton.' + cat).toggleClass('selected');

      if ($('.catbutton.selected.' + cat).length > 0) {

        selectedCat = cat;
        catfilter.push(cat);
      } else {
        selectedCat = '';
        catfilter.splice(catfilter.indexOf(cat), 1);
      }

      catlist = catfilter.join(',');
      pagebox.attr('data-cats', catlist);

      if (pagebox.hasClass('leftview')) {
        pagebox.removeClass("leftview");
        pagebox.addClass("rightview");
      }
      tagSelect();

    });



    $('body').on('click', '#tagmenu .cleartags', function(event) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      event.stopPropagation();

      // contentfilter
      $('.item').removeClass('selected');

      $('body').find('.item.fullscreen').removeClass('fullscreen');
      $('body').find('.itemcontainer .active').removeClass('active');
      $('.catbutton').removeClass('selected');
      pagebox.removeClass("pagemenu");

      $('.tagbutton').removeClass('selected');
      $('.cleartags').remove();

      // display
      $('body').removeClass('leftview leftmenu');
      $('body').addClass('rightview');

      stopVideo();
      tagSelect();

    });

    // SELECT FUNCTIONS
    function tagSelect() {

      let taglist = '';
      tagfilter = [];
      tagmenu.html('');

      $.each($('.menucontainer.rightmenu').find('.tagbutton.selected'), function() {

        let tag = $(this).data('tag');
        tagfilter.push(tag);
        $(this).clone().appendTo(tagmenu);

      });

      if (tagfilter.length > 0 && tagmenu.find('.cleartags').length < 1) {
        tagmenu.append('<a class="cleartags" href="#">X</a>');
      }

      taglist = tagfilter.join(',');
      pagebox.data('tags', taglist);
      catSelect();
      checkSelected();
      applyTagWeight();
      //console.log(JSON.stringify(tagfilter));

    }

    function catSelect() {

      if ($('.item.selected').length > 0) {

        let cat = $('.item.selected').attr('data-category');
        selectedCat = cat;
        let selectedCats = $('.item.selected').attr('data-cats');

        if (selectedCats != '') {
          catfilter = selectedCats.split(',');
          pagebox.attr('data-cats', selectedCats);

        }

      } else if (catfilter.length < 1) {

        selectedCat = '';
        catfilter = [];
        pagebox.attr('data-cats', '');

      }

    }





    function checkSelected() {

      // check tags and cats

      let selectedTags = pagebox.data('tags');
      if (selectedTags != '') {
        tagfilter = selectedTags.split(',');
      }


      let selectedCats = pagebox.data('cats');

      if (selectedCats != '') {
        catfilter = selectedCats.split(',');
      }



      // create class filter for isotope
      itemfilter = '';

      if (tagfilter.length > 0) {
        itemfilter = '.' + tagfilter.join(',.');
        pagebox.data('tags', tagfilter.join(','));
      }

      if (catfilter.length > 0) {

        if (itemfilter != '') {
          itemfilter += ',';
        }
        itemfilter += '.' + catfilter.join(',.');

      }



      let url = siteurl;
      let newpagetitle = '-zee-plaats-werk-land';

      // check selected item and retrieve the item gallery and html content

      if ($('.item.selected').length > 0) {

        // item
        let item = $('.item.selected');
        let slcid = item.data('id');
        let content = '';

        for (i = 0; i < postdata.length; i++) {
          if (postdata[i].id == slcid) {
            content = postdata[i].content;
          }
        }

        $('.item.selected').find('.main .textbox').html(content);

        url = item.find('.title h3 a').attr('href');
        getItemGallery(item, content);
        newpagetitle = item.data('title') + ' | ' + newpagetitle;

      } else {

        // tags and cats
        if (catfilter.length > 0) {
          url += '/cats/' + catfilter.join(',') + '/';
          newpagetitle = catfilter.join(',') + ' | ' + newpagetitle;
        }

        if (tagfilter.length > 0) {
          url += '/tags/' + tagfilter.join(',');
          newpagetitle = tagfilter.join(',') + ' | ' + newpagetitle;
        }

      }

      //if( document.referer != url ){

      window.history.pushState({
        'path': location.pathname
      }, null, url);

      document.title = newpagetitle;

      //}
      //unsetTempLoader();
      console.log(itemfilter);

    }



    function getItemGallery(item, content) {

      let gallerybox = $('<div class="imageslides" />');
      let countimg = 0;
      item.removeClass('gallery');

      $(content).find('img').each(function(ix, obj) {
        gallerybox.append(obj);
        countimg++;
      });

      item.find('.imagenav').remove();

      var nav = '<div class="imagenav"><div class="navleft"><span>left</span></div><div class="navright"><span>right</span></div></div>';
      if (item.find('.imageslides').length < 1 && countimg > 1) {
        item.find('.coverimage img').clone().addClass('active').prependTo(item.find('.imageslides'));
        item.find('.intro').prepend(gallerybox);
      }

      if (item.find('.imageslides').length > 0) {
        item.addClass('gallery');
        item.find('.imageslides').prependTo(item.find('.intro'));
        item.find('.intro').prepend(nav);
        //setImageSlideArrowHeight(item);
      }

      //console.log('Gallery intro check');

    }


    $('body').on('click', '#menu-infomenu li a', function(event) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      event.stopPropagation();

      $('#infocontainer .contentarea .contentpage, #menu-infomenu li a').removeClass('active');
      
      $('#page-332 .section-container .profile.active').removeClass('active');
      $('#page-332 .section-container').removeClass('selectview');

      $(this).addClass('active');
      let activeitem = $('#infocontainer .contentarea .contentpage[data-link="' + $(this).attr('href') + '"]').addClass('active');

      window.history.pushState({
        'path': location.pathname
      }, null, $(this).attr("href"));

      document.title = 'zee-plaats-werk-land | ' + activeitem.data('title');
      markupInfoPages();

    });

    window.addEventListener('popstate', function(e) {

      if (e.state) {
        if (location.pathname != e.state.href && location.pathname != e.state.href + '/') {
          window.location.replace(e.state.href);
        } else {
          window.history.go(-1);
        }
      }

    });


    function markupInfoPages() {

      // profile page
      if( $('#page-332').hasClass('active')  ){

        var el = '#page-332 .section-container'; 
        $(el).html('');

        var slccatid = 378;
        var posts;
        var url = 'https://zee-plaats-werk-land.nl/devsite';
        //var reqcats = url+'/wp-json/wp/v2/categories?_embed=true';
        var reqpostsbycatid = url+'/wp-json/wp/v2/posts?categories='+slccatid+'&per_page=50&orderby=modified&order=desc&_embed=true';
        
        $.ajax({
          url: reqpostsbycatid, // json data
          contentType: 'application/json',
          dataType: 'json', // ? change this to jsonp if it is a cross org. req.
          contentType: 'json',
          success: function(json) {
            //console.log(json);
            if(json.data){
              posts = json.data;
            }else if(json.list){
               posts = json.list;
            }else{
               posts = json;
            }
            createList();
          }
        });
          
          
        var createList = function() {
        
          $.each(posts, function(index, value) { //var data = JSON.stringify(value);
            
            let item = $('<div id="'+value.id+'" class="post profile"></div>');
            
            if( value.featured_media != 0 && value._embedded){
              item.append('<div class="imgwrap" style="background-image: url('+value._embedded['wp:featuredmedia']['0'].source_url+');"></div>');
              item.append('<img src="'+value._embedded['wp:featuredmedia']['0'].source_url+'" alt="'+value.title.rendered+' portret"/>');
            }

            item.append( '<h3 class="name">'+value.title.rendered+'</h3>' );
            item.append( '<div class="intro">'+value.excerpt.rendered+'</div>' );
            item.append( '<div class="content">'+value.content.rendered+'</div>' );
            
            if( value._embedded['wp:term']['0'].length > 0 && value._embedded){
             $.each( value._embedded['wp:term']['0'], function( idx, category){
               if(category.id != slccatid){
                //item.append( '<h3>'+value.title.rendered+'</h3>' );
                item.append( '<a class="catbutton" href="'+url+'/#cats='+category.id+'" data-cats="'+category.id+'">'+category.name+'</a>' );
              }
             });
            }
            
            $(el).append( item );
            
          });

          
          $(el).prepend( '<div class="backbutton"><span>terug</span></div>' );
        
        };


        $('body').on('click', '#page-332 .section-container .profile', function(ev) {

          var pro = $(this);
          //alert( pro.attr('id') );
          pro.parent().addClass('selectview');
          pro.addClass('active'); 
          $('#infocontainer .contentarea, #infocontainer .contentarea .itemcontent').scrollTop(0); 

        });

        $('body').on('click', '#page-332 .section-container .backbutton', function(ev) {

          $('#page-332 .section-container .profile.active').removeClass('active');
          $('#page-332 .section-container').removeClass('selectview');
          
        });

      }

      $('#infocontainer .contentarea').scrollTop(0);

    }

    /*
    function setImageSlideArrowHeight(obj) {
      var arrowpos = obj.find('.coverimage').height() / 2;
      obj.find(".navleft,.navright").css({
        'margin-top': arrowpos + 'px'
      });
      //$(".item.active .intro .imagenav .navleft, .item.active .intro .imagenav .navright").css({ 'margin-top' : arrowpos+'px' });
    }
    */

    function calculateTagWeight(obj) {

      var mc = 0;
      var tags = $(obj).data('tags').split(',');

      if (tags.length > 0 && tagfilter.length > 0) {

        for (i = 0; i < tags.length; i++) {
          if ($.inArray(tags[i], tagfilter) > -1) {
            mc++;
          }
        }

      }

      $(obj).find('.matchweight').text(mc);
      $(obj).removeClass('nonactive');

      if (mc == 0) {
        $(obj).addClass('nonactive');
      }

      // Apply Item Matchweight Size
      $(obj).removeClass('size-l size-m size-s');
      var percent = 100 / tagfilter.length * mc;
      var newSize = 'size-s';
      if (percent > 65) {
        newSize = 'size-l';
      } else if (percent > 30) {
        newSize = 'size-m';
      }

      $(obj).addClass(newSize);
      if ($(obj).parent('#rightcontainer .itemcontainer').length) {
        $(obj).addClass(newSize);
      }

    }



    function applyTagWeight() {

      // calc match weight
      $('.item').each(function(idx, obj) {
        calculateTagWeight(obj);

      });

      var menu = $('#leftmenu-container .menucontainer.leftmenu');
      var options = $.makeArray(menu.children(".menubutton"));
      options.sort(function(a, b) {
        var textA = +$(a).find('.matchweight').text();
        var textB = +$(b).find('.matchweight').text();
        if (textA < textB) return 1;
        if (textA > textB) return -1;
        return 0;
      });

      menu.html('');
      $.each(options, function(idx, obj) {
        menu.append(obj);
      });
      reorderIsotope();
    }

    function initIsotope() {
      var container = $('#rightcontainer .itemcontainer');
      container.isotope({

        itemSelector: '.item',
        layoutMode: 'masonry',
        animationEngine: 'best-available',
        transitionDuration: '0.9s',
        masonry: {
          //isFitWidth: true,
          columnWidth: container.innerWidth() / 4,
          gutter: 0,
        },
        getSortData: {
          byCategory: function(elem) { // sort randomly
            return $(elem).data('category') === selectedCat ? 0 : 1;
          },
          byTagWeight: '.matchweight parseInt',
        },
        sortBy: ['byCategory', 'byTagWeight'], //'byTagWeight', //
        sortAscending: {
          byCategory: true, // name ascendingly
          byTagWeight: false, // weight descendingly
        },
      });
      reorderIsotope();

    }


    function reorderIsotope() {
      var container = $('#rightcontainer .itemcontainer');
      var w = container.innerWidth() / 4;
      container
        .isotope('reloadItems')
        .isotope('updateSortData')
        .isotope({
          masonry: {
            columnWidth: w
          }
        })
        .isotope({
          filter: itemfilter
        })
        .isotope({
          sortBy: 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
          sortAscending: {
            //byCategory: true, // name ascendingly
            byTagWeight: false, // weight descendingly
          },
        }).isotope('layout');
      layoutIsotope();
    }


    function layoutIsotope() {

      var box = $('#rightcontainer');
      box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e) {
        var container = $('#rightcontainer .itemcontainer');
        var w = container.innerWidth() / 4; //container.isotope('updateSortData')
        container.isotope({
          masonry: {
            columnWidth: w
          }
        });

        container.isotope('layout'); //container.isotope('reLayout');

      });

      setDevBox();
      scrollPanelsTop();

    }



    function scrollPanelsTop() {

      $('#rightcontainer .itemcontainer').parent().animate({
        scrollTop: 0
      }, 'slow');
      $('#rightcontainer').animate({
        scrollTop: 0
      }, 'slow');
      $('.menucontainer.leftmenu').parent().animate({
        scrollTop: 0
      }, 'slow');
      $('#leftcontainer').animate({
        scrollTop: 0
      }, 'slow');

    }


    function setDevBox() {
      let t = '<div class="tags">Labels: ' + pagebox.attr('data-tags') + '</div>';
      let c = '<div class="cats">Categories: ' + pagebox.attr('data-cats') + '</div>';
      $('#developerbox .query').html(t + c);
    }


    // TOP BOX
    var resizeId;
    $(window).resize(function() {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneGlobalResizing, 20);
    });

    function doneGlobalResizing() {
      // swap left menu
      let leftmenu = $('#leftmenu-container .menucontainer.leftmenu').clone();
      if ($(window).width() < 960) {
        if ($('#leftcontainer .contentarea .menucontainer.leftmenu').length < 1) {
          $('#leftcontainer .contentarea').append(leftmenu);
        }
      } else {
        $('#leftcontainer .contentarea .menucontainer.leftmenu').remove();
      }
      layoutIsotope();
    }

    $('body').imagesLoaded(function(instance) {
      initIsotope();
      doneGlobalResizing();
      //let selecteditem = pagebox.attr('data-item'); //.data('item');
      if (startid != '') {
        $('body').find('#post-' + startid + ' .intro').trigger('click');
        pagebox.attr('data-item', '');
        //$('body').find('#leftmenu-toggle .placeholder').trigger('click');
        //pagebox.addClass("leftmenu");
        //selecteditem = '';
        //alert(startid);
      } else {
        tagSelect();
        checkSelected();
        applyTagWeight()
      }
      unsetPageLoader();
    });
  });

  /*$(window).load(function() {
    //ar nice= $('.itemcontainer').niceScroll({cursorborder:"",cursorcolor:"#333333",cursorwidth:"8px", boxzoom:true, autohidemode:false});
  });*/

});