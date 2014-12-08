$(document).ready(function(){
  var buttonPress = function(button){
    /*
      Function to send command to Roku device.
    */
    var ipAddress = $('#address').val();
    $.post('http://'+ipAddress+':8060/keypress/'+button, function(){})
    .fail(function(){
      toast('error connecting to \''+ipAddress+'\'', 1500);
    });
  }

  //Events
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
          buttonPress('select');
          break;
        case 37:
          buttonPress('left');
          break;
        case 38:
          buttonPress('up');
          break;
        case 39:
          buttonPress('right');
          break;
        case 40:
          buttonPress('down');
          break;
      }
    }
  });

  //Save the IP address when the user is done entering it.
  $('#address').focusout(function(){
    chrome.storage.local.set({'remoteIpAddress': $('#address').val()});
  });

  //setup tabs
  $('.tabs').tabs();

  //try to set saved ip address
  chrome.storage.local.get('remoteIpAddress', function(data){
    $('#address').val(data.remoteIpAddress);
    if(data.remoteIpAddress.length > 0){
      $('#address-label').addClass('active');
    }
  });
});
