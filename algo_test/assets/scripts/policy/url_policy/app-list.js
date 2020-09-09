$(window).on( 'load', searchFilter());

function searchFilter(page_num) {
    
    page_num     = page_num ? page_num : 1;
    var keywords = $('#keywords').val();
    $.ajax({
        type: 'GET',
        url: $('#SearchForm').attr('action'),
        data:'page='+page_num+'&keywords='+keywords,
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

$('#apppolicydeleteall').click(function() {
    var seln_count = $('input.list_item:checked').length;
    if (seln_count==0)
       alert('select records to delete!');
    else
    {
      var btn = $(this);
      var ids = []; 
      $("input.list_item:checked").each(function() { 
          ids.push($(this).val()); 
      }); 
      $.ajax({
        url:"",
        type: 'get',
        dataType: 'json',
        success : function (data) {
           $("#modal").modal("show");
           $("#modal .modal-content").html(data.html)

          }
      });
      
    }
    
});
