$(document).ready(function() {
  $("#accountsubmitForm").submit(function(e) {
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
            $('#account_submit').attr('disabled', true);
      }
    })
    .done(function(response) {
       $('.loading-overlay').fadeOut("slow");
       $('#account_submit').attr('disabled', false);
       var focus_key = '';
       if (response.success) { 

           var focus_key = 'msg';
           $('#msg-group').append('<div class="alert alert-success text-success">'+response.msg+'</div>');
           setTimeout(function() {
              window.location.href = '';
           }, 3000);
       } 
       else if (response.success == false)
       {  
          var i = 0;
          if ( (response.msg) && (response.msg!=undefined) ) { 
             $('#msg-group').append('<div class="alert alert-danger text-danger error">'+response.msg+'</small>');
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
