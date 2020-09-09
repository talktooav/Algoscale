$(window).on( 'load', searchFilter());

function searchFilter(page_num) {
    page_num     = page_num ? page_num : 1;
    var keywords = $('#keywords').val();
    var name     = $('#name').val();
    var version  = $('#version').val();
    var package  = $('#package').val();
    var type     = $('#type').val();
    $.ajax({
        type: 'GET',
        url: $('#SearchForm').attr('action'),
        data:'page='+page_num+'&keywords='+keywords+'&name='+name+'&version='+version+'&package='+package+'&type='+type,
        beforeSend: function () {
            $('.loading-overlay').show();
        },
        success: function (response) { 
           
            $('#list_view tbody tr').remove(); 
            $('.totals').html(response.total_records);
            $('#list_view').find('tbody').append(response.html);
            $('#pagination_view').html(response.pagination);
            
            //~ $('#list_view').html(response.html);
            $('.loading-overlay').fadeOut("slow");
        }
    });
}

$(document).ready(function() {
   $('.devices-sec').on('click', '.all_check', function(event) {  
    
    if (this.checked) {
       // Iterate each checkbox
       $(':checkbox').each(function() {
            this.checked = true;
       });
       $('.add-device').show();
    }
    else {
      $(':checkbox').each(function() {
        this.checked = false;                       
      });
      $('.add-device').hide();
    }
  }); 
  $('.devices-sec').on('click', '.list_item', function() {
      if (this.checked) {
         $('.add-device').show();
      }
      else{
          var checked = false
          $(':checkbox').each(function() {
             if (this.checked==true) {
                checked = true;
             }
          });
          if (checked==true)
             $('.add-device').show();
          else
            $('.add-device').hide();
      }
  });
  
  $('.add-device').on('click', function() {
      $('#msg-group').html('');
      var seln_count = $('input.list_item:checked').length;
      if (seln_count==0)
         alert('select records to delete!');
      else { 
        var btn = $(this);

        var ids = []; 
        $("input.list_item:checked").each(function() { 
              ids.push($(this).val()); 
        });
        console.log('id', ids);
        if (ids) {
           $.ajax({
                type: 'POST',
                url:$(this).attr('data-url'),
                data:'ids='+ids,
                dataType: 'json',
                success : function (response) {
                    if (response.success) { 
                       var focus_key = 'msg';
                       $('#msg-group').append('<div class="alert alert-success text-success">'+response.msg+'</div>');
                       if (focus_key) {
                         $('html, body').animate({ 
                            scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
                         }, 500, function() { 
                            $('#'+focus_key+'-group').focus();
                         });
                       }
                       setTimeout(function() {
                          window.location.href = response.redirect_url;
                       }, 3000);           
                    } 
                    else if (response.success==false) {  
                      var i = 0;
                      focus_key = 'msg'; 
                      if ( (response.msg) && (response.msg!=undefined) ) { 
                         $('#msg-group').append('<div class="alert alert-danger text-danger error">'+response.msg+'</div>');
                         focus_key = 'msg';
                      }
          
                      if (focus_key) {
                          $('html, body').animate({ 
                            scrollTop:$('#'+focus_key+'-group').offset().top - ($(window).height() / 2)
                          }, 500, function() { 
                             $('#'+focus_key+'-group').focus();
                          });
                      }
                    }
                }
           }); 
        }
      } 
  });
});
