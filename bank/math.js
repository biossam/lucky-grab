// LUCKY GRAB · 3~6학년 연산 문제 뱅크
// 2022 개정 교육과정 교과서에 공통으로 나오는 연산 단원 이름으로 묶었어요.
// 출판사마다 단원 이름·순서가 조금 다를 수 있어요.
//
// 문제는 판마다 새 숫자로 만들어지고, 정답은 직접 계산해요.
// 오답 보기는 학생들이 자주 하는 실수(받아올림 빼먹기, 소수점 위치, 분모끼리 더하기 …)로 만들어요.
//
// 분수 표기: {3/4} = 4분의 3,  {2|1/3} = 2와 3분의 1   (게임 화면에서 위아래로 그려져요)

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const one = a => a[R(0, a.length - 1)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const N = n => n.toLocaleString('ko-KR');
const P10 = k => 10 ** k;

// 정수 v를 소수점 아래 s자리 수로 보고 글자로 (예: dec(242, 2) → "2.42")
function dec(v, s){
  const p = P10(s), w = Math.floor(v / p), f = v % p;
  const t = s ? String(f).padStart(s, '0').replace(/0+$/, '') : '';
  return N(w) + (t ? '.' + t : '');
}

// 분수
function F(n, d = 1){ const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
// 기약분수(필요하면 대분수)로
function fs(f, mixed = true){
  if (f.d === 1) return String(f.n);
  if (mixed && f.n > f.d) return `{${Math.floor(f.n / f.d)}|${f.n % f.d}/${f.d}}`;
  return `{${f.n}/${f.d}}`;
}
// 분모 b와 서로소인 분자 (교과서처럼 기약분수로 문제를 내요)
const co = b => { let a; do { a = R(1, b - 1); } while (gcd(a, b) !== 1); return a; };
const raw = (n, d) => `{${n}/${d}}`;                 // 약분하지 않은 분수
const mx = (w, r, d) => `{${w}|${r}/${d}}`;          // 대분수
// 약분하지 않고 대분수로 (4학년: 아직 약분을 배우지 않아요)
function mixRaw(n, d){ if (n < d) return raw(n, d); if (n % d === 0) return String(n / d); return mx(Math.floor(n / d), n % d, d); }

// 조사: 숫자를 읽었을 때 끝 글자에 받침이 있는지 (일·삼·육·칠·팔·십·백·천·만·억)
const bat = n => n % 10 === 0 || [1, 3, 6, 7, 8].includes(n % 10);
const j = (n, a, b) => bat(n) ? a : b;
// '으로/로': 받침이 ㄹ(일·칠·팔)이면 '로'
const ro = n => [1, 7, 8].includes(n % 10) ? '로' : bat(n) ? '으로' : '로';

const BAD = /NaN|undefined|Infinity|null|-\d/;
function Q(q, ans, wrongs, explain, near){
  const str = w => typeof w === 'number' ? N(w) : String(w);
  const out = [str(ans)];
  const add = w => { if (w === null || w === undefined || w === false) return; const s = str(w); if (!BAD.test(s) && !out.includes(s)) out.push(s); };
  for (const w of wrongs){ add(w); if (out.length === 4) break; }
  for (let k = 1; out.length < 4 && near && k < 40; k++) add(near(k));
  return { type: 'choice', q, choices: out.slice(0, 4), answer: 1, explain };
}
const qr = (q, r) => r ? `몫 ${q}, 나머지 ${r}` : `몫 ${q}`;

/* ================= 3학년 1학기 ================= */
function g31AddSub(){
  if (Math.random() < .5){
    let a, b;
    do { a = R(105, 899); b = R(105, 899); } while ((a % 10) + (b % 10) < 10 && (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) < 10);
    const s = a + b;
    let nc = 0, m = 1, x = a, y = b;
    while (x || y){ nc += ((x % 10 + y % 10) % 10) * m; m *= 10; x = Math.floor(x / 10); y = Math.floor(y / 10); }
    return Q(`${a} + ${b} = ?`, N(s), [N(nc), N(s - 10), N(s + 100), N(s + 10)], `받아올림에 주의해요. ${a} + ${b} = ${N(s)}`, k => N(s + 10 * k));
  }
  let a, b;
  do { a = R(301, 999); b = R(105, a - 20); } while (a % 10 >= b % 10 && Math.floor(a / 10) % 10 >= Math.floor(b / 10) % 10);
  const d = a - b;
  let ab = 0, m = 1, x = a, y = b;
  while (x || y){ ab += Math.abs(x % 10 - y % 10) * m; m *= 10; x = Math.floor(x / 10); y = Math.floor(y / 10); }
  return Q(`${a} − ${b} = ?`, N(d), [N(ab), N(d + 10), N(d - 10), N(d + 100)], `받아내림에 주의해요. ${a} − ${b} = ${N(d)}`, k => N(d + 10 * k));
}
function g31Div(){
  const b = R(2, 9), q = R(2, 9), a = b * q;
  if (Math.random() < .5)
    return Q(`${a} ÷ ${b} = ?`, q, [q + 1, q - 1, b, a - b], `${b} × ${q} = ${a} 이니까 ${a} ÷ ${b} = ${q}`, k => q + k + 1);
  return Q(`사탕 ${a}개를 ${b}명에게 똑같이 나누어 주면\n한 명에게 몇 개씩 줄 수 있을까요?`, `${q}개`, [`${q + 1}개`, `${q - 1}개`, `${b}개`, `${a - b}개`],
    `${a} ÷ ${b} = ${q} (${b} × ${q} = ${a})`, k => `${q + k + 1}개`);
}
function g31Mul(){
  let a, b;
  do { a = R(12, 98); b = R(2, 9); } while (a % 10 === 0 || (a % 10) * b < 10);
  const t = Math.floor(a / 10) * 10, o = a % 10, s = a * b;
  const nc = Math.floor(a / 10) * b * 10 + (o * b) % 10;
  return Q(`${a} × ${b} = ?`, s, [nc, s + 10, s - 10, s + b], `${t} × ${b} = ${t * b}, ${o} × ${b} = ${o * b} → 더하면 ${s}`, k => s + 10 * (k + 1));
}
function g31FracDec(){
  const t = R(0, 2);
  if (t === 0){
    let k; do { k = R(11, 49); } while (k % 10 === 0);
    return Q(`0.1이 ${k}개인 수는?`, dec(k, 1), [String(k), dec(k, 2), dec((k % 10) * 10 + Math.floor(k / 10), 1), dec(k + 10, 1)], `0.1이 10개면 1이에요. 0.1이 ${k}개면 ${dec(k, 1)}`);
  }
  if (t === 1){
    const k = R(1, 9);
    return Q(`${raw(k, 10)}${j(k, '을', '를')} 소수로 나타내면?`, `0.${k}`, [`0.0${k}`, String(k), `1.${k}`, `0.${10 - k}`], `${raw(k, 10)} = 0.${k}`);
  }
  let m; do { m = R(11, 99); } while (m % 10 === 0);
  return Q(`${m} mm는 몇 cm일까요?`, `${dec(m, 1)} cm`, [`${m} cm`, `${dec(m, 2)} cm`, `${Math.floor(m / 10)} cm`, `${dec(m + 10, 1)} cm`], `1 mm = 0.1 cm 이니까 ${m} mm = ${dec(m, 1)} cm`);
}

/* ================= 3학년 2학기 ================= */
function g32Mul(){
  if (Math.random() < .45){
    const a = R(123, 899), b = R(3, 9), s = a * b;
    return Q(`${a} × ${b} = ?`, N(s), [N(s + 10), N(s - 10), N(s + 100), N(s - 100)], `${a} × ${b} = ${N(s)}`, k => N(s + 10 * (k + 1)));
  }
  let a, b;
  do { a = R(12, 98); b = R(12, 98); } while (b % 10 === 0);
  const s = a * b, bt = Math.floor(b / 10), bo = b % 10, forget = a * bo + a * bt;
  return Q(`${a} × ${b} = ?`, N(s), [N(forget), N(s + 10), N(s - 10), N(s + 100)],
    `${a} × ${bo} = ${a * bo}, ${a} × ${bt * 10} = ${N(a * bt * 10)} → 더하면 ${N(s)}`, k => N(s + 10 * (k + 1)));
}
function g32Div(){
  if (Math.random() < .55){
    const b = R(3, 9), r = R(1, b - 1), q = R(3, Math.floor((99 - r) / b)), a = b * q + r;
    return Q(`${a} ÷ ${b}의 몫과 나머지는?`, qr(q, r),
      [qr(q - 1, r + b), qr(q + 1, r), qr(q, r + 1 < b ? r + 1 : r - 1), qr(r, q)],
      `${b} × ${q} = ${b * q}, ${a} − ${b * q} = ${r}  (나머지는 나누는 수 ${b}보다 작아야 해요)`);
  }
  const b = R(2, 9), q = R(Math.ceil(100 / b), Math.floor(999 / b)), a = b * q;
  return Q(`${a} ÷ ${b} = ?`, q, [q + 1, q - 1, q + 10, q - 10], `${b} × ${q} = ${a}`, k => q + 10 * (k + 1));
}
function g32Frac(){
  const t = R(0, 3), b = R(3, 9), m = R(2, 9), a = b * m;
  if (t === 0) return Q(`${a}의 ${raw(1, b)}은 얼마일까요?`, m, [b, m + 1, m * 2, a - m], `${a}${j(a, '을', '를')} 똑같이 ${b}묶음으로 나누면 한 묶음은 ${m}`);
  if (t === 1){
    const c = R(2, b - 1);
    return Q(`${a}의 ${raw(c, b)}${j(c, '은', '는')} 얼마일까요?`, m * c, [m, m * (c + 1), a - c, m * c + 1], `${a}의 ${raw(1, b)}은 ${m}, ${raw(c, b)}${j(c, '은', '는')} ${m} × ${c} = ${m * c}`);
  }
  if (t === 2){
    const d = R(2, 9); let n; do { n = R(d + 1, d * 4); } while (n % d === 0);
    const w = Math.floor(n / d), r = n % d;
    return Q(`${raw(n, d)}${j(n, '을', '를')} 대분수로 나타내면?`, mx(w, r, d),
      [mx(w + 1, r, d), d - r !== r ? mx(w, d - r, d) : null, w > 1 ? mx(w - 1, r, d) : null, raw(r, d)],
      `${n} ÷ ${d} = ${w} … ${r} 이니까 ${mx(w, r, d)}`, k => mx(w + k + 1, r, d));
  }
  const w = R(1, 4), d = R(3, 9), r = R(1, d - 1), n = w * d + r;
  return Q(`${mx(w, r, d)}${j(r, '을', '를')} 가분수로 나타내면?`, raw(n, d),
    [raw(w * r + d, d), raw(w * d, d), raw(n + 1, d), raw(n + d, d)], `${w} × ${d} + ${r} = ${n} 이니까 ${raw(n, d)}`, k => raw(n + k + 1, d));
}

/* ================= 4학년 1학기 ================= */
function g41Big(){
  const t = R(0, 2);
  if (t === 0){
    const a = R(12, 9999);
    return Q(`만이 ${N(a)}개인 수는?`, N(a * 10000), [N(a * 1000), N(a * 100000), N(a * 100), N(a * 1000000)], `만이 ${N(a)}개인 수는 ${N(a)}만 = ${N(a * 10000)}`);
  }
  if (t === 1){
    let digits, p, d;
    do {
      digits = Array.from({ length: 8 }, (_, i) => i === 0 ? R(1, 9) : R(0, 9));
      p = R(1, 7); d = digits[7 - p];
    } while (d === 0 || digits.filter(x => x === d).length > 1);
    const n = Number(digits.join(''));
    const names = { 1: '십', 2: '백', 3: '천', 4: '만', 5: '십만', 6: '백만', 7: '천만' };
    return Q(`${N(n)}에서 숫자 ${d}${j(d, '이', '가')} 나타내는 값은?`, N(d * P10(p)),
      [N(d * P10(p - 1)), N(d * P10(p + 1)), N(d * P10(p + 2)), String(d)], `${d}${j(d, '은', '는')} ${names[p]}의 자리 숫자라서 ${N(d * P10(p))}`);
  }
  const a = R(2, 99), b = R(100, 9999), v = a * 1e8 + b * 1e4;
  return Q(`억이 ${a}개, 만이 ${N(b)}개인 수는?`, N(v), [N(a * 1e8 + b * 1e3), N(a * 1e7 + b * 1e4), N(a * 1e9 + b * 1e4), N(a * 1e8 + b)], `${a}억 ${N(b)}만 = ${N(v)}`);
}
function g41MulDiv(){
  if (Math.random() < .5){
    let a, b; do { a = R(123, 999); b = R(12, 99); } while (b % 10 === 0);
    const s = a * b, bt = Math.floor(b / 10), bo = b % 10;
    return Q(`${a} × ${b} = ?`, N(s), [N(a * bo + a * bt), N(s + 100), N(s - 100), N(s + 1000)],
      `${a} × ${bo} = ${N(a * bo)}, ${a} × ${bt * 10} = ${N(a * bt * 10)} → 더하면 ${N(s)}`, k => N(s + 100 * (k + 1)));
  }
  const b = R(12, 99), r = R(0, b - 1), q = R(2, Math.floor((999 - r) / b)), a = b * q + r;
  return Q(`${a} ÷ ${b}의 몫과 나머지는?`, qr(q, r),
    [q > 1 ? qr(q - 1, r + b) : null, qr(q + 1, r), qr(q, (r + 1) % b), qr(q + 10, r)],
    `${b} × ${q} = ${N(b * q)}, ${a} − ${N(b * q)} = ${r}`);
}

/* ================= 4학년 2학기 ================= */
function g42Frac(){
  const d = R(4, 12), t = R(0, 2);
  if (t === 0){
    const a = R(1, d - 1), b = R(1, d - 1), s = a + b;
    return Q(`${raw(a, d)} + ${raw(b, d)} = ?`, mixRaw(s, d), [raw(s, d + d), mixRaw(s + 1, d), s > 1 ? mixRaw(s - 1, d) : null, raw(a + b, d) === mixRaw(s, d) ? null : mixRaw(s + 2, d)],
      `분모는 그대로 두고 분자끼리 더해요. ${a} + ${b} = ${s} → ${mixRaw(s, d)}`, k => mixRaw(s + k + 2, d));
  }
  if (t === 1){
    const w1 = R(2, 6), r1 = R(1, d - 2), w2 = R(1, w1 - 1), r2 = R(r1 + 1, d - 1);
    const n = (w1 * d + r1) - (w2 * d + r2);
    return Q(`${mx(w1, r1, d)} − ${mx(w2, r2, d)} = ?`, mixRaw(n, d), [mx(w1 - w2, r2 - r1, d), mixRaw(n + 1, d), n > 1 ? mixRaw(n - 1, d) : null, mixRaw(n + d, d)],
      `분수 부분끼리 뺄 수 없으면 자연수 1을 ${raw(d, d)}로 바꿔서 빼요. 답: ${mixRaw(n, d)}`, k => mixRaw(n + k + 1, d));
  }
  const k = R(2, 6), a = R(1, d - 1), n = k * d - a;
  return Q(`${k} − ${raw(a, d)} = ?`, mixRaw(n, d), [mx(k - 1, a, d), mixRaw(n + 1, d), mixRaw(n - 1, d), mixRaw(n + d, d)],
    `${k}${j(k, '을', '를')} ${mx(k - 1, d, d)}로 생각하고 빼요. 답: ${mixRaw(n, d)}`, x => mixRaw(n + x + 1, d));
}
function g42Dec(){
  const t = R(0, 2);
  if (t === 0){
    let a, b; do { a = R(101, 999); b = R(1, 99); } while (a % 10 === 0 || b % 10 === 0);
    const s = a + b * 10;
    return Q(`${dec(a, 2)} + ${dec(b, 1)} = ?`, dec(s, 2), [dec(a + b, 2), dec(s + 10, 2), dec(s - 10, 2), dec(s + 100, 2)],
      `소수점끼리 맞추어 계산해요. ${dec(a, 2)} + ${dec(b * 10, 2)} = ${dec(s, 2)}`, k => dec(s + 10 * (k + 1), 2));
  }
  if (t === 1){
    let a, b; do { a = R(200, 999); b = R(1, Math.floor(a / 10) - 1); } while (a % 10 === 0 || b % 10 === 0);
    const s = a - b * 10;
    return Q(`${dec(a, 2)} − ${dec(b, 1)} = ?`, dec(s, 2), [a - b > 0 ? dec(a - b, 2) : null, dec(s + 10, 2), s > 10 ? dec(s - 10, 2) : null, dec(s + 100, 2)],
      `소수점끼리 맞추어 계산해요. ${dec(a, 2)} − ${dec(b * 10, 2)} = ${dec(s, 2)}`, k => dec(s + 10 * (k + 1), 2));
  }
  let a, b; do { a = R(101, 899); b = R(101, 899); } while ((a % 10) + (b % 10) < 10 || a % 10 === 0 || b % 10 === 0);
  const s = a + b;
  return Q(`${dec(a, 2)} + ${dec(b, 2)} = ?`, dec(s, 2), [dec(s - 10, 2), dec(s + 10, 2), dec(s - 100, 2), dec(s + 100, 2)], `${dec(a, 2)} + ${dec(b, 2)} = ${dec(s, 2)}`, k => dec(s + 10 * (k + 1), 2));
}

/* ================= 5학년 1학기 ================= */
function g51Mixed(){
  const t = R(0, 3);
  if (t === 0){
    const a = R(2, 30), b = R(2, 9), c = R(2, 9), s = a + b * c;
    return Q(`${a} + ${b} × ${c} = ?`, s, [(a + b) * c, s + c, s - 1, s + 1], `곱셈을 먼저 해요. ${b} × ${c} = ${b * c}, ${a} + ${b * c} = ${s}`, k => s + k + 1);
  }
  if (t === 1){
    const a = R(2, 20), b = R(2, 9), c = R(2, 9), s = (a + b) * c;
    return Q(`(${a} + ${b}) × ${c} = ?`, s, [a + b * c, s + c, s - c, s + 1], `( ) 안을 먼저 해요. ${a} + ${b} = ${a + b}, ${a + b} × ${c} = ${s}`, k => s + k + 1);
  }
  if (t === 2){
    const c = R(2, 9), k = R(2, 9), b = c * k, a = b + c * R(1, 5), s = a - k;
    return Q(`${a} − ${b} ÷ ${c} = ?`, s, [(a - b) / c, s + 1, s - 1, a - b], `나눗셈을 먼저 해요. ${b} ÷ ${c} = ${k}, ${a} − ${k} = ${s}`, x => s + x + 1);
  }
  let a, b, c, d; do { a = R(2, 9); b = R(2, 9); c = R(2, 9); d = R(2, 9); } while (a * b <= c * d || (a * b - c) * d <= 0);
  const s = a * b - c * d;
  return Q(`${a} × ${b} − ${c} × ${d} = ?`, s, [(a * b - c) * d, s + 1, s - 1, s + d], `곱셈을 먼저 해요. ${a * b} − ${c * d} = ${s}`, k => s + k + 1);
}
function g51Factor(){
  const t = R(0, 3);
  const coprime = () => { let x, y; do { x = R(2, 9); y = R(2, 9); } while (x === y || gcd(x, y) !== 1); return [x, y]; };
  if (t === 0){
    const g = R(2, 12), [x, y] = coprime(), a = g * x, b = g * y;
    const divs = []; for (let i = 2; i < g; i++) if (g % i === 0) divs.push(i);
    return Q(`${a}${j(a, '과', '와')} ${b}의 최대공약수는?`, g, [divs.length ? divs[divs.length - 1] : null, lcm(a, b), x * y, Math.abs(a - b), g * 2],
      `${a} = ${g} × ${x}, ${b} = ${g} × ${y} → 최대공약수 ${g}`);
  }
  if (t === 1){
    const g = R(2, 6), [x, y] = coprime(), a = g * x, b = g * y, l = g * x * y;
    return Q(`${a}${j(a, '과', '와')} ${b}의 최소공배수는?`, l, [a * b, g, l * 2, l + g], `${a} = ${g} × ${x}, ${b} = ${g} × ${y} → 최소공배수 ${g} × ${x} × ${y} = ${l}`);
  }
  if (t === 2){
    const n = R(12, 60); const ds = []; for (let i = 1; i <= n; i++) if (n % i === 0) ds.push(i);
    const c = ds.length;
    return Q(`${n}의 약수는 모두 몇 개일까요?`, `${c}개`, [`${c - 1}개`, `${c + 1}개`, `${c + 2}개`, c > 2 ? `${c - 2}개` : null], `${n}의 약수: ${ds.join(', ')}`);
  }
  const k = R(3, 9), ms = new Set(); while (ms.size < 3) ms.add(k * R(2, 12));
  let no; do { no = R(k + 1, k * 12); } while (no % k === 0);
  return Q(`다음 중 ${k}의 배수가 아닌 것은?`, no, [...ms], `${no} ÷ ${k}${j(k, '은', '는')} 나누어떨어지지 않아요.`);
}
function g51Reduce(){
  const t = R(0, 2);
  if (t === 0){
    let x, y; do { x = R(1, 8); y = R(2, 9); } while (x >= y || gcd(x, y) !== 1);
    const g = R(2, 8), a = x * g, b = y * g;
    let part = null; for (let k = 2; k < g; k++) if (g % k === 0){ part = raw(a / k, b / k); break; }
    return Q(`${raw(a, b)}${j(a, '을', '를')} 기약분수로 나타내면?`, raw(x, y), [part, raw(x, y + 1), x + 1 < y ? raw(x + 1, y) : null, raw(x, y + 2)],
      `분모와 분자를 최대공약수 ${g}${ro(g)} 나누면 ${raw(x, y)}`, k => raw(x, y + k + 1));
  }
  let b, d; do { b = R(2, 12); d = R(2, 12); } while (b === d || b % d === 0 || d % b === 0);
  const a = co(b), c = co(d);
  if (t === 1){
    const l = lcm(b, d);
    return Q(`${raw(a, b)}${j(a, '과', '와')} ${raw(c, d)}${j(c, '을', '를')} 가장 작은 공통분모로 통분하면\n공통분모는?`, l, [b * d !== l ? b * d : null, b + d, Math.max(b, d), l * 2],
      `${b}${j(b, '과', '와')} ${d}의 최소공배수 ${l}${j(l, '이', '가')} 가장 작은 공통분모예요.`, k => l * (k + 2));
  }
  const v1 = a * d, v2 = c * b;
  if (v1 === v2) return g51Reduce();
  const big = v1 > v2 ? raw(a, b) : raw(c, d), small = v1 > v2 ? raw(c, d) : raw(a, b), l = lcm(b, d);
  return Q(`${raw(a, b)}${j(a, '과', '와')} ${raw(c, d)} 중 더 큰 분수는?`, big, [small, '두 분수의 크기가 같아요'],
    `통분하면 ${raw(a * l / b, l)}${j(a * l / b, '과', '와')} ${raw(c * l / d, l)} → 더 큰 분수는 ${big}`);
}
function g51FracAdd(){
  let b, d; do { b = R(2, 9); d = R(2, 9); } while (b === d);
  let a = co(b), c = co(d);
  const l = lcm(b, d);
  const t = R(0, 2);
  if (t === 0){
    const s = F(a * d + c * b, b * d);
    return Q(`${raw(a, b)} + ${raw(c, d)} = ?`, fs(s), [raw(a + c, b + d), fs(F(a + c, l)), fs(F(s.n + 1, s.d)), fs(F(s.n * 2, s.d))],
      `통분해서 더해요. ${raw(a * l / b, l)} + ${raw(c * l / d, l)} = ${fs(s)}`, k => fs(F(s.n + k + 1, s.d)));
  }
  if (t === 1){
    if (a * d < c * b){ [b, d] = [d, b]; [a, c] = [c, a]; }
    if (a * d === c * b) return g51FracAdd();
    const s = F(a * d - c * b, b * d);
    return Q(`${raw(a, b)} − ${raw(c, d)} = ?`, fs(s), [a > c && b - d > 1 ? raw(a - c, b - d) : null, a > c ? fs(F(a - c, l)) : null, fs(F(s.n + 1, s.d)), fs(F(s.n * 2, s.d)), raw(a + c, b + d)],
      `통분해서 빼요. ${raw(a * l / b, l)} − ${raw(c * l / d, l)} = ${fs(s)}`, k => fs(F(s.n + k + 1, s.d)));
  }
  const w1 = R(1, 3), w2 = R(1, 3);
  const s = F((w1 * b + a) * d + (w2 * d + c) * b, b * d);
  return Q(`${mx(w1, a, b)} + ${mx(w2, c, d)} = ?`, fs(s), [mx(w1 + w2, a + c, b + d), fs(F(s.n + s.d, s.d)), fs(F(s.n - s.d, s.d)), fs(F(s.n + 1, s.d))],
    `자연수끼리, 분수끼리 통분해서 더해요. 답: ${fs(s)}`, k => fs(F(s.n + k + 1, s.d)));
}

/* ================= 5학년 2학기 ================= */
function g52Round(){
  if (Math.random() < .3){
    const x = R(20, 60), y = x + R(5, 15), ok = R(x, y - 1);
    return Q(`${x} 이상 ${y} 미만인 수는 어느 것일까요?`, ok, [y, x - 1, y + R(1, 5), x - R(2, 6)], `${x} 이상은 ${x}${j(x, '을', '를')} 포함하고, ${y} 미만은 ${y}${j(y, '을', '를')} 포함하지 않아요.`);
  }
  const place = one([10, 100, 1000]), pname = { 10: '십', 100: '백', 1000: '천' }[place];
  let n; do { n = R(1012, 9988); } while (n % 10 === 0 || n % place === 0);
  const up = Math.ceil(n / place) * place, down = Math.floor(n / place) * place, near = Math.round(n / place) * place;
  const mode = one(['올림', '버림', '반올림']);
  const ans = { 올림: up, 버림: down, 반올림: near }[mode];
  const other = place === 1000 ? 100 : place * 10;
  const alt = { 올림: Math.ceil(n / other) * other, 버림: Math.floor(n / other) * other, 반올림: Math.round(n / other) * other }[mode];
  return Q(`${N(n)}${j(n, '을', '를')} ${pname}의 자리까지 ${mode}하면?`, N(ans), [N(up), N(down), N(near), N(alt)],
    `${pname}의 자리 아래 수를 ${mode === '올림' ? '올려요' : mode === '버림' ? '버려요' : '보고 5 이상이면 올리고 4 이하면 버려요'} → ${N(ans)}`, k => N(ans + place * (k + 1)));
}
function g52FracMul(){
  const t = R(0, 2);
  if (t === 0){
    const b = R(3, 9), a = co(b), k = R(2, 9), s = F(a * k, b);
    return Q(`${raw(a, b)} × ${k} = ?`, fs(s), [raw(a * k, b * k), fs(F(a, b * k)), fs(F(a * k + 1, b)), fs(F(a * k + b, b))],
      `분자에 자연수를 곱해요. ${raw(a * k, b)}${raw(a * k, b) !== fs(s) ? ' = ' + fs(s) : ''}`, x => fs(F(a * k + x + 1, b)));
  }
  if (t === 1){
    const b = R(2, 9), a = co(b), d = R(2, 9), c = co(d), s = F(a * c, b * d);
    return Q(`${raw(a, b)} × ${raw(c, d)} = ?`, fs(s), [fs(F(a * d, b * c)), raw(a + c, b + d), fs(F(a * c, b + d)), fs(F(a * c + 1, b * d))],
      `분자끼리, 분모끼리 곱해요. ${raw(a * c, b * d)}${raw(a * c, b * d) !== fs(s) ? ' = ' + fs(s) : ''}`, x => fs(F(a * c + x + 1, b * d)));
  }
  const w = R(1, 3), d = R(2, 6), r = co(d), k = R(2, 5), s = F((w * d + r) * k, d);
  return Q(`${mx(w, r, d)} × ${k} = ?`, fs(s), [mx(w * k, r, d), fs(F((w * d + r) * k + 1, d)), fs(F((w * d + r) * k - 1, d)), fs(F((w * d + r) * k + d, d))],
    `대분수를 가분수 ${raw(w * d + r, d)}로 바꿔서 곱해요. 답: ${fs(s)}`, x => fs(F((w * d + r) * k + x + 2, d)));
}
function g52DecMul(){
  if (Math.random() < .5){
    let x; do { x = R(11, 99); } while (x % 10 === 0);
    const k = R(2, 9), p = x * k;
    return Q(`${dec(x, 1)} × ${k} = ?`, dec(p, 1), [dec(p, 2), String(p), dec(p + k, 1), dec(p + 10, 1)], `${x} × ${k} = ${p} 이고 소수 한 자리라서 ${dec(p, 1)}`, a => dec(p + 10 * (a + 1), 1));
  }
  let x, y; do { x = R(12, 99); y = R(2, 9); } while (x % 10 === 0);
  const p = x * y;
  return Q(`${dec(x, 1)} × ${dec(y, 1)} = ?`, dec(p, 2), [dec(p, 1), dec(p, 3), dec(p + 10, 2), dec(p * 10, 2)],
    `${x} × ${y} = ${p} 이고 소수점 아래 자리 수가 1 + 1 = 2자리라서 ${dec(p, 2)}`, a => dec(p + 10 * (a + 1), 2));
}

/* ================= 6학년 1학기 ================= */
function g61FracDiv(){
  const t = R(0, 2);
  if (t === 0){
    const b = R(2, 9), a = R(1, b + 3), k = R(2, 9);
    if (a === b || gcd(a, b) !== 1) return g61FracDiv();
    const s = F(a, b * k);
    return Q(`${raw(a, b)} ÷ ${k} = ?`, fs(s), [fs(F(a * k, b)), fs(F(a, b + k)), fs(F(a + 1, b * k)), fs(F(a * 2, b * k))],
      `${raw(a, b)} ÷ ${k} = ${raw(a, b)} × ${raw(1, k)} = ${fs(s)}`, x => fs(F(a + x + 1, b * k)));
  }
  if (t === 1){
    let m, n; do { m = R(1, 15); n = R(2, 9); } while (m % n === 0);
    const s = F(m, n);
    return Q(`${m} ÷ ${n}의 몫을 분수로 나타내면?`, fs(s), [fs(F(n, m)), fs(F(m + 1, n)), fs(F(m, n + 1)), raw(m, m * n)],
      `${m} ÷ ${n} = ${raw(m, n)}${raw(m, n) !== fs(s) ? ' = ' + fs(s) : ''}`, x => fs(F(m + x + 1, n)));
  }
  const w = R(1, 3), d = R(2, 6), r = co(d), k = R(2, 6), s = F(w * d + r, d * k);
  return Q(`${mx(w, r, d)} ÷ ${k} = ?`, fs(s), [fs(F((w * d + r) * k, d)), fs(F(w * d + r, d + k)), fs(F(w * d + r + 1, d * k)), mx(w, r, d * k)],
    `가분수로 바꾸면 ${raw(w * d + r, d)} ÷ ${k} = ${raw(w * d + r, d)} × ${raw(1, k)} = ${fs(s)}`, x => fs(F(w * d + r + x + 1, d * k)));
}
function g61DecDiv(){
  if (Math.random() < .55){
    let q; do { q = R(101, 999); } while (q % 10 === 0);
    const k = R(2, 9), x = q * k;
    return Q(`${dec(x, 2)} ÷ ${k} = ?`, dec(q, 2), [dec(q, 1), dec(q, 3), dec(q + 10, 2), dec(q * 10, 2)], `${dec(x, 2)} ÷ ${k} = ${dec(q, 2)} (${dec(q, 2)} × ${k} = ${dec(x, 2)})`, a => dec(q + 10 * (a + 1), 2));
  }
  const w = R(1, 9), r = R(1, 9), q = w * 100 + r, k = R(2, 9), x = q * k;
  return Q(`${dec(x, 2)} ÷ ${k} = ?`, dec(q, 2), [dec(w * 10 + r, 1), dec(q, 3), dec(q + 10, 2), dec(q * 10, 2)],
    `몫의 소수 첫째 자리에 0을 써야 해요. ${dec(x, 2)} ÷ ${k} = ${dec(q, 2)}`, a => dec(q + 10 * (a + 1), 2));
}
function g61Ratio(){
  const t = R(0, 2);
  if (t === 0){
    const b = one([4, 5, 10, 20, 25, 50]), a = R(1, b - 1), p = a * 100 / b;
    return Q(`${b}에 대한 ${a}의 비율을 백분율로 나타내면?`, `${p}%`, [`${a}%`, `${100 - p}%`, `${Math.round(b * 100 / a)}%`, `${p / 10}%`],
      `${raw(a, b)} × 100 = ${p}%`, k => `${p + 5 * k}%`);
  }
  if (t === 1){
    const b = one([2, 4, 5, 8, 10, 20, 25]), a = R(1, b - 1), v = a * 1000 / b;
    return Q(`${a} : ${b}의 비율을 소수로 나타내면?`, dec(v, 3), [dec(Math.round(b * 1000 / a), 3), `${a}.${b}`, dec(v + 100, 3), dec(v * 10, 3)],
      `비율 = 비교하는 양 ÷ 기준량 = ${a} ÷ ${b} = ${dec(v, 3)}`, k => dec(v + 50 * k, 3));
  }
  let a, b; do { a = R(1, 11); b = R(2, 12); } while (a >= b);
  const s = F(a, b);
  return Q(`${a} : ${b}의 비율을 기약분수로 나타내면?`, fs(s, false), [fs(F(b, a), false), raw(a, a + b), fs(F(a + 1, b), false), fs(F(a, b + 1), false)],
    `비율 = ${a} ÷ ${b} = ${raw(a, b)}${raw(a, b) !== fs(s, false) ? ' = ' + fs(s, false) : ''}`);
}

/* ================= 6학년 2학기 ================= */
function g62FracDiv(){
  const t = R(0, 2);
  if (t === 0){
    const b = R(2, 9), a = co(b), d = R(2, 9), c = co(d);
    if (a * d === b * c) return g62FracDiv();
    const s = F(a * d, b * c);
    return Q(`${raw(a, b)} ÷ ${raw(c, d)} = ?`, fs(s), [fs(F(a * c, b * d)), fs(F(b * c, a * d)), fs(F(a * d + 1, b * c)), fs(F(a * d, b * c + 1))],
      `나누는 분수의 분모와 분자를 바꾸어 곱해요. ${raw(a, b)} × ${c === 1 ? d : raw(d, c)} = ${fs(s)}`, x => fs(F(a * d + x + 1, b * c)));
  }
  if (t === 1){
    const d = R(5, 13); let a, c; do { a = co(d); c = co(d); } while (a === c);
    const s = F(a, c);
    return Q(`${raw(a, d)} ÷ ${raw(c, d)} = ?`, fs(s), [fs(F(c, a)), fs(F(a * c, d * d)), fs(F(a + 1, c)), raw(a, d)],
      `분모가 같으면 분자끼리 나눠요. ${a} ÷ ${c} = ${fs(s)}`, x => fs(F(a + x + 1, c)));
  }
  const k = R(2, 9), d = R(2, 9), c = co(d), s = F(k * d, c);
  return Q(`${k} ÷ ${raw(c, d)} = ?`, fs(s), [fs(F(k * c, d)), fs(F(k, c * d)), fs(F(k * d + 1, c)), fs(F(k * d, c + 1))],
    `${k} × ${c === 1 ? d : raw(d, c)} = ${fs(s)}`, x => fs(F(k * d + x + 1, c)));
}
function g62DecDiv(){
  const t = R(0, 2);
  if (t === 0){
    const y = R(2, 9), q = R(11, 99), x = q * y;
    return Q(`${dec(x, 2)} ÷ ${dec(y, 1)} = ?`, dec(q, 1), [dec(q, 2), String(q), dec(q + y, 1), dec(q + 10, 1)],
      `두 수에 10을 곱해도 몫은 같아요. ${dec(x, 1)} ÷ ${y} = ${dec(q, 1)}`, a => dec(q + 10 * (a + 1), 1));
  }
  if (t === 1){
    let y, m; do { y = one([2, 4, 5, 8]); m = R(2, 60); } while ((m * y) % 10 !== 0);
    const k = m * y / 10;
    return Q(`${k} ÷ ${dec(y, 1)} = ?`, m, [dec(m, 1), m * 10, m + y, m * 2], `${k * 10} ÷ ${y} = ${m}`, a => m + a + 1);
  }
  let a, b; do { a = R(5, 40); b = one([3, 6, 7, 9]); } while (a % b === 0 || (a * 10) % b === 0);
  const r = Math.floor((20 * a + b) / (2 * b)), fl = Math.floor(a * 10 / b), r2 = Math.floor((200 * a + b) / (2 * b));
  return Q(`${a} ÷ ${b}의 몫을 반올림하여\n소수 첫째 자리까지 나타내면?`, dec(r, 1), [r !== fl ? dec(fl, 1) : dec(fl + 1, 1), dec(r2, 2), dec(r + 1, 1), dec(r * 10, 1)],
    `${a} ÷ ${b} = ${dec(r2, 2)}… → 소수 둘째 자리에서 반올림하면 ${dec(r, 1)}`, x => dec(r + x + 1, 1));
}
function g62Prop(){
  const t = R(0, 2);
  if (t === 0){
    const a = R(2, 9), b = R(2, 12), k = R(2, 6), c = a * k, ans = b * k;
    if (a === b) return g62Prop();
    return Q(`${a} : ${b} = ${c} : □\n□ 안에 알맞은 수는?`, ans, [b + c - a, ans + k, ans - k, c], `${a} × ${k} = ${c} 이니까 □ = ${b} × ${k} = ${ans}`, x => ans + x + 1);
  }
  if (t === 1){
    let a, b; do { a = R(1, 5); b = R(1, 5); } while (a === b);
    const u = R(2, 20), T = u * (a + b), ans = u * a;
    return Q(`${T}${j(T, '을', '를')} ${a} : ${b}${ro(b)} 비례배분하면\n앞의 수는 얼마일까요?`, ans, [u * b, T % 2 === 0 ? T / 2 : null, ans + u, T - a], `${T} × ${raw(a, a + b)} = ${ans}`, x => ans + x + 1);
  }
  const a = R(2, 9), b = R(2, 9), k = R(2, 5), c = a * k, d = b * k;
  return Q(`비례식 ${a} : ${b} = ${c} : ${d}에서\n외항의 곱은 얼마일까요?`, a * d, [a * c, b * d, a + d, c * d], `외항은 ${a}${j(a, '과', '와')} ${d} → ${a} × ${d} = ${a * d} (내항의 곱 ${b} × ${c}${j(c, '과', '와')} 같아요)`, x => a * d + x + 1);
}
function g62Circle(){
  const t = R(0, 3), r = R(2, 15), d = r * 2;
  if (t === 0) return Q(`반지름이 ${r} cm인 원의 원주는? (원주율 3.14)`, `${dec(628 * r, 2)} cm`, [`${dec(314 * r, 2)} cm`, `${dec(314 * r * r, 2)} cm`, `${dec(1256 * r, 2)} cm`],
    `원주 = 지름 × 원주율 = ${d} × 3.14 = ${dec(628 * r, 2)} (cm)`);
  if (t === 1) return Q(`지름이 ${d} cm인 원의 넓이는? (원주율 3.14)`, `${dec(314 * r * r, 2)} cm²`, [`${dec(314 * d * d, 2)} cm²`, `${dec(314 * d, 2)} cm²`, `${dec(314 * r, 2)} cm²`],
    `반지름은 ${r} cm예요. ${r} × ${r} × 3.14 = ${dec(314 * r * r, 2)} (cm²)`);
  if (t === 2) return Q(`반지름이 ${r} cm인 원의 넓이는? (원주율 3.14)`, `${dec(314 * r * r, 2)} cm²`, [`${dec(628 * r, 2)} cm²`, `${dec(314 * d * d, 2)} cm²`, `${dec(314 * r, 2)} cm²`],
    `${r} × ${r} × 3.14 = ${dec(314 * r * r, 2)} (cm²)`);
  return Q(`원주가 ${dec(314 * d, 2)} cm인 원의 지름은? (원주율 3.14)`, `${d} cm`, [`${r} cm`, `${d * 2} cm`, `${d + 1} cm`], `지름 = 원주 ÷ 원주율 = ${dec(314 * d, 2)} ÷ 3.14 = ${d} (cm)`);
}

export const UNITS = [
  { id: '3-1-addsub', grade: 3, sem: 1, name: '덧셈과 뺄셈', gen: g31AddSub },
  { id: '3-1-div', grade: 3, sem: 1, name: '나눗셈', gen: g31Div },
  { id: '3-1-mul', grade: 3, sem: 1, name: '곱셈', gen: g31Mul },
  { id: '3-1-fracdec', grade: 3, sem: 1, name: '분수와 소수', gen: g31FracDec },
  { id: '3-2-mul', grade: 3, sem: 2, name: '곱셈', gen: g32Mul },
  { id: '3-2-div', grade: 3, sem: 2, name: '나눗셈', gen: g32Div },
  { id: '3-2-frac', grade: 3, sem: 2, name: '분수', gen: g32Frac },
  { id: '4-1-big', grade: 4, sem: 1, name: '큰 수', gen: g41Big },
  { id: '4-1-muldiv', grade: 4, sem: 1, name: '곱셈과 나눗셈', gen: g41MulDiv },
  { id: '4-2-frac', grade: 4, sem: 2, name: '분수의 덧셈과 뺄셈', gen: g42Frac },
  { id: '4-2-dec', grade: 4, sem: 2, name: '소수의 덧셈과 뺄셈', gen: g42Dec },
  { id: '5-1-mixed', grade: 5, sem: 1, name: '자연수의 혼합 계산', gen: g51Mixed },
  { id: '5-1-factor', grade: 5, sem: 1, name: '약수와 배수', gen: g51Factor },
  { id: '5-1-reduce', grade: 5, sem: 1, name: '약분과 통분', gen: g51Reduce },
  { id: '5-1-fracadd', grade: 5, sem: 1, name: '분수의 덧셈과 뺄셈', gen: g51FracAdd },
  { id: '5-2-round', grade: 5, sem: 2, name: '수의 범위와 어림하기', gen: g52Round },
  { id: '5-2-fracmul', grade: 5, sem: 2, name: '분수의 곱셈', gen: g52FracMul },
  { id: '5-2-decmul', grade: 5, sem: 2, name: '소수의 곱셈', gen: g52DecMul },
  { id: '6-1-fracdiv', grade: 6, sem: 1, name: '분수의 나눗셈', gen: g61FracDiv },
  { id: '6-1-decdiv', grade: 6, sem: 1, name: '소수의 나눗셈', gen: g61DecDiv },
  { id: '6-1-ratio', grade: 6, sem: 1, name: '비와 비율', gen: g61Ratio },
  { id: '6-2-fracdiv', grade: 6, sem: 2, name: '분수의 나눗셈', gen: g62FracDiv },
  { id: '6-2-decdiv', grade: 6, sem: 2, name: '소수의 나눗셈', gen: g62DecDiv },
  { id: '6-2-prop', grade: 6, sem: 2, name: '비례식과 비례배분', gen: g62Prop },
  { id: '6-2-circle', grade: 6, sem: 2, name: '원의 넓이', gen: g62Circle }
].map(u => ({ ...u, label: `${u.grade}-${u.sem} ${u.name}` }));

// 고른 단원에서 돌아가며 n문제를 만들어요 (같은 문제는 한 번만)
export function generate(ids, n = 40){
  const us = UNITS.filter(u => ids.includes(u.id));
  if (!us.length) return [];
  const out = [], seen = new Set();
  for (let guard = 0; out.length < n && guard < n * 30; guard++){
    const u = us[out.length % us.length];
    const q = u.gen();
    if (seen.has(q.q)) continue;
    seen.add(q.q);
    q.tag = u.label;
    out.push(q);
  }
  for (let i = out.length - 1; i > 0; i--){ const k = Math.floor(Math.random() * (i + 1)); [out[i], out[k]] = [out[k], out[i]]; }
  return out;
}
