//~ $(document).ready(function() {
//~ var switchStatus = false;  
//~ $(".togBtn").on('change', function() {
    //~ if ($(this).is(':checked')) {
        //~ switchStatus = $(this).is(':checked');
		//~ $(this).attr('value', 'True');
        //~ //alert(switchStatus);// To verify
    //~ }
    //~ else {
       //~ switchStatus = $(this).is(':checked');
	   //~ $(this).attr('value', 'False');
       //~ //alert(switchStatus);// To verify
    //~ }
//~ });
//~ })

   //~ $(document).ready(function() {

   //~ $("#apkFile-group").hide()
   //~ $("#apkURL-group").hide()
   //~ $("#id_apkchoice").change(function(){
     
      //~ var va =$(this).children("option:selected").html();
      //~ console.log(va)
      //~ if (va=="Upload APK"){
      //~ $("#id_apkURL").val(''); 
      //~ $("#apkURL-group").hide()
      //~ $("#apkFile-group").show()    
    //~ }
    //~ else{
         //~ $("#id_apkFile").val(''); 
         //~ $("#apkURL-group").show()
         //~ $("#apkFile-group").hide()    
    //~ }
   //~ })
   //~ })

    //~ $("#contactForm").submit(function(e) {
    //~ $('.form-group').removeClass('has-error'); 
    //~ $('.error').remove(); 
    //~ $('#msg-group').html(''); 
    //~ $.ajax({
            //~ type: 'POST',   
            //~ url: $(this).attr('action'),
            //~ data: new FormData(this),
            //~ enctype: 'multipart/form-data',
            //~ async: false,
        //~ contentType: false,
            //~ cache: false,
        //~ processData: false,
        //~ dataType: 'json', 
        //~ beforeSend: function( xhr ) {
        //~ $(".loader").show();
        //~ //$('#groups_submit').attr('disabled', true);
        //~ }
    //~ })
    //~ .done(function(response) {
        //~ $(".loader").hide();
        //~ console.log(response);
        //~ var focus_key = '';
        //~ if (response.success) { 
            //~ var focus_key = 'msg';
            //~ $('#contactForm')[0].reset(); 
            //~ $('#msg-group').append('<div class="text-success">'+response.msg+'</div>');
            //~ setTimeout(function() {
                //~ window.location.href = response.url;
            //~ }, 3000);
        //~ } 
        //~ else if (response.success == false)
        //~ { 
            //~ var i = 0;
            //~ if ( (response.msg) && (response.msg!=undefined) ) { 
            //~ console.log('here2 ')
                //~ $('#msg-group').append('<div class="error">'+response.msg+'</small>');
                //~ focus_key = 'msg';
            //~ }
            //~ else {
            //~ $.each(JSON.parse(response.errors), function(key, value) { 
                //~ if (i==0)
                    //~ focus_key = key;
                
                //~ $('#'+key+'-group').addClass('has-error'); // add the error class to show red input
                //~ $('#'+key+'-group').append('<small class="error">' + value[0].message + '</small>');
                //~ ++i;
            //~ }); 
            //~ $("input[name='mdm_token']").val(response.errors.get_csrf_hash); 
            //~ }
            //~ $('html, body').animate({ 
            //~ scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
            //~ }, 500, function() { 
                //~ $('#'+focus_key+'-group').focus();
            //~ });
        //~ }
    //~ });
    //~ event.preventDefault();
    //~ });
$(window).on('load', function () {
   var va = $("#id_apkchoice").children("option:selected").html();
    
   if (va=="Upload APK") {
      $("#apkFile-group").show()   
      $("#apkURL-group").hide()   
   }
   else {
       $("#apkFile-group").hide()
   }
});
$("#id_apkchoice").change(function() {
   var va =$("#id_apkchoice").children("option:selected").html();
   if (va=="Upload APK") {
      $("#id_apkURL").val(''); 
      $("#apkFile-group").show()   
      $("#apkURL-group").hide()   
   }
   else {
      $("#id_apkFile").val(''); 
      $("#apkFile-group").hide()
      $("#apkURL-group").show()   
   }
});

$(document).ready(function() {
  $("#appPolicyForm").submit(function(e) {
    $('.form-group').removeClass('has-error'); 
    $('.error').remove(); 
    $('#msg-group').html('');
    $.ajax({
          type: 'POST',
          url: $(this).attr('action'),
          data: new FormData(this),
          enctype: 'multipart/form-data',
          async: false,
          contentType: false,
          cache: false,
          processData: false,
          dataType: 'json', 
          beforeSend: function( xhr ) {
            $('.loading-overlay').show();
            $('#form_submit').attr('disabled', true);
          }
    })
    .done(function(response) {
       $('.loading-overlay').fadeOut("slow");
       var focus_key = '';
       if (response.success) { 

           var focus_key = 'msg';
           $('#msg-group').append('<div class="text-success">'+response.msg+'</div>');
           setTimeout(function() {
              window.location.href = response.redirect_url;
           }, 100);
           $('html, body').animate({ 
              scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
           }, 500, function() { 
              $('#'+focus_key+'-group').focus();
           });
       } 
       else if (response.success == false)
       {  
          var i = 0;
          if ( (response.msg) && (response.msg!=undefined) ) { 
             $('#msg-group').append('<div class="error">'+response.msg+'</small>');
             focus_key = 'msg';
          }
          else {
            $.each(JSON.parse(response.errors), function(key, value) { 
                console.log('gol')
              if (i==0)
                 focus_key = key;
              
              $('#'+key+'-group').addClass('has-error'); // add the error class to show red input
              $('#'+key+'-group').append('<small class="error">' + value[0].message + '</small>');
              ++i;
            }); 
            //~ $("input[name='mdm_token']").val(response.errors.get_csrf_hash); 
          }
          $('html, body').animate({ 
            scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
          }, 500, function() { 
             $('#'+focus_key+'-group').focus();
          });
        }
    });
    event.preventDefault();

  });
});
