(function($){var win=null;$.fn.tweetAction=function(options,callback){options=$.extend({url:window.location.href},options);return this.click(function(e){if(win){e.preventDefault();return}var width=550,height=350,top=(window.screen.height-height)/2,left=(window.screen.width-width)/2;var config=["scrollbars=yes","resizable=yes","toolbar=no","location=yes","width="+width,"height="+height,"left="+left,"top="+top].join(",");win=window.open("http://twitter.com/intent/tweet?"+$.param(options),"TweetWindow",config);(function checkWindow(){try{if(!win||win.closed){throw"Closed!"}else{setTimeout(checkWindow,100)}}catch(e){win=null;callback()}})();e.preventDefault()})}})(jQuery);