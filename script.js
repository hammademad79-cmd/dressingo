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
var GFIX={"w-3479":["أطقم روب وحوامل","ملابس حوامل"],"w-3480":["أطقم روب وحوامل","ملابس حوامل"],"w-3481":["أطقم روب وحوامل","ملابس حوامل"],"w-3482":["أطقم روب وحوامل","ملابس حوامل"],"w-3483":["أطقم روب وحوامل","ملابس حوامل"],"w-3484":["أطقم روب وحوامل","ملابس حوامل"],"w-3485":["أطقم روب وحوامل","ملابس حوامل"],"w-3486":["أطقم روب وحوامل","ملابس حوامل"],"w-3487":["أطقم روب وحوامل","ملابس حوامل"],"w-3488":["أطقم روب وحوامل","ملابس حوامل"],"w-3489":["أطقم روب وحوامل","ملابس حوامل"],"w-3490":["أطقم روب وحوامل","ملابس حوامل"],"w-3442":["أطقم روب وحوامل","ملابس حوامل"],"w-2335":["أطقم روب وحوامل","ملابس حوامل"],"w-2336":["أطقم روب وحوامل","ملابس حوامل"],"w-2337":["أطقم روب وحوامل","ملابس حوامل"],"w-2338":["أطقم روب وحوامل","ملابس حوامل"],"w-2339":["أطقم روب وحوامل","ملابس حوامل"],"w-2340":["أطقم روب وحوامل","ملابس حوامل"],"w-2341":["أطقم روب وحوامل","ملابس حوامل"],"w-2342":["أطقم روب وحوامل","ملابس حوامل"],"w-2343":["أطقم روب وحوامل","ملابس حوامل"],"w-2344":["أطقم روب وحوامل","ملابس حوامل"],"w-2345":["أطقم روب وحوامل","ملابس حوامل"],"w-2346":["أطقم روب وحوامل","ملابس حوامل"],"w-2347":["أطقم روب وحوامل","ملابس حوامل"],"w-2305":["أطقم روب وحوامل","ملابس حوامل"],"w-1178":["أطقم روب وحوامل","ملابس حوامل"],"w-1179":["أطقم روب وحوامل","ملابس حوامل"],"w-1180":["أطقم روب وحوامل","ملابس حوامل"],"w-1181":["أطقم روب وحوامل","ملابس حوامل"],"w-0736":["أطقم روب وحوامل","ملابس حوامل"],"w-1041":["أطقم روب وحوامل","قمصان نوم وروبات"],"w-1042":["أطقم روب وحوامل","قمصان نوم وروبات"],"w-1006":["أطقم روب وحوامل","قمصان نوم وروبات"],"w-0811":["أطقم روب وحوامل","قمصان نوم وروبات"],"w-0812":["أطقم روب وحوامل","قمصان نوم وروبات"],"w-c840-850":["مجموعة الحوامل","بيجامات مودال"],"w-c840-851":["مجموعة الحوامل","بيجامات مودال"],"w-c840-860":["مجموعة الحوامل","ملابس حوامل"]};
var GREN={"أطقم روب وحوامل": ["ملابس حوامل", "قمصان نوم وروبات"], "مجموعة الحوامل": ["ملابس حوامل", "بيجامات مودال"]};
function fixGroups(d){try{var used={};(d.models||[]).forEach(function(m){var f=GFIX[m.id];if(f&&m.g===f[0])m.g=f[1];if(m.g)used[m.g]=1});
 (d.cats||[]).forEach(function(c){if(!c.groups)return;var out=[];c.groups.forEach(function(g){var r=GREN[g];if(r&&!used[g]){r.forEach(function(x){if(out.indexOf(x)<0)out.push(x)})}else if(out.indexOf(g)<0)out.push(g)});c.groups=out})}catch(e){}}
/* v7: centre every product photo the same way. Many supplier photos carry wide white margins on one side,
   so the model sat to the right or left. Each photo is measured once (tiny canvas), its white margins are
   trimmed, and it is fitted and centred in the 3:4 frame. If anything fails the photo stays as it was. */
var FITC=null;
function fitImg(img){
 try{var ph=img.parentNode;if(!ph||!ph.classList||!ph.classList.contains("ph"))return;
  var nw=img.naturalWidth,nh=img.naturalHeight;if(!nw||!nh)return;
  var sw=48,sh=Math.max(8,Math.round(48*nh/nw));if(sh>200)sh=200;
  FITC=FITC||document.createElement("canvas");FITC.width=sw;FITC.height=sh;var cx=FITC.getContext("2d",{willReadFrequently:true});
  cx.fillStyle="#fff";cx.fillRect(0,0,sw,sh);cx.drawImage(img,0,0,sw,sh);var px=cx.getImageData(0,0,sw,sh).data;
  var cols=new Array(sw).fill(0),rows=new Array(sh).fill(0);
  for(var y=0;y<sh;y++)for(var x=0;x<sw;x++){var k=(y*sw+x)*4;if(px[k]<236||px[k+1]<236||px[k+2]<236){cols[x]++;rows[y]++}}
  var x0=0,x1=sw-1,y0=0,y1=sh-1,tc=Math.max(1,sh*0.02),tr=Math.max(1,sw*0.02);
  while(x0<x1&&cols[x0]<tc)x0++;while(x1>x0&&cols[x1]<tc)x1--;while(y0<y1&&rows[y0]<tr)y0++;while(y1>y0&&rows[y1]<tr)y1--;
  var fx0=x0/sw,fx1=(x1+1)/sw,fy0=y0/sh,fy1=(y1+1)/sh;
  var trimmed=(fx0>0.04||fx1<0.96||fy0>0.04||fy1<0.96);
  var BW=3,BH=4,cw=(fx1-fx0)*nw,ch=(fy1-fy0)*nh,s,cover=false;
  if(!trimmed)return;
  s=Math.min(BW/cw,BH/ch)*0.94;
  var iw=nw*s,ih=nh*s,l=BW/2-(fx0+fx1)/2*iw,t=BH/2-(fy0+fy1)/2*ih;
  if(cover){l=(BW-iw)/2;t=ih>BH?-(ih-BH)*0.25:(BH-ih)/2}
  var st=img.style;st.inset="auto";st.right="auto";st.bottom="auto";st.left=(l/BW*100)+"%";st.top=(t/BH*100)+"%";st.width=(iw/BW*100)+"%";st.height=(ih/BH*100)+"%";st.maxWidth="none";st.objectFit="fill";
  img.classList.add("fit")}catch(e){}
}
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.parentNode&&t.parentNode.classList&&t.parentNode.classList.contains("ph"))fitImg(t)},true);
function fitAll(){document.querySelectorAll(".ph img").forEach(function(i){if(i.complete&&i.naturalWidth)fitImg(i)})}
function waCard(m,t){var tx="مرحباً Dressingo 👋\nبدي سعر الجملة لهالموديل: كود "+m.c+(t?" ("+t+")":"")+(m.new?" 🆕 موديل جديد":"");return "https://wa.me/"+WA+"?text="+encodeURIComponent(tx)}
function card(m,t,sub){
 var c=esc(m.c),tt=esc(t),lb=esc(sub||t),w=m.w||480,h=m.h||600,im=m.img||[],sw="",me="";
 if(im.length>1){var th=Math.floor(40*h/w);sw='<div class="sw" role="group" aria-label="صور أخرى">'+im.map(function(s,i){return '<button type="button" class="sw-b'+(i?'':' on')+'" data-src="'+esc(s)+'" aria-label="صورة '+(i+1)+'"><img src="'+esc(s)+'" alt="" loading="lazy" decoding="async" width="40" height="'+th+'"></button>'}).join("")+'</div>'}
 if(m.sizes)me+='<li><span>المقاسات</span><b dir="ltr">'+esc(m.sizes)+'</b></li>';
 if(m.fabric)me+='<li><span>القماش</span><b>'+esc(m.fabric)+'</b></li>';
 if(m.colors)me+='<li><span>الألوان</span><b>'+esc(m.colors)+'</b></li>';
 return '<article class="card" data-code="'+c+'" data-cat="'+tt+'" data-line="'+esc(m.g||"")+'" data-fab="'+esc(fabF(m))+'"'+(big(m)?' data-big="1"':'')+(m.new?' data-new="1"':'')+'>\n <div class="ph">'+(m.new?'<span class="nbadge">جديد 🆕</span>':'')+'<img src="'+esc(im[0]||"")+'" alt="موديل '+c+' — '+tt+'" loading="lazy" decoding="async" width="'+w+'" height="'+h+'"></div>\n <div class="cb">\n  <p class="code">كود <b dir="ltr">'+c+'</b></p>\n  '+(lb?'<p class="cat-l">'+lb+'</p>':'')+'\n  '+sw+'\n  <ul class="meta">'+me+'</ul>\n  <a class="card-wa" href="'+waCard(m,t)+'" target="_blank" rel="noopener" data-code="'+c+'"><svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg> اطلب على واتساب</a>\n </div>\n</article>';
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
function get(p){return fetch(p,{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function applySite(s){
 if(!s)return;
 if(s.wa&&/^\d{8,15}$/.test(s.wa)){
  var old=WA,oldD=WAD;WA=s.wa;WAD=s.wa_display||("+"+s.wa);
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){a.href=a.getAttribute("href").replace(/wa\.me\/\d+/,"wa.me/"+WA);if(a.textContent.trim()===oldD)a.textContent=WAD});
 }
 var h1=document.querySelector(".hero h1");if(h1&&s.hero)h1.innerHTML=esc(s.hero).replace(/\n/g,"<br>");
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
  grid.innerHTML=ms.map(function(m){return card(m,c.title,m.g)}).join("");
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
  nr.innerHTML=out.map(function(x){return '<div class="nw">'+card(x[0],x[1].title)+'<a class="nw-cat" href="'+esc(x[1].key)+'.html">'+esc(x[1].title)+' ‹</a></div>'}).join("");
  var ns=nr.closest(".newin");if(ns)ns.hidden=!out.length}
 var fg=document.querySelector(".feat .grid");
 if(fg){var fs=vis.filter(function(m){return m.f});if(fs.length)fg.innerHTML=fs.map(function(m){return card(m,(cats[m.cat]||{}).title||"")}).join("");fg.closest(".feat").hidden=!fs.length}
}
function buildFilters(ms){
 var tl=document.querySelector(".tools");if(!tl||document.getElementById("fx"))return;
 var fo=fabOpts(ms),nb=ms.filter(big).length,box=document.createElement("div");box.id="fx";box.className="fx";var h="";
 if(fo.length>=2)h+='<label class="fx-sel"><span class="vh">القماش</span><select id="f-fab"><option value="">كل الأقمشة</option>'+fo.map(function(f){return '<option value="'+esc(f[0])+'">'+esc(f[0])+(isDef(f[0])?' · غالباً':'')+' ('+f[1]+')</option>'}).join("")+'</select></label>';
 if(nb>=2&&nb<ms.length)h+='<button type="button" class="fchip" id="f-big" aria-pressed="false">مقاسات كبيرة 3XL+ ('+nb+')</button>';
 var nn=ms.filter(function(m){return m.new}).length;if(nn>=1&&nn<ms.length)h+='<button type="button" class="fchip" id="f-new" aria-pressed="false">جديد 🆕 ('+nn+')</button>';
 h+='<span class="fx-n" id="f-n" aria-live="polite"></span>';
 box.innerHTML=h;tl.appendChild(box);
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
 if(s){var cd=s.closest(".card");var pi=cd.querySelector(".ph img");pi.removeAttribute("style");pi.classList.remove("fit");pi.src=s.dataset.src;cd.querySelectorAll(".sw-b").forEach(function(x){x.classList.toggle("on",x===s)});return}
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
function filt(){
 var v=q?q.value.trim().toUpperCase().replace(/\s+/g,""):"";var on=document.querySelector(".chip.on");var ln=on?on.dataset.line:"";var shown=0;
 var fs=document.getElementById("f-fab"),fv=fs?fs.value:"",bg=document.getElementById("f-big"),bv=bg&&bg.getAttribute("aria-pressed")==="true",nw=document.getElementById("f-new"),nv=nw&&nw.getAttribute("aria-pressed")==="true",all=0;
 document.querySelectorAll("#grid .card").forEach(function(c){all++;var ok=(!v||c.dataset.code.toUpperCase().replace(/\s+/g,"").indexOf(v)>-1)&&(!ln||c.dataset.line===ln)&&(!fv||c.dataset.fab===fv)&&(!bv||c.dataset.big==="1")&&(!nv||c.dataset.new==="1");c.hidden=!ok;if(ok)shown++});
 var fn=document.getElementById("f-n");if(fn)fn.textContent=shown<all?shown+" من "+all+" موديل":"";
 var em=document.getElementById("empty");if(em)em.hidden=shown>0;
}
if(q)q.addEventListener("input",filt);
window.addEventListener("storage",function(){list=load();buyer=loadB();render()});
var lo=document.getElementById("lb-open");if(lo&&!document.getElementById("lb-t"))lo.innerHTML='<span class="lb-n" id="lb-n">0</span><span id="lb-t"> موديل بالقائمة</span>';
var cnv=document.querySelector(".catnav [aria-current]");if(cnv){var nv=cnv.parentNode;try{nv.scrollLeft=cnv.offsetLeft-(nv.clientWidth-cnv.offsetWidth)/2}catch(e){}}
try{localStorage.removeItem(KEY)}catch(e){}
list=[];
render();
var needCat=document.getElementById("grid")||document.getElementById("new-rail")||document.querySelector(".tiles")||document.querySelector(".feat .grid");
Promise.all([get("data/site.json").catch(function(){return null}),needCat?get("data/catalog.json").catch(function(){return null}):Promise.resolve(null)]).then(function(r){
 try{applySite(r[0])}catch(e){}
 if(needCat){if(r[1]){try{applyCatalog(r[1])}catch(e){}}else{var g=document.getElementById("grid");if(g&&g.dataset.cat&&!g.children.length)g.innerHTML='<p class="empty">ما قدرنا نحمّل الموديلات. حدّث الصفحة أو اسألنا على واتساب.</p>'}}
 render();if(q&&q.value)filt();fitAll();
});
})();
