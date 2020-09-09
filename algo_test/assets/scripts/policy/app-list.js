$(window).on( 'load', searchFilter());

function searchFilter(page_num) {
    
    page_num     = page_num ? page_num : 1;
    var keywords = $('#keywords').val();
    var sortBy   = $('#sortBy').val();
    var group    = $('#groupid').val();
    var code     = $('#codeid').val();
    var name     = $('#name').val();
    $.ajax({
        type: 'GET',
        url: $('#SearchForm').attr('action'),
        data:'page='+page_num+'&keywords='+keywords+'&group='+group+'&code='+code+'&name='+name,
        beforeSend: function () {
            $('.loading-overlay').show();
        },
        success: function (response) { 
          console.log('success',response.html)
            $('#list_view tbody tr').remove();
            $('.totals').html(response.total_records); 
            $('#list_view').find('tbody').append(response.html);
            $('#pagination_view').html(response.pagination);
            //~ $('#list_view').html(response.html);
            $('.loading-overlay').fadeOut("slow");
        }
    });
}
