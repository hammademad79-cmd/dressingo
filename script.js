(function(){try{var u=navigator.userAgent||"";if(/FBAN|FBAV|FB_IAB|FBIOS|FB4A|Instagram|Messenger|MessengerLite|; wv\)/.test(u))document.documentElement.classList.add("iab")}catch(e){}})();
(function(){
var WA="905334491040",WAD="+90 533 449 10 40",KEY="dt_list_v1",BKEY="dt_buyer_v1";
var COUNTRIES=["السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عُمان", "العراق", "الأردن", "فلسطين", "لبنان", "سوريا", "اليمن", "مصر", "ليبيا", "تونس", "الجزائر", "المغرب", "السودان", "موريتانيا", "الصومال", "جيبوتي", "جزر القمر"];
function load(){try{var l=JSON.parse(localStorage.getItem(KEY))||[];return l.filter(function(it){return it&&it.c}).map(function(it){it.q=Math.max(1,Math.min(99,parseInt(it.q,10)||1));return it})}catch(e){return[]}}
function save(l){try{localStorage.setItem(KEY,JSON.stringify(l))}catch(e){}}
function loadB(){try{return JSON.parse(localStorage.getItem(BKEY))||{}}catch(e){return{}}}
function saveB(){try{localStorage.setItem(BKEY,JSON.stringify(buyer))}catch(e){}}
var list=load(),buyer=loadB();
function tot(){return list.reduce(function(s,it){return s+(it.q||1)},0)}
function ser(n){return n===1?"سيري واحد":n===2?"سيريين":n+" سيري"}
function country(){return buyer.co==="__o"?(buyer.co2||"").trim():(buyer.co||"")}
function msg(){
 var sh=(buyer.shop||"").trim(),co=country(),ci=(buyer.city||"").trim(),t;
 if(!list.length){t="مرحباً Dressingo، أنا صاحب محل وبدي الكتالوج والأسعار بالجملة.";}
 else{
  t="مرحباً Dressingo 👋\nبدي أسعار هالموديلات بالجملة:\n\n";
  list.forEach(function(it,i){t+=(i+1)+") كود "+it.c+" × "+ser(it.q||1)+(it.k?" ("+it.k+")":"")+(it.n?" 🆕 موديل جديد، بدي عرض سعر":"")+"\n"});
  t+="\nالمجموع: "+ser(tot())+" من "+list.length+" موديل";
 }
 var info="";
 if(sh)info+="\nاسم المحل: "+sh;
 if(co)info+="\nالبلد: "+co;
 if(ci)info+="\nالمدينة: "+ci;
 if(info)t+="\n"+info;
 return t;
}
function url(){return "https://wa.me/"+WA+"?text="+encodeURIComponent(msg())}
function has(c){return list.some(function(it){return it.c===c})}
function setQ(c,d){list.forEach(function(it){if(it.c===c)it.q=Math.max(1,Math.min(99,(it.q||1)+d))});save(list);render()}
function buyerForm(){
 var ul=document.getElementById("sheet-list");if(!ul||document.getElementById("buyer"))return;
 var p=document.querySelector("#sheet .sheet-in > p.muted");if(p)p.textContent="حدّد كم سيري بدك من كل كود، وضيف اسم محلك وبلدك (اختياري). بتنبعت كلها برسالة واتساب جاهزة. وتقدر تطلب سيري واحد من كل موديل وتنوّع بين الموديلات لحد ما تكمّل كرتونة (الحد الأدنى كرتونة).";
 var f=document.createElement("div");f.id="buyer";f.className="buyer";
 f.innerHTML='<p class="buyer-h">معلوماتك <small>(اختياري)</small></p>'+
  '<label><span>اسم المحل</span><input id="b-shop" type="text" autocomplete="organization" maxlength="60" placeholder="مثلاً: بوتيك الياسمين"></label>'+
  '<label><span>البلد</span><select id="b-co"><option value="">اختار البلد…</option>'+COUNTRIES.map(function(c){return '<option>'+c+'</option>'}).join("")+'<option value="__o">بلد تاني</option></select></label>'+
  '<label id="b-co2-l" hidden><span>اكتب البلد</span><input id="b-co2" type="text" maxlength="40"></label>'+
  '<label><span>المدينة</span><input id="b-city" type="text" autocomplete="address-level2" maxlength="40" placeholder="مثلاً: عمّان"></label>';
 ul.parentNode.insertBefore(f,ul.nextSibling);
 var sh=document.getElementById("b-shop"),co=document.getElementById("b-co"),co2=document.getElementById("b-co2"),ci=document.getElementById("b-city"),l2=document.getElementById("b-co2-l");
 sh.value=buyer.shop||"";co.value=buyer.co||"";co2.value=buyer.co2||"";ci.value=buyer.city||"";l2.hidden=co.value!=="__o";
 function up(){buyer={shop:sh.value,co:co.value,co2:co2.value,city:ci.value};l2.hidden=co.value!=="__o";saveB();links()}
 [sh,co2,ci].forEach(function(x){x.addEventListener("input",up)});co.addEventListener("change",up);
}
function links(){["lb-send","sheet-send"].forEach(function(id){var a=document.getElementById(id);if(a)a.href=url()})}
function render(){
 var bar=document.getElementById("listbar"),n=document.getElementById("lb-n");
 if(bar){bar.hidden=!list.length;n.textContent=list.length;var lt=document.getElementById("lb-t");if(lt)lt.textContent=" موديل · "+ser(tot())}
 document.body.classList.toggle("has-list",!!(bar&&list.length));
 links();
 document.querySelectorAll(".add").forEach(function(b){var on=has(b.dataset.code);b.setAttribute("aria-pressed",on?"true":"false");b.textContent=on?"✓ بالقائمة":"+ أضف للقائمة"});
 var ul=document.getElementById("sheet-list");
 if(ul){ul.innerHTML="";
  if(!list.length){var e=document.createElement("li");e.className="sl-empty";e.textContent="القائمة فاضية. اضغط «أضف للقائمة» على أي موديل.";ul.appendChild(e)}
  list.forEach(function(it){var li=document.createElement("li");var s=document.createElement("span");s.className="sl-t";var b=document.createElement("b");b.dir="ltr";b.textContent=it.c;s.appendChild(b);if(it.k){var k=document.createElement("small");k.textContent=it.k;s.appendChild(k)}
  var q=document.createElement("span");q.className="qty";
  var mi=document.createElement("button");mi.type="button";mi.textContent="−";mi.setAttribute("aria-label","سيري أقل للكود "+it.c);mi.disabled=(it.q||1)<=1;mi.addEventListener("click",function(){setQ(it.c,-1)});
  var v=document.createElement("output");v.textContent=it.q||1;v.setAttribute("aria-label","عدد السيريات");
  var pl=document.createElement("button");pl.type="button";pl.textContent="+";pl.setAttribute("aria-label","سيري زيادة للكود "+it.c);pl.addEventListener("click",function(){setQ(it.c,1)});
  var u=document.createElement("small");u.textContent="سيري";
  q.appendChild(mi);q.appendChild(v);q.appendChild(pl);q.appendChild(u);
  var x=document.createElement("button");x.type="button";x.className="rm";x.textContent="شيل";x.setAttribute("aria-label","شيل الكود "+it.c);x.addEventListener("click",function(){list=list.filter(function(o){return o.c!==it.c});save(list);render()});
  li.appendChild(s);li.appendChild(q);li.appendChild(x);ul.appendChild(li)})}
}
/* ---- catalog data (data/catalog.json, data/site.json) ---- */
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
/* v7 (Nov 8): display-only group labels, so only real maternity models read «ملابس حوامل».
   Checked against the factories' own printed descriptions (HAMİLE / LOHUSA = maternity). catalog.json is untouched;
   a fix applies only while the model still has its old group, so anything the owner changes in the editor wins. */
var GFIX={"w-3479":["أطقم روب وحوامل","ملابس حوامل"],"w-3480":["أطقم روب وحوامل","ملابس حوامل"],"w-3481":["أطقم روب وحوامل","ملابس حوامل"],"w-3482":["أطقم روب وحوامل","ملابس حوامل"],"w-3483":["أطقم روب وحوامل","ملابس حوامل"],"w-3484":["أطقم روب وحوامل","ملابس حوامل"],"w-3485":["أطقم روب وحوامل","ملابس حوامل"],"w-3486":["أطقم روب وحوامل","ملابس حوامل"],"w-3487":["أطقم روب وحوامل","ملابس حوامل"],"w-3488":["أطقم روب وحوامل","ملابس حوامل"],"w-3489":["أطقم روب وحوامل","ملابس حوامل"],"w-3490":["أطقم روب وحوامل","ملابس حوامل"],"w-3442":["أطقم روب وحوامل","ملابس حوامل"],"w-2335":["أطقم روب وحوامل","ملابس حوامل"],"w-2336":["أطقم روب وحوامل","ملابس حوامل"],"w-2337":["أطقم روب وحوامل","ملابس حوامل"],"w-2338":["أطقم روب وحوامل","ملابس حوامل"],"w-2339":["أطقم روب وحوامل","ملابس حوامل"],"w-2340":["أطقم روب وحوامل","ملابس حوامل"],"w-2341":["أطقم روب وحوامل","ملابس حوامل"],"w-2342":["أطقم روب وحوامل","ملابس حوامل"],"w-2343":["أطقم روب وحوامل","ملابس حوامل"],"w-2344":["أطقم روب وحوامل","ملابس حوامل"],"w-2345":["أطقم روب وحوامل","ملابس حوامل"],"w-2346":["أطقم روب وحوامل","ملابس حوامل"],"w-2347":["أطقم روب وحوامل","ملابس حوامل"],"w-2305":["أطقم روب وحوامل","ملابس حوامل"],"w-1178":["أطقم روب وحوامل","ملابس حوامل"],"w-1179":["أطقم روب وحوامل","ملابس حوامل"],"w-1180":["أطقم روب وحوامل","ملابس حوامل"],"w-1181":["أطقم روب وحوامل","ملابس حوامل"],"w-0736":["أطقم روب وحوامل","ملابس حوامل"],"w-1041":["أطقم روب وحوامل","قمصان نوم (لبس بيت)"],"w-1042":["أطقم روب وحوامل","قمصان نوم (لبس بيت)"],"w-1006":["أطقم روب وحوامل","قمصان نوم (لبس بيت)"],"w-0811":["أطقم روب وحوامل","روب صباحية (لبس بيت)"],"w-0812":["أطقم روب وحوامل","روب صباحية (لبس بيت)"],"w-c840-850":["مجموعة الحوامل","ملابس حوامل"],"w-c840-851":["مجموعة الحوامل","ملابس حوامل"],"w-c840-860":["مجموعة الحوامل","ملابس حوامل"],"u-c801-509":["شورت نسائي","تايت (ليغنز) نسائي"],"u-c801-510":["شورت نسائي","تايت (ليغنز) نسائي"]};
var GREN={"أطقم روب وحوامل": ["ملابس حوامل", "قمصان نوم (لبس بيت)", "روب صباحية (لبس بيت)"], "مجموعة الحوامل": ["ملابس حوامل"]};
function fixGroups(d){try{var used={};(d.models||[]).forEach(function(m){var f=GFIX[m.id];if(f&&m.g===f[0])m.g=f[1];if(m.g)used[m.g]=1});
 (d.cats||[]).forEach(function(c){if(!c.groups)return;var out=[];c.groups.forEach(function(g){var r=GREN[g];if(r&&!used[g]){r.forEach(function(x){if(out.indexOf(x)<0)out.push(x)})}else if(out.indexOf(g)<0)out.push(g)});c.groups=out})}catch(e){}}
/* v7: centre every product photo the same way. Many supplier photos carry wide white margins on one side,
   so the model sat to the right or left. Each photo is measured once (tiny canvas), its white margins are
   trimmed, and it is fitted and centred in the 3:4 frame. If anything fails the photo stays as it was. */
/* v12: photo centring is precomputed offline (same rule as the v7 canvas trim), so phones do no canvas work. */
var FITP={"img/p/l-825-0.webp":[-21.91,-1.62,98.62,98.62],"img/p/l-826-0.webp":[21.7,-0.03,97.03,97.03],"img/p/m-12085-a-1.webp":[12.08,3.0,88.79,94.0],"img/p/m-12086-a-0.webp":[13.03,3.0,88.74,94.0],"img/p/m-12087-a-0.webp":[12.91,3.0,89.03,94.0],"img/p/m-12088-a-0.webp":[11.98,3.0,89.03,94.0],"img/p/m-12089-a-0.webp":[12.91,3.0,89.03,94.0],"img/p/m-c940-028-2.webp":[-3.57,3.0,88.66,94.0],"img/p/m-c940-028-3.webp":[-5.38,3.0,88.6,94.0],"img/p/m-c940-102-0.webp":[12.16,3.0,88.6,94.0],"img/p/m-c940-106-0.webp":[-4.37,3.0,88.47,94.0],"img/p/m-c940-107-0.webp":[-6.3,3.0,88.6,94.0],"img/p/m-c940-107-2.webp":[-2.56,3.0,88.53,94.0],"img/p/m-c940-137-1.webp":[-2.61,3.0,88.6,94.0],"img/p/m-c940-154-0.webp":[21.35,3.0,88.73,94.0],"img/p/m-c940-155-3.webp":[-2.61,3.0,88.6,94.0],"img/p/m-c940-160-1.webp":[16.28,1.6,89.92,95.4],"img/p/m-c940-163-3.webp":[12.64,1.6,89.66,95.4],"img/p/m-c940-164-1.webp":[11.35,3.0,88.34,94.0],"img/p/s-502-0.webp":[25.57,-0.19,101.97,101.97],"img/p/s-509-0.webp":[-25.63,-1.86,103.72,103.72],"img/p/s-c832-013-0.webp":[-5.18,-13.95,98.1,115.57],"img/p/u-20001-a-0.webp":[-3.51,3.0,88.57,94.0],"img/p/u-21005-h-0.webp":[3.0,3.0,83.56,94.0],"img/p/u-2741-h-0.webp":[0.01,3.0,88.86,94.0],"img/p/u-c801-004-0.webp":[-1.58,3.0,88.42,94.0],"img/p/u-c801-005-0.webp":[-8.01,-1.34,92.81,98.34],"img/p/u-c801-012-0.webp":[-4.83,-8.75,94.0,105.75],"img/p/u-c801-025-0.webp":[-6.4,3.0,100.27,94.0],"img/p/u-c801-035-0.webp":[0.96,-1.09,87.19,98.09],"img/p/u-c801-038-0.webp":[-8.75,3.0,94.0,94.0],"img/p/u-c801-039-0.webp":[-5.81,3.0,94.0,94.0],"img/p/u-c801-043-0.webp":[13.14,-2.53,88.47,99.53],"img/p/u-c801-508-0.webp":[11.29,3.0,88.47,99.53],"img/p/u-c801-510-0.webp":[13.67,3.0,87.19,98.09],"img/p/u-c802-500-0.webp":[12.22,-2.53,88.47,99.53],"img/p/u-c804-003-0.webp":[19.33,3.0,52.59,94.0],"img/p/u-c804-008-2.webp":[0.11,3.0,88.7,94.0],"img/p/u-c804-009-1.webp":[0.16,3.0,88.6,94.0],"img/p/u-c804-010-1.webp":[-2.7,3.0,88.76,94.0],"img/p/u-c804-502-1.webp":[0.28,3.0,88.39,94.0],"img/p/u-c804-503-2.webp":[0.22,3.0,88.5,94.0],"img/p/u-c804-504-0.webp":[21.09,3.0,49.57,94.0],"img/p/u-c804-504-2.webp":[-0.83,3.0,88.73,94.0],"img/p/u-c804-506-0.webp":[23.3,3.0,47.47,94.0],"img/p/u-c804-507-1.webp":[0.24,3.0,88.47,94.0],"img/p/u-c804-507-2.webp":[-1.72,3.0,88.66,94.0],"img/p/u-c804-512-0.webp":[25.01,3.0,44.43,94.0],"img/p/u-c804-522-0.webp":[-1.87,3.0,88.91,94.0],"img/p/w-c841-001-1.webp":[16.77,3.0,88.6,94.0],"img/p/w-c841-005-0.webp":[13.5,3.0,83.44,94.0],"img/p/w-c841-014-0.webp":[-4.58,3.0,97.03,97.03],"img/p/x-336-0.webp":[25.34,-1.62,98.62,98.62],"img/p/x-361-0.webp":[-16.71,-0.03,97.03,97.03],"img/p/x-518-0.webp":[18.15,-1.62,98.62,98.62],"img/p/x-948-0.webp":[-16.71,-0.03,97.03,97.03]};
function fitAttr(s){var f=FITP[s];return f?' class="fit" style="left:'+f[0]+'%;top:'+f[1]+'%;width:'+f[2]+'%;height:'+f[3]+'%"':''}
function applyFit(img,s){img.removeAttribute("style");img.classList.remove("fit");var f=FITP[s];if(f){img.classList.add("fit");img.style.left=f[0]+"%";img.style.top=f[1]+"%";img.style.width=f[2]+"%";img.style.height=f[3]+"%"}}
function fitImg(){}
function fitAll(){}

/* ---------- v11 cart: a normal page (cart.html), no bars, drawers or overlays ---------- */
var CKEY="dt_cart_v1",CMEM=null;
function cRead(){var a=null;try{a=JSON.parse(localStorage.getItem(CKEY)||"null")}catch(e){a=null}if(!Array.isArray(a))a=CMEM||[];
 try{var u=new URLSearchParams(location.search).get("c");if(u){u.split(",").forEach(function(id){id=id.trim();if(id&&!a.some(function(x){return x.id===id}))a.push({id:id,q:1})})}}catch(e){}
 return a.filter(function(x){return x&&x.id}).slice(0,60)}
function cWrite(a){CMEM=a;try{localStorage.setItem(CKEY,JSON.stringify(a))}catch(e){}cUI()}
function cHas(id){return cRead().some(function(x){return x.id===id})}
function cUrl(a){var ids=(a||cRead()).map(function(x){return x.id});return "cart.html"+(ids.length?"?c="+encodeURIComponent(ids.join(",")).replace(/%2C/g,","):"")}
function cUI(){var a=cRead();
 document.querySelectorAll(".cart-n").forEach(function(n){n.textContent="\u00a0("+a.length+")";n.hidden=false});
 document.querySelectorAll("a.top-cart").forEach(function(l){var pre=/\/blog\//.test(location.pathname)?"../":"";l.setAttribute("href",pre+cUrl(a))});
 document.querySelectorAll(".cart-add").forEach(function(b){var on=a.some(function(x){return x.id===b.dataset.id});b.setAttribute("aria-pressed",on?"true":"false");b.textContent=on?"✓ بالسلة":"+ أضف للسلة"})}
document.addEventListener("click",function(e){var b=e.target&&e.target.closest&&e.target.closest(".cart-add");if(!b)return;e.preventDefault();
 var a=cRead(),id=b.dataset.id;if(a.some(function(x){return x.id===id}))a=a.filter(function(x){return x.id!==id});else a.push({id:id,c:b.dataset.code||"",k:b.dataset.cat||"",q:1});cWrite(a)});
function cartPage(cat){
 var box=document.getElementById("cart-list");if(!box)return;
 var byId={},cats={};try{(cat&&cat.cats||[]).forEach(function(c){cats[c.key]=c});(cat&&cat.models||[]).forEach(function(m){byId[m.id]=m})}catch(e){}
 var f=document.getElementById("cart-form"),err=document.getElementById("cart-err"),wa=document.getElementById("o-wa"),sent=document.getElementById("sent");
 function val(id){var x=document.getElementById(id);return x?String(x.value||"").trim():""}
 function items(){var known=Object.keys(byId).length>0;return cRead().filter(function(x){return !known||byId[x.id]}).map(function(x){var m=byId[x.id]||{};return {id:x.id,c:m.c||x.c||x.id,k:(cats[m.cat]||{}).title||x.k||"",q:x.q||1,n:x.n||""}})}
 function waText(){var it=items(),t="مرحباً Dressingo 👋\nبدي أطلب هالموديلات بالجملة:\n\n";
  it.forEach(function(x,i){t+=(i+1)+") كود "+x.c+(x.k?" ("+x.k+")":"")+" × "+x.q+" سيري"+(x.n?" — "+x.n:"")+"\n"});
  if(!it.length)t+="(لسا ما اخترت موديلات)\n";
  var nm=val("o-name"),ph=val("o-phone"),em=val("o-email"),co=val("o-country"),ci=val("o-city"),no=val("o-note");
  t+="\n"+(nm?"الاسم: "+nm+"\n":"")+(ph?"الرقم: "+ph+"\n":"")+(em?"الإيميل: "+em+"\n":"")+((co||ci)?"البلد: "+[co,ci].filter(Boolean).join(" – ")+"\n":"")+(no?"ملاحظة: "+no+"\n":"");
  return t}
 function orderBody(ch){var it=items(),cs=document.getElementById("o-consent");return {channel:ch,consent:!!(cs&&cs.checked),page:String(location.href).slice(0,160),name:val("o-name"),phone:val("o-phone"),email:val("o-email"),country:val("o-country"),city:val("o-city"),note:val("o-note"),items:it.map(function(x){return {c:x.c,k:x.k,q:x.q,n:x.n}}),hp:(f&&f.querySelector('[name=hp]')||{}).value||""}}
 if(wa)wa.addEventListener("click",function(){try{var b=orderBody("wa");if(!b.items.length&&!b.note)return;fetch(f.getAttribute("action"),{method:"POST",headers:{"content-type":"text/plain;charset=UTF-8"},body:JSON.stringify(b),keepalive:true,mode:"cors"}).catch(function(){})}catch(e){}});
 function sync(){if(wa)wa.href="https://wa.me/"+WA+"?text="+encodeURIComponent(waText());var h=document.getElementById("o-ids");if(h)h.value=items().map(function(x){return x.c}).join(",")}
 function draw(){var it=items(),cn=document.getElementById("cart-count");if(cn)cn.textContent=it.length?"("+it.length+")":"";
  if(!it.length){box.innerHTML='<li class="cart-empty">السلة فاضية. افتح أي قسم واضغط «أضف للسلة» تحت الموديلات اللي بدك ياها.</li>';sync();return}
  box.innerHTML=it.map(function(x){var m=byId[x.id]||{},im=(m.img||[])[0]||"";
   return '<li class="cart-row" data-id="'+esc(x.id)+'">'+(im?'<img src="'+esc(im)+'" alt="" width="64" height="85" loading="lazy">':'<span class="cart-noimg"></span>')+
   '<div class="cart-info"><b dir="ltr">'+esc(x.c)+'</b><small>'+esc(x.k)+'</small>'+
   '<label class="cart-q"><span>سيري</span><input type="number" inputmode="numeric" min="1" max="99" value="'+(x.q||1)+'" data-f="q" aria-label="كم سيري للكود '+esc(x.c)+'"></label>'+
   '</div>'+
   '<button type="button" class="cart-rm" aria-label="شيل الكود '+esc(x.c)+'">×</button>'+
   '<input class="cart-n2" type="text" maxlength="80" placeholder="ملاحظة (اختياري)" aria-label="ملاحظة للكود '+esc(x.c)+' (اختياري)" value="'+esc(x.n||"")+'" data-f="n"></li>'}).join("");sync()}
 box.addEventListener("click",function(e){var b=e.target.closest(".cart-rm");if(!b)return;var id=b.closest(".cart-row").dataset.id;cWrite(cRead().filter(function(x){return x.id!==id}));try{var u=new URL(location.href);u.searchParams.delete("c");history.replaceState(null,"",u.pathname+u.search+u.hash)}catch(e2){}draw()});
 box.addEventListener("input",function(e){var t=e.target,r=t.closest(".cart-row");if(!r)return;var a=cRead();a.forEach(function(x){if(x.id===r.dataset.id){if(t.dataset.f==="q")x.q=Math.max(1,Math.min(99,parseInt(t.value,10)||1));if(t.dataset.f==="n")x.n=String(t.value).slice(0,80)}});cWrite(a);sync()});
 if(f){f.noValidate=true;f.addEventListener("input",function(){sync();if(err)err.hidden=true});
  f.addEventListener("submit",function(e){e.preventDefault();err.hidden=true;
   var nm=val("o-name"),ph=val("o-phone");
   if(!nm||ph.replace(/[^\d]/g,"").length<6){err.textContent="اكتب اسمك ورقم هاتف صحيح لنقدر نتواصل معك.";err.hidden=false;return}
   var it=items();if(!it.length&&!val("o-note")){err.textContent="السلة فاضية. ضيف موديلات أو اكتب الأكواد بالملاحظة.";err.hidden=false;return}
   var btn=document.getElementById("o-send");btn.disabled=true;btn.textContent="عم نبعت…";
   var body=orderBody("form");
   var done=function(ok){btn.disabled=false;btn.textContent="أرسل الطلب";
    if(ok){cWrite([]);f.hidden=true;document.querySelector(".cart-box").hidden=true;if(sent){sent.classList.add("on");try{sent.scrollIntoView()}catch(e3){}}}
    else{err.textContent="ما قدرنا نبعت الطلب هلأ. جرّب مرة تانية، أو اضغط «أرسل عالواتساب».";err.hidden=false}};
   try{fetch(f.getAttribute("action"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body),mode:"cors"}).then(function(r){return r.json()}).then(function(j){done(!!(j&&j.ok))}).catch(function(){done(false)})}catch(e4){done(false)}
  })}
 try{if(/[?&]sent=1/.test(location.search)&&sent){sent.classList.add("on");cWrite([])}}catch(e){}
 try{var u0=new URL(location.href);if(u0.searchParams.get("c")){cWrite(cRead());u0.searchParams.delete("c");history.replaceState(null,"",u0.pathname+u0.search+u0.hash)}}catch(e){}
 draw()}
var WAI='<svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

/* ---------- v12: model page (model.html?c=<id>), plain flow, no slider or lightbox ---------- */
function modelPage(cat){
 var box=document.getElementById("mp-body");if(!box)return;
 var id="";try{id=new URLSearchParams(location.search).get("c")||""}catch(e){}
 var ms=(cat&&cat.models)||[],cats={};(cat&&cat.cats||[]).forEach(function(c){cats[c.key]=c});
 var m=ms.filter(function(x){return x.id===id&&!x.off})[0]||ms.filter(function(x){return String(x.c).toUpperCase()===String(id).toUpperCase()&&!x.off})[0];
 if(!m){box.innerHTML='<h1 class="mp-h">ما لقينا هالموديل</h1><p>يمكن انشال من الكتالوج. ابعتلنا الكود على واتساب أو <a href="index.html">ارجع للكتالوج</a>.</p><p><a class="btn-wa" href="https://wa.me/'+WA+'" target="_blank" rel="noopener">'+WAI+' اسألنا على واتساب</a></p>';return}
 var c=cats[m.cat]||{title:"",key:m.cat},t=c.title||"",im=m.img||[],w=m.w||480,h=m.h||600;
 document.title="كود "+m.c+" — "+t+" جملة | Dressingo Toptan";
 try{var ln=document.querySelector('link[rel="canonical"]');if(!ln){ln=document.createElement("link");ln.rel="canonical";document.head.appendChild(ln)}ln.href=location.origin+location.pathname+"?c="+encodeURIComponent(m.id)}catch(e){}
 var cr=document.getElementById("mp-crumb");if(cr)cr.innerHTML='<a href="index.html">الرئيسية</a> ‹ <a href="'+esc(c.key)+'.html">'+esc(t)+'</a> ‹ كود <span dir="ltr">'+esc(m.c)+'</span>';
 var dl="";function row(k,v,ltr){if(v)dl+='<div><dt>'+k+'</dt><dd'+(ltr?' dir="ltr"':'')+'>'+esc(v)+'</dd></div>'}
 row("المقاسات",m.sizes,1);
 var st=serTxt(m);if(st)row("السيري",m.cat==="socks"?st:st+"، قطعة من كل مقاس");
 row("القماش",m.fabric);row("الألوان",m.colors);
 if(!m.sizes&&m.cat!=="socks")row("المقاسات","اسأل على واتساب");
 var link="";try{link=location.origin+location.pathname+"?c="+encodeURIComponent(m.id)}catch(e){}
 var wtx="مرحباً Dressingo 👋\nبدي سعر الجملة لهالموديل: كود "+m.c+(t?" ("+t+")":"")+(m.new?" 🆕 موديل جديد":"")+(link?"\n"+link:"");
 var on=cHas(m.id);
 var rel=ms.filter(function(x){return x.id!==m.id&&!x.off&&x.cat===m.cat&&x.g===m.g}).slice(0,6);
 if(rel.length<6)rel=rel.concat(ms.filter(function(x){return x.id!==m.id&&!x.off&&x.cat===m.cat&&x.g!==m.g&&rel.indexOf(x)<0}).slice(0,6-rel.length));
 box.innerHTML='<h1 class="mp-h">كود <span dir="ltr">'+esc(m.c)+'</span>'+(m.new?' <span class="nbadge in">جديد 🆕</span>':'')+'</h1>'+
  '<p class="mp-g">'+esc(m.g||t)+' · '+esc(t)+'</p>'+
  '<div class="mp-imgs">'+(im.length?im.map(function(s,i){return '<img src="'+esc(s)+'" alt="موديل '+esc(m.c)+' — صورة '+(i+1)+'" width="'+w+'" height="'+h+'" loading="'+(i?'lazy':'eager')+'" decoding="async">'}).join(""):'<p class="muted">ما في صورة لهالموديل لسا.</p>')+'</div>'+
  (dl?'<dl class="mp-dl">'+dl+'</dl>':'')+
  '<div class="mp-act"><button type="button" class="cart-add" data-id="'+esc(m.id)+'" data-code="'+esc(m.c)+'" data-cat="'+esc(t)+'" aria-pressed="'+(on?"true":"false")+'">'+(on?"✓ بالسلة":"+ أضف للسلة")+'</button>'+
  '<a class="btn-wa" href="https://wa.me/'+WA+'?text='+encodeURIComponent(wtx)+'" target="_blank" rel="noopener" data-code="'+esc(m.c)+'">'+WAI+' اسأل عن هالموديل</a></div>'+
  '<p class="mp-terms">الحد الأدنى: كرتون واحد (تقريباً 50–80 قطعة) أو 30 كيلو. السعر للقطعة الواحدة، والجرابات بالدزينة. فيك تخلط موديلات من أقسام مختلفة.</p>'+
  (rel.length?'<section class="mp-rel" aria-labelledby="rel-h"><h2 id="rel-h" class="sec">موديلات من نفس التشكيلة</h2><div class="grid">'+rel.map(function(x){return card(x,t,x.g)}).join("")+'</div></section>':'');
 try{cUI()}catch(e){}
}

/* ---------- v12: home search by code (normal flow, results inline under the hero) ---------- */
function homeSearch(cat){var f=document.getElementById("hsearch"),sec=document.getElementById("srch-res");if(!f||!sec)return;
 var inp=document.getElementById("hq"),cats={};(cat&&cat.cats||[]).forEach(function(c){cats[c.key]=c});
 var ms=((cat&&cat.models)||[]).filter(function(m){return !m.off&&cats[m.cat]});
 function norm(s){return String(s||"").toUpperCase().replace(/[\s\-_.]+/g,"")}
 function run(v,push){var n=norm(v);if(!n){sec.hidden=true;return}
  var hit=ms.filter(function(m){return norm(m.c).indexOf(n)>-1||norm(m.id).indexOf(n)>-1});
  hit.sort(function(a,b){return (norm(a.c)===n?0:1)-(norm(b.c)===n?0:1)});
  document.getElementById("srch-h").textContent=hit.length?("نتائج «"+v+"»: "+hit.length+" موديل"+(hit.length>24?" (أول 24)":"")):("ما في نتائج لـ «"+v+"»");
  document.getElementById("srch-grid").innerHTML=hit.slice(0,24).map(function(m){return card(m,(cats[m.cat]||{}).title||"",m.g)}).join("");
  sec.hidden=false;try{cUI()}catch(e){}
  if(push){try{history.replaceState(null,"","?q="+encodeURIComponent(v)+"#srch-res")}catch(e){}}
  try{sec.scrollIntoView()}catch(e){}}
 f.addEventListener("submit",function(e){e.preventDefault();run(inp.value.trim(),true)});
 try{var q0=new URLSearchParams(location.search).get("q");if(q0){inp.value=q0;run(q0,false)}}catch(e){}
}
function waCard(m,t){var tx="مرحباً Dressingo 👋\nبدي سعر الجملة لهالموديل: كود "+m.c+(t?" ("+t+")":"")+(m.new?" 🆕 موديل جديد":"");return "https://wa.me/"+WA+"?text="+encodeURIComponent(tx)}
/* v12: every card says what one series is (Emad's rule: socks are sold by the dozen). */
function serN(m){return m.sizes?String(m.sizes).split(/[\-–\/,\s]+/).filter(Boolean).length:0}
function serTxt(m){if(m.cat==="socks")return "دزينة (12 قطعة)";var n=serN(m);if(!n)return "";return n===1?"قطعة واحدة":n===2?"قطعتين":n+" قطع"}
function serLine(m){var t=serTxt(m);return t?'<li><span>السيري</span><b>'+t+'</b></li>':""}
function mUrl(m){return (/\/blog\//.test(location.pathname)?"../":"")+"model.html?c="+encodeURIComponent(m.id||"")}
function card(m,t,sub){
 var c=esc(m.c),tt=esc(t),lb=esc(sub||t),w=m.w||480,h=m.h||600,im=m.img||[],sw="",me="";
 if(im.length>1){var th=Math.floor(40*h/w);sw='<div class="sw" role="group" aria-label="صور أخرى">'+im.map(function(s,i){return '<button type="button" class="sw-b'+(i?'':' on')+'" data-src="'+esc(s)+'" aria-label="صورة '+(i+1)+'"><img src="'+esc(s)+'" alt="" loading="lazy" decoding="async" width="40" height="'+th+'"></button>'}).join("")+'</div>'}
 me+=serLine(m);
 if(m.sizes)me+='<li><span>المقاسات</span><b dir="ltr">'+esc(m.sizes)+'</b></li>';else if(m.cat!=="socks")me+='<li><span>المقاسات</span><b>اسأل على واتساب</b></li>';
 if(m.fabric)me+='<li><span>القماش</span><b>'+esc(m.fabric)+'</b></li>';
 if(m.colors)me+='<li><span>الألوان</span><b>'+esc(m.colors)+'</b></li>';
 return '<article class="card" data-code="'+c+'" data-cat="'+tt+'" data-line="'+esc(m.g||"")+'" data-fab="'+esc(fabF(m))+'"'+(big(m)?' data-big="1"':'')+(m.new?' data-new="1"':'')+'>\n <a class="ph" href="'+mUrl(m)+'" aria-label="صور وتفاصيل الكود '+c+'">'+(m.new?'<span class="nbadge">جديد 🆕</span>':'')+'<img src="'+esc(im[0]||"")+'"'+fitAttr(im[0]||"")+' alt="موديل '+c+' — '+tt+'" loading="lazy" decoding="async" width="'+w+'" height="'+h+'"></a>\n <div class="cb">\n  <p class="code"><a href="'+mUrl(m)+'">كود <b dir="ltr">'+c+'</b></a></p>\n  '+(lb?'<p class="cat-l">'+lb+'</p>':'')+'\n  '+sw+'\n  <ul class="meta">'+me+'</ul>\n  <button type="button" class="cart-add" data-id="'+esc(m.id||"")+'" data-code="'+c+'" data-cat="'+tt+'" aria-pressed="'+(cHas(m.id)?"true":"false")+'">'+(cHas(m.id)?"✓ بالسلة":"+ أضف للسلة")+'</button>\n </div>\n</article>';
}
function fab(m){var f=String(m.fabric||"").split("·")[0].replace(/\d+\s*%/g,"").replace(/\s+/g," ").trim();return /^(إيلاستين|طقم)/.test(f)?"":f}
/* APPROXIMATE fabric defaults, by category, for models whose fabric field is empty.
   The owner confirmed these are the usual fabrics (Nov 7 2026), not checked per model.
   Used ONLY as filter options (labelled «غالباً»), never shown on the product card. */
var FAB_DEF={lingerie:"ساتان",women:"قطن/بوليستر",men:"قطن/بوليستر"};
function fabF(m){return fab(m)||FAB_DEF[m.cat]||""}
function isDef(f){for(var k in FAB_DEF)if(FAB_DEF[k]===f)return true;return false}
function big(m){return /(^|[^A-Z])(3XL|4XL|5XL)/i.test(m.sizes||"")}
function fabOpts(ms){var n={};ms.forEach(function(m){var f=fabF(m);if(f)n[f]=(n[f]||0)+1});return Object.keys(n).filter(function(f){return n[f]>=2}).sort(function(a,b){return n[b]-n[a]}).map(function(f){return [f,n[f]]})}
/* v12: display-only wording fixes over data/site.json (the editor's own later changes still win). */
function fixSite(s){try{(s.steps||[]).forEach(function(x){if(x.d)x.d=x.d.replace("اضغط «أضف للقائمة» على كل موديل بيعجبك","اضغط «أضف للسلة» تحت كل موديل بيعجبك");
  if(x.t==="ابعت الأكواد على واتساب"&&x.d==="بنرد عليك بالأسعار والألوان المتوفرة."){x.t="افتح «السلة» وابعت الطلب";x.d="بزر «أرسل الطلب» أو «أرسل عالواتساب» برسالة وحدة، ومنرد عليك بالأسعار والألوان المتوفرة."}});
 (s.terms||[]).forEach(function(x){if(x.t==="السعر"&&x.d==="للقطعة الواحدة.")x.d="للقطعة الواحدة، والجرابات بالدزينة (12 قطعة)."})}catch(e){}return s}
function get(p){return fetch(p,{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function applySite(s){
 if(!s)return;
 fixSite(s);
 if(s.wa&&/^\d{8,15}$/.test(s.wa)){
  var old=WA,oldD=WAD;WA=s.wa;WAD=s.wa_display||("+"+s.wa);
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){a.href=a.getAttribute("href").replace(/wa\.me\/\d+/,"wa.me/"+WA);if(a.textContent.trim()===oldD)a.textContent=WAD});
 }
 var h1=document.querySelector(".hero h1");if(h1&&s.hero)h1.innerHTML=esc(s.hero).replace(/\n/g," <br>");
 var ld=document.querySelector(".hero .lead");if(ld&&s.lead)ld.textContent=s.lead;
 var fh=document.getElementById("feat-h");if(fh&&s.feat_title){fh.textContent=s.feat_title;var fp=fh.nextElementSibling;if(fp&&fp.classList.contains("muted"))fp.textContent=s.feat_sub||""}
 var st=document.querySelector(".how .steps");if(st&&s.steps&&s.steps.length)st.innerHTML="\n  "+s.steps.map(function(x){return '<li><b>'+esc(x.t)+'</b><span>'+esc(x.d)+'</span></li>'}).join("\n  ")+"\n ";
 if(s.terms)document.querySelectorAll("[data-term]").forEach(function(el){var x=s.terms.filter(function(t){return t.t===el.dataset.term})[0];if(x&&x.d)el.textContent=x.d});
 var te=document.querySelector(".how .terms");if(te&&s.terms&&s.terms.length)te.innerHTML="\n  "+s.terms.map(function(x){return '<li><b>'+esc(x.t)+':</b> '+esc(x.d)+'</li>'}).join("\n  ")+"\n ";
 var mx=s.mixed,hw=document.querySelector(".how");
 if(hw&&mx&&mx.steps&&mx.steps.length){var mb=document.getElementById("mixed");if(!mb){mb=document.createElement("div");mb.id="mixed";mb.className="mixed";var tr=hw.querySelector(".trial")||hw.querySelector(".btn-wa");if(tr)hw.insertBefore(mb,tr);else hw.appendChild(mb)}
  mb.innerHTML='<p class="mixed-h">'+esc(mx.t||"")+'</p><ol>'+mx.steps.map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ol>'+(mx.notes||[]).map(function(x){return '<p class="mixed-n">'+esc(x)+'</p>'}).join("")}
}
function applyCatalog(d){
 if(!d)return;
 fixGroups(d);
 var cats={};(d.cats||[]).forEach(function(c){cats[c.key]=c});
 var vis=(d.models||[]).filter(function(m){return !m.off&&cats[m.cat]});
 var grid=document.getElementById("grid");
 if(grid&&grid.dataset.cat){
  var k=grid.dataset.cat,c=cats[k]||{title:"",groups:[]},ms=vis.filter(function(m){return m.cat===k});
  GRID={ms:ms,t:c.title,n:PAGE};drawGrid();
  var hp=document.querySelector(".cat-hero p:not(.crumb)");if(hp)hp.textContent=ms.length+" موديل"+(c.sub?" · "+c.sub:"");
  var md=document.querySelector('meta[name="description"]');if(md)md.content=md.content.replace(/^\d+/,ms.length);
  var ch=document.querySelector(".chips");
  if(ch){var gs=(c.groups||[]).slice();ms.forEach(function(m){if(m.g&&gs.indexOf(m.g)<0)gs.push(m.g)});gs=gs.filter(function(g){return ms.some(function(m){return m.g===g})});
   ch.innerHTML='<button type="button" class="chip on" data-line="">الكل</button>'+gs.map(function(g){return '<button type="button" class="chip" data-line="'+esc(g)+'">'+esc(g)+'</button>'}).join("");ch.hidden=!gs.length}
  buildFilters(ms);
 }
 var tiles=document.querySelectorAll(".tiles .tile");
 tiles.forEach(function(t){var k=(t.getAttribute("href")||"").replace(".html",""),ms=vis.filter(function(m){return m.cat===k});var sm=t.querySelector("small");if(sm)sm.textContent=ms.length+" موديل";var im=t.querySelector("img");if(im&&ms[0]&&ms[0].img)im.src=ms[0].img[0]});
 var fb=document.querySelector(".hero .facts li b");if(fb)fb.textContent=vis.length;
 var nr=document.getElementById("new-rail");
 if(nr){var out=[];(d.cats||[]).forEach(function(c){vis.filter(function(m){return m.cat===c.key&&!m.f}).slice(0,2).forEach(function(m){out.push([m,c])})});
  nr.innerHTML=out.map(function(x){var h=card(x[0],x[1].title),l='<p class="cat-l">'+esc(x[1].title)+'</p>';return '<div class="nw">'+(h.indexOf(l)>=0?h.replace(l,'<a class="cat-l nw-l" href="'+esc(x[1].key)+'.html">'+esc(x[1].title)+' ‹</a>'):h)+'</div>'}).join("");
  var ns=nr.closest(".newin");if(ns)ns.hidden=!out.length}
 var fg=document.querySelector(".feat .grid");
 if(fg){var fs=vis.filter(function(m){return m.f});if(fs.length)fg.innerHTML=fs.map(function(m){return card(m,(cats[m.cat]||{}).title||"")}).join("");fg.closest(".feat").hidden=!fs.length}
}
function buildFilters(ms){
 var tl=document.querySelector(".tools");if(!tl)return;
 var fo=fabOpts(ms),nb=ms.filter(big).length,box=document.getElementById("fx"),pre=!!box;if(!box){box=document.createElement("div");box.id="fx";box.className="fx"}var h="";
 if(fo.length>=2)h+='<label class="fx-sel"><span class="vh">القماش</span><select id="f-fab"><option value="">كل الأقمشة</option>'+fo.map(function(f){return '<option value="'+esc(f[0])+'">'+esc(f[0])+(isDef(f[0])?' · غالباً':'')+' ('+f[1]+')</option>'}).join("")+'</select></label>';
 if(nb>=2&&nb<ms.length)h+='<button type="button" class="fchip" id="f-big" aria-pressed="false">مقاسات كبيرة 3XL+ ('+nb+')</button>';
 var nn=ms.filter(function(m){return m.new}).length;if(nn>=1&&nn<ms.length)h+='<button type="button" class="fchip" id="f-new" aria-pressed="false">جديد 🆕 ('+nn+')</button>';
 h+='<span class="fx-n" id="f-n" aria-live="polite"></span>';
 if(!pre||box.innerHTML.replace(/\s+/g,"")!==h.replace(/\s+/g,""))box.innerHTML=h;if(!pre)tl.appendChild(box);
 var sel=document.getElementById("f-fab");if(sel)sel.addEventListener("change",filt);
 var bb=document.getElementById("f-big");if(bb)bb.addEventListener("click",function(){bb.setAttribute("aria-pressed",bb.getAttribute("aria-pressed")==="true"?"false":"true");filt()});
 var bn=document.getElementById("f-new");if(bn)bn.addEventListener("click",function(){bn.setAttribute("aria-pressed",bn.getAttribute("aria-pressed")==="true"?"false":"true");filt()});
}
document.addEventListener("click",function(e){
 var b=e.target.closest(".add");
 if(b){var c=b.dataset.code,card=b.closest(".card"),k=card?card.dataset.cat:"";
  if(has(c))list=list.filter(function(o){return o.c!==c});else{var it0={c:c,k:k,q:1};if(card&&card.dataset.new==="1")it0.n=1;list.push(it0)}
  save(list);render();return}
 var s=e.target.closest(".sw-b");
 if(s){var cd=s.closest(".card");var pi=cd.querySelector(".ph img");pi.src=s.dataset.src;applyFit(pi,s.dataset.src);cd.querySelectorAll(".sw-b").forEach(function(x){x.classList.toggle("on",x===s)});return}
 var ch=e.target.closest(".chip");
 if(ch){document.querySelectorAll(".chip").forEach(function(x){x.classList.toggle("on",x===ch)});filt();return}
});
var dlg=document.getElementById("sheet");
/* v7: the order sheet is closed by default, has a visible × at the top, closes on a tap outside,
   on Esc, after "send", and whenever the page is shown again (back from WhatsApp); it never locks the page. */
function sheetOpen(){return !!(dlg&&(dlg.open||dlg.hasAttribute("open")))}
function closeSheet(){if(!dlg)return;try{if(dlg.close&&dlg.open)dlg.close()}catch(e){}dlg.removeAttribute("open");document.documentElement.classList.remove("sheet-on")}
function openSheet(){if(!dlg)return;try{if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")}catch(e){dlg.setAttribute("open","")}document.documentElement.classList.add("sheet-on")}
if(dlg){
 closeSheet();
 if(!document.getElementById("sheet-x")){var sx=document.createElement("button");sx.type="button";sx.id="sheet-x";sx.className="sheet-x";sx.setAttribute("aria-label","إغلاق القائمة");sx.innerHTML="&times;";dlg.insertBefore(sx,dlg.firstChild)}
 dlg.addEventListener("click",function(e){if(e.target===dlg||e.target.closest("#sheet-x"))closeSheet()});
 dlg.addEventListener("close",function(){document.documentElement.classList.remove("sheet-on")});
 document.addEventListener("click",function(e){if(sheetOpen()&&!e.target.closest("#sheet")&&!e.target.closest("#lb-open"))closeSheet()},true);
 document.addEventListener("keydown",function(e){if(e.key==="Escape"&&sheetOpen())closeSheet()});
 window.addEventListener("pageshow",closeSheet);window.addEventListener("pagehide",closeSheet);
 var ss=document.getElementById("sheet-send");if(ss)ss.addEventListener("click",function(){setTimeout(closeSheet,300)});
}
var op=document.getElementById("lb-open");if(op&&dlg)op.addEventListener("click",openSheet);
var cl=document.getElementById("sheet-close");if(cl)cl.addEventListener("click",closeSheet);
var cr=document.getElementById("sheet-clear");if(cr)cr.addEventListener("click",function(){list=[];save(list);render();closeSheet()});
var q=document.getElementById("q");
/* v12: the grid shows 24 models, «عرض المزيد» adds 24 more; search and chips filter the full list. */
var PAGE=24,GRID=null;
function fState(){var v=q?q.value.trim().toUpperCase().replace(/[\s\-]+/g,""):"";var on=document.querySelector(".chip.on");
 var fs=document.getElementById("f-fab"),bg=document.getElementById("f-big"),nw=document.getElementById("f-new");
 return {v:v,ln:on?on.dataset.line:"",fv:fs?fs.value:"",bv:!!(bg&&bg.getAttribute("aria-pressed")==="true"),nv:!!(nw&&nw.getAttribute("aria-pressed")==="true")}}
function fMatch(m,s){return (!s.v||String(m.c).toUpperCase().replace(/[\s\-]+/g,"").indexOf(s.v)>-1)&&(!s.ln||m.g===s.ln)&&(!s.fv||fabF(m)===s.fv)&&(!s.bv||big(m))&&(!s.nv||!!m.new)}
function drawGrid(more){var grid=document.getElementById("grid");if(!grid||!GRID)return;
 var s=fState(),list=GRID.ms.filter(function(m){return fMatch(m,s)}),all=GRID.ms.length;
 if(more){var from=grid.querySelectorAll(".card").length;grid.insertAdjacentHTML("beforeend",list.slice(from,GRID.n).map(function(m){return card(m,GRID.t,m.g)}).join(""))}
 else{var want=list.slice(0,GRID.n),have=grid.querySelectorAll(".card"),same=have.length===want.length;
  if(same)for(var i=0;i<want.length;i++){if(have[i].dataset.code!==String(want[i].c)||have[i].dataset.line!==String(want[i].g||"")){same=false;break}}
  if(!same)grid.innerHTML=want.map(function(m){return card(m,GRID.t,m.g)}).join("")}
 var fn=document.getElementById("f-n");if(fn)fn.textContent=list.length<all?list.length+" من "+all+" موديل":"";
 var em=document.getElementById("empty");if(em)em.hidden=list.length>0;
 var mw=document.getElementById("more-w");
 if(!mw){mw=document.createElement("p");mw.id="more-w";mw.className="more-w";grid.parentNode.insertBefore(mw,grid.nextSibling)}
 var left=list.length-Math.min(GRID.n,list.length);
 mw.innerHTML=left>0?'<button type="button" class="btn-ghost more-btn" id="more-btn">عرض المزيد ('+Math.min(PAGE,left)+' موديل من '+left+')</button>':(list.length>PAGE?'<span class="muted">هيك شفت كل الموديلات ('+list.length+')</span>':"");
 try{cUI()}catch(e){}}
function filt(){if(GRID){GRID.n=PAGE;drawGrid()}}
document.addEventListener("click",function(e){var b=e.target&&e.target.closest&&e.target.closest("#more-btn");if(!b||!GRID)return;GRID.n+=PAGE;drawGrid(true)});
if(q)q.addEventListener("input",filt);
window.addEventListener("storage",function(){list=load();buyer=loadB();render()});
var lo=document.getElementById("lb-open");if(lo&&!document.getElementById("lb-t"))lo.innerHTML='<span class="lb-n" id="lb-n">0</span><span id="lb-t"> موديل بالقائمة</span>';
var cnv=document.querySelector(".catnav [aria-current]");if(cnv){var nv=cnv.parentNode;try{nv.scrollLeft=cnv.offsetLeft-(nv.clientWidth-cnv.offsetWidth)/2}catch(e){}}
try{localStorage.removeItem(KEY)}catch(e){}
list=[];
render();
try{cUI()}catch(e){}
var needCat=document.getElementById("hsearch")||document.getElementById("mp-body")||document.getElementById("cart-list")||document.getElementById("grid")||document.getElementById("new-rail")||document.querySelector(".tiles")||document.querySelector(".feat .grid");
Promise.all([get("data/site.json").catch(function(){return null}),needCat?get("data/catalog.json").catch(function(){return null}):Promise.resolve(null)]).then(function(r){
 try{applySite(r[0])}catch(e){}
 if(needCat){if(r[1]){try{applyCatalog(r[1])}catch(e){}}else{var g=document.getElementById("grid");if(g&&g.dataset.cat&&!g.children.length)g.innerHTML='<p class="empty">ما قدرنا نحمّل الموديلات. حدّث الصفحة أو اسألنا على واتساب.</p>'}}
 render();if(q&&q.value)filt();fitAll();
 try{cUI()}catch(e){}
 try{cartPage(r[1])}catch(e){}
 try{modelPage(r[1])}catch(e){}
 try{homeSearch(r[1])}catch(e){}
});
})();
