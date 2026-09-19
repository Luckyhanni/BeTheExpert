"""Build reviewed, offline career packs from factual research snapshots and existing packs."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'src/features/quiz/data'
RESEARCH = ROOT / 'docs/research'
def read(path): return json.loads(path.read_text(encoding='utf-8'))
def old(name): return read(DATA / ('de-bundesliga-' + name + '.json'))
def research(name): return read(RESEARCH / (name + '.json'))
def norm(s):
    s=s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss').replace('ł','l')
    return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode())

NAMES = {
 'Hessen Kassel':'KSV Hessen Kassel', 'SC Westfalia Herne':'Westfalia Herne',
 'VfR Wormatia Worms':'Wormatia Worms', 'Arminia Hannover':'SV Arminia Hannover',
 'Erzgebirge Aue':'FC Erzgebirge Aue', 'SpVgg Oberfranken Bayreuth':'SpVgg Bayreuth',
 'Jahn Regensburg':'SSV Jahn Regensburg', 'SSV Ulm 1846 Fussball':'SSV Ulm 1846',
 'SV Viktoria Aschaffenburg':'Viktoria Aschaffenburg', 'FC Würzburger Kickers':'Würzburger Kickers',
 '1.FC Köln':'1. FC Köln','1.FC Nürnberg':'1. FC Nürnberg','1.FC Kaiserslautern':'1. FC Kaiserslautern',
 '1.FC Saarbrücken':'1. FC Saarbrücken','1.FC Heidenheim':'1. FC Heidenheim',
 'FC Homburg/Saar':'FC 08 Homburg','Hannoverscher SV 96':'Hannover 96','FC Sankt Pauli':'FC St. Pauli',
 'DSC Arminia Bielefeld':'Arminia Bielefeld','TSV Bayer 04 Leverkusen':'Bayer 04 Leverkusen',
 'Bayer Leverkusen':'Bayer 04 Leverkusen','FC Bayer 05 Uerdingen':'KFC Uerdingen 05','KFC Uerdingen':'KFC Uerdingen 05',
 'FC Hansa Rostock':'Hansa Rostock','BV Borussia Dortmund':'Borussia Dortmund',
 'VfL Borussia Mönchengladbach':'Borussia Mönchengladbach','Braunschweiger TSV Eintracht':'Eintracht Braunschweig',
 'Werder Bremen':'SV Werder Bremen','TSV München von 1860':'TSV 1860 München','FC Ingolstadt':'FC Ingolstadt 04',
 '1. FC Heidenheim':'1. FC Heidenheim 1846','1.FC Heidenheim':'1. FC Heidenheim 1846',
 'SpVgg Fürth':'SpVgg Greuther Fürth','SC Rot-Weiß Essen':'Rot-Weiss Essen','SC Rot-Weiss Essen':'Rot-Weiss Essen',
 'SC Rot-Weiß Oberhausen':'Rot-Weiß Oberhausen','TSV Fortuna Düsseldorf':'Fortuna Düsseldorf',
 'TSV Alemannia Aachen':'Alemannia Aachen','SC Fortuna Köln':'Fortuna Köln','FC Energie Cottbus':'Energie Cottbus',
 'SV Stuttgarter Kickers':'Stuttgarter Kickers','SpVg Blau-Weiß 90 Berlin':'Blau-Weiß 90 Berlin',
 'SG Eintracht Frankfurt':'Eintracht Frankfurt','TSV Eintr. Braunschweig':'Eintracht Braunschweig',
 'Kieler SV Holstein':'Holstein Kiel','SC Paderborn':'SC Paderborn 07','SSV Reutlingen':'SSV Reutlingen 05',
 'Rudolf Völler':'Rudi Völler','Andriy Viktorovych Voronin':'Andrij Woronin',
 'Francisco COPADO Álvarez':'Francisco Copado','Robert Nesta Glatzel':'Robert Glatzel',
 'Alexander Meier':'Alex Meier', 'Souleymane Sané':'Souleyman Sané',
}
def canonical(s): return NAMES.get(s.strip(),s.strip())
ALIASES = {
 'Fritz Walter':['Fritz Walter (geb. 1960)','Fritz Walter (1960)'],
 'FC Bayern München':['Bayern','Bayern München','FCB'], 'Borussia Dortmund':['Dortmund','BVB'],
 'Borussia Mönchengladbach':['Gladbach','Mönchengladbach'], 'SV Werder Bremen':['Werder','Werder Bremen','Bremen'],
 'Bayer 04 Leverkusen':['Leverkusen','Bayer Leverkusen'], 'Hamburger SV':['HSV','Hamburg'],
 'TSV 1860 München':['1860','1860 München'], 'FC Schalke 04':['Schalke','Schalke 04','S04'],
 '1. FC Nürnberg':['Nürnberg','FCN'], '1. FC Köln':['Köln','FC Köln'],
 'VfB Stuttgart':['Stuttgart','VfB'], '1. FC Kaiserslautern':['Kaiserslautern','FCK'],
 'Eintracht Braunschweig':['Braunschweig'], 'Eintracht Frankfurt':['Frankfurt'],
 'VfL Wolfsburg':['Wolfsburg'], 'FC St. Pauli':['St Pauli','St. Pauli','Sankt Pauli'],
 'SpVgg Greuther Fürth':['Fürth','Greuther Fürth','SpVgg Fürth'], 'Arminia Bielefeld':['Bielefeld','Arminia'],
 'Hertha BSC':['Hertha','Hertha Berlin'], 'KFC Uerdingen 05':['Uerdingen','Bayer Uerdingen','Bayer 05 Uerdingen'],
 'VfL Bochum':['Bochum'], 'Karlsruher SC':['Karlsruhe','KSC'], 'Hannover 96':['Hannover'],
 'Fortuna Düsseldorf':['Düsseldorf'], 'SC Freiburg':['Freiburg'], 'MSV Duisburg':['Duisburg','MSV'],
 'SV Darmstadt 98':['Darmstadt'], '1. FC Heidenheim 1846':['Heidenheim','1. FC Heidenheim'],
 'Hansa Rostock':['Rostock','FC Hansa Rostock'], 'SV Waldhof Mannheim':['Waldhof','Waldhof Mannheim'],
 'FC 08 Homburg':['Homburg'], '1. FC Saarbrücken':['Saarbrücken'], 'FC Ingolstadt 04':['Ingolstadt'],
 'SC Paderborn 07':['Paderborn'], 'Holstein Kiel':['Kiel'], 'SV Elversberg':['Elversberg'],
 'Rot Weiss Ahlen':['Rot-Weiss Ahlen','LR Ahlen','Ahlen'], 'TSG Hoffenheim':['Hoffenheim','TSG 1899 Hoffenheim'],
 'Alex Meier':['Alexander Meier'], 'Rudi Völler':['Rudolf Völler'], 'Andrij Woronin':['Andriy Voronin','Andrei Voronin'],
 'Souleyman Sané':['Souleymane Sané'], 'Alexander Niklas Meyer-Schade':['Alexander Meyer'],
}
for historical, current in NAMES.items():
    if historical!=current: ALIASES.setdefault(current,[]).append(historical)

def answer(name, aliases=None):
    name=canonical(name)
    return {'id':norm(name),'label':name,'aliases':list(dict.fromkeys(ALIASES.get(name,[])+(aliases or [])))}
def rnd(id, mode, prompt, names, sources, hint='', options=None, explanation=None):
    answers=[n if isinstance(n,dict) else answer(n) for n in names]
    return {'id':id,'mode':mode,'prompt':prompt,'hint':hint,'answers':answers,
            'options':[n if isinstance(n,dict) else answer(n) for n in (options or [])],
            'explanation':explanation or 'Lösung: '+ ' · '.join(a['label'] for a in answers), 'sources':list(dict.fromkeys(sources))}
packs=[]
def pack(league,category,level,title,scope,rounds):
    assert rounds, (league,category,level)
    packs.append({'id':f'{league}:{category}:{level}','leagueId':league,'categoryId':category,'level':level,
                  'title':title,'scope':scope,'verifiedAsOf':'2026-09-19', 'timeLimitSeconds':10 if level==4 else None,'rounds':rounds})

def seasons(league):
    d=research(league+'-champions'); result=[]
    for i,p in enumerate(d['preformatted']):
        if league=='de-1' and i!=2: continue
        if league=='de-2' and i not in [2,3,4,5]: continue
        p=p.split('NB:')[0].split('[1]')[0]
        for line in p.splitlines():
            m=re.match(r'^(\d{4}/\d{2})\s+(.+)',line)
            if not m: continue
            season, clubs=m.groups()
            values=re.split(r'\s{2,}',clubs.strip())
            for j, club in enumerate(values):
                result.append({'season':season,'group':(['Nord','Süd'][j] if len(values)==2 else ''),'winner':canonical(club),'sources':[d['url']]})
    return result

def scorer_seasons():
    d=research('de-2-scorers'); result=[]; season=''
    for line in d['preformatted'][0].split('NB:')[0].splitlines():
        if not line.strip() or line.startswith('Season'): continue
        m=re.match(r'^(\d{4}/\d{2})\s+',line)
        if m: season=m.group(1); line=line[m.end():]
        values=re.split(r'\s{2,}',line.strip())
        if len(values)!=3: continue
        name, club, goals=values
        group='Nord' if '(Nord)' in goals else 'Süd' if '(Süd' in goals else ''
        key=(season,group)
        item=next((r for r in result if (r['season'],r['group'])==key),None)
        if not item:
            item={'season':season,'group':group,'winners':[],'sources':[d['url']]};result.append(item)
        item['winners'].append(canonical(name))
    assert len(result)==60,len(result)
    return result

def import_mc(category):
    d=old(category+'-level-1')
    catalog=d.get('sourceCatalog',{})
    if isinstance(catalog,list): catalog={x['id']:x for x in catalog}
    rows=[]
    for q in d['questions']:
        correct=next(o['text'] for o in q['options'] if o['id']==q['correctOptionId'])
        sources=q.get('sources') or [catalog[s]['url'] for s in q.get('sourceIds',[]) if s in catalog]
        rows.append(rnd(q['id'],'choice',q['question'],[correct],sources,q.get('playerHint','Deutsche Meister der Männer seit 1903; ohne eigenständige DDR-Meisterschaft.'),[o['text'] for o in q['options']],q['explanation']))
    scope={
        'champions':'Deutsche Meister der Männer seit 1903 bis 2025/26; ohne eigenständige DDR-Meisterschaft.',
        'participants':'Bundesliga der Männer seit 1963/64 bis 05.09.2026; einschließlich Elversbergs Debüt 2026/27.',
        'top-scorers':'Bundesliga der Männer seit 1963/64 bis Ende 2025/26; geteilte Titel zählen mit.',
        'players':'Pflichtspiele für die erste Herrenmannschaft bis 05.09.2026; alle Wettbewerbe, keine Jugend-, Reserve- oder Trainerstationen.'
    }[category]
    pack('de-1',category,1,{'champions':'Meister erkennen','participants':'Bundesligisten erkennen','top-scorers':'Torschützenkönige erkennen','players':'Vereinszugehörigkeiten'}[category],scope,rows)
    packs[-1]['verifiedAsOf']=d['verifiedAsOf']

def mc_unique(league,category,title,scope,correct,pool,prompt,sources):
    positives={norm(c) for c in correct}
    distractors=list({norm(canonical(c)):canonical(c) for c in pool if norm(canonical(c)) not in positives}.values())
    assert len(distractors)>=len(correct)*3,(category,len(correct),len(distractors))
    rows=[]
    for i,c in enumerate(correct):
        rows.append(rnd(f'{league}-{category}-mc-{i}','choice',prompt,[c],sources,scope,[c]+distractors[i*3:i*3+3]))
    pack(league,category,1,title,scope,rows)

def build_players():
    profiles=research('player-histories')['players']
    squads=research('squads')['squads']
    club_names={'borussia-dortmund':'Borussia Dortmund','bayern-muenchen':'FC Bayern München','bayer-leverkusen':'Bayer 04 Leverkusen',
                'vfb-stuttgart':'VfB Stuttgart','werder-bremen':'SV Werder Bremen','eintracht-frankfurt':'Eintracht Frankfurt',
                'fc-st-pauli':'FC St. Pauli','hamburger-sv':'Hamburger SV','holstein-kiel':'Holstein Kiel',
                'fortuna-duesseldorf':'Fortuna Düsseldorf','fc-schalke-04':'FC Schalke 04','hertha-bsc':'Hertha BSC'}
    def date(d):
        try:
            day,month,year=d.split('.');return f'{year}-{month}-{day}'
        except ValueError: return '9999'
    def stations(p, competition):
        result=[]
        for spell in p.get('spells',[]):
            for c in spell['competitions']:
                if c['name']==competition and c['games']>0 and date(c['from'])<='2026-06-30':
                    result.append((date(c['from']),canonical(spell['club'])))
        return sorted(set(result))
    for league,competition in [('de-1','Bundesliga'),('de-2','2. Bundesliga')]:
        roster_rounds=[]
        for i,squad in enumerate(s for s in squads if s['leagueId']==league):
            aa=list({norm(n):answer(n) for n in squad['players']}.values())
            surnames={}
            for a in aa: surnames.setdefault(norm(a['label'].split()[-1]),[]).append(a)
            for matches in surnames.values():
                if len(matches)==1: matches[0]['aliases'].append(matches[0]['label'].split()[-1])
            roster_rounds.append(rnd(f'{league}-squad-{i}','set',f"Nenne die Spieler des Saisonkaders 2023/24 von {club_names[squad['club']] }.",aa,[squad['url']],
                'Historischer Saisonkader laut DFB, einschließlich Zu- und Abgängen während der Saison. Trainer zählen nicht. Ein Einsatz ist hier nicht erforderlich.'))
        pack(league,'players',2,'Historische Kader','Fester Saisonkader 2023/24 laut DFB; alle dort geführten Spieler, keine Trainer.',roster_rounds)
        eligible=[p for p in profiles if len(stations(p,competition))>=2]
        paths=[];sprints=[];seen=set()
        for p in eligible:
            ss=stations(p,competition)
            sequence=tuple(ss)
            if sequence in seen: continue
            seen.add(sequence)
            # Restrict to clearly different paths. Other players in the research pool with the same sequence are excluded.
            if sum(stations(other,competition)==ss for other in eligible)!=1: continue
            display=' → '.join(f'{club} ({when[:4]})' for when,club in ss)
            a=answer(p['name'])
            last=a['label'].split()[-1]
            if sum(norm(other['name'].split()[-1])==norm(last) for other in profiles)==1:a['aliases'].append(last)
            paths.append(rnd(f"{league}-path-{norm(p['name'])}",'text','Welcher Spieler ist gesucht?',[a],[p['url']],
                f'{competition}-Stationen nach erstem Ligaeinsatz (Jahr), bis Ende 2025/26. Rückkehr zu einem Verein wird nicht erneut gezeigt.\n'+display))
            clubs=list(dict.fromkeys(club for _,club in ss))
            sprints.append(rnd(f"{league}-clubs-{norm(p['name'])}",'set',f"Für welche Vereine spielte {p['name']} in der {competition}?",clubs,[p['url']],
                'Mindestens ein Einsatz in dieser Liga bis Ende 2025/26. Pokal, Relegation, Reserven und andere Ligen zählen nicht.'))
        pack(league,'players',3,'Spieler an Ligastationen erkennen',f'Dokumentierte {competition}-Einsätze bis Ende 2025/26; nach erstem Einsatz sortiert.',paths)
        pack(league,'players',4,'Spieler-Sprint',f'Alle Vereine eines Spielers mit {competition}-Einsatz bis Ende 2025/26.',sprints)
        if league=='de-2':
            rows=[];used=set();used_clubs=set()
            for p in profiles:
                if norm(p['name']) in used: continue
                ss=stations(p,competition)
                if not ss: continue
                target=next((club for _,club in ss if club not in used_clubs),None)
                if not target: continue
                distractors=[]
                for other in profiles:
                    if other==p or norm(other['name']) in used:continue
                    # Full documented first-team club history, not just one season or league.
                    if target in [canonical(s['club']) for s in other.get('spells',[])]: continue
                    distractors.append(other)
                    if len(distractors)==3:break
                if len(distractors)!=3:break
                used.update(norm(x['name']) for x in [p]+distractors);used_clubs.add(target)
                rows.append(rnd(f'de-2-player-mc-{len(rows)}','choice',f'Welcher Spieler absolvierte für {target} ein Spiel in der 2. Bundesliga?',[p['name']],
                    [x['url'] for x in [p]+distractors], 'Bis Ende 2025/26; nur Ligaeinsätze der ersten Herrenmannschaft.',[x['name'] for x in [p]+distractors]))
            assert len(rows)>=15,len(rows)
            pack(league,'players',1,'Spieler und Zweitligavereine','Dokumentierte Zweitligaeinsätze bis Ende 2025/26. Jeder Spieler kommt im Paket nur einmal als Option vor.',rows)

def build():
    for category in ['champions','participants','top-scorers','players']: import_mc(category)
    c1=old('champions-level-2')
    pack('de-1','champions',2,'Alle deutschen Meister','Deutsche Meister der Männer seit 1903 bis 2025/26; ohne eigenständige DDR-Meisterschaft.',[
        rnd('de-1-champions-set','set',c1['questions'][0]['question'],[answer(c['name'],c['acceptedNames']) for c in c1['clubs']],
            [s['url'] for s in c1['sources'].values()] if isinstance(c1['sources'],dict) else [s['url'] for s in c1['sources']],c1['questions'][0]['playerHint'])])
    for league in ['de-1','de-2']:
        label='Bundesliga' if league=='de-1' else '2. Bundesliga'
        cs=seasons(league)
        assert len(cs)==(63 if league=='de-1' else 60),(league,len(cs))
        if league=='de-2':
            champs=list(dict.fromkeys(x['winner'] for x in cs))
            scope='2. Bundesliga der Männer seit 1974/75 bis 2025/26. Nord-/Süd-Staffelsieger zählen mit; frühere Regionalligen nicht.'
            pool=[canonical(row[1]) for row in research('de-2-eternal')['tables'][0][1:]]
            mc_unique(league,'champions','Zweitligameister erkennen',scope,champs,pool,'Welcher Verein wurde Meister oder Staffelsieger der 2. Bundesliga?',[research('de-2-champions')['url']])
            for row in packs[-1]['rounds']:
                proof=next(x for x in cs if norm(x['winner'])==row['answers'][0]['id'])
                row['explanation']=f"{proof['winner']} wurde {proof['season']} Meister der 2. Bundesliga"+(f" {proof['group']}" if proof['group'] else '')+'.'
            pack(league,'champions',2,'Alle Zweitligameister',scope,[rnd('de-2-champions-set','set','Nenne alle Meister und Staffelsieger der 2. Bundesliga bis 2025/26.',champs,[research('de-2-champions')['url']],scope)])
        for level in [3,4]:
            pack(league,'champions',level,'Meistersaisons' if level==3 else 'Meister-Sprint',f'{label} seit '+('1963/64' if league=='de-1' else '1974/75')+' bis 2025/26.',[
                rnd(f'{league}-champ-{level}-{i}','text',f"Wer wurde {x['season']} Meister der {label}"+(f" {x['group']}" if x['group'] else '')+'?',[x['winner']],x['sources'],'Gesucht ist der Meister dieser Saison'+(' und Staffel.' if x['group'] else '.')) for i,x in enumerate(cs)])
        table=research(league+'-eternal')
        names=[canonical(row[1]) for row in table['tables'][0][1:]]
        if league=='de-1':
            pd=old('participants-level-1')
            participants=[c['name'] for c in pd['clubs'] if c['hasPlayedInMensBundesliga']]
            source=[s['url'] for s in pd['sources']]
            scope='Alle Bundesligisten seit 1963/64 bis 05.09.2026, einschließlich SV Elversberg.'
        else:
            participants=names;source=[table['url']]
            scope='2. Bundesliga seit 1974/75 bis Ende 2025/26; Nord/Süd eingeschlossen. Historische Vereine getrennt von Fusionsnachfolgern.'
            # Historical clubs and successors are not used as distractors against one another.
            candidate=old('participants-level-1')['clubs']
            exclude=['bayer','leipzig','tasmania','ingolstadt','paderborn','guetersloh','wuerzburg','hof','uerdingen','fuerth','schwenningen','ulm','remscheid']
            pool=[c['name'] for c in candidate if not c['hasPlayedInMensBundesliga'] and not any(x in norm(c['name']) for x in exclude)
                  and norm(canonical(c['name'])) not in {norm(n) for n in names}]
            # 24 non-repeating recognition questions; the full 128-club set is in level 2.
            mc_unique(league,'participants','Zweitligisten erkennen',scope,names[:24],pool,'Welcher Verein spielte bis Ende 2025/26 in der 2. Bundesliga?',source)
        pack(league,'participants',2,'Alle Teilnehmer',scope,[rnd(league+'-participants-set','set','Nenne alle bisherigen Teilnehmer. Mehrfach genannte Vereine zählen nur einmal.',participants,source,scope)])
        rankscope='Ewige Tabelle des DFB, Archivstand Ende 2025/26; durchgehend Drei-Punkte-Wertung. Abruf 19.09.2026. Dieser feste Stand gilt für die Runde.'
        ordered=[]
        for i in range(0,len(names)-3,3):
            selected=names[i:i+4]
            ordered.append(rnd(f'{league}-rank-order-{i}','order','Ordne die Vereine nach ihrer Position in der Ewigen Tabelle: bester zuerst.',selected,[table['url']],rankscope,selected, ' → '.join(f'{names.index(n)+1}. {n}' for n in selected)))
        pack(league,'participants',3,'Ewige Tabelle sortieren',rankscope,ordered)
        pack(league,'participants',4,'Tabellenplatz-Sprint',rankscope,[rnd(f'{league}-rank-{i}','text',f'Welcher Verein steht auf Platz {i+1} der Ewigen Tabelle?',[n],[table['url']],rankscope) for i,n in enumerate(names)])
        if league=='de-1':
            sd=old('top-scorers-level-1')
            ss=[{'season':x['season'],'group':'','winners':[w['playerName'] for w in x['winners']], 'sources':[sd['sourceCatalog'][s]['url'] for s in x['sourceIds']]} for x in sd['awardHistory']]
        else: ss=scorer_seasons()
        winners=list(dict.fromkeys(canonical(w) for s in ss for w in s['winners']))
        scope=f'{label} der Männer bis Ende 2025/26. Geteilte Titel zählen mit.'+(' Einschließlich Nord-/Südstaffeln seit 1974/75.' if league=='de-2' else '')
        sources=list(dict.fromkeys(u for s in ss for u in s['sources']))
        if league=='de-2':
            pool=[p['name'] for p in old('top-scorers-level-1')['players']]+[p['name'] for p in old('players-level-1')['players']]
            mc_unique(league,'top-scorers','Zweitliga-Torschützenkönige',scope,winners,pool,'Wer wurde Torschützenkönig der 2. Bundesliga?',sources)
            for row in packs[-1]['rounds']:
                proof=next(s for s in ss if any(norm(w)==row['answers'][0]['id'] for w in s['winners']))
                row['explanation']=f"{row['answers'][0]['label']} wurde {proof['season']} Torschützenkönig der 2. Bundesliga"+(f" {proof['group']}" if proof['group'] else '')+('. Gemeinsam mit: '+', '.join(w for w in proof['winners'] if norm(w)!=row['answers'][0]['id'])+'.' if len(proof['winners'])>1 else '.')
        pack(league,'top-scorers',2,'Alle Torschützenkönige',scope,[rnd(league+'-scorers-set','set','Nenne alle bisherigen Torschützenkönige. Jede Person zählt einmal.',winners,sources,scope)])
        for level in [3,4]:
            pack(league,'top-scorers',level,'Torjägersaisons' if level==3 else 'Torjäger-Sprint',scope,[rnd(f'{league}-scorer-{level}-{i}','set' if len(s['winners'])>1 else 'text',f"Wer wurde {s['season']} Torschützenkönig der {label}"+(f" {s['group']}" if s['group'] else '')+'?',s['winners'],s['sources'],f"Gesucht: {len(s['winners'])} Person(en). Bei geteiltem Titel alle nennen.") for i,s in enumerate(ss)])

if __name__=='__main__':
    build()
    build_players()
    (DATA/'german-career-packs.json').write_text(json.dumps(packs,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print([(p['id'],len(p['rounds'])) for p in packs])
