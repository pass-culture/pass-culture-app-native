import{o as Ph}from"./QueryClientProvider-DeV8N_iD.js";import{u as Su,Q as bu}from"./queryKeys-C9NuN75w.js";import{L as Au,_ as Cu,r as Vs,C as xi,a as wt,S as Nu,F as ki,c as Fh,g as R,b as Zr,i as Du,d as Vh,e as Bh,f as Uh,h as qh,j as $h,k as Kh,l as Gh,m as xu,n as ku,o as jh,p as zh,E as Wh,q as Hh}from"./index.esm2017-Dy4WPBHL.js";import{a as Bs,g as Yh,b as Qh}from"./packageJson-BxUjkxge.js";import{S as qt}from"./types-C1KKYo5i.js";var Xh=typeof globalThis<"u"?globalThis:typeof window<"u"||typeof window<"u"?window:typeof self<"u"?self:{},_,Li=Li||{},C=Xh||self;function Us(){}function ei(n){var e=typeof n;return e=e!="object"?e:n?Array.isArray(n)?"array":e:"null",e=="array"||e=="object"&&typeof n.length=="number"}function ur(n){var e=typeof n;return e=="object"&&n!=null||e=="function"}function Jh(n){return Object.prototype.hasOwnProperty.call(n,Fr)&&n[Fr]||(n[Fr]=++Zh)}var Fr="closure_uid_"+(1e9*Math.random()>>>0),Zh=0;function ed(n,e,t){return n.call.apply(n.bind,arguments)}function td(n,e,t){if(!n)throw Error();if(2<arguments.length){var s=Array.prototype.slice.call(arguments,2);return function(){var r=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(r,s),n.apply(e,r)}}return function(){return n.apply(e,arguments)}}function ce(n,e,t){return Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?ce=ed:ce=td,ce.apply(null,arguments)}function _s(n,e){var t=Array.prototype.slice.call(arguments,1);return function(){var s=t.slice();return s.push.apply(s,arguments),n.apply(this,s)}}function he(n,e){function t(){}t.prototype=e.prototype,n.Z=e.prototype,n.prototype=new t,n.prototype.constructor=n,n.Vb=function(s,r,i){for(var o=Array(arguments.length-2),a=2;a<arguments.length;a++)o[a-2]=arguments[a];return e.prototype[r].apply(s,o)}}function nt(){this.s=this.s,this.o=this.o}var nd=0;nt.prototype.s=!1;nt.prototype.na=function(){!this.s&&(this.s=!0,this.M(),nd!=0)&&Jh(this)};nt.prototype.M=function(){if(this.o)for(;this.o.length;)this.o.shift()()};const Lu=Array.prototype.indexOf?function(n,e){return Array.prototype.indexOf.call(n,e,void 0)}:function(n,e){if(typeof n=="string")return typeof e!="string"||e.length!=1?-1:n.indexOf(e,0);for(let t=0;t<n.length;t++)if(t in n&&n[t]===e)return t;return-1},Mu=Array.prototype.forEach?function(n,e,t){Array.prototype.forEach.call(n,e,t)}:function(n,e,t){const s=n.length,r=typeof n=="string"?n.split(""):n;for(let i=0;i<s;i++)i in r&&e.call(t,r[i],i,n)};function sd(n){e:{var e=Yd;const t=n.length,s=typeof n=="string"?n.split(""):n;for(let r=0;r<t;r++)if(r in s&&e.call(void 0,s[r],r,n)){e=r;break e}e=-1}return 0>e?null:typeof n=="string"?n.charAt(e):n[e]}function ta(n){return Array.prototype.concat.apply([],arguments)}function Mi(n){const e=n.length;if(0<e){const t=Array(e);for(let s=0;s<e;s++)t[s]=n[s];return t}return[]}function qs(n){return/^[\s\xa0]*$/.test(n)}var na=String.prototype.trim?function(n){return n.trim()}:function(n){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(n)[1]};function we(n,e){return n.indexOf(e)!=-1}function Vr(n,e){return n<e?-1:n>e?1:0}var ve;e:{var sa=C.navigator;if(sa){var ra=sa.userAgent;if(ra){ve=ra;break e}}ve=""}function Ri(n,e,t){for(const s in n)e.call(t,n[s],s,n)}function Ru(n){const e={};for(const t in n)e[t]=n[t];return e}var ia="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ou(n,e){let t,s;for(let r=1;r<arguments.length;r++){s=arguments[r];for(t in s)n[t]=s[t];for(let i=0;i<ia.length;i++)t=ia[i],Object.prototype.hasOwnProperty.call(s,t)&&(n[t]=s[t])}}function Oi(n){return Oi[" "](n),n}Oi[" "]=Us;function rd(n){var e=ad;return Object.prototype.hasOwnProperty.call(e,9)?e[9]:e[9]=n(9)}var id=we(ve,"Opera"),Zt=we(ve,"Trident")||we(ve,"MSIE"),Pu=we(ve,"Edge"),ti=Pu||Zt,Fu=we(ve,"Gecko")&&!(we(ve.toLowerCase(),"webkit")&&!we(ve,"Edge"))&&!(we(ve,"Trident")||we(ve,"MSIE"))&&!we(ve,"Edge"),od=we(ve.toLowerCase(),"webkit")&&!we(ve,"Edge");function Vu(){var n=C.document;return n?n.documentMode:void 0}var $s;e:{var Br="",Ur=function(){var n=ve;if(Fu)return/rv:([^\);]+)(\)|;)/.exec(n);if(Pu)return/Edge\/([\d\.]+)/.exec(n);if(Zt)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(n);if(od)return/WebKit\/(\S+)/.exec(n);if(id)return/(?:Version)[ \/]?(\S+)/.exec(n)}();if(Ur&&(Br=Ur?Ur[1]:""),Zt){var qr=Vu();if(qr!=null&&qr>parseFloat(Br)){$s=String(qr);break e}}$s=Br}var ad={};function ud(){return rd(function(){let n=0;const e=na(String($s)).split("."),t=na("9").split("."),s=Math.max(e.length,t.length);for(let o=0;n==0&&o<s;o++){var r=e[o]||"",i=t[o]||"";do{if(r=/(\d*)(\D*)(.*)/.exec(r)||["","","",""],i=/(\d*)(\D*)(.*)/.exec(i)||["","","",""],r[0].length==0&&i[0].length==0)break;n=Vr(r[1].length==0?0:parseInt(r[1],10),i[1].length==0?0:parseInt(i[1],10))||Vr(r[2].length==0,i[2].length==0)||Vr(r[2],i[2]),r=r[3],i=i[3]}while(n==0)}return 0<=n})}var ni;if(C.document&&Zt){var oa=Vu();ni=oa||parseInt($s,10)||void 0}else ni=void 0;var cd=ni,ld=function(){if(!C.addEventListener||!Object.defineProperty)return!1;var n=!1,e=Object.defineProperty({},"passive",{get:function(){n=!0}});try{C.addEventListener("test",Us,e),C.removeEventListener("test",Us,e)}catch{}return n}();function fe(n,e){this.type=n,this.g=this.target=e,this.defaultPrevented=!1}fe.prototype.h=function(){this.defaultPrevented=!0};function Pn(n,e){if(fe.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n){var t=this.type=n.type,s=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;if(this.target=n.target||n.srcElement,this.g=e,e=n.relatedTarget){if(Fu){e:{try{Oi(e.nodeName);var r=!0;break e}catch{}r=!1}r||(e=null)}}else t=="mouseover"?e=n.fromElement:t=="mouseout"&&(e=n.toElement);this.relatedTarget=e,s?(this.clientX=s.clientX!==void 0?s.clientX:s.pageX,this.clientY=s.clientY!==void 0?s.clientY:s.pageY,this.screenX=s.screenX||0,this.screenY=s.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=typeof n.pointerType=="string"?n.pointerType:hd[n.pointerType]||"",this.state=n.state,this.i=n,n.defaultPrevented&&Pn.Z.h.call(this)}}he(Pn,fe);var hd={2:"touch",3:"pen",4:"mouse"};Pn.prototype.h=function(){Pn.Z.h.call(this);var n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var cr="closure_listenable_"+(1e6*Math.random()|0),dd=0;function fd(n,e,t,s,r){this.listener=n,this.proxy=null,this.src=e,this.type=t,this.capture=!!s,this.ia=r,this.key=++dd,this.ca=this.fa=!1}function lr(n){n.ca=!0,n.listener=null,n.proxy=null,n.src=null,n.ia=null}function hr(n){this.src=n,this.g={},this.h=0}hr.prototype.add=function(n,e,t,s,r){var i=n.toString();n=this.g[i],n||(n=this.g[i]=[],this.h++);var o=ri(n,e,s,r);return-1<o?(e=n[o],t||(e.fa=!1)):(e=new fd(e,this.src,i,!!s,r),e.fa=t,n.push(e)),e};function si(n,e){var t=e.type;if(t in n.g){var s=n.g[t],r=Lu(s,e),i;(i=0<=r)&&Array.prototype.splice.call(s,r,1),i&&(lr(e),n.g[t].length==0&&(delete n.g[t],n.h--))}}function ri(n,e,t,s){for(var r=0;r<n.length;++r){var i=n[r];if(!i.ca&&i.listener==e&&i.capture==!!t&&i.ia==s)return r}return-1}var Pi="closure_lm_"+(1e6*Math.random()|0),$r={};function Bu(n,e,t,s,r){if(Array.isArray(e)){for(var i=0;i<e.length;i++)Bu(n,e[i],t,s,r);return null}return t=$u(t),n&&n[cr]?n.N(e,t,ur(s)?!!s.capture:!!s,r):gd(n,e,t,!1,s,r)}function gd(n,e,t,s,r,i){if(!e)throw Error("Invalid event type");var o=ur(r)?!!r.capture:!!r,a=Vi(n);if(a||(n[Pi]=a=new hr(n)),t=a.add(e,t,s,o,i),t.proxy)return t;if(s=md(),t.proxy=s,s.src=n,s.listener=t,n.addEventListener)ld||(r=o),r===void 0&&(r=!1),n.addEventListener(e.toString(),s,r);else if(n.attachEvent)n.attachEvent(qu(e.toString()),s);else if(n.addListener&&n.removeListener)n.addListener(s);else throw Error("addEventListener and attachEvent are unavailable.");return t}function md(){function n(t){return e.call(n.src,n.listener,t)}var e=pd;return n}function Uu(n,e,t,s,r){if(Array.isArray(e))for(var i=0;i<e.length;i++)Uu(n,e[i],t,s,r);else s=ur(s)?!!s.capture:!!s,t=$u(t),n&&n[cr]?(n=n.i,e=String(e).toString(),e in n.g&&(i=n.g[e],t=ri(i,t,s,r),-1<t&&(lr(i[t]),Array.prototype.splice.call(i,t,1),i.length==0&&(delete n.g[e],n.h--)))):n&&(n=Vi(n))&&(e=n.g[e.toString()],n=-1,e&&(n=ri(e,t,s,r)),(t=-1<n?e[n]:null)&&Fi(t))}function Fi(n){if(typeof n!="number"&&n&&!n.ca){var e=n.src;if(e&&e[cr])si(e.i,n);else{var t=n.type,s=n.proxy;e.removeEventListener?e.removeEventListener(t,s,n.capture):e.detachEvent?e.detachEvent(qu(t),s):e.addListener&&e.removeListener&&e.removeListener(s),(t=Vi(e))?(si(t,n),t.h==0&&(t.src=null,e[Pi]=null)):lr(n)}}}function qu(n){return n in $r?$r[n]:$r[n]="on"+n}function pd(n,e){if(n.ca)n=!0;else{e=new Pn(e,this);var t=n.listener,s=n.ia||n.src;n.fa&&Fi(n),n=t.call(s,e)}return n}function Vi(n){return n=n[Pi],n instanceof hr?n:null}var Kr="__closure_events_fn_"+(1e9*Math.random()>>>0);function $u(n){return typeof n=="function"?n:(n[Kr]||(n[Kr]=function(e){return n.handleEvent(e)}),n[Kr])}function ne(){nt.call(this),this.i=new hr(this),this.P=this,this.I=null}he(ne,nt);ne.prototype[cr]=!0;ne.prototype.removeEventListener=function(n,e,t,s){Uu(this,n,e,t,s)};function le(n,e){var t,s=n.I;if(s)for(t=[];s;s=s.I)t.push(s);if(n=n.P,s=e.type||e,typeof e=="string")e=new fe(e,n);else if(e instanceof fe)e.target=e.target||n;else{var r=e;e=new fe(s,n),Ou(e,r)}if(r=!0,t)for(var i=t.length-1;0<=i;i--){var o=e.g=t[i];r=Ts(o,s,!0,e)&&r}if(o=e.g=n,r=Ts(o,s,!0,e)&&r,r=Ts(o,s,!1,e)&&r,t)for(i=0;i<t.length;i++)o=e.g=t[i],r=Ts(o,s,!1,e)&&r}ne.prototype.M=function(){if(ne.Z.M.call(this),this.i){var n=this.i,e;for(e in n.g){for(var t=n.g[e],s=0;s<t.length;s++)lr(t[s]);delete n.g[e],n.h--}}this.I=null};ne.prototype.N=function(n,e,t,s){return this.i.add(String(n),e,!1,t,s)};ne.prototype.O=function(n,e,t,s){return this.i.add(String(n),e,!0,t,s)};function Ts(n,e,t,s){if(e=n.i.g[String(e)],!e)return!0;e=e.concat();for(var r=!0,i=0;i<e.length;++i){var o=e[i];if(o&&!o.ca&&o.capture==t){var a=o.listener,u=o.ia||o.src;o.fa&&si(n.i,o),r=a.call(u,s)!==!1&&r}}return r&&!s.defaultPrevented}var Bi=C.JSON.stringify;function yd(){var n=Gu;let e=null;return n.g&&(e=n.g,n.g=n.g.next,n.g||(n.h=null),e.next=null),e}class wd{constructor(){this.h=this.g=null}add(e,t){const s=Ku.get();s.set(e,t),this.h?this.h.next=s:this.g=s,this.h=s}}var Ku=new class{constructor(n,e){this.i=n,this.j=e,this.h=0,this.g=null}get(){let n;return 0<this.h?(this.h--,n=this.g,this.g=n.next,n.next=null):n=this.i(),n}}(()=>new vd,n=>n.reset());class vd{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}function Id(n){C.setTimeout(()=>{throw n},0)}function Ui(n,e){ii||Ed(),oi||(ii(),oi=!0),Gu.add(n,e)}var ii;function Ed(){var n=C.Promise.resolve(void 0);ii=function(){n.then(_d)}}var oi=!1,Gu=new wd;function _d(){for(var n;n=yd();){try{n.h.call(n.g)}catch(t){Id(t)}var e=Ku;e.j(n),100>e.h&&(e.h++,n.next=e.g,e.g=n)}oi=!1}function dr(n,e){ne.call(this),this.h=n||1,this.g=e||C,this.j=ce(this.kb,this),this.l=Date.now()}he(dr,ne);_=dr.prototype;_.da=!1;_.S=null;_.kb=function(){if(this.da){var n=Date.now()-this.l;0<n&&n<.8*this.h?this.S=this.g.setTimeout(this.j,this.h-n):(this.S&&(this.g.clearTimeout(this.S),this.S=null),le(this,"tick"),this.da&&(qi(this),this.start()))}};_.start=function(){this.da=!0,this.S||(this.S=this.g.setTimeout(this.j,this.h),this.l=Date.now())};function qi(n){n.da=!1,n.S&&(n.g.clearTimeout(n.S),n.S=null)}_.M=function(){dr.Z.M.call(this),qi(this),delete this.g};function $i(n,e,t){if(typeof n=="function")t&&(n=ce(n,t));else if(n&&typeof n.handleEvent=="function")n=ce(n.handleEvent,n);else throw Error("Invalid listener argument");return 2147483647<Number(e)?-1:C.setTimeout(n,e||0)}function ju(n){n.g=$i(()=>{n.g=null,n.i&&(n.i=!1,ju(n))},n.j);const e=n.h;n.h=null,n.m.apply(null,e)}class Td extends nt{constructor(e,t){super(),this.m=e,this.j=t,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:ju(this)}M(){super.M(),this.g&&(C.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Fn(n){nt.call(this),this.h=n,this.g={}}he(Fn,nt);var aa=[];function zu(n,e,t,s){Array.isArray(t)||(t&&(aa[0]=t.toString()),t=aa);for(var r=0;r<t.length;r++){var i=Bu(e,t[r],s||n.handleEvent,!1,n.h||n);if(!i)break;n.g[i.key]=i}}function Wu(n){Ri(n.g,function(e,t){this.g.hasOwnProperty(t)&&Fi(e)},n),n.g={}}Fn.prototype.M=function(){Fn.Z.M.call(this),Wu(this)};Fn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};function fr(){this.g=!0}fr.prototype.Aa=function(){this.g=!1};function Sd(n,e,t,s,r,i){n.info(function(){if(n.g)if(i)for(var o="",a=i.split("&"),u=0;u<a.length;u++){var c=a[u].split("=");if(1<c.length){var l=c[0];c=c[1];var h=l.split("_");o=2<=h.length&&h[1]=="type"?o+(l+"="+c+"&"):o+(l+"=redacted&")}}else o=null;else o=i;return"XMLHTTP REQ ("+s+") [attempt "+r+"]: "+e+`
`+t+`
`+o})}function bd(n,e,t,s,r,i,o){n.info(function(){return"XMLHTTP RESP ("+s+") [ attempt "+r+"]: "+e+`
`+t+`
`+i+" "+o})}function Ht(n,e,t,s){n.info(function(){return"XMLHTTP TEXT ("+e+"): "+Cd(n,t)+(s?" "+s:"")})}function Ad(n,e){n.info(function(){return"TIMEOUT: "+e})}fr.prototype.info=function(){};function Cd(n,e){if(!n.g)return e;if(!e)return null;try{var t=JSON.parse(e);if(t){for(n=0;n<t.length;n++)if(Array.isArray(t[n])){var s=t[n];if(!(2>s.length)){var r=s[1];if(Array.isArray(r)&&!(1>r.length)){var i=r[0];if(i!="noop"&&i!="stop"&&i!="close")for(var o=1;o<r.length;o++)r[o]=""}}}}return Bi(t)}catch{return e}}var kt={},ua=null;function gr(){return ua=ua||new ne}kt.Ma="serverreachability";function Hu(n){fe.call(this,kt.Ma,n)}he(Hu,fe);function Vn(n){const e=gr();le(e,new Hu(e))}kt.STAT_EVENT="statevent";function Yu(n,e){fe.call(this,kt.STAT_EVENT,n),this.stat=e}he(Yu,fe);function Ie(n){const e=gr();le(e,new Yu(e,n))}kt.Na="timingevent";function Qu(n,e){fe.call(this,kt.Na,n),this.size=e}he(Qu,fe);function ns(n,e){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return C.setTimeout(function(){n()},e)}var mr={NO_ERROR:0,lb:1,yb:2,xb:3,sb:4,wb:5,zb:6,Ja:7,TIMEOUT:8,Cb:9},Xu={qb:"complete",Mb:"success",Ka:"error",Ja:"abort",Eb:"ready",Fb:"readystatechange",TIMEOUT:"timeout",Ab:"incrementaldata",Db:"progress",tb:"downloadprogress",Ub:"uploadprogress"};function Ki(){}Ki.prototype.h=null;function ca(n){return n.h||(n.h=n.i())}function Ju(){}var ss={OPEN:"a",pb:"b",Ka:"c",Bb:"d"};function Gi(){fe.call(this,"d")}he(Gi,fe);function ji(){fe.call(this,"c")}he(ji,fe);var ai;function pr(){}he(pr,Ki);pr.prototype.g=function(){return new XMLHttpRequest};pr.prototype.i=function(){return{}};ai=new pr;function rs(n,e,t,s){this.l=n,this.j=e,this.m=t,this.X=s||1,this.V=new Fn(this),this.P=Nd,n=ti?125:void 0,this.W=new dr(n),this.H=null,this.i=!1,this.s=this.A=this.v=this.K=this.F=this.Y=this.B=null,this.D=[],this.g=null,this.C=0,this.o=this.u=null,this.N=-1,this.I=!1,this.O=0,this.L=null,this.aa=this.J=this.$=this.U=!1,this.h=new Zu}function Zu(){this.i=null,this.g="",this.h=!1}var Nd=45e3,ui={},Ks={};_=rs.prototype;_.setTimeout=function(n){this.P=n};function ci(n,e,t){n.K=1,n.v=wr(Fe(e)),n.s=t,n.U=!0,ec(n,null)}function ec(n,e){n.F=Date.now(),is(n),n.A=Fe(n.v);var t=n.A,s=n.X;Array.isArray(s)||(s=[String(s)]),ac(t.h,"t",s),n.C=0,t=n.l.H,n.h=new Zu,n.g=Cc(n.l,t?e:null,!n.s),0<n.O&&(n.L=new Td(ce(n.Ia,n,n.g),n.O)),zu(n.V,n.g,"readystatechange",n.gb),e=n.H?Ru(n.H):{},n.s?(n.u||(n.u="POST"),e["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.A,n.u,n.s,e)):(n.u="GET",n.g.ea(n.A,n.u,null,e)),Vn(),Sd(n.j,n.u,n.A,n.m,n.X,n.s)}_.gb=function(n){n=n.target;const e=this.L;e&&Pe(n)==3?e.l():this.Ia(n)};_.Ia=function(n){try{if(n==this.g)e:{const l=Pe(this.g);var e=this.g.Da();const h=this.g.ba();if(!(3>l)&&(l!=3||ti||this.g&&(this.h.h||this.g.ga()||fa(this.g)))){this.I||l!=4||e==7||(e==8||0>=h?Vn(3):Vn(2)),yr(this);var t=this.g.ba();this.N=t;t:if(tc(this)){var s=fa(this.g);n="";var r=s.length,i=Pe(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){gt(this),Dn(this);var o="";break t}this.h.i=new C.TextDecoder}for(e=0;e<r;e++)this.h.h=!0,n+=this.h.i.decode(s[e],{stream:i&&e==r-1});s.splice(0,r),this.h.g+=n,this.C=0,o=this.h.g}else o=this.g.ga();if(this.i=t==200,bd(this.j,this.u,this.A,this.m,this.X,l,t),this.i){if(this.$&&!this.J){t:{if(this.g){var a,u=this.g;if((a=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!qs(a)){var c=a;break t}}c=null}if(t=c)Ht(this.j,this.m,t,"Initial handshake response via X-HTTP-Initial-Response"),this.J=!0,li(this,t);else{this.i=!1,this.o=3,Ie(12),gt(this),Dn(this);break e}}this.U?(nc(this,l,o),ti&&this.i&&l==3&&(zu(this.V,this.W,"tick",this.fb),this.W.start())):(Ht(this.j,this.m,o,null),li(this,o)),l==4&&gt(this),this.i&&!this.I&&(l==4?Tc(this.l,this):(this.i=!1,is(this)))}else t==400&&0<o.indexOf("Unknown SID")?(this.o=3,Ie(12)):(this.o=0,Ie(13)),gt(this),Dn(this)}}}catch{}finally{}};function tc(n){return n.g?n.u=="GET"&&n.K!=2&&n.l.Ba:!1}function nc(n,e,t){let s=!0,r;for(;!n.I&&n.C<t.length;)if(r=Dd(n,t),r==Ks){e==4&&(n.o=4,Ie(14),s=!1),Ht(n.j,n.m,null,"[Incomplete Response]");break}else if(r==ui){n.o=4,Ie(15),Ht(n.j,n.m,t,"[Invalid Chunk]"),s=!1;break}else Ht(n.j,n.m,r,null),li(n,r);tc(n)&&r!=Ks&&r!=ui&&(n.h.g="",n.C=0),e!=4||t.length!=0||n.h.h||(n.o=1,Ie(16),s=!1),n.i=n.i&&s,s?0<t.length&&!n.aa&&(n.aa=!0,e=n.l,e.g==n&&e.$&&!e.L&&(e.h.info("Great, no buffering proxy detected. Bytes received: "+t.length),eo(e),e.L=!0,Ie(11))):(Ht(n.j,n.m,t,"[Invalid Chunked Response]"),gt(n),Dn(n))}_.fb=function(){if(this.g){var n=Pe(this.g),e=this.g.ga();this.C<e.length&&(yr(this),nc(this,n,e),this.i&&n!=4&&is(this))}};function Dd(n,e){var t=n.C,s=e.indexOf(`
`,t);return s==-1?Ks:(t=Number(e.substring(t,s)),isNaN(t)?ui:(s+=1,s+t>e.length?Ks:(e=e.substr(s,t),n.C=s+t,e)))}_.cancel=function(){this.I=!0,gt(this)};function is(n){n.Y=Date.now()+n.P,sc(n,n.P)}function sc(n,e){if(n.B!=null)throw Error("WatchDog timer not null");n.B=ns(ce(n.eb,n),e)}function yr(n){n.B&&(C.clearTimeout(n.B),n.B=null)}_.eb=function(){this.B=null;const n=Date.now();0<=n-this.Y?(Ad(this.j,this.A),this.K!=2&&(Vn(),Ie(17)),gt(this),this.o=2,Dn(this)):sc(this,this.Y-n)};function Dn(n){n.l.G==0||n.I||Tc(n.l,n)}function gt(n){yr(n);var e=n.L;e&&typeof e.na=="function"&&e.na(),n.L=null,qi(n.W),Wu(n.V),n.g&&(e=n.g,n.g=null,e.abort(),e.na())}function li(n,e){try{var t=n.l;if(t.G!=0&&(t.g==n||hi(t.i,n))){if(t.I=n.N,!n.J&&hi(t.i,n)&&t.G==3){try{var s=t.Ca.g.parse(e)}catch{s=null}if(Array.isArray(s)&&s.length==3){var r=s;if(r[0]==0){e:if(!t.u){if(t.g)if(t.g.F+3e3<n.F)Ws(t),Er(t);else break e;Zi(t),Ie(18)}}else t.ta=r[1],0<t.ta-t.U&&37500>r[2]&&t.N&&t.A==0&&!t.v&&(t.v=ns(ce(t.ab,t),6e3));if(1>=lc(t.i)&&t.ka){try{t.ka()}catch{}t.ka=void 0}}else mt(t,11)}else if((n.J||t.g==n)&&Ws(t),!qs(e))for(r=t.Ca.g.parse(e),e=0;e<r.length;e++){let c=r[e];if(t.U=c[0],c=c[1],t.G==2)if(c[0]=="c"){t.J=c[1],t.la=c[2];const l=c[3];l!=null&&(t.ma=l,t.h.info("VER="+t.ma));const h=c[4];h!=null&&(t.za=h,t.h.info("SVER="+t.za));const d=c[5];d!=null&&typeof d=="number"&&0<d&&(s=1.5*d,t.K=s,t.h.info("backChannelRequestTimeoutMs_="+s)),s=t;const p=n.g;if(p){const m=p.g?p.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(m){var i=s.i;!i.g&&(we(m,"spdy")||we(m,"quic")||we(m,"h2"))&&(i.j=i.l,i.g=new Set,i.h&&(Hi(i,i.h),i.h=null))}if(s.D){const E=p.g?p.g.getResponseHeader("X-HTTP-Session-Id"):null;E&&(s.sa=E,B(s.F,s.D,E))}}t.G=3,t.j&&t.j.xa(),t.$&&(t.O=Date.now()-n.F,t.h.info("Handshake RTT: "+t.O+"ms")),s=t;var o=n;if(s.oa=Ac(s,s.H?s.la:null,s.W),o.J){hc(s.i,o);var a=o,u=s.K;u&&a.setTimeout(u),a.B&&(yr(a),is(a)),s.g=o}else Ec(s);0<t.l.length&&_r(t)}else c[0]!="stop"&&c[0]!="close"||mt(t,7);else t.G==3&&(c[0]=="stop"||c[0]=="close"?c[0]=="stop"?mt(t,7):Ji(t):c[0]!="noop"&&t.j&&t.j.wa(c),t.A=0)}}Vn(4)}catch{}}function xd(n){if(n.R&&typeof n.R=="function")return n.R();if(typeof n=="string")return n.split("");if(ei(n)){for(var e=[],t=n.length,s=0;s<t;s++)e.push(n[s]);return e}e=[],t=0;for(s in n)e[t++]=n[s];return e}function zi(n,e){if(n.forEach&&typeof n.forEach=="function")n.forEach(e,void 0);else if(ei(n)||typeof n=="string")Mu(n,e,void 0);else{if(n.T&&typeof n.T=="function")var t=n.T();else if(n.R&&typeof n.R=="function")t=void 0;else if(ei(n)||typeof n=="string"){t=[];for(var s=n.length,r=0;r<s;r++)t.push(r)}else for(r in t=[],s=0,n)t[s++]=r;s=xd(n),r=s.length;for(var i=0;i<r;i++)e.call(void 0,s[i],t&&t[i],n)}}function dn(n,e){this.h={},this.g=[],this.i=0;var t=arguments.length;if(1<t){if(t%2)throw Error("Uneven number of arguments");for(var s=0;s<t;s+=2)this.set(arguments[s],arguments[s+1])}else if(n)if(n instanceof dn)for(t=n.T(),s=0;s<t.length;s++)this.set(t[s],n.get(t[s]));else for(s in n)this.set(s,n[s])}_=dn.prototype;_.R=function(){Wi(this);for(var n=[],e=0;e<this.g.length;e++)n.push(this.h[this.g[e]]);return n};_.T=function(){return Wi(this),this.g.concat()};function Wi(n){if(n.i!=n.g.length){for(var e=0,t=0;e<n.g.length;){var s=n.g[e];vt(n.h,s)&&(n.g[t++]=s),e++}n.g.length=t}if(n.i!=n.g.length){var r={};for(t=e=0;e<n.g.length;)s=n.g[e],vt(r,s)||(n.g[t++]=s,r[s]=1),e++;n.g.length=t}}_.get=function(n,e){return vt(this.h,n)?this.h[n]:e};_.set=function(n,e){vt(this.h,n)||(this.i++,this.g.push(n)),this.h[n]=e};_.forEach=function(n,e){for(var t=this.T(),s=0;s<t.length;s++){var r=t[s],i=this.get(r);n.call(e,i,r,this)}};function vt(n,e){return Object.prototype.hasOwnProperty.call(n,e)}var rc=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function kd(n,e){if(n){n=n.split("&");for(var t=0;t<n.length;t++){var s=n[t].indexOf("="),r=null;if(0<=s){var i=n[t].substring(0,s);r=n[t].substring(s+1)}else i=n[t];e(i,r?decodeURIComponent(r.replace(/\+/g," ")):"")}}}function It(n,e){if(this.i=this.s=this.j="",this.m=null,this.o=this.l="",this.g=!1,n instanceof It){this.g=e!==void 0?e:n.g,Gs(this,n.j),this.s=n.s,js(this,n.i),zs(this,n.m),this.l=n.l,e=n.h;var t=new Bn;t.i=e.i,e.g&&(t.g=new dn(e.g),t.h=e.h),la(this,t),this.o=n.o}else n&&(t=String(n).match(rc))?(this.g=!!e,Gs(this,t[1]||"",!0),this.s=xn(t[2]||""),js(this,t[3]||"",!0),zs(this,t[4]),this.l=xn(t[5]||"",!0),la(this,t[6]||"",!0),this.o=xn(t[7]||"")):(this.g=!!e,this.h=new Bn(null,this.g))}It.prototype.toString=function(){var n=[],e=this.j;e&&n.push(Cn(e,ha,!0),":");var t=this.i;return(t||e=="file")&&(n.push("//"),(e=this.s)&&n.push(Cn(e,ha,!0),"@"),n.push(encodeURIComponent(String(t)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t=this.m,t!=null&&n.push(":",String(t))),(t=this.l)&&(this.i&&t.charAt(0)!="/"&&n.push("/"),n.push(Cn(t,t.charAt(0)=="/"?Pd:Od,!0))),(t=this.h.toString())&&n.push("?",t),(t=this.o)&&n.push("#",Cn(t,Vd)),n.join("")};function Fe(n){return new It(n)}function Gs(n,e,t){n.j=t?xn(e,!0):e,n.j&&(n.j=n.j.replace(/:$/,""))}function js(n,e,t){n.i=t?xn(e,!0):e}function zs(n,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);n.m=e}else n.m=null}function la(n,e,t){e instanceof Bn?(n.h=e,Bd(n.h,n.g)):(t||(e=Cn(e,Fd)),n.h=new Bn(e,n.g))}function B(n,e,t){n.h.set(e,t)}function wr(n){return B(n,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),n}function Ld(n){return n instanceof It?Fe(n):new It(n,void 0)}function Md(n,e,t,s){var r=new It(null,void 0);return n&&Gs(r,n),e&&js(r,e),t&&zs(r,t),s&&(r.l=s),r}function xn(n,e){return n?e?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function Cn(n,e,t){return typeof n=="string"?(n=encodeURI(n).replace(e,Rd),t&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function Rd(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var ha=/[#\/\?@]/g,Od=/[#\?:]/g,Pd=/[#\?]/g,Fd=/[#\?@]/g,Vd=/#/g;function Bn(n,e){this.h=this.g=null,this.i=n||null,this.j=!!e}function st(n){n.g||(n.g=new dn,n.h=0,n.i&&kd(n.i,function(e,t){n.add(decodeURIComponent(e.replace(/\+/g," ")),t)}))}_=Bn.prototype;_.add=function(n,e){st(this),this.i=null,n=fn(this,n);var t=this.g.get(n);return t||this.g.set(n,t=[]),t.push(e),this.h+=1,this};function ic(n,e){st(n),e=fn(n,e),vt(n.g.h,e)&&(n.i=null,n.h-=n.g.get(e).length,n=n.g,vt(n.h,e)&&(delete n.h[e],n.i--,n.g.length>2*n.i&&Wi(n)))}function oc(n,e){return st(n),e=fn(n,e),vt(n.g.h,e)}_.forEach=function(n,e){st(this),this.g.forEach(function(t,s){Mu(t,function(r){n.call(e,r,s,this)},this)},this)};_.T=function(){st(this);for(var n=this.g.R(),e=this.g.T(),t=[],s=0;s<e.length;s++)for(var r=n[s],i=0;i<r.length;i++)t.push(e[s]);return t};_.R=function(n){st(this);var e=[];if(typeof n=="string")oc(this,n)&&(e=ta(e,this.g.get(fn(this,n))));else{n=this.g.R();for(var t=0;t<n.length;t++)e=ta(e,n[t])}return e};_.set=function(n,e){return st(this),this.i=null,n=fn(this,n),oc(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[e]),this.h+=1,this};_.get=function(n,e){return n?(n=this.R(n),0<n.length?String(n[0]):e):e};function ac(n,e,t){ic(n,e),0<t.length&&(n.i=null,n.g.set(fn(n,e),Mi(t)),n.h+=t.length)}_.toString=function(){if(this.i)return this.i;if(!this.g)return"";for(var n=[],e=this.g.T(),t=0;t<e.length;t++){var s=e[t],r=encodeURIComponent(String(s));s=this.R(s);for(var i=0;i<s.length;i++){var o=r;s[i]!==""&&(o+="="+encodeURIComponent(String(s[i]))),n.push(o)}}return this.i=n.join("&")};function fn(n,e){return e=String(e),n.j&&(e=e.toLowerCase()),e}function Bd(n,e){e&&!n.j&&(st(n),n.i=null,n.g.forEach(function(t,s){var r=s.toLowerCase();s!=r&&(ic(this,s),ac(this,r,t))},n)),n.j=e}var Ud=class{constructor(n,e){this.h=n,this.g=e}};function uc(n){this.l=n||qd,C.PerformanceNavigationTiming?(n=C.performance.getEntriesByType("navigation"),n=0<n.length&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(C.g&&C.g.Ea&&C.g.Ea()&&C.g.Ea().Zb),this.j=n?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var qd=10;function cc(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function lc(n){return n.h?1:n.g?n.g.size:0}function hi(n,e){return n.h?n.h==e:n.g?n.g.has(e):!1}function Hi(n,e){n.g?n.g.add(e):n.h=e}function hc(n,e){n.h&&n.h==e?n.h=null:n.g&&n.g.has(e)&&n.g.delete(e)}uc.prototype.cancel=function(){if(this.i=dc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function dc(n){if(n.h!=null)return n.i.concat(n.h.D);if(n.g!=null&&n.g.size!==0){let e=n.i;for(const t of n.g.values())e=e.concat(t.D);return e}return Mi(n.i)}function Yi(){}Yi.prototype.stringify=function(n){return C.JSON.stringify(n,void 0)};Yi.prototype.parse=function(n){return C.JSON.parse(n,void 0)};function $d(){this.g=new Yi}function Kd(n,e,t){const s=t||"";try{zi(n,function(r,i){let o=r;ur(r)&&(o=Bi(r)),e.push(s+i+"="+encodeURIComponent(o))})}catch(r){throw e.push(s+"type="+encodeURIComponent("_badmap")),r}}function Gd(n,e){const t=new fr;if(C.Image){const s=new Image;s.onload=_s(Ss,t,s,"TestLoadImage: loaded",!0,e),s.onerror=_s(Ss,t,s,"TestLoadImage: error",!1,e),s.onabort=_s(Ss,t,s,"TestLoadImage: abort",!1,e),s.ontimeout=_s(Ss,t,s,"TestLoadImage: timeout",!1,e),C.setTimeout(function(){s.ontimeout&&s.ontimeout()},1e4),s.src=n}else e(!1)}function Ss(n,e,t,s,r){try{e.onload=null,e.onerror=null,e.onabort=null,e.ontimeout=null,r(s)}catch{}}function os(n){this.l=n.$b||null,this.j=n.ib||!1}he(os,Ki);os.prototype.g=function(){return new vr(this.l,this.j)};os.prototype.i=function(n){return function(){return n}}({});function vr(n,e){ne.call(this),this.D=n,this.u=e,this.m=void 0,this.readyState=Qi,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}he(vr,ne);var Qi=0;_=vr.prototype;_.open=function(n,e){if(this.readyState!=Qi)throw this.abort(),Error("Error reopening a connection");this.C=n,this.B=e,this.readyState=1,Un(this)};_.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const e={headers:this.v,method:this.C,credentials:this.m,cache:void 0};n&&(e.body=n),(this.D||C).fetch(new Request(this.B,e)).then(this.Va.bind(this),this.ha.bind(this))};_.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted."),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,as(this)),this.readyState=Qi};_.Va=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,Un(this)),this.g&&(this.readyState=3,Un(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Ta.bind(this),this.ha.bind(this));else if(typeof C.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;fc(this)}else n.text().then(this.Ua.bind(this),this.ha.bind(this))};function fc(n){n.j.read().then(n.Sa.bind(n)).catch(n.ha.bind(n))}_.Sa=function(n){if(this.g){if(this.u&&n.value)this.response.push(n.value);else if(!this.u){var e=n.value?n.value:new Uint8Array(0);(e=this.A.decode(e,{stream:!n.done}))&&(this.response=this.responseText+=e)}n.done?as(this):Un(this),this.readyState==3&&fc(this)}};_.Ua=function(n){this.g&&(this.response=this.responseText=n,as(this))};_.Ta=function(n){this.g&&(this.response=n,as(this))};_.ha=function(){this.g&&as(this)};function as(n){n.readyState=4,n.l=null,n.j=null,n.A=null,Un(n)}_.setRequestHeader=function(n,e){this.v.append(n,e)};_.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""};_.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],e=this.h.entries();for(var t=e.next();!t.done;)t=t.value,n.push(t[0]+": "+t[1]),t=e.next();return n.join(`\r
`)};function Un(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(vr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});var jd=C.JSON.parse;function Q(n){ne.call(this),this.headers=new dn,this.u=n||null,this.h=!1,this.C=this.g=null,this.H="",this.m=0,this.j="",this.l=this.F=this.v=this.D=!1,this.B=0,this.A=null,this.J=gc,this.K=this.L=!1}he(Q,ne);var gc="",zd=/^https?$/i,Wd=["POST","PUT"];_=Q.prototype;_.ea=function(n,e,t,s){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.H+"; newUri="+n);e=e?e.toUpperCase():"GET",this.H=n,this.j="",this.m=0,this.D=!1,this.h=!0,this.g=this.u?this.u.g():ai.g(),this.C=this.u?ca(this.u):ca(ai),this.g.onreadystatechange=ce(this.Fa,this);try{this.F=!0,this.g.open(e,String(n),!0),this.F=!1}catch(i){da(this,i);return}n=t||"";const r=new dn(this.headers);s&&zi(s,function(i,o){r.set(o,i)}),s=sd(r.T()),t=C.FormData&&n instanceof C.FormData,!(0<=Lu(Wd,e))||s||t||r.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),r.forEach(function(i,o){this.g.setRequestHeader(o,i)},this),this.J&&(this.g.responseType=this.J),"withCredentials"in this.g&&this.g.withCredentials!==this.L&&(this.g.withCredentials=this.L);try{yc(this),0<this.B&&((this.K=Hd(this.g))?(this.g.timeout=this.B,this.g.ontimeout=ce(this.pa,this)):this.A=$i(this.pa,this.B,this)),this.v=!0,this.g.send(n),this.v=!1}catch(i){da(this,i)}};function Hd(n){return Zt&&ud()&&typeof n.timeout=="number"&&n.ontimeout!==void 0}function Yd(n){return n.toLowerCase()=="content-type"}_.pa=function(){typeof Li<"u"&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,le(this,"timeout"),this.abort(8))};function da(n,e){n.h=!1,n.g&&(n.l=!0,n.g.abort(),n.l=!1),n.j=e,n.m=5,mc(n),Ir(n)}function mc(n){n.D||(n.D=!0,le(n,"complete"),le(n,"error"))}_.abort=function(n){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=n||7,le(this,"complete"),le(this,"abort"),Ir(this))};_.M=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),Ir(this,!0)),Q.Z.M.call(this)};_.Fa=function(){this.s||(this.F||this.v||this.l?pc(this):this.cb())};_.cb=function(){pc(this)};function pc(n){if(n.h&&typeof Li<"u"&&(!n.C[1]||Pe(n)!=4||n.ba()!=2)){if(n.v&&Pe(n)==4)$i(n.Fa,0,n);else if(le(n,"readystatechange"),Pe(n)==4){n.h=!1;try{const a=n.ba();e:switch(a){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var e=!0;break e;default:e=!1}var t;if(!(t=e)){var s;if(s=a===0){var r=String(n.H).match(rc)[1]||null;if(!r&&C.self&&C.self.location){var i=C.self.location.protocol;r=i.substr(0,i.length-1)}s=!zd.test(r?r.toLowerCase():"")}t=s}if(t)le(n,"complete"),le(n,"success");else{n.m=6;try{var o=2<Pe(n)?n.g.statusText:""}catch{o=""}n.j=o+" ["+n.ba()+"]",mc(n)}}finally{Ir(n)}}}}function Ir(n,e){if(n.g){yc(n);const t=n.g,s=n.C[0]?Us:null;n.g=null,n.C=null,e||le(n,"ready");try{t.onreadystatechange=s}catch{}}}function yc(n){n.g&&n.K&&(n.g.ontimeout=null),n.A&&(C.clearTimeout(n.A),n.A=null)}function Pe(n){return n.g?n.g.readyState:0}_.ba=function(){try{return 2<Pe(this)?this.g.status:-1}catch{return-1}};_.ga=function(){try{return this.g?this.g.responseText:""}catch{return""}};_.Qa=function(n){if(this.g){var e=this.g.responseText;return n&&e.indexOf(n)==0&&(e=e.substring(n.length)),jd(e)}};function fa(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.J){case gc:case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}_.Da=function(){return this.m};_.La=function(){return typeof this.j=="string"?this.j:String(this.j)};function Qd(n){let e="";return Ri(n,function(t,s){e+=s,e+=":",e+=t,e+=`\r
`}),e}function Xi(n,e,t){e:{for(s in t){var s=!1;break e}s=!0}s||(t=Qd(t),typeof n=="string"?t!=null&&encodeURIComponent(String(t)):B(n,e,t))}function En(n,e,t){return t&&t.internalChannelParams&&t.internalChannelParams[n]||e}function wc(n){this.za=0,this.l=[],this.h=new fr,this.la=this.oa=this.F=this.W=this.g=this.sa=this.D=this.aa=this.o=this.P=this.s=null,this.Za=this.V=0,this.Xa=En("failFast",!1,n),this.N=this.v=this.u=this.m=this.j=null,this.X=!0,this.I=this.ta=this.U=-1,this.Y=this.A=this.C=0,this.Pa=En("baseRetryDelayMs",5e3,n),this.$a=En("retryDelaySeedMs",1e4,n),this.Ya=En("forwardChannelMaxRetries",2,n),this.ra=En("forwardChannelRequestTimeoutMs",2e4,n),this.qa=n&&n.xmlHttpFactory||void 0,this.Ba=n&&n.Yb||!1,this.K=void 0,this.H=n&&n.supportsCrossDomainXhr||!1,this.J="",this.i=new uc(n&&n.concurrentRequestLimit),this.Ca=new $d,this.ja=n&&n.fastHandshake||!1,this.Ra=n&&n.Wb||!1,n&&n.Aa&&this.h.Aa(),n&&n.forceLongPolling&&(this.X=!1),this.$=!this.ja&&this.X&&n&&n.detectBufferingProxy||!1,this.ka=void 0,this.O=0,this.L=!1,this.B=null,this.Wa=!n||n.Xb!==!1}_=wc.prototype;_.ma=8;_.G=1;function Ji(n){if(vc(n),n.G==3){var e=n.V++,t=Fe(n.F);B(t,"SID",n.J),B(t,"RID",e),B(t,"TYPE","terminate"),us(n,t),e=new rs(n,n.h,e,void 0),e.K=2,e.v=wr(Fe(t)),t=!1,C.navigator&&C.navigator.sendBeacon&&(t=C.navigator.sendBeacon(e.v.toString(),"")),!t&&C.Image&&(new Image().src=e.v,t=!0),t||(e.g=Cc(e.l,null),e.g.ea(e.v)),e.F=Date.now(),is(e)}bc(n)}_.hb=function(n){try{this.h.info("Origin Trials invoked: "+n)}catch{}};function Er(n){n.g&&(eo(n),n.g.cancel(),n.g=null)}function vc(n){Er(n),n.u&&(C.clearTimeout(n.u),n.u=null),Ws(n),n.i.cancel(),n.m&&(typeof n.m=="number"&&C.clearTimeout(n.m),n.m=null)}function Gr(n,e){n.l.push(new Ud(n.Za++,e)),n.G==3&&_r(n)}function _r(n){cc(n.i)||n.m||(n.m=!0,Ui(n.Ha,n),n.C=0)}function Xd(n,e){return lc(n.i)>=n.i.j-(n.m?1:0)?!1:n.m?(n.l=e.D.concat(n.l),!0):n.G==1||n.G==2||n.C>=(n.Xa?0:n.Ya)?!1:(n.m=ns(ce(n.Ha,n,e),Sc(n,n.C)),n.C++,!0)}_.Ha=function(n){if(this.m)if(this.m=null,this.G==1){if(!n){this.V=Math.floor(1e5*Math.random()),n=this.V++;const r=new rs(this,this.h,n,void 0);let i=this.s;if(this.P&&(i?(i=Ru(i),Ou(i,this.P)):i=this.P),this.o===null&&(r.H=i),this.ja)e:{for(var e=0,t=0;t<this.l.length;t++){t:{var s=this.l[t];if("__data__"in s.g&&(s=s.g.__data__,typeof s=="string")){s=s.length;break t}s=void 0}if(s===void 0)break;if(e+=s,4096<e){e=t;break e}if(e===4096||t===this.l.length-1){e=t+1;break e}}e=1e3}else e=1e3;e=Ic(this,r,e),t=Fe(this.F),B(t,"RID",n),B(t,"CVER",22),this.D&&B(t,"X-HTTP-Session-Id",this.D),us(this,t),this.o&&i&&Xi(t,this.o,i),Hi(this.i,r),this.Ra&&B(t,"TYPE","init"),this.ja?(B(t,"$req",e),B(t,"SID","null"),r.$=!0,ci(r,t,null)):ci(r,t,e),this.G=2}}else this.G==3&&(n?ga(this,n):this.l.length==0||cc(this.i)||ga(this))};function ga(n,e){var t;e?t=e.m:t=n.V++;const s=Fe(n.F);B(s,"SID",n.J),B(s,"RID",t),B(s,"AID",n.U),us(n,s),n.o&&n.s&&Xi(s,n.o,n.s),t=new rs(n,n.h,t,n.C+1),n.o===null&&(t.H=n.s),e&&(n.l=e.D.concat(n.l)),e=Ic(n,t,1e3),t.setTimeout(Math.round(.5*n.ra)+Math.round(.5*n.ra*Math.random())),Hi(n.i,t),ci(t,s,e)}function us(n,e){n.j&&zi({},function(t,s){B(e,s,t)})}function Ic(n,e,t){t=Math.min(n.l.length,t);var s=n.j?ce(n.j.Oa,n.j,n):null;e:{var r=n.l;let i=-1;for(;;){const o=["count="+t];i==-1?0<t?(i=r[0].h,o.push("ofs="+i)):i=0:o.push("ofs="+i);let a=!0;for(let u=0;u<t;u++){let c=r[u].h;const l=r[u].g;if(c-=i,0>c)i=Math.max(0,r[u].h-100),a=!1;else try{Kd(l,o,"req"+c+"_")}catch{s&&s(l)}}if(a){s=o.join("&");break e}}}return n=n.l.splice(0,t),e.D=n,s}function Ec(n){n.g||n.u||(n.Y=1,Ui(n.Ga,n),n.A=0)}function Zi(n){return n.g||n.u||3<=n.A?!1:(n.Y++,n.u=ns(ce(n.Ga,n),Sc(n,n.A)),n.A++,!0)}_.Ga=function(){if(this.u=null,_c(this),this.$&&!(this.L||this.g==null||0>=this.O)){var n=2*this.O;this.h.info("BP detection timer enabled: "+n),this.B=ns(ce(this.bb,this),n)}};_.bb=function(){this.B&&(this.B=null,this.h.info("BP detection timeout reached."),this.h.info("Buffering proxy detected and switch to long-polling!"),this.N=!1,this.L=!0,Ie(10),Er(this),_c(this))};function eo(n){n.B!=null&&(C.clearTimeout(n.B),n.B=null)}function _c(n){n.g=new rs(n,n.h,"rpc",n.Y),n.o===null&&(n.g.H=n.s),n.g.O=0;var e=Fe(n.oa);B(e,"RID","rpc"),B(e,"SID",n.J),B(e,"CI",n.N?"0":"1"),B(e,"AID",n.U),us(n,e),B(e,"TYPE","xmlhttp"),n.o&&n.s&&Xi(e,n.o,n.s),n.K&&n.g.setTimeout(n.K);var t=n.g;n=n.la,t.K=1,t.v=wr(Fe(e)),t.s=null,t.U=!0,ec(t,n)}_.ab=function(){this.v!=null&&(this.v=null,Er(this),Zi(this),Ie(19))};function Ws(n){n.v!=null&&(C.clearTimeout(n.v),n.v=null)}function Tc(n,e){var t=null;if(n.g==e){Ws(n),eo(n),n.g=null;var s=2}else if(hi(n.i,e))t=e.D,hc(n.i,e),s=1;else return;if(n.I=e.N,n.G!=0){if(e.i)if(s==1){t=e.s?e.s.length:0,e=Date.now()-e.F;var r=n.C;s=gr(),le(s,new Qu(s,t)),_r(n)}else Ec(n);else if(r=e.o,r==3||r==0&&0<n.I||!(s==1&&Xd(n,e)||s==2&&Zi(n)))switch(t&&0<t.length&&(e=n.i,e.i=e.i.concat(t)),r){case 1:mt(n,5);break;case 4:mt(n,10);break;case 3:mt(n,6);break;default:mt(n,2)}}}function Sc(n,e){let t=n.Pa+Math.floor(Math.random()*n.$a);return n.j||(t*=2),t*e}function mt(n,e){if(n.h.info("Error code "+e),e==2){var t=null;n.j&&(t=null);var s=ce(n.jb,n);t||(t=new It("//www.google.com/images/cleardot.gif"),C.location&&C.location.protocol=="http"||Gs(t,"https"),wr(t)),Gd(t.toString(),s)}else Ie(2);n.G=0,n.j&&n.j.va(e),bc(n),vc(n)}_.jb=function(n){n?(this.h.info("Successfully pinged google.com"),Ie(2)):(this.h.info("Failed to ping google.com"),Ie(1))};function bc(n){n.G=0,n.I=-1,n.j&&((dc(n.i).length!=0||n.l.length!=0)&&(n.i.i.length=0,Mi(n.l),n.l.length=0),n.j.ua())}function Ac(n,e,t){let s=Ld(t);if(s.i!="")e&&js(s,e+"."+s.i),zs(s,s.m);else{const r=C.location;s=Md(r.protocol,e?e+"."+r.hostname:r.hostname,+r.port,t)}return n.aa&&Ri(n.aa,function(r,i){B(s,i,r)}),e=n.D,t=n.sa,e&&t&&B(s,e,t),B(s,"VER",n.ma),us(n,s),s}function Cc(n,e,t){if(e&&!n.H)throw Error("Can't create secondary domain capable XhrIo object.");return e=t&&n.Ba&&!n.qa?new Q(new os({ib:!0})):new Q(n.qa),e.L=n.H,e}function Nc(){}_=Nc.prototype;_.xa=function(){};_.wa=function(){};_.va=function(){};_.ua=function(){};_.Oa=function(){};function Hs(){if(Zt&&!(10<=Number(cd)))throw Error("Environmental error: no available transport.")}Hs.prototype.g=function(n,e){return new Ae(n,e)};function Ae(n,e){ne.call(this),this.g=new wc(e),this.l=n,this.h=e&&e.messageUrlParams||null,n=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.s=n,n=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(n?n["X-WebChannel-Content-Type"]=e.messageContentType:n={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.ya&&(n?n["X-WebChannel-Client-Profile"]=e.ya:n={"X-WebChannel-Client-Profile":e.ya}),this.g.P=n,(n=e&&e.httpHeadersOverwriteParam)&&!qs(n)&&(this.g.o=n),this.A=e&&e.supportsCrossDomainXhr||!1,this.v=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!qs(e)&&(this.g.D=e,n=this.h,n!==null&&e in n&&(n=this.h,e in n&&delete n[e])),this.j=new gn(this)}he(Ae,ne);Ae.prototype.m=function(){this.g.j=this.j,this.A&&(this.g.H=!0);var n=this.g,e=this.l,t=this.h||void 0;n.Wa&&(n.h.info("Origin Trials enabled."),Ui(ce(n.hb,n,e))),Ie(0),n.W=e,n.aa=t||{},n.N=n.X,n.F=Ac(n,null,n.W),_r(n)};Ae.prototype.close=function(){Ji(this.g)};Ae.prototype.u=function(n){if(typeof n=="string"){var e={};e.__data__=n,Gr(this.g,e)}else this.v?(e={},e.__data__=Bi(n),Gr(this.g,e)):Gr(this.g,n)};Ae.prototype.M=function(){this.g.j=null,delete this.j,Ji(this.g),delete this.g,Ae.Z.M.call(this)};function Dc(n){Gi.call(this);var e=n.__sm__;if(e){e:{for(const t in e){n=t;break e}n=void 0}(this.i=n)&&(n=this.i,e=e!==null&&n in e?e[n]:void 0),this.data=e}else this.data=n}he(Dc,Gi);function xc(){ji.call(this),this.status=1}he(xc,ji);function gn(n){this.g=n}he(gn,Nc);gn.prototype.xa=function(){le(this.g,"a")};gn.prototype.wa=function(n){le(this.g,new Dc(n))};gn.prototype.va=function(n){le(this.g,new xc)};gn.prototype.ua=function(){le(this.g,"b")};Hs.prototype.createWebChannel=Hs.prototype.g;Ae.prototype.send=Ae.prototype.u;Ae.prototype.open=Ae.prototype.m;Ae.prototype.close=Ae.prototype.close;mr.NO_ERROR=0;mr.TIMEOUT=8;mr.HTTP_ERROR=6;Xu.COMPLETE="complete";Ju.EventType=ss;ss.OPEN="a";ss.CLOSE="b";ss.ERROR="c";ss.MESSAGE="d";ne.prototype.listen=ne.prototype.N;Q.prototype.listenOnce=Q.prototype.O;Q.prototype.getLastError=Q.prototype.La;Q.prototype.getLastErrorCode=Q.prototype.Da;Q.prototype.getStatus=Q.prototype.ba;Q.prototype.getResponseJson=Q.prototype.Qa;Q.prototype.getResponseText=Q.prototype.ga;Q.prototype.send=Q.prototype.ea;var Jd=function(){return new Hs},Zd=function(){return gr()},jr=mr,ef=Xu,tf=kt,ma={rb:0,ub:1,vb:2,Ob:3,Tb:4,Qb:5,Rb:6,Pb:7,Nb:8,Sb:9,PROXY:10,NOPROXY:11,Lb:12,Hb:13,Ib:14,Gb:15,Jb:16,Kb:17,nb:18,mb:19,ob:20},nf=os,bs=Ju,sf=Q,rf={ACCESSIBILITY_LINK:"https://pass.culture.fr/accessibilite",ALGOLIA_APPLICATION_ID:"E2IKXJ325N",ALGOLIA_OFFERS_INDEX_NAME_B:"PRODUCTION B",ALGOLIA_OFFERS_INDEX_NAME:"PRODUCTION",ALGOLIA_SEARCH_API_PUBLIC_KEY:"b451e96ac8d8323c321d8cc86e4a8b0a",ALGOLIA_SUGGESTIONS_INDEX_NAME:"PRODUCTION_query_suggestions",ALGOLIA_TOP_OFFERS_INDEX_NAME:"PRODUCTION Top offres",ALGOLIA_VENUES_INDEX_NAME:"venues",ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST:"venues playlist search newest",ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH:"venues playlist search",AMPLITUDE_API_PUBLIC_KEY:"36b9376b8e9e68980d58a8b8c3e5a651",ANDROID_APP_ID:"app.passculture.webapp",ANDROID_APP_NAME:"PassCulture",API_BASE_URL:"https://backend.passculture.app",APP_DISPLAY_NAME:"pass Culture",APP_PUBLIC_URL:"https://passculture.app",APPLE_STORE_URL:"https://apps.apple.com/fr/app/pass-culture/id1557887412",APPS_FLYER_DEV_PUBLIC_KEY:"MzuPoUMwL2khQJHVk8girR",APPS_FLYER_WEB_PUBLIC_KEY:"64d73417-4340-4eff-813c-2c5588ca72f5",BATCH_API_PUBLIC_KEY_ANDROID:"602A91C34D0DA9B3D80FA399E3430F",BATCH_API_PUBLIC_KEY_IOS:"602A919A229DBCF8E8FA31A0186A1F",BOOKING_FEEDBACK_LINK:"https://passculture.qualtrics.com/jfe/form/SV_dcmKZrtRwVABcA6",BOOKING_LIMIT_EXCEEDED_URL:"https://aide.passculture.app/hc/fr/articles/4411991975825",CGU_LINK:"https://pass.culture.fr/cgu-utilisateurs",CODEPUSH_DEPLOYMENT_NAME:"Production",CODEPUSH_PUBLIC_KEY_ANDROID:"Hkv_Ce7YJ_XZiHU8-ZBoAvcMU0kyP8XE5UQaI",CODEPUSH_PUBLIC_KEY_IOS:"kfbIJKgcZ0b3jjTyBYc51nyC4yqhf_-b9gBAq",CONTENTFUL_ENVIRONMENT:"master",CONTENTFUL_PUBLIC_ACCESS_TOKEN:"oqkcaGmPpBLYASc-Tl2yTC1Jg6sK5_LviP0yrmUG8ug",CONTENTFUL_SPACE_ID:"2bg01iqy0isv",COOKIES_POLICY_LINK:"https://pass.culture.fr/politique-de-cookies",CULTURAL_SURVEY_TYPEFORM_ID:"HGBAFB",DATA_PRIVACY_CHART_LINK:"https://pass.culture.fr/charte-des-donnees-personnelles",DMS_FOREIGN_CITIZEN_URL:"https://www.demarches-simplifiees.fr/commencer/demande-pass-culture-et",DMS_FRENCH_CITIZEN_URL:"https://www.demarches-simplifiees.fr/commencer/demande-pass-culture-fr",DOC_CGU_URL:"https://docs.passculture.app/textes-normatifs/mentions-legales-et-conditions-generales-dutilisation-de-lapplication-pass-culture",DOC_PERSONAL_DATA_URL:"https://docs.passculture.app/textes-normatifs/charte-des-donnees-personnelles",EDUCONNECT_ALLOWED_DOMAIN:"https://educonnect.education.gouv.fr",ENV:"production",FAQ_LINK_CREDIT_V3:"https://aide.passculture.app/hc/fr/articles/18228972352924--Jeunes-%C3%89volutions-du-pass-Culture-ce-qui-change-au-1er-mars-2025",FAQ_LINK_CREDIT:"https://aide.passculture.app/hc/fr/articles/4411991904017--Jeune-15-17-ans-C-est-quoi-le-pass-Culture",FAQ_LINK_DELETE_ACCOUNT:"https://aide.passculture.app/hc/fr/articles/4411992014865--Jeunes-Comment-supprimer-mon-compte-",FAQ_LINK_EDUCONNECT_URL:"https://passculture.zendesk.com/hc/fr/articles/4411991896849--Jeune-15-17-ans-O%C3%B9-trouver-mes-identifiants-%C3%89duConnect",FAQ_LINK_PERSONAL_DATA:"https://aide.passculture.app/hc/fr/articles/7047585364380--Jeunes-Traitement-des-donn%C3%A9es-utilisateurs",FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED:"https://passculture.zendesk.com/hc/fr/articles/4411999050769--Jeunes-Je-n-ai-pas-re%C3%A7u-le-mail-de-confirmation-de-changement-de-mot-de-passe",FAQ_LINK_RIGHT_TO_ERASURE:"https://aide.passculture.app/hc/fr/articles/16166410923036--Jeunes-Droit-%C3%A0-l-effacement-pour-les-utilisateurs-de-l-application-pass-Culture",FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED:"https://passculture.zendesk.com/hc/fr/articles/4411991990929--Jeunes-Je-n-ai-pas-re%C3%A7u-le-mail-de-confirmation-de-cr%C3%A9ation-de-compte",FAQ_LINK:"https://passculture.zendesk.com/hc/fr/",FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING:"false",FIREBASE_API_PUBLIC_KEY:"AIzaSyCtHqbRqlMCFkeXEaidiOnrQ0xq_0gMXMc",FIREBASE_APPID:"1:378830896130:web:36273377e9720998307b1b",FIREBASE_AUTHDOMAIN:"pc-native-production.firebaseapp.com",FIREBASE_DYNAMIC_LINK_DOMAIN:"passcultureapp.page.link",FIREBASE_MESSAGINGSENDERID:"378830896130",FIREBASE_PROJECTID:"pc-native-production",FIREBASE_STORAGEBUCKET:"pc-native-production.appspot.com",FRAUD_EMAIL_ADDRESS:"service.fraude@passculture.app",GCP_IMAGE_COULD_STORAGE_NAME:"passculture-metier-prod-production-assets-fine-grained",GOOGLE_CLIENT_ID:"605788939445-d84egppelksutckogp5gmiuj3ppddd2s.apps.googleusercontent.com",GOOGLE_IOS_CLIENT_ID:"605788939445-7lsrqirbu02469o3pv5h8kdq7j82ban1.apps.googleusercontent.com",GOOGLE_IOS_REVERSED_CLIENT_ID:"com.googleusercontent.apps.605788939445-7lsrqirbu02469o3pv5h8kdq7j82ban1",GOOGLE_MAPS_API_PUBLIC_KEY:"AIzaSyB768qXQSe1j9MfipP4VtVYIja2CaTLPe4",GOOGLE_PLAY_STORE_URL:"https://play.google.com/store/apps/details?id=app.passculture.webapp&hl=fr",IOS_APP_ICON:"AppIcon",IOS_APP_ID:"app.passculture",IOS_APP_NAME:"PassCulture",IOS_APP_STORE_ID:"1557887412",IOS_PROVISIONING_PROFILE_SPECIFIER_DEVELOPMENT:"match Development app.passculture",IOS_PROVISIONING_PROFILE_SPECIFIER_RELEASE:"match AppStore app.passculture",IOS_TEAM_ID:"WBC4X3LRTS",PASSCULTURE_DOWNLOAD_APP_URL:"https://pass.culture.fr/nosapplications",PRIVACY_POLICY_LINK:"https://pass.culture.fr/charte-des-donnees-personnelles",RESIZE_IMAGE_ON_DEMAND_URL:"https://image-resizing.passculture.app",SENTRY_DSN:"https://cbc513d8ef954df7910196a236ed3b6c@sentry.passculture.team/6",SENTRY_PROFILES_SAMPLE_RATE:"0.25",SENTRY_SAMPLE_RATE:"0.25",SENTRY_TRACES_SAMPLE_RATE:"0.01",SITE_PUBLIC_KEY:"6LdWB0caAAAAAKfVe3he0FqXQXOepICF-5aZh_rQ",SUPPORT_EMAIL_ADDRESS:"support@passculture.app",URL_PREFIX:"passculture",WEBAPP_V2_DOMAIN:"passculture.app",COMMIT_HASH:"f47f9f210e"};const pa="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}oe.UNAUTHENTICATED=new oe(null),oe.GOOGLE_CREDENTIALS=new oe("google-credentials-uid"),oe.FIRST_PARTY=new oe("first-party-uid"),oe.MOCK_USER=new oe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mn="9.6.11";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new Au("@firebase/firestore");function di(){return Ye.logLevel}function of(n){Ye.setLogLevel(n)}function w(n,...e){if(Ye.logLevel<=wt.DEBUG){const t=e.map(to);Ye.debug(`Firestore (${mn}): ${n}`,...t)}}function H(n,...e){if(Ye.logLevel<=wt.ERROR){const t=e.map(to);Ye.error(`Firestore (${mn}): ${n}`,...t)}}function qn(n,...e){if(Ye.logLevel<=wt.WARN){const t=e.map(to);Ye.warn(`Firestore (${mn}): ${n}`,...t)}}function to(n){if(typeof n=="string")return n;try{return e=n,JSON.stringify(e)}catch{return n}/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(n="Unexpected state"){const e=`FIRESTORE (${mn}) INTERNAL ASSERTION FAILED: `+n;throw H(e),new Error(e)}function A(n,e){n||T()}function af(n,e){n||T()}function I(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class y extends ki{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kc{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class uf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(oe.UNAUTHENTICATED))}shutdown(){}}class cf{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class lf{constructor(e){this.t=e,this.currentUser=oe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let s=this.i;const r=u=>this.i!==s?(s=this.i,t(u)):Promise.resolve();let i=new ee;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ee,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await r(this.currentUser)})},a=u=>{w("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit(u=>a(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(w("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ee)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(w("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(A(typeof s.accessToken=="string"),new kc(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return A(e===null||typeof e=="string"),new oe(e)}}class hf{constructor(e,t,s){this.type="FirstParty",this.user=oe.FIRST_PARTY,this.headers=new Map,this.headers.set("X-Goog-AuthUser",t);const r=e.auth.getAuthHeaderValueForFirstParty([]);r&&this.headers.set("Authorization",r),s&&this.headers.set("X-Goog-Iam-Authorization-Token",s)}}class df{constructor(e,t,s){this.h=e,this.l=t,this.m=s}getToken(){return Promise.resolve(new hf(this.h,this.l,this.m))}start(e,t){e.enqueueRetryable(()=>t(oe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ff{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class gf{constructor(e){this.g=e,this.forceRefresh=!1,this.appCheck=null,this.p=null}start(e,t){const s=i=>{i.error!=null&&w("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.p;return this.p=i.token,w("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{w("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.appCheck.addTokenListener(this.o)};this.g.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.g.getImmediate({optional:!0});i?r(i):w("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(A(typeof t.token=="string"),this.p=t.token,new ff(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.I(s),this.T=s=>t.writeSequenceNumber(s))}I(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.T&&this.T(e),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mf(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */be.A=-1;class Lc{static R(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=mf(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<t&&(s+=e.charAt(r[i]%e.length))}return s}}function N(n,e){return n<e?-1:n>e?1:0}function en(n,e,t){return n.length===e.length&&n.every((s,r)=>t(s,e[r]))}function Mc(n){return n+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new y(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new y(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new y(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new y(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return G.fromMillis(Date.now())}static fromDate(e){return G.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new G(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?N(this.nanoseconds,e.nanoseconds):N(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(e){this.timestamp=e}static fromTimestamp(e){return new S(e)}static min(){return new S(new G(0,0))}static max(){return new S(new G(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ya(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Lt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Rc(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e,t,s){t===void 0?t=0:t>e.length&&T(),s===void 0?s=e.length-t:s>e.length-t&&T(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return $n.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof $n?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const i=e.get(r),o=t.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class x extends $n{construct(e,t,s){return new x(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new y(f.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(r=>r.length>0))}return new x(t)}static emptyPath(){return new x([])}}const pf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Z extends $n{construct(e,t,s){return new Z(e,t,s)}static isValidIdentifier(e){return pf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Z.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Z(["__name__"])}static fromServerFormat(e){const t=[];let s="",r=0;const i=()=>{if(s.length===0)throw new y(f.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let o=!1;for(;r<e.length;){const a=e[r];if(a==="\\"){if(r+1===e.length)throw new y(f.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[r+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new y(f.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,r+=2}else a==="`"?(o=!o,r++):a!=="."||o?(s+=a,r++):(i(),r++)}if(i(),o)throw new y(f.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Z(t)}static emptyPath(){return new Z([])}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e){this.fields=e,e.sort(Z.comparator)}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return en(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yf(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.binaryString=e}static fromBase64String(e){const t=atob(e);return new X(t)}static fromUint8Array(e){const t=function(s){let r="";for(let i=0;i<s.length;++i)r+=String.fromCharCode(s[i]);return r}(e);return new X(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let s=0;s<e.length;s++)t[s]=e.charCodeAt(s);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return N(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}X.EMPTY_BYTE_STRING=new X("");const wf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Qe(n){if(A(!!n),typeof n=="string"){let e=0;const t=wf.exec(n);if(A(!!t),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:q(n.seconds),nanos:q(n.nanos)}}function q(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Et(n){return typeof n=="string"?X.fromBase64String(n):X.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Oc(n){const e=n.mapValue.fields.__previous_value__;return no(e)?Oc(e):e}function Kn(n){const e=Qe(n.mapValue.fields.__local_write_time__.timestampValue);return new G(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf{constructor(e,t,s,r,i,o,a,u){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.useFetchStreams=u}}class Ve{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Ve("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Ve&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(n){return n==null}function Gn(n){return n===0&&1/n==-1/0}function Pc(n){return typeof n=="number"&&Number.isInteger(n)&&!Gn(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(e){this.path=e}static fromPath(e){return new v(x.fromString(e))}static fromName(e){return new v(x.fromString(e).popFirst(5))}static empty(){return new v(x.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&x.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return x.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new v(new x(e.slice()))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},Vc={nullValue:"NULL_VALUE"};function _t(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?no(n)?4:Bc(n)?9:10:T()}function Re(n,e){if(n===e)return!0;const t=_t(n);if(t!==_t(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Kn(n).isEqual(Kn(e));case 3:return function(s,r){if(typeof s.timestampValue=="string"&&typeof r.timestampValue=="string"&&s.timestampValue.length===r.timestampValue.length)return s.timestampValue===r.timestampValue;const i=Qe(s.timestampValue),o=Qe(r.timestampValue);return i.seconds===o.seconds&&i.nanos===o.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,r){return Et(s.bytesValue).isEqual(Et(r.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,r){return q(s.geoPointValue.latitude)===q(r.geoPointValue.latitude)&&q(s.geoPointValue.longitude)===q(r.geoPointValue.longitude)}(n,e);case 2:return function(s,r){if("integerValue"in s&&"integerValue"in r)return q(s.integerValue)===q(r.integerValue);if("doubleValue"in s&&"doubleValue"in r){const i=q(s.doubleValue),o=q(r.doubleValue);return i===o?Gn(i)===Gn(o):isNaN(i)&&isNaN(o)}return!1}(n,e);case 9:return en(n.arrayValue.values||[],e.arrayValue.values||[],Re);case 10:return function(s,r){const i=s.mapValue.fields||{},o=r.mapValue.fields||{};if(ya(i)!==ya(o))return!1;for(const a in i)if(i.hasOwnProperty(a)&&(o[a]===void 0||!Re(i[a],o[a])))return!1;return!0}(n,e);default:return T()}}function jn(n,e){return(n.values||[]).find(t=>Re(t,e))!==void 0}function Xe(n,e){if(n===e)return 0;const t=_t(n),s=_t(e);if(t!==s)return N(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return N(n.booleanValue,e.booleanValue);case 2:return function(r,i){const o=q(r.integerValue||r.doubleValue),a=q(i.integerValue||i.doubleValue);return o<a?-1:o>a?1:o===a?0:isNaN(o)?isNaN(a)?0:-1:1}(n,e);case 3:return wa(n.timestampValue,e.timestampValue);case 4:return wa(Kn(n),Kn(e));case 5:return N(n.stringValue,e.stringValue);case 6:return function(r,i){const o=Et(r),a=Et(i);return o.compareTo(a)}(n.bytesValue,e.bytesValue);case 7:return function(r,i){const o=r.split("/"),a=i.split("/");for(let u=0;u<o.length&&u<a.length;u++){const c=N(o[u],a[u]);if(c!==0)return c}return N(o.length,a.length)}(n.referenceValue,e.referenceValue);case 8:return function(r,i){const o=N(q(r.latitude),q(i.latitude));return o!==0?o:N(q(r.longitude),q(i.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return function(r,i){const o=r.values||[],a=i.values||[];for(let u=0;u<o.length&&u<a.length;++u){const c=Xe(o[u],a[u]);if(c)return c}return N(o.length,a.length)}(n.arrayValue,e.arrayValue);case 10:return function(r,i){const o=r.fields||{},a=Object.keys(o),u=i.fields||{},c=Object.keys(u);a.sort(),c.sort();for(let l=0;l<a.length&&l<c.length;++l){const h=N(a[l],c[l]);if(h!==0)return h;const d=Xe(o[a[l]],u[c[l]]);if(d!==0)return d}return N(a.length,c.length)}(n.mapValue,e.mapValue);default:throw T()}}function wa(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return N(n,e);const t=Qe(n),s=Qe(e),r=N(t.seconds,s.seconds);return r!==0?r:N(t.nanos,s.nanos)}function Qt(n){return fi(n)}function fi(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(s){const r=Qe(s);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?Et(n.bytesValue).toBase64():"referenceValue"in n?(t=n.referenceValue,v.fromName(t).toString()):"geoPointValue"in n?`geo(${(e=n.geoPointValue).latitude},${e.longitude})`:"arrayValue"in n?function(s){let r="[",i=!0;for(const o of s.values||[])i?i=!1:r+=",",r+=fi(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(s){const r=Object.keys(s.fields||{}).sort();let i="{",o=!0;for(const a of r)o?o=!1:i+=",",i+=`${a}:${fi(s.fields[a])}`;return i+"}"}(n.mapValue):T();var e,t}function Tt(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function gi(n){return!!n&&"integerValue"in n}function zn(n){return!!n&&"arrayValue"in n}function va(n){return!!n&&"nullValue"in n}function Ia(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ks(n){return!!n&&"mapValue"in n}function kn(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Lt(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=kn(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=kn(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Bc(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}function If(n){return"nullValue"in n?Vc:"booleanValue"in n?{booleanValue:!1}:"integerValue"in n||"doubleValue"in n?{doubleValue:NaN}:"timestampValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in n?{stringValue:""}:"bytesValue"in n?{bytesValue:""}:"referenceValue"in n?Tt(Ve.empty(),v.empty()):"geoPointValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in n?{arrayValue:{}}:"mapValue"in n?{mapValue:{}}:T()}function Ef(n){return"nullValue"in n?{booleanValue:!1}:"booleanValue"in n?{doubleValue:NaN}:"integerValue"in n||"doubleValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in n?{stringValue:""}:"stringValue"in n?{bytesValue:""}:"bytesValue"in n?Tt(Ve.empty(),v.empty()):"referenceValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in n?{arrayValue:{}}:"arrayValue"in n?{mapValue:{}}:"mapValue"in n?Fc:T()}function Ea(n,e){return n===void 0?e:e===void 0||Xe(n,e)>0?n:e}function _a(n,e){return n===void 0?e:e===void 0||Xe(n,e)<0?n:e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.value=e}static empty(){return new de({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!ks(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=kn(t)}setAll(e){let t=Z.emptyPath(),s={},r=[];e.forEach((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,s,r),s={},r=[],t=a.popLast()}o?s[a.lastSegment()]=kn(o):r.push(a.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,s,r)}delete(e){const t=this.field(e.popLast());ks(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Re(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];ks(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){Lt(t,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new de(kn(this.value))}}function Uc(n){const e=[];return Lt(n.fields,(t,s)=>{const r=new Z([t]);if(ks(s)){const i=Uc(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)}),new tn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,t,s,r,i,o){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.data=i,this.documentState=o}static newInvalidDocument(e){return new O(e,0,S.min(),S.min(),de.empty(),0)}static newFoundDocument(e,t,s){return new O(e,1,t,S.min(),s,0)}static newNoDocument(e,t){return new O(e,2,t,S.min(),de.empty(),0)}static newUnknownDocument(e,t){return new O(e,3,t,S.min(),de.empty(),2)}convertToFoundDocument(e,t){return this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=de.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=de.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof O&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new O(this.key,this.documentType,this.version,this.readTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}class qc{constructor(e,t,s,r){this.indexId=e,this.collectionGroup=t,this.fields=s,this.indexState=r}}function mi(n){return n.fields.find(e=>e.kind===2)}function ct(n){return n.fields.filter(e=>e.kind!==2)}qc.UNKNOWN_ID=-1;class _f{constructor(e,t){this.fieldPath=e,this.kind=t}}class Ys{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Ys(0,Be.min())}}function $c(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=S.fromTimestamp(s===1e9?new G(t+1,0):new G(t,s));return new Be(r,v.empty(),e)}function Tf(n){return new Be(n.readTime,n.key,-1)}class Be{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Be(S.min(),v.empty(),-1)}static max(){return new Be(S.max(),v.empty(),-1)}}function Sf(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=v.comparator(n.documentKey,e.documentKey),t!==0?t:N(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e,t=null,s=[],r=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=a,this.P=null}}function Ta(n,e=null,t=[],s=[],r=null,i=null,o=null){return new bf(n,e,t,s,r,i,o)}function St(n){const e=I(n);if(e.P===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>{return(r=s).field.canonicalString()+r.op.toString()+Qt(r.value);var r}).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(r){return r.field.canonicalString()+r.dir}(s)).join(","),Mt(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>Qt(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>Qt(s)).join(",")),e.P=t}return e.P}function Af(n){let e=n.path.canonicalString();return n.collectionGroup!==null&&(e+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(e+=`, filters: [${n.filters.map(t=>{return`${(s=t).field.canonicalString()} ${s.op} ${Qt(s.value)}`;var s}).join(", ")}]`),Mt(n.limit)||(e+=", limit: "+n.limit),n.orderBy.length>0&&(e+=`, orderBy: [${n.orderBy.map(t=>function(s){return`${s.field.canonicalString()} (${s.dir})`}(t)).join(", ")}]`),n.startAt&&(e+=", startAt: ",e+=n.startAt.inclusive?"b:":"a:",e+=n.startAt.position.map(t=>Qt(t)).join(",")),n.endAt&&(e+=", endAt: ",e+=n.endAt.inclusive?"a:":"b:",e+=n.endAt.position.map(t=>Qt(t)).join(",")),`Target(${e})`}function cs(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let r=0;r<n.orderBy.length;r++)if(!Rf(n.orderBy[r],e.orderBy[r]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let r=0;r<n.filters.length;r++)if(t=n.filters[r],s=e.filters[r],t.op!==s.op||!t.field.isEqual(s.field)||!Re(t.value,s.value))return!1;var t,s;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ca(n.startAt,e.startAt)&&Ca(n.endAt,e.endAt)}function Qs(n){return v.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Xs(n,e){return n.filters.filter(t=>t instanceof ue&&t.field.isEqual(e))}function Sa(n,e,t){let s,r=!0;for(const i of Xs(n,e)){let o,a=!0;switch(i.op){case"<":case"<=":o=If(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=Vc}Ea(s,o)===o&&(s=o,r=a)}if(t!==null){for(let i=0;i<n.orderBy.length;++i)if(n.orderBy[i].field.isEqual(e)){const o=t.position[i];Ea(s,o)===o&&(s=o,r=t.inclusive);break}}return{value:s,inclusive:r}}function ba(n,e,t){let s,r=!0;for(const i of Xs(n,e)){let o,a=!0;switch(i.op){case">=":case">":o=Ef(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=Fc}_a(s,o)===o&&(s=o,r=a)}if(t!==null){for(let i=0;i<n.orderBy.length;++i)if(n.orderBy[i].field.isEqual(e)){const o=t.position[i];_a(s,o)===o&&(s=o,r=t.inclusive);break}}return{value:s,inclusive:r}}class ue extends class{}{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.V(e,t,s):new Cf(e,t,s):t==="array-contains"?new xf(e,s):t==="in"?new kf(e,s):t==="not-in"?new Lf(e,s):t==="array-contains-any"?new Mf(e,s):new ue(e,t,s)}static V(e,t,s){return t==="in"?new Nf(e,s):new Df(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.v(Xe(t,this.value)):t!==null&&_t(this.value)===_t(t)&&this.v(Xe(t,this.value))}v(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return T()}}S(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}}class Cf extends ue{constructor(e,t,s){super(e,t,s),this.key=v.fromName(s.referenceValue)}matches(e){const t=v.comparator(e.key,this.key);return this.v(t)}}class Nf extends ue{constructor(e,t){super(e,"in",t),this.keys=Kc("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Df extends ue{constructor(e,t){super(e,"not-in",t),this.keys=Kc("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Kc(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>v.fromName(s.referenceValue))}class xf extends ue{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return zn(t)&&jn(t.arrayValue,this.value)}}class kf extends ue{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&jn(this.value.arrayValue,t)}}class Lf extends ue{constructor(e,t){super(e,"not-in",t)}matches(e){if(jn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!jn(this.value.arrayValue,t)}}class Mf extends ue{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!zn(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>jn(this.value.arrayValue,s))}}class Je{constructor(e,t){this.position=e,this.inclusive=t}}class Xt{constructor(e,t="asc"){this.field=e,this.dir=t}}function Rf(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}function Aa(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const i=e[r],o=n.position[r];if(i.field.isKeyField()?s=v.comparator(v.fromName(o.referenceValue),t.key):s=Xe(o,t.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Ca(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Re(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{constructor(e,t=null,s=[],r=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.D=null,this.C=null,this.startAt,this.endAt}}function Gc(n,e,t,s,r,i,o,a){return new qe(n,e,t,s,r,i,o,a)}function pn(n){return new qe(n)}function Ls(n){return!Mt(n.limit)&&n.limitType==="F"}function Js(n){return!Mt(n.limit)&&n.limitType==="L"}function so(n){return n.explicitOrderBy.length>0?n.explicitOrderBy[0].field:null}function ro(n){for(const e of n.filters)if(e.S())return e.field;return null}function io(n){return n.collectionGroup!==null}function nn(n){const e=I(n);if(e.D===null){e.D=[];const t=ro(e),s=so(e);if(t!==null&&s===null)t.isKeyField()||e.D.push(new Xt(t)),e.D.push(new Xt(Z.keyField(),"asc"));else{let r=!1;for(const i of e.explicitOrderBy)e.D.push(i),i.field.isKeyField()&&(r=!0);if(!r){const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";e.D.push(new Xt(Z.keyField(),i))}}}return e.D}function De(n){const e=I(n);if(!e.C)if(e.limitType==="F")e.C=Ta(e.path,e.collectionGroup,nn(e),e.filters,e.limit,e.startAt,e.endAt);else{const t=[];for(const i of nn(e)){const o=i.dir==="desc"?"asc":"desc";t.push(new Xt(i.field,o))}const s=e.endAt?new Je(e.endAt.position,!e.endAt.inclusive):null,r=e.startAt?new Je(e.startAt.position,!e.startAt.inclusive):null;e.C=Ta(e.path,e.collectionGroup,t,e.filters,e.limit,s,r)}return e.C}function jc(n,e,t){return new qe(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function ls(n,e){return cs(De(n),De(e))&&n.limitType===e.limitType}function zc(n){return`${St(De(n))}|lt:${n.limitType}`}function pi(n){return`Query(target=${Af(De(n))}; limitType=${n.limitType})`}function oo(n,e){return e.isFoundDocument()&&function(t,s){const r=s.key.path;return t.collectionGroup!==null?s.key.hasCollectionId(t.collectionGroup)&&t.path.isPrefixOf(r):v.isDocumentKey(t.path)?t.path.isEqual(r):t.path.isImmediateParentOf(r)}(n,e)&&function(t,s){for(const r of t.explicitOrderBy)if(!r.field.isKeyField()&&s.data.field(r.field)===null)return!1;return!0}(n,e)&&function(t,s){for(const r of t.filters)if(!r.matches(s))return!1;return!0}(n,e)&&function(t,s){return!(t.startAt&&!function(r,i,o){const a=Aa(r,i,o);return r.inclusive?a<=0:a<0}(t.startAt,nn(t),s)||t.endAt&&!function(r,i,o){const a=Aa(r,i,o);return r.inclusive?a>=0:a>0}(t.endAt,nn(t),s))}(n,e)}function Wc(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Hc(n){return(e,t)=>{let s=!1;for(const r of nn(n)){const i=Of(r,e,t);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function Of(n,e,t){const s=n.field.isKeyField()?v.comparator(e.key,t.key):function(r,i,o){const a=i.data.field(r),u=o.data.field(r);return a!==null&&u!==null?Xe(a,u):T()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return T()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(n,e){if(n.N){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Gn(e)?"-0":e}}function Qc(n){return{integerValue:""+n}}function Xc(n,e){return Pc(e)?Qc(e):Yc(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(){this._=void 0}}function Pf(n,e,t){return n instanceof sn?function(s,r){const i={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return r&&(i.fields.__previous_value__=r),{mapValue:i}}(t,e):n instanceof bt?Zc(n,e):n instanceof At?el(n,e):function(s,r){const i=Jc(s,r),o=Na(i)+Na(s.k);return gi(i)&&gi(s.k)?Qc(o):Yc(s.M,o)}(n,e)}function Ff(n,e,t){return n instanceof bt?Zc(n,e):n instanceof At?el(n,e):t}function Jc(n,e){return n instanceof rn?gi(t=e)||function(s){return!!s&&"doubleValue"in s}(t)?e:{integerValue:0}:null;var t}class sn extends Tr{}class bt extends Tr{constructor(e){super(),this.elements=e}}function Zc(n,e){const t=tl(e);for(const s of n.elements)t.some(r=>Re(r,s))||t.push(s);return{arrayValue:{values:t}}}class At extends Tr{constructor(e){super(),this.elements=e}}function el(n,e){let t=tl(e);for(const s of n.elements)t=t.filter(r=>!Re(r,s));return{arrayValue:{values:t}}}class rn extends Tr{constructor(e,t){super(),this.M=e,this.k=t}}function Na(n){return q(n.integerValue||n.doubleValue)}function tl(n){return zn(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,t){this.field=e,this.transform=t}}function Vf(n,e){return n.field.isEqual(e.field)&&function(t,s){return t instanceof bt&&s instanceof bt||t instanceof At&&s instanceof At?en(t.elements,s.elements,Re):t instanceof rn&&s instanceof rn?Re(t.k,s.k):t instanceof sn&&s instanceof sn}(n.transform,e.transform)}class Bf{constructor(e,t){this.version=e,this.transformResults=t}}class Y{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Y}static exists(e){return new Y(void 0,e)}static updateTime(e){return new Y(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ms(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Sr{}function Uf(n,e,t){n instanceof ds?function(s,r,i){const o=s.value.clone(),a=ka(s.fieldTransforms,r,i.transformResults);o.setAll(a),r.convertToFoundDocument(i.version,o).setHasCommittedMutations()}(n,e,t):n instanceof Rt?function(s,r,i){if(!Ms(s.precondition,r))return void r.convertToUnknownDocument(i.version);const o=ka(s.fieldTransforms,r,i.transformResults),a=r.data;a.setAll(nl(s)),a.setAll(o),r.convertToFoundDocument(i.version,a).setHasCommittedMutations()}(n,e,t):function(s,r,i){r.convertToNoDocument(i.version).setHasCommittedMutations()}(0,e,t)}function yi(n,e,t){n instanceof ds?function(s,r,i){if(!Ms(s.precondition,r))return;const o=s.value.clone(),a=La(s.fieldTransforms,i,r);o.setAll(a),r.convertToFoundDocument(xa(r),o).setHasLocalMutations()}(n,e,t):n instanceof Rt?function(s,r,i){if(!Ms(s.precondition,r))return;const o=La(s.fieldTransforms,i,r),a=r.data;a.setAll(nl(s)),a.setAll(o),r.convertToFoundDocument(xa(r),a).setHasLocalMutations()}(n,e,t):function(s,r){Ms(s.precondition,r)&&r.convertToNoDocument(S.min())}(n,e)}function qf(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),i=Jc(s.transform,r||null);i!=null&&(t==null&&(t=de.empty()),t.set(s.field,i))}return t||null}function Da(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(t,s){return t===void 0&&s===void 0||!(!t||!s)&&en(t,s,(r,i)=>Vf(r,i))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}function xa(n){return n.isFoundDocument()?n.version:S.min()}class ds extends Sr{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}}class Rt extends Sr{constructor(e,t,s,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}}function nl(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function ka(n,e,t){const s=new Map;A(n.length===t.length);for(let r=0;r<t.length;r++){const i=n[r],o=i.transform,a=e.data.field(i.field);s.set(i.field,Ff(o,a,t[r]))}return s}function La(n,e,t){const s=new Map;for(const r of n){const i=r.transform,o=t.data.field(r.field);s.set(r.field,Pf(i,o,e))}return s}class fs extends Sr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}}class ao extends Sr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e){this.count=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var W,D;function sl(n){switch(n){default:return T();case f.CANCELLED:case f.UNKNOWN:case f.DEADLINE_EXCEEDED:case f.RESOURCE_EXHAUSTED:case f.INTERNAL:case f.UNAVAILABLE:case f.UNAUTHENTICATED:return!1;case f.INVALID_ARGUMENT:case f.NOT_FOUND:case f.ALREADY_EXISTS:case f.PERMISSION_DENIED:case f.FAILED_PRECONDITION:case f.ABORTED:case f.OUT_OF_RANGE:case f.UNIMPLEMENTED:case f.DATA_LOSS:return!0}}function rl(n){if(n===void 0)return H("GRPC error has no .code"),f.UNKNOWN;switch(n){case W.OK:return f.OK;case W.CANCELLED:return f.CANCELLED;case W.UNKNOWN:return f.UNKNOWN;case W.DEADLINE_EXCEEDED:return f.DEADLINE_EXCEEDED;case W.RESOURCE_EXHAUSTED:return f.RESOURCE_EXHAUSTED;case W.INTERNAL:return f.INTERNAL;case W.UNAVAILABLE:return f.UNAVAILABLE;case W.UNAUTHENTICATED:return f.UNAUTHENTICATED;case W.INVALID_ARGUMENT:return f.INVALID_ARGUMENT;case W.NOT_FOUND:return f.NOT_FOUND;case W.ALREADY_EXISTS:return f.ALREADY_EXISTS;case W.PERMISSION_DENIED:return f.PERMISSION_DENIED;case W.FAILED_PRECONDITION:return f.FAILED_PRECONDITION;case W.ABORTED:return f.ABORTED;case W.OUT_OF_RANGE:return f.OUT_OF_RANGE;case W.UNIMPLEMENTED:return f.UNIMPLEMENTED;case W.DATA_LOSS:return f.DATA_LOSS;default:return T()}}(D=W||(W={}))[D.OK=0]="OK",D[D.CANCELLED=1]="CANCELLED",D[D.UNKNOWN=2]="UNKNOWN",D[D.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",D[D.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",D[D.NOT_FOUND=5]="NOT_FOUND",D[D.ALREADY_EXISTS=6]="ALREADY_EXISTS",D[D.PERMISSION_DENIED=7]="PERMISSION_DENIED",D[D.UNAUTHENTICATED=16]="UNAUTHENTICATED",D[D.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",D[D.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",D[D.ABORTED=10]="ABORTED",D[D.OUT_OF_RANGE=11]="OUT_OF_RANGE",D[D.UNIMPLEMENTED=12]="UNIMPLEMENTED",D[D.INTERNAL=13]="INTERNAL",D[D.UNAVAILABLE=14]="UNAVAILABLE",D[D.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Lt(this.inner,(t,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return Rc(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e,t){this.comparator=e,this.root=t||ae.EMPTY}insert(e,t){return new j(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ae.BLACK,null,null))}remove(e){return new j(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ae.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new As(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new As(this.root,e,this.comparator,!1)}getReverseIterator(){return new As(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new As(this.root,e,this.comparator,!0)}}class As{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?s(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ae{constructor(e,t,s,r,i){this.key=e,this.value=t,this.color=s??ae.RED,this.left=r??ae.EMPTY,this.right=i??ae.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,i){return new ae(e??this.key,t??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,s),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ae.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return ae.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ae.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ae.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw T();const e=this.left.check();if(e!==this.right.check())throw T();return e+(this.isRed()?0:1)}}ae.EMPTY=null,ae.RED=!0,ae.BLACK=!1;ae.EMPTY=new class{constructor(){this.size=0}get key(){throw T()}get value(){throw T()}get color(){throw T()}get left(){throw T()}get right(){throw T()}copy(n,e,t,s,r){return this}insert(n,e,t){return new ae(n,e)}remove(n,e){return this}isEmpty(){return!0}inorderTraversal(n){return!1}reverseTraversal(n){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.comparator=e,this.data=new j(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ma(this.data.getIterator())}getIteratorFrom(e){return new Ma(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof P)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new P(this.comparator);return t.data=e,t}}class Ma{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function $t(n){return n.hasNext()?n.getNext():void 0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kf=new j(v.comparator);function Ce(){return Kf}const Gf=new j(v.comparator);function wi(){return Gf}function Ln(){return new rt(n=>n.toString(),(n,e)=>n.isEqual(e))}const jf=new j(v.comparator),zf=new P(v.comparator);function M(...n){let e=zf;for(const t of n)e=e.add(t);return e}const Wf=new P(N);function br(){return Wf}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(e,t,s,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t){const s=new Map;return s.set(e,ms.createSynthesizedTargetChangeForCurrentChange(e,t)),new gs(S.min(),s,br(),Ce(),M())}}class ms{constructor(e,t,s,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t){return new ms(X.EMPTY_BYTE_STRING,t,M(),M(),M())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(e,t,s,r){this.O=e,this.removedTargetIds=t,this.key=s,this.F=r}}class il{constructor(e,t){this.targetId=e,this.$=t}}class ol{constructor(e,t,s=X.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class Ra{constructor(){this.B=0,this.L=Pa(),this.U=X.EMPTY_BYTE_STRING,this.q=!1,this.K=!0}get current(){return this.q}get resumeToken(){return this.U}get G(){return this.B!==0}get j(){return this.K}W(e){e.approximateByteSize()>0&&(this.K=!0,this.U=e)}H(){let e=M(),t=M(),s=M();return this.L.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:T()}}),new ms(this.U,this.q,e,t,s)}J(){this.K=!1,this.L=Pa()}Y(e,t){this.K=!0,this.L=this.L.insert(e,t)}X(e){this.K=!0,this.L=this.L.remove(e)}Z(){this.B+=1}tt(){this.B-=1}et(){this.K=!0,this.q=!0}}class Hf{constructor(e){this.nt=e,this.st=new Map,this.it=Ce(),this.rt=Oa(),this.ot=new P(N)}ut(e){for(const t of e.O)e.F&&e.F.isFoundDocument()?this.at(t,e.F):this.ct(t,e.key,e.F);for(const t of e.removedTargetIds)this.ct(t,e.key,e.F)}ht(e){this.forEachTarget(e,t=>{const s=this.lt(t);switch(e.state){case 0:this.ft(t)&&s.W(e.resumeToken);break;case 1:s.tt(),s.G||s.J(),s.W(e.resumeToken);break;case 2:s.tt(),s.G||this.removeTarget(t);break;case 3:this.ft(t)&&(s.et(),s.W(e.resumeToken));break;case 4:this.ft(t)&&(this.dt(t),s.W(e.resumeToken));break;default:T()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.st.forEach((s,r)=>{this.ft(r)&&t(r)})}_t(e){const t=e.targetId,s=e.$.count,r=this.wt(t);if(r){const i=r.target;if(Qs(i))if(s===0){const o=new v(i.path);this.ct(t,o,O.newNoDocument(o,S.min()))}else A(s===1);else this.gt(t)!==s&&(this.dt(t),this.ot=this.ot.add(t))}}yt(e){const t=new Map;this.st.forEach((i,o)=>{const a=this.wt(o);if(a){if(i.current&&Qs(a.target)){const u=new v(a.target.path);this.it.get(u)!==null||this.It(o,u)||this.ct(o,u,O.newNoDocument(u,e))}i.j&&(t.set(o,i.H()),i.J())}});let s=M();this.rt.forEach((i,o)=>{let a=!0;o.forEachWhile(u=>{const c=this.wt(u);return!c||c.purpose===2||(a=!1,!1)}),a&&(s=s.add(i))}),this.it.forEach((i,o)=>o.setReadTime(e));const r=new gs(e,t,this.ot,this.it,s);return this.it=Ce(),this.rt=Oa(),this.ot=new P(N),r}at(e,t){if(!this.ft(e))return;const s=this.It(e,t.key)?2:0;this.lt(e).Y(t.key,s),this.it=this.it.insert(t.key,t),this.rt=this.rt.insert(t.key,this.Tt(t.key).add(e))}ct(e,t,s){if(!this.ft(e))return;const r=this.lt(e);this.It(e,t)?r.Y(t,1):r.X(t),this.rt=this.rt.insert(t,this.Tt(t).delete(e)),s&&(this.it=this.it.insert(t,s))}removeTarget(e){this.st.delete(e)}gt(e){const t=this.lt(e).H();return this.nt.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Z(e){this.lt(e).Z()}lt(e){let t=this.st.get(e);return t||(t=new Ra,this.st.set(e,t)),t}Tt(e){let t=this.rt.get(e);return t||(t=new P(N),this.rt=this.rt.insert(e,t)),t}ft(e){const t=this.wt(e)!==null;return t||w("WatchChangeAggregator","Detected inactive target",e),t}wt(e){const t=this.st.get(e);return t&&t.G?null:this.nt.Et(e)}dt(e){this.st.set(e,new Ra),this.nt.getRemoteKeysForTarget(e).forEach(t=>{this.ct(e,t,null)})}It(e,t){return this.nt.getRemoteKeysForTarget(e).has(t)}}function Oa(){return new j(v.comparator)}function Pa(){return new j(v.comparator)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yf={asc:"ASCENDING",desc:"DESCENDING"},Qf={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"};class Xf{constructor(e,t){this.databaseId=e,this.N=t}}function Wn(n,e){return n.N?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function al(n,e){return n.N?e.toBase64():e.toUint8Array()}function Jf(n,e){return Wn(n,e.toTimestamp())}function te(n){return A(!!n),S.fromTimestamp(function(e){const t=Qe(e);return new G(t.seconds,t.nanos)}(n))}function uo(n,e){return function(t){return new x(["projects",t.projectId,"databases",t.database])}(n).child("documents").child(e).canonicalString()}function ul(n){const e=x.fromString(n);return A(pl(e)),e}function Hn(n,e){return uo(n.databaseId,e.path)}function Le(n,e){const t=ul(e);if(t.get(1)!==n.databaseId.projectId)throw new y(f.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new y(f.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new v(ll(t))}function vi(n,e){return uo(n.databaseId,e)}function cl(n){const e=ul(n);return e.length===4?x.emptyPath():ll(e)}function Yn(n){return new x(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function ll(n){return A(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Fa(n,e,t){return{name:Hn(n,e),fields:t.value.mapValue.fields}}function hl(n,e,t){const s=Le(n,e.name),r=te(e.updateTime),i=new de({mapValue:{fields:e.fields}}),o=O.newFoundDocument(s,r,i);return t&&o.setHasCommittedMutations(),t?o.setHasCommittedMutations():o}function Zf(n,e){return"found"in e?function(t,s){A(!!s.found),s.found.name,s.found.updateTime;const r=Le(t,s.found.name),i=te(s.found.updateTime),o=new de({mapValue:{fields:s.found.fields}});return O.newFoundDocument(r,i,o)}(n,e):"missing"in e?function(t,s){A(!!s.missing),A(!!s.readTime);const r=Le(t,s.missing),i=te(s.readTime);return O.newNoDocument(r,i)}(n,e):T()}function eg(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:T()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(u,c){return u.N?(A(c===void 0||typeof c=="string"),X.fromBase64String(c||"")):(A(c===void 0||c instanceof Uint8Array),X.fromUint8Array(c||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(u){const c=u.code===void 0?f.UNKNOWN:rl(u.code);return new y(c,u.message||"")}(o);t=new ol(s,r,i,a||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Le(n,s.document.name),i=te(s.document.updateTime),o=new de({mapValue:{fields:s.document.fields}}),a=O.newFoundDocument(r,i,o),u=s.targetIds||[],c=s.removedTargetIds||[];t=new Rs(u,c,a.key,a)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Le(n,s.document),i=s.readTime?te(s.readTime):S.min(),o=O.newNoDocument(r,i),a=s.removedTargetIds||[];t=new Rs([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Le(n,s.document),i=s.removedTargetIds||[];t=new Rs([],i,r,null)}else{if(!("filter"in e))return T();{e.filter;const s=e.filter;s.targetId;const r=s.count||0,i=new $f(r),o=s.targetId;t=new il(o,i)}}return t}function Qn(n,e){let t;if(e instanceof ds)t={update:Fa(n,e.key,e.value)};else if(e instanceof fs)t={delete:Hn(n,e.key)};else if(e instanceof Rt)t={update:Fa(n,e.key,e.data),updateMask:ag(e.fieldMask)};else{if(!(e instanceof ao))return T();t={verify:Hn(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(r,i){const o=i.transform;if(o instanceof sn)return{fieldPath:i.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(o instanceof bt)return{fieldPath:i.field.canonicalString(),appendMissingElements:{values:o.elements}};if(o instanceof At)return{fieldPath:i.field.canonicalString(),removeAllFromArray:{values:o.elements}};if(o instanceof rn)return{fieldPath:i.field.canonicalString(),increment:o.k};throw T()}(0,s))),e.precondition.isNone||(t.currentDocument=function(s,r){return r.updateTime!==void 0?{updateTime:Jf(s,r.updateTime)}:r.exists!==void 0?{exists:r.exists}:T()}(n,e.precondition)),t}function Ii(n,e){const t=e.currentDocument?function(r){return r.updateTime!==void 0?Y.updateTime(te(r.updateTime)):r.exists!==void 0?Y.exists(r.exists):Y.none()}(e.currentDocument):Y.none(),s=e.updateTransforms?e.updateTransforms.map(r=>function(i,o){let a=null;if("setToServerValue"in o)A(o.setToServerValue==="REQUEST_TIME"),a=new sn;else if("appendMissingElements"in o){const c=o.appendMissingElements.values||[];a=new bt(c)}else if("removeAllFromArray"in o){const c=o.removeAllFromArray.values||[];a=new At(c)}else"increment"in o?a=new rn(i,o.increment):T();const u=Z.fromServerFormat(o.fieldPath);return new hs(u,a)}(n,r)):[];if(e.update){e.update.name;const r=Le(n,e.update.name),i=new de({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(a){const u=a.fieldPaths||[];return new tn(u.map(c=>Z.fromServerFormat(c)))}(e.updateMask);return new Rt(r,i,o,t,s)}return new ds(r,i,t,s)}if(e.delete){const r=Le(n,e.delete);return new fs(r,t)}if(e.verify){const r=Le(n,e.verify);return new ao(r,t)}return T()}function tg(n,e){return n&&n.length>0?(A(e!==void 0),n.map(t=>function(s,r){let i=s.updateTime?te(s.updateTime):te(r);return i.isEqual(S.min())&&(i=te(r)),new Bf(i,s.transformResults||[])}(t,e))):[]}function dl(n,e){return{documents:[vi(n,e.path)]}}function fl(n,e){const t={structuredQuery:{}},s=e.path;e.collectionGroup!==null?(t.parent=vi(n,s),t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(t.parent=vi(n,s.popLast()),t.structuredQuery.from=[{collectionId:s.lastSegment()}]);const r=function(u){if(u.length===0)return;const c=u.map(l=>function(h){if(h.op==="=="){if(Ia(h.value))return{unaryFilter:{field:Kt(h.field),op:"IS_NAN"}};if(va(h.value))return{unaryFilter:{field:Kt(h.field),op:"IS_NULL"}}}else if(h.op==="!="){if(Ia(h.value))return{unaryFilter:{field:Kt(h.field),op:"IS_NOT_NAN"}};if(va(h.value))return{unaryFilter:{field:Kt(h.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Kt(h.field),op:rg(h.op),value:h.value}}}(l));return c.length===1?c[0]:{compositeFilter:{op:"AND",filters:c}}}(e.filters);r&&(t.structuredQuery.where=r);const i=function(u){if(u.length!==0)return u.map(c=>function(l){return{field:Kt(l.field),direction:sg(l.dir)}}(c))}(e.orderBy);i&&(t.structuredQuery.orderBy=i);const o=function(u,c){return u.N||Mt(c)?c:{value:c}}(n,e.limit);var a;return o!==null&&(t.structuredQuery.limit=o),e.startAt&&(t.structuredQuery.startAt={before:(a=e.startAt).inclusive,values:a.position}),e.endAt&&(t.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),t}function gl(n){let e=cl(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){A(s===1);const l=t.from[0];l.allDescendants?r=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=ml(t.where));let o=[];t.orderBy&&(o=t.orderBy.map(l=>function(h){return new Xt(Yt(h.field),function(d){switch(d){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(h.direction))}(l)));let a=null;t.limit&&(a=function(l){let h;return h=typeof l=="object"?l.value:l,Mt(h)?null:h}(t.limit));let u=null;t.startAt&&(u=function(l){const h=!!l.before,d=l.values||[];return new Je(d,h)}(t.startAt));let c=null;return t.endAt&&(c=function(l){const h=!l.before,d=l.values||[];return new Je(d,h)}(t.endAt)),Gc(e,r,o,i,a,"F",u,c)}function ng(n,e){const t=function(s,r){switch(r){case 0:return null;case 1:return"existence-filter-mismatch";case 2:return"limbo-document";default:return T()}}(0,e.purpose);return t==null?null:{"goog-listen-tags":t}}function ml(n){return n?n.unaryFilter!==void 0?[og(n)]:n.fieldFilter!==void 0?[ig(n)]:n.compositeFilter!==void 0?n.compositeFilter.filters.map(e=>ml(e)).reduce((e,t)=>e.concat(t)):T():[]}function sg(n){return Yf[n]}function rg(n){return Qf[n]}function Kt(n){return{fieldPath:n.canonicalString()}}function Yt(n){return Z.fromServerFormat(n.fieldPath)}function ig(n){return ue.create(Yt(n.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return T()}}(n.fieldFilter.op),n.fieldFilter.value)}function og(n){switch(n.unaryFilter.op){case"IS_NAN":const e=Yt(n.unaryFilter.field);return ue.create(e,"==",{doubleValue:NaN});case"IS_NULL":const t=Yt(n.unaryFilter.field);return ue.create(t,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Yt(n.unaryFilter.field);return ue.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const r=Yt(n.unaryFilter.field);return ue.create(r,"!=",{nullValue:"NULL_VALUE"});default:return T()}}function ag(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function pl(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Va(e)),e=ug(n.get(t),e);return Va(e)}function ug(n,e){let t=e;const s=n.length;for(let r=0;r<s;r++){const i=n.charAt(r);switch(i){case"\0":t+="";break;case"":t+="";break;default:t+=i}}return t}function Va(n){return n+""}function ke(n){const e=n.length;if(A(e>=2),e===2)return A(n.charAt(0)===""&&n.charAt(1)===""),x.emptyPath();const t=e-2,s=[];let r="";for(let i=0;i<e;){const o=n.indexOf("",i);switch((o<0||o>t)&&T(),n.charAt(o+1)){case"":const a=n.substring(i,o);let u;r.length===0?u=a:(r+=a,u=r,r=""),s.push(u);break;case"":r+=n.substring(i,o),r+="\0";break;case"":r+=n.substring(i,o+1);break;default:T()}i=o+2}return new x(s)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Os(n,e){return[n,Ee(e)]}function yl(n,e,t){return[n,Ee(e),t]}const cg={},lg=["prefixPath","collectionGroup","readTime","documentId"],hg=["prefixPath","collectionGroup","documentId"],dg=["collectionGroup","readTime","prefixPath","documentId"],fg=["canonicalId","targetId"],gg=["targetId","path"],mg=["path","targetId"],pg=["collectionId","parent"],yg=["indexId","uid"],wg=["uid","sequenceNumber"],vg=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Ig=["indexId","uid","orderedDocumentKey"],Eg=["userId","collectionPath","documentId"],_g=["userId","collectionPath","largestBatchId"],Tg=["userId","collectionGroup","largestBatchId"],wl=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],Sg=[...wl,"documentOverlays"],vl=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],bg=[...vl,"indexConfiguration","indexState","indexEntries"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Il="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class El{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&T(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new g((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(t,i).next(s,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof g?t:g.resolve(t)}catch(t){return g.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):g.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):g.reject(t)}static resolve(e){return new g((t,s)=>{t(e)})}static reject(e){return new g((t,s)=>{s(e)})}static waitFor(e){return new g((t,s)=>{let r=0,i=0,o=!1;e.forEach(a=>{++r,a.next(()=>{++i,o&&i===r&&t()},u=>s(u))}),o=!0,i===r&&t()})}static or(e){let t=g.resolve(!1);for(const s of e)t=t.next(r=>r?g.resolve(r):s());return t}static forEach(e,t){const s=[];return e.forEach((r,i)=>{s.push(t.call(this,r,i))}),this.waitFor(s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.At=new ee,this.transaction.oncomplete=()=>{this.At.resolve()},this.transaction.onabort=()=>{t.error?this.At.reject(new Mn(e,t.error)):this.At.resolve()},this.transaction.onerror=s=>{const r=co(s.target.error);this.At.reject(new Mn(e,r))}}static open(e,t,s,r){try{return new Ar(t,e.transaction(r,s))}catch(i){throw new Mn(t,i)}}get Rt(){return this.At.promise}abort(e){e&&this.At.reject(e),this.aborted||(w("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}Pt(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Cg(t)}}class xe{constructor(e,t,s){this.name=e,this.version=t,this.bt=s,xe.Vt(Zr())===12.2&&H("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return w("SimpleDb","Removing database:",e),ht(window.indexedDB.deleteDatabase(e)).toPromise()}static vt(){if(!Du())return!1;if(xe.St())return!0;const e=Zr(),t=xe.Vt(e),s=0<t&&t<10,r=xe.Dt(e),i=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||s||i)}static St(){var e;return typeof process<"u"&&((e=rf)===null||e===void 0?void 0:e.Ct)==="YES"}static xt(e,t){return e.store(t)}static Vt(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),s=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(s)}static Dt(e){const t=e.match(/Android ([\d.]+)/i),s=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(s)}async Nt(e){return this.db||(w("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,s)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=i=>{const o=i.target.result;t(o)},r.onblocked=()=>{s(new Mn(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=i=>{const o=i.target.error;o.name==="VersionError"?s(new y(f.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?s(new y(f.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):s(new Mn(e,o))},r.onupgradeneeded=i=>{w("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.bt.kt(o,r.transaction,i.oldVersion,this.version).next(()=>{w("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.Mt&&(this.db.onversionchange=t=>this.Mt(t)),this.db}Ot(e){this.Mt=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,s,r){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.Nt(e);const a=Ar.open(this.db,e,i?"readonly":"readwrite",s),u=r(a).next(c=>(a.Pt(),c)).catch(c=>(a.abort(c),g.reject(c))).toPromise();return u.catch(()=>{}),await a.Rt,u}catch(a){const u=a.name!=="FirebaseError"&&o<3;if(w("SimpleDb","Transaction failed with error:",a.message,"Retrying:",u),this.close(),!u)return Promise.reject(a)}}}close(){this.db&&this.db.close(),this.db=void 0}}class Ag{constructor(e){this.Ft=e,this.$t=!1,this.Bt=null}get isDone(){return this.$t}get Lt(){return this.Bt}set cursor(e){this.Ft=e}done(){this.$t=!0}Ut(e){this.Bt=e}delete(){return ht(this.Ft.delete())}}class Mn extends y{constructor(e,t){super(f.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Ot(n){return n.name==="IndexedDbTransactionError"}class Cg{constructor(e){this.store=e}put(e,t){let s;return t!==void 0?(w("SimpleDb","PUT",this.store.name,e,t),s=this.store.put(t,e)):(w("SimpleDb","PUT",this.store.name,"<auto-key>",e),s=this.store.put(e)),ht(s)}add(e){return w("SimpleDb","ADD",this.store.name,e,e),ht(this.store.add(e))}get(e){return ht(this.store.get(e)).next(t=>(t===void 0&&(t=null),w("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return w("SimpleDb","DELETE",this.store.name,e),ht(this.store.delete(e))}count(){return w("SimpleDb","COUNT",this.store.name),ht(this.store.count())}qt(e,t){const s=this.options(e,t);if(s.index||typeof this.store.getAll!="function"){const r=this.cursor(s),i=[];return this.Kt(r,(o,a)=>{i.push(a)}).next(()=>i)}{const r=this.store.getAll(s.range);return new g((i,o)=>{r.onerror=a=>{o(a.target.error)},r.onsuccess=a=>{i(a.target.result)}})}}Gt(e,t){const s=this.store.getAll(e,t===null?void 0:t);return new g((r,i)=>{s.onerror=o=>{i(o.target.error)},s.onsuccess=o=>{r(o.target.result)}})}Qt(e,t){w("SimpleDb","DELETE ALL",this.store.name);const s=this.options(e,t);s.jt=!1;const r=this.cursor(s);return this.Kt(r,(i,o,a)=>a.delete())}Wt(e,t){let s;t?s=e:(s={},t=e);const r=this.cursor(s);return this.Kt(r,t)}zt(e){const t=this.cursor({});return new g((s,r)=>{t.onerror=i=>{const o=co(i.target.error);r(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next(a=>{a?o.continue():s()}):s()}})}Kt(e,t){const s=[];return new g((r,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void r();const u=new Ag(a),c=t(a.primaryKey,a.value,u);if(c instanceof g){const l=c.catch(h=>(u.done(),g.reject(h)));s.push(l)}u.isDone?r():u.Lt===null?a.continue():a.continue(u.Lt)}}).next(()=>g.waitFor(s))}options(e,t){let s;return e!==void 0&&(typeof e=="string"?s=e:t=e),{index:s,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const s=this.store.index(e.index);return e.jt?s.openKeyCursor(e.range,t):s.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function ht(n){return new g((e,t)=>{n.onsuccess=s=>{const r=s.target.result;e(r)},n.onerror=s=>{const r=co(s.target.error);t(r)}})}let Ua=!1;function co(n){const e=xe.Vt(Zr());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(n.message.indexOf(t)>=0){const s=new y("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Ua||(Ua=!0,setTimeout(()=>{throw s},0)),s}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa extends El{constructor(e,t){super(),this.Ht=e,this.currentSequenceNumber=t}}function se(n,e){const t=I(n);return xe.xt(t.Ht,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&Uf(i,e,s[r])}}applyToLocalView(e){for(const t of this.baseMutations)t.key.isEqual(e.key)&&yi(t,e,this.localWriteTime);for(const t of this.mutations)t.key.isEqual(e.key)&&yi(t,e,this.localWriteTime)}applyToLocalDocumentSet(e){this.mutations.forEach(t=>{const s=e.get(t.key),r=s;this.applyToLocalView(r),s.isValidDocument()||r.convertToNoDocument(S.min())})}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),M())}isEqual(e){return this.batchId===e.batchId&&en(this.mutations,e.mutations,(t,s)=>Da(t,s))&&en(this.baseMutations,e.baseMutations,(t,s)=>Da(t,s))}}class ho{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){A(e.mutations.length===s.length);let r=jf;const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new ho(e,t,s,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e,t,s,r,i=S.min(),o=S.min(),a=X.EMPTY_BYTE_STRING){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a}withSequenceNumber(e){return new He(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken)}withResumeToken(e,t){return new He(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e)}withLastLimboFreeSnapshotVersion(e){return new He(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e){this.Jt=e}}function Ng(n,e){let t;if(e.document)t=hl(n.Jt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const s=v.fromSegments(e.noDocument.path),r=Nt(e.noDocument.readTime);t=O.newNoDocument(s,r),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return T();{const s=v.fromSegments(e.unknownDocument.path),r=Nt(e.unknownDocument.version);t=O.newUnknownDocument(s,r)}}return e.readTime&&t.setReadTime(function(s){const r=new G(s[0],s[1]);return S.fromTimestamp(r)}(e.readTime)),t}function $a(n,e){const t=e.key,s={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Zs(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())s.document=function(r,i){return{name:Hn(r,i.key),fields:i.data.value.mapValue.fields,updateTime:Wn(r,i.version.toTimestamp())}}(n.Jt,e);else if(e.isNoDocument())s.noDocument={path:t.path.toArray(),readTime:Ct(e.version)};else{if(!e.isUnknownDocument())return T();s.unknownDocument={path:t.path.toArray(),version:Ct(e.version)}}return s}function Zs(n){const e=n.toTimestamp();return[e.seconds,e.nanoseconds]}function Ct(n){const e=n.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Nt(n){const e=new G(n.seconds,n.nanoseconds);return S.fromTimestamp(e)}function zt(n,e){const t=(e.baseMutations||[]).map(i=>Ii(n.Jt,i));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const s=e.mutations.map(i=>Ii(n.Jt,i)),r=G.fromMillis(e.localWriteTimeMs);return new lo(e.batchId,r,t,s)}function Nn(n){const e=Nt(n.readTime),t=n.lastLimboFreeSnapshotVersion!==void 0?Nt(n.lastLimboFreeSnapshotVersion):S.min();let s;var r;return n.query.documents!==void 0?(A((r=n.query).documents.length===1),s=De(pn(cl(r.documents[0])))):s=function(i){return De(gl(i))}(n.query),new He(s,n.targetId,0,n.lastListenSequenceNumber,e,t,X.fromBase64String(n.resumeToken))}function Tl(n,e){const t=Ct(e.snapshotVersion),s=Ct(e.lastLimboFreeSnapshotVersion);let r;r=Qs(e.target)?dl(n.Jt,e.target):fl(n.Jt,e.target);const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:St(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:s,query:r}}function go(n){const e=gl({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?jc(e,e.limit,"L"):e}function zr(n,e){return new fo(e.largestBatchId,Ii(n.Jt,e.overlayMutation))}function Ka(n,e){const t=e.path.lastSegment();return[n,Ee(e.path.popLast()),t]}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dg{getBundleMetadata(e,t){return Ga(e).get(t).next(s=>{if(s)return{id:(r=s).bundleId,createTime:Nt(r.createTime),version:r.version};var r})}saveBundleMetadata(e,t){return Ga(e).put({bundleId:(s=t).id,createTime:Ct(te(s.createTime)),version:s.version});var s}getNamedQuery(e,t){return ja(e).get(t).next(s=>{if(s)return{name:(r=s).name,query:go(r.bundledQuery),readTime:Nt(r.readTime)};var r})}saveNamedQuery(e,t){return ja(e).put(function(s){return{name:s.name,readTime:Ct(te(s.readTime)),bundledQuery:s.bundledQuery}}(t))}}function Ga(n){return se(n,"bundles")}function ja(n){return se(n,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(e,t){this.M=e,this.userId=t}static Yt(e,t){const s=t.uid||"";return new mo(e,s)}getOverlay(e,t){return _n(e).get(Ka(this.userId,t)).next(s=>s?zr(this.M,s):null)}saveOverlays(e,t,s){const r=[];return s.forEach((i,o)=>{const a=new fo(t,o);r.push(this.Xt(e,a))}),g.waitFor(r)}removeOverlaysForBatchId(e,t,s){const r=new Set;t.forEach(o=>r.add(Ee(o.getCollectionPath())));const i=[];return r.forEach(o=>{const a=IDBKeyRange.bound([this.userId,o,s],[this.userId,o,s+1],!1,!0);i.push(_n(e).Qt("collectionPathOverlayIndex",a))}),g.waitFor(i)}getOverlaysForCollection(e,t,s){const r=Ln(),i=Ee(t),o=IDBKeyRange.bound([this.userId,i,s],[this.userId,i,Number.POSITIVE_INFINITY],!0);return _n(e).qt("collectionPathOverlayIndex",o).next(a=>{for(const u of a){const c=zr(this.M,u);r.set(c.getKey(),c)}return r})}getOverlaysForCollectionGroup(e,t,s,r){const i=Ln();let o;const a=IDBKeyRange.bound([this.userId,t,s],[this.userId,t,Number.POSITIVE_INFINITY],!0);return _n(e).Wt({index:"collectionGroupOverlayIndex",range:a},(u,c,l)=>{const h=zr(this.M,c);i.size()<r||h.largestBatchId===o?(i.set(h.getKey(),h),o=h.largestBatchId):l.done()}).next(()=>i)}Xt(e,t){return _n(e).put(function(s,r,i){const[o,a,u]=Ka(r,i.mutation.key);return{userId:r,collectionPath:a,documentId:u,collectionGroup:i.mutation.key.getCollectionGroup(),largestBatchId:i.largestBatchId,overlayMutation:Qn(s.Jt,i.mutation)}}(this.M,this.userId,t))}}function _n(n){return se(n,"documentOverlays")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(){}Zt(e,t){this.te(e,t),t.ee()}te(e,t){if("nullValue"in e)this.ne(t,5);else if("booleanValue"in e)this.ne(t,10),t.se(e.booleanValue?1:0);else if("integerValue"in e)this.ne(t,15),t.se(q(e.integerValue));else if("doubleValue"in e){const s=q(e.doubleValue);isNaN(s)?this.ne(t,13):(this.ne(t,15),Gn(s)?t.se(0):t.se(s))}else if("timestampValue"in e){const s=e.timestampValue;this.ne(t,20),typeof s=="string"?t.ie(s):(t.ie(`${s.seconds||""}`),t.se(s.nanos||0))}else if("stringValue"in e)this.re(e.stringValue,t),this.oe(t);else if("bytesValue"in e)this.ne(t,30),t.ue(Et(e.bytesValue)),this.oe(t);else if("referenceValue"in e)this.ae(e.referenceValue,t);else if("geoPointValue"in e){const s=e.geoPointValue;this.ne(t,45),t.se(s.latitude||0),t.se(s.longitude||0)}else"mapValue"in e?Bc(e)?this.ne(t,Number.MAX_SAFE_INTEGER):(this.ce(e.mapValue,t),this.oe(t)):"arrayValue"in e?(this.he(e.arrayValue,t),this.oe(t)):T()}re(e,t){this.ne(t,25),this.le(e,t)}le(e,t){t.ie(e)}ce(e,t){const s=e.fields||{};this.ne(t,55);for(const r of Object.keys(s))this.re(r,t),this.te(s[r],t)}he(e,t){const s=e.values||[];this.ne(t,50);for(const r of s)this.te(r,t)}ae(e,t){this.ne(t,37),v.fromName(e).path.forEach(s=>{this.ne(t,60),this.le(s,t)})}ne(e,t){e.se(t)}oe(e){e.se(2)}}dt.fe=new dt;function xg(n){if(n===0)return 8;let e=0;return!(n>>4)&&(e+=4,n<<=4),!(n>>6)&&(e+=2,n<<=2),!(n>>7)&&(e+=1),e}function za(n){const e=64-function(t){let s=0;for(let r=0;r<8;++r){const i=xg(255&t[r]);if(s+=i,i!==8)break}return s}(n);return Math.ceil(e/8)}class kg{constructor(){this.buffer=new Uint8Array(1024),this.position=0}de(e){const t=e[Symbol.iterator]();let s=t.next();for(;!s.done;)this._e(s.value),s=t.next();this.we()}me(e){const t=e[Symbol.iterator]();let s=t.next();for(;!s.done;)this.ge(s.value),s=t.next();this.ye()}pe(e){for(const t of e){const s=t.charCodeAt(0);if(s<128)this._e(s);else if(s<2048)this._e(960|s>>>6),this._e(128|63&s);else if(t<"\uD800"||"\uDBFF"<t)this._e(480|s>>>12),this._e(128|63&s>>>6),this._e(128|63&s);else{const r=t.codePointAt(0);this._e(240|r>>>18),this._e(128|63&r>>>12),this._e(128|63&r>>>6),this._e(128|63&r)}}this.we()}Ie(e){for(const t of e){const s=t.charCodeAt(0);if(s<128)this.ge(s);else if(s<2048)this.ge(960|s>>>6),this.ge(128|63&s);else if(t<"\uD800"||"\uDBFF"<t)this.ge(480|s>>>12),this.ge(128|63&s>>>6),this.ge(128|63&s);else{const r=t.codePointAt(0);this.ge(240|r>>>18),this.ge(128|63&r>>>12),this.ge(128|63&r>>>6),this.ge(128|63&r)}}this.ye()}Te(e){const t=this.Ee(e),s=za(t);this.Ae(1+s),this.buffer[this.position++]=255&s;for(let r=t.length-s;r<t.length;++r)this.buffer[this.position++]=255&t[r]}Re(e){const t=this.Ee(e),s=za(t);this.Ae(1+s),this.buffer[this.position++]=~(255&s);for(let r=t.length-s;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}Pe(){this.be(255),this.be(255)}Ve(){this.ve(255),this.ve(255)}reset(){this.position=0}seed(e){this.Ae(e.length),this.buffer.set(e,this.position),this.position+=e.length}Se(){return this.buffer.slice(0,this.position)}Ee(e){const t=function(r){const i=new DataView(new ArrayBuffer(8));return i.setFloat64(0,r,!1),new Uint8Array(i.buffer)}(e),s=(128&t[0])!=0;t[0]^=s?255:128;for(let r=1;r<t.length;++r)t[r]^=s?255:0;return t}_e(e){const t=255&e;t===0?(this.be(0),this.be(255)):t===255?(this.be(255),this.be(0)):this.be(t)}ge(e){const t=255&e;t===0?(this.ve(0),this.ve(255)):t===255?(this.ve(255),this.ve(0)):this.ve(e)}we(){this.be(0),this.be(1)}ye(){this.ve(0),this.ve(1)}be(e){this.Ae(1),this.buffer[this.position++]=e}ve(e){this.Ae(1),this.buffer[this.position++]=~e}Ae(e){const t=e+this.position;if(t<=this.buffer.length)return;let s=2*this.buffer.length;s<t&&(s=t);const r=new Uint8Array(s);r.set(this.buffer),this.buffer=r}}class Lg{constructor(e){this.De=e}ue(e){this.De.de(e)}ie(e){this.De.pe(e)}se(e){this.De.Te(e)}ee(){this.De.Pe()}}class Mg{constructor(e){this.De=e}ue(e){this.De.me(e)}ie(e){this.De.Ie(e)}se(e){this.De.Re(e)}ee(){this.De.Ve()}}class Tn{constructor(){this.De=new kg,this.Ce=new Lg(this.De),this.xe=new Mg(this.De)}seed(e){this.De.seed(e)}Ne(e){return e===0?this.Ce:this.xe}Se(){return this.De.Se()}reset(){this.De.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e,t,s,r){this.indexId=e,this.documentKey=t,this.arrayValue=s,this.directionalValue=r}ke(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,s=new Uint8Array(t);return s.set(this.directionalValue,0),t!==e?s.set([0],this.directionalValue.length):++s[s.length-1],new je(this.indexId,this.documentKey,this.arrayValue,s)}}function at(n,e){let t=n.indexId-e.indexId;return t!==0?t:(t=Wa(n.arrayValue,e.arrayValue),t!==0?t:(t=Wa(n.directionalValue,e.directionalValue),t!==0?t:v.comparator(n.documentKey,e.documentKey)))}function Wa(n,e){for(let t=0;t<n.length&&t<e.length;++t){const s=n[t]-e[t];if(s!==0)return s}return n.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rg{constructor(e){this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Me=e.orderBy,this.Oe=[];for(const t of e.filters){const s=t;s.S()?this.Fe=s:this.Oe.push(s)}}$e(e){const t=mi(e);if(t!==void 0&&!this.Be(t))return!1;const s=ct(e);let r=0,i=0;for(;r<s.length&&this.Be(s[r]);++r);if(r===s.length)return!0;if(this.Fe!==void 0){const o=s[r];if(!this.Le(this.Fe,o)||!this.Ue(this.Me[i++],o))return!1;++r}for(;r<s.length;++r){const o=s[r];if(i>=this.Me.length||!this.Ue(this.Me[i++],o))return!1}return!0}Be(e){for(const t of this.Oe)if(this.Le(t,e))return!0;return!1}Le(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const s=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===s}Ue(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Og{constructor(){this.qe=new po}addToCollectionParentIndex(e,t){return this.qe.add(t),g.resolve()}getCollectionParents(e,t){return g.resolve(this.qe.getEntries(t))}addFieldIndex(e,t){return g.resolve()}deleteFieldIndex(e,t){return g.resolve()}getDocumentsMatchingTarget(e,t){return g.resolve(null)}getFieldIndex(e,t){return g.resolve(null)}getFieldIndexes(e,t){return g.resolve([])}getNextCollectionGroupToUpdate(e){return g.resolve(null)}updateCollectionGroup(e,t,s){return g.resolve()}updateIndexEntries(e,t){return g.resolve()}}class po{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new P(x.comparator),i=!r.has(s);return this.index[t]=r.add(s),i}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new P(x.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new Uint8Array(0);class Pg{constructor(e,t){this.user=e,this.databaseId=t,this.Ke=new po,this.Ge=new rt(s=>St(s),(s,r)=>cs(s,r)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Ke.has(t)){const s=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.Ke.add(t)});const i={collectionId:s,parent:Ee(r)};return Ha(e).put(i)}return g.resolve()}getCollectionParents(e,t){const s=[],r=IDBKeyRange.bound([t,""],[Mc(t),""],!1,!0);return Ha(e).qt(r).next(i=>{for(const o of i){if(o.collectionId!==t)break;s.push(ke(o.parent))}return s})}addFieldIndex(e,t){const s=Cs(e),r=function(i){return{indexId:i.indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(o=>[o.fieldPath.canonicalString(),o.kind])}}(t);return delete r.indexId,s.add(r).next()}deleteFieldIndex(e,t){const s=Cs(e),r=Ns(e),i=Sn(e);return s.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}getDocumentsMatchingTarget(e,t){const s=Sn(e);let r=!0;const i=new Map;return g.forEach(this.Qe(t),o=>this.getFieldIndex(e,o).next(a=>{r&&(r=!!a),i.set(o,a)})).next(()=>{if(r){let o=M();const a=[];return g.forEach(i,(u,c)=>{var l;w("IndexedDbIndexManager",`Using index ${l=u,`id=${l.indexId}|cg=${l.collectionGroup}|f=${l.fields.map(V=>`${V.fieldPath}:${V.kind}`).join(",")}`} to execute ${St(t)}`);const h=function(V,me){const ie=mi(me);if(ie===void 0)return null;for(const K of Xs(V,ie.fieldPath))switch(K.op){case"array-contains-any":return K.value.arrayValue.values||[];case"array-contains":return[K.value]}return null}(c,u),d=function(V,me){const ie=new Map;for(const K of ct(me))for(const _e of Xs(V,K.fieldPath))switch(_e.op){case"==":case"in":ie.set(K.fieldPath.canonicalString(),_e.value);break;case"not-in":case"!=":return ie.set(K.fieldPath.canonicalString(),_e.value),Array.from(ie.values())}return null}(c,u),p=function(V,me){const ie=[];let K=!0;for(const _e of ct(me)){const ot=_e.kind===0?Sa(V,_e.fieldPath,V.startAt):ba(V,_e.fieldPath,V.startAt);if(!ot.value)return null;ie.push(ot.value),K&&(K=ot.inclusive)}return new Je(ie,K)}(c,u),m=function(V,me){const ie=[];let K=!0;for(const _e of ct(me)){const ot=_e.kind===0?ba(V,_e.fieldPath,V.endAt):Sa(V,_e.fieldPath,V.endAt);if(!ot.value)return null;ie.push(ot.value),K&&(K=ot.inclusive)}return new Je(ie,K)}(c,u),E=this.je(u,c,p),b=this.je(u,c,m),L=this.We(u,c,d),z=this.ze(u.indexId,h,E,!!p&&p.inclusive,b,!!m&&m.inclusive,L);return g.forEach(z,V=>s.Gt(V,t.limit).next(me=>{me.forEach(ie=>{const K=v.fromSegments(ie.documentKey);o.has(K)||(o=o.add(K),a.push(K))})}))}).next(()=>a)}return g.resolve(null)})}Qe(e){let t=this.Ge.get(e);return t||(t=[e],this.Ge.set(e,t),t)}ze(e,t,s,r,i,o,a){const u=(t!=null?t.length:1)*Math.max(s!=null?s.length:1,i!=null?i.length:1),c=u/(t!=null?t.length:1),l=[];for(let h=0;h<u;++h){const d=t?this.He(t[h/c]):Gt,p=s?this.Je(e,d,s[h%c],r):this.Ye(e),m=i?this.Xe(e,d,i[h%c],o):this.Ye(e+1);l.push(...this.createRange(p,m,a.map(E=>this.Je(e,d,E,!0))))}return l}Je(e,t,s,r){const i=new je(e,v.empty(),t,s);return r?i:i.ke()}Xe(e,t,s,r){const i=new je(e,v.empty(),t,s);return r?i.ke():i}Ye(e){return new je(e,v.empty(),Gt,Gt)}getFieldIndex(e,t){const s=new Rg(t),r=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(i=>{const o=i.filter(a=>s.$e(a));return o.sort((a,u)=>u.fields.length-a.fields.length),o.length>0?o[0]:null})}Ze(e,t){const s=new Tn;for(const r of ct(e)){const i=t.data.field(r.fieldPath);if(i==null)return null;const o=s.Ne(r.kind);dt.fe.Zt(i,o)}return s.Se()}He(e){const t=new Tn;return dt.fe.Zt(e,t.Ne(0)),t.Se()}tn(e,t){const s=new Tn;return dt.fe.Zt(Tt(this.databaseId,t),s.Ne(function(r){const i=ct(r);return i.length===0?0:i[i.length-1].kind}(e))),s.Se()}We(e,t,s){if(s===null)return[];let r=[];r.push(new Tn);let i=0;for(const o of ct(e)){const a=s[i++];for(const u of r)if(this.en(t,o.fieldPath)&&zn(a))r=this.nn(r,o,a);else{const c=u.Ne(o.kind);dt.fe.Zt(a,c)}}return this.sn(r)}je(e,t,s){return s==null?null:this.We(e,t,s.position)}sn(e){const t=[];for(let s=0;s<e.length;++s)t[s]=e[s].Se();return t}nn(e,t,s){const r=[...e],i=[];for(const o of s.arrayValue.values||[])for(const a of r){const u=new Tn;u.seed(a.Se()),dt.fe.Zt(o,u.Ne(t.kind)),i.push(u)}return i}en(e,t){return!!e.filters.find(s=>s instanceof ue&&s.field.isEqual(t)&&(s.op==="in"||s.op==="not-in"))}getFieldIndexes(e,t){const s=Cs(e),r=Ns(e);return(t?s.qt("collectionGroupIndex",IDBKeyRange.bound(t,t)):s.qt()).next(i=>{const o=[];return g.forEach(i,a=>r.get([a.indexId,this.uid]).next(u=>{o.push(function(c,l){const h=l?new Ys(l.sequenceNumber,new Be(Nt(l.readTime),new v(ke(l.documentKey)),l.largestBatchId)):Ys.empty(),d=c.fields.map(([p,m])=>new _f(Z.fromServerFormat(p),m));return new qc(c.indexId,c.collectionGroup,d,h)}(a,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((s,r)=>{const i=s.indexState.sequenceNumber-r.indexState.sequenceNumber;return i!==0?i:N(s.collectionGroup,r.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,s){const r=Cs(e),i=Ns(e);return this.rn(e).next(o=>r.qt("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(a=>g.forEach(a,u=>i.put(function(c,l,h,d){return{indexId:c,uid:l.uid||"",sequenceNumber:h,readTime:Ct(d.readTime),documentKey:Ee(d.documentKey.path),largestBatchId:d.largestBatchId}}(u.indexId,this.user,o,s)))))}updateIndexEntries(e,t){const s=new Map;return g.forEach(t,(r,i)=>{const o=s.get(r.collectionGroup);return(o?g.resolve(o):this.getFieldIndexes(e,r.collectionGroup)).next(a=>(s.set(r.collectionGroup,a),g.forEach(a,u=>this.on(e,r,u).next(c=>{const l=this.un(i,u);return c.isEqual(l)?g.resolve():this.an(e,i,u,c,l)}))))})}cn(e,t,s,r){return Sn(e).put({indexId:r.indexId,uid:this.uid,arrayValue:r.arrayValue,directionalValue:r.directionalValue,orderedDocumentKey:this.tn(s,t.key),documentKey:t.key.path.toArray()})}hn(e,t,s,r){return Sn(e).delete([r.indexId,this.uid,r.arrayValue,r.directionalValue,this.tn(s,t.key),t.key.path.toArray()])}on(e,t,s){const r=Sn(e);let i=new P(at);return r.Wt({index:"documentKeyIndex",range:IDBKeyRange.only([s.indexId,this.uid,this.tn(s,t)])},(o,a)=>{i=i.add(new je(s.indexId,t,a.arrayValue,a.directionalValue))}).next(()=>i)}un(e,t){let s=new P(at);const r=this.Ze(t,e);if(r==null)return s;const i=mi(t);if(i!=null){const o=e.data.field(i.fieldPath);if(zn(o))for(const a of o.arrayValue.values||[])s=s.add(new je(t.indexId,e.key,this.He(a),r))}else s=s.add(new je(t.indexId,e.key,Gt,r));return s}an(e,t,s,r,i){w("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const o=[];return function(a,u,c,l,h){const d=a.getIterator(),p=u.getIterator();let m=$t(d),E=$t(p);for(;m||E;){let b=!1,L=!1;if(m&&E){const z=c(m,E);z<0?L=!0:z>0&&(b=!0)}else m!=null?L=!0:b=!0;b?(l(E),E=$t(p)):L?(h(m),m=$t(d)):(m=$t(d),E=$t(p))}}(r,i,at,a=>{o.push(this.cn(e,t,s,a))},a=>{o.push(this.hn(e,t,s,a))}),g.waitFor(o)}rn(e){let t=1;return Ns(e).Wt({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(s,r,i)=>{i.done(),t=r.sequenceNumber+1}).next(()=>t)}createRange(e,t,s){s=s.sort((o,a)=>at(o,a)).filter((o,a,u)=>!a||at(o,u[a-1])!==0);const r=[];r.push(e);for(const o of s){const a=at(o,e),u=at(o,t);if(a===0)r[0]=e.ke();else if(a>0&&u<0)r.push(o),r.push(o.ke());else if(u>0)break}r.push(t);const i=[];for(let o=0;o<r.length;o+=2)i.push(IDBKeyRange.bound([r[o].indexId,this.uid,r[o].arrayValue,r[o].directionalValue,Gt,[]],[r[o+1].indexId,this.uid,r[o+1].arrayValue,r[o+1].directionalValue,Gt,[]]));return i}}function Ha(n){return se(n,"collectionParents")}function Sn(n){return se(n,"indexEntries")}function Cs(n){return se(n,"indexConfiguration")}function Ns(n){return se(n,"indexState")}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ya={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Te{constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}static withCacheSize(e){return new Te(e,Te.DEFAULT_COLLECTION_PERCENTILE,Te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(n,e,t){const s=n.store("mutations"),r=n.store("documentMutations"),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=s.Wt({range:o},(l,h,d)=>(a++,d.delete()));i.push(u.next(()=>{A(a===1)}));const c=[];for(const l of t.mutations){const h=yl(e,l.key.path,t.batchId);i.push(r.delete(h)),c.push(l.key)}return g.waitFor(i).next(()=>c)}function er(n){if(!n)return 0;let e;if(n.document)e=n.document;else if(n.unknownDocument)e=n.unknownDocument;else{if(!n.noDocument)throw T();e=n.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Te.DEFAULT_COLLECTION_PERCENTILE=10,Te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Te.DEFAULT=new Te(41943040,Te.DEFAULT_COLLECTION_PERCENTILE,Te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Te.DISABLED=new Te(-1,0,0);class yo{constructor(e,t,s,r){this.userId=e,this.M=t,this.indexManager=s,this.referenceDelegate=r,this.ln={}}static Yt(e,t,s,r){A(e.uid!=="");const i=e.isAuthenticated()?e.uid:"";return new yo(i,t,s,r)}checkEmpty(e){let t=!0;const s=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Ke(e).Wt({index:"userMutationsIndex",range:s},(r,i,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,s,r){const i=Wt(e),o=Ke(e);return o.add({}).next(a=>{A(typeof a=="number");const u=new lo(a,t,s,r),c=function(d,p,m){const E=m.baseMutations.map(L=>Qn(d.Jt,L)),b=m.mutations.map(L=>Qn(d.Jt,L));return{userId:p,batchId:m.batchId,localWriteTimeMs:m.localWriteTime.toMillis(),baseMutations:E,mutations:b}}(this.M,this.userId,u),l=[];let h=new P((d,p)=>N(d.canonicalString(),p.canonicalString()));for(const d of r){const p=yl(this.userId,d.key.path,a);h=h.add(d.key.path.popLast()),l.push(o.put(c)),l.push(i.put(p,cg))}return h.forEach(d=>{l.push(this.indexManager.addToCollectionParentIndex(e,d))}),e.addOnCommittedListener(()=>{this.ln[a]=u.keys()}),g.waitFor(l).next(()=>u)})}lookupMutationBatch(e,t){return Ke(e).get(t).next(s=>s?(A(s.userId===this.userId),zt(this.M,s)):null)}fn(e,t){return this.ln[t]?g.resolve(this.ln[t]):this.lookupMutationBatch(e,t).next(s=>{if(s){const r=s.keys();return this.ln[t]=r,r}return null})}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=IDBKeyRange.lowerBound([this.userId,s]);let i=null;return Ke(e).Wt({index:"userMutationsIndex",range:r},(o,a,u)=>{a.userId===this.userId&&(A(a.batchId>=s),i=zt(this.M,a)),u.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let s=-1;return Ke(e).Wt({index:"userMutationsIndex",range:t,reverse:!0},(r,i,o)=>{s=i.batchId,o.done()}).next(()=>s)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return Ke(e).qt("userMutationsIndex",t).next(s=>s.map(r=>zt(this.M,r)))}getAllMutationBatchesAffectingDocumentKey(e,t){const s=Os(this.userId,t.path),r=IDBKeyRange.lowerBound(s),i=[];return Wt(e).Wt({range:r},(o,a,u)=>{const[c,l,h]=o,d=ke(l);if(c===this.userId&&t.path.isEqual(d))return Ke(e).get(h).next(p=>{if(!p)throw T();A(p.userId===this.userId),i.push(zt(this.M,p))});u.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new P(N);const r=[];return t.forEach(i=>{const o=Os(this.userId,i.path),a=IDBKeyRange.lowerBound(o),u=Wt(e).Wt({range:a},(c,l,h)=>{const[d,p,m]=c,E=ke(p);d===this.userId&&i.path.isEqual(E)?s=s.add(m):h.done()});r.push(u)}),g.waitFor(r).next(()=>this.dn(e,s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1,i=Os(this.userId,s),o=IDBKeyRange.lowerBound(i);let a=new P(N);return Wt(e).Wt({range:o},(u,c,l)=>{const[h,d,p]=u,m=ke(d);h===this.userId&&s.isPrefixOf(m)?m.length===r&&(a=a.add(p)):l.done()}).next(()=>this.dn(e,a))}dn(e,t){const s=[],r=[];return t.forEach(i=>{r.push(Ke(e).get(i).next(o=>{if(o===null)throw T();A(o.userId===this.userId),s.push(zt(this.M,o))}))}),g.waitFor(r).next(()=>s)}removeMutationBatch(e,t){return Sl(e.Ht,this.userId,t).next(s=>(e.addOnCommittedListener(()=>{this._n(t.batchId)}),g.forEach(s,r=>this.referenceDelegate.markPotentiallyOrphaned(e,r))))}_n(e){delete this.ln[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return g.resolve();const s=IDBKeyRange.lowerBound([this.userId]),r=[];return Wt(e).Wt({range:s},(i,o,a)=>{if(i[0]===this.userId){const u=ke(i[1]);r.push(u)}else a.done()}).next(()=>{A(r.length===0)})})}containsKey(e,t){return bl(e,this.userId,t)}wn(e){return Al(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function bl(n,e,t){const s=Os(e,t.path),r=s[1],i=IDBKeyRange.lowerBound(s);let o=!1;return Wt(n).Wt({range:i,jt:!0},(a,u,c)=>{const[l,h,d]=a;l===e&&h===r&&(o=!0),c.done()}).next(()=>o)}function Ke(n){return se(n,"mutations")}function Wt(n){return se(n,"documentMutations")}function Al(n){return se(n,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e){this.mn=e}next(){return this.mn+=2,this.mn}static gn(){return new Dt(0)}static yn(){return new Dt(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fg{constructor(e,t){this.referenceDelegate=e,this.M=t}allocateTargetId(e){return this.pn(e).next(t=>{const s=new Dt(t.highestTargetId);return t.highestTargetId=s.next(),this.In(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.pn(e).next(t=>S.fromTimestamp(new G(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.pn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,s){return this.pn(e).next(r=>(r.highestListenSequenceNumber=t,s&&(r.lastRemoteSnapshotVersion=s.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.In(e,r)))}addTargetData(e,t){return this.Tn(e,t).next(()=>this.pn(e).next(s=>(s.targetCount+=1,this.En(t,s),this.In(e,s))))}updateTargetData(e,t){return this.Tn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>jt(e).delete(t.targetId)).next(()=>this.pn(e)).next(s=>(A(s.targetCount>0),s.targetCount-=1,this.In(e,s)))}removeTargets(e,t,s){let r=0;const i=[];return jt(e).Wt((o,a)=>{const u=Nn(a);u.sequenceNumber<=t&&s.get(u.targetId)===null&&(r++,i.push(this.removeTargetData(e,u)))}).next(()=>g.waitFor(i)).next(()=>r)}forEachTarget(e,t){return jt(e).Wt((s,r)=>{const i=Nn(r);t(i)})}pn(e){return Qa(e).get("targetGlobalKey").next(t=>(A(t!==null),t))}In(e,t){return Qa(e).put("targetGlobalKey",t)}Tn(e,t){return jt(e).put(Tl(this.M,t))}En(e,t){let s=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,s=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,s=!0),s}getTargetCount(e){return this.pn(e).next(t=>t.targetCount)}getTargetData(e,t){const s=St(t),r=IDBKeyRange.bound([s,Number.NEGATIVE_INFINITY],[s,Number.POSITIVE_INFINITY]);let i=null;return jt(e).Wt({range:r,index:"queryTargetsIndex"},(o,a,u)=>{const c=Nn(a);cs(t,c.target)&&(i=c,u.done())}).next(()=>i)}addMatchingKeys(e,t,s){const r=[],i=ze(e);return t.forEach(o=>{const a=Ee(o.path);r.push(i.put({targetId:s,path:a})),r.push(this.referenceDelegate.addReference(e,s,o))}),g.waitFor(r)}removeMatchingKeys(e,t,s){const r=ze(e);return g.forEach(t,i=>{const o=Ee(i.path);return g.waitFor([r.delete([s,o]),this.referenceDelegate.removeReference(e,s,i)])})}removeMatchingKeysForTargetId(e,t){const s=ze(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return s.delete(r)}getMatchingKeysForTargetId(e,t){const s=IDBKeyRange.bound([t],[t+1],!1,!0),r=ze(e);let i=M();return r.Wt({range:s,jt:!0},(o,a,u)=>{const c=ke(o[1]),l=new v(c);i=i.add(l)}).next(()=>i)}containsKey(e,t){const s=Ee(t.path),r=IDBKeyRange.bound([s],[Mc(s)],!1,!0);let i=0;return ze(e).Wt({index:"documentTargetsIndex",jt:!0,range:r},([o,a],u,c)=>{o!==0&&(i++,c.done())}).next(()=>i>0)}Et(e,t){return jt(e).get(t).next(s=>s?Nn(s):null)}}function jt(n){return se(n,"targets")}function Qa(n){return se(n,"targetGlobal")}function ze(n){return se(n,"targetDocuments")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pt(n){if(n.code!==f.FAILED_PRECONDITION||n.message!==Il)throw n;w("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xa([n,e],[t,s]){const r=N(n,t);return r===0?N(e,s):r}class Vg{constructor(e){this.An=e,this.buffer=new P(Xa),this.Rn=0}Pn(){return++this.Rn}bn(e){const t=[e,this.Pn()];if(this.buffer.size<this.An)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();Xa(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Bg{constructor(e,t){this.garbageCollector=e,this.asyncQueue=t,this.Vn=!1,this.vn=null}start(e){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Sn(e)}stop(){this.vn&&(this.vn.cancel(),this.vn=null)}get started(){return this.vn!==null}Sn(e){const t=this.Vn?3e5:6e4;w("LruGarbageCollector",`Garbage collection scheduled in ${t}ms`),this.vn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.vn=null,this.Vn=!0;try{await e.collectGarbage(this.garbageCollector)}catch(s){Ot(s)?w("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",s):await Pt(s)}await this.Sn(e)})}}class Ug{constructor(e,t){this.Dn=e,this.params=t}calculateTargetCount(e,t){return this.Dn.Cn(e).next(s=>Math.floor(t/100*s))}nthSequenceNumber(e,t){if(t===0)return g.resolve(be.A);const s=new Vg(t);return this.Dn.forEachTarget(e,r=>s.bn(r.sequenceNumber)).next(()=>this.Dn.xn(e,r=>s.bn(r))).next(()=>s.maxValue)}removeTargets(e,t,s){return this.Dn.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Dn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(w("LruGarbageCollector","Garbage collection skipped; disabled"),g.resolve(Ya)):this.getCacheSize(e).next(s=>s<this.params.cacheSizeCollectionThreshold?(w("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ya):this.Nn(e,t))}getCacheSize(e){return this.Dn.getCacheSize(e)}Nn(e,t){let s,r,i,o,a,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(h=>(h>this.params.maximumSequenceNumbersToCollect?(w("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),r=this.params.maximumSequenceNumbersToCollect):r=h,o=Date.now(),this.nthSequenceNumber(e,r))).next(h=>(s=h,a=Date.now(),this.removeTargets(e,s,t))).next(h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,s))).next(h=>(c=Date.now(),di()<=wt.DEBUG&&w("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${r} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),g.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:h})))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qg{constructor(e,t){this.db=e,this.garbageCollector=function(s,r){return new Ug(s,r)}(this,t)}Cn(e){const t=this.kn(e);return this.db.getTargetCache().getTargetCount(e).next(s=>t.next(r=>s+r))}kn(e){let t=0;return this.xn(e,s=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}xn(e,t){return this.Mn(e,(s,r)=>t(r))}addReference(e,t,s){return Ds(e,s)}removeReference(e,t,s){return Ds(e,s)}removeTargets(e,t,s){return this.db.getTargetCache().removeTargets(e,t,s)}markPotentiallyOrphaned(e,t){return Ds(e,t)}On(e,t){return function(s,r){let i=!1;return Al(s).zt(o=>bl(s,o,r).next(a=>(a&&(i=!0),g.resolve(!a)))).next(()=>i)}(e,t)}removeOrphanedDocuments(e,t){const s=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.Mn(e,(o,a)=>{if(a<=t){const u=this.On(e,o).next(c=>{if(!c)return i++,s.getEntry(e,o).next(()=>(s.removeEntry(o,S.min()),ze(e).delete([0,Ee(o.path)])))});r.push(u)}}).next(()=>g.waitFor(r)).next(()=>s.apply(e)).next(()=>i)}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,s)}updateLimboDocument(e,t){return Ds(e,t)}Mn(e,t){const s=ze(e);let r,i=be.A;return s.Wt({index:"documentTargetsIndex"},([o,a],{path:u,sequenceNumber:c})=>{o===0?(i!==be.A&&t(new v(ke(r)),i),i=c,r=u):i=be.A}).next(()=>{i!==be.A&&t(new v(ke(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Ds(n,e){return ze(n).put(function(t,s){return{targetId:0,path:Ee(t.path),sequenceNumber:s}}(e,n.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(){this.changes=new rt(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,O.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?g.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $g{constructor(e){this.M=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,s){return ut(e).put(s)}removeEntry(e,t,s){return ut(e).delete(function(r,i){const o=r.path.toArray();return[o.slice(0,o.length-2),o[o.length-2],Zs(i),o[o.length-1]]}(t,s))}updateMetadata(e,t){return this.getMetadata(e).next(s=>(s.byteSize+=t,this.Fn(e,s)))}getEntry(e,t){let s=O.newInvalidDocument(t);return ut(e).Wt({index:"documentKeyIndex",range:IDBKeyRange.only(bn(t))},(r,i)=>{s=this.$n(t,i)}).next(()=>s)}Bn(e,t){let s={size:0,document:O.newInvalidDocument(t)};return ut(e).Wt({index:"documentKeyIndex",range:IDBKeyRange.only(bn(t))},(r,i)=>{s={document:this.$n(t,i),size:er(i)}}).next(()=>s)}getEntries(e,t){let s=Ce();return this.Ln(e,t,(r,i)=>{const o=this.$n(r,i);s=s.insert(r,o)}).next(()=>s)}Un(e,t){let s=Ce(),r=new j(v.comparator);return this.Ln(e,t,(i,o)=>{const a=this.$n(i,o);s=s.insert(i,a),r=r.insert(i,er(o))}).next(()=>({documents:s,qn:r}))}Ln(e,t,s){if(t.isEmpty())return g.resolve();let r=new P(eu);t.forEach(u=>r=r.add(u));const i=IDBKeyRange.bound(bn(r.first()),bn(r.last())),o=r.getIterator();let a=o.getNext();return ut(e).Wt({index:"documentKeyIndex",range:i},(u,c,l)=>{const h=v.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&eu(a,h)<0;)s(a,null),a=o.getNext();a&&a.isEqual(h)&&(s(a,c),a=o.hasNext()?o.getNext():null),a?l.Ut(bn(a)):l.done()}).next(()=>{for(;a;)s(a,null),a=o.hasNext()?o.getNext():null})}getAllFromCollection(e,t,s){const r=[t.popLast().toArray(),t.lastSegment(),Zs(s.readTime),s.documentKey.path.isEmpty()?"":s.documentKey.path.lastSegment()],i=[t.popLast().toArray(),t.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return ut(e).qt(IDBKeyRange.bound(r,i,!0)).next(o=>{let a=Ce();for(const u of o){const c=this.$n(v.fromSegments(u.prefixPath.concat(u.collectionGroup,u.documentId)),u);a=a.insert(c.key,c)}return a})}getAllFromCollectionGroup(e,t,s,r){let i=Ce();const o=Za(t,s),a=Za(t,Be.max());return ut(e).Wt({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,a,!0)},(u,c,l)=>{const h=this.$n(v.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);i=i.insert(h.key,h),i.size===r&&l.done()}).next(()=>i)}newChangeBuffer(e){return new Kg(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return Ja(e).get("remoteDocumentGlobalKey").next(t=>(A(!!t),t))}Fn(e,t){return Ja(e).put("remoteDocumentGlobalKey",t)}$n(e,t){if(t){const s=Ng(this.M,t);if(!(s.isNoDocument()&&s.version.isEqual(S.min())))return s}return O.newInvalidDocument(e)}}class Kg extends Cl{constructor(e,t){super(),this.Kn=e,this.trackRemovals=t,this.Gn=new rt(s=>s.toString(),(s,r)=>s.isEqual(r))}applyChanges(e){const t=[];let s=0,r=new P((i,o)=>N(i.canonicalString(),o.canonicalString()));return this.changes.forEach((i,o)=>{const a=this.Gn.get(i);if(t.push(this.Kn.removeEntry(e,i,a.readTime)),o.isValidDocument()){const u=$a(this.Kn.M,o);r=r.add(i.path.popLast());const c=er(u);s+=c-a.size,t.push(this.Kn.addEntry(e,i,u))}else if(s-=a.size,this.trackRemovals){const u=$a(this.Kn.M,o.convertToNoDocument(S.min()));t.push(this.Kn.addEntry(e,i,u))}}),r.forEach(i=>{t.push(this.Kn.indexManager.addToCollectionParentIndex(e,i))}),t.push(this.Kn.updateMetadata(e,s)),g.waitFor(t)}getFromCache(e,t){return this.Kn.Bn(e,t).next(s=>(this.Gn.set(t,{size:s.size,readTime:s.document.readTime}),s.document))}getAllFromCache(e,t){return this.Kn.Un(e,t).next(({documents:s,qn:r})=>(r.forEach((i,o)=>{this.Gn.set(i,{size:o,readTime:s.get(i).readTime})}),s))}}function Ja(n){return se(n,"remoteDocumentGlobal")}function ut(n){return se(n,"remoteDocumentsV14")}function bn(n){const e=n.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Za(n,e){const t=e.documentKey.path.toArray();return[n,Zs(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function eu(n,e){const t=n.path.toArray(),s=e.path.toArray();let r=0;for(let i=0;i<t.length-2&&i<s.length-2;++i)if(r=N(t[i],s[i]),r)return r;return r=N(t.length,s.length),r||(r=N(t[t.length-2],s[s.length-2]),r||N(t[t.length-1],s[s.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(e){this.M=e}kt(e,t,s,r){const i=new Ar("createOrUpgrade",t);s<1&&r>=1&&(function(a){a.createObjectStore("owner")}(e),function(a){a.createObjectStore("mutationQueues",{keyPath:"userId"}),a.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Ba,{unique:!0}),a.createObjectStore("documentMutations")}(e),tu(e),function(a){a.createObjectStore("remoteDocuments")}(e));let o=g.resolve();return s<3&&r>=3&&(s!==0&&(function(a){a.deleteObjectStore("targetDocuments"),a.deleteObjectStore("targets"),a.deleteObjectStore("targetGlobal")}(e),tu(e)),o=o.next(()=>function(a){const u=a.store("targetGlobal"),c={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:S.min().toTimestamp(),targetCount:0};return u.put("targetGlobalKey",c)}(i))),s<4&&r>=4&&(s!==0&&(o=o.next(()=>function(a,u){return u.store("mutations").qt().next(c=>{a.deleteObjectStore("mutations"),a.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",Ba,{unique:!0});const l=u.store("mutations"),h=c.map(d=>l.put(d));return g.waitFor(h)})}(e,i))),o=o.next(()=>{(function(a){a.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),s<5&&r>=5&&(o=o.next(()=>this.Qn(i))),s<6&&r>=6&&(o=o.next(()=>(function(a){a.createObjectStore("remoteDocumentGlobal")}(e),this.jn(i)))),s<7&&r>=7&&(o=o.next(()=>this.Wn(i))),s<8&&r>=8&&(o=o.next(()=>this.zn(e,i))),s<9&&r>=9&&(o=o.next(()=>{(function(a){a.objectStoreNames.contains("remoteDocumentChanges")&&a.deleteObjectStore("remoteDocumentChanges")})(e)})),s<10&&r>=10&&(o=o.next(()=>this.Hn(i))),s<11&&r>=11&&(o=o.next(()=>{(function(a){a.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(a){a.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),s<12&&r>=12&&(o=o.next(()=>{(function(a){const u=a.createObjectStore("documentOverlays",{keyPath:Eg});u.createIndex("collectionPathOverlayIndex",_g,{unique:!1}),u.createIndex("collectionGroupOverlayIndex",Tg,{unique:!1})})(e)})),s<13&&r>=13&&(o=o.next(()=>function(a){const u=a.createObjectStore("remoteDocumentsV14",{keyPath:lg});u.createIndex("documentKeyIndex",hg),u.createIndex("collectionGroupIndex",dg)}(e)).next(()=>this.Jn(e,i)).next(()=>e.deleteObjectStore("remoteDocuments"))),s<14&&r>=14&&(o=o.next(()=>{(function(a){a.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),a.createObjectStore("indexState",{keyPath:yg}).createIndex("sequenceNumberIndex",wg,{unique:!1}),a.createObjectStore("indexEntries",{keyPath:vg}).createIndex("documentKeyIndex",Ig,{unique:!1})})(e)})),o}jn(e){let t=0;return e.store("remoteDocuments").Wt((s,r)=>{t+=er(r)}).next(()=>{const s={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",s)})}Qn(e){const t=e.store("mutationQueues"),s=e.store("mutations");return t.qt().next(r=>g.forEach(r,i=>{const o=IDBKeyRange.bound([i.userId,-1],[i.userId,i.lastAcknowledgedBatchId]);return s.qt("userMutationsIndex",o).next(a=>g.forEach(a,u=>{A(u.userId===i.userId);const c=zt(this.M,u);return Sl(e,i.userId,c).next(()=>{})}))}))}Wn(e){const t=e.store("targetDocuments"),s=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(r=>{const i=[];return s.Wt((o,a)=>{const u=new x(o),c=function(l){return[0,Ee(l)]}(u);i.push(t.get(c).next(l=>l?g.resolve():(h=>t.put({targetId:0,path:Ee(h),sequenceNumber:r.highestListenSequenceNumber}))(u)))}).next(()=>g.waitFor(i))})}zn(e,t){e.createObjectStore("collectionParents",{keyPath:pg});const s=t.store("collectionParents"),r=new po,i=o=>{if(r.add(o)){const a=o.lastSegment(),u=o.popLast();return s.put({collectionId:a,parent:Ee(u)})}};return t.store("remoteDocuments").Wt({jt:!0},(o,a)=>{const u=new x(o);return i(u.popLast())}).next(()=>t.store("documentMutations").Wt({jt:!0},([o,a,u],c)=>{const l=ke(a);return i(l.popLast())}))}Hn(e){const t=e.store("targets");return t.Wt((s,r)=>{const i=Nn(r),o=Tl(this.M,i);return t.put(o)})}Jn(e,t){const s=t.store("remoteDocuments"),r=[];return s.Wt((i,o)=>{const a=t.store("remoteDocumentsV14"),u=(c=o,c.document?new v(x.fromString(c.document.name).popFirst(5)):c.noDocument?v.fromSegments(c.noDocument.path):c.unknownDocument?v.fromSegments(c.unknownDocument.path):T()).path.toArray();var c;/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/const l={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};r.push(a.put(l))}).next(()=>g.waitFor(r))}}function tu(n){n.createObjectStore("targetDocuments",{keyPath:gg}).createIndex("documentTargetsIndex",mg,{unique:!0}),n.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",fg,{unique:!0}),n.createObjectStore("targetGlobal")}const Wr="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class wo{constructor(e,t,s,r,i,o,a,u,c,l,h=13){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=s,this.Yn=i,this.window=o,this.document=a,this.Xn=c,this.Zn=l,this.ts=h,this.es=null,this.ns=!1,this.isPrimary=!1,this.networkEnabled=!0,this.ss=null,this.inForeground=!1,this.rs=null,this.os=null,this.us=Number.NEGATIVE_INFINITY,this.cs=d=>Promise.resolve(),!wo.vt())throw new y(f.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new qg(this,r),this.hs=t+"main",this.M=new _l(u),this.ls=new xe(this.hs,this.ts,new Gg(this.M)),this.fs=new Fg(this.referenceDelegate,this.M),this.ds=function(d){return new $g(d)}(this.M),this._s=new Dg,this.window&&this.window.localStorage?this.ws=this.window.localStorage:(this.ws=null,l===!1&&H("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.gs().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new y(f.FAILED_PRECONDITION,Wr);return this.ys(),this.ps(),this.Is(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.fs.getHighestSequenceNumber(e))}).then(e=>{this.es=new be(e,this.Xn)}).then(()=>{this.ns=!0}).catch(e=>(this.ls&&this.ls.close(),Promise.reject(e)))}Ts(e){return this.cs=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.ls.Ot(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Yn.enqueueAndForget(async()=>{this.started&&await this.gs()}))}gs(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>xs(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Es(e).next(t=>{t||(this.isPrimary=!1,this.Yn.enqueueRetryable(()=>this.cs(!1)))})}).next(()=>this.As(e)).next(t=>this.isPrimary&&!t?this.Rs(e).next(()=>!1):!!t&&this.Ps(e).next(()=>!0))).catch(e=>{if(Ot(e))return w("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return w("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Yn.enqueueRetryable(()=>this.cs(e)),this.isPrimary=e})}Es(e){return An(e).get("owner").next(t=>g.resolve(this.bs(t)))}Vs(e){return xs(e).delete(this.clientId)}async vs(){if(this.isPrimary&&!this.Ss(this.us,18e5)){this.us=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const s=se(t,"clientMetadata");return s.qt().next(r=>{const i=this.Ds(r,18e5),o=r.filter(a=>i.indexOf(a)===-1);return g.forEach(o,a=>s.delete(a.clientId)).next(()=>o)})}).catch(()=>[]);if(this.ws)for(const t of e)this.ws.removeItem(this.Cs(t.clientId))}}Is(){this.os=this.Yn.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.gs().then(()=>this.vs()).then(()=>this.Is()))}bs(e){return!!e&&e.ownerId===this.clientId}As(e){return this.Zn?g.resolve(!0):An(e).get("owner").next(t=>{if(t!==null&&this.Ss(t.leaseTimestampMs,5e3)&&!this.xs(t.ownerId)){if(this.bs(t)&&this.networkEnabled)return!0;if(!this.bs(t)){if(!t.allowTabSynchronization)throw new y(f.FAILED_PRECONDITION,Wr);return!1}}return!(!this.networkEnabled||!this.inForeground)||xs(e).qt().next(s=>this.Ds(s,5e3).find(r=>{if(this.clientId!==r.clientId){const i=!this.networkEnabled&&r.networkEnabled,o=!this.inForeground&&r.inForeground,a=this.networkEnabled===r.networkEnabled;if(i||o&&a)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&w("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.ns=!1,this.Ns(),this.os&&(this.os.cancel(),this.os=null),this.ks(),this.Ms(),await this.ls.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const t=new qa(e,be.A);return this.Rs(t).next(()=>this.Vs(t))}),this.ls.close(),this.Os()}Ds(e,t){return e.filter(s=>this.Ss(s.updateTimeMs,t)&&!this.xs(s.clientId))}Fs(){return this.runTransaction("getActiveClients","readonly",e=>xs(e).qt().next(t=>this.Ds(t,18e5).map(s=>s.clientId)))}get started(){return this.ns}getMutationQueue(e,t){return yo.Yt(e,this.M,t,this.referenceDelegate)}getTargetCache(){return this.fs}getRemoteDocumentCache(){return this.ds}getIndexManager(e){return new Pg(e,this.M.Jt.databaseId)}getDocumentOverlayCache(e){return mo.Yt(this.M,e)}getBundleCache(){return this._s}runTransaction(e,t,s){w("IndexedDbPersistence","Starting transaction:",e);const r=t==="readonly"?"readonly":"readwrite",i=(o=this.ts)===14?bg:o===13?vl:o===12?Sg:o===11?wl:void T();var o;let a;return this.ls.runTransaction(e,r,i,u=>(a=new qa(u,this.es?this.es.next():be.A),t==="readwrite-primary"?this.Es(a).next(c=>!!c||this.As(a)).next(c=>{if(!c)throw H(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Yn.enqueueRetryable(()=>this.cs(!1)),new y(f.FAILED_PRECONDITION,Il);return s(a)}).next(c=>this.Ps(a).next(()=>c)):this.$s(a).next(()=>s(a)))).then(u=>(a.raiseOnCommittedEvent(),u))}$s(e){return An(e).get("owner").next(t=>{if(t!==null&&this.Ss(t.leaseTimestampMs,5e3)&&!this.xs(t.ownerId)&&!this.bs(t)&&!(this.Zn||this.allowTabSynchronization&&t.allowTabSynchronization))throw new y(f.FAILED_PRECONDITION,Wr)})}Ps(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return An(e).put("owner",t)}static vt(){return xe.vt()}Rs(e){const t=An(e);return t.get("owner").next(s=>this.bs(s)?(w("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):g.resolve())}Ss(e,t){const s=Date.now();return!(e<s-t)&&(!(e>s)||(H(`Detected an update time that is in the future: ${e} > ${s}`),!1))}ys(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.rs=()=>{this.Yn.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.gs()))},this.document.addEventListener("visibilitychange",this.rs),this.inForeground=this.document.visibilityState==="visible")}ks(){this.rs&&(this.document.removeEventListener("visibilitychange",this.rs),this.rs=null)}ps(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.ss=()=>{this.Ns(),Vh()&&navigator.appVersion.match(/Version\/1[45]/)&&this.Yn.enterRestrictedMode(!0),this.Yn.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.ss))}Ms(){this.ss&&(this.window.removeEventListener("pagehide",this.ss),this.ss=null)}xs(e){var t;try{const s=((t=this.ws)===null||t===void 0?void 0:t.getItem(this.Cs(e)))!==null;return w("IndexedDbPersistence",`Client '${e}' ${s?"is":"is not"} zombied in LocalStorage`),s}catch(s){return H("IndexedDbPersistence","Failed to get zombied client id.",s),!1}}Ns(){if(this.ws)try{this.ws.setItem(this.Cs(this.clientId),String(Date.now()))}catch(e){H("Failed to set zombie client id.",e)}}Os(){if(this.ws)try{this.ws.removeItem(this.Cs(this.clientId))}catch{}}Cs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function An(n){return se(n,"owner")}function xs(n){return se(n,"clientMetadata")}function vo(n,e){let t=n.projectId;return n.isDefaultDatabase||(t+="."+n.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jg{constructor(e,t,s){this.ds=e,this.Bs=t,this.indexManager=s}Ls(e,t){return this.Bs.getAllMutationBatchesAffectingDocumentKey(e,t).next(s=>this.Us(e,t,s))}Us(e,t,s){return this.ds.getEntry(e,t).next(r=>{for(const i of s)i.applyToLocalView(r);return r})}qs(e,t){e.forEach((s,r)=>{for(const i of t)i.applyToLocalView(r)})}Ks(e,t){return this.ds.getEntries(e,t).next(s=>this.Gs(e,s).next(()=>s))}Gs(e,t){return this.Bs.getAllMutationBatchesAffectingDocumentKeys(e,t).next(s=>this.qs(t,s))}Qs(e,t,s){return function(r){return v.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}(t)?this.js(e,t.path):io(t)?this.Ws(e,t,s):this.zs(e,t,s)}js(e,t){return this.Ls(e,new v(t)).next(s=>{let r=wi();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}Ws(e,t,s){const r=t.collectionGroup;let i=wi();return this.indexManager.getCollectionParents(e,r).next(o=>g.forEach(o,a=>{const u=function(c,l){return new qe(l,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt)}(t,a.child(r));return this.zs(e,u,s).next(c=>{c.forEach((l,h)=>{i=i.insert(l,h)})})}).next(()=>i))}zs(e,t,s){let r;return this.ds.getAllFromCollection(e,t.path,s).next(i=>(r=i,this.Bs.getAllMutationBatchesAffectingQuery(e,t))).next(i=>{for(const o of i)for(const a of o.mutations){const u=a.key;let c=r.get(u);c==null&&(c=O.newInvalidDocument(u),r=r.insert(u,c)),yi(a,c,o.localWriteTime),c.isFoundDocument()||(r=r.remove(u))}}).next(()=>(r.forEach((i,o)=>{oo(t,o)||(r=r.remove(i))}),r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.Hs=s,this.Js=r}static Ys(e,t){let s=M(),r=M();for(const i of t.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Io(e,t.fromCache,s,r)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{Xs(e){this.Zs=e}Qs(e,t,s,r){return function(i){return i.filters.length===0&&i.limit===null&&i.startAt==null&&i.endAt==null&&(i.explicitOrderBy.length===0||i.explicitOrderBy.length===1&&i.explicitOrderBy[0].field.isKeyField())}(t)||s.isEqual(S.min())?this.ti(e,t):this.Zs.Ks(e,r).next(i=>{const o=this.ei(t,i);return(Ls(t)||Js(t))&&this.ni(t.limitType,o,r,s)?this.ti(e,t):(di()<=wt.DEBUG&&w("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),pi(t)),this.Zs.Qs(e,t,$c(s,-1)).next(a=>(o.forEach(u=>{a=a.insert(u.key,u)}),a)))})}ei(e,t){let s=new P(Hc(e));return t.forEach((r,i)=>{oo(e,i)&&(s=s.add(i))}),s}ni(e,t,s,r){if(s.size!==t.size)return!0;const i=e==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ti(e,t){return di()<=wt.DEBUG&&w("QueryEngine","Using full collection scan to execute query:",pi(t)),this.Zs.Qs(e,t,Be.min())}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zg{constructor(e,t,s,r){this.persistence=e,this.si=t,this.M=r,this.ii=new j(N),this.ri=new rt(i=>St(i),cs),this.oi=new Map,this.ui=e.getRemoteDocumentCache(),this.fs=e.getTargetCache(),this._s=e.getBundleCache(),this.ai(s)}ai(e){this.indexManager=this.persistence.getIndexManager(e),this.Bs=this.persistence.getMutationQueue(e,this.indexManager),this.ci=new jg(this.ui,this.Bs,this.indexManager),this.ui.setIndexManager(this.indexManager),this.si.Xs(this.ci)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.ii))}}function Dl(n,e,t,s){return new zg(n,e,t,s)}async function xl(n,e){const t=I(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let r;return t.Bs.getAllMutationBatches(s).next(i=>(r=i,t.ai(e),t.Bs.getAllMutationBatches(s))).next(i=>{const o=[],a=[];let u=M();for(const c of r){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.ci.Ks(s,u).next(c=>({hi:c,removedBatchIds:o,addedBatchIds:a}))})})}function Wg(n,e){const t=I(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=t.ui.newChangeBuffer({trackRemovals:!0});return function(o,a,u,c){const l=u.batch,h=l.keys();let d=g.resolve();return h.forEach(p=>{d=d.next(()=>c.getEntry(a,p)).next(m=>{const E=u.docVersions.get(p);A(E!==null),m.version.compareTo(E)<0&&(l.applyToRemoteDocument(m,u),m.isValidDocument()&&(m.setReadTime(u.commitVersion),c.addEntry(m)))})}),d.next(()=>o.Bs.removeMutationBatch(a,l))}(t,s,e,i).next(()=>i.apply(s)).next(()=>t.Bs.performConsistencyCheck(s)).next(()=>t.ci.Ks(s,r))})}function kl(n){const e=I(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.fs.getLastRemoteSnapshotVersion(t))}function Hg(n,e){const t=I(n),s=e.snapshotVersion;let r=t.ii;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=t.ui.newChangeBuffer({trackRemovals:!0});r=t.ii;const a=[];e.targetChanges.forEach((c,l)=>{const h=r.get(l);if(!h)return;a.push(t.fs.removeMatchingKeys(i,c.removedDocuments,l).next(()=>t.fs.addMatchingKeys(i,c.addedDocuments,l)));let d=h.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.has(l)?d=d.withResumeToken(X.EMPTY_BYTE_STRING,S.min()).withLastLimboFreeSnapshotVersion(S.min()):c.resumeToken.approximateByteSize()>0&&(d=d.withResumeToken(c.resumeToken,s)),r=r.insert(l,d),function(p,m,E){return p.resumeToken.approximateByteSize()===0||m.snapshotVersion.toMicroseconds()-p.snapshotVersion.toMicroseconds()>=3e8?!0:E.addedDocuments.size+E.modifiedDocuments.size+E.removedDocuments.size>0}(h,d,c)&&a.push(t.fs.updateTargetData(i,d))});let u=Ce();if(e.documentUpdates.forEach(c=>{e.resolvedLimboDocuments.has(c)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,c))}),a.push(Ll(i,o,e.documentUpdates).next(c=>{u=c})),!s.isEqual(S.min())){const c=t.fs.getLastRemoteSnapshotVersion(i).next(l=>t.fs.setTargetsMetadata(i,i.currentSequenceNumber,s));a.push(c)}return g.waitFor(a).next(()=>o.apply(i)).next(()=>t.ci.Gs(i,u)).next(()=>u)}).then(i=>(t.ii=r,i))}function Ll(n,e,t){let s=M();return t.forEach(r=>s=s.add(r)),e.getEntries(n,s).next(r=>{let i=Ce();return t.forEach((o,a)=>{const u=r.get(o);a.isNoDocument()&&a.version.isEqual(S.min())?(e.removeEntry(o,a.readTime),i=i.insert(o,a)):!u.isValidDocument()||a.version.compareTo(u.version)>0||a.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(a),i=i.insert(o,a)):w("LocalStore","Ignoring outdated watch update for ",o,". Current version:",u.version," Watch version:",a.version)}),i})}function Yg(n,e){const t=I(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.Bs.getNextMutationBatchAfterBatchId(s,e)))}function on(n,e){const t=I(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return t.fs.getTargetData(s,e).next(i=>i?(r=i,g.resolve(r)):t.fs.allocateTargetId(s).next(o=>(r=new He(e,o,0,s.currentSequenceNumber),t.fs.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=t.ii.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.ii=t.ii.insert(s.targetId,s),t.ri.set(e,s.targetId)),s})}async function an(n,e,t){const s=I(n),r=s.ii.get(e),i=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",i,o=>s.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!Ot(o))throw o;w("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}s.ii=s.ii.remove(e),s.ri.delete(r.target)}function tr(n,e,t){const s=I(n);let r=S.min(),i=M();return s.persistence.runTransaction("Execute query","readonly",o=>function(a,u,c){const l=I(a),h=l.ri.get(c);return h!==void 0?g.resolve(l.ii.get(h)):l.fs.getTargetData(u,c)}(s,o,De(e)).next(a=>{if(a)return r=a.lastLimboFreeSnapshotVersion,s.fs.getMatchingKeysForTargetId(o,a.targetId).next(u=>{i=u})}).next(()=>s.si.Qs(o,e,t?r:S.min(),t?i:M())).next(a=>(Ol(s,Wc(e),a),{documents:a,li:i})))}function Ml(n,e){const t=I(n),s=I(t.fs),r=t.ii.get(e);return r?Promise.resolve(r.target):t.persistence.runTransaction("Get target data","readonly",i=>s.Et(i,e).next(o=>o?o.target:null))}function Rl(n,e){const t=I(n),s=t.oi.get(e)||S.min();return t.persistence.runTransaction("Get new document changes","readonly",r=>t.ui.getAllFromCollectionGroup(r,e,$c(s,-1),Number.MAX_SAFE_INTEGER)).then(r=>(Ol(t,e,r),r))}function Ol(n,e,t){let s=S.min();t.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),n.oi.set(e,s)}async function Qg(n,e,t,s){const r=I(n);let i=M(),o=Ce();for(const c of t){const l=e.fi(c.metadata.name);c.document&&(i=i.add(l));const h=e.di(c);h.setReadTime(e._i(c.metadata.readTime)),o=o.insert(l,h)}const a=r.ui.newChangeBuffer({trackRemovals:!0}),u=await on(r,function(c){return De(pn(x.fromString(`__bundle__/docs/${c}`)))}(s));return r.persistence.runTransaction("Apply bundle documents","readwrite",c=>Ll(c,a,o).next(l=>(a.apply(c),l)).next(l=>r.fs.removeMatchingKeysForTargetId(c,u.targetId).next(()=>r.fs.addMatchingKeys(c,i,u.targetId)).next(()=>r.ci.Gs(c,l)).next(()=>l)))}async function Xg(n,e,t=M()){const s=await on(n,De(go(e.bundledQuery))),r=I(n);return r.persistence.runTransaction("Save named query","readwrite",i=>{const o=te(e.readTime);if(s.snapshotVersion.compareTo(o)>=0)return r._s.saveNamedQuery(i,e);const a=s.withResumeToken(X.EMPTY_BYTE_STRING,o);return r.ii=r.ii.insert(a.targetId,a),r.fs.updateTargetData(i,a).next(()=>r.fs.removeMatchingKeysForTargetId(i,s.targetId)).next(()=>r.fs.addMatchingKeys(i,t,s.targetId)).next(()=>r._s.saveNamedQuery(i,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(e){this.M=e,this.wi=new Map,this.mi=new Map}getBundleMetadata(e,t){return g.resolve(this.wi.get(t))}saveBundleMetadata(e,t){var s;return this.wi.set(t.id,{id:(s=t).id,version:s.version,createTime:te(s.createTime)}),g.resolve()}getNamedQuery(e,t){return g.resolve(this.mi.get(t))}saveNamedQuery(e,t){return this.mi.set(t.name,function(s){return{name:s.name,query:go(s.bundledQuery),readTime:te(s.readTime)}}(t)),g.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zg{constructor(){this.overlays=new j(v.comparator),this.gi=new Map}getOverlay(e,t){return g.resolve(this.overlays.get(t))}saveOverlays(e,t,s){return s.forEach((r,i)=>{this.Xt(e,t,i)}),g.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.gi.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.gi.delete(s)),g.resolve()}getOverlaysForCollection(e,t,s){const r=Ln(),i=t.length+1,o=new v(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>s&&r.set(u.getKey(),u)}return g.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let i=new j((c,l)=>c-l);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>s){let l=i.get(c.largestBatchId);l===null&&(l=Ln(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=Ln(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,l)=>a.set(c,l)),!(a.size()>=r)););return g.resolve(a)}Xt(e,t,s){if(s===null)return;const r=this.overlays.get(s.key);if(r!==null){const o=this.gi.get(r.largestBatchId).delete(s.key);this.gi.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new fo(t,s));let i=this.gi.get(t);i===void 0&&(i=M(),this.gi.set(t,i)),this.gi.set(t,i.add(s.key))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eo{constructor(){this.yi=new P(J.pi),this.Ii=new P(J.Ti)}isEmpty(){return this.yi.isEmpty()}addReference(e,t){const s=new J(e,t);this.yi=this.yi.add(s),this.Ii=this.Ii.add(s)}Ei(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Ai(new J(e,t))}Ri(e,t){e.forEach(s=>this.removeReference(s,t))}Pi(e){const t=new v(new x([])),s=new J(t,e),r=new J(t,e+1),i=[];return this.Ii.forEachInRange([s,r],o=>{this.Ai(o),i.push(o.key)}),i}bi(){this.yi.forEach(e=>this.Ai(e))}Ai(e){this.yi=this.yi.delete(e),this.Ii=this.Ii.delete(e)}Vi(e){const t=new v(new x([])),s=new J(t,e),r=new J(t,e+1);let i=M();return this.Ii.forEachInRange([s,r],o=>{i=i.add(o.key)}),i}containsKey(e){const t=new J(e,0),s=this.yi.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class J{constructor(e,t){this.key=e,this.vi=t}static pi(e,t){return v.comparator(e.key,t.key)||N(e.vi,t.vi)}static Ti(e,t){return N(e.vi,t.vi)||v.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.Bs=[],this.Si=1,this.Di=new P(J.pi)}checkEmpty(e){return g.resolve(this.Bs.length===0)}addMutationBatch(e,t,s,r){const i=this.Si;this.Si++,this.Bs.length>0&&this.Bs[this.Bs.length-1];const o=new lo(i,t,s,r);this.Bs.push(o);for(const a of r)this.Di=this.Di.add(new J(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return g.resolve(o)}lookupMutationBatch(e,t){return g.resolve(this.Ci(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.xi(s),i=r<0?0:r;return g.resolve(this.Bs.length>i?this.Bs[i]:null)}getHighestUnacknowledgedBatchId(){return g.resolve(this.Bs.length===0?-1:this.Si-1)}getAllMutationBatches(e){return g.resolve(this.Bs.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new J(t,0),r=new J(t,Number.POSITIVE_INFINITY),i=[];return this.Di.forEachInRange([s,r],o=>{const a=this.Ci(o.vi);i.push(a)}),g.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new P(N);return t.forEach(r=>{const i=new J(r,0),o=new J(r,Number.POSITIVE_INFINITY);this.Di.forEachInRange([i,o],a=>{s=s.add(a.vi)})}),g.resolve(this.Ni(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let i=s;v.isDocumentKey(i)||(i=i.child(""));const o=new J(new v(i),0);let a=new P(N);return this.Di.forEachWhile(u=>{const c=u.key.path;return!!s.isPrefixOf(c)&&(c.length===r&&(a=a.add(u.vi)),!0)},o),g.resolve(this.Ni(a))}Ni(e){const t=[];return e.forEach(s=>{const r=this.Ci(s);r!==null&&t.push(r)}),t}removeMutationBatch(e,t){A(this.ki(t.batchId,"removed")===0),this.Bs.shift();let s=this.Di;return g.forEach(t.mutations,r=>{const i=new J(r.key,t.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Di=s})}_n(e){}containsKey(e,t){const s=new J(t,0),r=this.Di.firstAfterOrEqual(s);return g.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.Bs.length,g.resolve()}ki(e,t){return this.xi(e)}xi(e){return this.Bs.length===0?0:e-this.Bs[0].batchId}Ci(e){const t=this.xi(e);return t<0||t>=this.Bs.length?null:this.Bs[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(e){this.Mi=e,this.docs=new j(v.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),i=r?r.size:0,o=this.Mi(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return g.resolve(s?s.document.mutableCopy():O.newInvalidDocument(t))}getEntries(e,t){let s=Ce();return t.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():O.newInvalidDocument(r))}),g.resolve(s)}getAllFromCollection(e,t,s){let r=Ce();const i=new v(t.child("")),o=this.docs.getIteratorFrom(i);for(;o.hasNext();){const{key:a,value:{document:u}}=o.getNext();if(!t.isPrefixOf(a.path))break;a.path.length>t.length+1||Sf(Tf(u),s)<=0||(r=r.insert(u.key,u.mutableCopy()))}return g.resolve(r)}getAllFromCollectionGroup(e,t,s,r){T()}Oi(e,t){return g.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new nm(this)}getSize(e){return g.resolve(this.size)}}class nm extends Cl{constructor(e){super(),this.Kn=e}applyChanges(e){const t=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?t.push(this.Kn.addEntry(e,r)):this.Kn.removeEntry(s)}),g.waitFor(t)}getFromCache(e,t){return this.Kn.getEntry(e,t)}getAllFromCache(e,t){return this.Kn.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(e){this.persistence=e,this.Fi=new rt(t=>St(t),cs),this.lastRemoteSnapshotVersion=S.min(),this.highestTargetId=0,this.$i=0,this.Bi=new Eo,this.targetCount=0,this.Li=Dt.gn()}forEachTarget(e,t){return this.Fi.forEach((s,r)=>t(r)),g.resolve()}getLastRemoteSnapshotVersion(e){return g.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return g.resolve(this.$i)}allocateTargetId(e){return this.highestTargetId=this.Li.next(),g.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.$i&&(this.$i=t),g.resolve()}Tn(e){this.Fi.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Li=new Dt(t),this.highestTargetId=t),e.sequenceNumber>this.$i&&(this.$i=e.sequenceNumber)}addTargetData(e,t){return this.Tn(t),this.targetCount+=1,g.resolve()}updateTargetData(e,t){return this.Tn(t),g.resolve()}removeTargetData(e,t){return this.Fi.delete(t.target),this.Bi.Pi(t.targetId),this.targetCount-=1,g.resolve()}removeTargets(e,t,s){let r=0;const i=[];return this.Fi.forEach((o,a)=>{a.sequenceNumber<=t&&s.get(a.targetId)===null&&(this.Fi.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),g.waitFor(i).next(()=>r)}getTargetCount(e){return g.resolve(this.targetCount)}getTargetData(e,t){const s=this.Fi.get(t)||null;return g.resolve(s)}addMatchingKeys(e,t,s){return this.Bi.Ei(t,s),g.resolve()}removeMatchingKeys(e,t,s){this.Bi.Ri(t,s);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(o=>{i.push(r.markPotentiallyOrphaned(e,o))}),g.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Bi.Pi(t),g.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Bi.Vi(t);return g.resolve(s)}containsKey(e,t){return g.resolve(this.Bi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm{constructor(e,t){this.Ui={},this.overlays={},this.es=new be(0),this.ns=!1,this.ns=!0,this.referenceDelegate=e(this),this.fs=new sm(this),this.indexManager=new Og,this.ds=function(s){return new tm(s)}(s=>this.referenceDelegate.qi(s)),this.M=new _l(t),this._s=new Jg(this.M)}start(){return Promise.resolve()}shutdown(){return this.ns=!1,Promise.resolve()}get started(){return this.ns}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Zg,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.Ui[e.toKey()];return s||(s=new em(t,this.referenceDelegate),this.Ui[e.toKey()]=s),s}getTargetCache(){return this.fs}getRemoteDocumentCache(){return this.ds}getBundleCache(){return this._s}runTransaction(e,t,s){w("MemoryPersistence","Starting transaction:",e);const r=new im(this.es.next());return this.referenceDelegate.Ki(),s(r).next(i=>this.referenceDelegate.Gi(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Qi(e,t){return g.or(Object.values(this.Ui).map(s=>()=>s.containsKey(e,t)))}}class im extends El{constructor(e){super(),this.currentSequenceNumber=e}}class _o{constructor(e){this.persistence=e,this.ji=new Eo,this.Wi=null}static zi(e){return new _o(e)}get Hi(){if(this.Wi)return this.Wi;throw T()}addReference(e,t,s){return this.ji.addReference(s,t),this.Hi.delete(s.toString()),g.resolve()}removeReference(e,t,s){return this.ji.removeReference(s,t),this.Hi.add(s.toString()),g.resolve()}markPotentiallyOrphaned(e,t){return this.Hi.add(t.toString()),g.resolve()}removeTarget(e,t){this.ji.Pi(t.targetId).forEach(r=>this.Hi.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(r=>{r.forEach(i=>this.Hi.add(i.toString()))}).next(()=>s.removeTargetData(e,t))}Ki(){this.Wi=new Set}Gi(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return g.forEach(this.Hi,s=>{const r=v.fromPath(s);return this.Ji(e,r).next(i=>{i||t.removeEntry(r,S.min())})}).next(()=>(this.Wi=null,t.apply(e)))}updateLimboDocument(e,t){return this.Ji(e,t).next(s=>{s?this.Hi.delete(t.toString()):this.Hi.add(t.toString())})}qi(e){return 0}Ji(e,t){return g.or([()=>g.resolve(this.ji.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Qi(e,t)])}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nu(n,e){return`firestore_clients_${n}_${e}`}function su(n,e,t){let s=`firestore_mutations_${n}_${t}`;return e.isAuthenticated()&&(s+=`_${e.uid}`),s}function Hr(n,e){return`firestore_targets_${n}_${e}`}class nr{constructor(e,t,s,r){this.user=e,this.batchId=t,this.state=s,this.error=r}static Yi(e,t,s){const r=JSON.parse(s);let i,o=typeof r=="object"&&["pending","acknowledged","rejected"].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error=="object");return o&&r.error&&(o=typeof r.error.message=="string"&&typeof r.error.code=="string",o&&(i=new y(r.error.code,r.error.message))),o?new nr(e,t,r.state,i):(H("SharedClientState",`Failed to parse mutation state for ID '${t}': ${s}`),null)}Xi(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Rn{constructor(e,t,s){this.targetId=e,this.state=t,this.error=s}static Yi(e,t){const s=JSON.parse(t);let r,i=typeof s=="object"&&["not-current","current","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return i&&s.error&&(i=typeof s.error.message=="string"&&typeof s.error.code=="string",i&&(r=new y(s.error.code,s.error.message))),i?new Rn(e,s.state,r):(H("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}Xi(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class sr{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Yi(e,t){const s=JSON.parse(t);let r=typeof s=="object"&&s.activeTargetIds instanceof Array,i=br();for(let o=0;r&&o<s.activeTargetIds.length;++o)r=Pc(s.activeTargetIds[o]),i=i.add(s.activeTargetIds[o]);return r?new sr(e,i):(H("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class To{constructor(e,t){this.clientId=e,this.onlineState=t}static Yi(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new To(t.clientId,t.onlineState):(H("SharedClientState",`Failed to parse online state: ${e}`),null)}}class Ei{constructor(){this.activeTargetIds=br()}Zi(e){this.activeTargetIds=this.activeTargetIds.add(e)}tr(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Xi(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Yr{constructor(e,t,s,r,i){this.window=e,this.Yn=t,this.persistenceKey=s,this.er=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.nr=this.sr.bind(this),this.ir=new j(N),this.started=!1,this.rr=[];const o=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.ur=nu(this.persistenceKey,this.er),this.ar=function(a){return`firestore_sequence_number_${a}`}(this.persistenceKey),this.ir=this.ir.insert(this.er,new Ei),this.cr=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.hr=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.lr=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.dr=function(a){return`firestore_online_state_${a}`}(this.persistenceKey),this._r=function(a){return`firestore_bundle_loaded_v2_${a}`}(this.persistenceKey),this.window.addEventListener("storage",this.nr)}static vt(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Fs();for(const s of e){if(s===this.er)continue;const r=this.getItem(nu(this.persistenceKey,s));if(r){const i=sr.Yi(s,r);i&&(this.ir=this.ir.insert(i.clientId,i))}}this.wr();const t=this.storage.getItem(this.dr);if(t){const s=this.mr(t);s&&this.gr(s)}for(const s of this.rr)this.sr(s);this.rr=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.ar,JSON.stringify(e))}getAllActiveQueryTargets(){return this.yr(this.ir)}isActiveQueryTarget(e){let t=!1;return this.ir.forEach((s,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.pr(e,"pending")}updateMutationState(e,t,s){this.pr(e,t,s),this.Ir(e)}addLocalQueryTarget(e){let t="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(Hr(this.persistenceKey,e));if(s){const r=Rn.Yi(e,s);r&&(t=r.state)}}return this.Tr.Zi(e),this.wr(),t}removeLocalQueryTarget(e){this.Tr.tr(e),this.wr()}isLocalQueryTarget(e){return this.Tr.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Hr(this.persistenceKey,e))}updateQueryState(e,t,s){this.Er(e,t,s)}handleUserChange(e,t,s){t.forEach(r=>{this.Ir(r)}),this.currentUser=e,s.forEach(r=>{this.addPendingMutation(r)})}setOnlineState(e){this.Ar(e)}notifyBundleLoaded(e){this.Rr(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.nr),this.removeItem(this.ur),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return w("SharedClientState","READ",e,t),t}setItem(e,t){w("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){w("SharedClientState","REMOVE",e),this.storage.removeItem(e)}sr(e){const t=e;if(t.storageArea===this.storage){if(w("SharedClientState","EVENT",t.key,t.newValue),t.key===this.ur)return void H("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Yn.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.cr.test(t.key)){if(t.newValue==null){const s=this.Pr(t.key);return this.br(s,null)}{const s=this.Vr(t.key,t.newValue);if(s)return this.br(s.clientId,s)}}else if(this.hr.test(t.key)){if(t.newValue!==null){const s=this.vr(t.key,t.newValue);if(s)return this.Sr(s)}}else if(this.lr.test(t.key)){if(t.newValue!==null){const s=this.Dr(t.key,t.newValue);if(s)return this.Cr(s)}}else if(t.key===this.dr){if(t.newValue!==null){const s=this.mr(t.newValue);if(s)return this.gr(s)}}else if(t.key===this.ar){const s=function(r){let i=be.A;if(r!=null)try{const o=JSON.parse(r);A(typeof o=="number"),i=o}catch(o){H("SharedClientState","Failed to read sequence number from WebStorage",o)}return i}(t.newValue);s!==be.A&&this.sequenceNumberHandler(s)}else if(t.key===this._r){const s=this.Nr(t.newValue);await Promise.all(s.map(r=>this.syncEngine.kr(r)))}}}else this.rr.push(t)})}}get Tr(){return this.ir.get(this.er)}wr(){this.setItem(this.ur,this.Tr.Xi())}pr(e,t,s){const r=new nr(this.currentUser,e,t,s),i=su(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Xi())}Ir(e){const t=su(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Ar(e){const t={clientId:this.er,onlineState:e};this.storage.setItem(this.dr,JSON.stringify(t))}Er(e,t,s){const r=Hr(this.persistenceKey,e),i=new Rn(e,t,s);this.setItem(r,i.Xi())}Rr(e){const t=JSON.stringify(Array.from(e));this.setItem(this._r,t)}Pr(e){const t=this.cr.exec(e);return t?t[1]:null}Vr(e,t){const s=this.Pr(e);return sr.Yi(s,t)}vr(e,t){const s=this.hr.exec(e),r=Number(s[1]),i=s[2]!==void 0?s[2]:null;return nr.Yi(new oe(i),r,t)}Dr(e,t){const s=this.lr.exec(e),r=Number(s[1]);return Rn.Yi(r,t)}mr(e){return To.Yi(e)}Nr(e){return JSON.parse(e)}async Sr(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Mr(e.batchId,e.state,e.error);w("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Cr(e){return this.syncEngine.Or(e.targetId,e.state,e.error)}br(e,t){const s=t?this.ir.insert(e,t):this.ir.remove(e),r=this.yr(this.ir),i=this.yr(s),o=[],a=[];return i.forEach(u=>{r.has(u)||o.push(u)}),r.forEach(u=>{i.has(u)||a.push(u)}),this.syncEngine.Fr(o,a).then(()=>{this.ir=s})}gr(e){this.ir.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}yr(e){let t=br();return e.forEach((s,r)=>{t=t.unionWith(r.activeTargetIds)}),t}}class Pl{constructor(){this.$r=new Ei,this.Br={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e){return this.$r.Zi(e),this.Br[e]||"not-current"}updateQueryState(e,t,s){this.Br[e]=t}removeLocalQueryTarget(e){this.$r.tr(e)}isLocalQueryTarget(e){return this.$r.activeTargetIds.has(e)}clearQueryState(e){delete this.Br[e]}getAllActiveQueryTargets(){return this.$r.activeTargetIds}isActiveQueryTarget(e){return this.$r.activeTargetIds.has(e)}start(){return this.$r=new Ei,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{Lr(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(){this.Ur=()=>this.qr(),this.Kr=()=>this.Gr(),this.Qr=[],this.jr()}Lr(e){this.Qr.push(e)}shutdown(){window.removeEventListener("online",this.Ur),window.removeEventListener("offline",this.Kr)}jr(){window.addEventListener("online",this.Ur),window.addEventListener("offline",this.Kr)}qr(){w("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.Qr)e(0)}Gr(){w("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.Qr)e(1)}static vt(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const am={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e){this.Wr=e.Wr,this.zr=e.zr}Hr(e){this.Jr=e}Yr(e){this.Xr=e}onMessage(e){this.Zr=e}close(){this.zr()}send(e){this.Wr(e)}eo(){this.Jr()}no(e){this.Xr(e)}so(e){this.Zr(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http";this.io=t+"://"+e.host,this.ro="projects/"+this.databaseId.projectId+"/databases/"+this.databaseId.database+"/documents"}oo(e,t,s,r,i){const o=this.uo(e,t);w("RestConnection","Sending: ",o,s);const a={};return this.ao(a,r,i),this.co(e,o,a,s).then(u=>(w("RestConnection","Received: ",u),u),u=>{throw qn("RestConnection",`${e} failed with error: `,u,"url: ",o,"request:",s),u})}ho(e,t,s,r,i){return this.oo(e,t,s,r,i)}ao(e,t,s){e["X-Goog-Api-Client"]="gl-js/ fire/"+mn,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((r,i)=>e[i]=r),s&&s.headers.forEach((r,i)=>e[i]=r)}uo(e,t){const s=am[e];return`${this.io}/v1/${t}:${s}`}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams}co(e,t,s,r){return new Promise((i,o)=>{const a=new sf;a.listenOnce(ef.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case jr.NO_ERROR:const c=a.getResponseJson();w("Connection","XHR received:",JSON.stringify(c)),i(c);break;case jr.TIMEOUT:w("Connection",'RPC "'+e+'" timed out'),o(new y(f.DEADLINE_EXCEEDED,"Request time out"));break;case jr.HTTP_ERROR:const l=a.getStatus();if(w("Connection",'RPC "'+e+'" failed with status:',l,"response text:",a.getResponseText()),l>0){const h=a.getResponseJson().error;if(h&&h.status&&h.message){const d=function(p){const m=p.toLowerCase().replace(/_/g,"-");return Object.values(f).indexOf(m)>=0?m:f.UNKNOWN}(h.status);o(new y(d,h.message))}else o(new y(f.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new y(f.UNAVAILABLE,"Connection failed."));break;default:T()}}finally{w("Connection",'RPC "'+e+'" completed.')}});const u=JSON.stringify(r);a.send(t,"POST",u,s,15)})}lo(e,t,s){const r=[this.io,"/","google.firestore.v1.Firestore","/",e,"/channel"],i=Jd(),o=Zd(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling};this.useFetchStreams&&(a.xmlHttpFactory=new nf({})),this.ao(a.initMessageHeaders,t,s),Bh()||Uh()||qh()||$h()||Kh()||Gh()||(a.httpHeadersOverwriteParam="$httpHeaders");const u=r.join("");w("Connection","Creating WebChannel: "+u,a);const c=i.createWebChannel(u,a);let l=!1,h=!1;const d=new um({Wr:m=>{h?w("Connection","Not sending because WebChannel is closed:",m):(l||(w("Connection","Opening WebChannel transport."),c.open(),l=!0),w("Connection","WebChannel sending:",m),c.send(m))},zr:()=>c.close()}),p=(m,E,b)=>{m.listen(E,L=>{try{b(L)}catch(z){setTimeout(()=>{throw z},0)}})};return p(c,bs.EventType.OPEN,()=>{h||w("Connection","WebChannel transport opened.")}),p(c,bs.EventType.CLOSE,()=>{h||(h=!0,w("Connection","WebChannel transport closed"),d.no())}),p(c,bs.EventType.ERROR,m=>{h||(h=!0,qn("Connection","WebChannel transport errored:",m),d.no(new y(f.UNAVAILABLE,"The operation could not be completed")))}),p(c,bs.EventType.MESSAGE,m=>{var E;if(!h){const b=m.data[0];A(!!b);const L=b,z=L.error||((E=L[0])===null||E===void 0?void 0:E.error);if(z){w("Connection","WebChannel received error:",z);const V=z.status;let me=function(K){const _e=W[K];if(_e!==void 0)return rl(_e)}(V),ie=z.message;me===void 0&&(me=f.INTERNAL,ie="Unknown error status: "+V+" with message "+z.message),h=!0,d.no(new y(me,ie)),c.close()}else w("Connection","WebChannel received:",b),d.so(b)}}),p(o,tf.STAT_EVENT,m=>{m.stat===ma.PROXY?w("Connection","Detected buffering proxy"):m.stat===ma.NOPROXY&&w("Connection","Detected no buffering proxy")}),setTimeout(()=>{d.eo()},0),d}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fl(){return typeof window<"u"?window:null}function Ps(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ps(n){return new Xf(n,!0)}class So{constructor(e,t,s=1e3,r=1.5,i=6e4){this.Yn=e,this.timerId=t,this.fo=s,this._o=r,this.wo=i,this.mo=0,this.yo=null,this.po=Date.now(),this.reset()}reset(){this.mo=0}Io(){this.mo=this.wo}To(e){this.cancel();const t=Math.floor(this.mo+this.Eo()),s=Math.max(0,Date.now()-this.po),r=Math.max(0,t-s);r>0&&w("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.mo} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.yo=this.Yn.enqueueAfterDelay(this.timerId,r,()=>(this.po=Date.now(),e())),this.mo*=this._o,this.mo<this.fo&&(this.mo=this.fo),this.mo>this.wo&&(this.mo=this.wo)}Ao(){this.yo!==null&&(this.yo.skipDelay(),this.yo=null)}cancel(){this.yo!==null&&(this.yo.cancel(),this.yo=null)}Eo(){return(Math.random()-.5)*this.mo}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e,t,s,r,i,o,a,u){this.Yn=e,this.Ro=s,this.Po=r,this.bo=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.Vo=0,this.vo=null,this.So=null,this.stream=null,this.Do=new So(e,t)}Co(){return this.state===1||this.state===5||this.xo()}xo(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.No()}async stop(){this.Co()&&await this.close(0)}ko(){this.state=0,this.Do.reset()}Mo(){this.xo()&&this.vo===null&&(this.vo=this.Yn.enqueueAfterDelay(this.Ro,6e4,()=>this.Oo()))}Fo(e){this.$o(),this.stream.send(e)}async Oo(){if(this.xo())return this.close(0)}$o(){this.vo&&(this.vo.cancel(),this.vo=null)}Bo(){this.So&&(this.So.cancel(),this.So=null)}async close(e,t){this.$o(),this.Bo(),this.Do.cancel(),this.Vo++,e!==4?this.Do.reset():t&&t.code===f.RESOURCE_EXHAUSTED?(H(t.toString()),H("Using maximum backoff delay to prevent overloading the backend."),this.Do.Io()):t&&t.code===f.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.Lo(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Yr(t)}Lo(){}auth(){this.state=1;const e=this.Uo(this.Vo),t=this.Vo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Vo===t&&this.qo(s,r)},s=>{e(()=>{const r=new y(f.UNKNOWN,"Fetching auth token failed: "+s.message);return this.Ko(r)})})}qo(e,t){const s=this.Uo(this.Vo);this.stream=this.Go(e,t),this.stream.Hr(()=>{s(()=>(this.state=2,this.So=this.Yn.enqueueAfterDelay(this.Po,1e4,()=>(this.xo()&&(this.state=3),Promise.resolve())),this.listener.Hr()))}),this.stream.Yr(r=>{s(()=>this.Ko(r))}),this.stream.onMessage(r=>{s(()=>this.onMessage(r))})}No(){this.state=5,this.Do.To(async()=>{this.state=0,this.start()})}Ko(e){return w("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}Uo(e){return t=>{this.Yn.enqueueAndForget(()=>this.Vo===e?t():(w("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class lm extends Vl{constructor(e,t,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,o),this.M=i}Go(e,t){return this.bo.lo("Listen",e,t)}onMessage(e){this.Do.reset();const t=eg(this.M,e),s=function(r){if(!("targetChange"in r))return S.min();const i=r.targetChange;return i.targetIds&&i.targetIds.length?S.min():i.readTime?te(i.readTime):S.min()}(e);return this.listener.Qo(t,s)}jo(e){const t={};t.database=Yn(this.M),t.addTarget=function(r,i){let o;const a=i.target;return o=Qs(a)?{documents:dl(r,a)}:{query:fl(r,a)},o.targetId=i.targetId,i.resumeToken.approximateByteSize()>0?o.resumeToken=al(r,i.resumeToken):i.snapshotVersion.compareTo(S.min())>0&&(o.readTime=Wn(r,i.snapshotVersion.toTimestamp())),o}(this.M,e);const s=ng(this.M,e);s&&(t.labels=s),this.Fo(t)}Wo(e){const t={};t.database=Yn(this.M),t.removeTarget=e,this.Fo(t)}}class hm extends Vl{constructor(e,t,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,o),this.M=i,this.zo=!1}get Ho(){return this.zo}start(){this.zo=!1,this.lastStreamToken=void 0,super.start()}Lo(){this.zo&&this.Jo([])}Go(e,t){return this.bo.lo("Write",e,t)}onMessage(e){if(A(!!e.streamToken),this.lastStreamToken=e.streamToken,this.zo){this.Do.reset();const t=tg(e.writeResults,e.commitTime),s=te(e.commitTime);return this.listener.Yo(s,t)}return A(!e.writeResults||e.writeResults.length===0),this.zo=!0,this.listener.Xo()}Zo(){const e={};e.database=Yn(this.M),this.Fo(e)}Jo(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>Qn(this.M,s))};this.Fo(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm extends class{}{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.bo=s,this.M=r,this.tu=!1}eu(){if(this.tu)throw new y(f.FAILED_PRECONDITION,"The client has already been terminated.")}oo(e,t,s){return this.eu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,i])=>this.bo.oo(e,t,s,r,i)).catch(r=>{throw r.name==="FirebaseError"?(r.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new y(f.UNKNOWN,r.toString())})}ho(e,t,s){return this.eu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([r,i])=>this.bo.ho(e,t,s,r,i)).catch(r=>{throw r.name==="FirebaseError"?(r.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),r):new y(f.UNKNOWN,r.toString())})}terminate(){this.tu=!0}}class fm{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.nu=0,this.su=null,this.iu=!0}ru(){this.nu===0&&(this.ou("Unknown"),this.su=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.su=null,this.uu("Backend didn't respond within 10 seconds."),this.ou("Offline"),Promise.resolve())))}au(e){this.state==="Online"?this.ou("Unknown"):(this.nu++,this.nu>=1&&(this.cu(),this.uu(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ou("Offline")))}set(e){this.cu(),this.nu=0,e==="Online"&&(this.iu=!1),this.ou(e)}ou(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}uu(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.iu?(H(t),this.iu=!1):w("OnlineStateTracker",t)}cu(){this.su!==null&&(this.su.cancel(),this.su=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gm{constructor(e,t,s,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.hu=[],this.lu=new Map,this.fu=new Set,this.du=[],this._u=i,this._u.Lr(o=>{s.enqueueAndForget(async()=>{it(this)&&(w("RemoteStore","Restarting streams for network reachability change."),await async function(a){const u=I(a);u.fu.add(4),await yn(u),u.wu.set("Unknown"),u.fu.delete(4),await ys(u)}(this))})}),this.wu=new fm(s,r)}}async function ys(n){if(it(n))for(const e of n.du)await e(!0)}async function yn(n){for(const e of n.du)await e(!1)}function Cr(n,e){const t=I(n);t.lu.has(e.targetId)||(t.lu.set(e.targetId,e),Co(t)?Ao(t):vn(t).xo()&&bo(t,e))}function Xn(n,e){const t=I(n),s=vn(t);t.lu.delete(e),s.xo()&&Bl(t,e),t.lu.size===0&&(s.xo()?s.Mo():it(t)&&t.wu.set("Unknown"))}function bo(n,e){n.mu.Z(e.targetId),vn(n).jo(e)}function Bl(n,e){n.mu.Z(e),vn(n).Wo(e)}function Ao(n){n.mu=new Hf({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.lu.get(e)||null}),vn(n).start(),n.wu.ru()}function Co(n){return it(n)&&!vn(n).Co()&&n.lu.size>0}function it(n){return I(n).fu.size===0}function Ul(n){n.mu=void 0}async function mm(n){n.lu.forEach((e,t)=>{bo(n,e)})}async function pm(n,e){Ul(n),Co(n)?(n.wu.au(e),Ao(n)):n.wu.set("Unknown")}async function ym(n,e,t){if(n.wu.set("Online"),e instanceof ol&&e.state===2&&e.cause)try{await async function(s,r){const i=r.cause;for(const o of r.targetIds)s.lu.has(o)&&(await s.remoteSyncer.rejectListen(o,i),s.lu.delete(o),s.mu.removeTarget(o))}(n,e)}catch(s){w("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await rr(n,s)}else if(e instanceof Rs?n.mu.ut(e):e instanceof il?n.mu._t(e):n.mu.ht(e),!t.isEqual(S.min()))try{const s=await kl(n.localStore);t.compareTo(s)>=0&&await function(r,i){const o=r.mu.yt(i);return o.targetChanges.forEach((a,u)=>{if(a.resumeToken.approximateByteSize()>0){const c=r.lu.get(u);c&&r.lu.set(u,c.withResumeToken(a.resumeToken,i))}}),o.targetMismatches.forEach(a=>{const u=r.lu.get(a);if(!u)return;r.lu.set(a,u.withResumeToken(X.EMPTY_BYTE_STRING,u.snapshotVersion)),Bl(r,a);const c=new He(u.target,a,1,u.sequenceNumber);bo(r,c)}),r.remoteSyncer.applyRemoteEvent(o)}(n,t)}catch(s){w("RemoteStore","Failed to raise snapshot:",s),await rr(n,s)}}async function rr(n,e,t){if(!Ot(e))throw e;n.fu.add(1),await yn(n),n.wu.set("Offline"),t||(t=()=>kl(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{w("RemoteStore","Retrying IndexedDB access"),await t(),n.fu.delete(1),await ys(n)})}function ql(n,e){return e().catch(t=>rr(n,t,e))}async function wn(n){const e=I(n),t=Ze(e);let s=e.hu.length>0?e.hu[e.hu.length-1].batchId:-1;for(;wm(e);)try{const r=await Yg(e.localStore,s);if(r===null){e.hu.length===0&&t.Mo();break}s=r.batchId,vm(e,r)}catch(r){await rr(e,r)}$l(e)&&Kl(e)}function wm(n){return it(n)&&n.hu.length<10}function vm(n,e){n.hu.push(e);const t=Ze(n);t.xo()&&t.Ho&&t.Jo(e.mutations)}function $l(n){return it(n)&&!Ze(n).Co()&&n.hu.length>0}function Kl(n){Ze(n).start()}async function Im(n){Ze(n).Zo()}async function Em(n){const e=Ze(n);for(const t of n.hu)e.Jo(t.mutations)}async function _m(n,e,t){const s=n.hu.shift(),r=ho.from(s,e,t);await ql(n,()=>n.remoteSyncer.applySuccessfulWrite(r)),await wn(n)}async function Tm(n,e){e&&Ze(n).Ho&&await async function(t,s){if(r=s.code,sl(r)&&r!==f.ABORTED){const i=t.hu.shift();Ze(t).ko(),await ql(t,()=>t.remoteSyncer.rejectFailedWrite(i.batchId,s)),await wn(t)}var r}(n,e),$l(n)&&Kl(n)}async function iu(n,e){const t=I(n);t.asyncQueue.verifyOperationInProgress(),w("RemoteStore","RemoteStore received new credentials");const s=it(t);t.fu.add(3),await yn(t),s&&t.wu.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.fu.delete(3),await ys(t)}async function _i(n,e){const t=I(n);e?(t.fu.delete(2),await ys(t)):e||(t.fu.add(2),await yn(t),t.wu.set("Unknown"))}function vn(n){return n.gu||(n.gu=function(e,t,s){const r=I(e);return r.eu(),new lm(t,r.bo,r.authCredentials,r.appCheckCredentials,r.M,s)}(n.datastore,n.asyncQueue,{Hr:mm.bind(null,n),Yr:pm.bind(null,n),Qo:ym.bind(null,n)}),n.du.push(async e=>{e?(n.gu.ko(),Co(n)?Ao(n):n.wu.set("Unknown")):(await n.gu.stop(),Ul(n))})),n.gu}function Ze(n){return n.yu||(n.yu=function(e,t,s){const r=I(e);return r.eu(),new hm(t,r.bo,r.authCredentials,r.appCheckCredentials,r.M,s)}(n.datastore,n.asyncQueue,{Hr:Im.bind(null,n),Yr:Tm.bind(null,n),Xo:Em.bind(null,n),Yo:_m.bind(null,n)}),n.du.push(async e=>{e?(n.yu.ko(),await wn(n)):(await n.yu.stop(),n.hu.length>0&&(w("RemoteStore",`Stopping write stream with ${n.hu.length} pending writes`),n.hu=[]))})),n.yu}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{constructor(e,t,s,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new ee,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}static createAndSchedule(e,t,s,r,i){const o=Date.now()+s,a=new No(e,t,o,r,i);return a.start(s),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new y(f.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function In(n,e){if(H("AsyncQueue",`${e}: ${n}`),Ot(n))return new y(f.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e){this.comparator=e?(t,s)=>e(t,s)||v.comparator(t.key,s.key):(t,s)=>v.comparator(t.key,s.key),this.keyedMap=wi(),this.sortedSet=new j(this.comparator)}static emptySet(e){return new Jt(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Jt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Jt;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{constructor(){this.pu=new j(v.comparator)}track(e){const t=e.doc.key,s=this.pu.get(t);s?e.type!==0&&s.type===3?this.pu=this.pu.insert(t,e):e.type===3&&s.type!==1?this.pu=this.pu.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.pu=this.pu.remove(t):e.type===1&&s.type===2?this.pu=this.pu.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):T():this.pu=this.pu.insert(t,e)}Iu(){const e=[];return this.pu.inorderTraversal((t,s)=>{e.push(s)}),e}}class un{constructor(e,t,s,r,i,o,a,u){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u}static fromInitialDocuments(e,t,s,r){const i=[];return t.forEach(o=>{i.push({type:0,doc:o})}),new un(e,t,Jt.emptySet(t),i,s,r,!0,!1)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ls(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(){this.Tu=void 0,this.listeners=[]}}class bm{constructor(){this.queries=new rt(e=>zc(e),ls),this.onlineState="Unknown",this.Eu=new Set}}async function Do(n,e){const t=I(n),s=e.query;let r=!1,i=t.queries.get(s);if(i||(r=!0,i=new Sm),r)try{i.Tu=await t.onListen(s)}catch(o){const a=In(o,`Initialization of query '${pi(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.listeners.push(e),e.Au(t.onlineState),i.Tu&&e.Ru(i.Tu)&&ko(t)}async function xo(n,e){const t=I(n),s=e.query;let r=!1;const i=t.queries.get(s);if(i){const o=i.listeners.indexOf(e);o>=0&&(i.listeners.splice(o,1),r=i.listeners.length===0)}if(r)return t.queries.delete(s),t.onUnlisten(s)}function Am(n,e){const t=I(n);let s=!1;for(const r of e){const i=r.query,o=t.queries.get(i);if(o){for(const a of o.listeners)a.Ru(r)&&(s=!0);o.Tu=r}}s&&ko(t)}function Cm(n,e,t){const s=I(n),r=s.queries.get(e);if(r)for(const i of r.listeners)i.onError(t);s.queries.delete(e)}function ko(n){n.Eu.forEach(e=>{e.next()})}class Lo{constructor(e,t,s){this.query=e,this.Pu=t,this.bu=!1,this.Vu=null,this.onlineState="Unknown",this.options=s||{}}Ru(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new un(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0)}let t=!1;return this.bu?this.vu(e)&&(this.Pu.next(e),t=!0):this.Su(e,this.onlineState)&&(this.Du(e),t=!0),this.Vu=e,t}onError(e){this.Pu.error(e)}Au(e){this.onlineState=e;let t=!1;return this.Vu&&!this.bu&&this.Su(this.Vu,e)&&(this.Du(this.Vu),t=!0),t}Su(e,t){if(!e.fromCache)return!0;const s=t!=="Offline";return(!this.options.Cu||!s)&&(!e.docs.isEmpty()||t==="Offline")}vu(e){if(e.docChanges.length>0)return!0;const t=this.Vu&&this.Vu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Du(e){e=un.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache),this.bu=!0,this.Pu.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(e,t){this.payload=e,this.byteLength=t}xu(){return"metadata"in this.payload}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(e){this.M=e}fi(e){return Le(this.M,e)}di(e){return e.metadata.exists?hl(this.M,e.document,!1):O.newNoDocument(this.fi(e.metadata.name),this._i(e.metadata.readTime))}_i(e){return te(e)}}class Dm{constructor(e,t,s){this.Nu=e,this.localStore=t,this.M=s,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=Gl(e)}ku(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.payload.namedQuery)this.queries.push(e.payload.namedQuery);else if(e.payload.documentMetadata){this.documents.push({metadata:e.payload.documentMetadata}),e.payload.documentMetadata.exists||++t;const s=x.fromString(e.payload.documentMetadata.name);this.collectionGroups.add(s.get(s.length-2))}else e.payload.document&&(this.documents[this.documents.length-1].document=e.payload.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}Mu(e){const t=new Map,s=new au(this.M);for(const r of e)if(r.metadata.queries){const i=s.fi(r.metadata.name);for(const o of r.metadata.queries){const a=(t.get(o)||M()).add(i);t.set(o,a)}}return t}async complete(){const e=await Qg(this.localStore,new au(this.M),this.documents,this.Nu.id),t=this.Mu(this.documents);for(const s of this.queries)await Xg(this.localStore,s,t.get(s.name));return this.progress.taskState="Success",{progress:this.progress,Ou:this.collectionGroups,Fu:e}}}function Gl(n){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:n.totalDocuments,totalBytes:n.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jl{constructor(e){this.key=e}}class zl{constructor(e){this.key=e}}class Wl{constructor(e,t){this.query=e,this.$u=t,this.Bu=null,this.current=!1,this.Lu=M(),this.mutatedKeys=M(),this.Uu=Hc(e),this.qu=new Jt(this.Uu)}get Ku(){return this.$u}Gu(e,t){const s=t?t.Qu:new ou,r=t?t.qu:this.qu;let i=t?t.mutatedKeys:this.mutatedKeys,o=r,a=!1;const u=Ls(this.query)&&r.size===this.query.limit?r.last():null,c=Js(this.query)&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((l,h)=>{const d=r.get(l),p=oo(this.query,h)?h:null,m=!!d&&this.mutatedKeys.has(d.key),E=!!p&&(p.hasLocalMutations||this.mutatedKeys.has(p.key)&&p.hasCommittedMutations);let b=!1;d&&p?d.data.isEqual(p.data)?m!==E&&(s.track({type:3,doc:p}),b=!0):this.ju(d,p)||(s.track({type:2,doc:p}),b=!0,(u&&this.Uu(p,u)>0||c&&this.Uu(p,c)<0)&&(a=!0)):!d&&p?(s.track({type:0,doc:p}),b=!0):d&&!p&&(s.track({type:1,doc:d}),b=!0,(u||c)&&(a=!0)),b&&(p?(o=o.add(p),i=E?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))}),Ls(this.query)||Js(this.query))for(;o.size>this.query.limit;){const l=Ls(this.query)?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),s.track({type:1,doc:l})}return{qu:o,Qu:s,ni:a,mutatedKeys:i}}ju(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s){const r=this.qu;this.qu=e.qu,this.mutatedKeys=e.mutatedKeys;const i=e.Qu.Iu();i.sort((c,l)=>function(h,d){const p=m=>{switch(m){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return T()}};return p(h)-p(d)}(c.type,l.type)||this.Uu(c.doc,l.doc)),this.Wu(s);const o=t?this.zu():[],a=this.Lu.size===0&&this.current?1:0,u=a!==this.Bu;return this.Bu=a,i.length!==0||u?{snapshot:new un(this.query,e.qu,r,i,e.mutatedKeys,a===0,u,!1),Hu:o}:{Hu:o}}Au(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({qu:this.qu,Qu:new ou,mutatedKeys:this.mutatedKeys,ni:!1},!1)):{Hu:[]}}Ju(e){return!this.$u.has(e)&&!!this.qu.has(e)&&!this.qu.get(e).hasLocalMutations}Wu(e){e&&(e.addedDocuments.forEach(t=>this.$u=this.$u.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.$u=this.$u.delete(t)),this.current=e.current)}zu(){if(!this.current)return[];const e=this.Lu;this.Lu=M(),this.qu.forEach(s=>{this.Ju(s.key)&&(this.Lu=this.Lu.add(s.key))});const t=[];return e.forEach(s=>{this.Lu.has(s)||t.push(new zl(s))}),this.Lu.forEach(s=>{e.has(s)||t.push(new jl(s))}),t}Yu(e){this.$u=e.li,this.Lu=M();const t=this.Gu(e.documents);return this.applyChanges(t,!0)}Xu(){return un.fromInitialDocuments(this.query,this.qu,this.mutatedKeys,this.Bu===0)}}class xm{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class km{constructor(e){this.key=e,this.Zu=!1}}class Lm{constructor(e,t,s,r,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.ta={},this.ea=new rt(a=>zc(a),ls),this.na=new Map,this.sa=new Set,this.ia=new j(v.comparator),this.ra=new Map,this.oa=new Eo,this.ua={},this.aa=new Map,this.ca=Dt.yn(),this.onlineState="Unknown",this.ha=void 0}get isPrimaryClient(){return this.ha===!0}}async function Mm(n,e){const t=Fo(n);let s,r;const i=t.ea.get(e);if(i)s=i.targetId,t.sharedClientState.addLocalQueryTarget(s),r=i.view.Xu();else{const o=await on(t.localStore,De(e));t.isPrimaryClient&&Cr(t.remoteStore,o);const a=t.sharedClientState.addLocalQueryTarget(o.targetId);s=o.targetId,r=await Mo(t,e,s,a==="current")}return r}async function Mo(n,e,t,s){n.la=(l,h,d)=>async function(p,m,E,b){let L=m.view.Gu(E);L.ni&&(L=await tr(p.localStore,m.query,!1).then(({documents:me})=>m.view.Gu(me,L)));const z=b&&b.targetChanges.get(m.targetId),V=m.view.applyChanges(L,p.isPrimaryClient,z);return Ti(p,m.targetId,V.Hu),V.snapshot}(n,l,h,d);const r=await tr(n.localStore,e,!0),i=new Wl(e,r.li),o=i.Gu(r.documents),a=ms.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline"),u=i.applyChanges(o,n.isPrimaryClient,a);Ti(n,t,u.Hu);const c=new xm(e,t,i);return n.ea.set(e,c),n.na.has(t)?n.na.get(t).push(e):n.na.set(t,[e]),u.snapshot}async function Rm(n,e){const t=I(n),s=t.ea.get(e),r=t.na.get(s.targetId);if(r.length>1)return t.na.set(s.targetId,r.filter(i=>!ls(i,e))),void t.ea.delete(e);t.isPrimaryClient?(t.sharedClientState.removeLocalQueryTarget(s.targetId),t.sharedClientState.isActiveQueryTarget(s.targetId)||await an(t.localStore,s.targetId,!1).then(()=>{t.sharedClientState.clearQueryState(s.targetId),Xn(t.remoteStore,s.targetId),cn(t,s.targetId)}).catch(Pt)):(cn(t,s.targetId),await an(t.localStore,s.targetId,!0))}async function Om(n,e,t){const s=Vo(n);try{const r=await function(i,o){const a=I(i),u=G.now(),c=o.reduce((h,d)=>h.add(d.key),M());let l;return a.persistence.runTransaction("Locally write mutations","readwrite",h=>a.ci.Ks(h,c).next(d=>{l=d;const p=[];for(const m of o){const E=qf(m,l.get(m.key));E!=null&&p.push(new Rt(m.key,E,Uc(E.value.mapValue),Y.exists(!0)))}return a.Bs.addMutationBatch(h,u,p,o)})).then(h=>(h.applyToLocalDocumentSet(l),{batchId:h.batchId,changes:l}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(i,o,a){let u=i.ua[i.currentUser.toKey()];u||(u=new j(N)),u=u.insert(o,a),i.ua[i.currentUser.toKey()]=u}(s,r.batchId,t),await $e(s,r.changes),await wn(s.remoteStore)}catch(r){const i=In(r,"Failed to persist write");t.reject(i)}}async function Hl(n,e){const t=I(n);try{const s=await Hg(t.localStore,e);e.targetChanges.forEach((r,i)=>{const o=t.ra.get(i);o&&(A(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.Zu=!0:r.modifiedDocuments.size>0?A(o.Zu):r.removedDocuments.size>0&&(A(o.Zu),o.Zu=!1))}),await $e(t,s,e)}catch(s){await Pt(s)}}function uu(n,e,t){const s=I(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.ea.forEach((i,o)=>{const a=o.view.Au(e);a.snapshot&&r.push(a.snapshot)}),function(i,o){const a=I(i);a.onlineState=o;let u=!1;a.queries.forEach((c,l)=>{for(const h of l.listeners)h.Au(o)&&(u=!0)}),u&&ko(a)}(s.eventManager,e),r.length&&s.ta.Qo(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function Pm(n,e,t){const s=I(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.ra.get(e),i=r&&r.key;if(i){let o=new j(v.comparator);o=o.insert(i,O.newNoDocument(i,S.min()));const a=M().add(i),u=new gs(S.min(),new Map,new P(N),o,a);await Hl(s,u),s.ia=s.ia.remove(i),s.ra.delete(e),Po(s)}else await an(s.localStore,e,!1).then(()=>cn(s,e,t)).catch(Pt)}async function Fm(n,e){const t=I(n),s=e.batch.batchId;try{const r=await Wg(t.localStore,e);Oo(t,s,null),Ro(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await $e(t,r)}catch(r){await Pt(r)}}async function Vm(n,e,t){const s=I(n);try{const r=await function(i,o){const a=I(i);return a.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let c;return a.Bs.lookupMutationBatch(u,o).next(l=>(A(l!==null),c=l.keys(),a.Bs.removeMutationBatch(u,l))).next(()=>a.Bs.performConsistencyCheck(u)).next(()=>a.ci.Ks(u,c))})}(s.localStore,e);Oo(s,e,t),Ro(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await $e(s,r)}catch(r){await Pt(r)}}async function Bm(n,e){const t=I(n);it(t.remoteStore)||w("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const s=await function(i){const o=I(i);return o.persistence.runTransaction("Get highest unacknowledged batch id","readonly",a=>o.Bs.getHighestUnacknowledgedBatchId(a))}(t.localStore);if(s===-1)return void e.resolve();const r=t.aa.get(s)||[];r.push(e),t.aa.set(s,r)}catch(s){const r=In(s,"Initialization of waitForPendingWrites() operation failed");e.reject(r)}}function Ro(n,e){(n.aa.get(e)||[]).forEach(t=>{t.resolve()}),n.aa.delete(e)}function Oo(n,e,t){const s=I(n);let r=s.ua[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(t?i.reject(t):i.resolve(),r=r.remove(e)),s.ua[s.currentUser.toKey()]=r}}function cn(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.na.get(e))n.ea.delete(s),t&&n.ta.fa(s,t);n.na.delete(e),n.isPrimaryClient&&n.oa.Pi(e).forEach(s=>{n.oa.containsKey(s)||Yl(n,s)})}function Yl(n,e){n.sa.delete(e.path.canonicalString());const t=n.ia.get(e);t!==null&&(Xn(n.remoteStore,t),n.ia=n.ia.remove(e),n.ra.delete(t),Po(n))}function Ti(n,e,t){for(const s of t)s instanceof jl?(n.oa.addReference(s.key,e),Um(n,s)):s instanceof zl?(w("SyncEngine","Document no longer in limbo: "+s.key),n.oa.removeReference(s.key,e),n.oa.containsKey(s.key)||Yl(n,s.key)):T()}function Um(n,e){const t=e.key,s=t.path.canonicalString();n.ia.get(t)||n.sa.has(s)||(w("SyncEngine","New document in limbo: "+t),n.sa.add(s),Po(n))}function Po(n){for(;n.sa.size>0&&n.ia.size<n.maxConcurrentLimboResolutions;){const e=n.sa.values().next().value;n.sa.delete(e);const t=new v(x.fromString(e)),s=n.ca.next();n.ra.set(s,new km(t)),n.ia=n.ia.insert(t,s),Cr(n.remoteStore,new He(De(pn(t.path)),s,2,be.A))}}async function $e(n,e,t){const s=I(n),r=[],i=[],o=[];s.ea.isEmpty()||(s.ea.forEach((a,u)=>{o.push(s.la(u,e,t).then(c=>{if(c){s.isPrimaryClient&&s.sharedClientState.updateQueryState(u.targetId,c.fromCache?"not-current":"current"),r.push(c);const l=Io.Ys(u.targetId,c);i.push(l)}}))}),await Promise.all(o),s.ta.Qo(r),await async function(a,u){const c=I(a);try{await c.persistence.runTransaction("notifyLocalViewChanges","readwrite",l=>g.forEach(u,h=>g.forEach(h.Hs,d=>c.persistence.referenceDelegate.addReference(l,h.targetId,d)).next(()=>g.forEach(h.Js,d=>c.persistence.referenceDelegate.removeReference(l,h.targetId,d)))))}catch(l){if(!Ot(l))throw l;w("LocalStore","Failed to update sequence numbers: "+l)}for(const l of u){const h=l.targetId;if(!l.fromCache){const d=c.ii.get(h),p=d.snapshotVersion,m=d.withLastLimboFreeSnapshotVersion(p);c.ii=c.ii.insert(h,m)}}}(s.localStore,i))}async function qm(n,e){const t=I(n);if(!t.currentUser.isEqual(e)){w("SyncEngine","User change. New user:",e.toKey());const s=await xl(t.localStore,e);t.currentUser=e,function(r,i){r.aa.forEach(o=>{o.forEach(a=>{a.reject(new y(f.CANCELLED,i))})}),r.aa.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await $e(t,s.hi)}}function $m(n,e){const t=I(n),s=t.ra.get(e);if(s&&s.Zu)return M().add(s.key);{let r=M();const i=t.na.get(e);if(!i)return r;for(const o of i){const a=t.ea.get(o);r=r.unionWith(a.view.Ku)}return r}}async function Km(n,e){const t=I(n),s=await tr(t.localStore,e.query,!0),r=e.view.Yu(s);return t.isPrimaryClient&&Ti(t,e.targetId,r.Hu),r}async function Gm(n,e){const t=I(n);return Rl(t.localStore,e).then(s=>$e(t,s))}async function jm(n,e,t,s){const r=I(n),i=await function(o,a){const u=I(o),c=I(u.Bs);return u.persistence.runTransaction("Lookup mutation documents","readonly",l=>c.fn(l,a).next(h=>h?u.ci.Ks(l,h):g.resolve(null)))}(r.localStore,e);i!==null?(t==="pending"?await wn(r.remoteStore):t==="acknowledged"||t==="rejected"?(Oo(r,e,s||null),Ro(r,e),function(o,a){I(I(o).Bs)._n(a)}(r.localStore,e)):T(),await $e(r,i)):w("SyncEngine","Cannot apply mutation batch with id: "+e)}async function zm(n,e){const t=I(n);if(Fo(t),Vo(t),e===!0&&t.ha!==!0){const s=t.sharedClientState.getAllActiveQueryTargets(),r=await cu(t,s.toArray());t.ha=!0,await _i(t.remoteStore,!0);for(const i of r)Cr(t.remoteStore,i)}else if(e===!1&&t.ha!==!1){const s=[];let r=Promise.resolve();t.na.forEach((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?s.push(o):r=r.then(()=>(cn(t,o),an(t.localStore,o,!0))),Xn(t.remoteStore,o)}),await r,await cu(t,s),function(i){const o=I(i);o.ra.forEach((a,u)=>{Xn(o.remoteStore,u)}),o.oa.bi(),o.ra=new Map,o.ia=new j(v.comparator)}(t),t.ha=!1,await _i(t.remoteStore,!1)}}async function cu(n,e,t){const s=I(n),r=[],i=[];for(const o of e){let a;const u=s.na.get(o);if(u&&u.length!==0){a=await on(s.localStore,De(u[0]));for(const c of u){const l=s.ea.get(c),h=await Km(s,l);h.snapshot&&i.push(h.snapshot)}}else{const c=await Ml(s.localStore,o);a=await on(s.localStore,c),await Mo(s,Ql(c),o,!1)}r.push(a)}return s.ta.Qo(i),r}function Ql(n){return Gc(n.path,n.collectionGroup,n.orderBy,n.filters,n.limit,"F",n.startAt,n.endAt)}function Wm(n){const e=I(n);return I(I(e.localStore).persistence).Fs()}async function Hm(n,e,t,s){const r=I(n);if(r.ha)return void w("SyncEngine","Ignoring unexpected query state notification.");const i=r.na.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await Rl(r.localStore,Wc(i[0])),a=gs.createSynthesizedRemoteEventForCurrentChange(e,t==="current");await $e(r,o,a);break}case"rejected":await an(r.localStore,e,!0),cn(r,e,s);break;default:T()}}async function Ym(n,e,t){const s=Fo(n);if(s.ha){for(const r of e){if(s.na.has(r)){w("SyncEngine","Adding an already active target "+r);continue}const i=await Ml(s.localStore,r),o=await on(s.localStore,i);await Mo(s,Ql(i),o.targetId,!1),Cr(s.remoteStore,o)}for(const r of t)s.na.has(r)&&await an(s.localStore,r,!1).then(()=>{Xn(s.remoteStore,r),cn(s,r)}).catch(Pt)}}function Fo(n){const e=I(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Hl.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=$m.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Pm.bind(null,e),e.ta.Qo=Am.bind(null,e.eventManager),e.ta.fa=Cm.bind(null,e.eventManager),e}function Vo(n){const e=I(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Fm.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Vm.bind(null,e),e}function Qm(n,e,t){const s=I(n);(async function(r,i,o){try{const a=await i.getMetadata();if(await function(h,d){const p=I(h),m=te(d.createTime);return p.persistence.runTransaction("hasNewerBundle","readonly",E=>p._s.getBundleMetadata(E,d.id)).then(E=>!!E&&E.createTime.compareTo(m)>=0)}(r.localStore,a))return await i.close(),o._completeWith(function(h){return{taskState:"Success",documentsLoaded:h.totalDocuments,bytesLoaded:h.totalBytes,totalDocuments:h.totalDocuments,totalBytes:h.totalBytes}}(a)),Promise.resolve(new Set);o._updateProgress(Gl(a));const u=new Dm(a,r.localStore,i.M);let c=await i.da();for(;c;){const h=await u.ku(c);h&&o._updateProgress(h),c=await i.da()}const l=await u.complete();return await $e(r,l.Fu,void 0),await function(h,d){const p=I(h);return p.persistence.runTransaction("Save bundle","readwrite",m=>p._s.saveBundleMetadata(m,d))}(r.localStore,a),o._completeWith(l.progress),Promise.resolve(l.Ou)}catch(a){return qn("SyncEngine",`Loading bundle failed with ${a}`),o._failWith(a),Promise.resolve(new Set)}})(s,e,t).then(r=>{s.sharedClientState.notifyBundleLoaded(r)})}class Xl{constructor(){this.synchronizeTabs=!1}async initialize(e){this.M=ps(e.databaseInfo.databaseId),this.sharedClientState=this._a(e),this.persistence=this.wa(e),await this.persistence.start(),this.gcScheduler=this.ma(e),this.localStore=this.ga(e)}ma(e){return null}ga(e){return Dl(this.persistence,new Nl,e.initialUser,this.M)}wa(e){return new rm(_o.zi,this.M)}_a(e){return new Pl}async terminate(){this.gcScheduler&&this.gcScheduler.stop(),await this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class Jl extends Xl{constructor(e,t,s){super(),this.ya=e,this.cacheSizeBytes=t,this.forceOwnership=s,this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.ya.initialize(this,e),await Vo(this.ya.syncEngine),await wn(this.ya.remoteStore),await this.persistence.Ts(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(this.localStore),Promise.resolve()))}ga(e){return Dl(this.persistence,new Nl,e.initialUser,this.M)}ma(e){const t=this.persistence.referenceDelegate.garbageCollector;return new Bg(t,e.asyncQueue)}wa(e){const t=vo(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),s=this.cacheSizeBytes!==void 0?Te.withCacheSize(this.cacheSizeBytes):Te.DEFAULT;return new wo(this.synchronizeTabs,t,e.clientId,s,e.asyncQueue,Fl(),Ps(),this.M,this.sharedClientState,!!this.forceOwnership)}_a(e){return new Pl}}class Xm extends Jl{constructor(e,t){super(e,t,!1),this.ya=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.ya.syncEngine;this.sharedClientState instanceof Yr&&(this.sharedClientState.syncEngine={Mr:jm.bind(null,t),Or:Hm.bind(null,t),Fr:Ym.bind(null,t),Fs:Wm.bind(null,t),kr:Gm.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ts(async s=>{await zm(this.ya.syncEngine,s),this.gcScheduler&&(s&&!this.gcScheduler.started?this.gcScheduler.start(this.localStore):s||this.gcScheduler.stop())})}_a(e){const t=Fl();if(!Yr.vt(t))throw new y(f.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const s=vo(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Yr(t,e.asyncQueue,s,e.clientId,e.initialUser)}}class Bo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>uu(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=qm.bind(null,this.syncEngine),await _i(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new bm}createDatastore(e){const t=ps(e.databaseInfo.databaseId),s=(r=e.databaseInfo,new cm(r));var r;return function(i,o,a,u){return new dm(i,o,a,u)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return t=this.localStore,s=this.datastore,r=e.asyncQueue,i=a=>uu(this.syncEngine,a,0),o=ru.vt()?new ru:new om,new gm(t,s,r,i,o);var t,s,r,i,o}createSyncEngine(e,t){return function(s,r,i,o,a,u,c){const l=new Lm(s,r,i,o,a,u);return c&&(l.ha=!0),l}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}terminate(){return async function(e){const t=I(e);w("RemoteStore","RemoteStore shutting down."),t.fu.add(5),await yn(t),t._u.shutdown(),t.wu.set("Unknown")}(this.remoteStore)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lu(n,e=10240){let t=0;return{async read(){if(t<n.byteLength){const s={value:n.slice(t,t+e),done:!1};return t+=e,s}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.reject("unimplemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.pa(this.observer.next,e)}error(e){this.observer.error?this.pa(this.observer.error,e):console.error("Uncaught Error in snapshot listener:",e)}Ia(){this.muted=!0}pa(e,t){this.muted||setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jm{constructor(e,t){this.Ta=e,this.M=t,this.metadata=new ee,this.buffer=new Uint8Array,this.Ea=new TextDecoder("utf-8"),this.Aa().then(s=>{s&&s.xu()?this.metadata.resolve(s.payload.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(s==null?void 0:s.payload)}`))},s=>this.metadata.reject(s))}close(){return this.Ta.cancel()}async getMetadata(){return this.metadata.promise}async da(){return await this.getMetadata(),this.Aa()}async Aa(){const e=await this.Ra();if(e===null)return null;const t=this.Ea.decode(e),s=Number(t);isNaN(s)&&this.Pa(`length string (${t}) is not valid number`);const r=await this.ba(s);return new Nm(JSON.parse(r),e.length+s)}Va(){return this.buffer.findIndex(e=>e===123)}async Ra(){for(;this.Va()<0&&!await this.va(););if(this.buffer.length===0)return null;const e=this.Va();e<0&&this.Pa("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async ba(e){for(;this.buffer.length<e;)await this.va()&&this.Pa("Reached the end of bundle when more is expected.");const t=this.Ea.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Pa(e){throw this.Ta.cancel(),new Error(`Invalid bundle format: ${e}`)}async va(){const e=await this.Ta.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastWriteError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw new y(f.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes.");const t=await async function(s,r){const i=I(s),o=Yn(i.M)+"/documents",a={documents:r.map(h=>Hn(i.M,h))},u=await i.ho("BatchGetDocuments",o,a),c=new Map;u.forEach(h=>{const d=Zf(i.M,h);c.set(d.key.toString(),d)});const l=[];return r.forEach(h=>{const d=c.get(h.toString());A(!!d),l.push(d)}),l}(this.datastore,e);return t.forEach(s=>this.recordVersion(s)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(s){this.lastWriteError=s}this.writtenDocs.add(e.toString())}delete(e){this.write(new fs(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastWriteError)throw this.lastWriteError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,s)=>{const r=v.fromPath(s);this.mutations.push(new ao(r,this.precondition(r)))}),await async function(t,s){const r=I(t),i=Yn(r.M)+"/documents",o={writes:s.map(a=>Qn(r.M,a))};await r.oo("Commit",i,o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw T();t=S.min()}const s=this.readVersions.get(e.key.toString());if(s){if(!t.isEqual(s))throw new y(f.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?Y.updateTime(t):Y.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(S.min()))throw new y(f.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Y.updateTime(t)}return Y.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{constructor(e,t,s,r){this.asyncQueue=e,this.datastore=t,this.updateFunction=s,this.deferred=r,this.Sa=5,this.Do=new So(this.asyncQueue,"transaction_retry")}run(){this.Sa-=1,this.Da()}Da(){this.Do.To(async()=>{const e=new Zm(this.datastore),t=this.Ca(e);t&&t.then(s=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(s)}).catch(r=>{this.xa(r)}))}).catch(s=>{this.xa(s)})})}Ca(e){try{const t=this.updateFunction(e);return!Mt(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}xa(e){this.Sa>0&&this.Na(e)?(this.Sa-=1,this.asyncQueue.enqueueAndForget(()=>(this.Da(),Promise.resolve()))):this.deferred.reject(e)}Na(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||!sl(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(e,t,s,r){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=r,this.user=oe.UNAUTHENTICATED,this.clientId=Lc.R(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(s,async i=>{w("FirestoreClient","Received user=",i.uid),await this.authCredentialListener(i),this.user=i}),this.appCheckCredentials.start(s,i=>(w("FirestoreClient","Received new app check token=",i),this.appCheckCredentialListener(i,this.user)))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new y(f.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ee;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this.onlineComponents&&await this.onlineComponents.terminate(),this.offlineComponents&&await this.offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=In(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Zl(n,e){n.asyncQueue.verifyOperationInProgress(),w("FirestoreClient","Initializing OfflineComponentProvider");const t=await n.getConfiguration();await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async r=>{s.isEqual(r)||(await xl(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n.offlineComponents=e}async function eh(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Uo(n);w("FirestoreClient","Initializing OnlineComponentProvider");const s=await n.getConfiguration();await e.initialize(t,s),n.setCredentialChangeListener(r=>iu(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>iu(e.remoteStore,i)),n.onlineComponents=e}async function Uo(n){return n.offlineComponents||(w("FirestoreClient","Using default OfflineComponentProvider"),await Zl(n,new Xl)),n.offlineComponents}async function Dr(n){return n.onlineComponents||(w("FirestoreClient","Using default OnlineComponentProvider"),await eh(n,new Bo)),n.onlineComponents}function th(n){return Uo(n).then(e=>e.persistence)}function qo(n){return Uo(n).then(e=>e.localStore)}function nh(n){return Dr(n).then(e=>e.remoteStore)}function $o(n){return Dr(n).then(e=>e.syncEngine)}async function ln(n){const e=await Dr(n),t=e.eventManager;return t.onListen=Mm.bind(null,e.syncEngine),t.onUnlisten=Rm.bind(null,e.syncEngine),t}function np(n){return n.asyncQueue.enqueue(async()=>{const e=await th(n),t=await nh(n);return e.setNetworkEnabled(!0),function(s){const r=I(s);return r.fu.delete(0),ys(r)}(t)})}function sp(n){return n.asyncQueue.enqueue(async()=>{const e=await th(n),t=await nh(n);return e.setNetworkEnabled(!1),async function(s){const r=I(s);r.fu.add(0),await yn(r),r.wu.set("Offline")}(t)})}function rp(n,e){const t=new ee;return n.asyncQueue.enqueueAndForget(async()=>async function(s,r,i){try{const o=await function(a,u){const c=I(a);return c.persistence.runTransaction("read document","readonly",l=>c.ci.Ls(l,u))}(s,r);o.isFoundDocument()?i.resolve(o):o.isNoDocument()?i.resolve(null):i.reject(new y(f.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(o){const a=In(o,`Failed to get document '${r} from cache`);i.reject(a)}}(await qo(n),e,t)),t.promise}function sh(n,e,t={}){const s=new ee;return n.asyncQueue.enqueueAndForget(async()=>function(r,i,o,a,u){const c=new Nr({next:h=>{i.enqueueAndForget(()=>xo(r,l));const d=h.docs.has(o);!d&&h.fromCache?u.reject(new y(f.UNAVAILABLE,"Failed to get document because the client is offline.")):d&&h.fromCache&&a&&a.source==="server"?u.reject(new y(f.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(h)},error:h=>u.reject(h)}),l=new Lo(pn(o.path),c,{includeMetadataChanges:!0,Cu:!0});return Do(r,l)}(await ln(n),n.asyncQueue,e,t,s)),s.promise}function ip(n,e){const t=new ee;return n.asyncQueue.enqueueAndForget(async()=>async function(s,r,i){try{const o=await tr(s,r,!0),a=new Wl(r,o.li),u=a.Gu(o.documents),c=a.applyChanges(u,!1);i.resolve(c.snapshot)}catch(o){const a=In(o,`Failed to execute query '${r} against cache`);i.reject(a)}}(await qo(n),e,t)),t.promise}function rh(n,e,t={}){const s=new ee;return n.asyncQueue.enqueueAndForget(async()=>function(r,i,o,a,u){const c=new Nr({next:h=>{i.enqueueAndForget(()=>xo(r,l)),h.fromCache&&a.source==="server"?u.reject(new y(f.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(h)},error:h=>u.reject(h)}),l=new Lo(o,c,{includeMetadataChanges:!0,Cu:!0});return Do(r,l)}(await ln(n),n.asyncQueue,e,t,s)),s.promise}function op(n,e){const t=new Nr(e);return n.asyncQueue.enqueueAndForget(async()=>function(s,r){I(s).Eu.add(r),r.next()}(await ln(n),t)),()=>{t.Ia(),n.asyncQueue.enqueueAndForget(async()=>function(s,r){I(s).Eu.delete(r)}(await ln(n),t))}}function ap(n,e){const t=new ee;return n.asyncQueue.enqueueAndForget(async()=>{const s=await function(r){return Dr(r).then(i=>i.datastore)}(n);new ep(n.asyncQueue,s,e,t).run()}),t.promise}function up(n,e,t,s){const r=function(i,o){let a;return a=typeof i=="string"?new TextEncoder().encode(i):i,function(u,c){return new Jm(u,c)}(function(u,c){if(u instanceof Uint8Array)return lu(u,c);if(u instanceof ArrayBuffer)return lu(new Uint8Array(u),c);if(u instanceof ReadableStream)return u.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(a),o)}(t,ps(e));n.asyncQueue.enqueueAndForget(async()=>{Qm(await $o(n),r,s)})}function cp(n,e){return n.asyncQueue.enqueue(async()=>function(t,s){const r=I(t);return r.persistence.runTransaction("Get named query","readonly",i=>r._s.getNamedQuery(i,s))}(await qo(n),e))}const hu=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ko(n,e,t){if(!t)throw new y(f.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function ih(n,e,t,s){if(e===!0&&s===!0)throw new y(f.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function du(n){if(!v.isDocumentKey(n))throw new y(f.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function fu(n){if(v.isDocumentKey(n))throw new y(f.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function xr(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(t){return t.constructor?t.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":T()}function k(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new y(f.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=xr(n);throw new y(f.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function oh(n,e){if(e<=0)throw new y(f.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e){var t;if(e.host===void 0){if(e.ssl!==void 0)throw new y(f.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new y(f.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.useFetchStreams=!!e.useFetchStreams,ih("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling)}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e,t,s){this._authCredentials=t,this._appCheckCredentials=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new gu({}),this._settingsFrozen=!1,e instanceof Ve?this._databaseId=e:(this._app=e,this._databaseId=function(r){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new y(f.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ve(r.options.projectId)}(e))}get app(){if(!this._app)throw new y(f.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new y(f.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new gu(e),e.credentials!==void 0&&(this._authCredentials=function(t){if(!t)return new uf;switch(t.type){case"gapi":const s=t.client;return A(!(typeof s!="object"||s===null||!s.auth||!s.auth.getAuthHeaderValueForFirstParty)),new df(s,t.sessionIndex||"0",t.iamToken||null);case"provider":return t.client;default:throw new y(f.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=hu.get(e);t&&(w("ComponentProvider","Removing Datastore"),hu.delete(e),t.terminate())}(this),Promise.resolve()}}function lp(n,e,t,s={}){var r;const i=(n=k(n,ws))._getSettings();if(i.host!=="firestore.googleapis.com"&&i.host!==e&&qn("Host has been set in both settings() and useEmulator(), emulator host will be used"),n._setSettings(Object.assign(Object.assign({},i),{host:`${e}:${t}`,ssl:!1})),s.mockUserToken){let o,a;if(typeof s.mockUserToken=="string")o=s.mockUserToken,a=oe.MOCK_USER;else{o=Fh(s.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const u=s.mockUserToken.sub||s.mockUserToken.user_id;if(!u)throw new y(f.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");a=new oe(u)}n._authCredentials=new cf(new kc(o,a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Me(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new F(this.firestore,e,this._key)}}class ge{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ge(this.firestore,e,this._query)}}class Me extends ge{constructor(e,t,s){super(e,t,pn(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new F(this.firestore,null,new v(e))}withConverter(e){return new Me(this.firestore,e,this._path)}}function ah(n,e,...t){if(n=R(n),Ko("collection","path",e),n instanceof ws){const s=x.fromString(e,...t);return fu(s),new Me(n,null,s)}{if(!(n instanceof F||n instanceof Me))throw new y(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(x.fromString(e,...t));return fu(s),new Me(n.firestore,null,s)}}function hp(n,e){if(n=k(n,ws),Ko("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new y(f.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new ge(n,null,function(t){return new qe(x.emptyPath(),t)}(e))}function ir(n,e,...t){if(n=R(n),arguments.length===1&&(e=Lc.R()),Ko("doc","path",e),n instanceof ws){const s=x.fromString(e,...t);return du(s),new F(n,null,new v(s))}{if(!(n instanceof F||n instanceof Me))throw new y(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(x.fromString(e,...t));return du(s),new F(n.firestore,n instanceof Me?n.converter:null,new v(s))}}function uh(n,e){return n=R(n),e=R(e),(n instanceof F||n instanceof Me)&&(e instanceof F||e instanceof Me)&&n.firestore===e.firestore&&n.path===e.path&&n.converter===e.converter}function ch(n,e){return n=R(n),e=R(e),n instanceof ge&&e instanceof ge&&n.firestore===e.firestore&&ls(n._query,e._query)&&n.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(){this.ka=Promise.resolve(),this.Ma=[],this.Oa=!1,this.Fa=[],this.$a=null,this.Ba=!1,this.La=!1,this.Ua=[],this.Do=new So(this,"async_queue_retry"),this.qa=()=>{const t=Ps();t&&w("AsyncQueue","Visibility state changed to "+t.visibilityState),this.Do.Ao()};const e=Ps();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.qa)}get isShuttingDown(){return this.Oa}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Ka(),this.Ga(e)}enterRestrictedMode(e){if(!this.Oa){this.Oa=!0,this.La=e||!1;const t=Ps();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.qa)}}enqueue(e){if(this.Ka(),this.Oa)return new Promise(()=>{});const t=new ee;return this.Ga(()=>this.Oa&&this.La?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Ma.push(e),this.Qa()))}async Qa(){if(this.Ma.length!==0){try{await this.Ma[0](),this.Ma.shift(),this.Do.reset()}catch(e){if(!Ot(e))throw e;w("AsyncQueue","Operation failed with retryable error: "+e)}this.Ma.length>0&&this.Do.To(()=>this.Qa())}}Ga(e){const t=this.ka.then(()=>(this.Ba=!0,e().catch(s=>{this.$a=s,this.Ba=!1;const r=function(i){let o=i.message||"";return i.stack&&(o=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),o}(s);throw H("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.Ba=!1,s))));return this.ka=t,t}enqueueAfterDelay(e,t,s){this.Ka(),this.Ua.indexOf(e)>-1&&(t=0);const r=No.createAndSchedule(this,e,t,s,i=>this.ja(i));return this.Fa.push(r),r}Ka(){this.$a&&T()}verifyOperationInProgress(){}async Wa(){let e;do e=this.ka,await e;while(e!==this.ka)}za(e){for(const t of this.Fa)if(t.timerId===e)return!0;return!1}Ha(e){return this.Wa().then(()=>{this.Fa.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Fa)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Wa()})}Ja(e){this.Ua.push(e)}ja(e){const t=this.Fa.indexOf(e);this.Fa.splice(t,1)}}function Si(n){return function(e,t){if(typeof e!="object"||e===null)return!1;const s=e;for(const r of t)if(r in s&&typeof s[r]=="function")return!0;return!1}(n,["next","error","complete"])}class fp{constructor(){this._progressObserver={},this._taskCompletionResolver=new ee,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,s){this._progressObserver={next:e,error:t,complete:s}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gp=-1;class $ extends ws{constructor(e,t,s){super(e,t,s),this.type="firestore",this._queue=new dp,this._persistenceKey="name"in e?e.name:"[DEFAULT]"}_terminate(){return this._firestoreClient||lh(this),this._firestoreClient.terminate()}}function re(n){return n._firestoreClient||lh(n),n._firestoreClient.verifyNotTerminated(),n._firestoreClient}function lh(n){var e;const t=n._freezeSettings(),s=function(r,i,o,a){return new vf(r,i,o,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,a.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,t);n._firestoreClient=new tp(n._authCredentials,n._appCheckCredentials,n._queue,s)}function mp(n,e){dh(n=k(n,$));const t=re(n),s=n._freezeSettings(),r=new Bo;return hh(t,r,new Jl(r,s.cacheSizeBytes,e==null?void 0:e.forceOwnership))}function pp(n){dh(n=k(n,$));const e=re(n),t=n._freezeSettings(),s=new Bo;return hh(e,s,new Xm(s,t.cacheSizeBytes))}function hh(n,e,t){const s=new ee;return n.asyncQueue.enqueue(async()=>{try{await Zl(n,t),await eh(n,e),s.resolve()}catch(r){if(!function(i){return i.name==="FirebaseError"?i.code===f.FAILED_PRECONDITION||i.code===f.UNIMPLEMENTED:typeof DOMException<"u"&&i instanceof DOMException?i.code===22||i.code===20||i.code===11:!0}(r))throw r;console.warn("Error enabling offline persistence. Falling back to persistence disabled: "+r),s.reject(r)}}).then(()=>s.promise)}function yp(n){if(n._initialized&&!n._terminated)throw new y(f.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new ee;return n._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(t){if(!xe.vt())return Promise.resolve();const s=t+"main";await xe.delete(s)}(vo(n._databaseId,n._persistenceKey)),e.resolve()}catch(t){e.reject(t)}}),e.promise}function wp(n){return function(e){const t=new ee;return e.asyncQueue.enqueueAndForget(async()=>Bm(await $o(e),t)),t.promise}(re(n=k(n,$)))}function vp(n){return np(re(n=k(n,$)))}function Ip(n){return sp(re(n=k(n,$)))}function Ep(n,e){const t=re(n=k(n,$)),s=new fp;return up(t,n._databaseId,e,s),s}function _p(n,e){return cp(re(n=k(n,$)),e).then(t=>t?new ge(n,null,t.query):null)}function dh(n){if(n._initialized||n._terminated)throw new y(f.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new y(f.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Z(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Oe(X.fromBase64String(e))}catch(t){throw new y(f.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Oe(X.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new y(f.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new y(f.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return N(this._lat,e._lat)||N(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp=/^__.*__$/;class Sp{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Rt(e,this.data,this.fieldMask,t,this.fieldTransforms):new ds(e,this.data,t,this.fieldTransforms)}}class fh{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Rt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function gh(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw T()}}class Lr{constructor(e,t,s,r,i,o){this.settings=e,this.databaseId=t,this.M=s,this.ignoreUndefinedProperties=r,i===void 0&&this.Ya(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Xa(){return this.settings.Xa}Za(e){return new Lr(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.M,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}tc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Za({path:s,ec:!1});return r.nc(e),r}sc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Za({path:s,ec:!1});return r.Ya(),r}ic(e){return this.Za({path:void 0,ec:!0})}rc(e){return or(e,this.settings.methodName,this.settings.oc||!1,this.path,this.settings.uc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Ya(){if(this.path)for(let e=0;e<this.path.length;e++)this.nc(this.path.get(e))}nc(e){if(e.length===0)throw this.rc("Document fields must not be empty");if(gh(this.Xa)&&Tp.test(e))throw this.rc('Document fields cannot begin and end with "__"')}}class bp{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.M=s||ps(e)}ac(e,t,s,r=!1){return new Lr({Xa:e,methodName:t,uc:s,path:Z.emptyPath(),ec:!1,oc:r},this.databaseId,this.M,this.ignoreUndefinedProperties)}}function Vt(n){const e=n._freezeSettings(),t=ps(n._databaseId);return new bp(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Mr(n,e,t,s,r,i={}){const o=n.ac(i.merge||i.mergeFields?2:0,e,t,r);Wo("Data must be an object, but it was:",o,s);const a=yh(s,o);let u,c;if(i.merge)u=new tn(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const d=bi(e,h,t);if(!o.contains(d))throw new y(f.INVALID_ARGUMENT,`Field '${d}' is specified in your field mask but missing from your input data.`);vh(l,d)||l.push(d)}u=new tn(l),c=o.fieldTransforms.filter(h=>u.covers(h.field))}else u=null,c=o.fieldTransforms;return new Sp(new de(a),u,c)}class vs extends Ft{_toFieldTransform(e){if(e.Xa!==2)throw e.Xa===1?e.rc(`${this._methodName}() can only appear at the top level of your update data`):e.rc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof vs}}function mh(n,e,t){return new Lr({Xa:3,uc:e.settings.uc,methodName:n._methodName,ec:t},e.databaseId,e.M,e.ignoreUndefinedProperties)}class Go extends Ft{_toFieldTransform(e){return new hs(e.path,new sn)}isEqual(e){return e instanceof Go}}class Ap extends Ft{constructor(e,t){super(e),this.cc=t}_toFieldTransform(e){const t=mh(this,e,!0),s=this.cc.map(i=>Bt(i,t)),r=new bt(s);return new hs(e.path,r)}isEqual(e){return this===e}}class Cp extends Ft{constructor(e,t){super(e),this.cc=t}_toFieldTransform(e){const t=mh(this,e,!0),s=this.cc.map(i=>Bt(i,t)),r=new At(s);return new hs(e.path,r)}isEqual(e){return this===e}}class Np extends Ft{constructor(e,t){super(e),this.hc=t}_toFieldTransform(e){const t=new rn(e.M,Xc(e.M,this.hc));return new hs(e.path,t)}isEqual(e){return this===e}}function jo(n,e,t,s){const r=n.ac(1,e,t);Wo("Data must be an object, but it was:",r,s);const i=[],o=de.empty();Lt(s,(u,c)=>{const l=Ho(e,u,t);c=R(c);const h=r.sc(l);if(c instanceof vs)i.push(l);else{const d=Bt(c,h);d!=null&&(i.push(l),o.set(l,d))}});const a=new tn(i);return new fh(o,a,r.fieldTransforms)}function zo(n,e,t,s,r,i){const o=n.ac(1,e,t),a=[bi(e,s,t)],u=[r];if(i.length%2!=0)throw new y(f.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(bi(e,i[d])),u.push(i[d+1]);const c=[],l=de.empty();for(let d=a.length-1;d>=0;--d)if(!vh(c,a[d])){const p=a[d];let m=u[d];m=R(m);const E=o.sc(p);if(m instanceof vs)c.push(p);else{const b=Bt(m,E);b!=null&&(c.push(p),l.set(p,b))}}const h=new tn(c);return new fh(l,h,o.fieldTransforms)}function ph(n,e,t,s=!1){return Bt(t,n.ac(s?4:3,e))}function Bt(n,e){if(wh(n=R(n)))return Wo("Unsupported field value:",e,n),yh(n,e);if(n instanceof Ft)return function(t,s){if(!gh(s.Xa))throw s.rc(`${t._methodName}() can only be used with update() and set()`);if(!s.path)throw s.rc(`${t._methodName}() is not currently supported inside arrays`);const r=t._toFieldTransform(s);r&&s.fieldTransforms.push(r)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.ec&&e.Xa!==4)throw e.rc("Nested arrays are not supported");return function(t,s){const r=[];let i=0;for(const o of t){let a=Bt(o,s.ic(i));a==null&&(a={nullValue:"NULL_VALUE"}),r.push(a),i++}return{arrayValue:{values:r}}}(n,e)}return function(t,s){if((t=R(t))===null)return{nullValue:"NULL_VALUE"};if(typeof t=="number")return Xc(s.M,t);if(typeof t=="boolean")return{booleanValue:t};if(typeof t=="string")return{stringValue:t};if(t instanceof Date){const r=G.fromDate(t);return{timestampValue:Wn(s.M,r)}}if(t instanceof G){const r=new G(t.seconds,1e3*Math.floor(t.nanoseconds/1e3));return{timestampValue:Wn(s.M,r)}}if(t instanceof kr)return{geoPointValue:{latitude:t.latitude,longitude:t.longitude}};if(t instanceof Oe)return{bytesValue:al(s.M,t._byteString)};if(t instanceof F){const r=s.databaseId,i=t.firestore._databaseId;if(!i.isEqual(r))throw s.rc(`Document reference is for database ${i.projectId}/${i.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:uo(t.firestore._databaseId||s.databaseId,t._key.path)}}throw s.rc(`Unsupported field value: ${xr(t)}`)}(n,e)}function yh(n,e){const t={};return Rc(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Lt(n,(s,r)=>{const i=Bt(r,e.tc(s));i!=null&&(t[s]=i)}),{mapValue:{fields:t}}}function wh(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof G||n instanceof kr||n instanceof Oe||n instanceof F||n instanceof Ft)}function Wo(n,e,t){if(!wh(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const s=xr(t);throw s==="an object"?e.rc(n+" a custom object"):e.rc(n+" "+s)}}function bi(n,e,t){if((e=R(e))instanceof et)return e._internalPath;if(typeof e=="string")return Ho(n,e);throw or("Field path arguments must be of type string or ",n,!1,void 0,t)}const Dp=new RegExp("[~\\*/\\[\\]]");function Ho(n,e,t){if(e.search(Dp)>=0)throw or(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new et(...e.split("."))._internalPath}catch{throw or(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function or(n,e,t,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${s}`),o&&(u+=` in document ${r}`),u+=")"),new y(f.INVALID_ARGUMENT,a+n+u)}function vh(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(e,t,s,r,i){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new F(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new xp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Rr("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class xp extends Jn{data(){return super.data()}}function Rr(n,e){return typeof e=="string"?Ho(n,e):e instanceof et?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ue extends Jn{constructor(e,t,s,r,i,o){super(e,t,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new On(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Rr("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class On extends Ue{data(e={}){return super.data(e)}}class tt{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new pt(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new On(this._firestore,this._userDataWriter,s.key,s,new pt(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new y(f.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,r){if(s._snapshot.oldDocs.isEmpty()){let i=0;return s._snapshot.docChanges.map(o=>({type:"added",doc:new On(s._firestore,s._userDataWriter,o.doc.key,o.doc,new pt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter),oldIndex:-1,newIndex:i++}))}{let i=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(o=>r||o.type!==3).map(o=>{const a=new On(s._firestore,s._userDataWriter,o.doc.key,o.doc,new pt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);let u=-1,c=-1;return o.type!==0&&(u=i.indexOf(o.doc.key),i=i.delete(o.doc.key)),o.type!==1&&(i=i.add(o.doc),c=i.indexOf(o.doc.key)),{type:kp(o.type),doc:a,oldIndex:u,newIndex:c}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function kp(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return T()}}function Ih(n,e){return n instanceof Ue&&e instanceof Ue?n._firestore===e._firestore&&n._key.isEqual(e._key)&&(n._document===null?e._document===null:n._document.isEqual(e._document))&&n._converter===e._converter:n instanceof tt&&e instanceof tt&&n._firestore===e._firestore&&ch(n.query,e.query)&&n.metadata.isEqual(e.metadata)&&n._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eh(n){if(Js(n)&&n.explicitOrderBy.length===0)throw new y(f.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Is{}function Ge(n,...e){for(const t of e)n=t._apply(n);return n}class Lp extends Is{constructor(e,t,s){super(),this.lc=e,this.fc=t,this.dc=s,this.type="where"}_apply(e){const t=Vt(e.firestore),s=function(r,i,o,a,u,c,l){let h;if(u.isKeyField()){if(c==="array-contains"||c==="array-contains-any")throw new y(f.INVALID_ARGUMENT,`Invalid Query. You can't perform '${c}' queries on documentId().`);if(c==="in"||c==="not-in"){pu(l,c);const p=[];for(const m of l)p.push(mu(a,r,m));h={arrayValue:{values:p}}}else h=mu(a,r,l)}else c!=="in"&&c!=="not-in"&&c!=="array-contains-any"||pu(l,c),h=ph(o,i,l,c==="in"||c==="not-in");const d=ue.create(u,c,h);return function(p,m){if(m.S()){const b=ro(p);if(b!==null&&!b.isEqual(m.field))throw new y(f.INVALID_ARGUMENT,`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${b.toString()}' and '${m.field.toString()}'`);const L=so(p);L!==null&&Ah(p,m.field,L)}const E=function(b,L){for(const z of b.filters)if(L.indexOf(z.op)>=0)return z.op;return null}(p,function(b){switch(b){case"!=":return["!=","not-in"];case"array-contains":return["array-contains","array-contains-any","not-in"];case"in":return["array-contains-any","in","not-in"];case"array-contains-any":return["array-contains","array-contains-any","in","not-in"];case"not-in":return["array-contains","array-contains-any","in","not-in","!="];default:return[]}}(m.op));if(E!==null)throw E===m.op?new y(f.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${m.op.toString()}' filter.`):new y(f.INVALID_ARGUMENT,`Invalid query. You cannot use '${m.op.toString()}' filters with '${E.toString()}' filters.`)}(r,d),d}(e._query,"where",t,e.firestore._databaseId,this.lc,this.fc,this.dc);return new ge(e.firestore,e.converter,function(r,i){const o=r.filters.concat([i]);return new qe(r.path,r.collectionGroup,r.explicitOrderBy.slice(),o,r.limit,r.limitType,r.startAt,r.endAt)}(e._query,s))}}function Mp(n,e,t){const s=e,r=Rr("where",n);return new Lp(r,s,t)}class Rp extends Is{constructor(e,t){super(),this.lc=e,this._c=t,this.type="orderBy"}_apply(e){const t=function(s,r,i){if(s.startAt!==null)throw new y(f.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new y(f.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");const o=new Xt(r,i);return function(a,u){if(so(a)===null){const c=ro(a);c!==null&&Ah(a,c,u.field)}}(s,o),o}(e._query,this.lc,this._c);return new ge(e.firestore,e.converter,function(s,r){const i=s.explicitOrderBy.concat([r]);return new qe(s.path,s.collectionGroup,i,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function Op(n,e="asc"){const t=e,s=Rr("orderBy",n);return new Rp(s,t)}class _h extends Is{constructor(e,t,s){super(),this.type=e,this.wc=t,this.mc=s}_apply(e){return new ge(e.firestore,e.converter,jc(e._query,this.wc,this.mc))}}function Pp(n){return oh("limit",n),new _h("limit",n,"F")}function Fp(n){return oh("limitToLast",n),new _h("limitToLast",n,"L")}class Th extends Is{constructor(e,t,s){super(),this.type=e,this.gc=t,this.yc=s}_apply(e){const t=bh(e,this.type,this.gc,this.yc);return new ge(e.firestore,e.converter,function(s,r){return new qe(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,r,s.endAt)}(e._query,t))}}function Vp(...n){return new Th("startAt",n,!0)}function Bp(...n){return new Th("startAfter",n,!1)}class Sh extends Is{constructor(e,t,s){super(),this.type=e,this.gc=t,this.yc=s}_apply(e){const t=bh(e,this.type,this.gc,this.yc);return new ge(e.firestore,e.converter,function(s,r){return new qe(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,r)}(e._query,t))}}function Up(...n){return new Sh("endBefore",n,!1)}function qp(...n){return new Sh("endAt",n,!0)}function bh(n,e,t,s){if(t[0]=R(t[0]),t[0]instanceof Jn)return function(r,i,o,a,u){if(!a)throw new y(f.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${o}().`);const c=[];for(const l of nn(r))if(l.field.isKeyField())c.push(Tt(i,a.key));else{const h=a.data.field(l.field);if(no(h))throw new y(f.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+l.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(h===null){const d=l.field.canonicalString();throw new y(f.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${d}' (used as the orderBy) does not exist.`)}c.push(h)}return new Je(c,u)}(n._query,n.firestore._databaseId,e,t[0]._document,s);{const r=Vt(n.firestore);return function(i,o,a,u,c,l){const h=i.explicitOrderBy;if(c.length>h.length)throw new y(f.INVALID_ARGUMENT,`Too many arguments provided to ${u}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const d=[];for(let p=0;p<c.length;p++){const m=c[p];if(h[p].field.isKeyField()){if(typeof m!="string")throw new y(f.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${u}(), but got a ${typeof m}`);if(!io(i)&&m.indexOf("/")!==-1)throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${u}() must be a plain document ID, but '${m}' contains a slash.`);const E=i.path.child(x.fromString(m));if(!v.isDocumentKey(E))throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${u}() must result in a valid document path, but '${E}' is not because it contains an odd number of segments.`);const b=new v(E);d.push(Tt(o,b))}else{const E=ph(a,u,m);d.push(E)}}return new Je(d,l)}(n._query,n.firestore._databaseId,r,e,t,s)}}function mu(n,e,t){if(typeof(t=R(t))=="string"){if(t==="")throw new y(f.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!io(e)&&t.indexOf("/")!==-1)throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(x.fromString(t));if(!v.isDocumentKey(s))throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Tt(n,new v(s))}if(t instanceof F)return Tt(n,t._key);throw new y(f.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xr(t)}.`)}function pu(n,e){if(!Array.isArray(n)||n.length===0)throw new y(f.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);if(n.length>10)throw new y(f.INVALID_ARGUMENT,`Invalid Query. '${e.toString()}' filters support a maximum of 10 elements in the value array.`)}function Ah(n,e,t){if(!t.isEqual(e))throw new y(f.INVALID_ARGUMENT,`Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${t.toString()}' instead.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo{convertValue(e,t="none"){switch(_t(e)){case 0:return null;case 1:return e.booleanValue;case 2:return q(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Et(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 10:return this.convertObject(e.mapValue,t);default:throw T()}}convertObject(e,t){const s={};return Lt(e.fields,(r,i)=>{s[r]=this.convertValue(i,t)}),s}convertGeoPoint(e){return new kr(q(e.latitude),q(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Oc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Kn(e));default:return null}}convertTimestamp(e){const t=Qe(e);return new G(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=x.fromString(e);A(pl(s));const r=new Ve(s.get(1),s.get(3)),i=new v(s.popFirst(5));return r.isEqual(t)||H(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Or(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class $p extends Yo{constructor(e){super(),this.firestore=e}convertBytes(e){return new Oe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new F(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kp{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Vt(e)}set(e,t,s){this._verifyNotCommitted();const r=We(e,this._firestore),i=Or(r.converter,t,s),o=Mr(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(o.toMutation(r._key,Y.none())),this}update(e,t,s,...r){this._verifyNotCommitted();const i=We(e,this._firestore);let o;return o=typeof(t=R(t))=="string"||t instanceof et?zo(this._dataReader,"WriteBatch.update",i._key,t,s,r):jo(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,Y.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=We(e,this._firestore);return this._mutations=this._mutations.concat(new fs(t._key,Y.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new y(f.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function We(n,e){if((n=R(n)).firestore!==e)throw new y(f.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gp(n){n=k(n,F);const e=k(n.firestore,$);return sh(re(e),n._key).then(t=>Qo(e,n,t))}class Ut extends Yo{constructor(e){super(),this.firestore=e}convertBytes(e){return new Oe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new F(this.firestore,null,t)}}function jp(n){n=k(n,F);const e=k(n.firestore,$),t=re(e),s=new Ut(e);return rp(t,n._key).then(r=>new Ue(e,s,n._key,r,new pt(r!==null&&r.hasLocalMutations,!0),n.converter))}function zp(n){n=k(n,F);const e=k(n.firestore,$);return sh(re(e),n._key,{source:"server"}).then(t=>Qo(e,n,t))}function Wp(n){n=k(n,ge);const e=k(n.firestore,$),t=re(e),s=new Ut(e);return Eh(n._query),rh(t,n._query).then(r=>new tt(e,s,n,r))}function Hp(n){n=k(n,ge);const e=k(n.firestore,$),t=re(e),s=new Ut(e);return ip(t,n._query).then(r=>new tt(e,s,n,r))}function Yp(n){n=k(n,ge);const e=k(n.firestore,$),t=re(e),s=new Ut(e);return rh(t,n._query,{source:"server"}).then(r=>new tt(e,s,n,r))}function yu(n,e,t){n=k(n,F);const s=k(n.firestore,$),r=Or(n.converter,e,t);return Es(s,[Mr(Vt(s),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,Y.none())])}function wu(n,e,t,...s){n=k(n,F);const r=k(n.firestore,$),i=Vt(r);let o;return o=typeof(e=R(e))=="string"||e instanceof et?zo(i,"updateDoc",n._key,e,t,s):jo(i,"updateDoc",n._key,e),Es(r,[o.toMutation(n._key,Y.exists(!0))])}function Qp(n){return Es(k(n.firestore,$),[new fs(n._key,Y.none())])}function Xp(n,e){const t=k(n.firestore,$),s=ir(n),r=Or(n.converter,e);return Es(t,[Mr(Vt(n.firestore),"addDoc",s._key,r,n.converter!==null,{}).toMutation(s._key,Y.exists(!1))]).then(()=>s)}function Ch(n,...e){var t,s,r;n=R(n);let i={includeMetadataChanges:!1},o=0;typeof e[o]!="object"||Si(e[o])||(i=e[o],o++);const a={includeMetadataChanges:i.includeMetadataChanges};if(Si(e[o])){const h=e[o];e[o]=(t=h.next)===null||t===void 0?void 0:t.bind(h),e[o+1]=(s=h.error)===null||s===void 0?void 0:s.bind(h),e[o+2]=(r=h.complete)===null||r===void 0?void 0:r.bind(h)}let u,c,l;if(n instanceof F)c=k(n.firestore,$),l=pn(n._key.path),u={next:h=>{e[o]&&e[o](Qo(c,n,h))},error:e[o+1],complete:e[o+2]};else{const h=k(n,ge);c=k(h.firestore,$),l=h._query;const d=new Ut(c);u={next:p=>{e[o]&&e[o](new tt(c,d,h,p))},error:e[o+1],complete:e[o+2]},Eh(n._query)}return function(h,d,p,m){const E=new Nr(m),b=new Lo(d,E,p);return h.asyncQueue.enqueueAndForget(async()=>Do(await ln(h),b)),()=>{E.Ia(),h.asyncQueue.enqueueAndForget(async()=>xo(await ln(h),b))}}(re(c),l,a,u)}function Jp(n,e){return op(re(n=k(n,$)),Si(e)?e:{next:e})}function Es(n,e){return function(t,s){const r=new ee;return t.asyncQueue.enqueueAndForget(async()=>Om(await $o(t),s,r)),r.promise}(re(n),e)}function Qo(n,e,t){const s=t.docs.get(e._key),r=new Ut(n);return new Ue(n,r,e._key,s,new pt(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zp extends class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Vt(e)}get(e){const t=We(e,this._firestore),s=new $p(this._firestore);return this._transaction.lookup([t._key]).then(r=>{if(!r||r.length!==1)return T();const i=r[0];if(i.isFoundDocument())return new Jn(this._firestore,s,i.key,i,t.converter);if(i.isNoDocument())return new Jn(this._firestore,s,t._key,null,t.converter);throw T()})}set(e,t,s){const r=We(e,this._firestore),i=Or(r.converter,t,s),o=Mr(this._dataReader,"Transaction.set",r._key,i,r.converter!==null,s);return this._transaction.set(r._key,o),this}update(e,t,s,...r){const i=We(e,this._firestore);let o;return o=typeof(t=R(t))=="string"||t instanceof et?zo(this._dataReader,"Transaction.update",i._key,t,s,r):jo(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=We(e,this._firestore);return this._transaction.delete(t._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=We(e,this._firestore),s=new Ut(this._firestore);return super.get(e).then(r=>new Ue(this._firestore,s,t._key,r._document,new pt(!1,!1),t.converter))}}function ey(n,e){return ap(re(n=k(n,$)),t=>e(new Zp(n,t)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ty(){return new vs("deleteField")}function ny(){return new Go("serverTimestamp")}function sy(...n){return new Ap("arrayUnion",n)}function ry(...n){return new Cp("arrayRemove",n)}function iy(n){return new Np("increment",n)}(function(n,e=!0){(function(t){mn=t})(Nu),Cu(new xi("firestore",(t,{options:s})=>{const r=t.getProvider("app").getImmediate(),i=new $(r,new lf(t.getProvider("auth-internal")),new gf(t.getProvider("app-check-internal")));return s=Object.assign({useFetchStreams:e},s),i._setSettings(s),i},"PUBLIC")),Vs(pa,"3.4.8",n),Vs(pa,"3.4.8","esm2017")})();const oy="@firebase/firestore-compat",ay="0.1.17";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xo(n,e){if(e===void 0)return{merge:!1};if(e.mergeFields!==void 0&&e.merge!==void 0)throw new y("invalid-argument",`Invalid options passed to function ${n}(): You cannot specify both "merge" and "mergeFields".`);return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vu(){if(typeof Uint8Array>"u")throw new y("unimplemented","Uint8Arrays are not available in this environment.")}function Iu(){if(!yf())throw new y("unimplemented","Blobs are unavailable in Firestore in this environment.")}class Zn{constructor(e){this._delegate=e}static fromBase64String(e){return Iu(),new Zn(Oe.fromBase64String(e))}static fromUint8Array(e){return vu(),new Zn(Oe.fromUint8Array(e))}toBase64(){return Iu(),this._delegate.toBase64()}toUint8Array(){return vu(),this._delegate.toUint8Array()}isEqual(e){return this._delegate.isEqual(e._delegate)}toString(){return"Blob(base64: "+this.toBase64()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(n){return uy(n,["next","error","complete"])}function uy(n,e){if(typeof n!="object"||n===null)return!1;const t=n;for(const s of e)if(s in t&&typeof t[s]=="function")return!0;return!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{enableIndexedDbPersistence(e,t){return mp(e._delegate,{forceOwnership:t})}enableMultiTabIndexedDbPersistence(e){return pp(e._delegate)}clearIndexedDbPersistence(e){return yp(e._delegate)}}class Nh{constructor(e,t,s){this._delegate=t,this._persistenceProvider=s,this.INTERNAL={delete:()=>this.terminate()},e instanceof Ve||(this._appCompat=e)}get _databaseId(){return this._delegate._databaseId}settings(e){const t=this._delegate._getSettings();!e.merge&&t.host!==e.host&&qn("You are overriding the original host. If you did not intend to override your settings, use {merge: true}."),e.merge&&(e=Object.assign(Object.assign({},t),e),delete e.merge),this._delegate._setSettings(e)}useEmulator(e,t,s={}){lp(this._delegate,e,t,s)}enableNetwork(){return vp(this._delegate)}disableNetwork(){return Ip(this._delegate)}enablePersistence(e){let t=!1,s=!1;return e&&(t=!!e.synchronizeTabs,s=!!e.experimentalForceOwningTab,ih("synchronizeTabs",t,"experimentalForceOwningTab",s)),t?this._persistenceProvider.enableMultiTabIndexedDbPersistence(this):this._persistenceProvider.enableIndexedDbPersistence(this,s)}clearPersistence(){return this._persistenceProvider.clearIndexedDbPersistence(this)}terminate(){return this._appCompat&&(this._appCompat._removeServiceInstance("firestore-compat"),this._appCompat._removeServiceInstance("firestore")),this._delegate._delete()}waitForPendingWrites(){return wp(this._delegate)}onSnapshotsInSync(e){return Jp(this._delegate,e)}get app(){if(!this._appCompat)throw new y("failed-precondition","Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._appCompat}collection(e){try{return new hn(this,ah(this._delegate,e))}catch(t){throw ye(t,"collection()","Firestore.collection()")}}doc(e){try{return new Ne(this,ir(this._delegate,e))}catch(t){throw ye(t,"doc()","Firestore.doc()")}}collectionGroup(e){try{return new pe(this,hp(this._delegate,e))}catch(t){throw ye(t,"collectionGroup()","Firestore.collectionGroup()")}}runTransaction(e){return ey(this._delegate,t=>e(new Dh(this,t)))}batch(){return re(this._delegate),new xh(new Kp(this._delegate,e=>Es(this._delegate,e)))}loadBundle(e){return Ep(this._delegate,e)}namedQuery(e){return _p(this._delegate,e).then(t=>t?new pe(this,t):null)}}class Pr extends Yo{constructor(e){super(),this.firestore=e}convertBytes(e){return new Zn(new Oe(e))}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return Ne.forKey(t,this.firestore,null)}}function ly(n){of(n)}class Dh{constructor(e,t){this._firestore=e,this._delegate=t,this._userDataWriter=new Pr(e)}get(e){const t=yt(e);return this._delegate.get(t).then(s=>new es(this._firestore,new Ue(this._firestore._delegate,this._userDataWriter,s._key,s._document,s.metadata,t.converter)))}set(e,t,s){const r=yt(e);return s?(Xo("Transaction.set",s),this._delegate.set(r,t,s)):this._delegate.set(r,t),this}update(e,t,s,...r){const i=yt(e);return arguments.length===2?this._delegate.update(i,t):this._delegate.update(i,t,s,...r),this}delete(e){const t=yt(e);return this._delegate.delete(t),this}}class xh{constructor(e){this._delegate=e}set(e,t,s){const r=yt(e);return s?(Xo("WriteBatch.set",s),this._delegate.set(r,t,s)):this._delegate.set(r,t),this}update(e,t,s,...r){const i=yt(e);return arguments.length===2?this._delegate.update(i,t):this._delegate.update(i,t,s,...r),this}delete(e){const t=yt(e);return this._delegate.delete(t),this}commit(){return this._delegate.commit()}}class xt{constructor(e,t,s){this._firestore=e,this._userDataWriter=t,this._delegate=s}fromFirestore(e,t){const s=new On(this._firestore._delegate,this._userDataWriter,e._key,e._document,e.metadata,null);return this._delegate.fromFirestore(new ts(this._firestore,s),t??{})}toFirestore(e,t){return t?this._delegate.toFirestore(e,t):this._delegate.toFirestore(e)}static getInstance(e,t){const s=xt.INSTANCES;let r=s.get(e);r||(r=new WeakMap,s.set(e,r));let i=r.get(t);return i||(i=new xt(e,new Pr(e),t),r.set(t,i)),i}}xt.INSTANCES=new WeakMap;class Ne{constructor(e,t){this.firestore=e,this._delegate=t,this._userDataWriter=new Pr(e)}static forPath(e,t,s){if(e.length%2!==0)throw new y("invalid-argument",`Invalid document reference. Document references must have an even number of segments, but ${e.canonicalString()} has ${e.length}`);return new Ne(t,new F(t._delegate,s,new v(e)))}static forKey(e,t,s){return new Ne(t,new F(t._delegate,s,e))}get id(){return this._delegate.id}get parent(){return new hn(this.firestore,this._delegate.parent)}get path(){return this._delegate.path}collection(e){try{return new hn(this.firestore,ah(this._delegate,e))}catch(t){throw ye(t,"collection()","DocumentReference.collection()")}}isEqual(e){return e=R(e),e instanceof F?uh(this._delegate,e):!1}set(e,t){t=Xo("DocumentReference.set",t);try{return t?yu(this._delegate,e,t):yu(this._delegate,e)}catch(s){throw ye(s,"setDoc()","DocumentReference.set()")}}update(e,t,...s){try{return arguments.length===1?wu(this._delegate,e):wu(this._delegate,e,t,...s)}catch(r){throw ye(r,"updateDoc()","DocumentReference.update()")}}delete(){return Qp(this._delegate)}onSnapshot(...e){const t=kh(e),s=Lh(e,r=>new es(this.firestore,new Ue(this.firestore._delegate,this._userDataWriter,r._key,r._document,r.metadata,this._delegate.converter)));return Ch(this._delegate,t,s)}get(e){let t;return(e==null?void 0:e.source)==="cache"?t=jp(this._delegate):(e==null?void 0:e.source)==="server"?t=zp(this._delegate):t=Gp(this._delegate),t.then(s=>new es(this.firestore,new Ue(this.firestore._delegate,this._userDataWriter,s._key,s._document,s.metadata,this._delegate.converter)))}withConverter(e){return new Ne(this.firestore,e?this._delegate.withConverter(xt.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}function ye(n,e,t){return n.message=n.message.replace(e,t),n}function kh(n){for(const e of n)if(typeof e=="object"&&!Ai(e))return e;return{}}function Lh(n,e){var t,s;let r;return Ai(n[0])?r=n[0]:Ai(n[1])?r=n[1]:typeof n[0]=="function"?r={next:n[0],error:n[1],complete:n[2]}:r={next:n[1],error:n[2],complete:n[3]},{next:i=>{r.next&&r.next(e(i))},error:(t=r.error)===null||t===void 0?void 0:t.bind(r),complete:(s=r.complete)===null||s===void 0?void 0:s.bind(r)}}class es{constructor(e,t){this._firestore=e,this._delegate=t}get ref(){return new Ne(this._firestore,this._delegate.ref)}get id(){return this._delegate.id}get metadata(){return this._delegate.metadata}get exists(){return this._delegate.exists()}data(e){return this._delegate.data(e)}get(e,t){return this._delegate.get(e,t)}isEqual(e){return Ih(this._delegate,e._delegate)}}class ts extends es{data(e){const t=this._delegate.data(e);return af(t!==void 0),t}}class pe{constructor(e,t){this.firestore=e,this._delegate=t,this._userDataWriter=new Pr(e)}where(e,t,s){try{return new pe(this.firestore,Ge(this._delegate,Mp(e,t,s)))}catch(r){throw ye(r,/(orderBy|where)\(\)/,"Query.$1()")}}orderBy(e,t){try{return new pe(this.firestore,Ge(this._delegate,Op(e,t)))}catch(s){throw ye(s,/(orderBy|where)\(\)/,"Query.$1()")}}limit(e){try{return new pe(this.firestore,Ge(this._delegate,Pp(e)))}catch(t){throw ye(t,"limit()","Query.limit()")}}limitToLast(e){try{return new pe(this.firestore,Ge(this._delegate,Fp(e)))}catch(t){throw ye(t,"limitToLast()","Query.limitToLast()")}}startAt(...e){try{return new pe(this.firestore,Ge(this._delegate,Vp(...e)))}catch(t){throw ye(t,"startAt()","Query.startAt()")}}startAfter(...e){try{return new pe(this.firestore,Ge(this._delegate,Bp(...e)))}catch(t){throw ye(t,"startAfter()","Query.startAfter()")}}endBefore(...e){try{return new pe(this.firestore,Ge(this._delegate,Up(...e)))}catch(t){throw ye(t,"endBefore()","Query.endBefore()")}}endAt(...e){try{return new pe(this.firestore,Ge(this._delegate,qp(...e)))}catch(t){throw ye(t,"endAt()","Query.endAt()")}}isEqual(e){return ch(this._delegate,e._delegate)}get(e){let t;return(e==null?void 0:e.source)==="cache"?t=Hp(this._delegate):(e==null?void 0:e.source)==="server"?t=Yp(this._delegate):t=Wp(this._delegate),t.then(s=>new Ci(this.firestore,new tt(this.firestore._delegate,this._userDataWriter,this._delegate,s._snapshot)))}onSnapshot(...e){const t=kh(e),s=Lh(e,r=>new Ci(this.firestore,new tt(this.firestore._delegate,this._userDataWriter,this._delegate,r._snapshot)));return Ch(this._delegate,t,s)}withConverter(e){return new pe(this.firestore,e?this._delegate.withConverter(xt.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}class hy{constructor(e,t){this._firestore=e,this._delegate=t}get type(){return this._delegate.type}get doc(){return new ts(this._firestore,this._delegate.doc)}get oldIndex(){return this._delegate.oldIndex}get newIndex(){return this._delegate.newIndex}}class Ci{constructor(e,t){this._firestore=e,this._delegate=t}get query(){return new pe(this._firestore,this._delegate.query)}get metadata(){return this._delegate.metadata}get size(){return this._delegate.size}get empty(){return this._delegate.empty}get docs(){return this._delegate.docs.map(e=>new ts(this._firestore,e))}docChanges(e){return this._delegate.docChanges(e).map(t=>new hy(this._firestore,t))}forEach(e,t){this._delegate.forEach(s=>{e.call(t,new ts(this._firestore,s))})}isEqual(e){return Ih(this._delegate,e._delegate)}}class hn extends pe{constructor(e,t){super(e,t),this.firestore=e,this._delegate=t}get id(){return this._delegate.id}get path(){return this._delegate.path}get parent(){const e=this._delegate.parent;return e?new Ne(this.firestore,e):null}doc(e){try{return e===void 0?new Ne(this.firestore,ir(this._delegate)):new Ne(this.firestore,ir(this._delegate,e))}catch(t){throw ye(t,"doc()","CollectionReference.doc()")}}add(e){return Xp(this._delegate,e).then(t=>new Ne(this.firestore,t))}isEqual(e){return uh(this._delegate,e._delegate)}withConverter(e){return new hn(this.firestore,e?this._delegate.withConverter(xt.getInstance(this.firestore,e)):this._delegate.withConverter(null))}}function yt(n){return k(n,F)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(...e){this._delegate=new et(...e)}static documentId(){return new Jo(Z.keyField().canonicalString())}isEqual(e){return e=R(e),e instanceof et?this._delegate._internalPath.isEqual(e._internalPath):!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e){this._delegate=e}static serverTimestamp(){const e=ny();return e._methodName="FieldValue.serverTimestamp",new ft(e)}static delete(){const e=ty();return e._methodName="FieldValue.delete",new ft(e)}static arrayUnion(...e){const t=sy(...e);return t._methodName="FieldValue.arrayUnion",new ft(t)}static arrayRemove(...e){const t=ry(...e);return t._methodName="FieldValue.arrayRemove",new ft(t)}static increment(e){const t=iy(e);return t._methodName="FieldValue.increment",new ft(t)}isEqual(e){return this._delegate.isEqual(e._delegate)}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy={Firestore:Nh,GeoPoint:kr,Timestamp:G,Blob:Zn,Transaction:Dh,WriteBatch:xh,DocumentReference:Ne,DocumentSnapshot:es,Query:pe,QueryDocumentSnapshot:ts,QuerySnapshot:Ci,CollectionReference:hn,FieldPath:Jo,FieldValue:ft,setLogLevel:ly,CACHE_SIZE_UNLIMITED:gp};function fy(n,e){n.INTERNAL.registerComponent(new xi("firestore-compat",t=>{const s=t.getProvider("app-compat").getImmediate(),r=t.getProvider("firestore").getImmediate();return e(s,r)},"PUBLIC").setServiceProps(Object.assign({},dy)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gy(n){fy(n,(e,t)=>new Nh(e,t,new cy)),n.registerVersion(oy,ay)}gy(xu);ku();const my=xu.firestore,Zo=my();Zo.settings({experimentalAutoDetectLongPolling:!0,merge:!0});Zo.enablePersistence({synchronizeTabs:!0});const py="root";var Mh=(n=>(n.APPLICATION_VERSIONS="applicationVersions",n.COOKIES_LAST_UPDATE="cookiesLastUpdate",n.FEATURE_FLAGS="featureFlags",n.MAINTENANCE="maintenance",n.UBBLE="ubble",n))(Mh||{}),yy=(n=>(n.COOKIES_LAST_UPDATE_BUILD_VERSION="buildVersion",n.COOKIES_LAST_UPDATE_DATE="lastUpdated",n))(yy||{}),wy=(n=>(n.DISABLE_ACTIVATION="disableActivation",n.ENABLE_ACHIEVEMENTS="enableAchievements",n.ENABLE_CULTURAL_SURVEY_MANDATORY="enableCulturalSurveyMandatory",n.ENABLE_HIDE_TICKET="enableHideTicket",n.ENABLE_PACIFIC_FRANC_CURRENCY="enablePacificFrancCurrency",n.ENABLE_PASS_FOR_ALL="enablePassForAll",n.ENABLE_REPLICA_ALGOLIA_INDEX="enableReplicaAlgoliaIndex",n.SHOW_REMOTE_GENERIC_BANNER="showRemoteBanner",n.TARGET_XP_CINE_FROM_OFFER="targetXpCineFromOffer",n.WIP_APP_V2_BUSINESS_BLOCK="wipAppV2BusinessBlock",n.WIP_APP_V2_CATEGORY_BLOCK="wipAppV2CategoryBlock",n.WIP_APP_V2_MULTI_VIDEO_MODULE="wipAppV2MultiVideoModule",n.WIP_APP_V2_VIDEO_9_16="wipAppV2Video9:16",n.WIP_ARTIST_PAGE="wipArtistPage",n.WIP_BOOKING_IMPROVE="wipBookingImprove",n.WIP_DISABLE_STORE_REVIEW="wipDisabledStoreReview",n.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS="wipDisplaySearchNbFacetResults",n.WIP_ENABLE_ACCES_LIBRE="wipEnableAccesLibre",n.WIP_ENABLE_DARK_MODE="wipEnableDarkMode",n.WIP_ENABLE_DYNAMIC_OPENING_HOURS="wipEnableDynamicOpeningHours",n.WIP_ENABLE_GOOGLE_SSO="wipEnableGoogleSSO",n.WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE="wipFlingBottomSheetNavigateToVenue",n.WIP_IS_OPEN_TO_PUBLIC="wipIsOpenToPublic",n.WIP_NEW_BOOKING_PAGE="wipNewBookingPage",n.WIP_NEW_HOME_MODULE_SIZES="wipNewHomeModuleSizes",n.WIP_OFFER_CHRONICLE_SECTION="wipOfferChronicleSection",n.WIP_OFFERS_IN_BOTTOM_SHEET="wipOffersInBottomSheet",n.WIP_REACTION_FEATURE="wipReactionFeature",n.WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS="wipThematicSearchConcertsAndFestivals",n.WIP_THEMATIC_SEARCH_THEATRE="wipThematicSearchTheatre",n.WIP_VENUE_ARTISTS_PLAYLIST="wipVenueArtistsPlaylist",n.WIP_VENUE_HEADLINE_OFFER="wipVenueHeadlineOffer",n.WIP_VENUE_MAP="wipVenueMap",n.WIP_VENUE_MAP_IN_SEARCH="wipVenueMapInSearch",n))(wy||{}),ar=(n=>(n.INFO="info",n.ERROR="error",n.IGNORED="ignored",n))(ar||{});class Rh extends Error{constructor(e,{logType:t,name:s,captureContext:r}={logType:"error"}){super(e),s&&(this.name=s),t==="info"&&Bs.captureException(this.message,{level:t}),t==="error"&&Bs.captureException(this,r)}}Rh.prototype.name="MonitoringError";const vy=(n,e)=>{class t extends Error{}t.prototype.name=e||"MonitoringError",Bs.captureException(new t(n))};class Iy extends Rh{constructor(e,{name:t="AsyncError",captureContext:s,retry:r,logType:i}={logType:"ignored"}){super(e,{name:t,captureContext:s,logType:i}),this.retry=r}}class ea extends Iy{constructor(e,{name:t="ScreenError",Screen:s,logType:r="info"}){super(e,{name:t,logType:r}),this.Screen=s}}ea.prototype.name="ScreenError";class cw extends ea{constructor(e,{Screen:t,callback:s,logType:r="info"}){const i=Array.isArray(e)||!e?"offerId is undefined":`Offer ${e} could not be retrieved`;super(i,{Screen:t,callback:s,logType:r})}}class lw extends ea{constructor(e,{Screen:t,callback:s,logType:r="info"}){const i=e?`Venue ${e} could not be retrieved`:"venueId is undefined";super(i,{Screen:t,callback:s,logType:r})}}const Ey=async()=>{try{return await Zo.collection(py).doc(Mh.FEATURE_FLAGS).get()}catch(n){return vy(Yh(n),"firestore_not_available"),null}},Ni={test_param:"A",aroundPrecision:0,homeEntryIdFreeOffers:"",homeEntryIdNotConnected:"",homeEntryIdGeneral:"",homeEntryIdOnboardingGeneral:"",homeEntryIdOnboardingUnderage:"",homeEntryIdOnboarding_18:"",homeEntryIdWithoutBooking_18:"",homeEntryIdWithoutBooking_15_17:"",homeEntryId_18:"",homeEntryId_15_17:"",reactionFakeDoorCategories:{categories:[]},sameAuthorPlaylist:"",shouldDisplayReassuranceMention:!1,shouldLogInfo:!1,displayAchievements:!1,displayInAppFeedback:!1,subscriptionHomeEntryIds:{[qt.CINEMA]:"",[qt.MUSIQUE]:"",[qt.LECTURE]:"",[qt.SPECTACLES]:"",[qt.VISITES]:"",[qt.ACTIVITES]:""},shareAppModalVersion:"default",showAccessScreeningButton:!1,shouldRedirectToThematicSearch:!1},Qr="@firebase/remote-config",Eu="0.3.7";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _y{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oh="remote-config";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ty={"registration-window":"Undefined window object. This SDK only supports usage in a browser environment.","registration-project-id":"Undefined project identifier. Check Firebase app initialization.","registration-api-key":"Undefined API key. Check Firebase app initialization.","registration-app-id":"Undefined app identifier. Check Firebase app initialization.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","storage-delete":"Error thrown when deleting from storage. Original error: {$originalErrorMessage}.","fetch-client-network":"Fetch client failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-timeout":'The config fetch request timed out.  Configure timeout using "fetchTimeoutMillis" SDK setting.',"fetch-throttle":'The config fetch request timed out while in an exponential backoff state. Configure timeout using "fetchTimeoutMillis" SDK setting. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.',"fetch-client-parse":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","indexed-db-unavailable":"Indexed DB is not supported by current browser"},Se=new Wh("remoteconfig","Remote Config",Ty);function Sy(n,e){return n instanceof ki&&n.code.indexOf(e)!==-1}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const by=!1,Ay="",_u=0,Cy=["1","true","t","yes","y","on"];class Xr{constructor(e,t=Ay){this._source=e,this._value=t}asString(){return this._value}asBoolean(){return this._source==="static"?by:Cy.indexOf(this._value.toLowerCase())>=0}asNumber(){if(this._source==="static")return _u;let e=Number(this._value);return isNaN(e)&&(e=_u),e}getSource(){return this._source}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ny(n=zh()){return n=R(n),jh(n,Oh).getImmediate()}async function Dy(n){const e=R(n),[t,s]=await Promise.all([e._storage.getLastSuccessfulFetchResponse(),e._storage.getActiveConfigEtag()]);return!t||!t.config||!t.eTag||t.eTag===s?!1:(await Promise.all([e._storageCache.setActiveConfig(t.config),e._storage.setActiveConfigEtag(t.eTag)]),!0)}function xy(n){const e=R(n);return e._initializePromise||(e._initializePromise=e._storageCache.loadFromStorage().then(()=>{e._isInitializationComplete=!0})),e._initializePromise}async function ky(n){const e=R(n),t=new _y;setTimeout(async()=>{t.abort()},e.settings.fetchTimeoutMillis);try{await e._client.fetch({cacheMaxAgeMillis:e.settings.minimumFetchIntervalMillis,signal:t}),await e._storageCache.setLastFetchStatus("success")}catch(s){const r=Sy(s,"fetch-throttle")?"throttle":"failure";throw await e._storageCache.setLastFetchStatus(r),s}}function Ly(n){const e=R(n);return Ry(e._storageCache.getActiveConfig(),e.defaultConfig).reduce((t,s)=>(t[s]=My(n,s),t),{})}function My(n,e){const t=R(n);t._isInitializationComplete||t._logger.debug(`A value was requested for key "${e}" before SDK initialization completed. Await on ensureInitialized if the intent was to get a previously activated value.`);const s=t._storageCache.getActiveConfig();return s&&s[e]!==void 0?new Xr("remote",s[e]):t.defaultConfig&&t.defaultConfig[e]!==void 0?new Xr("default",String(t.defaultConfig[e])):(t._logger.debug(`Returning static value for key "${e}". Define a default or remote value if this is unintentional.`),new Xr("static"))}function Ry(n={},e={}){return Object.keys(Object.assign(Object.assign({},n),e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(e,t,s,r){this.client=e,this.storage=t,this.storageCache=s,this.logger=r}isCachedDataFresh(e,t){if(!t)return this.logger.debug("Config fetch cache check. Cache unpopulated."),!1;const s=Date.now()-t,r=s<=e;return this.logger.debug(`Config fetch cache check. Cache age millis: ${s}. Cache max age millis (minimumFetchIntervalMillis setting): ${e}. Is cache hit: ${r}.`),r}async fetch(e){const[t,s]=await Promise.all([this.storage.getLastSuccessfulFetchTimestampMillis(),this.storage.getLastSuccessfulFetchResponse()]);if(s&&this.isCachedDataFresh(e.cacheMaxAgeMillis,t))return s;e.eTag=s&&s.eTag;const r=await this.client.fetch(e),i=[this.storageCache.setLastSuccessfulFetchTimestampMillis(Date.now())];return r.status===200&&i.push(this.storage.setLastSuccessfulFetchResponse(r)),await Promise.all(i),r}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Py(n=navigator){return n.languages&&n.languages[0]||n.language}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e,t,s,r,i,o){this.firebaseInstallations=e,this.sdkVersion=t,this.namespace=s,this.projectId=r,this.apiKey=i,this.appId=o}async fetch(e){const[t,s]=await Promise.all([this.firebaseInstallations.getId(),this.firebaseInstallations.getToken()]),i=`${window.FIREBASE_REMOTE_CONFIG_URL_BASE||"https://firebaseremoteconfig.googleapis.com"}/v1/projects/${this.projectId}/namespaces/${this.namespace}:fetch?key=${this.apiKey}`,o={"Content-Type":"application/json","Content-Encoding":"gzip","If-None-Match":e.eTag||"*"},a={sdk_version:this.sdkVersion,app_instance_id:t,app_instance_id_token:s,app_id:this.appId,language_code:Py()},u={method:"POST",headers:o,body:JSON.stringify(a)},c=fetch(i,u),l=new Promise((b,L)=>{e.signal.addEventListener(()=>{const z=new Error("The operation was aborted.");z.name="AbortError",L(z)})});let h;try{await Promise.race([c,l]),h=await c}catch(b){let L="fetch-client-network";throw b.name==="AbortError"&&(L="fetch-timeout"),Se.create(L,{originalErrorMessage:b.message})}let d=h.status;const p=h.headers.get("ETag")||void 0;let m,E;if(h.status===200){let b;try{b=await h.json()}catch(L){throw Se.create("fetch-client-parse",{originalErrorMessage:L.message})}m=b.entries,E=b.state}if(E==="INSTANCE_STATE_UNSPECIFIED"?d=500:E==="NO_CHANGE"?d=304:(E==="NO_TEMPLATE"||E==="EMPTY_CONFIG")&&(m={}),d!==304&&d!==200)throw Se.create("fetch-status",{httpStatus:d});return{status:d,eTag:p,config:m}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vy(n,e){return new Promise((t,s)=>{const r=Math.max(e-Date.now(),0),i=setTimeout(t,r);n.addEventListener(()=>{clearTimeout(i),s(Se.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function By(n){if(!(n instanceof ki)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Uy{constructor(e,t){this.client=e,this.storage=t}async fetch(e){const t=await this.storage.getThrottleMetadata()||{backoffCount:0,throttleEndTimeMillis:Date.now()};return this.attemptFetch(e,t)}async attemptFetch(e,{throttleEndTimeMillis:t,backoffCount:s}){await Vy(e.signal,t);try{const r=await this.client.fetch(e);return await this.storage.deleteThrottleMetadata(),r}catch(r){if(!By(r))throw r;const i={throttleEndTimeMillis:Date.now()+Hh(s),backoffCount:s+1};return await this.storage.setThrottleMetadata(i),this.attemptFetch(e,i)}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qy=60*1e3,$y=12*60*60*1e3;class Ky{constructor(e,t,s,r,i){this.app=e,this._client=t,this._storageCache=s,this._storage=r,this._logger=i,this._isInitializationComplete=!1,this.settings={fetchTimeoutMillis:qy,minimumFetchIntervalMillis:$y},this.defaultConfig={}}get fetchTimeMillis(){return this._storageCache.getLastSuccessfulFetchTimestampMillis()||-1}get lastFetchStatus(){return this._storageCache.getLastFetchStatus()||"no-fetch-yet"}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(n,e){const t=n.target.error||void 0;return Se.create(e,{originalErrorMessage:t&&t.message})}const lt="app_namespace_store",Gy="firebase_remote_config",jy=1;function zy(){return new Promise((n,e)=>{try{const t=indexedDB.open(Gy,jy);t.onerror=s=>{e(Fs(s,"storage-open"))},t.onsuccess=s=>{n(s.target.result)},t.onupgradeneeded=s=>{const r=s.target.result;switch(s.oldVersion){case 0:r.createObjectStore(lt,{keyPath:"compositeKey"})}}}catch(t){e(Se.create("storage-open",{originalErrorMessage:t}))}})}class Wy{constructor(e,t,s,r=zy()){this.appId=e,this.appName=t,this.namespace=s,this.openDbPromise=r}getLastFetchStatus(){return this.get("last_fetch_status")}setLastFetchStatus(e){return this.set("last_fetch_status",e)}getLastSuccessfulFetchTimestampMillis(){return this.get("last_successful_fetch_timestamp_millis")}setLastSuccessfulFetchTimestampMillis(e){return this.set("last_successful_fetch_timestamp_millis",e)}getLastSuccessfulFetchResponse(){return this.get("last_successful_fetch_response")}setLastSuccessfulFetchResponse(e){return this.set("last_successful_fetch_response",e)}getActiveConfig(){return this.get("active_config")}setActiveConfig(e){return this.set("active_config",e)}getActiveConfigEtag(){return this.get("active_config_etag")}setActiveConfigEtag(e){return this.set("active_config_etag",e)}getThrottleMetadata(){return this.get("throttle_metadata")}setThrottleMetadata(e){return this.set("throttle_metadata",e)}deleteThrottleMetadata(){return this.delete("throttle_metadata")}async get(e){const t=await this.openDbPromise;return new Promise((s,r)=>{const o=t.transaction([lt],"readonly").objectStore(lt),a=this.createCompositeKey(e);try{const u=o.get(a);u.onerror=c=>{r(Fs(c,"storage-get"))},u.onsuccess=c=>{const l=c.target.result;s(l?l.value:void 0)}}catch(u){r(Se.create("storage-get",{originalErrorMessage:u&&u.message}))}})}async set(e,t){const s=await this.openDbPromise;return new Promise((r,i)=>{const a=s.transaction([lt],"readwrite").objectStore(lt),u=this.createCompositeKey(e);try{const c=a.put({compositeKey:u,value:t});c.onerror=l=>{i(Fs(l,"storage-set"))},c.onsuccess=()=>{r()}}catch(c){i(Se.create("storage-set",{originalErrorMessage:c&&c.message}))}})}async delete(e){const t=await this.openDbPromise;return new Promise((s,r)=>{const o=t.transaction([lt],"readwrite").objectStore(lt),a=this.createCompositeKey(e);try{const u=o.delete(a);u.onerror=c=>{r(Fs(c,"storage-delete"))},u.onsuccess=()=>{s()}}catch(u){r(Se.create("storage-delete",{originalErrorMessage:u&&u.message}))}})}createCompositeKey(e){return[this.appId,this.appName,this.namespace,e].join()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e){this.storage=e}getLastFetchStatus(){return this.lastFetchStatus}getLastSuccessfulFetchTimestampMillis(){return this.lastSuccessfulFetchTimestampMillis}getActiveConfig(){return this.activeConfig}async loadFromStorage(){const e=this.storage.getLastFetchStatus(),t=this.storage.getLastSuccessfulFetchTimestampMillis(),s=this.storage.getActiveConfig(),r=await e;r&&(this.lastFetchStatus=r);const i=await t;i&&(this.lastSuccessfulFetchTimestampMillis=i);const o=await s;o&&(this.activeConfig=o)}setLastFetchStatus(e){return this.lastFetchStatus=e,this.storage.setLastFetchStatus(e)}setLastSuccessfulFetchTimestampMillis(e){return this.lastSuccessfulFetchTimestampMillis=e,this.storage.setLastSuccessfulFetchTimestampMillis(e)}setActiveConfig(e){return this.activeConfig=e,this.storage.setActiveConfig(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yy(){Cu(new xi(Oh,n,"PUBLIC").setMultipleInstances(!0)),Vs(Qr,Eu),Vs(Qr,Eu,"esm2017");function n(e,{instanceIdentifier:t}){const s=e.getProvider("app").getImmediate(),r=e.getProvider("installations-internal").getImmediate();if(typeof window>"u")throw Se.create("registration-window");if(!Du())throw Se.create("indexed-db-unavailable");const{projectId:i,apiKey:o,appId:a}=s.options;if(!i)throw Se.create("registration-project-id");if(!o)throw Se.create("registration-api-key");if(!a)throw Se.create("registration-app-id");t=t||"firebase";const u=new Wy(a,s.name,t),c=new Hy(u),l=new Au(Qr);l.logLevel=wt.ERROR;const h=new Fy(r,Nu,t,i,o,a),d=new Uy(h,u),p=new Oy(d,u,c,l),m=new Ky(s,p,c,u,l);return xy(m),m}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qy(n){return n=R(n),await ky(n),Dy(n)}Yy();function Xy(n){if(!n)return!1;const e=n;return typeof e.asString=="function"&&typeof e.asBoolean=="function"&&typeof e.asNumber=="function"&&typeof e.getSource=="function"}const U=n=>Xy(n)?n:{asBoolean:()=>!1,asNumber:()=>0,asString:()=>"",getSource:()=>"static"},Jy=n=>({test_param:U(n.test_param).asString(),aroundPrecision:JSON.parse(U(n.aroundPrecision).asString()),homeEntryIdFreeOffers:U(n.homeEntryIdFreeOffers).asString(),homeEntryIdNotConnected:U(n.homeEntryIdNotConnected).asString(),homeEntryIdGeneral:U(n.homeEntryIdGeneral).asString(),homeEntryIdOnboardingGeneral:U(n.homeEntryIdOnboardingGeneral).asString(),homeEntryIdOnboardingUnderage:U(n.homeEntryIdOnboardingUnderage).asString(),homeEntryIdOnboarding_18:U(n.homeEntryIdOnboarding_18).asString(),homeEntryIdWithoutBooking_18:U(n.homeEntryIdWithoutBooking_18).asString(),homeEntryIdWithoutBooking_15_17:U(n.homeEntryIdWithoutBooking_15_17).asString(),homeEntryId_18:U(n.homeEntryId_18).asString(),homeEntryId_15_17:U(n.homeEntryId_15_17).asString(),reactionFakeDoorCategories:JSON.parse(U(n.reactionFakeDoorCategories).asString()),sameAuthorPlaylist:U(n.sameAuthorPlaylist).asString(),shouldDisplayReassuranceMention:U(n.shouldDisplayReassuranceMention).asBoolean(),shouldLogInfo:U(n.shouldLogInfo).asBoolean(),displayAchievements:U(n.displayAchievements).asBoolean(),displayInAppFeedback:U(n.displayInAppFeedback).asBoolean(),subscriptionHomeEntryIds:JSON.parse(U(n.subscriptionHomeEntryIds).asString()),shareAppModalVersion:U(n.shareAppModalVersion).asString(),showAccessScreeningButton:U(n.showAccessScreeningButton).asBoolean(),shouldRedirectToThematicSearch:U(n.shouldRedirectToThematicSearch).asBoolean()}),Zy=ku(),Di=Ny(Zy);Di.defaultConfig=Ni;const Jr={async refresh(){return Qy(Di)},getValues(){const n=Ly(Di);return Jy(n)},async configure(){}},ew=async()=>(await Jr.configure(),await Jr.refresh(),Jr.getValues());function tw(){const{data:n=Ni}=Su([bu.REMOTE_CONFIG],ew,{placeholderData:Ni});return n}const nw=()=>{const{shouldLogInfo:n}=tw();return{logType:n?ar.INFO:ar.IGNORED}},Tu=Qh(),sw=n=>{const{data:e,isLoading:t}=Su(bu.FEATURE_FLAGS,Ey,{staleTime:3e4,enabled:Ph.isOnline()}),{logType:s}=nw();if(t||!e)return{isFeatureFlagActive:!1};const{minimalBuildNumber:r,maximalBuildNumber:i,options:o,owner:a}=e.get(n)??{};return r===void 0&&i===void 0?{isFeatureFlagActive:!1,owner:a,options:o}:r&&i&&r>i&&s===ar.INFO?(Bs.captureException(`Minimal build number is greater than maximal build number for feature flag ${n}`,{level:s,extra:{minimalBuildNumber:r,maximalBuildNumber:i}}),{isFeatureFlagActive:!1,owner:a,options:o}):{isFeatureFlagActive:(!r||r<=Tu)&&(!i||i>=Tu),owner:a,options:o}},hw=n=>sw(n).isFeatureFlagActive;export{Iy as A,py as F,ar as L,Rh as M,cw as O,wy as R,ea as S,lw as V,tw as a,sw as b,nw as c,vy as d,Mh as e,Zo as f,yy as g,hw as u};
