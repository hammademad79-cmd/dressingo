(function(){
var WA="905334491040",WAD="+90 533 449 10 40",KEY="dt_list_v1";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
function save(l){try{localStorage.setItem(KEY,JSON.stringify(l))}catch(e){}}
var list=load();
function msg(){
 if(!list.length)return "مرحباً Dressingo، أنا صاحب محل وبدي الكتالوج والأسعار بالجملة.";
 var t="مرحباً Dressingo، بدي أسعار هالموديلات بالجملة:\n";
 list.forEach(function(it,i){t+=(i+1)+") كود "+it.c+(it.k?" — "+it.k:"")+"\n"});
 t+="\nالكمية والمقاسات: ";
 return t;
}
function url(){return "https://wa.me/"+WA+"?text="+encodeURIComponent(msg())}
function has(c){return list.some(function(it){return it.c===c})}
function render(){
 var bar=document.getElementById("listbar"),n=document.getElementById("lb-n");
 if(bar){bar.hidden=!list.length;n.textContent=list.length}
 ["lb-send","sheet-send"].forEach(function(id){var a=document.getElementById(id);if(a)a.href=url()});
 document.querySelectorAll(".add").forEach(function(b){var on=has(b.dataset.code);b.setAttribute("aria-pressed",on?"true":"false");b.textContent=on?"✓ بالقائمة":"+ أضف للقائمة"});
 var ul=document.getElementById("sheet-list");
 if(ul){ul.innerHTML="";list.forEach(function(it){var li=document.createElement("li");var s=document.createElement("span");var b=document.createElement("b");b.dir="ltr";b.textContent=it.c;s.appendChild(b);if(it.k){s.appendChild(document.createTextNode(" · "+it.k))}var x=document.createElement("button");x.type="button";x.textContent="شيل";x.addEventListener("click",function(){list=list.filter(function(o){return o.c!==it.c});save(list);render()});li.appendChild(s);li.appendChild(x);ul.appendChild(li)})}
}
/* ---- catalog data (data/catalog.json, data/site.json) ---- */
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function card(m,t){
 var c=esc(m.c),tt=esc(t),w=m.w||480,h=m.h||600,im=m.img||[],sw="",me="";
 if(im.length>1){var th=Math.floor(40*h/w);sw='<div class="sw" role="group" aria-label="صور أخرى">'+im.map(function(s,i){return '<button type="button" class="sw-b'+(i?'':' on')+'" data-src="'+esc(s)+'" aria-label="صورة '+(i+1)+'"><img src="'+esc(s)+'" alt="" loading="lazy" decoding="async" width="40" height="'+th+'"></button>'}).join("")+'</div>'}
 if(m.sizes)me+='<li><span>المقاسات</span><b dir="ltr">'+esc(m.sizes)+'</b></li>';
 if(m.fabric)me+='<li><span>القماش</span><b>'+esc(m.fabric)+'</b></li>';
 if(m.colors)me+='<li><span>الألوان</span><b>'+esc(m.colors)+'</b></li>';
 return '<article class="card" data-code="'+c+'" data-cat="'+tt+'" data-line="'+esc(m.g||"")+'">\n <div class="ph"><img src="'+esc(im[0]||"")+'" alt="موديل '+c+' — '+tt+'" loading="lazy" decoding="async" width="'+w+'" height="'+h+'"></div>\n <div class="cb">\n  <p class="code">كود <b dir="ltr">'+c+'</b></p>\n  '+sw+'\n  <ul class="meta">'+me+'</ul>\n  <button type="button" class="add" data-code="'+c+'" aria-pressed="false">+ أضف للقائمة</button>\n </div>\n</article>';
}
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
 var te=document.querySelector(".how .terms");if(te&&s.terms&&s.terms.length)te.innerHTML="\n  "+s.terms.map(function(x){return '<li><b>'+esc(x.t)+':</b> '+esc(x.d)+'</li>'}).join("\n  ")+"\n ";
}
function applyCatalog(d){
 if(!d)return;
 var cats={};(d.cats||[]).forEach(function(c){cats[c.key]=c});
 var vis=(d.models||[]).filter(function(m){return !m.off&&cats[m.cat]});
 var grid=document.getElementById("grid");
 if(grid&&grid.dataset.cat){
  var k=grid.dataset.cat,c=cats[k]||{title:"",groups:[]},ms=vis.filter(function(m){return m.cat===k});
  grid.innerHTML=ms.map(function(m){return card(m,c.title)}).join("");
  var hp=document.querySelector(".cat-hero p:not(.crumb)");if(hp)hp.textContent=ms.length+" موديل"+(c.sub?" · "+c.sub:"");
  var md=document.querySelector('meta[name="description"]');if(md)md.content=md.content.replace(/^\d+/,ms.length);
  var ch=document.querySelector(".chips");
  if(ch){var gs=(c.groups||[]).slice();ms.forEach(function(m){if(m.g&&gs.indexOf(m.g)<0)gs.push(m.g)});gs=gs.filter(function(g){return ms.some(function(m){return m.g===g})});
   ch.innerHTML='<button type="button" class="chip on" data-line="">الكل</button>'+gs.map(function(g){return '<button type="button" class="chip" data-line="'+esc(g)+'">'+esc(g)+'</button>'}).join("");ch.hidden=!gs.length}
 }
 var tiles=document.querySelectorAll(".tiles .tile");
 tiles.forEach(function(t){var k=(t.getAttribute("href")||"").replace(".html",""),ms=vis.filter(function(m){return m.cat===k});var sm=t.querySelector("small");if(sm)sm.textContent=ms.length+" موديل";var im=t.querySelector("img");if(im&&ms[0]&&ms[0].img)im.src=ms[0].img[0]});
 var fb=document.querySelector(".hero .facts li b");if(fb)fb.textContent=vis.length;
 var fg=document.querySelector(".feat .grid");
 if(fg){var fs=vis.filter(function(m){return m.f});if(fs.length)fg.innerHTML=fs.map(function(m){return card(m,(cats[m.cat]||{}).title||"")}).join("");fg.closest(".feat").hidden=!fs.length}
}
document.addEventListener("click",function(e){
 var b=e.target.closest(".add");
 if(b){var c=b.dataset.code,card=b.closest(".card"),k=card?card.dataset.cat:"";
  if(has(c))list=list.filter(function(o){return o.c!==c});else list.push({c:c,k:k});
  save(list);render();return}
 var s=e.target.closest(".sw-b");
 if(s){var cd=s.closest(".card");cd.querySelector(".ph img").src=s.dataset.src;cd.querySelectorAll(".sw-b").forEach(function(x){x.classList.toggle("on",x===s)});return}
 var ch=e.target.closest(".chip");
 if(ch){document.querySelectorAll(".chip").forEach(function(x){x.classList.toggle("on",x===ch)});filt();return}
});
var dlg=document.getElementById("sheet");
var op=document.getElementById("lb-open");if(op&&dlg)op.addEventListener("click",function(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")});
var cl=document.getElementById("sheet-close");if(cl)cl.addEventListener("click",function(){dlg.close?dlg.close():dlg.removeAttribute("open")});
var cr=document.getElementById("sheet-clear");if(cr)cr.addEventListener("click",function(){list=[];save(list);render();dlg.close&&dlg.close()});
var q=document.getElementById("q");
function filt(){
 var v=q?q.value.trim().toUpperCase().replace(/\s+/g,""):"";var on=document.querySelector(".chip.on");var ln=on?on.dataset.line:"";var shown=0;
 document.querySelectorAll("#grid .card").forEach(function(c){var ok=(!v||c.dataset.code.toUpperCase().replace(/\s+/g,"").indexOf(v)>-1)&&(!ln||c.dataset.line===ln);c.hidden=!ok;if(ok)shown++});
 var em=document.getElementById("empty");if(em)em.hidden=shown>0;
}
if(q)q.addEventListener("input",filt);
window.addEventListener("storage",function(){list=load();render()});
render();
var needCat=document.getElementById("grid")||document.querySelector(".tiles")||document.querySelector(".feat .grid");
Promise.all([get("data/site.json").catch(function(){return null}),needCat?get("data/catalog.json").catch(function(){return null}):Promise.resolve(null)]).then(function(r){
 try{applySite(r[0])}catch(e){}
 if(needCat){if(r[1]){try{applyCatalog(r[1])}catch(e){}}else{var g=document.getElementById("grid");if(g&&g.dataset.cat&&!g.children.length)g.innerHTML='<p class="empty">ما قدرنا نحمّل الموديلات. حدّث الصفحة أو اسألنا على واتساب.</p>'}}
 render();if(q&&q.value)filt();
});
})();
