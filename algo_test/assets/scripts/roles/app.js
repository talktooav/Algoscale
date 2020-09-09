$(document).ready(function() {
  $('#deleteall').click(function() {
    var seln_count = $('input.list_item:checked').length;
    if (seln_count==0)
       alert('select records to delete!');
    else {
      $.ajax({
        url     : "{{ request.path }}delete",
        type    : 'get',
        dataType: 'json',
        success : function (data) {
           $("#modal").modal("show");
           $("#modal .modal-content").html(data.html)
        }
      });
    }
  });

  $("#roleSubmitForm").submit(function(e) {
    $('.form-group').removeClass('has-error'); 
    $('.error').remove(); 
    $('#msg-group').html('');
	$.ajax({
            type: 'POST',
             url: $(this).attr('action'),
            data: new FormData(this), // our data object
         enctype: 'multipart/form-data',
           async: false,
     contentType: false,
           cache: false,
     processData: false,
        dataType: 'json', 
      beforeSend: function( xhr ) {
		$(".loading-overlay").show();
		//$('#role_submit').attr('disabled', true);
      }
    })
    .done(function(response) {
       $('.loading-overlay').fadeOut("slow");
       var focus_key = '';
       if (response.success) { 
           var focus_key = 'msg';
           $('#roleSubmitForm')[0].reset(); 
           $('#msg-group').append('<div class="alert alert-success text-success">'+response.msg+'</div>');
           $('html, body').animate({ 
              scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
           }, 500, function() { 
              $('#msg-group').focus();
           });
           setTimeout(function() {
              window.location.href = response.redirect_url;
           }, 3000);
       } 
       else if (response.success==false) {  
          var i = 0;
          focus_key = 'msg';
          if ( (response.msg) && (response.msg!=undefined) ) { 
             $('#msg-group').append('<div class="alert alert-danger text-danger error">'+response.msg+'</small>');
             
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
          if (focus_key) { 
              $('html, body').animate({ 
                scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
              }, 500, function() { 
                 $('#'+focus_key+'-group').focus();
              });
          }
        }
    });
    event.preventDefault();

  });
});  
  
$(function () {
    $('<p class="error text-sm text-red">The Role Name field is required.</p>').insertAfter($("#role_name")).hide();
    // check-uncheck all
    $(document).on('change', 'input[id="all"]', function () {
      $('.parent').prop("checked", this.checked); 
      $('.child').prop("checked", this.checked);
    });
    // check-uncheck all child on parent check-uncheck
    $('.parent').on('click', function () {
      $(this).parents('header').next('.form-inline').find(':checkbox').prop('checked', this.checked);
      //~ $(this).closest('ul li').find(':checkbox').prop('checked', this.checked);
    });
    
    
    // check-uncheck parent on check-uncheck child
    $('.child').on('click', function () {
      $(this).parents('li.parent-list').find(':checkbox.parent').prop('checked', this.checked);
    });

});

$(function () {
    $('<p class="error text-sm text-red">The Role Name field is required.</p>').insertAfter($("#role_name")).hide();
        
    // check-uncheck all
    $(document).on('change', 'input[id="all"]', function () {
      $('.parent').prop("checked", this.checked); 
      $('.child').prop("checked", this.checked);
    });
    
    // check-uncheck all child on parent check-uncheck
    $('.parent').on('click', function () {
      $(this).parents('header').next('.form-inline').find(':checkbox').prop('checked', this.checked);
      //~ $(this).closest('ul li').find(':checkbox').prop('checked', this.checked);
    });
    
    
    // check-uncheck parent on check-uncheck child
    $('.child').on('click', function () { 
      $(this).parents('li.parent-list').find(':checkbox.parent').prop('checked', this.checked);
    });
    
    
});
