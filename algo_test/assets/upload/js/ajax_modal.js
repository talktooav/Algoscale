$(document).ready(function() {
  $('#checkall-toggle').click(function(event) {  
    if (this.checked) {
       // Iterate each checkbox
       $(':checkbox').each(function() {
            this.checked = true;
       });
    }
    else {
      $(':checkbox').each(function() {
        this.checked = false;                       
      });
    }
  });

  var loadForm = function() {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal").modal("show");
      },
      success: function (data) {
        $("#modal .modal-content").html(data.html_form);
      }
    });
  };

  var saveForm = function() {
    var form = $(this);

    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          $("#table tbody").html(data.list);
          $("#total span").html(data.Total);
          $("#modal").modal("hide");
        }
        else
         {
          $("#modal .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };
  var saveFormPartial = function() {
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
      console.log(ids);

    var form = $(this);
    

    $.ajax({
      url: form.attr("action"),
      data: {'ids':ids},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        
        if (data.status=='0') {
          $("#modal .modal-content .modal-body").html(data.html);
        }
        else if(data.status='1')
         {
          window.location.href = data.url
        }
      }
    });
    return false;
  }
}
  var DeleteFormlist = function() {
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
      console.log(ids);

    var form = $(this);
    

    $.ajax({
      url: form.attr("action"),
      data: {'ids':ids},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        
        if (data.form_is_valid) {
          window.location.href = data.url
        }
        else
         {
          $("#modal .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  }
}

var jssavesession = function() {

  var data = $("#myselect1").val();
  $.ajax({
    url: 'users/session/',
    type: 'POST',
    data: {'data':data},
    dataType: 'json',
    async: true,
    cache: false,
    success: function (data) {
      $("#modal").modal("hide");
    }
  });
  return false;
}

  $("body").on('submit', '.js-save-session', jssavesession);
  $("body").on('submit', '.js-save-list', DeleteFormlist);
  $("body").on('click', '.js-load-form', loadForm);
  $("body").on('submit', '.js-save-form', saveForm);
  $("body").on('submit', '.js-save-list-partial', saveFormPartial);
})

//clear filter
$('.cross-icon').on('click', function() {
   $("input[type=text], text").val("");
   searchFilter();
});

$('.refresh-icon').on('click', function() {
    window.location.href='';    
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
