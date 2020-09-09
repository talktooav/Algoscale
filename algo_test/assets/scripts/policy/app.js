$(document).ready(function() {
        
    $("#policyForm").submit(function(e) {
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
          $(".loading-overlay").show();
        }
      })
      .done(function(response) {
         $('.loading-overlay').fadeOut("slow");
         console.log(response);
         var focus_key = '';
         if (response.success) { 
             var focus_key = 'msg';
             $('#policyForm')[0].reset(); 
             $('#msg-group').append('<div class="alert alert-success text-success">'+response.msg+'</div>');
             setTimeout(function() {
                window.location.href = response.redirect_url;
             }, 3000);
             if (focus_key) {
                $('html, body').animate({ 
                  scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
                }, 500, function() { 
                   $('#'+focus_key+'-group').focus();
                });
             }
         } 
         else if (response.success == false) { 
            var i = 0;
            if ( (response.msg) && (response.msg!=undefined) ) { 
               $('#msg-group').append('<div class="alert alert-danger text-danger error">'+response.msg+'</div>');
               focus_key = 'msg';
            }
            else {
              $.each(JSON.parse(response.errors), function(key, value) { 
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
