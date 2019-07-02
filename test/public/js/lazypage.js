/*!
 *  lazypage.js 
 *  by fengshangbin 2019-01-10 
 *  https://github.com/fengshangbin/LazyPage 
 *  Easy H5 Page Framework
 */
var LazyPage=function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/dist/",a(a.s=1)}([function(e,t){e.exports=function(){var e=!1,t=[];this.bind=function(a){e?a.call(window):t.push(a)},this.trigger=function(){if(!e){e=!0;for(var a=0;a<t.length;a++)t[a].apply(window);t=null}}}},function(e,t,a){e.exports=a(2)},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"ready",function(){return ready}),__webpack_require__.d(__webpack_exports__,"runBlock",function(){return runBlock}),__webpack_require__.d(__webpack_exports__,"checkBlocks",function(){return checkBlocks}),__webpack_require__.d(__webpack_exports__,"data",function(){return data});var _ready=__webpack_require__(0),readyDom=__webpack_require__(3),baiduRun=__webpack_require__(4),analyzeScript=__webpack_require__(6),ajax=__webpack_require__(7),readyLazy=new _ready,scriptTotal=0,scriptLoad=0;function renderDom(e){if(null!=e.parentNode){var t=e.html,a=e.data;if(null!=t&&null!=a){t=replaceParamAsValue(t,!1);var r=baidu.template(t,a);e.outerHTML=r;for(var n=analyzeScript.extractCode(r),o=n.codes,c=n.srcs,l=0,u=o.length;l<u;l++)analyzeScript.evalScripts(o[l]);scriptTotal+=c.length;for(var i=0,d=0,p=c.length;d<p;d++)analyzeScript.dynamicLoadJs(c[d],function(){scriptLoad++,++i==c.length&&renderDomEnd(e)});i==c.length&&renderDomEnd(e)}}}function renderDomEnd(e){null!=e.callback&&e.callback(),e.html=null,e.data=null,e.callback=null,releaseWait(e),checkBlocks()}function checkBlocks(){for(var e=document.querySelectorAll("script[type=x-tmpl-lazypage]"),t=0,a=0;a<e.length;a++){var r=e[a];if(!(r.data||r.ajaxData||r.source||r.ajaxSource)){var n=r.getAttribute("lazy");if(null==n||"false"==n){var o=r.getAttribute("wait");null==o||""==o?runBlock(r):t++}else t++}}e.length==t&&scriptTotal==scriptLoad&&readyLazy.trigger()}function getQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(t);return null!=a?a[2]:""}function addModeData(e,t){e.data=t;var a=e.getAttribute("id");null!=a&&(LazyPage.data[a]=e.data)}function replaceParamAsValue(html,isString){return html=html.replace(/{&(.*?)}/g,function(e,t,a){return toValueString(getQueryString(t),isString)}),html=html.replace(/{\$(.*?)}/g,function(match,p1,offset){return toValueString(eval("LazyPage.pathParams["+p1+"]"),isString)}),html=html.replace(/{@(.*?)}/g,function(match,p1,offset){return toValueString(eval("LazyPage.data."+p1),isString)}),html}function toValueString(e,t){return t?e:"string"==typeof e?'"'+e+'"':e}function releaseWait(e){var t=e.getAttribute("id");if(null!=t)for(var a=document.querySelectorAll("script[wait]"),r=0;r<a.length;r++){var n=a[r],o=n.getAttribute("wait");o=o.replace(new RegExp(t+" ?","g"),""),n.setAttribute("wait",o)}}function runBlock(e,t){var a=e.getAttribute("src"),r=e.getAttribute("source");if(e.callback=t,null!=r&&""!=r)if(/(^\{(.*?)\}$)|(^\[(.*?)\]$)/.test(r))r=r.replace(/'/g,'"'),addModeData(e,JSON.parse(r));else{e.ajaxData=!0;var n=e.getAttribute("ajax-type"),o=e.getAttribute("ajax-data")||"";o=replaceParamAsValue(o,!0),r=replaceParamAsValue(r,!0),ajax({url:r,type:n,data:o,success:function(t){t=JSON.parse(t),addModeData(e,t),renderDom(e)},error:function(t){console.log("error",t),e.setAttribute("type","x-tmpl-lazypage-error"),checkBlocks()}})}else e.data={};if(null!=a&&""!=a)e.ajaxSource=!0,a=replaceParamAsValue(a,!0),ajax({url:a,success:function(t){e.html=t,renderDom(e)},error:function(t){console.log("error",t),e.setAttribute("type","x-tmpl-lazypage-error"),checkBlocks()}});else{var c=e.innerHTML;e.html=c.replace(/jscript/g,"script")}renderDom(e)}function ready(e){readyLazy.bind(e)}readyDom(function(){checkBlocks()});var data={};if(window&&window.innerWidth>1){var exdate=new Date;exdate.setDate(exdate.getDate()+365),document.cookie="LazyPageSpider=0;expires="+exdate.toGMTString()+";path=/"}},function(e,t,a){var r,n=new(a(0)),o=function e(t){n.trigger(),document.removeEventListener?document.removeEventListener("DOMContentLoaded",e,!1):document.attachEvent&&(document.detachEvent("onreadystatechange",e),window==window.top&&(clearInterval(r),r=null))};document.addEventListener?document.addEventListener("DOMContentLoaded",o,!1):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){/loaded|complete/.test(document.readyState)&&o()}),window==window.top&&(r=setInterval(function(){try{document.documentElement.doScroll("left")}catch(e){return}o()},5))),e.exports=n.bind},function(module,exports,__webpack_require__){(function(global){var baidu={};void 0!==global&&(global.baidu=baidu),baidu.template=function(e,t){var a=bt._compile(e),r=a(t).replace(/<&(.*?)&>/g,"<%$1%>").replace(/<%&(.*?)&%>/g,"<&&$1&&>").replace(/<&&/g,"<&").replace(/&&>/g,"&>");return a=null,r};var bt=baidu.template;function run(str,data,mode){return"string"==typeof data&&(data=JSON.parse(data)),null==mode?result=baidu.template(str,data):(result=eval("data."+str)+"","false"==mode&&"string"==typeof result&&(result='"'+result+'"')),result}bt.LEFT_DELIMITER="<%",bt.RIGHT_DELIMITER="%>",bt.ESCAPE=!0,bt._encodeHTML=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\/g,"&#92;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},bt._encodeReg=function(e){return String(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},bt._encodeEventHTML=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\\\\/g,"\\").replace(/\\\//g,"/").replace(/\\n/g,"\n").replace(/\\r/g,"\r")},bt._compile=function(e){var t="var _template_fun_array=[];\nvar fn=(function(__data__){\nvar _template_varName='';\nfor(name in __data__){\n_template_varName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('"+bt._analysisStr(e)+"');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";return new Function("_template_object",t)},bt._analysisStr=function(e){var t=bt.LEFT_DELIMITER,a=bt.RIGHT_DELIMITER,r=bt._encodeReg(t),n=bt._encodeReg(a);return e=(e=String(e).replace(new RegExp("("+r+"[^"+n+"]*)//.*\n","g"),"$1").replace(/<!--[\w\W]*?-->/gm,"").replace(new RegExp(r+"\\*.*?\\*"+n,"g"),"").replace(new RegExp("[\\r\\t\\n]","g"),"").replace(new RegExp(r+"(?:(?!"+n+")[\\s\\S])*"+n+"|((?:(?!"+r+")[\\s\\S])+)","g"),function(e,t){var a="";if(t)for(a=t.replace(/\\/g,"&#92;").replace(/'/g,"&#39;");/<[^<]*?&#39;[^<]*?>/g.test(a);)a=a.replace(/(<[^<]*?)&#39;([^<]*?>)/g,"$1\r$2");else a=e;return a})).replace(new RegExp("("+r+"[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?"+n,"g"),"$1;"+a).replace(new RegExp("("+r+":?[hvu]?[\\s]*?=[\\s]*?[^;|"+n+"]*?);[\\s]*?"+n,"g"),"$1"+a).split(t).join("\t"),e=(e=bt.ESCAPE?e.replace(new RegExp("\\t=(.*?)"+n,"g"),"',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'"):e.replace(new RegExp("\\t=(.*?)"+n,"g"),"',typeof($1) === 'undefined'?'':$1,'")).replace(new RegExp("\\t:h=(.*?)"+n,"g"),"',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'").replace(new RegExp("\\t(?::=|-)(.*?)"+n,"g"),"',typeof($1)==='undefined'?'':$1,'").replace(new RegExp("\\t:u=(.*?)"+n,"g"),"',typeof($1)==='undefined'?'':encodeURIComponent($1),'").replace(new RegExp("\\t:v=(.*?)"+n,"g"),"',typeof($1)==='undefined'?'':baidu.template._encodeEventHTML($1),'").split("\t").join("');").split(a).join("_template_fun_array.push('").split("\r").join("\\'")},module.exports=run}).call(this,__webpack_require__(5))},function(e,t){var a;a=function(){return this}();try{a=a||new Function("return this")()}catch(e){"object"==typeof window&&(a=window)}e.exports=a},function(e,t){var a={extractCode:function(e,t){for(var a=t?"style":"script",r="<"+a+"[^>]*>([\\S\\s]*?)</"+a+"\\s*>",n=new RegExp(r,"img"),o=new RegExp(r,"im"),c=/src=[\'\"]?([^\'\"]*)[\'\"]?/i,l=/type=[\'\"]?([^\'\"]*)[\'\"]?/i,u=e.match(n)||[],i=[],d=[],p=0,s=u.length;p<s;p++){var _=(u[p].match(l)||["",""])[1].toLowerCase();if(""==_||_.indexOf("javascript")>=0){var f=(u[p].match(o)||["",""])[1];f&&""!=f&&d.push(f);var g=(u[p].match(c)||["",""])[1];g&&""!=g&&i.push(g)}}return{codes:d,srcs:i}},evalScripts:function(e){var t=document.getElementsByTagName("head")[0],a=document.createElement("script");a.text=e,t.insertBefore(a,t.firstChild),t.removeChild(a)},dynamicLoadJs:function(e,t){var a=document.getElementsByTagName("head")[0],r=document.createElement("script");r.type="text/javascript",r.src=e,r.onload=r.onreadystatechange=function(){this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(r.onload=r.onreadystatechange=null,a.removeChild(r),t&&t())},r.onerror=function(){t&&t()},a.appendChild(r)},evalStyles:function(e){var t=document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css";try{a.appendChild(document.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.appendChild(a)}};e.exports=a},function(e,t,a){e.exports=function(){var e={type:arguments[0].type||"GET",url:arguments[0].url||"",async:arguments[0].async||"true",data:arguments[0].data||null,dataType:arguments[0].dataType||"text",header:arguments[0].header||null,contentType:arguments[0].contentType||"application/x-www-form-urlencoded",beforeSend:arguments[0].beforeSend||function(){},success:arguments[0].success||function(){},error:arguments[0].error||function(){}};e.beforeSend();var t=new XMLHttpRequest;if("get"==e.type.toLowerCase()&&null!=e.data&&""!=e.data&&(e.url+=e.url.indexOf("?")>0?"&":"?",e.url+=e.data),t.open(e.type,e.url,e.async),t.setRequestHeader("Content-Type",e.contentType),null!=e.header)for(var a in e.header)t.setRequestHeader(a,e.header[a]);t.send("post"==e.type.toLowerCase()&&null!=e.data?e.data:null),t.onreadystatechange=function(){4==t.readyState&&(200==t.status?e.success(t.responseText):e.error(t.status))}}}]);