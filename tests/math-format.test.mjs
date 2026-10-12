import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {mathSegments,formatMath,curriculumText,compileMathText} from '../scripts/math-format.mjs';
import {concepts} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';

const tex=source=>mathSegments(source).map(s=>s.tex??s.text).join('').replace(/\s+/g,'');
const equal=(source,expected)=>assert.equal(tex(source),expected.replace(/\s+/g,''));

test('fractions preserve grouped numerators, denominators and arithmetic precedence',()=>{
  equal('(x²−9)/(x−3)',String.raw`\frac{x^{2}-9}{x-3}`);
  equal('1+x²/2',String.raw`1+\frac{x^{2}}{2}`);
  equal('1/[2(n+1)]',String.raw`\frac{1}{2\left(n+1\right)}`);
  equal('(dy/dt)/(dx/dt)',String.raw`\frac{\frac{\mathrm{d}y}{\mathrm{d}t}}{\frac{\mathrm{d}x}{\mathrm{d}t}}`);
});
test('function calls stay together in denominators and radicals',()=>{
  equal('f(x)/g(x)',String.raw`\frac{f\left(x\right)}{g\left(x\right)}`);
  equal('√f(x)',String.raw`\sqrt{f\left(x\right)}`);
  equal('1/f⁻¹(x)',String.raw`\frac{1}{f^{-1}\left(x\right)}`);
});
test('named function arguments stay inside their fraction',()=>{
  equal('1/cos x',String.raw`\frac{1}{\cos x}`);
  equal('sin x/x',String.raw`\frac{\sin x}{x}`);
  equal('ln 7/ln 3',String.raw`\frac{\ln 7}{\ln 3}`);
  equal('(1−cos²x)/sin x',String.raw`\frac{1-\cos^{2}x}{\sin x}`);
});
test('absolute values, nested radicals and rational powers keep their scope',()=>{
  equal('abs(f(x))',String.raw`\left|f\left(x\right)\right|`);
  equal('√(1+(f′(x))²)',String.raw`\sqrt{1+\left(f'\left(x\right)\right)^{2}}`);
  equal('∛(n²)',String.raw`\sqrt[3]{n^{2}}`);
  equal('x^(−1/2)',String.raw`x^{-\frac{1}{2}}`);
});
test('integrals keep fractions inside their integrand and differentials outside',()=>{
  equal('∫₀¹ 1/x² dx',String.raw`\int_{0}^{1}\frac{1}{x^{2}}\,\mathrm{d}x`);
  equal('∫_(−x)^x e^(t²)dt',String.raw`\int_{-x}^{x}e^{t^{2}}\,\mathrm{d}t`);
  equal('∫₀^(π/2)4 dθ',String.raw`\int_{0}^{\frac{\pi}{2}}4\,\mathrm{d}\theta`);
  equal('∫ from day 2 to day 5 of r(t)dt',String.raw`\int_{2}^{5}r\left(t\right)\,\mathrm{d}t`);
});
test('limits include the explicitly authored bound and one-sided direction',()=>{
  equal('lim as x→0 from the right of 1/x',String.raw`\lim_{x\to0^{+}}\frac{1}{x}`);
  equal('lim as x→0+ of x ln x',String.raw`\lim_{x\to0^{+}}x\ln x`);
  equal('lim as x→−∞ of 5/x',String.raw`\lim_{x\to-\infty}\frac{5}{x}`);
  equal('lim f(x) as x→2',String.raw`\lim_{x\to2}f(x)`);
});
test('summation limits, factorials and sequence subscripts remain distinct',()=>{
  equal('Σ from n=0 to ∞ of xⁿ/n!',String.raw`\sum_{n=0}^{\infty}\frac{x^{n}}{n!}`);
  equal('abs(aₙ₊₁/aₙ)',String.raw`\left|\frac{a_{n+1}}{a_{n}}\right|`);
  equal('f⁽⁴⁾(t)',String.raw`f^{(4)}\left(t\right)`);
});
test('mixed intervals and vector components retain their delimiters',()=>{
  equal('[0,∞)',String.raw`\left[0,\infty\right)`);
  equal('⟨e^t,1/t⟩',String.raw`\left\langle e^{t},\frac{1}{t}\right\rangle`);
});
test('named subscripts and geometric labels use upright text',()=>{
  equal('f_avg',String.raw`f_{\text{avg}}`);
  equal('y_next=y+hF(x,y)',String.raw`y_{\text{next}}=y+h F\left(x,y\right)`);
  equal('∫(right−left)dy',String.raw`\int\left(\text{right}-\text{left}\right)\,\mathrm{d}y`);
});
test('prose, contractions and hyphens are not swallowed by formulas',()=>{
  assert.equal(formatMath("A circle's area isn't its radius."),"A circle&#39;s area isn&#39;t its radius.");
  assert.equal(mathSegments('A p-series has p=1/2.')[0].text,'A ');
  assert.ok(!mathSegments('degree-2 polynomial').some(s=>s.tex?.includes('-')));
  assert.equal(mathSegments('A,B').filter(s=>s.tex).length,2,'A is a variable when part of a variable list');
});
test('every source string can be reconstructed exactly from the display spans',()=>{
  for(const source of curriculumText(concepts,questions))assert.equal(mathSegments(source).map(s=>s.text).join(''),source,source);
});
test('all 1270 questions and 127 concepts compile with strict KaTeX validation',()=>{
  const before=JSON.stringify({concepts,questions});
  const compiled=compileMathText(concepts,questions);
  assert.ok(Object.keys(compiled).length>3000);
  assert.equal(JSON.stringify({concepts,questions}),before,'Formatting must not mutate the bank or question versions');
});
test('no source formula markers are left behind as unformatted shorthand',()=>{
  for(const source of curriculumText(concepts,questions)){
    for(const segment of mathSegments(source))if(!segment.tex)assert.doesNotMatch(segment.text,/[∫Σ√∛^_²³⁻₀-₉ₙₓ′]/,source);
  }
});
test('rendering provides semantic MathML and hides duplicate visual markup',()=>{
  const html=formatMath('Find ∫₀¹ x² dx.');
  assert.match(html,/<math xmlns=/);
  assert.match(html,/<msubsup>/);
  assert.match(html,/class="katex-html" aria-hidden="true"/);
  assert.ok(html.startsWith('Find '));
});
test('HTML in prose is escaped and explicit LaTeX uses untrusted mode',()=>{
  assert.ok(!formatMath('<img src="bad" onerror="alert(1)">').includes('<img'));
  assert.match(formatMath('$\\frac{1}{2}$'),/<mfrac>/);
  assert.throws(()=>formatMath('$\\htmlStyle{color:red}{x}$'));
});
test('the math stylesheet is served locally without a CDN',async()=>{
  const html=await readFile('src/index.html','utf8');
  assert.match(html,/href="\/vendor\/katex\/katex.min.css"/);
  assert.doesNotMatch(html,/cdn|https:.*katex/);
});
