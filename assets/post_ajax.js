jQuery(function($) {

  $(document).ready(function(){

var getPostsByAjax = function(options){

  var root = this;
  var containerid = '#wpajaxbundle_1'; // default id
  var pullpage = 0; // starts onload
  var pullflag = true;
  var pullend = false;

  var notinid;
  var result;
  var data;
  var reqdefault;
  var reqvars;
  var reqdata;

  this.setContainerId = function( str ){
    this.containerid = str;
  }

  this.doRequestData = function(){


    //alert(this.containerid);
    if( $('body').find( '#'+this.containerid ).length > 0 ){
      // request arguments
      root.data = $( '#'+this.containerid ).data();

      root.notinid = '';
      if( $( '#'+this.containerid ).find('.container .item').length > 0 ){
        root.notinid = Array();
        $.each( $('#'+this.containerid).find('.container .item'), function(){
          root.notinid.push( $(this).data('postid') );
        });
      }


      root.reqvars = {
        'posttype' : 'any',
        'notinpostid' : root.notinid,
        'tax1': '', //
        'terms1': '', //{ 0: 'blog', 1: 'nieuws'},
        'tax2': '', //'post_tag',
        'terms2': '', //{ 0: 'planet', 1: 'universe'},
        'relation' : 'AND',
        'notcategory': '',
        'orderby' : 'post_date',
        'order' : 'ASC',
        'ppp': 2
      };

      if( root.data.posttype != '' ){
        root.reqvars.posttype = root.data.posttype;
      }
      if( root.data.tax1 != '' ){
        root.reqvars.tax1 = root.data.tax1;
      }
      if( root.data.terms1 != '' ){
        let obj = {};
        if(/[,]/.test(root.data.terms1)){
          let arr = root.data.terms1.split(',');
          $.each(arr, function( r, v){
            obj[r] = v;
          });
          root.reqvars.terms1 = obj;
        }else{
          obj = { "0" : root.data.terms1 };
          root.reqvars.terms1 = obj;
        }
      }
      if( root.data.tax2!= '' ){
        root.reqvars.tax2 = root.data.tax2;
      }
      if( root.data.terms2 != '' ){
        let obj = {};
        if(/[,]/.test(root.data.terms2)){
          let arr = root.data.terms2.split(',');
          $.each(arr, function( r, v){
            obj[r] = v;
          });
          root.reqvars.terms2 = obj;
        }else{
          obj = { "0" : root.data.terms2 };
          root.reqvars.terms2 = obj;
        }
      }

      if( root.data.relation != '' ){
        root.reqvars.relation = root.data.relation;
      }

      if( root.data.notcategory != '' ){
        let obj = {};
        if(/[,]/.test(root.data.notcategory)){
          let arr = root.data.notcategory.split(',');
          $.each(arr, function( r, v){
            obj[r] = v;
          });
          root.reqvars.notcategory = obj;
        }else{
          obj = { "0" : root.data.notcategory };
          root.reqvars.notcategory = obj;
        }
      }

      if( root.data.notinpostid != '' ){
        let obj = {};
        if(/[,]/.test(root.data.notinpostid)){
          let arr = root.data.notinpostid.split(',');
          $.each(arr, function( r, v){
            obj[r] = v;
          });
        }else{
          obj = { "0" : root.data.notinpostid };
        }

        if( root.reqvars.notinpostid != ''){
          $.extend(root.reqvars.notinpostid, obj);
        }else{
          root.reqvars.notinpostid = obj;
        }

      }

      if( root.data.orderby != '' ){
        root.reqvars.orderby = root.data.orderby;
      }
      if( root.data.order != '' ){
        root.reqvars.order = root.data.order;
      }
      if( root.data.ppp != '' ){
        root.reqvars.ppp = root.data.ppp;
      }

      //alert(JSON.stringify(root.reqvars));
      this.getPostData(root.reqvars);

    }

  }



  this.getPostData = function( args = false ) {

    // prepare an object with default request variables
    root.reqdefault = {
        'posttype': 'any',
        'postid': false, // for direct post requests
        'notinpostid' : '',
        'not': false, // for direct post requests
        'tax1': 'category', // main taxonomy (custom), default category
        'terms1': {}, // slugs
        'relation': 'OR',
        'tax2': 'post_tag', // default post_tag
        'terms2': {}, //slugs
        'notcategory': {},
        'orderby': 'post_date',
        'order': 'ASC',
        'ppp': 1,
        'page': this.pullpage
    };

    root.reqdata = root.reqdefault; // set default variables


    if (pullflag) { // if no requests active
        pullflag = false;
        pullpage++;

        root.setPageLoader();

        root.reqdata['page'] = pullpage; // set query pagenumber
        if(args){ // args from the trigger function (load/button/scroll)
          for (const key in root.reqdefault) {
              if( args[key] ) {
                root.reqdata[key] = args[key]; // replace default variables
              }
          }
        }
        this.getPosts( root.reqdata );
        console.log( root.reqdata );
    }

  }

  this.getPosts = function( args ){

    jQuery.ajax({
      type: "POST",
      url: ajax.url,
      data: {
        nonce: ajax.nonce,
        action: 'getWPPostData',
        dataType: 'json', // Choosing a JSON datatype
        data: args
      },
      success: function(response) {
        //alert( JSON.stringify(args) );
        root.setPostsHTML( response ); // JSON.stringify(response)
        if (response.length >= args.ppp) {
          pullflag = true; // if ppp count result wait for pull again
        }else{
          pullend = true; // if all results no pull again
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        //Error
      },
      timeout: 60000
    });
    return false;

  }

  this.setPostsHTML = function( result ){

    console.log( result );

    var container = $('body').find('#'+root.containerid+' .container');
    //let t = 0; // timer for smooth slowed-down slide-in

    $.each( result, function( idx, post){

      var objfilterclasses = 'item';
      let tagweight = '';

      var obj = $('<div id="post-'+post.id+'"></div>');

      obj.attr('data-postid', post.id );
      obj.attr('data-tags', post.tags.toString() );
      obj.attr('data-cats', post.cats.toString() );

      $(post.tags).each(function( x , tag ){
        objfilterclasses += ' '+tag;
      });

      obj.attr('class', objfilterclasses );

      if( post.tagweight != null ){
        obj.attr('data-tagweight', post.tagweight );
        tagweight = ' [<span class="tagweight">'+post.tagweight+'</span>]';
      }
      let title = $('<a href="'+post.link+'">'+post.title+''+tagweight+'</a>');
      let header = $('<h2 />');
      header.append(title);
      obj.append(header);
      let excerpt = $('<div class="excerpt">'+post.excerpt+'</div>');
      obj.append(excerpt);

      let cats = $('<div class="cats" />');
      for(c=0;c<post.cats.length;c++){
        cats.append('<span>'+post.cats[c])+'</span> ';
      }
      obj.append(cats);

      let tags = $('<div class="tags" />');
      for(s=0;s<post.tags.length;s++){
        tags.append('<span>'+post.tags[s])+'</span>';
      }
      obj.append(tags);

      container.append(obj);

    });

    //container.addEventListener("DOMContentLoaded", function(event){

    root.unsetPageLoader();
    // isotope
    //root.reOrderItems();

    //});

    if( $( '#'+root.containerid ).data('load') == 'all'){
      /* repeat ppp load automaticaly untill all is loaded  */
      setTimeout(function(){
        root.doRequestData();
      }, 100);
    }

    // hide button if less data then page amount found
    if( result.length < root.reqvars.ppp && $( '#'+root.containerid+' .wpajaxbundlebutton' ).length > 0){

      $( '#'+root.containerid+' .wpajaxbundlebutton' ).hide();

    }


  }

  this.reOrderItems = function(){

    alert('called!');
    /*

    // trigger isotope
      var container = $('#'+root.containerid+' .container');

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
                      //byCategory: function (elem) { // sort randomly
                        //      return $(elem).data('category') === selectedCat ? 0 : 1;
                      //},
                      byTagWeight: '.tagweight parseInt',
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
              //.isotope({ filter: [root.data.terms2] })
              .isotope({
                  sortBy : 'byTagWeight', //[ 'byCategory', 'byTagWeight' ], //
                  sortAscending: {
                      //byCategory: true, // name ascendingly
                      byTagWeight: false, // weight descendingly
                  },
              }).isotope( 'layout' );

              */

  }



  this.calculateTagWeight = function( itemtags, tagfilter ){
    var mc = 0;
                    var tags = itemtags;
                    if( tags.length > 0  && tagfilter.length > 0){
                        for(i=0;i<tags.length;i++){
                            if( $.inArray( tags[i], tagfilter ) > -1 ){
                                mc++;
                            }
                        }
                    }
                    return mc;

  }

  this.setPageLoader = function(){
    var box;
    if( $('body').find('#pageloadbox').length < 1 ){
      box = $('<div id="pageloadbox"><div class="visual"></div><div class="text">Loading</div></div>').hide();
      $('body').append( box );
    }else{
      box = $('#pageloadbox');
    }
    box.fadeIn();

  }

  this.unsetPageLoader = function(){
    $('#pageloadbox').fadeOut();
  }

  $('body').on( 'click', '#'+root.containerid+' .wpajaxbundlebutton', function(){
      root.doRequestData();
      alert('check!');
  });

  // onscroll load more
  $(document).on('scroll', function() {
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();

    if ((scrollHeight - scrollPosition) / scrollHeight <= 0.01 ) {
      if( !root.pullend ){
        root.doRequestData();
      }else{
        root.unsetPageLoader();
      }
    }

  });

  } // end get posts by ajax

  // on load check if a container is available
  var ajaxbundle = Array();
  if( $('.wpajaxbundle').length > 0 ){

    $.each( $('.wpajaxbundle'), function(){
      let elementid = $(this).attr('id');
      let bundle = new getPostsByAjax();
      bundle.setContainerId(elementid);
      bundle.doRequestData();
      ajaxbundle.push( bundle );
    });

  }

  $('body').on( 'click', '.container h2 a', function(e){
       e.stopPropagation();
       e.preventDefault();
       e.stopImmediatePropagation();
       let tags = $(this).closest('.item').data('tags');
       console.log( tags );

       let selected = $(this).closest('.item');
       let elementid = $(this).closest('.wpajaxbundle').attr('id');
       $('#'+elementid).attr('data-terms2', tags);

       $.each(ajaxbundle, function( key, obj){
         if( obj.containerid == elementid){
           console.log(elementid);

           //$( '#'+elementid+' .container' ).html('').append(selected); // refresh container

           $.each( $('#'+elementid+' .container .item'), function( ){
             if( $(this).attr('data-tagweight').length > 0 ){
                $newtagweigth = obj.calculateTagWeight( $(this).data('tags').split(','), tags.split(',') );
                $(this).attr('data-tagweight', $newtagweigth );
                $(this).find('span.tagweight').html( $newtagweigth );
             }
           });
           if( !obj.pullend ){
             obj.doRequestData();
           }else{
             obj.unsetPageLoader();
           }

         }
       });
       /*
       let bundle = new getPostsByAjax();
       bundle.setContainerId(elementid);
       bundle.doRequestData();
       ajaxbundle.push( bundle );
       */

  });


  /*
  container.imagesLoaded( function() {
    root.unsetPageLoader();
    // isotope
    root.reOrderItems();
  });

  */

  });

});
