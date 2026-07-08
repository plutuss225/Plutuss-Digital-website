from pathlib import Path

files = [
    Path('src/site-theme.css'),
    Path('src/App.css'),
    Path('src/digimark-theme.css'),
    Path('src/digimark-pages.css'),
    Path('src/seo-page.css'),
    Path('src/political-page.css'),
    Path('src/components/ClientLogoSection.css'),
]

replacements = {
    '#e80566': 'var(--plutus-accent)',
    '#65258a': 'var(--plutus-accent-2)',
    '#ff2d84': 'var(--plutus-accent-2)',
    '#8b5cf6': 'var(--plutus-accent)',
    '#4338ca': 'var(--plutus-accent)',
    '#7b4cf5': 'var(--plutus-accent)',
    '#fb7185': 'var(--plutus-accent-2)',
    '#ff6d38': 'var(--plutus-accent)',
}

for path in files:
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    updated = text
    for old, new_value in replacements.items():
        updated = updated.replace(old, new_value)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        print(f'updated {path}')
