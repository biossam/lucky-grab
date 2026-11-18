#!/usr/bin/env python3
"""퀴즈 JSON으로 quizzes/<이름>.html 을 만들어요.

    python3 tools/make_quiz.py quizzes/circle.json      → quizzes/circle.html
    python3 tools/make_quiz.py --all                     → quizzes/*.json 모두 다시 만들기

틀은 저장소 루트의 index.html 이에요. 틀을 고친 뒤 --all 을 돌리면 모든 퀴즈에 반영돼요.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TPL = (ROOT / 'index.html').read_text(encoding='utf-8')
BLOCK = re.compile(r'(<script type="application/json" id="quiz-data">\n).*?(\n</script>)', re.S)


def check(d, name):
    qs = d.get('questions') or []
    if d.get('bank'):
        assert isinstance(d['bank'], str) and re.fullmatch(r'\.\./bank/[a-z0-9_-]+\.js', d['bank']), f'{name}: bank 주소는 ../bank/이름.js 꼴이어야 해요'
        assert (ROOT / 'bank' / d['bank'].split('/')[-1]).exists(), f'{name}: 문제 뱅크 파일이 없어요'
    else:
        assert qs, f'{name}: 문제가 없어요'
    seen = set()
    for i, q in enumerate(qs, 1):
        t = q.get('type') or ('choice' if 'choices' in q else 'open')
        assert q.get('q'), f'{name} {i}번: 문제 글이 없어요'
        assert q['q'] not in seen, f'{name} {i}번: 같은 문제가 또 있어요'
        seen.add(q['q'])
        if t == 'choice':
            ch = q.get('choices') or []
            assert 2 <= len(ch) <= 6, f'{name} {i}번: 보기는 2~6개'
            assert len(set(ch)) == len(ch), f'{name} {i}번: 같은 보기가 있어요'
            a = q.get('answer')
            assert (isinstance(a, int) and 1 <= a <= len(ch)) or a in ch, f'{name} {i}번: 정답 번호를 확인해 주세요'
        elif t == 'ox':
            assert str(q.get('answer')).upper() in ('O', 'X'), f'{name} {i}번: OX 정답은 O 또는 X'
        elif t == 'open':
            assert str(q.get('answer', '')).strip(), f'{name} {i}번: 주관식 정답이 없어요'
        else:
            raise AssertionError(f'{name} {i}번: 모르는 문제 종류 {t}')


def build(src):
    src = pathlib.Path(src)
    d = json.loads(src.read_text(encoding='utf-8'))
    check(d, src.name)
    html = BLOCK.sub(lambda m: m.group(1) + json.dumps(d, ensure_ascii=False, indent=2) + m.group(2), TPL, count=1)
    html = html.replace('"three": "./vendor/three/three.module.js"', '"three": "../vendor/three/three.module.js"')
    html = html.replace('"three/addons/": "./vendor/three/addons/"', '"three/addons/": "../vendor/three/addons/"')
    title = str(d.get('title') or 'LUCKY GRAB').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    html = html.replace('<title>LUCKY GRAB</title>', f'<title>{title}</title>', 1)
    assert '../vendor/three/three.module.js' in html
    out = src.with_suffix('.html')
    out.write_text(html, encoding='utf-8')
    print(f'{out.relative_to(ROOT)}  ({len(d["questions"])}문제)')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args == ['--all']:
        args = sorted(str(p) for p in (ROOT / 'quizzes').glob('*.json'))
    if not args:
        sys.exit(__doc__)
    for a in args:
        build(a)
