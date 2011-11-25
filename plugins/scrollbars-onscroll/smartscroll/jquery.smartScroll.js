(function($){$.fn.smartScroll=function(params){params=$.extend({prefix:"v1",width:30,height:500,mode:"drag-vertical",fx:"normal",wheelGap:40,smart:true,fixWidth:0},params);this.each(function(){var numCell=params.iteration;var obj=$(this);var isScrollWebkitHack=(obj.css("overflow")=="scroll"&&$.browser.webkit)?true:false;resetStyle();var totalH=obj.outerWidth();var totalV=obj.outerHeight();var ratioH=(totalH-params.width)/params.width;var currentIndex=0;var currentTipsIndex=-1;var container;var slider;var cursor;if(params.smart){var tips=obj.children();var tipsArray=new Array();var tipsContainer;var tipsIndex=-1;for(i=0;i<tips.length;i++){var tmp=$(tips[i]).attr("title");if(tmp!==""){var cell=new Object();cell.txt=tmp;cell.selector=$(tips[i]);var item=$(tips[i]).position();var curleft=item.left;var curtop=item.top;cell.top=curtop;cell.left=curleft;tipsArray.push(cell)}}}switch(params.mode){case"drag-horizontal":break;default:var targetWidth=obj.outerWidth();if(createWrap(params.mode)){obj.css("height",params.height);obj.children("div."+params.prefix+"_targetContainer").css({position:"relative","float":"left",overflow:"hidden",height:params.height,width:"auto"});var ArealHeight=params.height-(obj.children("div."+params.prefix+"_targetContainer").outerHeight()-params.height);obj.children("div."+params.prefix+"_targetContainer").css("height",ArealHeight);container=obj.children("div."+params.prefix+"_targetContainer").children("div."+params.prefix+"_target");container.css({width:targetWidth,height:totalV});var containerMarg=container.outerHeight()-container.height();var containerWidth=container.outerWidth()-(container.outerWidth()-container.width());container.css({position:"relative",top:0,left:0,width:containerWidth});slider.css({position:"relative",height:params.height,width:params.width,"float":"left"});var sliderHeight=params.height-(slider.outerHeight()-params.height);var sliderWidth=params.width-(slider.outerWidth()-params.width);slider.css({height:sliderHeight,width:sliderWidth,cursor:"pointer"});var cursorHeight=cursor.outerHeight();cursor.css({position:"relative",top:0,left:0});obj.css("width",parseInt(obj.children("div."+params.prefix+"_targetContainer").outerWidth())+parseInt(slider.outerWidth()+params.fixWidth+2));var objHeight=obj.outerHeight()-(obj.outerHeight()-obj.height());obj.css("height",objHeight);var positionContainer=findPos();slider.bind("click",scrollclickbis);cursor.bind("mousedown",startdragHandlerV);obj.bind("mouseup",stopdragHandlerV);var ratioV=(totalV-params.height+parseInt(container.css("marginBottom"))+parseInt(container.css("marginTop"))+containerMarg)/(params.height-cursorHeight);var wheelGap=params.wheelGap/ratioV;var WheelpositionTop=0;if(params.smart){var tipsPos=0;for(k=0;k<tipsArray.length;k++){var tipsSelec=tipsContainer.find("li:eq("+k+")");if(k==(tipsArray.length-1)){var s=tipsArray[k].selector;var h=(totalV-tipsArray[k].top)/ratioV;tipsSelec.css("height",h);var spacing=tipsSelec.outerHeight();tipsSelec.css("height",h-(spacing-h));tipsArray[k].smart=tipsPos;tipsPos+=h}else{var h=(tipsArray[k+1].top-tipsArray[k].top)/ratioV;tipsSelec.css("height",h);var spacing=tipsSelec.outerHeight();tipsSelec.css("height",h-(spacing-h));tipsArray[k].smart=tipsPos;tipsPos+=h}}switch(params.fx){case"tips":tipsContainer.find("li span").hide();slider.not(tipsContainer).bind("mousemove",tipsDisplay);slider.bind("mouseleave",function(){tipsContainer.find("li span").hide();tipsIndex=-1}).find("span").bind("click",tipsScroll);break;case"tipsBox":tipsContainer.find("li").css("position","relative").hide();slider.find("span").bind("click",tipsScroll).bind("mousemove",tipsDisplay);break;default:slider.not(tipsContainer).bind("mousemove",tipsDisplay);slider.find("li").bind("click",tipsScroll);break}}obj.mousewheel(dragWheelHandlerV)}break}function resetStyle(){switch(params.mode){case"horizontal":obj.css("width","auto");break;default:obj.css("height","auto");break}obj.css({overflow:"visible","overflow-y":"visible","overflow-x":"visible"})}function createWrap(mode){obj.wrapInner('<div class="'+params.prefix+'_target" />').wrapInner('<div class="'+params.prefix+'_targetContainer" />').append('<div class="'+params.prefix+'_sliderBackground" />');slider=obj.children("div."+params.prefix+"_sliderBackground");switch(mode){default:slider.append('<div class="'+params.prefix+'_cursor" />');cursor=slider.children("div."+params.prefix+"_cursor");break}if(params.smart){slider.append('<ul class="'+params.prefix+'_tipsContainer" />');tipsContainer=slider.children("ul."+params.prefix+"_tipsContainer");for(j=0;j<tipsArray.length;j++){tipsContainer.append('<li><span class="'+params.prefix+'_tips">'+tipsArray[j].txt+"</span></li>");tipsContainer.css({position:"absolute",top:0,left:params.width,height:params.height})}}return true}function findPos(){var pos=slider.offset();return{x:pos.left,y:pos.top}}function scrollclickbis(event){positionContainer=findPos();var positionContent=event.pageY-positionContainer.y-(cursorHeight/2);if(positionContent<0){positionContent=0}if(positionContent>(params.height-cursorHeight)){positionContent=objHeight-cursorHeight;container.stop().animate({top:((params.height-cursorHeight)*(-ratioV))},"slow")}else{container.stop().animate({top:(positionContent*(-ratioV))},"slow")}cursor.stop().animate({top:positionContent},"fast")}function ScrollVDrag(event){var positionTop=event.pageY-positionContainer.y-(cursorHeight/2);if(positionTop<0){positionTop=0}if(positionTop>(params.height-cursorHeight)){positionTop=objHeight-cursorHeight;container.css("top",-ratioV*(params.height-cursorHeight))}else{container.css("top",-ratioV*positionTop)}cursor.css("top",positionTop);return false}function startdragHandlerV(event){positionContainer=findPos();slider.bind("mousemove",ScrollVDrag);return false}function stopdragHandlerV(event){slider.unbind("mousemove",ScrollVDrag);return false}function dragWheelHandlerV(event,delta){WheelpositionTop=parseInt(cursor.css("top"));if(delta>0){WheelpositionTop-=wheelGap}else{WheelpositionTop+=wheelGap}if(WheelpositionTop<0){WheelpositionTop=0}if(WheelpositionTop>params.height-cursorHeight){WheelpositionTop=objHeight-cursorHeight;container.stop().css({top:-ratioV*(params.height-cursorHeight)})}else{container.css({top:-ratioV*WheelpositionTop})}cursor.css({top:WheelpositionTop});return false}function tipsDisplay(event){positionContainer=findPos();var positionTop=event.pageY-positionContainer.y-(tipsArray.length*((tipsContainer.find("li").outerHeight()-tipsContainer.find("li").height())));var currentTipsIndex=tipsIndex;if(positionTop<0){positionTop=0}if(positionTop>params.height){positionTop=params.height}var z=tipsArray.length-1;for(z=tipsArray.length-1;z>-1;z--){if((tipsArray[z].smart)<positionTop){tipsIndex=z;break}}if(currentTipsIndex!==tipsIndex){switch(params.fx){case"tips":tipsContainer.find("li span").hide();tipsContainer.find("li span:eq("+tipsIndex+")").show(300);break;case"tipsBox":tipsContainer.find("li").hide();tipsContainer.find("li:eq("+tipsIndex+")").css("top",(tipsArray[tipsIndex].top/ratioV)-(cursorHeight/2)).fadeIn(400);break}}}function tipsScroll(event){event.stopPropagation();container.stop().animate({top:tipsArray[tipsIndex].smart*-ratioV},"slow");cursor.stop().animate({top:tipsArray[tipsIndex].smart},"fast")}});return this}})(jQuery);