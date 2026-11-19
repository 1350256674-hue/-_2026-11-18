"""Append new images to selected existing groups without renumbering old media."""
from pathlib import Path
from PIL import Image, ImageOps
import argparse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, default=Path(r'C:\Users\Y1350\Desktop\作品集'))
parser.add_argument('--groups', nargs='+', default=['货架', '办公椅'])
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = root / 'src' / 'works.json'
groups = json.loads(manifest.read_text(encoding='utf-8'))
selected = [g for g in groups if g['title'] in args.groups and g['kind'] == 'image']
if {g['title'] for g in selected} != set(args.groups):
    raise ValueError('Every selected group must be an existing image group')
folders = {g['id']: args.source / '图片' / g['title'] for g in selected}
for folder in folders.values():
    if not folder.is_dir():
        raise FileNotFoundError(folder)
output = root / 'public' / 'media' / 'works'
output.mkdir(parents=True, exist_ok=True)
added = []
before = json.loads(json.dumps(groups))
for group in selected:
    existing = {item['source'] for item in group['items']}
    number = max(int(item['id'].rsplit('-', 1)[1]) for item in group['items']) + 1
    for file in sorted(folders[group['id']].rglob('*')):
        if not file.is_file() or file.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}:
            continue
        source = file.relative_to(args.source).as_posix()
        if source in existing:
            continue
        key = f"{group['id']}-{number:02}"
        while (output / f'{key}.webp').exists() or (output / f'{key}-thumb.webp').exists():
            number += 1
            key = f"{group['id']}-{number:02}"
        with Image.open(file) as image:
            image = ImageOps.exif_transpose(image).convert('RGB')
            width, height = image.size
            full = image.copy()
            full.thumbnail((2400, 4800))
            full.save(output / f'{key}.webp', 'WEBP', quality=90)
            thumb = image.copy()
            thumb.thumbnail((800, 800))
            thumb.save(output / f'{key}-thumb.webp', 'WEBP', quality=78)
            preview = image.copy()
            preview.thumbnail((1280, 2400))
            preview.save(output / f'{key}-preview.webp', 'WEBP', quality=82)
        for name in (f'{key}.webp', f'{key}-thumb.webp', f'{key}-preview.webp'):
            with Image.open(output / name) as generated:
                generated.verify()
        group['items'].append({'id': key, 'name': file.stem,
            'src': f'/media/works/{key}.webp', 'thumb': f'/media/works/{key}-thumb.webp',
            'width': width, 'height': height, 'source': source, 'preview': f'/media/works/{key}-preview.webp'})
        existing.add(source)
        number += 1
        added.append({'group': group['title'], 'name': file.stem, 'id': key})
for old, new in zip(before, groups):
    assert old['items'] == new['items'][:len(old['items'])], 'Existing items must stay unchanged'
    assert {k:v for k,v in old.items() if k != 'items'} == {k:v for k,v in new.items() if k != 'items'}
if added:
    manifest.write_text(json.dumps(groups, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'added': added, 'counts': {g['title']: len(g['items']) for g in selected}}, ensure_ascii=False))
