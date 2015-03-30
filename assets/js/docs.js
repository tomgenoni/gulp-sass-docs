$(document).ready(function(){

  $(".example").each(function(){
    var html = $(this).html();
    $(this).after("<pre>"+html+"</pre>");
  })

  $(".example + pre").each(function(){
    $(this).text( $(this).html() );
  })

});