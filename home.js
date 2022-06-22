/* Startpage template Javascript file */
jQuery(function($) {

	$(document).ready(function(){

        $('body').prepend('<div id="pageloader"><span class="textloader">Loading</span></div>');



        var objlist     = []; // all posts
        var tagfilter   = [];
        var catfilter   = [];
        var filterClass = '*';
        var selectedCat = false;
        var postID      = '';

        var theoryCategory = 'artikelen';
        var parentCategory = 'reststromen';
        var overviewCategory = 'bulletin';

        // setup display posts
        var markupHTMLContent = function(result){

            $('#leftmenucontainer .contentbox, #maincontentcontainer .contentbox, #rightcontentcontainer .contentbox, #infocontent .contentbox').empty();
            var htmllist = '', oc = 0;

            $.each( result, function(idx,obj){

                objlist[obj.id] = obj;

                var html = '',
                objfilterclasses = '',
                itemtype = 0,
                display_tags = gethtmlListTags( obj.tags ),
                display_cats = gethtmlListCats( obj.cats );

                $(obj.tags).each(function( x , tag ){
                    objfilterclasses += ' '+tag;
                });
                $(obj.cats).each(function( x , cat ){
                    if( cat == theoryCategory ){
                        itemtype = 1; // left content
                        objfilterclasses += ' menubutton';
                    }else if( cat == overviewCategory ){
                        itemtype = 2; // main/start content
                        objfilterclasses += ' overviewcontent';
                    }else{
                        objfilterclasses += ' '+cat;
                    }
                });
                var catreverse = obj.cats.reverse();
                if(oc = 0){
                    objfilterclasses += ' base';
                }
                if( obj.type == 'page' ){
                    itemtype = 3; // left content
                    objfilterclasses += ' contentpage';
                }

                /* check obj.content for video content -> display video on click
                var videoBox = '';
                var contentHolder = document.createElement('div');
                contentHolder.innerHTML = obj.content;
                if( typeof( contentHolder.getElementsByTagName("iframe")[0] ) !== 'undefined'
                   && contentHolder.getElementsByTagName("iframe")[0] != ''
                   && contentHolder.getElementsByTagName("iframe")[0].outerHTML != 'undefined' ){
                    videoBox = contentHolder.getElementsByTagName("iframe")[0].outerHTML;
                }*/


                // check obj.content for gallery content -> create slider

                html += '<div id="'+obj.type+'-'+obj.id+'" data-id="'+obj.id+'" data-slug="'+obj.slug+'" class="item '+obj.imgorient+' '+objfilterclasses+'" ';
                html += 'data-link="'+obj.link+'" data-author="'+obj.author+'" data-timestamp="'+obj.timestamp+'" data-category="'+catreverse[0]+'" ';
                html += 'data-tags="'+obj.tags+'" data-cats="'+obj.cats+'">';
                html += '<div class="itemcontent"><div class="intro">';

                html += '<div class="coverimage">';

                /*if( videoBox != '' && itemtype == 0){
                    html += '<div class="stage landscape" data-url="'+obj.imgurl+'">'+obj.image;
                    html += '<div class="mediabox">'+videoBox+'</div>';
                    html += '<div class="optionfullscreen button">[]</div>';
                    html += '</div>';
                }else */
                if(obj.image && obj.image != ''){
                    html += '<div class="stage '+obj.imgorient+'" data-url="'+obj.imgurl+'">'+obj.image;
                    html += '<div class="optionfullscreen button">[]</div>';
                    html += '</div>';
                }else if( obj.type == 'post' ){
                    html += '<div class="mediaplaceholder '+obj.imgorient+'"><h3>'+obj.title+'</h3><div class="optionfullscreen button">[]</div></div>';
                } //html += '<div class="excerpt">'+obj.excerpt+'</div>';
                html += '</div>';

                if( obj.type != 'page' ){
                html += '<div class="title">';
                html += '<h3>'+obj.title+'<span class="matchweight moderate">0</span></h3>';
                html += '<div class="author">'+obj.author+'</div></div></div>';
                }
                html += '<div class="itemcatbox">'+display_cats+'</div><div class="itemtagbox">'+display_tags+'</div>';
                //html += JSON.stringify( obj.tags );
                html += '<div class="main"><div class="textbox"></div></div>'; //'+obj.content+'

                html += '</div>';
                html += '<div class="infotoggle button"><span>+</span></div>';
                html += '</div>';
                oc++;

                htmllist += html;

                if( itemtype == 1 ){
                    $('#leftmenucontainer .contentbox').append( html );
                }else if( itemtype == 2 ){
                    $('#maincontentcontainer .contentbox').append( html );
                }else if( itemtype == 3 ){
                    $('#infocontent .contentbox').append( html );
                }else{
                    $('#rightcontentcontainer .contentbox').append( html );
                }

                // reorder specifics
                /*
                $('#maincontentcontainer .intro .title').each( function( ){
                    $(this).parent().parent().find('.main').css({ 'top': '40px' }).appendTo( $(this).parent() );
                    $(this).height('40px').prependTo( $(this).parent() );
                });
                */

            });


            /*var catlist = JSON.parse(site_data['catdata']); //console.log(tags);

            $.each( catlist, function( idx, cat){
                    console.log( cat );
            });*/
            //console.log( catlist[0].slug );
            //console.log( JSON.stringify(objlist) );

        };

        var getHashUrlVars = function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        var setNewHash = function(){

            var newhash = '#';
            if( tagfilter.length > 0 ){
                newhash += 'tags='+tagfilter.join();
            }
            if( catfilter.length > 0 ){
                if(tagfilter.length > 0){
                    newhash += '&';
                }
                newhash += 'cats='+catfilter.join();
            }
            if(postID != false && postID != typeof undefined && postID != 'undefined'){
                newhash += '&pid='+postID;
            }

            //if(history.pushState) {
                //history.pushState(null, null, newhash );
            //}else{
                location.hash = newhash;
            //}

        }

        // display clickable tags
        var gethtmlListTags = function( itemtags ){
            var tags = JSON.parse(site_data['tagdata']); //console.log(tags);
            var html = '';
						tags.sort((a, b) => (a.name > b.name) ? 1 : -1);
            for(i=0;i<tags.length;i++){
                for(t=0;t<itemtags.length;t++){
                    if( tags[i]['slug'] == itemtags[t] ){
                        html += '<a href="#tags='+tags[i]['slug']+'" class="tagbutton '+tags[i]['slug']+'" data-tag="'+tags[i]['slug']+'">'+tags[i]['name']+'</a> ';
                    }
                }
            }
            return html;
        };

        // display clickable categories
        var gethtmlListCats = function( itemcats ){
            //console.log( JSON.stringify(site_data['catdata']) );
            var catlist = JSON.parse(site_data['catdata']);

            var html = '';

            for(t=0;t<itemcats.length;t++){
                if( itemcats[t] != overviewCategory && itemcats[t] != theoryCategory ){

                    $.each( catlist, function( idx, cat){
                        if( cat.slug ==  itemcats[t] ){
                            //html += '<div class="categoryname">'+itemcats[t]+'</div> ';
                            if( JSON.stringify( cat['parent'] ) == "2" ){  // person names first
                                html = '<a href="#cats='+cat['slug']+'" class="categoryname catbutton '+cat['slug']+'" data-cats="'+cat['slug']+'">'+cat['name']+'</a> ' + html;
                            }else{
                                html += '<a href="#cats='+cat['slug']+'" class="categoryname catbutton '+cat['slug']+'" data-cats="'+cat['slug']+'">'+cat['name']+'</a> ';
                            }

                            //html += JSON.stringify( cat['parent'] );
                            //html += JSON.stringify( site_data['catdata'] );
                        }
                    });

                    //html += '<a href="#cats='+cats[i]['slug']+'" class="categoryname catbutton '+cats[i]['slug']+'" data-cats="'+cats[i]['slug']+'">'+cats[i]['cat_name']+'</a> ';
                }
            }



            //$(cats).each(function( idx, cat){
                /*for(t=0;t<itemcats.length;t++){
                    if( cats[i]['slug'] == itemcats[t] ){
                        html += '<a href="#cats='+cats[i]['slug']+'" class="catbutton '+cats[i]['slug']+'" data-cat="'+cats[i]['slug']+'">'+cats[i]['name']+'</a> ';
                    }
                }*/

            return html;
        };

            // display tag menu
            var markupHTMLTagMenu = function( tags ){
                var html = '';
                for(i=0;i<tags.length;i++){
                    html += '<a href="#tags='+tags[i]['slug']+'" class="tagbutton '+tags[i]['slug']+'" data-tag="'+tags[i]['slug']+'">'+tags[i]['name']+'</a>';
                }
                $('#rightmenucontainer .contentbox').html( html );

                if( $('#rightmenucontainer #tagmenu').length < 1 ){
                    $('#rightmenucontainer .contentbox').prepend('<div id="tagmenu"></div>');
                }
            };





            function activateIsotope(){

            // init isotope
            //filterClass

            var container = $('#rightcontentcontainer .contentbox');
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

            var w = container.innerWidth()/4;
            container
            .isotope('reloadItems')
            .isotope('updateSortData')
            .isotope({ masonry: { columnWidth: w } })
            .isotope({ filter: filterClass })
            .isotope({
                sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
                sortAscending: {
                    //byCategory: true, // name ascendingly
                    byTagWeight: false, // weight descendingly
                },
            }).isotope( 'layout' );

			/* if more content loaded use:
            .isotope('updateSortData')
	        .isotope('reloadItems')*/

            };

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
                    if( $(obj).parent('#rightcontentcontainer .contentbox').length  ){
                        $(obj).addClass(newSize);
                    }

            }


            // order items by tagweight
            var applyTagWeight = function (){
                // calc match weight
                $('.item').each( function( idx, obj ){
                    calculateTagWeight( obj );
                });

                // order items by match weight
                 /*
                var container = $('#rightcontentcontainer .contentbox');
                var items = $.makeArray(container.children(".item"));
                items.sort(function(a, b) {
                  var textA = +$(a).find('.matchweight').text();
                  var textB = +$(b).find('.matchweight').text();
                  if (textA < textB) return 1;
                  if (textA > textB) return -1;
                  return 0;
                });
                container.empty();
                $.each(items, function( idx, obj) {
                    container.append(obj);
                });*/

                // order left menu items by match weight
                //if( $('body.articlemenu').length > 0 ){
                    var menu = $('#leftmenucontainer .contentbox');
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

                //}
                // TODO.. apply Masonry (isotope)
            }

            // On select clickable tags
            var applyTagSelection = function( ){


                tagfilter = [];
                //catfilter = [];
                postID = '';

                filterClass = '';

                // set Tag Menu
                $('#tagmenu').html('');
                $('.item .main').removeClass('active');

                $('#rightmenucontainer .contentbox > .tagbutton.selected').each( function(idx,obj){
                    $('#tagmenu').append( $(obj).clone() );
                    tagfilter.push( $(obj).data('tag') );
                });
                $('#tagmenu').append( '<a class="cleartags" href="#">X</a>' );

                // set Selected Tagbuttons Active
                $( '.tagbutton' ).removeClass( 'selected' );
                for(i=0;i<tagfilter.length;i++){
                    $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                }

                $('#rightmenuplaceholder .togglebox h4 .tagcount').html('');
                if( tagfilter.length > 0 ){
                    $('#rightmenuplaceholder .togglebox h4 .tagcount').html(' ['+tagfilter.length+']');
                }
                // order
                applyTagWeight();

                // hash
                setNewHash();

                var box = $('#rightcontentcontainer');
                var selected = $('#rightcontentcontainer .contentbox .selected').prepend();
                var container = $('#rightcontentcontainer .contentbox');



                if( !$.isFunction( 'isotope' ) ){
                    activateIsotope();
                }else{
                    container
                    .isotope('updateSortData')
                    .isotope({ filter: filterClass })
                    .isotope({
                        sortBy :'byTagWeight', //  [ 'byCategory', 'byTagWeight' ], //
                        sortAscending: {
                              //byCategory: true, // name ascendingly
                              byTagWeight: false, // weight descendingly
                        },
                    });
                }

                box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                    var w = container.innerWidth()/4;
                    //container.isotope('updateSortData')
                    container.isotope({ masonry: { columnWidth: w } });
                    container.isotope('layout');
                    //container.isotope('reLayout');
                });

                $('html, body').animate({scrollTop:0}, 400);
                //console.log(tagfilter);

            }

            // On select clickable cats
            var applyCatSelection = function( ){

                postID = '';
                // set Selected Catbuttons Active
                $( '.catbutton' ).removeClass( 'selected' );
                for(i=0;i<catfilter.length;i++){
                    $( '.catbutton.'+catfilter[i] ).addClass('selected');
                }
                // order
                applyTagWeight();
                // hash
                setNewHash();

                var box = $('#rightcontentcontainer');
                var selected = $('#rightcontentcontainer .contentbox .selected').prepend();
                var container = $('#rightcontentcontainer .contentbox');

                if( !$.isFunction( 'isotope' ) ){
                    activateIsotope();
                }else{
                    container
                    .isotope('updateSortData')
                    .isotope({ filter: filterClass })
                    .isotope({
                        sortBy : [ 'byCategory', 'byTagWeight' ], //'byTagWeight', //
                        sortAscending: {
                              byCategory: true, // name ascendingly
                              byTagWeight: false, // weight descendingly
                        },
                    })
                    .isotope('layout');
                }
                box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                    var w = container.innerWidth()/4;
                    container.isotope('updateSortData').isotope({ masonry: { columnWidth: w } }).isotope('layout');
                    //container.isotope('reLayout');
                });


                $('html, body').animate({scrollTop:0}, 400);
                //console.log(tagfilter);

            }


            // On select clickable Items
            var applyItemSelection = function(){

                if( $('.item.selected').data('tags').length > 0 ){

                    tagfilter = $('.item.selected').data('tags').split(',');
                    $('#tagmenu').empty();
                    $('.tagbutton').removeClass( 'selected' );
                    for(i=0;i<tagfilter.length;i++){
                        $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                    }
                    catfilter = $('.item.selected').data('cats').split(',');
                    postID = $('.item.selected').data('id');
                    filterClass = '';
                    if( tagfilter.length > 0 ){
                    filterClass = '.'+tagfilter.join(',.');
                    }
                    if( catfilter.length > 0 ){
                    filterClass += '.'+catfilter.join(',.');
                    }

                }else{
                    tagfilter = ['*'];
                }

                //console.log( tagfilter );
                //console.log( catfilter );
                //console.log( postID );

                // order by tags
                applyTagSelection();

            }

            var setOverviewSize = function( container ){

                var w = $('#topbar').width() + 50;
                var l =  $('#topbar').css('left');
                container.find('.contentbox').width( w );
            }

            var setReflectSize = function( container ){
                var w = $('#topbar').width();
                //var p = $('#topbar').position();
                var offset = $('#topbar').offset();
                //var l =  $('#topbar').css('left');
                var m = offset.left - $('#leftmenucontainer').width();
                container.find('.contentbox').width( w );
                container.find('.contentbox').css( 'margin-left', m );
                //alert(m);
            }



            // tour menu content
            var markupHTMLSlideContents = function( container ){

                setOverviewSize( container );

								/*
                //alert( container.find('.contentbox').html() );
                if( container.find('.contentbox #tourmenu').length < 1){

                    var m = $('<ul id="tourmenu"></ul>'); // menu container

                    container.find('.title').hide();


                    container.find('.itemcatbox').each( function( ){

                        var postid = $(this).parent().parent().attr('id');
                        var titlecontent = $('<li class="touroption" data-id="'+postid+'"></li>');

                        $(this).find('.categoryname').each( function( i, t ){
                            $(t).unwrap().clone().appendTo( titlecontent ); // menu option content
                        });
                        titlecontent.prependTo( m );
                    });

                    container.find('.contentbox').prepend(m);  //alert(m.html());
                    container.find('.contentbox').append('<div class="leftslidenav button"><span> < </span></div><div class="rightslidenav button"><span> > </span></div>');

                }
								*/

                container.find('.item').each( function( ){

                    var postcontent = $(objlist[$(this).data('id')].content);
                    var box = $(this);
                    //$(this).find('h1').prependTo( $(this) );

                    if( box.find('.introslides').length < 1){

                        //box.find('.intro .title').remove();
                        box.prepend( postcontent.get(0).outerHTML );
                        box.find('.intro .coverimage').removeClass('coverimage').addClass('slide'); //

                        postcontent.find('img,iframe').each( function( i, m ){
                            var mediabox = $('<div class="slide"></div>');
                            mediabox.append(m);
                            box.find('.intro').append(mediabox);
                        });

                        box.find( ".slide" ).wrapAll( '<div class="introslides" />' );
                        box.find( '.categoryname').wrapAll('<div class="itemcatbox" />');

                    }

                });


                container.addClass('active');
								/*
                var tmenu  = container.find('#tourmenu li').removeClass('active');
                var items  = container.find('.contentbox .item').removeClass('active');
                tmenu.first().addClass('active');
                items.last().addClass('active');
                $('.selected').removeClass('selected');
                container.find('.active').addClass('selected');

                var slides  = container.find('.contentbox .item.active .slide').removeClass('active');
                slides.last().addClass('active');
								*/
            }

						/*
            $('body').on('click','#tourmenu li', function(){

                    var container = $('#maincontentcontainer');
                    if(event.preventDefault){
                        event.preventDefault();
                    }else{
                        event.returnValue = false;
                    }
                    if( $('#tourmenu').hasClass('open') ){

                        $('#tourmenu').removeClass('open');
                        $('.selected').removeClass('selected');
                        $('.active').removeClass('active');
                        $(this).addClass('active');
                        var itemid = '#'+$(this).data('id');
                        container.find(itemid).addClass('active');
                        container.find('.active').addClass('selected');
                        console.log(itemid);

                        $('.slide.active').removeClass('active');
                        var slides  = container.find('.contentbox .item.active .slide');
                        slides.first().addClass('active');

                        $(".overview #maincontentcontainer .leftslidenav, .overview #maincontentcontainer .rightslidenav, .overview #maincontentcontainer .infotoggle").fadeIn(500);
                    }else{
                        $(".overview #maincontentcontainer .leftslidenav, .overview #maincontentcontainer .rightslidenav, .overview #maincontentcontainer .infotoggle").fadeOut(50);
                        $('#tourmenu').addClass('open');
                    }
                });
								*/
/*
            $('body').on( 'click', '#maincontentcontainer .contentbox .rightslidenav', function(event){
                    if(event.preventDefault){
                        event.preventDefault();
                    }else{
                        event.returnValue = false;
                    }

                    var container = $('#maincontentcontainer');
                    var slides  = container.find('.contentbox .item.active .slide');
                    $('.item.active .slide.selected').removeClass('selected');
                    container.find('.introslides .slide.active').removeClass('active').addClass('oldActive');
                    if ( container.find('.introslides .slide.oldActive').is(':first-child')) {
                        slides.last().addClass('active').css({ 'float':'left' });
                    }else{
                        container.find('.introslides .slide.oldActive').prev().addClass('active').css({ 'float':'right' });
                    }
                    container.find('.introslides .slide.oldActive').css({ 'float':'left' }).removeClass('oldActive');
                    container.find('.introslides .slide.active').addClass('selected');


                });

                $('body').on( 'click', '#maincontentcontainer .contentbox .leftslidenav', function(event){
                    if(event.preventDefault){
                        event.preventDefault();
                    }else{
                        event.returnValue = false;
                    }
                    var container = $('#maincontentcontainer');
                    var slides  = container.find('.contentbox .item.active .slide');
                    $('.item.active .slide.selected').removeClass('selected');
                    container.find('.introslides .slide.active').removeClass('active').addClass('oldActive');
                    if ( container.find('.introslides .slide.oldActive').is(':last-child') ) {
                        slides.first().css({ 'float':'left' }).addClass('active');
                    }else{
                        container.find('.introslides .slide.oldActive').next().css({ 'float':'left' }).addClass('active');
                    }
                    container.find('.introslides .slide.oldActive').css({ 'float':'right' }).removeClass('oldActive');
                    container.find('.introslides .slide.active').addClass('selected');


                    //console.log('click left');
                    /* after animated
                    var box = container.find('.introslides .slide.selected');
                     //box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                            var boxheight = container.height();
                            var topmargin = container.find('h1:first-child').height();
                            var arrowpos = boxheight / 2;
                            container.find(".rightslidenav,.contentbox .leftslidenav").css({ 'margin-top' : arrowpos+'px' });
                     //});
                        */
                //});




            // On select clickable LeftMenu Items
            var applyLeftContent = function(){

                    // all items
                    $('.item').removeClass('selected active');
                    $('.item .main .textbox').html('');

                    // selected
                    var content = $('#leftmenucontainer .menubutton:first').clone();
                    $('#leftmenucontainer .menubutton:first').addClass('active');

                    content.find('.main .textbox').html( objlist[content.data('id')].content );
                    content.find('.main').addClass('active');

                    var boxheight = $(window).height() - $('#topcontentcontainer').height()  + 'px';
                    $('.theory #leftcontentcontainer .contentbox').css({ 'min-height': boxheight, 'max-height': boxheight  });

                    $('#leftcontentcontainer .contentbox').html( content.removeClass('menubutton').addClass('selected') );

                    $('#leftcontentcontainer .contentbox .title, #leftcontentcontainer .contentbox .main').insertAfter('#leftcontentcontainer .contentbox .intro');


                    if( $('body').hasClass("theory") > 0 ){
                        var box = $('#leftcontentcontainer');
                        box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                            setReflectSize( $('.theory #leftcontentcontainer') );
                        });
                    }

                    applyItemSelection();

            }





            // toggle left menu
            $('body').on('click', '#leftmenucontainer .togglebox', function(){

                //$('#infocontainer').slideUp(200).removeClass('active');
                $('#infocontainer').slideUp(200 , function() {
                    $('#topspace').removeClass('active');
                });
                $('#topspace .closebutton').removeClass('active');
                $('body').toggleClass('articlemenu');

                if( $('body').hasClass("theory") > 0 ){
                    /*var menu = $('.theory #leftmenucontainer');
                    menu.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                        setReflectSize( $('.theory #leftcontentcontainer') );
                    });*/
                    var cc = $('body').width() / 100 * 12; // 12% margin left
                    var oc = $('body').width() / 100 * 18; // 18% margin left
                    var om = $('#topbar').offset();
                    var nm = 0;
                    if( $('body').hasClass("articlemenu") > 0 ){
                       var nm = om.left - oc;
                    }else{
                       var nm = om.left - cc;
                    }
                    $('.theory #leftcontentcontainer .contentbox').css('margin-left', nm );
                }


            });

            // toggle right menu
            $('body').on('click', '#rightmenuplaceholder .togglebox', function(){
                //$('#infocontainer').slideUp(200).removeClass('active');
                $('#infocontainer').slideUp(200 , function() {
                    $('#topspace').removeClass('active');
                });
                $('#topspace .closebutton').removeClass('active');
                $('body').toggleClass('filtermenu');
            });

            // toggle tag from main menu
            $('body').on('click', '#rightmenucontainer .tagbutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                // contentfilter
                catfilter = [];
                $( '.item' ).removeClass( 'selected' );
                $(this).toggleClass('selected');

                // order by tags
                applyTagSelection( );

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');
                $('body').removeClass('overview theory');
                $('body').addClass('practice');
            });

            // toggle tag from item or right menu (tag deselect button)
            $('body').on('click', '#tagmenu .tagbutton, .item .tagbutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                // contentfilter
                $( '.item' ).removeClass( 'selected' );
                var el = $('#rightmenucontainer .contentbox > .tagbutton.'+ $(this).data('tag') );
                //if( !$('body').hasClass('overview') ){
                    el.toggleClass('selected');
                //}

                // order by tags
                applyTagSelection();

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');

            });

            // toggle tag from item or right menu (tag deselect button)
            $('body').on('click', '#tagmenu .cleartags', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                // contentfilter
                $( '.item' ).removeClass( 'selected' );
                $( '.tagbutton' ).removeClass( 'selected' );
                //var el = $('#rightmenucontainer .contentbox > .tagbutton.'+ $(this).data('tag') );
                //el.toggleClass('selected');

                // order by tags
                applyTagSelection();

                $('.cleartags').remove();

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');
            });


            var getCatItemTags = function( catslug ){
                var posts = JSON.parse(site_data['postdata']);
                var catposts = [];
                var cattags = [];
                 var ct =  [];
                var tags = '';
                for(i=0;i<posts.length;i++){
                    //if( $.inArray( catslug, posts[i]['cats'][0] ) !== -1 ){
                        //catposts.push(posts[i]['cats']);
                    //}
                    var t = 0;
                    for(c=0;c<posts[i]['cats'].length;c++){
                        if( posts[i]['cats'][c] == catslug ){
                            catposts.push(posts[i]);
                            for(g=0;g<posts[i]['tags'].length;g++){
                                if( !cattags[ posts[i]['tags'][g] ] ){
                                    cattags[ posts[i]['tags'][g] ] = posts[i]['tags'][g];
                                    ct.push(posts[i]['tags'][g]);
                                    tags =  ct.join(',');
                                }
                            }
                        }
                    }
                }
                //
                console.log(tags);
                return tags;
            }

            $('body').on('click', '.item .catbutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                // contentfilter
                $( '.item,.tagbutton,.catbutton' ).removeClass( 'selected' );

                catfilter = [$(this).data('cats')];
                filterClass = '.'+$(this).data('cats')+'';

                var ctags = getCatItemTags( catfilter );

                // category item reletated tags
                if( $(this).parent().parent().data('tags') != null ){
                    var tags = $(this).parent().parent().data('tags');
                    tagfilter = tags.split(',');
                }else if( $(this).parent().parent().parent().data('tags') != null ){
                    var tags = $(this).parent().parent().parent().data('tags');
                    tagfilter = tags.split(',');
                }else if(ctags.length > 0 ){
                    tagfilter = ctags.split(',');
                }else{
                    tagfilter = [];
                }
                if( tagfilter.length > 0 ){
                    // set Selected Tagbuttons Active
                    $( '.tagbutton' ).removeClass( 'selected' );
                    for(i=0;i<tagfilter.length;i++){
                        $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                    }
                    $('#tagmenu').html('');
                    $('.item .main').removeClass('active');
                    $('#rightmenucontainer .contentbox > .tagbutton.selected').each( function(idx,obj){
                        $('#tagmenu').append( $(obj).clone() );
                    });
                    $('#tagmenu').append( '<a class="cleartags" href="#">X</a>' );
                    $('#rightmenuplaceholder .togglebox h4 .tagcount').html('');
                    $('#rightmenuplaceholder .togglebox h4 .tagcount').html(' ['+tagfilter.length+']');
                }
                //console.log( filterClass );
                //console.log( tagfilter );

                applyCatSelection();

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');

            });



            // button left menu
            $('body').on('click', '#leftmenucontainer .menubutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');

                $('body').removeClass( 'overview practice' );
                $('body').addClass('theory');

                $(this).prependTo($(this).parent());
                $('html, body').animate({scrollTop:0}, 400);

                // order by selected button id
                applyLeftContent();
            });

            // item right content click
            $('body').on('click', '#rightcontentcontainer .item .itemcontent .intro', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                // display
                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');

                $('body').removeClass('overview theory');
                $('body').addClass('practice');

                // contentfilter
                var selecteditem =  $(this).parent().parent();
                selecteditem.prependTo( selecteditem.parent() );
                $('html, body').animate({scrollTop:0}, 400);
                $('.item').removeClass('selected active');
                $('.item .main .textbox').empty();
                selecteditem.addClass('selected active');

                /*
                var videoBox = '';
                var content = objlist[$(this).parent().parent().data('id')].content;
                var contentHolder = document.createElement('div');
                contentHolder.innerHTML = content;
                if( typeof( contentHolder.getElementsByTagName("iframe")[0] ) !== 'undefined'
                   && contentHolder.getElementsByTagName("iframe")[0] != ''
                   && contentHolder.getElementsByTagName("iframe")[0].outerHTML != 'undefined' ){
                    videoBox = contentHolder.getElementsByTagName("iframe")[0].outerHTML;

                    selecteditem.find('.intro').append( videoBox );

                    selecteditem.find('.coverimage').slideUp();
                    selecteditem.find('.intro iframe').slideDown();

                }
                */

                /*
                var content = objlist[$(this).parent().parent().data('id')].content;
                var imgs =  [];
                // coverimage
                imgs.push( selecteditem.find('.intro img').attr('src') );
                // content images

                $(content).find('img').each(function(){
                    imgs.push( $(this).attr('src') );
                });

                // add gallery slide show
                if( selecteditem.find('.imageslides').length < 1 ){

                    var gallerybox =  $('<div class="imageslides" />');

                    $.each( imgs, function(){
                        gallerybox.append('<img src="'+this+'">');
                    });
                    selecteditem.find('.intro').prepend(gallerybox);
                    //'+ JSON.stringify( imgs ) +
                }
                */


                // add gallery slide show
                var content = objlist[$(this).parent().parent().data('id')].content;
                var gallerybox =  $('<div class="imageslides" />');
                var countimg = 0;
                selecteditem.removeClass('gallery');

                $(content).find('img').each(function( ix, obj ){
                    gallerybox.append( obj );
                    countimg++;
                });
                selecteditem.find('.imagenav').remove();

                var nav = '<div class="imagenav"><div class="navleft"><span>left</span></div><div class="navright"><span>right</span></div></div>';
                if( selecteditem.find('.imageslides').length < 1 && countimg > 1){
                    selecteditem.find('.coverimage img').clone().addClass('active').prependTo( selecteditem.find('.imageslides') );
                    selecteditem.find('.intro').prepend( gallerybox );
                }
                if( selecteditem.find('.imageslides').length > 0){
                    selecteditem.addClass('gallery');
                    selecteditem.find('.imageslides').prependTo( selecteditem.find('.intro') );
                    selecteditem.find('.intro').prepend( nav );
                    setImageSlideArrowHeight( selecteditem );
                }
                applyItemSelection();

            });



                $('body').on('click', '.navleft, .navright', function(event){
                    event.stopPropagation();
                    var currentActive = $(this).parent().parent().find('.imageslides img.active').removeClass('active');
                    if($(this).hasClass('.navleft')){
                        var nextTarget = currentActive.prev('img');
                        if( nextTarget.length == 0 ){
                            nextTarget = $(this).parent().parent().find('.imageslides img:last');
                        }
                        if( nextTarget.attr('src') == $(this).parent().parent().find('.coverimage .stage img').attr('src') ){
                            var nextTarget = nextTarget.prev('img');
                        }
                    }else{
                         var nextTarget = currentActive.next('img');
                        if( nextTarget.length == 0 ){
                            nextTarget = $(this).parent().parent().find('.imageslides img:first');
                        }
                        if( nextTarget.attr('src') == $(this).parent().parent().find('.coverimage .stage img').attr('src') ){
                            var nextTarget = nextTarget.next('img');
                        }
                    }
                    nextTarget.addClass('active');

                    var imgurl = nextTarget.attr('src');
                    //console.log(imgurl);
                    $(this).parent().parent().find('.coverimage .stage').fadeOut(300, function(){

                        $(this).parent().parent().find('.coverimage .stage img').replaceWith('<img src="'+imgurl+'" />');

                    }).fadeIn(200, function(){
                        setImageSlideArrowHeight( $(this).parent().parent() );
                        $('#rightcontentcontainer .contentbox').isotope('layout');
                    });

                });

                function setImageSlideArrowHeight( obj ){

                    var arrowpos = obj.find('.coverimage img').height() / 2;
                    obj.find(".navleft,.navright").css({ 'margin-top' : arrowpos+'px' });
                    //$(".item.active .intro .imagenav .navleft, .item.active .intro .imagenav .navright").css({ 'margin-top' : arrowpos+'px' });

                }



            $('body').on('click', '.item .button', function(e){

                e.stopPropagation();

                $(this).toggleClass('active');

                $(this).parent().find('.imagenav').fadeToggle();

                if( $(this).parent().find('.main .textbox').html() == ''){
                    $('.item .main .textbox').empty();
                    $(this).parent().find('.main .textbox').html( objlist[$(this).parent().data('id')].content );

                    if( $(this).parent('div.overviewcontent').length ){ // check to remove media from text
                        $(this).parent().find('.main .textbox img,.main .textbox .wp-caption, .main .textbox iframe').remove();
                    }
                    $('.main .textbox p').each(function() {
                        var $this = $(this);
                        if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                            $this.remove();
                    });

                    $(this).parent().find('.main').addClass('active');
                }else{
                    $(this).parent().find('.main').removeClass('active');
                    $('.item .main .textbox').empty();
                }

                if( $(this).hasClass('active') ){
                    $(".overview #maincontentcontainer .leftslidenav, .overview #maincontentcontainer .rightslidenav").fadeOut(50);
                }else{
                    $(".overview #maincontentcontainer .leftslidenav, .overview #maincontentcontainer .rightslidenav").fadeIn(500);
                }


            });

            $('body').on('click', '.item .optionfullscreen', function(e){
                e.stopPropagation();
                var fscrobj = $(this).parent().parent().parent().parent().parent();
                fscrobj.toggleClass('fullscreen');
                setTimeout(function(){
                    setImageSlideArrowHeight( fscrobj );
                    $('#rightcontentcontainer .contentbox').isotope('layout');
                }, 400 );


            });

             $('body').on('click', '#topbar .leftside .menubutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                if( $('#infocontainer').hasClass( 'active' ) ){
                    $('#topspace .closebutton').trigger('click');
                    $('#infocontainer .contentpage').removeClass( 'active' );
                }else{
                    $('#topcontent').css({ 'max-height': $(window).height() - $('#topcontentcontainer').height()  + 'px' });

                    $('#infomenu li:first-child a').addClass('active');

                    $('#topspace, #topspace .closebutton').addClass( 'active' );

										// todo 2022
										//if( $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').data('id') && objlist[ $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').data('id') ].content != '' ){
                    $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').addClass( 'active' ).removeClass( 'nonactive' ).find('.main .textbox').html( objlist[ $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').data('id') ].content );
										//}
                    markupInfoPages();
                    $("#infomenu, #infocontent").css({ 'width':  $("#topbar").innerWidth() });

                    $('#infocontainer').addClass( 'active' );
                        $('#infocontainer').slideDown( 300, function(){
                    });
                }
             });


            $('body').on('click', '#topspace .closebutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer .contentpage.active, #infomenu a.active').removeClass('active');
                $('#topspace, #topspace .closebutton').removeClass( 'active' );

                $('#infocontainer').slideUp( 300, function(){
                    $('#infocontainer').removeClass( 'active' );

										$('body').removeClass( 'theory overview articlemenu' );
										applyTagSelection();
										$('body').addClass('practice');

                });

             });

            /*
            // toggle slide info content
            $('body').on('click', '#topbar .leftside .menubutton, #topspace .closebutton', function( event ){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer .contentpage.active, #infomenu a.active').removeClass('active');
                $('#infomenu li:first-child a').addClass('active');
                $('#topspace, #topspace .closebutton').toggleClass( 'active' );

                $('#topcontent').css({ 'max-height': $(window).height() - $('#topcontentcontainer').height()  + 'px' });

                $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').addClass( 'active' )
                .find('.main .textbox').html( objlist[ $('#infocontainer .contentpage[data-link="'+$('#infomenu ul li:first-child a').attr('href')+'"]').data('id') ].content );

                $('#infocontainer').toggleClass( 'active' );
                //$('#infocontainer .contentpage.active');
                // section container (selector)
                markupInfoPages();
                $("#infomenu, #infocontent").css({ 'width':  $("#topbar").innerWidth() });
                $('#infocontainer').slideToggle(300);
            });
            */

            function markupInfoPages(){
                //$('.section-intro img').each( function( x , obj ){
                $('#infocontainer .contentpage.active .section-intro img').each( function(){
                    var url = $(this).attr('src');
                    var img = $('<div class="imgwrap"></div>').css({
                        'background-image': 'url("' + url + '")'
                    });
                    $(this).parent().prepend(img);
                });

                $('.section-container .section').on('click', function(ev) {

                  var el = $(this);
                  var speed = 100;
                  $('.section-container').addClass('active'); // main active
                  $('.section-container .section').removeClass('active');
                  el.addClass('active').appendTo(el.parent()); // section active
                  var c = el.find('.section-content').clone();
                  el.parent().parent().find('.selectedcontentsection').slideUp(speed, function() {
                    $(this).html(c).slideDown(speed);
                  });

                    el.parent().parent().parent().parent().parent().animate({
                        scrollTop: el.offset().top
                    }, 2000);

                });

            }




            // toggle info pages
            $('body').on('click', '#infomenu ul li a', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer .contentpage.active, #infomenu a.active').removeClass('active');

								// todo 2022
                $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').find('.main .textbox').html( objlist[ $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').data('id') ].content );

								$(this).addClass('active');
                $('#infocontainer .contentpage[data-link="'+$(this).attr('href')+'"]').removeClass( 'nonactive' ).addClass('active');

                markupInfoPages();
            });



            // toggle slide main content
            $('body').on('click', '.switchbutton .leftswapbutton, .switchbutton .rightswapbutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');

                if( $('body').hasClass('overview') ){

                    $('body').removeClass( 'overview filtermenu' );

                    // order by (first) left button id
                    applyLeftContent();
                    $('body').addClass( 'articlemenu theory');

                }else if( $('body').hasClass('practice') ){

                    $('body').removeClass( 'practice filtermenu' );

                    applyLeftContent();
                    $('body').addClass( 'articlemenu theory');

                }else if( $('body').hasClass('theory') ){

                    $('body').removeClass( 'theory overview articlemenu' );
                    applyTagSelection();
                    $('body').addClass('practice');

                }

                if( $('body').hasClass("theory") > 0 ){
                    var box = $('#leftcontentcontainer');
                    box.one('webkitTransitionEnd otransitionend oTransitionEnd msTransisitonEnd transitionend', function(e){
                        setReflectSize( $('.theory #leftcontentcontainer') );
                    });
                }

            });





            // button home start content
            $('body').on('click', '#topbar .leftside .custom-logo-link', function( event ){

								/*
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation();

                $('#infocontainer').slideUp(200).removeClass('active');
                $('#topspace,#topspace .closebutton').removeClass('active');
								*/

                // set Data
                /*if( site_data['postdata'].length > 0 ){
                    markupHTMLSlideContents( $('#maincontentcontainer') );
                }*/

                $('body').removeClass( 'theory practice articlemenu filtermenu' );

                $('body').addClass('overview');
                markupHTMLSlideContents( $('#maincontentcontainer') );

            });








            /*
             * Search box prefetch titles & tags
             */


            var emptysearchtext = 'Zoek';
            var emptyhinttext = '';

            if( $('#searchhints').length < 1 ){
              $('<div id="searchhints"><div class="resultcontent">'+emptyhinttext+'</div></div>').insertAfter('#searchbox');
            }

            //$('#searchhints').css({ 'width': $('#searchbox').outerWidth() });
            $('#searchbox').val('');
            $('#searchbox').attr('placeholder', emptysearchtext);

            //$('#searchhints').addClass('active');


            $('body').on('mouseover focus', '#searchbox, #searchhints', function(event){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                event.stopPropagation()

                $('#searchhints').addClass('active').css({ 'width':  $("#topbar").innerWidth() });

                //setSearchHints();
            });

            $('body').on('blur', '#searchbox', function(event){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }

                if( $('#searchbox:focus').length == 0 && $('#searchhints:hover').length == 0){
                    $('#searchbox').css({ 'background-color': 'white' });
                    $('#searchhints .resultcontent').html(emptyhinttext);
                    $('#searchhints').removeClass('active');
                }
            });

            $('body').on('mouseout', '#searchhints', function(event){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }

                if( $('#searchbox:focus').length == 0 ){//&& $('#searchhints:hover').length == 0
                    $('#searchhints').removeClass('active');
                }
            });

            $('body').on( 'keyup', '#searchbox', function(event){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                setSearchHints();

            });

            function setSearchHints(){
              var searchstring = $('#searchbox').val();
              var searchresult = '';
              if( searchstring.length < 1 ){
                searchresult = emptyhinttext;
                }else{
                searchresult = getSearchResult( searchstring );
              }
              $('#searchhints .resultcontent').html( searchresult );
            }

            function getSearchResult( searchstring ){

                var alltags = JSON.parse(site_data['tagdata']); //root.filterdata.alltags;
                var allTitles = objlist;
                //var catfilter = root.filterdata.allCats;

                var related = searchstring;
                var unspaced = searchstring.split(' ');

                // get tags by letter/word
                var taglist = Array();
                var titlelist = Array();

                if( unspaced.length > 0 ){

                    // match tags
                    related = '<ul class="tagresults">';
                    related += '<li class="listheader"><h5>Labels<h5></li>';
                    $.each( alltags, function( idx, tag ){
                        var tagstring = tag.name;
                        $.each( unspaced, function( inx, str ) {
                            var r = tagstring.indexOf(str);
                            if( r > -1  && str != ' ' && str != ''){
                                //console.log( tag +' vs '+ str );
                                if( $.inArray( tag.name , taglist ) < 0 ){ // no double

                                    taglist.push( tag.name );
                                    related += '<li><a href="#tags='+tag.slug+'" class="tagbutton ';
                                    if( $.inArray( tag.name , tagfilter ) > -1 ){
                                        related += 'selected ';
                                    }
                                    related += ''+tag.slug+'" data-tag="'+tag.slug+'">'+tag.name+'</a></li>';

                                }
                            }

                        });
                    });
                    related += '</ul>';

                    // match titles
                    related += '<ul class="titleresults">';
                    related += '<li class="listheader"><h5>Praktijk- & Veldwerk<h5></li>';

                    var theorysearch = '';
                    theorysearch += '<ul class="theoryresults">';
                    theorysearch += '<li class="listheader"><h5>Dialoog en Reflectie<h5></li>';
                    //console.log( JSON.stringify(site_data['postdata'] ) );

                    var itemlist = JSON.parse(site_data['postdata'] );
                    $.each( itemlist, function( idx, obj ){
                        var titlestring = obj.title.toLowerCase();
                        var words = titlestring.split(' '); // split title in words

                        $.each( unspaced, function( inx, str ) { // each search key

                            $.each( words, function( ix, word ) {

                                var r = word.indexOf(str);

                                if( r > -1  && str != ' ' && str != ''){

                                    console.log( 'searched: '+ str + ' in word '+word );

                                    if( $.inArray( obj.title , titlelist ) < 0 ){ // no double
                                        var type = 0;
                                        $(obj.cats).each(function( x , cat ){
                                            if( cat == theoryCategory ){
                                                type = 1; // left content
                                            }else if( cat == overviewCategory ){
                                                type = 2; // main/start content
                                            }
                                        });
                                        if( type == 0 ){
                                            titlelist.push( obj.title );
                                            related += '<li><a href="#id='+obj.id+'" class="titlebutton" ';
                                            related += 'data-id="'+obj.id+'">'+obj.title+'</a></li>';
                                        }
                                        if( type == 1 ){
                                            titlelist.push( obj.title );
                                            theorysearch += '<li><a href="#id='+obj.id+'" class="titlebutton" ';
                                            theorysearch += 'data-id="'+obj.id+'">'+obj.title+'</a></li>';
                                        }
                                    }
                                }

                            });

                        });
                    });
                    related += '</ul>' + theorysearch + '</ul><div class="clr"></div>';
                }

                return related;

            };


            $('body').on('click', '#searchhints .resultcontent .tagbutton', function( event ){

                event.stopPropagation();
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }

                tagfilter = [];

                $( '.tagbutton' ).removeClass('selected');
                $( '.tagbutton.'+$(this).data('tag') ).addClass('selected');
                //$( '.tagbutton.'+$(this).data('tag') ).toggleClass('selected');

                if( !$('body').hasClass('practice') ){
                    $('#infocontainer').slideUp(200).removeClass('active');
                    $('#topspace,#topspace .closebutton').removeClass('active');
                    $('body').removeClass( 'theory overview articlemenu' );
                    applyTagSelection();
                    $('body').addClass('practice');
                }else{
                    applyTagSelection();
                }

            });

            $('body').on('click', '#searchhints .resultcontent .titlebutton', function( event ){

                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }

                var itemid = $(this).data('id');
                console.log( itemid );

                if( $(this).parent().parent().hasClass('theoryresults') ){
                    $('#leftmenucontainer #post-'+itemid+' .itemcontent .intro').trigger('click');
                }else{
                    $('#rightcontentcontainer #post-'+itemid+' .itemcontent .intro').trigger('click');
                }
                /*
                if( !$('body').hasClass('practice') ){
                    $('#infocontainer').slideUp(200).removeClass('active');
                    $('#topspace,#topspace .closebutton').removeClass('active');
                    $('body').removeClass( 'theory overview articlemenu' );
                    $('#rightcontentcontainer #post-'+itemid).trigger('click');
                }else{
                    $('#rightcontentcontainer #post-'+itemid).trigger('click');
                }*/

            });





            $('body').on('click', '.item .intro, #leftmenucontainer, #rightmenucontainer, #leftcontentcontainer, #rightcontentcontainer, #maincontentcontainer', function( event ){
                $('.item').removeClass('fullscreen');
                $('#rightcontentcontainer .contentbox').isotope('layout');
            });



            /** Init
             * load, detect content direction and interact
             */
            function smallScreenMessage(){
                if( $(window).width() < 1180  ){ 
                    //$('#pageloader').fadeOut(200);
                  	//  $('#pagecontainer').fadeOut(300);
                    //$('#messageOverlay').fadeIn(300);
										$('body').addClass('mobile');
                }else{
                    //$('#pagecontainer').fadeIn(300);
                    //$('#messageOverlay').fadeOut(300);
										$('body').removeClass('mobile');
                }
            }
            smallScreenMessage();

            //$('body').removeClass('overview theory');

            // $('body').addClass('theory'),$('body').addClass('practice'),$('body').addClass('articlemenu'),$('body').addClass('filtermenu');
            if(window.location.hash){
                var hashvars = getHashUrlVars();
                if( hashvars.tags  ){
                    tagfilter = hashvars.tags.split(',');
                }
                if( hashvars.cats  ){
                    catfilter = hashvars.cats.split(',');
                }
                if( hashvars.pid && hashvars.pid != '' && hashvars.pid != 'undefined' && hashvars.pid != typeof undefined){
                    postID = hashvars.pid;
                }
            }

            // set Data
            if( site_data['postdata'].length > 0 ){
                markupHTMLContent( JSON.parse( site_data['postdata']) );
                //if( !hashvars || typeof hashvars == undefined || ( !hashvars.tags &&  !hashvars.cats) ){ // hashvars.pid
                markupHTMLSlideContents( $('#maincontentcontainer') );
                //}
            }

            if( site_data['tagdata'].length > 0 ){
                markupHTMLTagMenu( JSON.parse(site_data['tagdata']) );
            }


            // on images loaded
            $('body').imagesLoaded( function( instance ) {

                activateIsotope();
                if( typeof( hashvars ) !== 'undefined' && (hashvars.tags || hashvars.cats  || hashvars.pid ) ){ // hashvars.pid

                    if( hashvars.tags  ){
                        tagfilter = hashvars.tags.split(',');
                    }
                    if( hashvars.cats  ){
                        catfilter = hashvars.cats.split(',');
                    }

                    $('#tagmenu').empty();
                    $('.tagbutton').removeClass( 'selected' );
                    for(i=0;i<tagfilter.length;i++){
                        $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                    }

                    filterClass = '';
                    if( tagfilter.length > 0 ){
                        filterClass = '.'+tagfilter.join(',.');
                    }
                    if( catfilter.length > 0 ){
                        filterClass += '.'+catfilter.join(',.');
                    }

                    applyTagSelection();

                    $('.cleartags').remove();

                    // display
                    $('#infocontainer').hide().removeClass('active'); //$('#infocontainer').slideUp(200).removeClass('active');
                    $('#topspace,#topspace .closebutton').removeClass('active');
                    $('body').removeClass('startpage');
                    $('body').addClass('practice');

                }else{

                    $('body').removeClass('startpage');
                    $('body').addClass('practice'); //$('body').addClass('overview');

										// start settings
										tagfilter = ['zee','plaats','werk','land'];
										$('#tagmenu').empty();
                    $('.tagbutton').removeClass( 'selected' );
                    for(i=0;i<tagfilter.length;i++){
                        $( '.tagbutton.'+tagfilter[i] ).addClass('selected');
                    }

										setNewHash();
										applyTagSelection();

                }

                /*
								$('#topbar .leftside .menubutton').trigger('click');
                $('#pageloader').remove();
                console.log('Page successfully loaded');
								*/
								$('#leftmenucontainer .togglebox').trigger('click');
                setTimeout( function(){
									$('#topbar .leftside .menubutton').trigger('click');
	                $('#pageloader').remove();
	                console.log('Page successfully loaded');
								},200);

            });




            /** on resize */
            var resizeId;
            $(window).resize(function() {
              clearTimeout(resizeId);
              resizeId = setTimeout(doneGlobalResizing, 20);
            });

            function doneGlobalResizing(){


                    // do something after resizing iss done
                    var container = $('#rightcontentcontainer .contentbox');
                    var w = container.innerWidth()/4;
                    container.isotope({ masonry: { columnWidth: w } }).isotope( 'layout' );
                    setOverviewSize( $('#maincontentcontainer') );
                    setReflectSize( $('.theory #leftcontentcontainer') );

                    smallScreenMessage();

            }


	});
/*
$(document).ajaxStart(function() {});
$(document).ajaxComplete(function() { // http://api.jquery.com/ajaxstop/
});
*/
});
