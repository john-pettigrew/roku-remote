chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('remote.html', {
    'bounds': {
      'width': 343,
      'height': 600
    }
  })
});
