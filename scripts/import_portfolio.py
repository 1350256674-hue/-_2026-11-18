"""Import only user-designated media directories, preserving their groups."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json, shutil

source = Path(r'C:\Users\Y1350\Desktop\作品集')
root = Path(__file__).resolve().parents[1]
out = root / 'public' / 'media' / 'works'
out.mkdir(parents=True, exist_ok=True)
definitions = [('产品动画','视频/通用','PRODUCT ANIMATION','video'),('PV','图片/PV','PROMOTIONAL FILM','video'),('办公椅','图片/办公椅','OFFICE SEATING','image'),('货架','图片/货架','SHELVING SYSTEMS','image'),('家具','图片/家具','FURNITURE VISUALS','image'),('母婴','图片/母婴','MOTHER & BABY','image'),('首页','图片/首页','ECOMMERCE DESIGN','image')]
groups=[]
tiles=[]
for gi,(title,folder,en,kind) in enumerate(definitions):
    items=[]
    for ii, file in enumerate(sorted((source/folder).rglob('*'))):
        if not file.is_file() or file.suffix.lower() not in ['.png','.jpg','.jpeg','.webp','.mp4','.mov','.webm']: continue
        key=f'g{gi+1}-{len(items)+1:02}'
        if kind=='image':
            with Image.open(file) as im:
                im=ImageOps.exif_transpose(im).convert('RGB')
                width,height=im.size
                full=im.copy(); full.thumbnail((2400,4800))
                full.save(out/f'{key}.webp','WEBP',quality=90)
                thumb=im.copy(); thumb.thumbnail((1000,1000))
                thumb.save(out/f'{key}-thumb.webp','WEBP',quality=83)
                tile=ImageOps.contain(im,(210,150)); card=Image.new('RGB',(230,185),'#202020');card.paste(tile,((230-tile.width)//2,0));ImageDraw.Draw(card).text((10,158),key,fill='white');tiles.append(card)
            item={'id':key,'name':file.stem,'src':f'/media/works/{key}.webp','thumb':f'/media/works/{key}-thumb.webp','width':width,'height':height}
        else:
            target=f'{key}{file.suffix.lower()}'
            # The hero already contains the exact first product animation.
            url='/media/product-film.mp4' if gi==0 and not items else f'/media/works/{target}'
            if url!='/media/product-film.mp4': shutil.copy2(file,out/target)
            item={'id':key,'name':file.stem,'src':url,'thumb':f'/media/works/{key}-poster.jpg','mime':'video/mp4' if file.suffix.lower()=='.mp4' else 'video/webm'}
        item['source']=str(file.relative_to(source)).replace('\\','/')
        items.append(item)
    groups.append({'id':f'g{gi+1}','title':title,'en':en,'kind':kind,'coverIndex':{2:3,3:1,4:4,6:3}.get(gi,0),'items':items})
order=['产品动画','PV','首页','母婴','家具','办公椅','货架']
groups.sort(key=lambda g: order.index(g['title']))
for i,g in enumerate(groups): g['order']=i+1
(root/'src'/'works.json').write_text(json.dumps(groups,ensure_ascii=False,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(230*6,185*((len(tiles)+5)//6)),'#111111')
for i,tile in enumerate(tiles): sheet.paste(tile,((i%6)*230,(i//6)*185))
sheet.save(root/'works-contact-sheet.jpg')
print(json.dumps({g['title']:len(g['items']) for g in groups},ensure_ascii=False))
