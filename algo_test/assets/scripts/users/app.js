//~ function filePreview(input) {
  //~ var image = input.files[0]['name'];
  //~ var image_regex =  /^.*\.(jpeg|PNG|jpg|JPEG|JPG|png)$/;
  //~ if (!image_regex.test(image)) {
      //~ $('div #logoerror').remove()
      //~ $('#enterprise_logo-group  + img').remove();
      //~ $('div #enterprise_logo-group').append('<small id="logoerror" class="error">Allowed extensions are: jpg, png, jpg, jpeg, jpeg, png.</small>');
      //~ $('#id_enterprise_logo').val(''); 
      
      //~ console.log('sss',image.width )      
      //~ return false;
      //~ }
      //~ var OriginalSize = (input.files[0].size);
      //~ var RequiredSize = 400*1024;
       //~ if(OriginalSize >RequiredSize ){
         //~ $('div #logoerror').remove()
          
         //~ $('div #enterprise_logo-group').append('<small id="logoerror" class="error">logo size accept maximum 400kb only</small>');
         //~ $('#enterprise_logo-group  + img').remove();
          //~ $('#id_enterprise_logo').val(''); 
           //~ return false;
        //~ }
  
  //~ if(input.files && input.files[0]){
    //~ var reader = new FileReader();
    //~ reader.onload = function(e){
       //~ $('div #logoerror').remove()
        //~ $('#enterprise_logo-group  + img').remove();
      
       //~ $('#enterprise_logo-group').after('<img src="'+e.target.result+'" width="150" height="300"/>');
       
    //~ };
    //~ reader.readAsDataURL(input.files[0])
    //~ }
  //~ }

$('input[name="enterprise_logo"]').on('change', function () {
   if (typeof (FileReader) != "undefined") {
      var image_holder = $("#preview");
      image_holder.empty();
      var file = this.files[0];
      var imagefile = file.type;
      var file_size = file.size;
      var match= ["image/jpeg","image/png","image/jpg","image/gif"];
      if (!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]) || (imagefile==match[3]))) {
        $("#enterprise_logo").val('');
        $("#enterprise_logo").replaceWith($("#enterprise_logo").clone(true));
        $("<small />", {
                "class" : "error",
                "text" : "Allowed extensions are: jpg, jpeg, gif, png.."
            }).appendTo(image_holder);
        return false;
      }
      else if (file_size > 20*1024) { // 2MB = 2097152 kB = 1024 * 1024 * 2
        $("#enterprise_logo").val('');
        $("<small />", {
                "class" : "error",
                "text" : "Logo exceeds the maximum allowed size of 20kb."
            }).appendTo(image_holder);
        return false;
      }
      else {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("<img />", {
                "src": e.target.result,
                "class": "img-responsive"
            }).appendTo(image_holder);
         }
        image_holder.show();
        reader.readAsDataURL($(this)[0].files[0]);
      }
    } else {
      alert("This browser does not support FileReader.");
    }
});

$(window).on('load', function () {
  var va =$("#id_groups").children("option:selected").html();
  if (va=="Enterprise") {
     $("#enterprise_logo-group").show();    
     $("#enterprise_colour-group").show();
  }
  else {
    $("#enterprise_logo-group").hide();
    $("#enterprise_colour-group").hide();
  }
});

$("#id_groups").change(function(){
  var va =$("#id_groups").children("option:selected").html();
  if (va=="Enterprise"){
     $("#enterprise_logo-group").show();
     $("#enterprise_colour-group").show();
  }
  else {
    $("#enterprise_logo-group").hide();
    $("#enterprise_colour-group").hide();
  }
});

$(document).ready(function() {  
  $("option:First").text(" - Select - ");
  $("#usersubmitForm").submit(function(e) {
      var va =$("#id_groups").children("option:selected").html();
   
     if (va!="Enterprise"){
       console.log('ssss',va)
        $('#id_enterprise_logo').val(''); 
         $('#id_enterprise_colour').val(''); 
     }
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
		$('#user_submit').attr('disabled', true);
      }
    })
    .done(function(response) {
       $('.loading-overlay').fadeOut("slow");
       var focus_key = 'msg';
       console.log('response.success', response.success);
       if (response.success) { 
           var focus_key = 'msg';
           $('#usersubmitForm')[0].reset(); 
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

$('#usersdeleteall').click(function() {
  var seln_count = $('input.list_item:checked').length;
  if (seln_count==0)
     alert('select records to delete!');
  else {
    
    $.ajax({
        url:"{{ request.path }}delete",
        type: 'get',
        dataType: 'json',
        success : function (data) {
           $("#modal").modal("show");
           $("#modal .modal-content").html(data.html)

          }
    });
      
  }
    
});
