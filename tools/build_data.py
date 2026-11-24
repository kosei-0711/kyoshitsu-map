"""時間割Excel → data/timetable.json 変換スクリプト

使い方:
    python tools/build_data.py "C:/path/to/令和８年度時間割_学部.xlsx"

37号館・39号館の教室だけを抽出し、教室ごとの授業リストを出力する。
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

TARGET_BUILDINGS = ("37", "39")
DAYS = "月火水木金土"

TERM_TO_Q = {
    "1Q": [1], "2Q": [2], "3Q": [3], "4Q": [4],
    "前学期": [1, 2], "後学期": [3, 4], "通年": [1, 2, 3, 4],
}

ROOM_RE = re.compile(r"(?<![0-9A-Za-z])(3[79]\d{3})(?:\.0)?(?![0-9A-Za-z])")
Q_LINE_RE = re.compile(r"^\s*([1-4])Q\s*(.*)$")


def norm(v):
    if v is None:
        return ""
    return unicodedata.normalize("NFKC", str(v)).strip()


def parse_rooms(raw, quarters):
    """使用教室文字列 → [(quarters, room), ...]

    '1Q 39508\n2Q 37803' のようなクォーター別指定にも対応。
    """
    text = norm(raw)
    out = []
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if lines and all(Q_LINE_RE.match(ln) for ln in lines):
        for ln in lines:
            m = Q_LINE_RE.match(ln)
            q = int(m.group(1))
            if q not in quarters:
                continue
            for room in ROOM_RE.findall(m.group(2)):
                out.append(([q], room))
    else:
        for room in ROOM_RE.findall(text):
            out.append((quarters, room))
    return out


def main(xlsx_path, out_path):
    wb = openpyxl.load_workbook(xlsx_path, read_only=True)
    rows = list(wb.worksheets[0].iter_rows(values_only=True))
    header = [norm(h).replace("\n", "") for h in rows[0]]
    col = {name: i for i, name in enumerate(header)}

    rooms = {}
    skipped = 0
    for r in rows[1:]:
        term = norm(r[col["開講期間"]])
        quarters = TERM_TO_Q.get(term)
        dp = norm(r[col["曜日時限"]])
        if not quarters or len(dp) != 2 or dp[0] not in DAYS or not dp[1].isdigit():
            skipped += 1
            continue
        day, period = dp[0], int(dp[1])
        for qs, room in parse_rooms(r[col["使用教室"]], quarters):
            rooms.setdefault(room, []).append({
                "q": qs,
                "d": day,
                "p": period,
                "n": norm(r[col["授業名"]]),
                "dep": norm(r[col["学科"]]),
                "y": norm(r[col["設置学年"]]),
                "c": norm(r[col["講義コード"]]),
            })

    # 重複行(同一授業・同一コマ)を除去して並べ替え
    for room, items in rooms.items():
        seen, uniq = set(), []
        for it in sorted(items, key=lambda x: (DAYS.index(x["d"]), x["p"], x["q"], x["c"])):
            key = (it["c"], it["d"], it["p"], tuple(it["q"]))
            if key not in seen:
                seen.add(key)
                uniq.append(it)
        rooms[room] = uniq

    data = {
        "source": Path(xlsx_path).name,
        "rooms": dict(sorted(rooms.items())),
    }
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    total = sum(len(v) for v in rooms.values())
    print(f"rooms={len(rooms)} entries={total} skipped_rows={skipped} -> {out_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python tools/build_data.py <時間割.xlsx> [出力json]")
    out = sys.argv[2] if len(sys.argv) > 2 else str(Path(__file__).resolve().parent.parent / "data" / "timetable.json")
    main(sys.argv[1], out)
