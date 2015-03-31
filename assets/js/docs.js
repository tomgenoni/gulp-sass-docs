$(document).ready(function(){

  $(".example").each(function(){
    var html = $(this).html();
    // Remove blank new line and spaces before example code.
    var html = html.replace(/^(\s*\n|\s{2})/gim, "")
    $(this).after("<pre class='example-code'><code>"+html+"</code></pre>");
  })

  $(".example + .example-code code").each(function(){
    $(this).text( $(this).html() );
  })

});