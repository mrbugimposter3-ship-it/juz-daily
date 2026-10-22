"""Run after adding/removing timings/juz-NN.json files: rewrites timings/index.json so the app knows which juz have real word timings."""
import json,os,re
d=os.path.join(os.path.dirname(os.path.abspath(__file__)),'timings')
L=sorted(int(m.group(1)) for f in os.listdir(d) if (m:=re.fullmatch(r'juz-(\d\d)\.json',f)))
json.dump({'juz':L},open(os.path.join(d,'index.json'),'w'));print('timings/index.json ->',L)
