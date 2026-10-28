;(function(){
 'use strict';
 const WA='https://wa.me/905334491040?text=';
 const PHONE='905334491040';

 // categories metadata (matches server data)
 window.CATS={winter:'نسائي شتوي',lingerie:'لانجري وأطقم',underwear:'ملابس داخلية وقطنيات',pajama:'بيجاما وهوم وير'};
 window.CAT_SLUG={winter:'winter.html',lingerie:'lingerie.html',underwear:'underwear.html',pajama:'pajama.html'};
 // order state
 let order=(function(){
 try{
 const raw=JSON.parse(localStorage.getItem('dressingo_order')||'{}');
 return {items:Array.isArray(raw.items)?raw.items:[],meta:(raw&&typeof raw.meta==='object'&&raw.meta)||{}};
 }catch(e){return {items:[],meta:{}}}
 })();
 function saveOrder(){localStorage.setItem('dressingo_order',JSON.stringify(order))}
 function renderBadge(){
 document.querySelectorAll('.cart-count').forEach(el=>{
 const n=order.items.reduce((s,i)=>s+parseInt(i.qty)||0,0);
 el.textContent=n;el.dataset.count=n;
 el.style.display=n?'flex':'none';
 });
 }
 window.addToOrder=function(code,name,sizes){
 const idx=order.items.findIndex(i=>i.code===code);
 if(idx>=0){order.items[idx].qty++}else{order.items.push({code,name,sizes:sizes||'',qty:1})}
 saveOrder();renderBadge();
 const btn=document.querySelector(`[data-code="${code}"]`);
 if(btn){btn.classList.add('added');setTimeout(()=>btn.classList.remove('added'),600)}
 };
 window.removeOrderItem=function(code){
 order.items=order.items.filter(i=>i.code!==code);saveOrder();renderBadge();
 const el=document.querySelector('#order-items');
 if(el){el.innerHTML='';order.items.forEach(i=>appendOrderLine(i));renderOrderSummary()}
 };
 // navbar toggle
 document.addEventListener('DOMContentLoaded',()=>{
 const tog=document.getElementById('menu-toggle');
 const nav=document.getElementById('main-nav');
 if(tog&&nav){tog.addEventListener('click',()=>nav.classList.toggle('open'))}
 document.querySelectorAll('.filter-btn').forEach(b=>{
 b.addEventListener('click',()=>{
 document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');
 document.querySelectorAll('.product-card').forEach(c=>{
 const cat=c.dataset.cat||'';
 c.style.display=(!b.dataset.cat||b.dataset.cat===cat||b.dataset.cat==='all')?'':'none';
 });
 });
 });
 renderBadge();
 // scroll spy for active nav
 const links=document.querySelectorAll('.nav a');
 const sections=document.querySelectorAll('section[id]');
 const onScroll=()=>{
 let cur='';
 sections.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id});
 links.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
 };
 window.addEventListener('scroll',onScroll,{passive:true});
 });
 // order page helpers
 window.initOrderPage=function(){
 const container=document.getElementById('order-items');
 if(!container)return;
 container.innerHTML='';
 order.items.forEach(i=>appendOrderLine(i));
 renderOrderSummary();
 // restore meta
 ['name','phone','country','city'].forEach(k=>{
 const el=document.getElementById('cust_'+k);
 if(el&&order.meta[k])el.value=order.meta[k];
 });
 // live save meta
 ['name','phone','country','city'].forEach(k=>{
 document.getElementById('cust_'+k).addEventListener('input',()=>{
 order.meta[k]=document.getElementById('cust_'+k).value;saveOrder();
 });
 });
 // add line button
 document.getElementById('add-line').addEventListener('click',()=>{
 appendOrderLine({code:'',name:'',sizes:'',qty:1});
 });
 // submit
 document.getElementById('order-form').addEventListener('submit',e=>{
 e.preventDefault();
 order.meta.name=document.getElementById('cust_name').value.trim();
 order.meta.phone=document.getElementById('cust_phone').value.trim();
 order.meta.country=document.getElementById('cust_country').value.trim();
 order.meta.city=document.getElementById('cust_city').value.trim();
 const lines=order.items.filter(i=>i.code.trim());
 if(!lines.length)return alert('أضف منتجا واحدا على الأقل');
 // save order
 const orders=JSON.parse(localStorage.getItem('dressingo_orders')||'[]');
 orders.push({date:new Date().toLocaleDateString('ar-EG'),name:order.meta.name,phone:order.meta.phone,country:order.meta.country,city:order.meta.city,items:lines.map(i=>({code:i.code,name:i.name,sizes:i.sizes,qty:i.qty})),status:'جديد',total:lines.reduce((s,i)=>s+i.qty,0)});
 localStorage.setItem('dressingo_orders',JSON.stringify(orders));
 const msg='*طلب جملة جديد*\nالاسم: '+order.meta.name+'\nالجوال: '+order.meta.phone+'\nالدولة: '+order.meta.country+'\nالمدينة: '+order.meta.city+'\nالمنتجات:\n'+lines.map((i,idx)=>(idx+1)+' - الكود: '+i.code+'\n الاسم: '+i.name+'\n المقاس: '+i.sizes+'\n الكمية: '+i.qty+' دزينة').join('\n')+'\nالمجموع: '+lines.reduce((s,i)=>s+i.qty,0)+' دزينة';
 const url=WA+encodeURIComponent(msg);
 window.open(url,'_blank');
 // reset draft
 order.items=[];order.meta={};saveOrder();renderBadge();
 document.getElementById('order-items').innerHTML='';
 ['cust_name','cust_phone','cust_country','cust_city'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
 renderOrderSummary();
 });
 document.getElementById('copy-order').addEventListener('click',()=>{
 const lines=order.items.filter(i=>i.code.trim());
 if(!lines.length)return alert('لا يوجد منتجات');
 const msg='المنتجات المطلوبة:\n'+lines.map((i,idx)=>(idx+1)+' - '+i.code+' | '+i.name+' | '+i.sizes+' | '+i.qty+' دزينة').join('\n')+'\nالمجموع: '+lines.reduce((s,i)=>s+i.qty,0)+' دزينة';
 navigator.clipboard.writeText(msg).then(()=>alert('تم نسخ الطلب'));
 });
 };
 function appendOrderLine(i){
 const c=document.getElementById('order-items');
 if(!c)return;
 const row=document.createElement('div');row.className='order-line';
 row.innerHTML=`<input placeholder="الكود" value="${i.code||''}" data-code><input placeholder="اسم المنتج" value="${i.name||''}" data-name><input type="number" min="1" value="${i.qty||1}" data-qty><select data-size><option ${!i.sizes?'selected':''}>المقاس</option><option ${i.sizes==='S'?'selected':''}>S</option><option ${i.sizes==='M'?'selected':''}>M</option><option ${i.sizes==='L'?'selected':''}>L</option><option ${i.sizes==='XL'?'selected':''}>XL</option><option ${i.sizes==='XXL'?'selected':''}>XXL</option></select><button type="button" class="btn btn-sm btn-outline" onclick="this.closest('.order-line').remove()">حذف</button>`;
 c.appendChild(row);
 row.querySelector('[data-qty]').addEventListener('input',e=>{i.qty=parseInt(e.target.value)||1});
 row.querySelector('[data-code]').addEventListener('input',e=>{i.code=e.target.value});
 row.querySelector('[data-name]').addEventListener('input',e=>{i.name=e.target.value});
 row.querySelector('[data-size]').addEventListener('change',e=>{i.sizes=e.target.value});
 }
 window.renderOrderSummary=function(){
 const el=document.getElementById('order-total');
 if(el)el.textContent=order.items.reduce((s,i)=>s+(i.qty||0),0)+' دزينة';
 };
 // admin page helpers
 window.initAdminPage=function(){
 let orders;try{orders=JSON.parse(localStorage.getItem('dressingo_orders')||'[]')}catch(e){orders=[]}
 if(!Array.isArray(orders))orders=[];
 let stock;try{stock=JSON.parse(localStorage.getItem('dressingo_stock')||'{}')}catch(e){stock={}}
 if(!stock||typeof stock!=='object')stock={};
 // stats
 const st={total:orders.length,new:orders.filter(o=>o.status==='جديد').length,shipped:orders.filter(o=>o.status==='تم الشحن').length,cancelled:orders.filter(o=>o.status==='ملغي').length};
 ['total','new','shipped','cancelled'].forEach(k=>{const el=document.getElementById('stat-'+k);if(el)el.textContent=st[k]});
 const otable=document.getElementById('orders-table');
 if(otable){
 otable.innerHTML='';
 if(!orders.length){otable.innerHTML='<tr><td colspan="6">لا توجد طلبات بعد</td></tr>'}
 orders.slice().reverse().forEach((o,i)=>{
 const tr=document.createElement('tr');
 const lines=(o.items||[]).map(it=>it.code+' x'+it.qty).join(', ');
 const total=(o.items||[]).reduce((s,it)=>s+(it.qty||0),0);
 tr.innerHTML=`<td>${o.date||''}</td><td>${o.name||''}</td><td>${o.city||''}</td><td>${lines}</td><td><select class="status-select" data-oi="${i}"><option ${o.status==='جديد'?'selected':''}>جديد</option><option ${o.status==='قيد التجهيز'?'selected':''}>قيد التجهيز</option><option ${o.status==='تم الشحن'?'selected':''}>تم الشحن</option><option ${o.status==='ملغي'?'selected':''}>ملغي</option></select></td><td>${total}</td>`;
 otable.appendChild(tr);
 });
 otable.querySelectorAll('select').forEach(sel=>{
 sel.addEventListener('change',e=>{
 const idx=parseInt(e.target.dataset.oi);
 orders[idx].status=e.target.value;
 localStorage.setItem('dressingo_orders',JSON.stringify(orders));
 });
 });
 }
 const sbody=document.getElementById('stock-body');
 if(sbody){
 sbody.innerHTML='';
 Object.keys(stock).sort().forEach(code=>{
 const tr=document.createElement('tr');
 const q=stock[code]||0;
 tr.innerHTML=`<td>${code}</td><td><input type="number" value="${q}" min="0" style="width:70px" class="stock-input" data-code="${code}"></td><td>${q<10?'<span style="color:var(--red)">⚠️ منخفض</span>':'—'}</td>`;
 sbody.appendChild(tr);
 tr.querySelector('.stock-input').addEventListener('change',e=>{
 stock[code]=parseInt(e.target.value)||0;
 localStorage.setItem('dressingo_stock',JSON.stringify(stock));
 e.target.closest('tr').querySelector('td:last-child').textContent=q<10?'⚠️ منخفض':'—';
 });
 });
 }
 // persist stock changes
 document.querySelectorAll('.stock-input').forEach(inp=>{
 inp.addEventListener('blur',e=>{
 const code=e.target.dataset.code;
 if(code){stock[code]=parseInt(e.target.value)||0;localStorage.setItem('dressingo_stock',JSON.stringify(stock))}
 });
 });
 document.getElementById('export-orders').addEventListener('click',()=>{
 const rows=[['التاريخ','الاسم','الجوال','الدولة','المدينة','المنتجات','الحالة','الإجمالي']];
 orders.forEach(o=>rows.push([o.date,o.name,o.phone,o.country,o.city,(o.items||[]).map(i=>i.code+'x'+i.qty).join(','),o.status,(o.items||[]).reduce((s,i)=>s+i.qty,0)]));
 dl(rows.map(r=>r.join(',')).join('\n'),'orders.csv');
 });
 document.getElementById('export-stock').addEventListener('click',()=>{
 dl('الكود,الكمية (دزينة)\n'+Object.entries(stock).map(([k,v])=>k+','+v).join('\n'),'stock.csv');
 });
 };
 function dl(text,name){
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));
 a.download=name;a.click();
 }
})();