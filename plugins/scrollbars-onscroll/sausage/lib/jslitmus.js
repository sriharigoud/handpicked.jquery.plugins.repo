(function(){var platform="unknown platform",ua=navigator.userAgent;var oses=["Windows","iPhone OS","(Intel |PPC )?Mac OS X","Linux"].join("|");var pOS=new RegExp("(("+oses+") [^ );]*)").test(ua)?RegExp.$1:null;if(!pOS){pOS=new RegExp("(("+oses+")[^ );]*)").test(ua)?RegExp.$1:null}var pName=/(Chrome|MSIE|Safari|Opera|Firefox)/.test(ua)?RegExp.$1:null;var vre=new RegExp("(Version|"+pName+")[ /]([^ ;]*)");var pVersion=(pName&&vre.test(ua))?RegExp.$2:null;var platform=(pOS&&pName&&pVersion)?pName+" "+pVersion+" on "+pOS:"unknown platform";var jsl={escape:function(s){s=s.replace(/,/g,"\\,");s=escape(s);s=s.replace(/\+/g,"%2b");s=s.replace(/ /g,"+");return s},$:function(id){return document.getElementById(id)},F:function(){},status:function(msg){var el=jsl.$("jsl_status");if(el){el.innerHTML=msg||""}},toLabel:function(n){if(n==Infinity){return"Infinity"}else{if(n>1000000000){n=Math.round(n/100000000);return n/10+"B"}else{if(n>1000000){n=Math.round(n/100000);return n/10+"M"}else{if(n>1000){n=Math.round(n/100);return n/10+"K"}}}}return n},extend:function(dst,src){for(var k in src){dst[k]=src[k]}return dst},join:function(o,delimit1,delimit2){if(o.join){return o.join(delimit1)}var pairs=[];for(var k in o){pairs.push(k+delimit1+o[k])}return pairs.join(delimit2)},indexOf:function(arr,o){if(arr.indexOf){return arr.indexOf(o)}for(var i=0;i<this.length;i++){if(arr[i]===o){return i}}return -1}};var Test=function(name,f){if(!f){throw new Error("Undefined test function")}if(!/function[^\(]*\(([^,\)]*)/.test(f.toString())){throw new Error('"'+name+'" test: Test is not a valid Function object')}this.loopArg=RegExp.$1;this.name=name;this.f=f};jsl.extend(Test,{CALIBRATIONS:[new Test("calibrating loop",function(count){while(count--){}}),new Test("calibrating function",jsl.F)],calibrate:function(onCalibrated){for(var i=0;i<Test.CALIBRATIONS.length;i++){var cal=Test.CALIBRATIONS[i];if(cal.running){return true}if(!cal.count){cal.isCalibration=true;cal.onStop=onCalibrated;cal.run(20000);return true}}return false}});jsl.extend(Test.prototype,{INIT_COUNT:10,MAX_COUNT:1000000000,MIN_TIME:0.5,onChange:jsl.F,onStop:jsl.F,reset:function(){delete this.count;delete this.time;delete this.running;delete this.error},run:function(count){count=count||this.INIT_COUNT;jsl.status(this.name+" x "+count);this.running=true;var me=this;setTimeout(function(){me._run(count)},200)},_run:function(count){var me=this;if(!me.isCalibration&&Test.calibrate(function(){me.run(count)})){return}this.error=null;try{var start,f=this.f,now,i=count;start=new Date();if(this.loopArg){f(count)}else{while(i--){f()}}this.time=Math.max(1,new Date()-start)/1000;this.count=count;this.period=this.time/count;this.running=this.time<=this.MIN_TIME;if(this.running){var x=this.MIN_TIME/this.time;var pow=Math.pow(2,Math.max(1,Math.ceil(Math.log(x)/Math.log(2))));count*=pow;if(count>this.MAX_COUNT){throw new Error("Max count exceeded.  If this test uses a looping function, make sure the iteration loop is working properly.")}}}catch(e){this.reset();this.error=e}if(this.running){me.run(count)}else{jsl.status("");me.onStop(me)}this.onChange(this)},getHz:function(normalize){var p=this.period;if(normalize&&!this.isCalibration){var cal=Test.CALIBRATIONS[this.loopArg?0:1];p=p<cal.period*1.2?0:p-cal.period}return Math.round(1/p)},toString:function(){return this.name+" - "+this.time/this.count+" secs"}});var STYLESHEET="<style>     #jslitmus {font-family:sans-serif; font-size: 12px;}     #jslitmus a {text-decoration: none;}     #jslitmus a:hover {text-decoration: underline;}     #jsl_status {       margin-top: 10px;       font-size: 10px;       color: #888;     }     A IMG  {border:none}     #test_results {       margin-top: 10px;       font-size: 12px;       font-family: sans-serif;       border-collapse: collapse;       border-spacing: 0px;     }     #test_results th, #test_results td {       border: solid 1px #ccc;       vertical-align: top;       padding: 3px;     }     #test_results th {       vertical-align: bottom;       background-color: #ccc;       padding: 1px;       font-size: 10px;     }     #test_results #test_platform {       color: #444;       text-align:center;     }     #test_results .test_row {       color: #006;       cursor: pointer;     }     #test_results .test_nonlooping {       border-left-style: dotted;       border-left-width: 2px;     }     #test_results .test_looping {       border-left-style: solid;       border-left-width: 2px;     }     #test_results .test_name {white-space: nowrap;}     #test_results .test_pending {     }     #test_results .test_running {       font-style: italic;     }     #test_results .test_done {}     #test_results .test_done {       text-align: right;       font-family: monospace;     }     #test_results .test_error {color: #600;}     #test_results .test_error .error_head {font-weight:bold;}     #test_results .test_error .error_body {font-size:85%;}     #test_results .test_row:hover td {       background-color: #ffc;       text-decoration: underline;     }     #chart {       margin: 10px 0px;       width: 250px;     }     #chart img {       border: solid 1px #ccc;       margin-bottom: 5px;     }     #chart #tiny_url {       height: 40px;       width: 250px;     }     #jslitmus_credit {       font-size: 10px;       color: #888;       margin-top: 8px;     }     </style>";var MARKUP='<div id="jslitmus">       <button onclick="JSLitmus.runAll(event)">Run Tests</button>       <button id="stop_button" disabled="disabled" onclick="JSLitmus.stop()">Stop Tests</button>       <br >       <br >       <input type="checkbox" style="vertical-align: middle" id="test_normalize" checked="checked" onchange="JSLitmus.renderAll()""> Normalize results       <table id="test_results">         <colgroup>           <col />           <col width="100" />         </colgroup>         <tr><th id="test_platform" colspan="2">'+platform+'</th></tr>         <tr><th>Test</th><th>Ops/sec</th></tr>         <tr id="test_row_template" class="test_row" style="display:none">           <td class="test_name"></td>           <td class="test_result">Ready</td>         </tr>       </table>       <div id="jsl_status"></div>       <div id="chart" style="display:none">       <a id="chart_link" target="_blank"><img id="chart_image"></a>       TinyURL (for chart):       <iframe id="tiny_url" frameBorder="0" scrolling="no" src=""></iframe>       </div>       <a id="jslitmus_credit" title="JSLitmus home page" href="http://code.google.com/p/jslitmus" target="_blank">Powered by JSLitmus</a>     </div>';window.JSLitmus={_tests:[],_queue:[],params:{},_init:function(){var match=(location+"").match(/([^?#]*)(#.*)?$/);if(match){var pairs=match[1].split("&");for(var i=0;i<pairs.length;i++){var pair=pairs[i].split("=");if(pair.length>1){var key=pair.shift();var value=pair.length>1?pair.join("="):pair[0];this.params[key]=value}}}document.write(STYLESHEET);if(window.addEventListener){window.addEventListener("load",this._setup,false)}else{if(document.addEventListener){document.addEventListener("load",this._setup,false)}else{if(window.attachEvent){window.attachEvent("onload",this._setup)}}}return this},_setup:function(){var el=jsl.$("jslitmus_container");if(!el){document.body.appendChild(el=document.createElement("div"))}el.innerHTML=MARKUP;for(var i=0;i<JSLitmus._tests.length;i++){JSLitmus.renderTest(JSLitmus._tests[i])}},renderAll:function(){for(var i=0;i<JSLitmus._tests.length;i++){JSLitmus.renderTest(JSLitmus._tests[i])}JSLitmus.renderChart()},renderChart:function(){var url=JSLitmus.chartUrl();jsl.$("chart_link").href=url;jsl.$("chart_image").src=url;jsl.$("chart").style.display="";jsl.$("tiny_url").src="http://tinyurl.com/api-create.php?url="+escape(url)},renderTest:function(test){if(!test._row){var trow=jsl.$("test_row_template");if(!trow){return}test._row=trow.cloneNode(true);test._row.style.display="";test._row.id="";test._row.onclick=function(){JSLitmus._queueTest(test)};test._row.title="Run "+test.name+" test";trow.parentNode.appendChild(test._row);test._row.cells[0].innerHTML=test.name}var cell=test._row.cells[1];var cns=[test.loopArg?"test_looping":"test_nonlooping"];if(test.error){cns.push("test_error");cell.innerHTML='<div class="error_head">'+test.error+'</div><ul class="error_body"><li>'+jsl.join(test.error,": ","</li><li>")+"</li></ul>"}else{if(test.running){cns.push("test_running");cell.innerHTML="running"}else{if(jsl.indexOf(JSLitmus._queue,test)>=0){cns.push("test_pending");cell.innerHTML="pending"}else{if(test.count){cns.push("test_done");var hz=test.getHz(jsl.$("test_normalize").checked);cell.innerHTML=hz!=Infinity?hz:"&infin;";cell.title="Looped "+test.count+" times in "+test.time+" seconds"}else{cell.innerHTML="ready"}}}}cell.className=cns.join(" ")},test:function(name,f){var test=new Test(name,f);JSLitmus._tests.push(test);test.onChange=JSLitmus.renderTest;test.onStop=function(test){if(JSLitmus.onTestFinish){JSLitmus.onTestFinish(test)}JSLitmus.currentTest=null;JSLitmus._nextTest()};this.renderTest(test)},runAll:function(e){e=e||window.event;var reverse=e&&e.shiftKey,len=JSLitmus._tests.length;for(var i=0;i<len;i++){JSLitmus._queueTest(JSLitmus._tests[!reverse?i:(len-i-1)])}},stop:function(){while(JSLitmus._queue.length){var test=JSLitmus._queue.shift();JSLitmus.renderTest(test)}},_nextTest:function(){if(!JSLitmus.currentTest){var test=JSLitmus._queue.shift();if(test){jsl.$("stop_button").disabled=false;JSLitmus.currentTest=test;test.run();JSLitmus.renderTest(test);if(JSLitmus.onTestStart){JSLitmus.onTestStart(test)}}else{jsl.$("stop_button").disabled=true;JSLitmus.renderChart()}}},_queueTest:function(test){if(jsl.indexOf(JSLitmus._queue,test)>=0){return}JSLitmus._queue.push(test);JSLitmus.renderTest(test);JSLitmus._nextTest()},chartUrl:function(){var n=JSLitmus._tests.length,markers=[],data=[];var d,min=0,max=-10000000000;var normalize=jsl.$("test_normalize").checked;for(var i=0;i<JSLitmus._tests.length;i++){var test=JSLitmus._tests[i];if(test.count){var hz=test.getHz(normalize);var v=hz!=Infinity?hz:0;data.push(v);markers.push("t"+jsl.escape(test.name+"("+jsl.toLabel(hz)+")")+",000000,0,"+markers.length+",10");max=Math.max(v,max)}}if(markers.length<=0){return null}var title=document.getElementsByTagName("title");title=(title&&title.length)?title[0].innerHTML:null;var chart_title=[];if(title){chart_title.push(title)}chart_title.push("Ops/sec ("+platform+")");var labels=[jsl.toLabel(min),jsl.toLabel(max)];var w=250,bw=15;var bs=5;var h=markers.length*(bw+bs)+30+chart_title.length*20;var params={chtt:escape(chart_title.join("|")),chts:"000000,10",cht:"bhg",chd:"t:"+data.join(","),chds:min+","+max,chxt:"x",chxl:"0:|"+labels.join("|"),chsp:"0,1",chm:markers.join("|"),chbh:[bw,0,bs].join(","),chs:w+"x"+h};return"http://chart.apis.google.com/chart?"+jsl.join(params,"=","&")}};JSLitmus._init()})();