from pathlib import Path

for f in Path("src/content/packs").glob("*meat*.ts"):
    t = f.read_text(encoding="utf-8")
    orig = t
    # Broken pattern from bad replace:   }\n    },\n\n    problems
    t = t.replace("    }\n    },\n\n    problems:", "    },\n\n    problems:")
    t = t.replace("    }\n    },\n    problems:", "    },\n    problems:")
    # Missing comma: solutionSketch block ends with }\n\n    problems
    # only when previous line is sketch close
    import re

    t = re.sub(
        r"(solutionSketch:\s*\{\s*problemId:\s*'[^']+',\s*sketch:\s*\n\s*'[^']*',\s*\n\s*)\}(\s*\n\s*problems:)",
        r"\1},\2",
        t,
    )
    if t != orig:
        f.write_text(t, encoding="utf-8")
        print("fixed", f.name)
    else:
        print("ok", f.name)
