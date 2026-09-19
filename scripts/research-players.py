"""Extract DFB player appearances and explicitly season-bound squads."""
from importlib.machinery import SourceFileLoader
r = SourceFileLoader('research', 'scripts/research-career.py').load_module()
import concurrent.futures
import json
import re

def cells(row):
    return [c.get_text(' ', strip=True) for c in row.find_all(['td','th'], recursive=False)]

def profile(source):
    cache = r.OUT / 'profiles' / (source['id'] + '.json')
    cache.parent.mkdir(exist_ok=True)
    if cache.exists(): return json.loads(cache.read_text(encoding='utf-8'))
    try:
        s = r.BeautifulSoup(r.fetch(source['url']), 'html.parser')
    except Exception as error:
        print('Skipped',source['id'],str(error),flush=True)
        return {'id':source['id'], 'url':source['url'], 'error':str(error)}
    heading = s.find(string=lambda x: x and x.strip() == 'Vereinshistorie')
    if not heading:
        return {'id': source['id'], 'url': source['url'], 'error': 'No club history'}
    table = heading.find_parent().find_next('table')
    spells = []
    for row in table.select('tr.c-Table-dropdown-trigger'):
        c = cells(row)
        if len(c) < 4: continue
        competitions = []
        sibling = row.find_next_sibling('tr')
        for sub in sibling.select('tr.c-Table-body-row') if sibling else []:
            v = cells(sub)
            if len(v) >= 4:
                competitions.append({'name':v[0], 'games':int(v[1]), 'from':v[2], 'to':v[3]})
        spells.append({'club':c[0], 'games':int(c[1]), 'from':c[2], 'to':c[3], 'competitions':competitions})
    result = {'id':source['id'], 'url':source['url'], 'name':source['title'].split(' – ')[0], 'spells':spells}
    cache.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    return result

def squad(item):
    league, slug = item
    url = f'https://datencenter.dfb.de/competitions/{league}/seasons/2023-24/teams/{slug}'
    s = r.BeautifulSoup(r.fetch(url),'html.parser')
    heading = s.find(string=lambda x: x and 'Kader Bundesliga 2023/2024' in x or x and 'Kader 2. Bundesliga 2023/2024' in x)
    if not heading: raise ValueError(f'Missing season-specific squad: {url}')
    players = []
    position = ''
    for row in heading.find_parent().find_next('table').find_all('tr'):
        c = cells(row)
        if c and c[0] in ['Trainer','Co-Trainer','Torwart','Abwehr','Mittelfeld','Sturm','Angriff']: position=c[0]; continue
        if len(c)>=3 and position in ['Torwart','Abwehr','Mittelfeld','Sturm','Angriff']:
            name = re.sub(r'\s*\((?:ab|bis).*','',c[1]).strip()
            if name: players.append(name)
    assert len(players)>=18, (url, len(players))
    return {'leagueId':'de-1' if league=='bundesliga' else 'de-2', 'club':slug, 'season':'2023/24', 'url':url, 'players':players}

if __name__=='__main__':
    sources=json.loads((r.ROOT/'src/features/quiz/data/de-bundesliga-players-level-1.json').read_text(encoding='utf-8'))['sourceCatalog']
    sources=[s for s in sources if 'datencenter.dfb.de' in s['url']]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        profiles=list(pool.map(profile,sources))
    (r.OUT/'player-histories.json').write_text(json.dumps({'retrievedOn':'2026-09-19','players':profiles},ensure_ascii=False,indent=2),encoding='utf-8')
    print('Histories:',len(profiles),'Errors:',[p['id'] for p in profiles if 'error' in p],flush=True)
    squads=[]
    for league,clubs in [('bundesliga','borussia-dortmund,bayern-muenchen,bayer-leverkusen,vfb-stuttgart,werder-bremen,eintracht-frankfurt'),('2-bundesliga','fc-st-pauli,hamburger-sv,holstein-kiel,fortuna-duesseldorf,fc-schalke-04,hertha-bsc')]:
        for club in clubs.split(','):
            squads.append(squad((league,club)))
            print('Squad:',club,len(squads[-1]['players']),flush=True)
    (r.OUT/'squads.json').write_text(json.dumps({'retrievedOn':'2026-09-19','squads':squads},ensure_ascii=False,indent=2),encoding='utf-8')
