'use strict';
(function() {
  window.embedIFrame = function(options) {
    options.messageTarget = options.messageTarget || '*';
    var embedIFrame = document.getElementById(options.id);
    if (embedIFrame) {
      var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var myEventListener = window[myEventMethod];
      var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
      embedIFrame.width = "100%";
      myEventListener(myEventMessage, function (e) {
        if (e.data && e.data.source == options.source) {
  				embedIFrame.height = e.data.height + "px";
  			}
      },false);
      setInterval(function() {
  			embedIFrame.contentWindow.postMessage({
  				'height': window.innerHeight,
  				'width': window.innerWidth,
          'href': window.location.href,
          'offset': embedIFrame.offsetTop,
          'scrollTop': document.body.scrollTop - embedIFrame.offsetTop,
          'hash': window.location.hash
  			},options.messageTarget);
  		},100);
    }
  }
  window.embeddedIFrame = function(options) {
    options.messageTarget = options.messageTarget || '*';
    var lastHeight = 0;
    var interval = setInterval(function(){
      var currentHeight = document.body.offsetHeight;
      if (currentHeight != lastHeight) {
        lastHeight = currentHeight;
        var prevHeight = {
          'source': options.source,
          'height': currentHeight
        };
        window.parent.postMessage(prevHeight,options.messageTarget);
      }
    }, 100);
    var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var myEventListener = window[myEventMethod];
    var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
    myEventListener(myEventMessage, function (e) {
      if (e.data) {
        if (options.gaDimension && ga) {
          ga('set', options.gaDimension, e.data.href);
        }
        window.iframeParent = e.data
        if (options.callback) {
          options.callback(e.data);
        }
      }
    });
  }
})();
