import re
from pathlib import Path

root = Path("src/content/packs")
missing = []
broken = []
generic = []
for f in root.glob("*meat*.ts"):
    t = f.read_text(encoding="utf-8")
    ids = list(re.finditer(r"workId:\s*'([^']+)'", t))
    for i, m in enumerate(ids):
        wid = m.group(1)
        start = m.start()
        end = ids[i + 1].start() if i + 1 < len(ids) else len(t)
        block = t[start:end]
        if "solutionSketch" not in block:
            missing.append((f.name, wid))
            continue
        sm = re.search(r"sketch:\s*\n?\s*'((?:\\'|[^'])*)'", block)
        if not sm:
            broken.append((f.name, wid, "no sketch string"))
            continue
        sk = sm.group(1)
        if len(sk) < 40:
            broken.append((f.name, wid, f"short:{len(sk)}"))
        if sk.startswith("Outline: state assumptions"):
            generic.append((f.name, wid))

print("missing", len(missing), missing[:15])
print("broken", len(broken), broken[:15])
print("generic", len(generic), generic[:10])
