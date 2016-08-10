'use strict';
window.embedIFrame = function(inoptions) {
  var options = _.extend({
    'id': null
    'source': null,
    'messageTarget': '*'
  },inoptions || {});
  var embedIFrame = document.getElementById(options.id);
  if (embedIFrame) {
    var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var myEventListener = window[myEventMethod];
    var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
    embedIFrame.width = "100%";
    myEventListener(myEventMessage, function (e) {
      if (e.data && e.data.source == options.source) {
				embedIFrame.height = e.data.height + "px";
				embedIFrame.scrollHeight = e.data.height + "px";
			}
    },false);
    setInterval(function() {
			embedIFrame.contentWindow.postMessage({
				'height': window.innerHeight,
				'width': window.innerWidth,
        'href': window.location.href
			},options.messageTarget);
		},100);
  }
}
window.embeddedIFrame = function(inoptions) {
  var options = _.extend({
    'source': null,
    'messageTarget': '*',
    'gaDimension': false
  },inoptions || {});
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
      window.iFrameParentWidth = e.data.width;
      window.iFrameParentHeight = e.data.height;
    }
  });
}
