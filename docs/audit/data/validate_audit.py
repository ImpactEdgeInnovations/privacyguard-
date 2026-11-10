"""Check the repository audit and the prototype against archived SHA-256 evidence."""
import csv,hashlib,json,re
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).resolve().parent.parent
baseline=root.parents[1]/'prototype/v6'
checked_date=datetime.now(ZoneInfo('Africa/Nairobi')).date().isoformat()
def sha(b):return hashlib.sha256(b).hexdigest()
results=json.loads((root/'evidence/baseline_integrity.json').read_text())['files']
assert len(results)==30
baseline_matches=all(
 sha((baseline/Path(item['path']).relative_to('PrivacyGuard_Codex_Astra_Handoff_v1')).read_bytes())==item['archive_sha256']
 for item in results
)
checks=[]
def check(name,ok,detail=''):checks.append({'check':name,'passed':bool(ok),'detail':detail})
check('Baseline matches archived ZIP hashes',baseline_matches,f"{len(results)} files")
features=list(csv.DictReader((root/'06_FEATURE_ALIGNMENT.csv').open()))
findings=list(csv.DictReader((root/'09_FINDINGS_REGISTER.csv').open()))
check('All baseline feature IDs covered',all(f'PG{i:02}' in {r['feature_id'] for r in features} for i in range(1,29)),f'{len(features)} total features including additions')
check('Traceability cells nonempty',all(all(v for v in r.values()) for r in features))
check('Feature IDs unique',len({r['feature_id'] for r in features})==len(features))
check('Finding IDs unique',len({r['finding_id'] for r in findings})==len(findings),f'{len(findings)} findings')
check('Finding severity valid',all(r['priority'] in ['P0','P1','P2','P3'] for r in findings))
check('Each finding links valid owner decision',all(re.fullmatch(r'D(?:0[1-9]|1[01])',r['owner_decision']) for r in findings))
missing=[]
for f in root.glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',f.read_text()):
  if target.startswith(('http:','https:','#','mailto:')):continue
  if not (f.parent/target.split('#')[0]).exists():missing.append((f.name,target))
check('Markdown local file links resolve',not missing,missing)
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.tags=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append(tag)
  if 'id' in a:self.ids.add(a['id'])
  for key in ['href','src']:
   if key in a:self.links.append(a[key])
h=root/'mockups/index.html';scan=Scan();scan.feed(h.read_text());bad=[]
for target in scan.links:
 if target.startswith('#'):
  if target[1:] not in scan.ids:bad.append(target)
 elif target.startswith(('http:','https:')):bad.append('external:'+target)
 elif not (h.parent/target.split('#')[0]).exists():bad.append(target)
check('Mockup links/images local and resolve',not bad,bad)
check('Mockup has no scripts or product forms',not set(scan.tags)&{'script','form','input','textarea','select','iframe'})
copies=[]
for f in (root/'mockups/baseline').glob('*.png'):
 source=baseline/'prototype/previews'/f.name
 copies.append(f.read_bytes()==source.read_bytes())
check('Comparison baseline images unchanged',all(copies),f'{len(copies)} copied images')
for r in csv.DictReader((root/'data/cost_scenarios.csv').open()):
 n=float(r['reports_month']);p=float(r['price_kes']);rev=n*.2*p*.92;cost=n*63
 assert abs(float(r['net_revenue_kes'])-rev)<.01
 assert abs(float(r['contribution_low_kes'])-(rev-cost-float(r['infra_high_kes'])))<.01
check('Cost scenario arithmetic reconciles',True)
report={'checked_date':checked_date,'all_passed':all(x['passed'] for x in checks),'checks':checks,'limitations':'Artifact and arithmetic checks only; no production security, live integration, legal or usability certification.'}
print(json.dumps({'all_passed':report['all_passed'],'baseline_files':len(results),'features':len(features),'findings':len(findings),'checks':len(checks),'failures':[x for x in checks if not x['passed']]},indent=2))
raise SystemExit(0 if report['all_passed'] else 1)
