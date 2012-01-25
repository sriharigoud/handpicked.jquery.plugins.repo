window.Socialite=(function(){var Socialite={},_socialite={},networks={},appended={},sources={},loaded={},cache={},doc=window.document,sto=window.setTimeout,euc=encodeURIComponent,gcn=typeof doc.getElementsByClassName==="function";_socialite.appendScript=function(network,id,callback){if(appended[network]||sources[network]===undefined){return false}var js=appended[network]=doc.createElement("script");js.async=true;js.src=sources[network];js.onload=js.onreadystatechange=function(){if(_socialite.hasLoaded(network)){return}var rs=js.readyState;if(!rs||rs==="loaded"||rs==="complete"){loaded[network]=true;js.onload=js.onreadystatechange=null;if(callback!==undefined){if(typeof callback==="function"){callback()}}else{_socialite.activateCache(network)}}};if(id){js.id=id}doc.body.appendChild(js);return true};_socialite.hasLoaded=function(network){return(typeof network!=="string")?false:loaded[network]===true};_socialite.removeScript=function(network){if(!_socialite.hasLoaded(network)){return false}doc.body.removeChild(appended[network]);appended[network]=loaded[network]=false;return true};_socialite.createIframe=function(src,instance){var iframe=doc.createElement("iframe");iframe.style.cssText="overflow: hidden; border: none;";iframe.setAttribute("allowtransparency","true");iframe.setAttribute("frameborder","0");iframe.setAttribute("scrolling","no");iframe.setAttribute("src",src);if(instance!==undefined){if(gcn){iframe.onload=iframe.onreadystatechange=function(){iframe.onload=iframe.onreadystatechange=null;_socialite.activateInstance(instance)}}else{sto(function(){_socialite.activateInstance(instance)},10)}}return iframe};_socialite.activateInstance=function(instance){if(instance.loaded){return}instance.loaded=true;instance.container.className+=" socialite-loaded"};_socialite.activateCache=function(network){if(cache[network]!==undefined){for(var i=0;i<cache[network].length;i++){_socialite.activateInstance(cache[network][i])}}};_socialite.copyDataAttributes=function(from,to){var i,attr=from.attributes;for(i=0;i<attr.length;i++){if(attr[i].name.indexOf("data-")===0&&attr[i].value.length){to.setAttribute(attr[i].name,attr[i].value)}}};_socialite.getDataAttributes=function(from,noprefix,nostr){var i,str="",obj={},attr=from.attributes;for(i=0;i<attr.length;i++){if(attr[i].name.indexOf("data-")===0&&attr[i].value.length){var key=attr[i].name;var val=attr[i].value;if(noprefix===true){key=key.substring(5)}if(nostr===true){obj[key]=val}else{str+=euc(key)+"="+euc(val)+"&"}}}return nostr?obj:str};_socialite.getElements=function(context,name){if(gcn){return context.getElementsByClassName(name)}var i=0,elems=[],all=context.getElementsByTagName("*"),len=all.length;for(i=0;i<len;i++){var cname=" "+all[i].className+" ";if(cname.indexOf(" "+name+" ")!==-1){elems.push(all[i])}}return elems};Socialite.activate=function(elem,network){Socialite.load(null,elem,network)};Socialite.load=function(context,elem,network){context=(typeof context==="object"&&context!==null&&context.nodeType===1)?context:doc;if(elem===undefined||elem===null){var find=_socialite.getElements(context,"socialite"),elems=find,length=find.length;if(!length){return}if(typeof elems.item!==undefined){elems=[];for(var i=0;i<length;i++){elems[i]=find[i]}}Socialite.load(context,elems,network);return}if(typeof elem==="object"&&elem.length){for(var j=0;j<elem.length;j++){Socialite.load(context,elem[j],network)}return}if(typeof elem!=="object"||elem.nodeType!==1){return}if(typeof network!=="string"||networks[network]===undefined){network=null;var classes=elem.className.split(" ");for(var k=0;k<classes.length;k++){if(networks[classes[k]]!==undefined){network=classes[k];break}}if(typeof network!=="string"){return}}if(typeof networks[network]==="string"){network=networks[network]}if(typeof networks[network]!=="function"){return}var container=doc.createElement("div"),button=doc.createElement("div");container.className="socialised "+network;button.className="socialite-button";var parent=elem.parentNode;if(parent===null){parent=(context===doc)?doc.body:context;parent.appendChild(container)}else{parent.insertBefore(container,elem)}container.appendChild(button);button.appendChild(elem);elem.className=elem.className.replace(/\bsocialite\b/,"");if(cache[network]===undefined){cache[network]=[]}var instance={elem:elem,button:button,container:container,parent:parent,loaded:false};cache[network].push(instance);networks[network](instance,_socialite)};Socialite.extend=function(network,callback,source){if(typeof network!=="string"||typeof callback!=="function"){return false}network=(network.indexOf(" ")>0)?network.split(" "):[network];if(networks[network[0]]!==undefined){return false}for(var i=1;i<network.length;i++){networks[network[i]]=network[0]}if(source!==undefined&&typeof source==="string"){sources[network[0]]=source}networks[network[0]]=callback;return true};return Socialite})();(function(){var s=window.Socialite;s.extend("twitter tweet",function(instance,_s){var cn=" "+instance.elem.className+" ";if(cn.indexOf(" tweet ")!==-1){instance.elem.className="twitter-tweet"}else{var el=document.createElement("a"),dt=instance.elem.getAttribute("data-type"),tc=["share","follow","hashtag","mention"],ti=0;for(var i=1;i<4;i++){if(dt===tc[i]||cn.indexOf(" "+tc[i]+" ")!==-1){ti=i}}el.className="twitter-"+tc[ti]+"-button";if(instance.elem.getAttribute("href")!==undefined){el.setAttribute("href",instance.elem.href)}_s.copyDataAttributes(instance.elem,el);instance.button.replaceChild(el,instance.elem)}var twttr=window.twttr;if(typeof twttr==="object"&&typeof twttr.widgets==="object"&&typeof twttr.widgets.load==="function"){twttr.widgets.load();_s.activateInstance(instance)}else{if(_s.hasLoaded("twitter")){_s.removeScript("twitter")}if(_s.appendScript("twitter","twitter-wjs",false)){window.twttr={_e:[function(){_s.activateCache("twitter")}]}}}},"//platform.twitter.com/widgets.js");s.extend("googleplus",function(instance,_s){var el=document.createElement("div");el.className="g-plusone";_s.copyDataAttributes(instance.elem,el);instance.button.replaceChild(el,instance.elem);if(typeof window.gapi==="object"&&typeof window.gapi.plusone==="object"&&typeof gapi.plusone.render==="function"){window.gapi.plusone.render(instance.button,_s.getDataAttributes(el,true,true));_s.activateInstance(instance)}else{if(!_s.hasLoaded("googleplus")){_s.appendScript("googleplus")}}},"//apis.google.com/js/plusone.js");s.extend("facebook",function(instance,_s){var el=document.createElement("div");if(!_s.hasLoaded("facebook")){el.className="fb-like";_s.copyDataAttributes(instance.elem,el);instance.button.replaceChild(el,instance.elem);_s.appendScript("facebook","facebook-jssdk")}else{var src="//www.facebook.com/plugins/like.php?";src+=_s.getDataAttributes(instance.elem,true);var iframe=_s.createIframe(src,instance);instance.button.replaceChild(iframe,instance.elem)}},"//connect.facebook.net/en_US/all.js#xfbml=1");s.extend("linkedin",function(instance,_s){var attr=instance.elem.attributes;var el=document.createElement("script");el.type="IN/Share";_s.copyDataAttributes(instance.elem,el);instance.button.replaceChild(el,instance.elem);if(typeof window.IN==="object"&&typeof window.IN.init==="function"){window.IN.init();_s.activateInstance(instance)}else{if(!_s.hasLoaded("linkedin")){_s.appendScript("linkedin")}}},"//platform.linkedin.com/in.js")})();