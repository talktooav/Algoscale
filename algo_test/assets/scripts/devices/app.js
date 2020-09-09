var x = document.getElementById("correct_dat_table");
if ('{{data.flag}}' == 1) {
   if (x.style.display === "none") {
      x.style.display = "block";
   } 
   else {
     x.style.display = "none";
   }
}

$(window).on( 'load', searchFilter());

function searchFilter(page_num) {
    
    page_num     = page_num ? page_num : 1;
    var keywords = $('#keywords').val();
    var imei     = $('#imei').val();
    var model_no = $('#model_no').val();
    var sortBy   = $('#sortBy').val();
    $.ajax({
        type: 'GET',
        url: $('#SearchForm').attr('action'),
        data:'page='+page_num+'&keywords='+keywords+'&model_no='+model_no+'&imei='+imei,
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

$('.containerfluid').on('click', '.unmapped-click', function() {
   
   var mapped = $(this).closest('tr').children('th:first').find('input:checkbox').val();
   $.ajax({
         url: $(this).attr("data-url"),
        type: 'get',
        data: {feedback:mapped},
        dataType: 'json',
        success : function (data) {
           $("#modal").modal("show");
           $("#modal .modal-content").html(data.html)
        }
      });
});

$(".wrapper").on('submit', '#ChangeStatusForm', function(e) {

    $(this).find('.form-group').removeClass('has-error'); 
    $(this).find('.error').remove(); 
    $(this).find('#msg-group').html('');
    
    $.ajax({
            type: $(this).attr('method'),
             url: $(this).attr('action'),
            data: $(this).serialize(), // our data object
        dataType: 'json', 
      beforeSend: function( xhr ) {
		$(".loader").show();
      }
    })
    .done(function(response) {
       $(".loader").hide();
       var focus_key = '';
       if (response.success) { 
           var focus_key = 'msg';
           $('#ChangeStatusForm')[0].reset(); 
           $('#msg-group').append('<div class="text-success">'+response.msg+'</div>');
           setTimeout(function() {
              window.location.href = response.url;
           }, 3000);
       } 
       else if (response.success==false) {  
          
          if ( (response.msg) && (response.msg!=undefined) ) { 
             $('#msg-group').append('<div class="text-danger error">'+response.msg+'</small>');
             focus_key = 'msg';
          }
          else {
            $.each(JSON.parse(response.errors), function(key, value) { 
              $('#'+key+'-group').addClass('has-error'); // add the error class to show red input
              $('#'+key+'-group').append('<small class="error">' + value[0].message + '</small>');
              
            }); 
          }
        }
    });
    event.preventDefault();
});
