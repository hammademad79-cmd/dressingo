(function(){
"use strict";
var OWNER="hammademad79-cmd",REPO="dressingo",BR="main",TK="dz_editor_token_v1";
var API=window.DZ_API||"https://api.github.com";
var RP="/repos/"+OWNER+"/"+REPO;
var CAT_PATH="data/catalog.json",SITE_PATH="data/site.json";
var KJ="k.json",KPATH="e-sb627h5m14ut7srw4rwvpd/k.json";
var token="";try{token=sessionStorage.getItem(TK)||localStorage.getItem(TK)||""}catch(e){}
var D=null; // {sha, cat, site}
var blobUrls={}; // repo path -> local preview url (new photos before the site updates)
var $=function(id){return document.getElementById(id)};
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function el(tag,attrs,html){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==="text")e.textContent=attrs[k];else e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;return e}
function imgSrc(p){return blobUrls[p]||("../"+p)}
function b64utf8(s){var b=new TextEncoder().encode(s),o="",i;for(i=0;i<b.length;i+=0x8000)o+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(o)}
function UErr(m){var e=new Error(m);e.user=true;return e}


/* ---------- password unlock: the GitHub key is kept encrypted in k.json (PBKDF2-SHA256 + AES-GCM 256) ---------- */
function u8(b64){var s=atob(b64),o=new Uint8Array(s.length);for(var i=0;i<s.length;i++)o[i]=s.charCodeAt(i);return o}
function b64u8(a){var o="";for(var i=0;i<a.length;i+=0x8000)o+=String.fromCharCode.apply(null,a.subarray(i,i+0x8000));return btoa(o)}
function deriveKey(pw,salt,iter){
 return crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]).then(function(base){
  return crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:iter,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
 });
}
function decryptKey(k,pw){
 return deriveKey(pw,u8(k.salt),k.iter).then(function(key){return crypto.subtle.decrypt({name:"AES-GCM",iv:u8(k.iv)},key,u8(k.ct))}).then(function(pt){return new TextDecoder().decode(pt)},function(){throw UErr("❌ كلمة السر غلط. جرّب كمان مرة (انتبه للأحرف الصغيرة والكبيرة).")});
}
function encryptKey(tok,pw){
 var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),iter=600000;
 return deriveKey(pw,salt,iter).then(function(key){return crypto.subtle.encrypt({name:"AES-GCM",iv:iv},key,new TextEncoder().encode(tok))}).then(function(ct){
  return JSON.stringify({v:1,kdf:"PBKDF2-SHA256",iter:iter,cipher:"AES-GCM-256",salt:b64u8(salt),iv:b64u8(iv),ct:b64u8(new Uint8Array(ct))},null,1)+"\n";
 });
}
function keepToken(t,remember){
 try{sessionStorage.setItem(TK,t)}catch(e){}
 try{if(remember)localStorage.setItem(TK,t);else localStorage.removeItem(TK)}catch(e){}
}
function forgetToken(){try{sessionStorage.removeItem(TK)}catch(e){}try{localStorage.removeItem(TK)}catch(e){}}

/* ---------- GitHub API ---------- */
function api(method,path,body,raw){
 var h={"Authorization":"Bearer "+token,"Accept":raw?"application/vnd.github.raw+json":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
 if(body)h["Content-Type"]="application/json";
 return fetch(API+path,{method:method,headers:h,body:body?JSON.stringify(body):undefined,cache:"no-store"}).then(function(r){
  if(!r.ok){return r.text().then(function(t){var e=new Error("HTTP "+r.status+" "+t.slice(0,300));e.status=r.status;e.text=t;throw e})}
  if(r.status===204)return null;
  return raw?r.text():r.json();
 });
}
function readFresh(){
 return api("GET",RP+"/git/ref/heads/"+BR+"?fresh="+Date.now()).then(function(ref){
  var sha=ref.object.sha;
  return Promise.all([api("GET",RP+"/contents/"+CAT_PATH+"?ref="+sha,null,true),api("GET",RP+"/contents/"+SITE_PATH+"?ref="+sha,null,true)]).then(function(r){
   return {sha:sha,cat:JSON.parse(r[0]),site:JSON.parse(r[1])};
  });
 });
}
function catText(c){
 var head=JSON.stringify({v:c.v||1,cats:c.cats});head=head.slice(0,-1);
 return head+',"models":[\n'+c.models.map(function(m){return JSON.stringify(m)}).join(",\n")+"\n]}\n";
}
function siteText(s){return JSON.stringify(s,null,1)+"\n"}
function errText(e){
 if(e&&e.user)return e.message;
 var s=e&&e.status,t=(e&&e.text)||"";
 if(!s)return "في مشكلة بالإنترنت أو الاتصال. تأكد من الشبكة وجرّب كمان مرة.";
 if(s===401)return "المفتاح غلط أو انتهت صلاحيته. اعمل مفتاح جديد والصقه (زر «خروج» بعدين ادخل من جديد).";
 if(s===403&&/rate limit/i.test(t))return "صار في طلبات كتير. استنى دقيقة وجرّب كمان مرة.";
 if(s===403||s===404)return "المفتاح ما إله صلاحية تعديل على موقع dressingo. لازم يكون Contents = Read and write ومختار الـ repo «dressingo».";
 if(s===409||s===422)return "في تعديل تاني صار بنفس اللحظة. جرّب كمان مرة.";
 if(s>=500)return "GitHub عنده مشكلة هلق. جرّب بعد شوي.";
 return "صار خطأ ("+s+"). جرّب كمان مرة.";
}
/* one save = one commit on the current main, read fresh every time; never force */
function commit(message,mutate,blobs){
 var attempt=0,blobShas={};
 function upBlobs(){
  var list=(blobs||[]).filter(function(b){return !blobShas[b.path]});
  return list.reduce(function(p,b){return p.then(function(){return api("POST",RP+"/git/blobs",{content:b.b64,encoding:"base64"}).then(function(r){blobShas[b.path]=r.sha})})},Promise.resolve());
 }
 function once(){
  attempt++;
  var fresh;
  return readFresh().then(function(f){fresh=f;return mutate(f)}).then(function(out){
   return api("GET",RP+"/git/commits/"+fresh.sha).then(function(c){
    var tree=[],fp=Object.keys(out.files||{});
    return fp.reduce(function(pr,p){return pr.then(function(){return api("POST",RP+"/git/blobs",{content:b64utf8(out.files[p]),encoding:"base64"}).then(function(r){tree.push({path:p,mode:"100644",type:"blob",sha:r.sha})})})},Promise.resolve()).then(function(){
    (blobs||[]).forEach(function(b){tree.push({path:b.path,mode:"100644",type:"blob",sha:blobShas[b.path]})});
    (out.del||[]).forEach(function(p){tree.push({path:p,mode:"100644",type:"blob",sha:null})});
    return api("POST",RP+"/git/trees",{base_tree:c.tree.sha,tree:tree});
    });
   }).then(function(t){
    return api("POST",RP+"/git/commits",{message:message,tree:t.sha,parents:[fresh.sha]});
   }).then(function(nc){
    return api("PATCH",RP+"/git/refs/heads/"+BR,{sha:nc.sha,force:false}).then(function(){
     D={sha:nc.sha,cat:out.cat||fresh.cat,site:out.site||fresh.site};
     return {sha:nc.sha,out:out};
    });
   });
  }).catch(function(e){
   if(!e.user&&(e.status===409||e.status===422)&&attempt<4)return new Promise(function(r){setTimeout(r,800*attempt)}).then(once);
   throw e;
  });
 }
 return upBlobs().then(once);
}

/* ---------- toast ---------- */
var liveTimer=null;
function toast(kind,msg,btns){
 var t=$("toast");t.className=kind||"";$("toast-m").innerHTML=msg;var x=$("toast-x");x.innerHTML="";
 (btns||[]).forEach(function(b){var e=el("button",{type:"button","class":"sm"+(b.pri?" pri":"")});e.textContent=b.t;e.onclick=b.f;x.appendChild(e)});
 t.classList.remove("hide");
}
function hideToast(){$("toast").classList.add("hide")}
function busy(msg){toast("","⏳ "+(msg||"عم نحفظ… لا تسكّر الصفحة"))}
function done(res,checkPath,checkText){
 toast("ok","✅ تم الحفظ.<br>الموقع بيتحدّث خلال دقيقة أو دقيقتين.<br><span class=\"mu\" id=\"live-st\">⏳ عم نستنى الموقع يتحدّث…</span>",[{t:"تمام",pri:1,f:hideToast},{t:"🌐 افتح الموقع",f:function(){window.open("../","_blank","noopener")}}]);
 if(liveTimer)clearInterval(liveTimer);
 var n=0;
 liveTimer=setInterval(function(){
  n++;if(n>24){clearInterval(liveTimer);var s=$("live-st");if(s)s.textContent="الموقع لسّا ما تحدّث، عادي أحياناً بياخد كم دقيقة.";return}
  fetch("../"+checkPath+"?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.text()}).then(function(t){if(t===checkText){clearInterval(liveTimer);var s=$("live-st");if(s)s.textContent="🌐 صار ظاهر عالموقع."}}).catch(function(){});
 },10000);
}
function fail(e){
 try{console.error(e)}catch(_){}
 toast("bad","❌ ما انحفظ.<br>"+esc(errText(e))+"<br><span class=\"mu\">ما تغيّر شي عالموقع.</span>",[{t:"تمام",pri:1,f:hideToast}]);
}
function save(message,mutate,blobs,checkPath){
 busy();
 return commit(message,mutate,blobs).then(function(r){
  var txt=checkPath===SITE_PATH?siteText(D.site):catText(D.cat);
  done(r,checkPath||CAT_PATH,txt);return r;
 },function(e){fail(e);throw e});
}

/* ---------- views ---------- */
var views=["login","home","form","list","order","texts","pw"],cur="";
function show(v){views.forEach(function(x){$("v-"+x).classList.toggle("hide",x!==v)});cur=v;$("b-home").classList.toggle("hide",v==="home"||v==="login");window.scrollTo(0,0)}
$("b-home").onclick=function(){show("home");homeInfo()};
document.addEventListener("click",function(e){
 var g=e.target.closest("[data-go]");if(g){go(g.dataset.go);return}
 if(e.target.closest("[data-back]")){if(editing)show("list");else{show("home");homeInfo()}}
});
function go(v){
 if(v==="add")openForm(null);
 else if(v==="list"){fillCatSelect($("l-cat"),true);renderList(true);show("list")}
 else if(v==="order"){fillCatSelect($("o-cat"),false);loadOrder();show("order")}
 else if(v==="texts"){fillTexts();show("texts")}
 else if(v==="pw"){show("pw")}
}
function cats(){return (D&&D.cat.cats)||[]}
function catTitle(k){var c=cats().filter(function(c){return c.key===k})[0];return c?c.title:k}
function fillCatSelect(s,all){var v=s.value;s.innerHTML=(all?'<option value="">كل الأقسام</option>':"")+cats().map(function(c){return '<option value="'+esc(c.key)+'">'+esc(c.title)+'</option>'}).join("");if(v)s.value=v}
function homeInfo(){if(!D)return;var m=D.cat.models,vis=m.filter(function(x){return !x.off}).length;$("home-info").textContent="عالموقع هلق: "+vis+" موديل ظاهر"+(m.length>vis?" و"+(m.length-vis)+" مخفي":"")+".";}

/* ---------- login ---------- */
$("b-login").onclick=function(){
 var t=$("tok").value.trim().replace(/\s+/g,"");
 if(!/^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(t)){toast("bad","❌ هاد مش شكل المفتاح. المفتاح بيبلّش بـ github_pat_ — انسخه كله والصقه.",[{t:"تمام",pri:1,f:hideToast}]);return}
 token=t;busy("عم نتأكد من المفتاح…");
 // a write check that changes nothing on the site: an unreferenced git blob
 api("POST",RP+"/git/blobs",{content:"dressingo-editor-check",encoding:"utf-8"}).then(function(){
  keepToken(t,true);
  $("tok").value="";return start();
 }).then(function(){toast("ok","✅ المفتاح شغّال وانحفظ على هالتلفون. صار فيك تعدّل.",[{t:"يلا",pri:1,f:hideToast}])}).catch(function(e){token="";fail(e)});
};

$("b-pw").onclick=function(){
 var pw=$("pw").value;
 if(!pw){toast("bad","اكتب كلمة السر أول.",[{t:"تمام",pri:1,f:hideToast}]);return}
 if(!(window.crypto&&crypto.subtle)){toast("bad","❌ هالمتصفح قديم وما بيدعم فتح القفل. جرّب Chrome أو Safari محدّث.",[{t:"تمام",pri:1,f:hideToast}]);return}
 busy("عم نفتح القفل…");
 fetch(KJ+"?t="+Date.now(),{cache:"no-store"}).then(function(r){if(!r.ok)throw UErr("❌ ما قدرنا نجيب ملف القفل. تأكد من النت وجرّب كمان مرة.");return r.json()}).then(function(k){return decryptKey(k,pw)}).then(function(t){
  token=t;keepToken(t,$("pw-rem").checked);$("pw").value="";return start();
 }).catch(function(e){token="";if(e&&e.user){toast("bad",esc(e.message),[{t:"تمام",pri:1,f:hideToast}]);$("pw").select&&$("pw").select()}else fail(e)});
};
$("pw").addEventListener("keydown",function(e){if(e.key==="Enter")$("b-pw").click()});
$("show-paste").onclick=function(e){e.preventDefault();$("paste-box").classList.toggle("hide")};
/* change password: decrypt the current k.json from main with the old password, re-encrypt, commit */
$("b-pw-save").onclick=function(){
 var o=$("pw-old").value,n1=$("pw-new").value,n2=$("pw-new2").value;
 function bad(m){toast("bad",m,[{t:"تمام",pri:1,f:hideToast}])}
 if(!o||!n1||!n2)return bad("❌ عبّي التلات خانات.");
 if(n1.length<10)return bad("❌ كلمة السر الجديدة لازم تكون 10 أحرف أو أكتر.");
 if(n1!==n2)return bad("❌ كلمة السر الجديدة مش متطابقة بالخانتين. اكتبها نفسها مرتين.");
 if(n1===o)return bad("❌ كلمة السر الجديدة نفس القديمة.");
 busy("عم نغيّر كلمة السر… لا تسكّر الصفحة");
 var newText=null;
 commit("Editor: change unlock password",function(f){
  return api("GET",RP+"/contents/"+KPATH+"?ref="+f.sha,null,true).then(function(txt){return decryptKey(JSON.parse(txt),o)},function(e){if(e.status===404)throw UErr("❌ ما لقينا ملف القفل بالموقع.");throw e}).then(function(t){
   if(t!==token&&token)throw UErr("❌ المفتاح المحفوظ مش نفس اللي بالقفل. اطلع وادخل من جديد وجرّب.");
   return encryptKey(t,n1);
  }).then(function(txt){newText=txt;var files={};files[KPATH]=txt;return {files:files}});
 }).then(function(){
  $("pw-old").value=$("pw-new").value=$("pw-new2").value="";
  toast("ok","✅ تغيّرت كلمة السر.<br>من هلق ادخل بكلمة السر الجديدة. (على التلفونات التانية بتشتغل الجديدة بعد دقيقة أو دقيقتين.)",[{t:"تمام",pri:1,f:function(){hideToast();show("home");homeInfo()}}]);
 }).catch(function(e){if(e&&e.user)bad(esc(e.message).replace("كلمة السر غلط","كلمة السر القديمة غلط"));else fail(e)});
};
$("b-logout").onclick=function(){if(!confirm("أكيد بدك تطلع؟ رح تحتاج كلمة السر لتدخل من جديد."))return;forgetToken();token="";D=null;show("login")};
function start(){
 busy("عم نحمّل الموديلات…");
 return readFresh().then(function(f){D=f;hideToast();show("home");homeInfo()}).catch(function(e){fail(e);if(e.status===401){forgetToken();token="";show("login")}});
}

/* ---------- photos ---------- */
var photos=[]; // [{path, w,h, b64?, url}] first = main
function compress(file){
 return new Promise(function(res,rej){
  var u=URL.createObjectURL(file),im=new Image();
  im.onload=function(){
   var w=im.naturalWidth,h=im.naturalHeight,MW=720,MH=1400;
   if(w>MW){h=Math.round(h*MW/w);w=MW}if(h>MH){w=Math.round(w*MH/h);h=MH}
   var cv=document.createElement("canvas");cv.width=w;cv.height=h;var cx=cv.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,w,h);cx.drawImage(im,0,0,w,h);URL.revokeObjectURL(u);
   cv.toBlob(function(b){
    if(b&&b.type==="image/webp")return fin(b,"webp");
    cv.toBlob(function(b2){b2?fin(b2,"jpg"):rej(UErr("ما قدرنا نقرأ الصورة."))},"image/jpeg",0.82);
   },"image/webp",0.8);
   function fin(b,ext){var fr=new FileReader();fr.onload=function(){res({blob:b,ext:ext,w:w,h:h,b64:String(fr.result).split(",")[1],url:URL.createObjectURL(b)})};fr.onerror=function(){rej(UErr("ما قدرنا نقرأ الصورة."))};fr.readAsDataURL(b)}
  };
  im.onerror=function(){URL.revokeObjectURL(u);rej(UErr("هالصورة ما انقرت. جرّب صورة تانية (JPG أو PNG)."))};
  im.src=u;
 });
}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,30)||"m"}
$("f-file").onchange=function(){
 var fs=Array.prototype.slice.call(this.files||[]);this.value="";
 if(!fs.length)return;
 var room=4-photos.length;if(room<=0){toast("bad","❌ أكتر شي 4 صور للموديل.",[{t:"تمام",pri:1,f:hideToast}]);return}
 fs=fs.slice(0,room);busy("عم نصغّر الصور…");
 fs.reduce(function(p,f){return p.then(function(){return compress(f).then(function(r){photos.push({nw:r,url:r.url,w:r.w,h:r.h})})})},Promise.resolve()).then(function(){hideToast();renderPhotos()}).catch(fail);
};
function renderPhotos(){
 var box=$("f-photos");box.innerHTML="";
 if(!photos.length){box.appendChild(el("p",{"class":"mu",text:"ما في صور لسّا."}))}
 photos.forEach(function(p,i){
  var d=el("div",{"class":"p"});var im=el("img",{src:p.url||imgSrc(p.path),alt:""});d.appendChild(im);
  var x=el("button",{type:"button","aria-label":"شيل الصورة"});x.textContent="✕";x.onclick=function(){photos.splice(i,1);renderPhotos()};d.appendChild(x);
  if(i===0){d.appendChild(el("span",{"class":"m",text:"الرئيسية"}))}
  else{im.style.cursor="pointer";im.title="خليها الرئيسية";im.onclick=function(){var p0=photos.splice(i,1)[0];photos.unshift(p0);renderPhotos()}}
  box.appendChild(d);
 });
 if(photos.length>1)box.appendChild(el("p",{"class":"mu",text:"اضغط على أي صورة لتصير هي الرئيسية."}));
}

/* ---------- add / edit form ---------- */
var editing=null; // model id when editing
function fillGroups(cat,val){
 var s=$("f-group"),c=cats().filter(function(x){return x.key===cat})[0],gs=c?(c.groups||[]).slice():[];
 D.cat.models.forEach(function(m){if(m.cat===cat&&m.g&&gs.indexOf(m.g)<0)gs.push(m.g)});
 s.innerHTML='<option value="">— بدون مجموعة —</option>'+gs.map(function(g){return '<option>'+esc(g)+'</option>'}).join("")+'<option value="__new">➕ مجموعة جديدة…</option>';
 s.value=val&&gs.indexOf(val)>-1?val:"";$("f-group-new").classList.add("hide");$("f-group-new").value="";
}
$("f-cat").onchange=function(){fillGroups(this.value,"")};
$("f-group").onchange=function(){$("f-group-new").classList.toggle("hide",this.value!=="__new")};
function findM(id,d){return ((d||D).cat.models).filter(function(m){return m.id===id})[0]}
function openForm(id){
 editing=id;var m=id?findM(id):null;
 fillCatSelect($("f-cat"),false);
 $("f-title").textContent=m?"✏️ تعديل الموديل "+m.c:"➕ موديل جديد";
 $("f-code").value=m?m.c:"";$("f-cat").value=m?m.cat:(cats()[0]||{}).key;
 fillGroups($("f-cat").value,m?m.g:"");
 $("f-sizes").value=m&&m.sizes||"";$("f-fabric").value=m&&m.fabric||"";$("f-colors").value=m&&m.colors||"";
 $("f-feat").checked=!!(m&&m.f);
 $("f-pos-w").classList.toggle("hide",!!m);$("f-edit-actions").classList.toggle("hide",!m);
 if(m)$("f-hide").textContent=m.off?"👁️ إظهار عالموقع":"🙈 إخفاء من الموقع";
 photos=m?(m.img||[]).map(function(p){return {path:p,w:m.w,h:m.h}}):[];
 renderPhotos();show("form");
}
function readForm(){
 var code=$("f-code").value.trim().replace(/\s+/g," ");
 if(!code)throw UErr("اكتب كود الموديل.");
 if(code.length>40)throw UErr("الكود طويل كتير.");
 if(!photos.length)throw UErr("حط صورة وحدة عالأقل.");
 var g=$("f-group").value;if(g==="__new")g=$("f-group-new").value.trim();
 return {c:code,cat:$("f-cat").value,g:g,sizes:$("f-sizes").value.trim(),fabric:$("f-fabric").value.trim(),colors:$("f-colors").value.trim(),f:$("f-feat").checked};
}
function setOpt(m,k,v){if(v)m[k]=v;else delete m[k]}
function ensureGroup(d,cat,g){if(!g)return;var c=d.cat.cats.filter(function(x){return x.key===cat})[0];if(c){c.groups=c.groups||[];if(c.groups.indexOf(g)<0)c.groups.push(g)}}
function dupCheck(d,code,cat,selfId){var x=d.cat.models.filter(function(m){return m.cat===cat&&m.c.toUpperCase()===code.toUpperCase()&&m.id!==selfId})[0];if(x)throw UErr("الكود «"+code+"» موجود من قبل بنفس القسم.")}
function newBlobs(code){
 var t=Date.now().toString(36),blobs=[];
 photos.forEach(function(p,i){if(p.nw&&!p.path){p.path="img/p/n-"+slug(code)+"-"+t+"-"+i+"."+p.nw.ext}if(p.nw)blobs.push({path:p.path,b64:p.nw.b64})});
 return blobs;
}
$("f-save").onclick=function(){
 var v;try{v=readForm()}catch(e){fail(e);return}
 var blobs=newBlobs(v.c),paths=photos.map(function(p){return p.path}),w=photos[0].w||480,h=photos[0].h||600,pos=$("f-pos").value,id=editing;
 var orig=id?JSON.parse(JSON.stringify(findM(id))):null;
 save((id?"Editor: edit model ":"Editor: add model ")+v.c,function(d){
  var del=[];
  dupCheck(d,v.c,v.cat,id);
  if(!id){
   var m={id:"n-"+slug(v.c)+"-"+Date.now().toString(36),c:v.c,cat:v.cat};setOpt(m,"g",v.g);m.img=paths;m.w=w;m.h=h;setOpt(m,"sizes",v.sizes);setOpt(m,"fabric",v.fabric);setOpt(m,"colors",v.colors);if(v.f)m.f=1;
   var ms=d.cat.models,idx=[];ms.forEach(function(x,i){if(x.cat===v.cat)idx.push(i)});
   var at=idx.length?(pos==="top"?idx[0]:idx[idx.length-1]+1):ms.length;ms.splice(at,0,m);
  }else{
   var m=findM(id,d);if(!m)throw UErr("هالموديل ما عاد موجود (يمكن انمسح). ارجع للقائمة.");
   // only the fields changed in this form, on top of the fresh copy
   if(v.c!==orig.c)m.c=v.c;
   if(v.cat!==orig.cat){var ms=d.cat.models;ms.splice(ms.indexOf(m),1);m.cat=v.cat;var idx=[];ms.forEach(function(x,i){if(x.cat===v.cat)idx.push(i)});ms.splice(idx.length?idx[0]:ms.length,0,m)}
   ["g","sizes","fabric","colors"].forEach(function(k){if((v[k]||"")!==(orig[k]||""))setOpt(m,k,v[k])});
   if(!!v.f!==!!orig.f){if(v.f)m.f=1;else delete m.f}
   if(paths.join("|")!==(orig.img||[]).join("|")){
    (m.img||[]).forEach(function(p){if(paths.indexOf(p)<0&&!d.cat.models.some(function(o){return o!==m&&(o.img||[]).indexOf(p)>-1}))del.push(p)});
    m.img=paths;m.w=w;m.h=h;
   }
  }
  ensureGroup(d,v.cat,v.g);
  return {files:{"data/catalog.json":catText(d.cat)},cat:d.cat,del:del};
 },blobs).then(function(){
  photos.forEach(function(p){if(p.nw){blobUrls[p.path]=p.url;delete p.nw}});
  if(id){openForm(id);toastKeep()}else{openForm(null);toastKeep()}
 }).catch(function(){});
};
function toastKeep(){$("toast").classList.remove("hide")}
$("f-hide").onclick=function(){
 var id=editing,m=findM(id),to=!m.off;
 save((to?"Editor: hide model ":"Editor: show model ")+m.c,function(d){var x=findM(id,d);if(!x)throw UErr("هالموديل ما عاد موجود.");if(to)x.off=1;else delete x.off;return {files:{"data/catalog.json":catText(d.cat)},cat:d.cat}}).then(function(){openForm(id);toastKeep()}).catch(function(){});
};
$("f-del").onclick=function(){
 var id=editing,m=findM(id);
 if(!confirm("أكيد بدك تحذف الموديل «"+m.c+"» نهائياً مع صوره؟ (إذا بدك ترجعه بعدين، الأحسن تخفيه بدل الحذف)"))return;
 save("Editor: delete model "+m.c,function(d){var x=findM(id,d);if(!x)throw UErr("هالموديل ما عاد موجود.");var ms=d.cat.models;ms.splice(ms.indexOf(x),1);
  var del=(x.img||[]).filter(function(p){return !ms.some(function(o){return (o.img||[]).indexOf(p)>-1})});
  return {files:{"data/catalog.json":catText(d.cat)},cat:d.cat,del:del}}).then(function(){editing=null;go("list");toastKeep()}).catch(function(){});
};

/* ---------- list ---------- */
var listLimit=40;
$("l-cat").onchange=function(){renderList(true)};$("l-q").oninput=function(){renderList(true)};
$("l-more").onclick=function(){listLimit+=40;renderList(false)};
function renderList(reset){
 if(reset)listLimit=40;
 var k=$("l-cat").value,q=$("l-q").value.trim().toUpperCase().replace(/\s+/g,"");
 var ms=D.cat.models.filter(function(m){return (!k||m.cat===k)&&(!q||m.c.toUpperCase().replace(/\s+/g,"").indexOf(q)>-1)});
 $("l-n").textContent=ms.length+" موديل";
 var box=$("l-rows");box.innerHTML="";
 ms.slice(0,listLimit).forEach(function(m){
  var b=el("button",{type:"button","class":"row"});
  b.innerHTML='<img loading="lazy" alt="" src="'+esc(imgSrc((m.img||[])[0]||""))+'"><span class="t"><b>'+esc(m.c)+'</b><span>'+esc(catTitle(m.cat))+(m.g?" · "+esc(m.g):"")+'</span></span>'+(m.off?'<span class="badge b-off">مخفي</span>':"")+(m.f?'<span class="badge b-f">⭐</span>':"");
  b.onclick=function(){openForm(m.id)};box.appendChild(b);
 });
 $("l-more").classList.toggle("hide",ms.length<=listLimit);
}

/* ---------- order ---------- */
var order=[];
$("o-cat").onchange=loadOrder;
function loadOrder(){var k=$("o-cat").value;order=D.cat.models.filter(function(m){return m.cat===k});renderOrder()}
function renderOrder(){
 var box=$("o-rows");box.innerHTML="";
 order.forEach(function(m,i){
  var r=el("div",{"class":"row"});
  r.innerHTML='<span class="mu" style="min-width:28px">'+(i+1)+'</span><img loading="lazy" alt="" src="'+esc(imgSrc((m.img||[])[0]||""))+'"><span class="t"><b>'+esc(m.c)+'</b><span>'+(m.off?"مخفي":(m.g?esc(m.g):""))+'</span></span>';
  var o=el("span",{"class":"ord"});
  [["⏫","لأول القسم",function(){order.unshift(order.splice(i,1)[0])}],["⬆️","لفوق",function(){if(i>0){var t=order[i-1];order[i-1]=order[i];order[i]=t}}],["⬇️","لتحت",function(){if(i<order.length-1){var t=order[i+1];order[i+1]=order[i];order[i]=t}}]].forEach(function(a){var b=el("button",{type:"button","aria-label":a[1]});b.textContent=a[0];b.onclick=function(){a[2]();renderOrder()};o.appendChild(b)});
  r.appendChild(o);box.appendChild(r);
 });
}
function saveOrder(){
 var k=$("o-cat").value,ids=order.map(function(m){return m.id});
 save("Editor: reorder "+k,function(d){
  var ms=d.cat.models,slots=[],items=[];ms.forEach(function(m,i){if(m.cat===k){slots.push(i);items.push(m)}});
  var known=items.filter(function(m){return ids.indexOf(m.id)>-1}).sort(function(a,b){return ids.indexOf(a.id)-ids.indexOf(b.id)});
  var rest=items.filter(function(m){return ids.indexOf(m.id)<0});
  var nw=known.concat(rest);slots.forEach(function(s,j){ms[s]=nw[j]});
  return {files:{"data/catalog.json":catText(d.cat)},cat:d.cat};
 }).then(function(){loadOrder();toastKeep()}).catch(function(){});
}
$("o-save").onclick=saveOrder;$("o-save2").onclick=saveOrder;

/* ---------- texts + WhatsApp ---------- */
function termRow(t){
 var r=el("div",{"class":"card"});
 r.innerHTML='<input class="tt" placeholder="العنوان (مثلاً: الحد الأدنى للطلب)"><textarea class="td" rows="2" placeholder="النص" style="margin-top:8px"></textarea>';
 r.querySelector(".tt").value=t.t||"";r.querySelector(".td").value=t.d||"";
 var x=el("button",{type:"button","class":"sm danger"});x.textContent="🗑️ شيل هالسطر";x.style.marginTop="8px";x.onclick=function(){r.remove()};r.appendChild(x);
 return r;
}
function fillTexts(){
 var s=D.site;$("t-wa").value=s.wa_display||("+"+s.wa);$("t-hero").value=s.hero||"";$("t-lead").value=s.lead||"";$("t-ft").value=s.feat_title||"";$("t-fs").value=s.feat_sub||"";
 var st=$("t-steps");st.innerHTML="";(s.steps||[]).forEach(function(x,i){var c=el("div",{"class":"card"});c.innerHTML='<b>خطوة '+(i+1)+'</b><input class="tt" style="margin-top:8px"><textarea class="td" rows="2" style="margin-top:8px"></textarea>';c.querySelector(".tt").value=x.t;c.querySelector(".td").value=x.d;st.appendChild(c)});
 var tm=$("t-terms");tm.innerHTML="";(s.terms||[]).forEach(function(x){tm.appendChild(termRow(x))});
}
$("t-add-term").onclick=function(){$("t-terms").appendChild(termRow({}))};
function rows(box){return Array.prototype.map.call($(box).querySelectorAll(".card"),function(c){return {t:c.querySelector(".tt").value.trim(),d:c.querySelector(".td").value.trim()}}).filter(function(x){return x.t||x.d})}
$("t-save").onclick=function(){
 var waD=$("t-wa").value.trim(),wa=waD.replace(/\D/g,"").replace(/^00/,"");
 if(!/^\d{8,15}$/.test(wa)){fail(UErr("رقم الواتساب مش مزبوط. اكتبه مع رمز البلد، مثلاً ‎+90 533 449 10 40"));return}
 if(!/^\+/.test(waD))waD="+"+waD.replace(/^00/,"");
 var patch={wa:wa,wa_display:waD,hero:$("t-hero").value.trim(),lead:$("t-lead").value.trim(),feat_title:$("t-ft").value.trim(),feat_sub:$("t-fs").value.trim(),steps:rows("t-steps"),terms:rows("t-terms")};
 if(!patch.hero)return fail(UErr("العنوان الكبير ما لازم يكون فاضي."));
 save("Editor: texts / WhatsApp",function(d){
  var old=d.site,s=JSON.parse(JSON.stringify(old));for(var k in patch)s[k]=patch[k];
  var files={};files[SITE_PATH]=siteText(s);
  if(old.wa===s.wa&&old.wa_display===s.wa_display)return {files:files,site:s};
  // the number also sits in the pages themselves (works before the script runs): replace it there too
  return api("GET",RP+"/git/commits/"+d.sha).then(function(c){return api("GET",RP+"/git/trees/"+c.tree.sha)}).then(function(t){
   var ps=t.tree.filter(function(e){return e.type==="blob"&&(/\.html$/.test(e.path)||e.path==="script.js")}).map(function(e){return e.path});
   return Promise.all(ps.map(function(p){return api("GET",RP+"/contents/"+p+"?ref="+d.sha,null,true).then(function(txt){
    var n=txt.split("wa.me/"+old.wa).join("wa.me/"+s.wa).split(">"+old.wa_display+"<").join(">"+s.wa_display+"<");
    if(p==="script.js")n=n.replace('var WA="'+old.wa+'",WAD="'+old.wa_display+'"','var WA="'+s.wa+'",WAD="'+s.wa_display+'"');
    if(n!==txt)files[p]=n;
   })}));
  }).then(function(){return {files:files,site:s}});
 },null,SITE_PATH).then(function(){fillTexts();toastKeep()}).catch(function(){});
};

/* ---------- boot ---------- */
if(token)start();else show("login");
window.__dz={get D(){return D}};
})();
