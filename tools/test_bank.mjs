// 문제 뱅크 자동 검사: node tools/test_bank.mjs
import { UNITS, generate } from '../bank/math.js';

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fr = (n, d = 1) => { if (d < 0){ n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
const ops = {
  '+': (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]),
  '−': (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]),
  '×': (a, b) => fr(a[0] * b[0], a[1] * b[1]),
  '÷': (a, b) => fr(a[0] * b[1], a[1] * b[0])
};
// 글자 → 분수값 (단위·쉼표 무시)
function val(t){
  t = t.trim().replace(/ ?(cm²|cm|m²|m|개|%)$/, '').replace(/,/g, '');
  let m;
  if ((m = /^\{(\d+)\|(\d+)\/(\d+)\}$/.exec(t))) return fr(+m[1] * +m[3] + +m[2], +m[3]);
  if ((m = /^\{(\d+)\/(\d+)\}$/.exec(t))) return fr(+m[1], +m[2]);
  if ((m = /^(\d+)(?:\.(\d+))?$/.exec(t))) { const f = m[2] || ''; return fr(Number(m[1] + f), 10 ** f.length); }
  return null;
}
const eq = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
const TOK = /\{(\d+)\|(\d+)\/(\d+)\}|\{(\d+)\/(\d+)\}/g;

let total = 0, checked = 0, problems = [];
for (const u of UNITS){
  for (let i = 0; i < 3000; i++){
    const q = u.gen(); total++;
    const all = [q.q, q.explain || '', ...q.choices].join(' ¦ ');
    const fail = msg => problems.push(`${u.label}: ${msg}\n   ${q.q.replace(/\n/g, ' ')} | ${q.choices.join(' / ')}`);
    if (q.choices.length < 2 || q.choices.length > 4) fail('보기 수');
    if (new Set(q.choices).size !== q.choices.length) fail('같은 보기');
    if (q.answer !== 1) fail('정답 번호');
    if (/NaN|undefined|Infinity|null|\[object/.test(all)) fail('이상한 글자');
    for (const m of all.matchAll(TOK)){
      if (m[1] !== undefined){ const [w, r, d] = [+m[1], +m[2], +m[3]]; if (!(w > 0 && r > 0 && d > 1 && r < d) && !(r === d)) fail('대분수 모양 ' + m[0]); }
      else { const [n, d] = [+m[4], +m[5]]; if (!(n > 0 && d > 1)) fail('분수 모양 ' + m[0]); }
    }
    // 보기 가운데 정답과 값이 같은 오답이 있으면 안 돼요
    const v0 = val(q.choices[0]);
    // 기약분수 문제는 '값은 같지만 약분이 덜 된 분수'가 오답이 될 수 있어요 (단, 그 오답은 기약분수가 아니어야 해요)
    const reduceQ = q.q.includes('기약분수로 나타내면');
    if (v0) q.choices.slice(1).forEach(c => {
      if (!eq(val(c), v0)) return;
      const m = /^\{(\d+)\/(\d+)\}$/.exec(c);
      if (reduceQ && m && gcd(+m[1], +m[2]) > 1) return;
      fail('정답과 같은 값의 오답 ' + c);
    });
    if (reduceQ){ const m = /^\{(\d+)\/(\d+)\}$/.exec(q.choices[0]); if (!m || gcd(+m[1], +m[2]) !== 1) fail('정답이 기약분수가 아님'); }
    // "A ○ B = ?" 꼴은 따로 계산해서 정답 확인
    const m = /^(\S+) ([+−×÷]) (\S+) = \?$/.exec(q.q);
    if (m){ const A = val(m[1]), B = val(m[3]); if (A && B){ checked++; if (!eq(ops[m[2]](A, B), v0)) fail('정답 계산 불일치'); } }
    const m2 = /^(\S+) ([+−×÷]) (\S+) ([+−×÷]) (\S+) = \?$/.exec(q.q);
    if (m2 && !q.q.includes('(')){
      const [a, o1, b, o2, c] = [val(m2[1]), m2[2], val(m2[3]), m2[4], val(m2[5])];
      const hi = o => o === '×' || o === '÷';
      const r = hi(o2) && !hi(o1) ? ops[o1](a, ops[o2](b, c)) : ops[o2](ops[o1](a, b), c);
      checked++; if (!eq(r, v0)) fail('혼합 계산 불일치');
    }
  }
}
const sample = generate(UNITS.filter(u => u.grade === 6).map(u => u.id), 40);
if (sample.length !== 40) problems.push('generate 개수 ' + sample.length);
console.log(`단원 ${UNITS.length}개 · 문제 ${total}개 · 따로 계산해서 확인 ${checked}개 · 문제점 ${problems.length}개`);
console.log([...new Set(problems)].slice(0, 25).join('\n'));
process.exit(problems.length ? 1 : 0);
