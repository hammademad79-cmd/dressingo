(function(){
var WA="905334491040",KEY="dt_list_v1";
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
 if(ul){ul.innerHTML="";list.forEach(function(it){var li=document.createElement("li");var s=document.createElement("span");s.innerHTML="";var b=document.createElement("b");b.dir="ltr";b.textContent=it.c;s.appendChild(b);if(it.k){s.appendChild(document.createTextNode(" · "+it.k))}var x=document.createElement("button");x.type="button";x.textContent="شيل";x.addEventListener("click",function(){list=list.filter(function(o){return o.c!==it.c});save(list);render()});li.appendChild(s);li.appendChild(x);ul.appendChild(li)})}
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
 document.querySelectorAll("#grid .card").forEach(function(c){var ok=(!v||c.dataset.code.toUpperCase().indexOf(v)>-1)&&(!ln||c.dataset.line===ln);c.hidden=!ok;if(ok)shown++});
 var em=document.getElementById("empty");if(em)em.hidden=shown>0;
}
if(q)q.addEventListener("input",filt);
window.addEventListener("storage",function(){list=load();render()});
render();
})();
