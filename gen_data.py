"""Builds data/juz-NN.json from fetched sources (src/):
 - Uthmani text: api.alquran.cloud quran-uthmani ; meanings: en.pickthall (public domain), ur.jalandhry
 - Ayah timings for Abdulrahman Al-Ossi (mp3quran read=225) from mp3quran.net/api/v3/ayat_timing
 - theme per ayah by keyword matching on Pickthall English."""
import json,re
L=lambda f:json.load(open('src/'+f))['data']['surahs']
Q,EN,UR=L('quran-uthmani.json'),L('en.pickthall.json'),L('ur.jalandhry.json')
meta=json.load(open('src/meta.json'))['data']['juzs']['references']
BASM='بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
MARKS=set('ۚۖۗ۞ۙۘ۩ۛۜ')
TH=[ # theme, keywords (regex on lowercase english)
 ('fire',r'\b(fire|hell|flame|blaze|torment|doom|burn\w*|scorch\w*|chastisement)\b'),
 ('paradise',r'\b(garden|gardens|paradise|rivers|fruit\w*|bliss|reward|couches|silk)\b'),
 ('water',r'\b(water|rain|sea|seas|river|flood|ship|ships|ark|fountain|springs?|clouds?|drink)\b'),
 ('night',r'\b(night|darkness|moon|stars?|dawn|sleep|evening)\b'),
 ('creation',r'\b(creat\w*|heavens?|earth|sun|mountains?|plants?|cattle|signs?|sky|day and night)\b'),
 ('prophets',r'\b(moses|abraham|noah|jesus|mary|joseph|jacob|isaac|ishmael|david|solomon|jonah|lot|hud|salih|shu.aib|adam|pharaoh|messengers?|prophets?|children of israel)\b'),
 ('charity',r'\b(spend\w*|poor|needy|orphans?|alms|zakat|wealth|charity|loan|give)\b'),
 ('prayer',r'\b(prayer|worship|prostrat\w*|remembrance|glorif\w*|praise|bow)\b'),
 ('mercy',r'\b(merciful|mercy|forgiv\w*|repent\w*|relent\w*|kind|gracious|peace)\b'),
]
W={'fire':1.3,'paradise':1.2,'water':1,'night':1,'creation':.8,'prophets':1,'charity':1.1,'prayer':1,'mercy':.7}
def theme(t):
  t=t.lower();best,bs='light',0
  for k,r in TH:
    n=len(re.findall(r,t))*W[k]
    if n>bs:best,bs=k,n
  return best
def bare(w):
  w=re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]','',w);return w.replace('ٱ','ا')
def words(txt):
  out=[];pre=''
  for w in txt.replace('\ufeff','').split():
    if w in MARKS:
      if out: out[-1]+=' '+w
      else: pre+=w+' '
    else: out.append(pre+w);pre=''
  return out
# flat list of (s,a)
flat=[(s['number'],a['numberInSurah']) for s in Q for a in s['ayahs']]
idx={k:i for i,k in enumerate(flat)}
starts=[idx[(r['surah'],r['ayah'])] for r in meta]+[len(flat)]
tim={s:{x['ayah']:(x['start_time'],x['end_time']) for x in json.load(open(f'src/tim/{s}.json'))} for s in range(1,115)}
names={s['number']:{'ar':s['name'],'en':s['englishName']} for s in Q}
from collections import Counter
for j in range(30):
  ay=[];c=Counter()
  for s,a in flat[starts[j]:starts[j+1]]:
    t=Q[s-1]['ayahs'][a-1]['text'];b=0
    if a==1 and s not in(1,9):
      ws=t.split()
      if [bare(x) for x in ws[:4]]==['بسم','الله','الرحمن','الرحيم']: t=' '.join(ws[4:]);b=1
      else: print('no basmala?',s)
    en=EN[s-1]['ayahs'][a-1]['text'];th=theme(en);c[th]+=1
    st,et=tim[s][a]
    d={'s':s,'a':a,'w':words(t),'en':en,'ur':UR[s-1]['ayahs'][a-1]['text'],'t':[st,et],'th':th}
    if b:d['b']=1
    ay.append(d)
  sur={s:names[s] for s in sorted({x['s'] for x in ay})}
  json.dump({'juz':j+1,'surahs':sur,'ayahs':ay},open(f'data/juz-{j+1:02d}.json','w'),ensure_ascii=False,separators=(',',':'))
  print(j+1,len(ay),dict(c.most_common(4)))
