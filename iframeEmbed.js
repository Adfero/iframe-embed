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
      var lastPosition = null;
      myEventListener(myEventMessage, function (e) {
        if (e.data && e.data.source == options.source && e.source != window) {
  				embedIFrame.height = e.data.height + "px";
          if (e.data.goToPosition != lastPosition && (jQuery || $)) {
            lastPosition = e.data.goToPosition;
            var $ = (jQuery || $);
            $('html,body').animate({
              'scrollTop': lastPosition + embedIFrame.offsetTop
            });
          }
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
    window.goToPosition = null;
    window.iframeParent = null;
    var interval = setInterval(function(){
      var currentHeight = document.body.scrollHeight;
      if (currentHeight != lastHeight || window.goToPosition != null) {
        var message = {
          'source': options.source,
          'height': currentHeight,
          'goToPosition': window.goToPosition
        };
        window.parent.postMessage(message,options.messageTarget);
        window.goToPosition = null;
        lastHeight = currentHeight;
      }
    }, 100);
    var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var myEventListener = window[myEventMethod];
    var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
    myEventListener(myEventMessage, function (e) {
      if (e.data && e.source != window) {
        if (options.gaDimension && ga) {
          ga('set', options.gaDimension, e.data.href);
        }
        if (!window.iframeParent && options.iframeParentActivated) {
          options.iframeParentActivated(e.data);
        }
        window.iframeParent = e.data
        if (options.callback) {
          options.callback(e.data);
        }
      }
    });
  }
  window.scrolliFrameAnimatedTo = function(position) {
    if (window.iframeParent) {
      window.goToPosition = position;
    } else if (jQuery || $) {
      var $ = (jQuery || $);
      $('html,body').animate({
        'scrollTop': position
      });
    }
  }
})();
