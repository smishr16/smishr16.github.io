from pathlib import Path

p = Path("src/content/packs/other-meat.ts")
t = p.read_text(encoding="utf-8")
idx = t.find("export const labMeat")
section = t[idx:]
key = "workId: 'm3-quick-vs-merge-lab'"
first = section.find(key)
second = section.find(key, first + 1)
print("first", first, "second", second)
if second > 0:
    abs_second = idx + second
    cut = t.rfind("\n  {", 0, abs_second)
    t = t[:cut] + "\n]\n"
    print("truncated dups, new len", len(t))

t = t.replace(
    "Name one workload where NLJ still wins (indexed inner, tiny outer). One sentence.",
    "Name one workload where NLJ still wins (indexed inner, outer size n<=10). One sentence.",
)
t = t.replace("Theta(n log n)", "Θ(n log n)")
p.write_text(t, encoding="utf-8")
print("done")
