
jQuery( function($) {

  var emptyhinttext = '';
  var articlecategory = 'artikelen';
  var overviewcategory = 'bulletin';
  //$(document).ready(function(){

    $('body').on('mouseover focus', '#searchbox, #searchhints', function(event){
      if(event.preventDefault){
        event.preventDefault();
      }else{
        event.returnValue = false;
      }
      event.stopPropagation()

      $('#searchhints').addClass('active').css({ 'width':  $("#topbar .placeholder").innerWidth() });
      //setSearchHints();
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

      prevtags = tagfilter;
      tagfilter = [];
      prevcats = catfilter;
      catfilter = [];

      var searchtags = alltags;
      var allTitles = postdata;
      var related = searchstring;
      var unspaced = searchstring.split(' ');

      // get tags by letter/word
      var taggroup = Array();
      var titlegroup = Array();

      if( unspaced.length > 0 ){ // separated strings check

        related = '';

        let taghtml = '';
        taghtml = '<ul class="tagresults">';
        taghtml += '<li class="listheader"><h5>Labels</h5></li>';
        //alert( JSON.stringify(searchtags));
        $.each( searchtags, function( idx, tag ){
          let tagstring = tag.name;
          $.each( unspaced, function( inx, str ) {
            var r = tagstring.indexOf(str);
            if( r > -1  && str != ' ' && str != ''){
            //console.log( tag +' vs '+ str );
              if( $.inArray( tag.name , taggroup ) < 0 ){ // no double
                taggroup.push( tag.name );
                taghtml += '<li><a href="/tags/'+tag.slug+'" class="tagbutton ';
                if( $.inArray( tag.name , tagfilter ) > -1 ){
                  taghtml += 'selected ';
                }
                taghtml += ''+tag.slug+'" data-tag="'+tag.slug+'">'+tag.name+'</a></li>';
              }
            }
          });
        });
        taghtml += '</ul>';
        if(taggroup.length > 0){
          related += taghtml;
        }else{
          related += '<ul class="tagresults"><li class="listheader"><h5>Labels</h5></li><li>No related labels</li></ul>';
        }

        // match titles
        related += '<ul class="titleresults">';
        related += '<li class="listheader"><h5>Praktijk- & Veldwerk</h5></li>';

        var articlesearch = '';
        articlesearch += '<ul class="articleresults">';
        articlesearch += '<li class="listheader"><h5>Dialoog en Reflectie</h5></li>';

        var itemlist = postdata;
        var tca = 0; // type a count
        var tcb = 0; // type b count

        $.each( itemlist, function( idx, obj ){

          var titlestring = obj.title.toLowerCase();
          var words = titlestring.split(' '); // split title in words

            $.each( unspaced, function( inx, str ) { // each search key

              $.each( words, function( ix, word ) {

                var r = word.indexOf(str);
                if( r > -1  && str != ' ' && str != ''){
                  //console.log( 'searched: '+ str + ' in word '+word );
                  if( $.inArray( obj.title , titlegroup ) < 0 ){ // no double
                    var type = 0;
                    $(obj.cats).each(function( x , cat ){
                      if( cat == articlecategory ){
                        type = 1; // left content
                      }else if( cat == overviewcategory ){
                        type = 2; // main/start content
                      }
                    });
                    if( type == 0 ){
                      titlegroup.push( obj.title );
                      related += '<li><a href="'+obj.link+'" class="titlebutton" ';
                      related += 'data-id="'+obj.id+'">'+obj.title+'</a></li>';
                      tca++;
                    }
                    if( type == 1 ){
                      titlegroup.push( obj.title );
                      articlesearch += '<li><a href="'+obj.link+'" class="titlebutton" ';
                      articlesearch += 'data-id="'+obj.id+'">'+obj.title+'</a></li>';
                      tcb++;
                    }
                  }
                }

            });
          });
        });
        if( tca == 0 ){
          related += '<li>No related titels</li>';
        }
        related += '</ul>';
        if( tcb == 0 ){
          articlesearch += '<li>No related titels</li>';
        }
        related += articlesearch + '</ul>';
        related += '<div class="clr"></div>';
      }
      return related;
    }



    /*
    //Search box prefetch titles & tags
    var emptysearchtext = 'Zoek';
    var emptyhinttext = '';

    var theoryCategory = 'artikelen';
    var overviewCategory = 'bulletin';

    var searchtags = alltags;
    var tagfilter = tagfilter;


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

      $('#searchhints').addClass('active').css({ 'width':  $("#topbar .placeholder").innerWidth() });
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
      var alltags = searchtags; //root.filterdata.alltags;
      var allTitles = postdata;
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
      //alert( JSON.stringify(searchtags));
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

      var itemlist = postdata;
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

                   prevtags = tagfilter;

                   tagfilter = [];

                   selectedCat = '';
                   catfilter = [];

                   $('#maincontainer').attr('data-cats', '' );
                   $('#maincontainer').attr('data-tags', $(this).data('tag') );

                   $( '.tagbutton' ).removeClass('selected');
                   $( '.tagbutton.'+$(this).data('tag') ).addClass('selected');
                   //$( '.tagbutton.'+$(this).data('tag') ).toggleClass('selected');

                   if( $('body').hasClass('leftview') || $('body').hasClass('pagemenu')){

                     $('#maincontainer').removeClass("rightview");
                     $('#maincontainer').removeClass("pagemenu");
                     $('body').find('.item.selected').removeClass('selected');
                     $('body').find('.item.fullscreen').removeClass('fullscreen');
                     $('body').find('.itemcontainer .active').removeClass('active');
                     $('.catbutton').removeClass('selected');

                     $('#maincontainer').addClass('rightview rightmenu');
                     tagSelect();

                   }else{
                     tagSelect();
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


               });

          */



  //});

});
