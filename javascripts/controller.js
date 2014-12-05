$(document).ready(function(){
  var buttonPress = function(button){
    console.log('test');
    var ipAddress = $('#address').val();
    $.post('http://'+ipAddress+':8060/keypress/'+button, function(){})
    .fail(function(){
      console.log(ipAddress);
      toast('error connecting to \''+ipAddress+'\'', 1500);
    });
  }
  $('#left-button').on('click', function(){
    buttonPress('left');
  });
  $('#right-button').on('click', function(){
    buttonPress('right');
  });
  $('#up-button').on('click', function(){
    buttonPress('up');
  });
  $('#down-button').on('click', function(){
    buttonPress('down');
  });
  $('#select-button').on('click', function(){
    buttonPress('select');
  });
  $('#home-button').on('click', function(e){
    e.preventDefault();
    buttonPress('home');
  });
  $('html').keydown(function(e){
    if(!$('#address').is(':focus')){
      switch(e.which){
        case 13:
          console.log('select');
          buttonPress('select');
          break;
        case 37:
          console.log('left');
          buttonPress('left');
          break;
        case 38:
          console.log('up');
          buttonPress('up');
          break;
        case 39:
          console.log('right');
          buttonPress('right');
          break;
        case 40:
          console.log('down');
          buttonPress('down');
          break;
      }
    }
  })
});
