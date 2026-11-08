/* Dressingo visit notes: country, time, seconds, scroll %, sections, products, WhatsApp click. No cookies. ?me=1 excludes this device, ?me=0 undoes it. */
(function(){
"use strict";
var RELAY="https://dressingo-visits.sites.tab.bot/v";
try{
var Q=new URLSearchParams(location.search), LS=window.localStorage, SS=window.sessionStorage;
if(Q.get("me")==="1"){LS.setItem("dz_me","1");toast("✓ جهازك مستثنى من إشعارات الزوار");}
if(Q.get("me")==="0"){LS.removeItem("dz_me");toast("جهازك رجع ينحسب بالإشعارات");}
if(LS.getItem("dz_me")==="1")return;
var ua=navigator.userAgent||"";
if(/bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|pingdom|headless|python|curl|wget|bingpreview|google-inspectiontool/i.test(ua))return;
}catch(e){return}
function toast(t){try{var d=document.createElement("div");d.textContent=t;d.style.cssText="position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#111;color:#d4af37;padding:10px 16px;border-radius:10px;z-index:99999;font:14px sans-serif";(document.body||document.documentElement).appendChild(d);setTimeout(function(){d.remove()},4000)}catch(e){}}
var NAMES={"":"الرئيسية","index":"الرئيسية","women":"بيجامات نسائي","men":"بيجامات رجالي","sets":"أطقم","shorts":"أطقم شورت","lingerie":"لانجري","underwear":"داخلي نسائي","socks":"جوارب","shipping":"الشحن","blog/index":"المدونة","blog/":"المدونة"};
function pageName(){
  var p=location.pathname.replace(/^\/dressingo\/?/,"").replace(/\.html$/,"");
  if(NAMES[p])return NAMES[p];
  if(/^blog\//.test(p)){var t=(document.title||"").split(/[|—–-]/)[0].trim();return "مدونة: "+t.slice(0,40)}
  return (document.title||p).split("|")[0].trim().slice(0,40);
}
function source(){
  var u=(new URLSearchParams(location.search).get("utm_source")||"").toLowerCase(), r="";
  try{r=document.referrer?new URL(document.referrer).hostname.toLowerCase():""}catch(e){}
  var s=u+" "+r;
  if(/instagram|^ig\b/.test(s))return "instagram";
  if(/facebook|fb\.|^fb\b|messenger/.test(s))return "facebook";
  if(/whatsapp|wa\.me/.test(s))return "whatsapp";
  if(/t\.me|telegram/.test(s))return "telegram";
  if(/google/.test(s))return "google";
  if(/tiktok/.test(s))return "tiktok";
  if(/youtube|youtu\.be/.test(s))return "youtube";
  if(/bing/.test(s))return "bing";
  if(/yandex/.test(s))return "yandex";
  if(/snapchat/.test(s))return "snapchat";
  if(/twitter|t\.co|x\.com/.test(s))return "twitter";
  if(r && r.indexOf("github.io")<0 && r.indexOf("dressingo.pages.dev")<0) return r.slice(0,40);
  return u?u.slice(0,30):"direct";
}
function device(){var w=Math.min(screen.width||0,screen.height||0);if(/iPad|Tablet/i.test(ua)||(/Android/i.test(ua)&&!/Mobile/i.test(ua)))return "tablet";if(/Mobi|iPhone|Android/i.test(ua)||w&&w<500)return "mobile";return "desktop"}
function osName(){return /iPhone|iPad|iOS/.test(ua)?"iPhone":/Android/.test(ua)?"Android":/Windows/.test(ua)?"Windows":/Mac OS/.test(ua)?"Mac":/Linux/.test(ua)?"Linux":""}
function pad(n){return (n<10?"0":"")+n}
// session state (one visit = one browser tab session, across pages)
var S;try{S=JSON.parse(SS.getItem("dz_s")||"null")}catch(e){S=null}
if(!S){
  var vc=0;try{vc=(+LS.getItem("dz_vc")||0)+1;LS.setItem("dz_vc",String(vc))}catch(e){vc=1}
  var now=new Date();
  S={vc:vc,sec:0,scroll:0,pages:[],secs:[],prods:[],seen:0,wa:false,src:source(),dev:device(),os:osName(),lang:(navigator.language||"").slice(0,10),lt:pad(now.getHours())+":"+pad(now.getMinutes())};
}
var pn=pageName(); if(S.pages[S.pages.length-1]!==pn) S.pages.push(pn); S.pages=S.pages.slice(-8);
function save(){try{SS.setItem("dz_s",JSON.stringify(S))}catch(e){}}
save();
var visStart=document.visibilityState==="visible"?Date.now():0, base=S.sec;
function secs(){return base+(visStart?(Date.now()-visStart)/1000:0)}
function scrollPct(){var h=document.documentElement,b=document.body;var st=window.scrollY||h.scrollTop||0;var sh=Math.max(h.scrollHeight,b?b.scrollHeight:0)-window.innerHeight;return sh<=0?100:Math.min(100,Math.round((st/sh)*100))}
var pageMax=0;
window.addEventListener("scroll",function(){var p=scrollPct();if(p>pageMax){pageMax=p;if(p>S.scroll)S.scroll=p}},{passive:true});
function addUniq(a,v,n){if(v&&a.indexOf(v)<0){a.push(v);if(a.length>n)a.shift()}}
// sections seen (headings of sections) and products seen (cards on screen)
try{
  var seenCards={},io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;
    if(t.classList.contains("card")){var c=t.getAttribute("data-code");if(c&&!seenCards[c]){seenCards[c]=1;S.seen++}}
    else{var h=t.querySelector("h2,h1");var tx=h?h.textContent.trim().replace(/\s+/g," ").slice(0,28):"";if(tx)addUniq(S.secs,tx,10)}
    io.unobserve(t)})},{threshold:0.5});
  var watch=function(){document.querySelectorAll("section[aria-labelledby],.card[data-code]").forEach(function(el){if(!el.dataset.dzw){el.dataset.dzw="1";io.observe(el)}})};
  watch();setTimeout(watch,1500);setTimeout(watch,5000);
  if(window.MutationObserver){var mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(watch,400)});mo.observe(document.documentElement,{childList:true,subtree:true})}
}catch(e){}
document.addEventListener("click",function(e){
  var t=e.target;if(!t||!t.closest)return;
  var a=t.closest('a[href*="wa.me"],a[href*="whatsapp"],#lb-send,#sheet-send');
  if(a){S.wa=true;send("end",true);return}
  var b=t.closest(".add,.sw-b,.card");if(b){var card=b.closest(".card")||b;var c=card.getAttribute("data-code");if(c)addUniq(S.prods,c,10)}
},true);
var sending=false;
function payload(type){S.sec=Math.round(secs());return JSON.stringify({type:type,mid:S.mid,sig:S.sig,t0:S.t0,cc:S.cc,city:S.city,vc:S.vc,sec:S.sec,scroll:S.scroll,pages:S.pages,secs:S.secs,prods:S.prods,seen:S.seen,wa:S.wa,src:S.src,dev:S.dev,os:S.os,lang:S.lang,lt:S.lt})}
function start(){
  if(S.mid||sending||secs()<3)return; sending=true;
  fetch(RELAY,{method:"POST",body:payload("live"),headers:{"content-type":"text/plain"},keepalive:true,mode:"cors"}).then(function(r){return r.json()}).then(function(j){if(j&&j.mid){S.mid=j.mid;S.sig=j.sig;S.t0=j.t0;S.cc=j.cc;S.city=j.city;save()}}).catch(function(){}).then(function(){sending=false});
}
function send(type,force){
  save();
  if(!S.mid){ if(secs()<3||sending) return; var body=payload("end"); S.sent=1; try{navigator.sendBeacon(RELAY,new Blob([body],{type:"text/plain"}))}catch(e){} return; }
  var bd=payload(type); try{ if(!navigator.sendBeacon(RELAY,new Blob([bd],{type:"text/plain"}))) fetch(RELAY,{method:"POST",body:bd,keepalive:true,headers:{"content-type":"text/plain"}}) }catch(e){}
}
var st=setInterval(function(){ if(document.visibilityState==="visible"){ if(!S.mid) start(); else clearInterval(st) } },1000);
var lastBeat=0; setInterval(function(){ if(S.mid && document.visibilityState==="visible" && Date.now()-lastBeat>=20000){ lastBeat=Date.now(); send("beat") } },5000);
document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="hidden"){ if(visStart){base+= (Date.now()-visStart)/1000; visStart=0} S.sec=Math.round(base); send("end") }
  else { visStart=Date.now() }
});
window.addEventListener("pagehide",function(){ if(visStart){base+=(Date.now()-visStart)/1000;visStart=0} S.sec=Math.round(base); save(); if(document.visibilityState!=="hidden") send("end") });
})();
