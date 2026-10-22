/* Hijri (Umm al-Qura) and Nature calendars for ورد الجزء اليومي. Needs app.js's window.JD helpers and astro.js. */
(function(){
'use strict';
var X=window.JD=window.JD||{};
function A(n){return X.A(n)}function E(t,c,x){return X.E(t,c,x)}function p2(n){return X.p2(n)}
/* ---------- Hijri (Umm al-Qura) ---------- */
var HM=['محرّم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوّال','ذو القعدة','ذو الحجّة'];
var HF=null,UQ=false;
function hParts(f,dt){var r={};f.formatToParts(dt).forEach(function(p){if(p.type==='year'||p.type==='month'||p.type==='day')r[p.type[0]]=parseInt(p.value,10)});return r}
try{HF=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{timeZone:'UTC',day:'numeric',month:'numeric',year:'numeric'});
 var chk=hParts(HF,new Date(Date.UTC(2026,9,22,12)));UQ=(chk.y===1448&&chk.m===5&&chk.d===11)&&hParts(HF,new Date(Date.UTC(2026,2,20,12))).m===10}catch(e){UQ=false}
/* fallback when the device has no Umm al-Qura calendar: tabular (civil) Islamic calendar, can differ by 1–2 days */
function tabular(y,m,d){var l=Date.UTC(y,m,d)/864e5+2440588-1948440+10632,n=Math.floor((l-1)/10631);l=l-10631*n+354;
 var j=Math.floor((10985-l)/5316)*Math.floor(50*l/17719)+Math.floor(l/5670)*Math.floor(43*l/15238);l=l-Math.floor((30-j)/15)*Math.floor(17719*j/50)-Math.floor(j/16)*Math.floor(15238*j/43)+29;
 var mm=Math.floor(24*l/709);return {y:30*n+j-30,m:mm,d:l-Math.floor(709*mm/24)}}
var hc={};
function hijri(dt){var y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),k=y+'-'+m+'-'+d;if(hc[k])return hc[k];
 return hc[k]=UQ?hParts(HF,new Date(Date.UTC(y,m,d,12))):tabular(y,m,d)}
function day(dt,n){return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()+n)}
function hFirst(dt){return day(dt,-(hijri(dt).d-1))}
function hLen(first){return hijri(day(first,29)).d===1?29:30}
function hStr(h){return A(h.d)+' '+HM[h.m-1]+' '+A(h.y)+'هـ'}
X.hijri=hijri;X.hStr=hStr;X.UQ=function(){return UQ};
/* special days: returns {ic, t, c} list; ev = shown in the month list */
function special(h,wd){var m=h.m,d=h.d,r=[],noFast=(m===10&&d===1)||(m===12&&d>=10&&d<=13);
 if(m===1&&d===1)r.push({ic:'🌙',t:'رأس السنة الهجرية',c:'hs'});
 if(m===1&&d===9)r.push({ic:'◆',t:'تاسوعاء — يُستحب صيامه مع عاشوراء',c:'hf'});
 if(m===1&&d===10)r.push({ic:'◆',t:'يوم عاشوراء — صيامه يكفّر السنة الماضية',c:'hf'});
 if(m===9&&d===1)r.push({ic:'🌙',t:'أول رمضان',c:'hr'});
 if(m===9&&d===21)r.push({ic:'✨',t:'بداية العشر الأواخر (تبدأ لياليها من مغرب ٢٠ رمضان)',c:'hr'});
 if(m===9&&d>=20&&d<=28&&d%2===0)r.push({ic:'★',t:'ليلة '+A(d+1)+' — تحرّي ليلة القدر (تبدأ مغرب هذا اليوم)',c:'hq'});
 if(m===10&&d===1)r.push({ic:'🎉',t:'عيد الفطر',c:'he'});
 if(m===12&&d===1)r.push({ic:'🕋',t:'بداية العشر الأوائل من ذي الحجة',c:'hh'});
 if(m===12&&d===8)r.push({ic:'🕋',t:'يوم التروية',c:'hh'});
 if(m===12&&d===9)r.push({ic:'⛰️',t:'يوم عرفة — صيامه لغير الحاج يكفّر سنتين',c:'hh'});
 if(m===12&&d===10)r.push({ic:'🎉',t:'عيد الأضحى',c:'he'});
 if(m===12&&d>=11&&d<=13)r.push({ic:'🐑',t:'أيام التشريق ('+A(d)+' ذو الحجة) — لا صيام',c:'hh'});
 if(d>=13&&d<=15&&m!==9&&!(m===12&&d===13))r.push({ic:'○',t:'الأيام البيض — صيام '+A(d),c:'hw',month:1});
 return {list:r,dot:!noFast&&m!==9&&(wd===1||wd===4),tint:m===9?(d>=21?'q10':'rm'):(m===12&&d<=10?'dh':'')}}
var hView=null;
function renderHijri(h){var now=new Date(),tk=X.key(now),th=hijri(now),tj=Math.min(th.d,30);if(!hView)hView=hFirst(now);
 var b=E('div','box today'),tx=E('div','tx');tx.appendChild(E('div',null,'ورد اليوم · '+X.WD[now.getDay()]+' '+hStr(th)));
 tx.appendChild(E('div','big','الجزء '+A(tj)+(X.done[tk]?' ✓':'')));tx.appendChild(E('div','note','اليوم الهجري ١–٣٠ = الجزء ١–٣٠ · الموافق '+A(now.getDate())+' '+X.MON[now.getMonth()]+' '+A(now.getFullYear())));
 var go=E('button',null,'▶ ابدأ');go.onclick=function(){X.open(tk,tj)};b.appendChild(tx);b.appendChild(go);h.appendChild(b);
 var f=hView,n=hLen(f),hf=hijri(f),mh=E('div','mh'),pv=E('button',null,'›'),nx=E('button',null,'‹'),td=E('button',null,'اليوم');pv.setAttribute('aria-label','الشهر السابق');nx.setAttribute('aria-label','الشهر التالي');
 pv.onclick=function(){hView=hFirst(day(f,-1));X.rerender()};nx.onclick=function(){hView=hFirst(day(f,n));X.rerender()};td.onclick=function(){hView=hFirst(new Date());X.rerender()};
 var last=day(f,n-1);mh.appendChild(pv);var h2=E('h2',null,HM[hf.m-1]+' '+A(hf.y)+'هـ');h2.appendChild(E('small',null,X.MON[f.getMonth()]+(f.getMonth()!==last.getMonth()?' – '+X.MON[last.getMonth()]:'')+' '+A(last.getFullYear())));mh.appendChild(h2);mh.appendChild(td);mh.appendChild(nx);h.appendChild(mh);
 var g=E('div','cal hj');X.WD.forEach(function(w){g.appendChild(E('div','wd',w))});for(var i=0;i<f.getDay();i++)g.appendChild(E('div','d e'));
 var evs=[],cnt=0;
 for(var d=1;d<=n;d++){(function(d){var dt=day(f,d-1),k=X.key(dt),hh={y:hf.y,m:hf.m,d:d},sp=special(hh,dt.getDay()),j=Math.min(d,30),
   c=E('button','d'+(k===tk?' t':'')+(X.done[k]?' ok':'')+(sp.tint?' '+sp.tint:''));c.type='button';
   c.appendChild(E('span','n',A(d)));var gs=E('span','gd');gs.appendChild(E('span','gs',A(dt.getDate())+'/'+A(dt.getMonth()+1)));gs.appendChild(E('span','gl',A(dt.getDate())+' '+X.MON[dt.getMonth()]));c.appendChild(gs);
   c.appendChild(E('span','j','الجزء '+A(j)));
   if(sp.list.length){var ic=E('span','ic '+sp.list[0].c,sp.list[0].ic);c.appendChild(ic)}
   if(sp.dot)c.appendChild(E('i','dot'));
   if(X.done[k]){c.appendChild(E('span','ck','✓'));cnt++}
   sp.list.forEach(function(s){if(!s.month||d===13)evs.push({d:d,dt:dt,s:s.month?{ic:'○',t:'الأيام البيض ١٣ و١٤ و١٥ — يُستحب صيامها',c:'hw'}:s})});
   c.setAttribute('aria-label',d+' '+HM[hf.m-1]+' — '+dt.getDate()+' '+X.MON[dt.getMonth()]+' — الجزء '+j+(sp.list.length?' — '+sp.list.map(function(s){return s.t}).join('، '):'')+(X.done[k]?' — تمّ':''));
   c.onclick=function(){X.open(k,j)};g.appendChild(c)})(d)}
 h.appendChild(g);
 var lg=E('div','legend');[['○','الأيام البيض'],['•','الاثنين والخميس (صيام سنّة)'],['◆','عاشوراء'],['★','ليالي الوتر'],['🎉','العيد']].forEach(function(x){var s=E('span');s.appendChild(E('b',null,x[0]));s.appendChild(document.createTextNode(' '+x[1]));lg.appendChild(s)});h.appendChild(lg);
 if(evs.length){var bx=E('div','box ev');bx.appendChild(E('h3',null,'مناسبات '+HM[hf.m-1]));evs.forEach(function(e){var r=E('div','evr');r.appendChild(E('span','eic '+e.s.c,e.s.ic));var t=E('span','evt');t.appendChild(E('b',null,A(e.d)+' '+HM[hf.m-1]));t.appendChild(document.createTextNode(' ('+X.WD[e.dt.getDay()]+' '+A(e.dt.getDate())+' '+X.MON[e.dt.getMonth()]+') — '+e.s.t));r.appendChild(t);bx.appendChild(r)});h.appendChild(bx)}
 h.appendChild(E('p','note','القاعدة: اليوم الهجري ١ إلى ٣٠ = الجزء ١ إلى ٣٠. الشهر الهجري ٢٩ أو ٣٠ يومًا؛ إذا كان ٢٩ يومًا ينتهي الشهر عند الجزء ٢٩'+(n===29?' (هذا الشهر ٢٩ يومًا).':' (هذا الشهر ٣٠ يومًا).')+' أتممت '+A(cnt)+' من '+A(n)+' يومًا. علامة ✓ مشتركة مع التقويم الميلادي لأنها تُحفظ بالتاريخ الميلادي.'));
 h.appendChild(E('p','note '+(UQ?'':'warn'),(UQ?'التواريخ حسب تقويم أم القرى، وقد تختلف يومًا عن رؤية الهلال المحلية. ':'تنبيه: هذا الجهاز لا يدعم تقويم أم القرى، فالتواريخ محسوبة بالتقويم الهجري الحسابي وقد تختلف يومًا أو يومين. ')+'اليوم الهجري يبدأ شرعًا من المغرب، والتقويم هنا يطابقه مع النهار الميلادي.'))}
/* ---------- Nature ---------- */
var AS=window.ASTRO,TOR={n:'تورونتو',c:'كندا',lat:43.65,lon:-79.38,tz:'America/Toronto'},loc=null,wx=null,wxBusy=0,wxErr=0;
function tzOK(z){try{new Intl.DateTimeFormat('en',{timeZone:z});return z}catch(e){return undefined}}
function fT(dt){if(!dt)return '—';try{return A(new Intl.DateTimeFormat('en-GB',{timeZone:tzOK(loc.tz),hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(dt.getTime()+30000)))}catch(e){return '—'}}
function lk(dt){try{return new Intl.DateTimeFormat('en-CA',{timeZone:tzOK(loc.tz),year:'numeric',month:'2-digit',day:'2-digit'}).format(dt)}catch(e){return X.key(dt)}}
function dur(min){var h=Math.floor(min/60),m=Math.round(min-h*60);if(m===60){h++;m=0}return A(h)+' س '+A(m)+' د'}
var WX={0:['☀️','صحو'],1:['🌤️','صحو غالبًا'],2:['⛅','غائم جزئيًا'],3:['☁️','غائم'],45:['🌫️','ضباب'],48:['🌫️','ضباب متجمّد'],51:['🌦️','رذاذ خفيف'],53:['🌦️','رذاذ'],55:['🌦️','رذاذ كثيف'],56:['🌧️','رذاذ متجمّد'],57:['🌧️','رذاذ متجمّد'],61:['🌧️','مطر خفيف'],63:['🌧️','مطر'],65:['🌧️','مطر غزير'],66:['🌧️','مطر متجمّد'],67:['🌧️','مطر متجمّد'],71:['🌨️','ثلج خفيف'],73:['🌨️','ثلج'],75:['❄️','ثلج كثيف'],77:['🌨️','حبيبات ثلج'],80:['🌦️','زخات'],81:['🌦️','زخات'],82:['⛈️','زخات قوية'],85:['🌨️','زخات ثلج'],86:['🌨️','زخات ثلج'],95:['⛈️','عاصفة رعدية'],96:['⛈️','عاصفة وبَرَد'],99:['⛈️','عاصفة وبَرَد']};
function wxKey(){return loc.lat.toFixed(2)+','+loc.lon.toFixed(2)}
function loadWx(){if(wxBusy||(wx&&wx.k===wxKey()&&Date.now()-wx.at<3600e3))return;wxBusy=1;
 X.getJSON('https://api.open-meteo.com/v1/forecast?latitude='+loc.lat+'&longitude='+loc.lon+'&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&past_days=31&forecast_days=16',
  function(r){wxBusy=0;wxErr=0;var d=r&&r.daily;if(!d||!d.time){wxErr=1;return}var o={};d.time.forEach(function(t,i){o[t]=[d.weather_code[i],d.temperature_2m_max[i],d.temperature_2m_min[i],d.precipitation_probability_max?d.precipitation_probability_max[i]:null]});
   wx={k:wxKey(),at:Date.now(),d:o};X.LS.s('wx',wx);if(X.tab()==='n')X.rerender()},function(){wxBusy=0;wxErr=1;if(X.tab()==='n'){var e=document.getElementById('wxst');if(e)e.textContent='تعذّر جلب الطقس — تحقّق من الاتصال بالإنترنت.'}})}
function south(){return loc.lat<0}
var SN=['الربيع','الصيف','الخريف','الشتاء'],SIC=['🌸','☀️','🍂','❄️'];
function seasonIdx(lambdaQ){return (lambdaQ+(south()?2:0))%4}
function events(y,m){var r=[],mk=y+'-'+p2(m+1);
 for(var yy=y-1;yy<=y+1;yy++)for(var i=0;i<4;i++){var t=AS.season(yy,i);if(lk(t).slice(0,7)===mk){var s=seasonIdx(i),ex=s===1?' · أطول نهار في السنة':s===3?' · أقصر نهار في السنة':'';
   r.push({t:t,ic:SIC[s],c:'ns',tx:'أول '+SN[s]+' — '+(i%2?'الانقلاب ال'+(s===1?'صيفي':'شتوي'):'الاعتدال ال'+(s===0?'ربيعي':'خريفي'))+ex})}}
 [[315,1],[45,4],[135,7],[225,10]].forEach(function(q){for(var yy=y-1;yy<=y+1;yy++){var t=AS.sunAt(q[0],new Date(Date.UTC(yy,q[1],5)));if(lk(t).slice(0,7)===mk){var s=seasonIdx(((q[0]-45+360)%360)/90|0);
   r.push({t:t,ic:'🍃',c:'nx',tx:'منتصف '+SN[s]+' (يوم ربع الفصل: الشمس عند '+A(q[0])+'°)'})}}});
 AS.moons(new Date(Date.UTC(y,m,1)-2*864e5),new Date(Date.UTC(y,m+1,1)+2*864e5)).forEach(function(o){if(lk(o.t).slice(0,7)===mk)r.push({t:o.t,ic:o.full?'🌕':'🌑',c:'nm',tx:o.full?'بدر — اكتمال القمر':'محاق — القمر الجديد (فلكيًا، قبل رؤية الهلال)'})});
 r.sort(function(a,b){return a.t-b.t});return r}
function nextSeason(now){var best=null;for(var yy=now.getFullYear();yy<=now.getFullYear()+1;yy++)for(var i=0;i<4;i++){var t=AS.season(yy,i);if(t>now&&(!best||t<best.t))best={t:t,s:seasonIdx(i)}}return best}
function sunOf(y,m,d){return AS.sunTimes(y,m+1,d,loc.lat,loc.lon)}
/* season scenes (SVG drawn here, no outside images) */
function svg(x){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+x+'</svg>'}
function gr(id,a,b){return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="400" height="300" fill="url(#'+id+')"/>'}
function rnd(n,s){var a=[],x=s;for(var i=0;i<n;i++){x=(x*9301+49297)%233280;a.push(x/233280)}return a}
function fall(n,s,fn){var r=rnd(n*3,s),o='';for(var i=0;i<n;i++)o+=fn(r[i*3]*400,r[i*3+1]*260,r[i*3+2],i);return o}
var SC=[
 svg(gr('sp','#bfe9d6','#3f9a6b')+'<path d="M0 220 Q100 180 200 215 T400 200 V300 H0Z" fill="#2f7d55"/><path d="M0 255 Q140 225 260 255 T400 250 V300 H0Z" fill="#1f6343"/>'+fall(26,4,function(x,y,r,i){return '<g class="petal" style="animation-delay:-'+(r*9).toFixed(1)+'s"><circle cx="'+x.toFixed(0)+'" cy="'+(y*0.8).toFixed(0)+'" r="'+(2+r*2.5).toFixed(1)+'" fill="'+(i%2?'#fbcfe8':'#fff')+'" opacity=".85"/></g>'})),
 svg(gr('su','#7dd3fc','#d9f99d')+'<g class="glow"><circle cx="320" cy="60" r="38" fill="#fde047"/><circle cx="320" cy="60" r="60" fill="#fde047" opacity=".25"/></g><path d="M0 230 Q120 200 240 228 T400 215 V300 H0Z" fill="#4d7c0f"/><path d="M0 262 Q160 240 300 262 T400 258 V300 H0Z" fill="#3f6212"/>'),
 svg(gr('au','#fed7aa','#9a3412')+'<path d="M0 235 Q130 205 250 232 T400 222 V300 H0Z" fill="#7c2d12"/>'+fall(22,9,function(x,y,r,i){return '<g class="leaf" style="animation-delay:-'+(r*11).toFixed(1)+'s"><ellipse cx="'+x.toFixed(0)+'" cy="'+(y*0.7).toFixed(0)+'" rx="'+(4+r*3).toFixed(1)+'" ry="'+(2+r*1.5).toFixed(1)+'" fill="'+['#ea580c','#facc15','#b91c1c'][i%3]+'" transform="rotate('+(r*180).toFixed(0)+' '+x.toFixed(0)+' '+(y*0.7).toFixed(0)+')"/></g>'})),
 svg(gr('wi','#1e3a5f','#cbd5e1')+'<path d="M0 225 Q120 200 240 222 T400 212 V300 H0Z" fill="#f1f5f9"/><path d="M0 262 Q150 245 300 262 T400 256 V300 H0Z" fill="#e2e8f0"/>'+fall(45,7,function(x,y,r){return '<g class="snow" style="animation-delay:-'+(r*10).toFixed(1)+'s"><circle cx="'+x.toFixed(0)+'" cy="'+(y*0.8).toFixed(0)+'" r="'+(1+r*2.2).toFixed(1)+'" fill="#fff" opacity=".9"/></g>'}))];
var nView=null,editLoc=false,geoRes=null,geoMsg='';
function spark(y){var pts=[],mn=1e9,mx=-1e9,now=new Date(),ti=-1;for(var d=0;d<366;d+=3){var dt=new Date(y,0,1+d);if(dt.getFullYear()!==y)break;var s=AS.sunTimes(y,dt.getMonth()+1,dt.getDate(),loc.lat,loc.lon).len;pts.push([d,s]);mn=Math.min(mn,s);mx=Math.max(mx,s)}
 var W=360,H=60,sx=function(d){return W-d/365*W},sy=function(v){return mx===mn?H/2:H-4-(v-mn)/(mx-mn)*(H-8)};
 var p=pts.map(function(q,i){return (i?'L':'M')+sx(q[0]).toFixed(1)+' '+sy(q[1]).toFixed(1)}).join(' '),o='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" class="spk" aria-hidden="true"><path d="'+p+'" fill="none" stroke="#2ecc71" stroke-width="2" vector-effect="non-scaling-stroke"/>';
 if(now.getFullYear()===y){var doy=Math.floor((now-new Date(y,0,1))/864e5),v=AS.sunTimes(y,now.getMonth()+1,now.getDate(),loc.lat,loc.lon).len;o+='<circle cx="'+sx(doy).toFixed(1)+'" cy="'+sy(v).toFixed(1)+'" r="4.5" fill="#ffd54a"/>'}
 return o+'</svg>'}
function renderNature(h){if(!loc){loc=X.LS.g('loc',TOR);if(!loc||typeof loc.lat!=='number')loc=TOR;wx=X.LS.g('wx',null)}var now=new Date(),tk=X.key(now),tj=X.juzOf(now.getDate());if(!nView){nView=new Date();nView.setDate(1)}loadWx();
 var y=nView.getFullYear(),m=nView.getMonth(),mid=AS.sunLon(new Date(Date.UTC(y,m,15,12))),si=seasonIdx(Math.floor(mid/90)),wrap=E('div','nat s'+si),bg=E('div','natbg');bg.innerHTML=SC[si];wrap.appendChild(bg);var h0=h;h=E('div','natin');wrap.appendChild(h);h0.appendChild(wrap);
 /* location */
 var lc=E('div','loc'),lb=E('span',null,'📍 '+loc.n+(loc.c?'، '+loc.c:'')),cb=E('button','sm',editLoc?'إغلاق':'تغيير المدينة');cb.onclick=function(){editLoc=!editLoc;geoRes=null;geoMsg='';X.rerender()};lc.appendChild(lb);lc.appendChild(cb);h.appendChild(lc);
 if(editLoc){var fm=E('form','geo'),inp=E('input');inp.type='search';inp.placeholder='اسم المدينة (عربي أو English)';inp.setAttribute('aria-label','اسم المدينة');inp.id='geoq';var sb=E('button',null,'بحث');sb.type='submit';fm.appendChild(inp);fm.appendChild(sb);
  fm.onsubmit=function(ev){ev.preventDefault();var q=inp.value.trim();if(q.length<2)return;geoMsg='… جارٍ البحث';X.rerender();
   X.getJSON('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=6&language=ar&format=json',function(r){geoRes=(r&&r.results)||[];geoMsg=geoRes.length?'':'لم يُعثر على مدينة بهذا الاسم.';X.rerender();var e=document.getElementById('geoq');if(e)e.value=q},function(){geoMsg='تعذّر البحث — تحقّق من الاتصال بالإنترنت.';X.rerender()})};
  h.appendChild(fm);if(geoMsg)h.appendChild(E('p','note',geoMsg));
  var gl=E('div','geol');(geoRes||[]).forEach(function(g){var b=E('button',null,g.name+(g.admin1?'، '+g.admin1:'')+(g.country?'، '+g.country:''));b.onclick=function(){loc={n:g.name,c:g.country||'',lat:+g.latitude,lon:+g.longitude,tz:g.timezone||'auto'};X.LS.s('loc',loc);editLoc=false;geoRes=null;X.rerender()};gl.appendChild(b)});
  if(loc.n!==TOR.n){var rb=E('button',null,'↺ العودة إلى تورونتو');rb.onclick=function(){loc=TOR;X.LS.s('loc',loc);editLoc=false;X.rerender()};gl.appendChild(rb)}h.appendChild(gl)}
 /* today */
 var st=sunOf(now.getFullYear(),now.getMonth(),now.getDate()),sy=AS.sunTimes(now.getFullYear(),now.getMonth()+1,now.getDate()-1,loc.lat,loc.lon),dl=(st.len-sy.len)*60,ns=nextSeason(now),
  b=E('div','box today'),tx=E('div','tx');tx.appendChild(E('div',null,'ورد اليوم · '+X.WD[now.getDay()]+' '+A(now.getDate())+' '+X.MON[now.getMonth()]));tx.appendChild(E('div','big','الجزء '+A(tj)+(X.done[tk]?' ✓':'')));
 var tw=wx&&wx.k===wxKey()&&wx.d[lk(now)];
 tx.appendChild(E('div','sunl','🌅 الشروق '+fT(st.rise)+' · 🌇 الغروب '+fT(st.set)+' · ☀ النهار '+dur(st.len)));
 if(!st.polar)tx.appendChild(E('div','note',(dl<0?'النهار يقصر ':'النهار يطول ')+A(Math.abs(dl/60)|0)+' د '+A(Math.round(Math.abs(dl)%60))+' ث كل يوم'+(ns?' · '+SIC[ns.s]+' أول '+SN[ns.s]+' بعد '+A(Math.ceil((ns.t-now)/864e5))+' يومًا ('+A(new Date(ns.t).getDate())+' '+X.MON[new Date(ns.t).getMonth()]+' '+fT(ns.t)+')':'')));
 if(tw)tx.appendChild(E('div','note',(WX[tw[0]]||['',''])[0]+' '+(WX[tw[0]]||['',''])[1]+' · العظمى '+A(Math.round(tw[1]))+'° · الصغرى '+A(Math.round(tw[2]))+'°'+(tw[3]!=null?' · احتمال المطر '+A(tw[3])+'٪':'')));
 var go=E('button',null,'▶ ابدأ');go.onclick=function(){X.open(tk)};b.appendChild(tx);b.appendChild(go);h.appendChild(b);
 var sp=E('div','box spkb');sp.innerHTML=spark(y);sp.appendChild(E('div','note','طول النهار خلال '+A(y)+' في '+loc.n+' (يناير يمينًا ← ديسمبر يسارًا)'+(now.getFullYear()===y?'؛ النقطة الذهبية = اليوم':'')));h.appendChild(sp);
 /* month header */
 var mh=E('div','mh'),pv=E('button',null,'›'),nx=E('button',null,'‹'),td=E('button',null,'اليوم');pv.setAttribute('aria-label','الشهر السابق');nx.setAttribute('aria-label','الشهر التالي');
 pv.onclick=function(){nView.setMonth(nView.getMonth()-1);X.rerender()};nx.onclick=function(){nView.setMonth(nView.getMonth()+1);X.rerender()};td.onclick=function(){nView=new Date();nView.setDate(1);X.rerender()};
 mh.appendChild(pv);var h2=E('h2',null,X.MON[m]+' '+A(y));h2.appendChild(E('small',null,SIC[si]+' '+SN[si]));mh.appendChild(h2);mh.appendChild(td);mh.appendChild(nx);h.appendChild(mh);
 var evs=events(y,m),byDay={};evs.forEach(function(e){var d=+lk(e.t).slice(8,10);(byDay[d]=byDay[d]||[]).push(e)});
 var g=E('div','cal nt');X.WD.forEach(function(w){g.appendChild(E('div','wd',w))});var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),rows=[];for(var i=0;i<first;i++)g.appendChild(E('div','d e'));
 for(var d=1;d<=n;d++){(function(d){var dt=new Date(y,m,d),k=X.key(dt),s=sunOf(y,m,d),ev=byDay[d]||[],w=wx&&wx.k===wxKey()?wx.d[y+'-'+p2(m+1)+'-'+p2(d)]:null,
   c=E('button','d'+(k===tk?' t':'')+(X.done[k]?' ok':'')+(ev.some(function(e){return e.c==='ns'})?' sday':''));c.type='button';
   c.appendChild(E('span','n',A(d)));c.appendChild(E('span','j','الجزء '+A(X.juzOf(d))));
   if(ev.length)c.appendChild(E('span','eic2',ev.map(function(e){return e.ic}).join('')));
   if(w&&w[1]!=null){var ws=E('span','wx',(WX[w[0]]||['?'])[0]+' ');ws.appendChild(E('b',null,A(Math.round(w[1]))+'°'));ws.appendChild(document.createTextNode(' '));ws.appendChild(E('i',null,A(Math.round(w[2]))+'°'));c.appendChild(ws)}
   var su=E('span','sun2');if(s.polar)su.textContent=s.polar==='day'?'شمس لا تغيب':'ليل قطبي';else{su.appendChild(E('bdi',null,'↑'+fT(s.rise)));su.appendChild(document.createTextNode(' '));su.appendChild(E('bdi',null,'↓'+fT(s.set)))}c.appendChild(su);
   if(X.done[k])c.appendChild(E('span','ck','✓'));
   rows.push([d,dt,s]);
   c.setAttribute('aria-label',d+' '+X.MON[m]+' — الجزء '+X.juzOf(d)+(w?' — '+(WX[w[0]]||['',''])[1]+' '+Math.round(w[1])+'/'+Math.round(w[2]):'')+(ev.length?' — '+ev.map(function(e){return e.tx}).join('، '):'')+(X.done[k]?' — تمّ':''));
   c.onclick=function(){X.open(k)};g.appendChild(c)})(d)}
 h.appendChild(g);
 var ws=E('p','note');ws.id='wxst';var hasWx=wx&&wx.k===wxKey()&&Object.keys(wx.d).some(function(t){return t.slice(0,7)===y+'-'+p2(m+1)});
 ws.textContent=wxErr&&!hasWx?'تعذّر جلب الطقس — تحقّق من الاتصال بالإنترنت.':hasWx?'الطقس (العظمى/الصغرى °م): من ٣١ يومًا مضت حتى ١٦ يومًا قادمة، من Open-Meteo.':wxBusy?'… جارٍ تحميل الطقس':'الطقس متاح فقط من ٣١ يومًا مضت إلى ١٦ يومًا قادمة.';h.appendChild(ws);
 var bx=E('div','box ev');bx.appendChild(E('h3',null,'أحداث الطبيعة في '+X.MON[m]+' (بتوقيت '+loc.n+')'));
 if(!evs.length)bx.appendChild(E('p','note','لا أحداث فلكية كبرى هذا الشهر.'));
 evs.forEach(function(e){var r=E('div','evr'),t=E('span','evt');r.appendChild(E('span','eic',e.ic));t.appendChild(E('b',null,A(+lk(e.t).slice(8,10))+' '+X.MON[m]+' '+fT(e.t)));t.appendChild(document.createTextNode(' — '+e.tx));r.appendChild(t);bx.appendChild(r)});h.appendChild(bx);
 var dt2=E('details','box sunt'),sm=E('summary',null,'🌅 الشروق والغروب وطول النهار لكل يوم من '+X.MON[m]);dt2.appendChild(sm);var tb=E('table'),hr=E('tr');['اليوم','الشروق','الغروب','النهار','التغيّر'].forEach(function(x){hr.appendChild(E('th',null,x))});tb.appendChild(hr);
 rows.forEach(function(r,i){var tr=E('tr'),pl=AS.sunTimes(y,m+1,r[0]-1,loc.lat,loc.lon).len,df=(r[2].len-pl)*60;if(X.key(r[1])===tk)tr.className='t';
  [A(r[0]),fT(r[2].rise),fT(r[2].set),dur(r[2].len),(df<0?'−':'+')+A(Math.abs(df/60)|0)+':'+A(p2(Math.round(Math.abs(df)%60)))].forEach(function(x){tr.appendChild(E('td',null,x))});tb.appendChild(tr)});dt2.appendChild(tb);h.appendChild(dt2);
 h.appendChild(E('p','note','الاعتدالان والانقلابان محسوبان على الجهاز (Meeus + VSOP87، بدقة ثوانٍ)، وكذلك البدر والمحاق وأيام منتصف الفصول والشروق والغروب (الدقة نحو دقيقة). الأوقات بتوقيت '+loc.n+'. اضغط أي يوم لفتح جزئه: اليوم ١–٣٠ = الجزء ١–٣٠.'))}
X.renderHijri=renderHijri;X.renderNature=renderNature;
})();
