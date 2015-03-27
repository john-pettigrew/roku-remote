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
  $('#back-button').on('click', function(e){
    e.preventDefault();
    buttonPress('Back');
  });
  $('#menu-button').on('click', function(e){
    e.preventDefault();
    buttonPress('Info');
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
        case 8:
          buttonPress('Backspace');
          break;
        case 46:
          buttonPress('Backspace');
          break;
        case 32:
          buttonPress("Lit_%20");
          break;
        case 27:
          buttonPress('Back');
          break;
        }

      var shifted = e.shiftKey;

      if (65 <= e.which && e.which <= 90){
        var letter = shifted ? String.fromCharCode(e.which) : String.fromCharCode(e.which).toLowerCase(); 
        buttonPress("Lit_" + letter);
      }
    }
  });

  //Save the IP address when the user is done entering it.
  $('#address').focusout(function(){
    chrome.storage.local.set({'remoteIpAddress': $('#address').val()});
    getChannels();
  });

  //setup tabs
  $('.tabs').tabs();

  //try to set saved ip address
  chrome.storage.local.get('remoteIpAddress', function(data){
    $('#address').val(data.remoteIpAddress);
    if(data.remoteIpAddress.length > 0){
      $('#address-label').addClass('active');
    }
    getChannels();
  });

  //get channel list
  var getChannels = function(){
    $('#channel-list').html('');
    var goToChannel = function(id){
        /*
          Function to switch channels based on given id
        */
        var ipAddress = $('#address').val();
        $.post('http://'+ipAddress+':8060/launch/'+id, function(){})
        .fail(function(){
          toast('error connecting to \''+ipAddress+'\'', 1500);
        });
    }

    var ipAddress = $('#address').val();
    if(ipAddress !== undefined && ipAddress.length > 0){
      $.get('http://'+ipAddress+':8060/query/apps',
      function(data){
        var appsArray = $(data).find('app');
        var count = 0;
        appsArray.each(function(value){
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'http://'+ipAddress+':8060/query/icon/'+$(appsArray[value]).attr('id'), true);
          xhr.responseType = 'blob';
          xhr.onload = function(e){
            $('#channel-list').append('<div class="channel-item" channelId="'+$(appsArray[value]).attr('id')+'"><img src="'+window.URL.createObjectURL(this.response)+'" channelId="'+$(appsArray[value]).attr('id')+'"></img><li channelId="'+$(appsArray[value]).attr('id')+'">'+$(appsArray[value]).text()+'&nbsp;</li></div>');
            count++;
            if(count === appsArray.length){
              $('.channel-item').on('click', function(e){
                var id = e.target.attributes.channelid.value;
                //add animation
                $('.channel-item[channelid="'+id+'"]').addClass('channel-pressed');
                $('.channel-item[channelid="'+id+'"]').one('webkitAnimationEnd', function(){
                  $('.channel-item[channelid="'+id+'"]').removeClass('channel-pressed');
                })
                goToChannel(id);
              });
            }
          };
          xhr.send();
        });
      },
      'xml')
      .fail(function(){
        toast('error connecting to \''+ipAddress+'\'', 1500);
      });
    }
  }

});
