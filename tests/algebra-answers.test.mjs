// An independent arithmetic evaluator checks authored keys; the app itself
// grades by stable option IDs and never uses this evaluator.
import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../data/algebra/questions.mjs';
const key=q=>q.options.find(o=>o.id===q.correctOptionId).text;
function evaluate(text,x=0){
 const supers={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
 text=text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,s=>'^('+[...s].map(c=>supers[c]).join('')+')').replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/').replaceAll(' ','');
 const tokens=text.match(/\d+(?:\.\d+)?|abs|ln|[x+*/^()√∛-]/g)??[];
 if(tokens.join('')!==text)throw Error('Unsupported expression '+text);
 let at=0;
 const match=t=>tokens[at]===t;
 function primary(){const t=tokens[at++];if(t==='('){const n=sum();if(tokens[at++]!==')')throw Error('Missing parenthesis');return n;}if(t==='x')return x;if(['abs','√','∛','ln'].includes(t)){const n=power();return t==='abs'?Math.abs(n):t==='√'?Math.sqrt(n):t==='∛'?Math.cbrt(n):Math.log(n);}if(t&&/^\d/.test(t))return Number(t);throw Error('Expected value');}
 function power(){const n=primary();if(match('^')){at++;return n**unary();}return n;}
 function unary(){if(match('-')){at++;return -unary();}if(match('+')){at++;return unary();}return power();}
 function product(){let n=unary();while(at<tokens.length){if(match('*')){at++;n*=unary();}else if(match('/')){at++;n/=unary();}else if(/^(\d|x|\(|abs|√|∛|ln)/.test(tokens[at]))n*=unary();else break;}return n;}
 function sum(){let n=product();while(match('+')||match('-')){const op=tokens[at++],v=product();n=op==='+'?n+v:n-v;}return n;}
 const value=sum();if(at!==tokens.length)throw Error('Unused tokens');return value;
}
const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b));
test('Independent evaluator handles sign, precedence, fractions, powers, and radicals',()=>{
 for(const [expr,value] of [['−5²',-25],['(−5)²',25],['2^(−3)',.125],['18÷3×2',12],['√(50x²)',10*Math.sqrt(2)],['abs(x−3)',5]])assert.ok(near(evaluate(expr,-2),value),expr);
});
test('Direct arithmetic items have exactly one numerically correct choice',()=>{
 let checked=0;
 for(const q of questions){const match=/^Compute (.+)\.$/.exec(q.prompt);if(!match)continue;let expected;
  try{expected=evaluate(match[1]);}catch{continue;}
  if(!Number.isFinite(expected))continue;
  const matches=q.options.filter(o=>{try{return near(evaluate(o.text),expected);}catch{return false;}});
  assert.deepEqual(matches.map(o=>o.id),[q.correctOptionId],q.id+' '+q.prompt);checked++;
 }
 assert.ok(checked>=72,`Only ${checked} arithmetic items checked`);
});
test('Polynomial expansion and factorization keys agree independently at several inputs',()=>{
 let checked=0;
 for(const q of questions){if(!['MATH_025','MATH_030','MATH_056','MATH_057','MATH_060','MATH_080','MATH_081'].includes(q.conceptId))continue;
  const match=/^(?:Expand|Factor|Simplify|Multiply) (.+)\.$/.exec(q.prompt);if(!match)continue;
  const expression=match[1];try{evaluate(expression,2);q.options.forEach(o=>evaluate(o.text,2));}catch{continue;}
  const matches=q.options.filter(o=>[-3,-.7,.3,2,4.5].every(x=>near(evaluate(expression,x),evaluate(o.text,x))));
  assert.deepEqual(matches.map(o=>o.id),[q.correctOptionId],q.id+' '+q.prompt);checked++;
 }
 assert.ok(checked>=24,`Only ${checked} polynomial items checked`);
});
test('Authored single-variable equation roots satisfy the original equation, including sign restrictions',()=>{
 let checked=0;
 for(const q of questions){const match=/^Solve ([^=]+)=([^=]+)\.$/.exec(q.prompt);if(!match||!key(q).startsWith('x='))continue;
  const roots=key(q).replaceAll('x=','').split(' or ').flatMap(v=>v.includes('±')?[v.replace('±','+'),v.replace('±','−')]:[v]);let values;
  try{values=roots.map(r=>evaluate(r));evaluate(match[1],2);evaluate(match[2],2);}catch{continue;}
  for(const root of values)assert.ok(near(evaluate(match[1],root),evaluate(match[2],root)),q.id+' invalid root '+root);checked++;
 }
 assert.ok(checked>=14,`Only ${checked} equation items checked`);
});
test('High-risk roots, domains, systems, and transformations retain their reviewed solutions',()=>{
 const expected={
  '058-Q3':'abs(x)','058-Q4':'5abs(x)√2','060-Q6':'2(x−2)²−7','061-Q3':'x=−2±√3','061-Q4':'x=2 or x=−1/2',
  '066-Q7':'x≥4','068-Q8':'Horizontal stretch by 8','070-Q6':'x≤−5 or x≥3','071-Q8':'(3,2,4)',
  '072-Q4':'(−2,4) and (1,1)','073-Q4':'(3,−4)','073-Q7':'x=1','074-Q10':'x≤−3',
  '075-Q3':'x=2 only','075-Q5':'x=−8 or x=8','075-Q8':'x=5 only','076-Q8':'−3≤x≤3',
  '078-Q6':'x=11/2','079-Q4':'8−i','080-Q9':'Quotient x+2, remainder 0',
  '082-Q6':'1/2, with x≠−1 and x≠0','083-Q5':'A hole at (1,2)','084-Q3':'No solution',
  '085-Q4':'The first','086-Q5':'No, they may lie on a line'
 };
 for(const [suffix,value] of Object.entries(expected))assert.equal(key(questions.find(q=>q.id==='MATH_'+suffix)),value,suffix);
});
