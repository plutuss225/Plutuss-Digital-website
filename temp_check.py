from pathlib import Path
lines = Path('src/App.css').read_text('utf-8').splitlines()
depth = 0
for i, line in enumerate(lines, 1):
    depth += line.count('{') - line.count('}')
    if depth == 1:
        print(i, depth, line)
print('FINAL', depth)
