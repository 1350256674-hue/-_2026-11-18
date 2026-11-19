"""Refresh existing images and append new images for one portfolio group."""
from pathlib import Path
from PIL import Image, ImageOps, ImageChops, ImageStat
import argparse, hashlib, io, json, sys

sys.stdout.reconfigure(encoding='utf-8')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--group', required=True)
parser.add_argument('--source', type=Path, default=Path(r'C:\Users\Y1350\Desktop\作品集'))
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = root / 'src/works.json'
before = json.loads(manifest.read_text(encoding='utf-8'))
groups = json.loads(json.dumps(before))
group = next(g for g in groups if g['title'] == args.group and g['kind'] == 'image')
folder = args.source / '图片' / args.group
files = sorted(p for p in folder.rglob('*') if p.is_file() and p.suffix.lower() in {'.png','.jpg','.jpeg','.webp'})
if not files:
    raise ValueError('The source image folder is missing or empty')
output = root / 'public/media/works'
output.mkdir(parents=True, exist_ok=True)
old_items = {item['source']: item for item in group['items']}
cover_id = group['items'][group.get('coverIndex', 0)]['id']
number = max(int(item['id'].rsplit('-', 1)[1]) for item in group['items']) + 1
items, added, updated, unchanged = [], [], [], []
for file in files:
    source = file.relative_to(args.source).as_posix()
    previous = old_items.get(source)
    if previous:
        item = dict(previous)
    else:
        item = {'id': f"{group['id']}-{number:02}"}
        number += 1
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    stem = f"{item['id']}-{digest[:12]}"
    with Image.open(file) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        width, height = image.size
        full = image.copy()
        full.thumbnail((2400, 4800))
        full_path = output / f'{stem}.webp'
        full.save(full_path, 'WEBP', quality=90)
        thumb = image.copy()
        thumb.thumbnail((800, 800))
        thumb.save(output / f'{stem}-thumb.webp', 'WEBP', quality=78)
        preview = image.copy()
        preview.thumbnail((1280, 2400))
        preview.save(output / f'{stem}-preview.webp', 'WEBP', quality=82)
        if not previous:
            added.append(file.stem)
        else:
            with Image.open(root / 'public' / previous['src'].lstrip('/')) as old_image, Image.open(full_path) as new_image:
                changed = old_image.size != new_image.size
                if not changed:
                    difference = ImageChops.difference(old_image.convert('RGB'), new_image.convert('RGB'))
                    changed = sum(ImageStat.Stat(difference).mean) / 3 > 1
            (updated if changed else unchanged).append(file.stem)
    for suffix in ('.webp','-thumb.webp','-preview.webp'):
        with Image.open(output / (stem + suffix)) as generated:
            generated.verify()
    item.update({'name':file.stem,'src':f'/media/works/{stem}.webp',
        'thumb':f'/media/works/{stem}-thumb.webp','preview':f'/media/works/{stem}-preview.webp',
        'width':width,'height':height,'source':source,'sourceHash':digest})
    items.append(item)
# Missing source files are preserved until a removal is explicitly requested.
seen = {item['source'] for item in items}
items.extend(item for item in group['items'] if item['source'] not in seen)
group['items'] = items
group['coverIndex'] = next(i for i,item in enumerate(items) if item['id'] == cover_id)
for old, new in zip(before, groups):
    if old['id'] != group['id']:
        assert old == new, 'Unselected groups must remain unchanged'
assert len({item['id'] for item in items}) == len(items)
backup = root / 'tmp/media-refresh'
backup.mkdir(parents=True, exist_ok=True)
backup_name = hashlib.sha256(manifest.read_bytes()).hexdigest()[:12]
(backup / f'works-{backup_name}.json').write_text(json.dumps(before, ensure_ascii=False, indent=2), encoding='utf-8')
manifest.write_text(json.dumps(groups, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'group':args.group,'total':len(items),'added':added,'updated':updated,'unchanged':unchanged}, ensure_ascii=False))
