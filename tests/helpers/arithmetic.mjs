// Independent test-only expression evaluator; never used to grade in the app.
export function evaluate(text,x=0){
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
export const near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b));
