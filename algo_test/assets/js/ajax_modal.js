var d = new Date($.now());
var current_dt = d.getDate()+"-"+(d.getMonth() + 1)+"-"+d.getFullYear()+"-"+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds();

$('#SearchForm').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) { 
    e.preventDefault();
    return false;
  }
});

$(document).ready(function() {

var DeleteFormlist = function() {

    var form = $(this);
    var seln_count = $('input.list_item:checked').length;
    if (seln_count==0)
       alert('select records to delete!');
    else {
      var btn = $(this);
      var ids = [];
      
      $("input.list_item:checked").each(function() { 
          ids.push($(this).val()); 
      });
    $.ajax({
       url: form.attr("action"),
       data: {'ids':ids},
       type: 'POST',
       dataType: 'json',
       success: function (response) {
         if (response.success) {
            $('#del-msg-group').html('<div class="alert alert-success text-success">'+response.msg+'</div>');
            setTimeout(function() {
              $("#modal").modal("hide");
              window.location.href = '';
              //~ searchFilter();
            }, 3000);
            
         }
         else {
           $('#del-msg-group').html('<div class="alert alert-danger text-danger error">'+response.msg+'</div>');
           setTimeout(function() {
              $("#modal").modal("hide");
              window.location.href = '';
              //~ searchFilter();
           }, 3000);
         }
       }
    });
    return false;
  }
}


$('.content').on('click', '.delBtn', function() {
     
    var unchecked =  $('input.list_item:checked').attr('checked', false);
    var mapped = $(this).closest('tr').children('th:first').find('input:checkbox').prop('checked', true);
    
    var seln_count = $('input.list_item:checked').length;
    if (seln_count==0)
        alert('select records to delete!');
    else { 
      $.ajax({
        url:$(this).attr('data-url'),
        type: 'get',
        dataType: 'json',
        success : function (data) {
            $("#modal").modal("show");
           $("#modal .modal-content").html(data.html)
          
        }
      });
      
    }
    
});

$("body").on('submit', '#confirmDelete', DeleteFormlist);
  
});


$("input").keypress(function() { 
  $(this).closest('.form-group').removeClass('has-error'); 
  $(this).parent().find('.error').remove(); 
  $('#msg').html('');
  $('#msg-group').html('');
  $('input[type=submit]').attr('disabled', false);
}); 
  
$( "select" ).change(function() { 
  $(this).closest('.form-group').removeClass('has-error'); 
  $(this).closest('.form-group').find('.error').remove(); 
  $('input[type=submit]').attr('disabled', false);
}); 
  
$("input").click(function() { 
  var keyy = $(this).attr('name');
  if (keyy != undefined)
    keyy = keyy.replace('[]', ''); 
  $(this).closest('.form-group').removeClass('has-error'); 
  $('#'+keyy+'-group').find('.error').remove(); 
  $('#msg-group').html('');
  $('input[type=submit]').attr('disabled', false);
});
 
$("textarea").click(function() { 
  var keyy = $(this).attr('name');
  keyy = keyy.replace('[]', ''); 
  $(this).closest('.form-group').removeClass('has-error'); 
  $('#'+keyy+'-group').find('.error').remove(); 
  $('#msg-group').html('');
  $('input[type=submit]').attr('disabled', false);
}); 

