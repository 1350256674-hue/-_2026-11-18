"""Create lighter gallery previews, preserving original detail-view images."""
from pathlib import Path
from PIL import Image
import json, re, base64, io

root = Path(__file__).resolve().parents[1]
manifest = root / 'src/works.json'
groups = json.loads(manifest.read_text(encoding='utf-8'))
before_thumbs = after_thumbs = preview_bytes = 0
for group in groups:
    if group['kind'] != 'image':
        continue
    for item in group['items']:
        full = root / 'public' / item['src'].lstrip('/')
        thumb = root / 'public' / item['thumb'].lstrip('/')
        before_thumbs += thumb.stat().st_size
        with Image.open(full) as image:
            image = image.convert('RGB')
            preview = image.copy()
            preview.thumbnail((1280, 2400))
            name = f"{item['id']}-preview.webp"
            preview.save(full.parent / name, 'WEBP', quality=82)
            preview_bytes += (full.parent / name).stat().st_size
            small = image.copy()
            small.thumbnail((800, 800))
            small.save(thumb, 'WEBP', quality=78)
        after_thumbs += thumb.stat().st_size
        item['preview'] = '/media/works/' + name
manifest.write_text(json.dumps(groups, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
card = root / 'public/media/artist-card-front-v2.svg'
svg = card.read_text(encoding='utf-8')
before_card = card.stat().st_size
def compress(match):
    with Image.open(io.BytesIO(base64.b64decode(match.group(1)))) as image:
        image = image.convert('RGB')
        image.thumbnail((1024, 1024))
        buffer = io.BytesIO()
        image.save(buffer, 'WEBP', quality=85)
    return 'data:image/webp;base64,' + base64.b64encode(buffer.getvalue()).decode('ascii')
svg = re.sub(r'data:image/png;base64,([A-Za-z0-9+/=]+)', compress, svg)
card.write_text(svg, encoding='utf-8')
report = {'thumbnailBytesBefore':before_thumbs,'thumbnailBytesAfter':after_thumbs,
          'previewBytes':preview_bytes,'cardBytesBefore':before_card,'cardBytesAfter':card.stat().st_size}
output = root / 'tmp/performance'
output.mkdir(parents=True, exist_ok=True)
(output / 'image-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report))
