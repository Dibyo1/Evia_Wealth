import re
import os

files = ["investment-products", "portfolio-solutions", "wealth-planning", "real-estate", "lending-solutions"]

for name in files:
    path = f"/tmp/{name}.html"
    print(f"\n" + "="*40 + f" {name.upper()} " + "="*40)
    with open(path) as f:
        html = f.read()

    # Find banner / hero title & text
    # e.g. <section ... class="page-title" ...>
    page_title = re.search(r'<section[^>]+class="[^"]*page-title[^"]*"[^>]*>(.*?)</section>', html, re.S)
    if page_title:
        clean_title = re.sub(r'<[^>]+>', ' ', page_title.group(1))
        clean_title = ' '.join(clean_title.split())
        print("PAGE TITLE SECTION:", clean_title)

    # find sidebar links or widgets
    widgets = re.findall(r'<div[^>]+class="[^"]*widget[^"]*"[^>]*>(.*?)</div>', html, re.S)
    print(f"Found {len(widgets)} widgets")

    # find cards / content items
    # let's look for h3/h4/h5 and following p
    items = re.findall(r'<(h[2-4])[^>]*>(.*?)</\1>\s*<p[^>]*>(.*?)</p>', html, re.S)
    print(f"ITEMS ({len(items)}):")
    for tag, h, p in items:
        h_clean = ' '.join(re.sub(r'<[^>]+>', ' ', h).split())
        p_clean = ' '.join(re.sub(r'<[^>]+>', ' ', p).split())
        print(f"  [{tag}] {h_clean}")
        print(f"        {p_clean}")

    # find all images with src
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.S)
    print("IMAGES:")
    for img in set(imgs):
        if not any(x in img.lower() for x in ['logo', 'icon', 'favicon']):
            print(f"  {img}")
