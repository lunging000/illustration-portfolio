"""Validate deployable asset references using only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]

class AssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.anchors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs['id'])
        if tag in ('img', 'script') and attrs.get('src'):
            self.refs.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.refs.append(attrs['href'])
        if tag == 'img':
            assert 'alt' in attrs, 'Image missing alt attribute'
        if tag == 'a' and attrs.get('href', '').startswith('#'):
            self.anchors.append(attrs['href'][1:])

parser = AssetParser()
parser.feed((ROOT / 'index.html').read_text())
for ref in parser.refs:
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        continue
    assert not url.path.startswith('/'), f'Root-relative path breaks project Pages: {ref}'
    path = (ROOT / unquote(url.path)).resolve()
    assert path.is_relative_to(ROOT), f'Asset outside site: {ref}'
    assert path.is_file(), f'Missing asset: {ref}'
for anchor in parser.anchors:
    assert not anchor or anchor in parser.ids, f'Missing anchor: #{anchor}'
print(f'Validated {len(parser.refs)} local resource references and navigation anchors.')
