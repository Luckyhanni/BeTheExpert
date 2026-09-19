"""Reproducible fact extraction. Outputs factual tables only, never website prose."""
import concurrent.futures
import html
import json
import re
from pathlib import Path
import requests
import os
import sys
sys.path.insert(0, str(Path(os.environ.get('TEMP', '/tmp')) / 'bte-research-libs'))
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'research'
OUT.mkdir(exist_ok=True)

def fetch(url):
    r = requests.get(url, timeout=40)
    r.raise_for_status()
    if r.content.startswith((b'\xff\xfe', b'\xfe\xff')):
        return r.content.decode('utf-16')
    try:
        return r.content.decode('utf-8')
    except UnicodeDecodeError:
        return r.content.decode('windows-1252')

def clean(s):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', s)).split())

def tables(s):
    return [[ [clean(c) for c in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>', row, re.S)]
              for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>', table, re.S)]
            for table in re.findall(r'<table\b.*?</table>', s, re.S)]

if __name__ == '__main__':
    urls = {
        'de-1-eternal': 'https://datencenter.dfb.de/competitions/bundesliga/eternal_table',
        'de-2-eternal': 'https://datencenter.dfb.de/competitions/2-bundesliga/eternal_table',
        'de-1-scorers-2025': 'https://datencenter.dfb.de/competitions/bundesliga/seasons/2025-2026/top_scorer',
        'de-2-scorers-2025': 'https://datencenter.dfb.de/competitions/2-bundesliga/seasons/2025-2026/top_scorer',
        'de-2-champions': 'https://rsssf.org/tablesd/duit2champ.html',
        'de-1-champions': 'https://www.rsssf.org/tablesd/duitchamp.html',
        'de-2-scorers': 'https://www.rsssf.org/tablesd/duit2tops.html',
    }
    def run(item):
        name, url = item
        s = fetch(url)
        ts = tables(s)
        pres = [html.unescape(re.sub(r'<[^>]+>', '', p)) for p in re.findall(r'<pre[^>]*>(.*?)</pre>', s, re.S | re.I)] if not ts else []
        result = {'url': url, 'retrievedOn': '2026-09-19', 'tables': ts, 'preformatted': pres}
        (OUT / (name + '.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(name, [len(t) for t in ts], flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(run, urls.items()))
