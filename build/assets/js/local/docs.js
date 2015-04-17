$(document).ready(function(){

  $(".example").each(function(){
    var html = $(this).html();
    var syntax = ($(this).attr('class').split(' ')[1]);
    // Remove blank new line and spaces before example code.
    var html = html.replace(/^(\s*\n|\s{2})/gim, "")
    $(this).after("<pre class='example-code "+syntax+"'><code>"+html+"</code></pre>");
  })

  $(".example + .example-code code").each(function(){
    $(this).text( $(this).html() );
  })

  $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
  });

});