/* ورد الجزء اليومي — daily juz calendar + Al-Ossi recitation player with word highlighting */
(function(){
'use strict';
var AUDIO='https://cdn.mp3quran.net/audio/abdulrahman-oosi/r1/', /* mp3quran.net read 225: عبدالرحمن العوسي, حفص عن عاصم, one file per surah */
    ONLINE='https://mrbugimposter3-ship-it.github.io/juz-daily/';
var $=function(i){return document.getElementById(i)};
function E(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function A(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
function p2(n){return (n<10?'0':'')+n}
function key(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function juzOf(day){return day>30?30:day}
var LS={g:function(k,d){try{var v=localStorage.getItem('jd-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s:function(k,v){try{localStorage.setItem('jd-'+k,JSON.stringify(v))}catch(e){}}};
var done=LS.g('done',{});
function getJSON(u,ok,bad){var x=new XMLHttpRequest();x.open('GET',u);x.onload=function(){if((x.status===200||(x.status===0&&x.responseText))){try{ok(JSON.parse(x.responseText));return}catch(e){}}bad&&bad()};x.onerror=function(){bad&&bad()};try{x.send()}catch(e){bad&&bad()}}
var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],WD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
var view=new Date();view.setDate(1);
var JD=window.JD=window.JD||{};JD.A=A;JD.E=E;JD.p2=p2;JD.key=key;JD.juzOf=juzOf;JD.LS=LS;JD.done=done;JD.MON=MON;JD.WD=WD;JD.getJSON=getJSON;
JD.open=function(k,j){open(k,j)};JD.rerender=function(){if(!$('home').hidden)renderCal(true)};JD.tab=function(){return $('home').hidden?'':tab};

/* ---------- home: Gregorian calendar ---------- */
function home(){if(location.hash)location.hash='';else showHome()}
window.home=home;
function showHome(){stop();$('bg').hidden=true;$('play').hidden=$('bar').hidden=$('chip').hidden=true;$('home').hidden=false;$('back').hidden=$('fsm').hidden=$('fsp').hidden=true;$('ttl').textContent='ورد الجزء اليومي';$('bg').innerHTML='';document.title='ورد الجزء اليومي';renderCal()}
var TABS=[['g','ميلادي'],['h','هجري'],['n','الطبيعة']],tab=LS.g('tab','g');if(!/^[ghn]$/.test(tab))tab='g';
function renderCal(keep){var hm=$('home'),y0=keep?window.scrollY:0;hm.innerHTML='';var tb=E('div','tabs');tb.setAttribute('role','tablist');
 TABS.forEach(function(t){var b=E('button',t[0]===tab?'on':'',t[1]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',t[0]===tab);b.onclick=function(){if(tab===t[0])return;tab=t[0];LS.s('tab',tab);renderCal();window.scrollTo(0,0)};tb.appendChild(b)});hm.appendChild(tb);
 var c=E('div');hm.appendChild(c);try{if(tab==='h')JD.renderHijri(c);else if(tab==='n')JD.renderNature(c);else renderGreg(c)}catch(e){console.warn(e);c.appendChild(E('p','err','تعذّر عرض هذا التقويم على هذا الجهاز.'));renderGreg(c)}
 var f=E('footer'),s1=E('section'),s2=E('p');f.appendChild(s1);f.appendChild(s2);
 f.appendChild(E('p','note','التلاوة: الشيخ عبدالرحمن العوسي (mp3quran.net) · توقيت الآيات: mp3quran.net · نص المصحف العثماني: api.alquran.cloud · المعاني: Pickthall (English، ملكية عامة) و فتح محمد جالندھری (اردو)'));
 var cr=E('p','note');cr.appendChild(document.createTextNode('الطقس والبحث عن المدن: '));var a=E('a',null,'Weather data by Open-Meteo.com');a.href='https://open-meteo.com/';a.target='_blank';a.rel='noopener';cr.appendChild(a);cr.appendChild(document.createTextNode(' ('));var a2=E('a',null,'CC BY 4.0');a2.href='https://creativecommons.org/licenses/by/4.0/';a2.target='_blank';a2.rel='noopener';cr.appendChild(a2);
 cr.appendChild(document.createTextNode('؛ أسماء المدن من GeoNames) · التقويم الهجري: أم القرى · الفلك: محسوب على الجهاز (Meeus، VSOP87) · الإصدار ١٫١'));f.appendChild(cr);
 hm.appendChild(f);infaqMount(s1,{ur:true});infaqTools(s2);if(y0)window.scrollTo(0,y0)}
function renderGreg(h){var now=new Date(),tk=key(now),tj=juzOf(now.getDate());
 var b=E('div','box today'),tx=E('div','tx');tx.appendChild(E('div',null,'ورد اليوم · '+WD[now.getDay()]+' '+A(now.getDate())+' '+MON[now.getMonth()]+' '+A(now.getFullYear())));try{tx.appendChild(E('div','note',JD.hStr(JD.hijri(now))))}catch(e){}
 tx.appendChild(E('div','big','الجزء '+A(tj)+(done[tk]?' ✓':'')));tx.appendChild(E('div','note','بصوت الشيخ عبدالرحمن العوسي، مع تظليل الكلمات وخلفيات تعبّر عن معنى الآيات'));
 var go=E('button',null,'▶ ابدأ');go.onclick=function(){open(tk)};b.appendChild(tx);b.appendChild(go);h.appendChild(b);
 var mh=E('div','mh'),pv=E('button',null,'›'),nx=E('button',null,'‹'),td=E('button',null,'اليوم');pv.setAttribute('aria-label','الشهر السابق');nx.setAttribute('aria-label','الشهر التالي');
 pv.onclick=function(){view.setMonth(view.getMonth()-1);renderCal()};nx.onclick=function(){view.setMonth(view.getMonth()+1);renderCal()};td.onclick=function(){view=new Date();view.setDate(1);renderCal()};
 mh.appendChild(pv);mh.appendChild(E('h2',null,MON[view.getMonth()]+' '+A(view.getFullYear())));mh.appendChild(td);mh.appendChild(nx);h.appendChild(mh);
 var g=E('div','cal');WD.forEach(function(w){g.appendChild(E('div','wd',w))});
 var y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),cnt=0;
 for(var i=0;i<first;i++)g.appendChild(E('div','d e'));
 for(var d=1;d<=n;d++){(function(d){var dt=new Date(y,m,d),k=key(dt),c=E('button','d'+(k===tk?' t':'')+(done[k]?' ok':'')+(d===31?' r31':''));c.type='button';
  c.appendChild(E('span','n',A(d)));c.appendChild(E('span','j','الجزء '+A(juzOf(d))));if(done[k]){c.appendChild(E('span','ck','✓'));cnt++}
  c.setAttribute('aria-label',d+' '+MON[m]+' — الجزء '+juzOf(d)+(done[k]?' — تمّ':''));c.onclick=function(){open(k)};g.appendChild(c)})(d)}
 h.appendChild(g);
 h.appendChild(E('p','note','القاعدة: اليوم ١ إلى ٣٠ من الشهر = الجزء ١ إلى ٣٠ · اليوم ٣١ = الجزء ٣٠ مرة أخرى. أتممت '+A(cnt)+' من '+A(n)+' يومًا هذا الشهر (✓ يُحفظ على هذا الجهاز).'))}

/* ---------- player ---------- */
var J=null,AY=[],cur=0,dateK='',au=$('au'),playing=false,raf=0,WT={},wtReal=0,lastTheme='',effTh=[],mode=LS.g('mode','ur'),spd=LS.g('spd',1),SP=[0.75,1,1.25,1.5],fs=LS.g('fs',0);
function open(k,j){location.hash='d='+k+(j?'&j='+j:'')}
function route(){var m=/d=(\d{4}-\d\d-\d\d)/.exec(location.hash);if(!m){showHome();return}var p=m[1].split('-'),d=+p[2],jm=/[&?]j=(\d+)/.exec(location.hash),j=jm?Math.max(1,Math.min(30,+jm[1])):juzOf(d);loadJuz(j,m[1])}
window.addEventListener('hashchange',route);
function loadJuz(j,k){stop();$('bg').hidden=false;dateK=k;$('home').hidden=true;var pl=$('play');pl.hidden=false;pl.innerHTML='<p class="note" style="margin-top:70px">… جارٍ التحميل</p>';$('back').hidden=$('fsm').hidden=$('fsp').hidden=false;$('bar').hidden=false;
 $('ttl').textContent='الجزء '+A(j);document.title='الجزء '+j+' — ورد الجزء اليومي';
 getJSON('data/juz-'+p2(j)+'.json',function(d){J=d;AY=d.ayahs;WT={};wtReal=0;build();loadTimings(j)},function(){pl.innerHTML='<p class="err" style="margin-top:70px">تعذّر تحميل بيانات الجزء.</p>'})}
/* timings/index.json lists which juz have real word timings ({"juz":[1,30,...]}), so missing files are never requested (no 404s).
   In the Android app the bundled copy is tried first, then the live site, so new timings reach the phone without a rebuild. */
function loadTimings(j){var f='timings/juz-'+p2(j)+'.json',got=function(d){if(J&&J.juz===j)applyTimings(d)};
 function tryBase(base,fail){getJSON(base+'timings/index.json',function(ix){var L=(ix&&ix.juz)||ix||[];if(L.indexOf&&L.indexOf(j)>=0)getJSON(base+f,got,fail);else fail&&fail()},fail)}
 tryBase('',function(){if(location.protocol==='file:')tryBase(ONLINE)})}
/* timings/juz-NN.json: [{surah,ayah,words:[[start_ms,end_ms],...]}] (or {ayahs:[...]}); ms are relative to the ayah's start
   inside the mp3quran surah file (start = data t[0]); set "base":"surah" (top level or per entry) if they are absolute surah-file times. */
function applyTimings(d){var L=Array.isArray(d)?d:(d.ayahs||d.timings||[]),base=d.base,n=0,miss=0,ix={};AY.forEach(function(a,i){ix[a.s+':'+a.a]=i});
 L.forEach(function(e){var i=ix[e.surah+':'+e.ayah];if(i==null||!e.words)return;var a=AY[i];if(e.words.length!==a.w.length){miss++;return}
  var off=((e.base||base)==='surah')?0:a.t[0];WT[i]=e.words.map(function(w){return [w[0]+off,w[1]+off]});n++});
 wtReal=n;if(n)console.log('word timings loaded',n,'ayahs',miss?('('+miss+' skipped: word count mismatch)'):'');updNote()}
function letters(w){var m=w.match(/[\u0621-\u063A\u0641-\u064A\u0671-\u06D3]/g);return (m?m.length:1)+1.5}
function est(i){if(WT[i])return WT[i];var a=AY[i],tot=0,ls=a.w.map(function(w){var l=letters(w);tot+=l;return l}),dur=(a.t[1]-a.t[0])*0.93,t=a.t[0],r=[];
 ls.forEach(function(l){var d=dur*l/tot;r.push([t,t+d]);t+=d});return WT['e'+i]=r}
function wt(i){return WT[i]||WT['e'+i]||est(i)}
function smooth(){var last='light',gap=9;effTh=AY.map(function(a){if(a.th!=='light'){last=a.th;gap=0;return last}gap++;return gap<=3?last:'light'})}
function build(){var pl=$('play');pl.innerHTML='';smooth();var t=E('div','txt');t.id='txt';var ps=-1;
 AY.forEach(function(a,i){if(a.s!==ps){ps=a.s;var sn=J.surahs[a.s];t.appendChild(E('div','sh',sn.ar+(a.a===1?'':' · من الآية '+A(a.a))));if(a.b)t.appendChild(E('div','bsm ar','بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'))}
  var d=E('div','ay');d.id='a'+i;var p=E('div','ar');a.w.forEach(function(w,k){var s=E('span','w',w);s.dataset.k=k;s.onclick=function(){jump(i,k)};p.appendChild(s);p.appendChild(document.createTextNode(' '))});
  p.appendChild(E('span','num','﴿'+A(a.a)+'﴾'));d.appendChild(p);var en=E('div','mn en',a.en),ur=E('div','mn ur',a.ur);en.lang='en';ur.lang='ur';ur.dir='rtl';d.appendChild(en);d.appendChild(ur);t.appendChild(d)});
 pl.appendChild(t);var nt=E('p','note');nt.id='wnote';pl.appendChild(nt);
 var f=E('footer'),s1=E('section'),s2=E('p');f.appendChild(s1);f.appendChild(s2);pl.appendChild(f);infaqMount(s1,{ur:true});infaqTools(s2);
 cur=Math.min(LS.g('pos'+J.juz,0),AY.length-1);setMode(mode);updNote();setFs();mark(true);showTheme(true);updMk();window.scrollTo(0,0);setTimeout(function(){scrollCur(true)},60)}
function updNote(){var n=$('wnote');if(!n)return;n.textContent=wtReal?('توقيت الكلمات حقيقي (محاذاة صوتية) لـ '+A(wtReal)+' من '+A(AY.length)+' آية، والباقي تقريبي.'):'تنبيه: توقيت الآيات حقيقي من mp3quran.net، أما تظليل الكلمات داخل الآية فتقريبي (محسوب من طول كل كلمة).'}
function setMode(m){mode=m;LS.s('mode',m);[].forEach.call($('mng').children,function(b){b.classList.toggle('on',b.dataset.m===m)});
 var st=document.getElementById('mst');if(!st){st=E('style');st.id='mst';document.head.appendChild(st)}
 if(J)setTimeout(function(){scrollCur(true)},30);st.textContent='.mn{display:none}'+(m==='en'?'.mn.en{display:block}':m==='ur'?'.mn.ur,.infaq .ur{display:block}':'')+(m!=='ur'?'.infaq .ur{display:none}':'')}
function setFs(){document.documentElement.style.setProperty('--fs',fs?('calc('+(window.innerWidth>=700?34:30)+'px + '+fs*3+'px)'):'');}
var curW=-1;
function mark(force){var prev=document.querySelector('.ay.cur');var el=$('a'+cur);if(prev!==el){if(prev)prev.classList.remove('cur');if(el)el.classList.add('cur');scrollCur()}
 var on=document.querySelector('.w.on');if(force||!playing){if(on)on.classList.remove('on');curW=-1}
 $('st').textContent=J.surahs[AY[cur].s].ar+' · آية '+A(AY[cur].a)+' · '+A(cur+1)+' / '+A(AY.length);$('pg').style.width=((cur+1)/AY.length*100)+'%';showTheme()}
function setWord(k){if(k===curW)return;var on=document.querySelector('.w.on');if(on)on.classList.remove('on');curW=k;if(k<0)return;var el=$('a'+cur);if(el){var w=el.querySelectorAll('.w')[k];if(w)w.classList.add('on')}}
var userScroll=0;window.addEventListener('touchmove',function(){userScroll=Date.now()},{passive:true});window.addEventListener('wheel',function(){userScroll=Date.now()},{passive:true});
function scrollCur(inst){var el=$('a'+cur);if(!el||(!inst&&Date.now()-userScroll<4000))return;var r=el.getBoundingClientRect(),vh=window.innerHeight;if(inst||r.top<70||r.bottom>vh-120)window.scrollTo({top:window.scrollY+r.top-vh*0.28,behavior:inst?'auto':'smooth'})}
function showTheme(force){var th=effTh[cur]||'light';if(th===lastTheme&&!force)return;lastTheme=th;var bg=$('bg'),sc=SCENES[th],n=E('div','sc');n.innerHTML=sc.v;bg.appendChild(n);
 requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.add('on')})});var old=bg.querySelectorAll('.sc');for(var i=0;i<old.length-1;i++)(function(o){o.classList.remove('on');setTimeout(function(){o.remove()},1800)})(old[i]);
 var c=$('chip');c.hidden=false;c.textContent='خلفية: '+sc.ar}
/* audio */
var curSurah=0,pendingSeek=null;
function src(s){return AUDIO+('00'+s).slice(-3)+'.mp3'}
function seekTo(i,ms,autoplay){var a=AY[i];cur=i;LS.s('pos'+J.juz,i);mark(true);
 if(curSurah!==a.s){curSurah=a.s;pendingSeek=ms/1000;au.src=src(a.s);au.playbackRate=spd;au.load();if(autoplay)doPlay()}
 else{try{au.currentTime=ms/1000}catch(e){pendingSeek=ms/1000}if(autoplay)doPlay()}}
au.addEventListener('loadedmetadata',function(){au.playbackRate=spd;if(pendingSeek!=null){try{au.currentTime=pendingSeek}catch(e){}pendingSeek=null}});
function startMs(i){var a=AY[i];return (a.a===1)?0:a.t[0]}
function doPlay(){playing=true;$('pp').textContent='⏸';var p=au.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==='NotAllowedError'){playing=false;$('pp').textContent='▶'}});loop()}
function stop(){playing=false;try{au.pause()}catch(e){}cancelAnimationFrame(raf);var b=$('pp');if(b)b.textContent='▶'}
function toggle(){if(!J)return;if(playing){stop();return}if(curSurah!==AY[cur].s)seekTo(cur,startMs(cur),true);else doPlay()}
function loop(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function f(){tick();if(playing)raf=requestAnimationFrame(f)})}
function tick(){if(!J||pendingSeek!=null||curSurah!==AY[cur].s)return;var t=au.currentTime*1000;
 var i=cur;while(i+1<AY.length&&AY[i+1].s===AY[i].s&&t>=AY[i+1].t[0])i++;while(i>0&&AY[i-1].s===AY[i].s&&t<AY[i].t[0]-300)i--;
 if(i!==cur){cur=i;LS.s('pos'+J.juz,i);mark(true)}
 var a=AY[cur];if(t>=a.t[1]&&(cur+1>=AY.length||AY[cur+1].s!==a.s)){next(true);return}
 if(t<a.t[0]){setWord(-1);return}var w=wt(cur),k=-1;for(var j=0;j<w.length;j++){if(t>=w[j][0])k=j;else break}if(k>=0&&t>w[k][1]+400&&k===w.length-1)k=-1;setWord(k)}
au.addEventListener('ended',function(){if(playing)next(true)});
au.addEventListener('waiting',function(){$('st').textContent='… جارٍ تحميل الصوت'});au.addEventListener('playing',function(){mark()});
au.addEventListener('error',function(){if(J){stop();$('st').textContent='تعذّر تشغيل الصوت — تحقّق من الاتصال بالإنترنت'}});
function next(auto){if(cur+1>=AY.length){stop();if(auto){done[dateK]=1;LS.s('done',done);LS.s('pos'+J.juz,0);updMk();$('st').textContent='تمّ الجزء '+A(J.juz)+' — تقبّل الله ✓'}return}
 var n=cur+1,wasP=playing||auto;if(AY[n].s!==AY[cur].s||!wasP)seekTo(n,AY[n].s!==AY[cur].s?startMs(n):AY[n].t[0],wasP);else seekTo(n,AY[n].t[0],true)}
function prev(){if(cur>0)seekTo(cur-1,AY[cur-1].t[0],playing)}
function jump(i,k){seekTo(i,wt(i)[k][0],true)}
function updMk(){var b=$('mk');b.classList.toggle('done',!!done[dateK]);b.textContent=done[dateK]?'✓ تمّ':'✓ أتممت'}
$('pp').onclick=toggle;$('nxt').onclick=function(){next(false)};$('prv').onclick=prev;$('back').onclick=home;
$('spd').onclick=function(){spd=SP[(SP.indexOf(spd)+1)%SP.length];LS.s('spd',spd);au.playbackRate=spd;$('spd').textContent=A(spd)+'×'};$('spd').textContent=A(spd)+'×';
[].forEach.call($('mng').children,function(b){b.onclick=function(){setMode(b.dataset.m)}});
$('mk').onclick=function(){if(done[dateK])delete done[dateK];else done[dateK]=1;LS.s('done',done);updMk()};
$('fsp').onclick=function(){if(fs<6)fs++;LS.s('fs',fs);setFs()};$('fsm').onclick=function(){if(fs>-3)fs--;LS.s('fs',fs);setFs()};
document.addEventListener('keydown',function(e){if($('play').hidden)return;if(e.code==='Space'){e.preventDefault();toggle()}else if(e.key==='ArrowLeft')next(false);else if(e.key==='ArrowRight')prev()});
/* keep the screen awake (☀️ toggle, default on): Android flag via bridge, else Screen Wake Lock API; silent if unsupported */
var wake=LS.g('wake',true),wl=null;
function wakeApply(){var b=$('wk');if(b){b.classList.toggle('on',!!wake);b.setAttribute('aria-pressed',!!wake);b.title=wake?'الشاشة تبقى مضاءة':'إطفاء الشاشة تلقائيًا'}
 if(window.AndroidWake){try{window.AndroidWake.set(!!wake)}catch(e){}return}
 if(!wake){if(wl){try{wl.release()}catch(e){}wl=null}return}
 if(wl||document.visibilityState!=='visible'||!navigator.wakeLock||!navigator.wakeLock.request)return;
 try{navigator.wakeLock.request('screen').then(function(l){wl=l;l.addEventListener('release',function(){if(wl===l)wl=null})},function(){})}catch(e){}}
$('wk').onclick=function(){wake=!wake;LS.s('wake',wake);wakeApply()};
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')wakeApply()});
document.addEventListener('pointerdown',function(){if(wake&&!wl)wakeApply()},true);
wakeApply();
setMode(mode);route();
})();
