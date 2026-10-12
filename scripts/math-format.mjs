import katex from 'katex';

// Display-only conversion of the bank's deliberately plain-text source.
// Question records, answer IDs, CSVs and saved attempts keep their original text.
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const supers = Object.fromEntries([...('⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿˣᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷʸᶻ')].map((c,i)=>[c,[...'0123456789+-=()nxabcdefghijklmoprstuvwyz'][i]]));
const subs = Object.fromEntries([...('₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓᵧ')].map((c,i)=>[c,[...'0123456789+-=()aehijklmnoprstxy'][i]]));
const labels = new Set(['right','left','top','bottom','outer','inner','upper','lower']);
const units = new Set(['cm','mm','kg','min','hour','hours','day','days','people','People']);
const monomials = new Set(['xy','uv','fg','rK','Ce','Ae','Pe','yA','xyy','ky','kx','kt','xe','te','Cx','ab','rh','lw','rV','hF','Le']);
const symbols = {'−':'-','×':'\\times ','·':'\\cdot ','÷':'\\div ','≠':'\\ne ','≤':'\\le ','≥':'\\ge ','→':'\\to ','±':'\\pm ','≈':'\\approx ','∞':'\\infty ','π':'\\pi ','θ':'\\theta ','ε':'\\varepsilon ','Δ':'\\Delta ','Σ':'\\sum ','∑':'\\sum ','∫':'\\int ','∘':'\\circ ','∪':'\\cup ','∈':'\\in ','…':'\\ldots ','′':"'",'″':"''",'‴':"'''"};
const openers = new Set(['(','[','⟨','{']);
const closers = new Set([')',']','⟩','}']);
const relation = new Set(['=','≠','≤','≥','<','>','→','≈','∈','∪']);
const sums = new Set(['+','-','−','±']);
const atom = (tex,kind='atom',extra={})=>({tex,kind,...extra});
const ungroup = n => n.kind==='group'?n.inner:n.tex;
const texChar = c => symbols[c]??c;

function lex(source){
  const out=[];
  for(let i=0;i<source.length;){
    const start=i,rest=source.slice(i);let match;
    // The authored bounds are small expressions; more elaborate notation uses
    // explicit scripts (e.g. ∫_(x²)^4), parsed below.
    if((match=/^lim\s+(?:as\s+)?([a-z])→([−+-]?(?:∞|\d+(?:\.\d+)?|[a-z]))([+−-])?(?:\s+from the (right|left))?(?:\s+of)?\s*/.exec(rest))){
      const side=match[3]?texChar(match[3]):match[4]?(match[4]==='right'?'+':'-'):'';
      i+=match[0].length;out.push({value:`\\lim_{${match[1]}\\to ${[...match[2]].map(texChar).join('')}${side?`^{${side}}`:''}}`,kind:'prefix',start,end:i});continue;
    }
    if((match=/^lim ([fg])\(([a-z])\) as \2→([−+-]?(?:∞|\d+(?:\.\d+)?|[a-z]))/.exec(rest))){
      i+=match[0].length;out.push({value:`\\lim_{${match[2]}\\to ${[...match[3]].map(texChar).join('')}} ${match[1]}(${match[2]})`,kind:'prefix',start,end:i});continue;
    }
    if((match=/^(Σ|∫) from (?:day )?([−-]?[a-z0-9]+(?:=[−-]?[a-z0-9]+)?) to (?:day )?([−-]?[a-z0-9∞]+) of\s*/.exec(rest))){
      i+=match[0].length;out.push({value:`${texChar(match[1])}_{${[...match[2]].map(texChar).join('')}}^{${[...match[3]].map(texChar).join('')}}`,kind:'prefix',start,end:i});continue;
    }
    if((match=/^\s+/.exec(rest))){i+=match[0].length;out.push({value:match[0],kind:'space',start,end:i});continue;}
    if((match=/^\d+(?:\.\d+)?/.exec(rest))){i+=match[0].length;out.push({value:match[0],kind:'number',start,end:i});continue;}
    // Functions may be adjacent to a variable (sec²x or 2arctan x).
    if((match=/^(arcsin|arccos|arctan|sqrt|abs|sin|cos|tan|sec|csc|cot|ln|log|lim)(?![a-z]{2})/.exec(rest))){i+=match[0].length;out.push({value:match[0],kind:'function',start,end:i});continue;}
    if((match=/^[A-Za-z]+/.exec(rest))){
      i+=match[0].length;const word=match[0];
      const kind=word.length===1&&!/[’']/.test(source[start-1]||'')?'variable':/^d[xytruvs]$/.test(word)?'differential':monomials.has(word)?'variable':labels.has(word)||(['avg','next'].includes(word)&&source[start-1]==='_')?'label':units.has(word)?'unit':'text';
      // Monomials are individual factors so kt in an exponent is parsed too.
      if(kind==='variable'&&word.length>1){for(let j=0;j<word.length;j++)out.push({value:word[j],kind:'variable',start:start+j,end:start+j+1});continue;}
      out.push({value:word,kind,start,end:i});continue;
    }
    const c=source[i++];let kind='text',value=c;
    if(c in supers){kind='super';while(source[i] in supers)value+=source[i++];value=[...value].map(v=>supers[v]).join('');}
    else if(c in subs){kind='sub';while(source[i] in subs)value+=source[i++];value=[...value].map(v=>subs[v]).join('');}
    else if(c in symbols||'θπεΔ√∛+-*/=<>^_!()[]⟨⟩{},'.includes(c))kind='symbol';
    // dθ is a differential, just like dx.
    if(c==='θ'&&out.at(-1)?.value==='d'&&out.at(-1).end===start){const d=out.pop();out.push({value:'dθ',kind:'differential',start:d.start,end:i});continue;}
    out.push({value,kind,start,end:i});
  }
  return out;
}

function parse(tokens){
  let i=0;
  const peek=()=>tokens[i]?.value;
  const consume=()=>tokens[i++];
  const script=()=>{
    if(openers.has(peek()))return ungroup(primary());
    const sign=sums.has(peek())?texChar(consume().value):'';
    return sign+primary().tex;
  };
  function primary(){
    const t=consume();if(!t)return atom('');
    let n;
    if(openers.has(t.value)){
      const inner=expression(),close=closers.has(peek())?consume().value:null;
      if(!close)throw new Error('Unbalanced mathematical group');
      const left=t.value==='⟨'?'\\langle':t.value==='{'?'\\{':t.value;
      const right=close==='⟩'?'\\rangle':close==='}'?'\\}':close;
      n=atom(`\\left${left} ${inner} \\right${right}`,'group',{inner});
    }else if(t.value==='√'||t.value==='∛'||t.value==='sqrt'||t.value==='abs'){
      // √x² means √(x²); abs() is always explicit in the authored bank.
      const arg=power();
      n=atom(t.value==='abs'?`\\left|${ungroup(arg)}\\right|`:`\\sqrt${t.value==='∛'?'[3]':''}{${ungroup(arg)}}`);
    }else if(t.kind==='function')n=atom('\\'+t.value+' ',t.value==='lim'?'prefix':'function');
    else if(t.kind==='differential')n=atom(`\\mathrm{d}${texChar(t.value[1])}`,'differential');
    else if(t.kind==='unit')n=atom(`\\mathrm{${t.value}}`);
    else if(t.kind==='label')n=atom(`\\text{${t.value}}`);
    else if(t.kind==='prefix')n=atom(t.value,'prefix');
    else n=atom(texChar(t.value),['∫','Σ','∑'].includes(t.value)?'prefix':t.kind==='variable'?'variable':'atom');
    // A function application is one atom in a radical or denominator. Keeping
    // g(x) together avoids accidentally displaying f(x)/g followed by (x).
    if(t.kind==='variable'&&peek()==='('&&tokens[i].start===t.end)n.tex+=primary().tex;
    return n;
  }
  function power(){
    const n=primary();
    while(i<tokens.length){
      const t=tokens[i];
      if(t.kind==='super'||t.kind==='sub'){
        consume();n.tex+=`${t.kind==='super'?'^':'_'}{${[...t.value].map(texChar).join('')}}`;
      }else if(t.value==='^'||t.value==='_'){consume();n.tex+=`${t.value}{${script()}}`;}
      else if(['′','″','‴','!'].includes(t.value)){consume();n.tex+=texChar(t.value);}
      else if(n.kind==='variable'&&t.value==='('&&t.start===tokens[i-1].end)n.tex+=primary().tex;
      else break;
      n.kind=n.kind==='group'?'atom':n.kind;
    }
    if(n.kind==='function'&&tokens[i]&&(['number','variable','function'].includes(tokens[i].kind)||openers.has(peek())||['√','∛','π','θ'].includes(peek()))){
      n.tex+=power().tex;
      while(tokens[i]&&tokens[i].start===tokens[i-1].end&&['number','variable'].includes(tokens[i].kind))n.tex+=' '+power().tex;
      n.kind='atom';
    }
    return n;
  }
  function product(){
    let parts=[],prefix='';
    while(i<tokens.length&&!closers.has(peek())&&!relation.has(peek())&&!sums.has(peek())&&peek()!==','){
      if(peek()==='/'){
        consume();let denominator=power();
        // A coefficient and adjacent factors form one denominator: 1/2x.
        // A following parenthesis after dx denotes the operand of d/dx(...).
        if(denominator.kind!=='group'&&denominator.kind!=='differential'){
          while(tokens[i]&&tokens[i].start===tokens[i-1].end&&['number','variable','function'].includes(tokens[i].kind)){
            denominator=atom(denominator.tex+power().tex);
          }
        }
        if(!parts.length)throw new Error('Fraction missing a numerator');
        const numerator=parts.length===1?ungroup(parts[0]):parts.map(p=>p.tex).join(' ');
        parts=[atom(`\\frac{${numerator}}{${ungroup(denominator)}}`)];
      }else if(['*','·','×','÷','∘'].includes(peek()))parts.push(atom(peek()==='*'?(consume(),'\\cdot '):texChar(consume().value)));
      else{
        const n=power();
        if(n.kind==='prefix'){prefix+=parts.map(p=>p.tex).join(' ')+n.tex+' ';parts=[];}
        else parts.push(n);
      }
    }
    return prefix+parts.map((n,j)=>(n.kind==='differential'&&j?'\\,':'')+n.tex).join(' ');
  }
  function expression(){
    let result='';
    while(i<tokens.length&&!closers.has(peek())){
      if(sums.has(peek())||relation.has(peek())||peek()===',')result+=texChar(consume().value)+' ';
      else{const before=i;result+=product();if(i===before)throw new Error('Unsupported math token');}
    }
    return result;
  }
  const result=expression();
  if(i!==tokens.length)throw new Error('Unconsumed mathematical tokens');
  return result;
}

// Keep prose, punctuation, ordinary hyphenated words and unmatched prose
// parentheses outside math. Explicit $...$ is also supported for future items.
export function mathSegments(source){
  if(source.includes('$'))return source.split(/(\$[^$]+\$)/g).filter(Boolean).flatMap(s=>s.startsWith('$')&&s.endsWith('$')?[{text:s,tex:s.slice(1,-1)}]:mathSegmentsPlain(s));
  return mathSegmentsPlain(source);
}
function mathSegmentsPlain(source){
  const tokens=lex(source),segments=[];let cursor=0;
  for(let start=0;start<tokens.length;){
    const first=tokens[start];
    if(['text','space','label','super','sub'].includes(first.kind)||closers.has(first.value)||['/',',','^','_','!'].includes(first.value)){start++;continue;}
    if(['a','A','I'].includes(first.value)&&tokens[start+1]?.kind==='space'&&!sums.has(tokens[start+2]?.value)&&!relation.has(tokens[start+2]?.value)){start++;continue;}
    if(first.value==='-'&&/[A-Za-z]/.test(source[first.start-1]||'')){start++;continue;}
    let end=start,depth=0;
    for(;end<tokens.length;end++){
      const t=tokens[end];
      if(t.kind==='text'||(t.kind==='label'&&!depth&&tokens[end-1]?.value!=='_'))break;
      if(t.value===','&&!depth)break;
      if(openers.has(t.value))depth++;
      if(closers.has(t.value)){if(!depth)break;depth--;}
      // A hyphen in "x-axis", "p-series", "degree-2" is prose punctuation.
      if(t.value==='-'&&tokens[end+1]?.kind==='text')break;
    }
    while(end>start&&(['space'].includes(tokens[end-1].kind)||openers.has(tokens[end-1].value)||sums.has(tokens[end-1].value)||relation.has(tokens[end-1].value)))end--;
    if(end===start){start++;continue;}
    const ts=tokens.slice(start,end).filter(t=>t.kind!=='space');
    // Don't italicize English articles or isolated punctuation.
    const variableList=tokens[end]?.value===','&&tokens[end+1]?.kind==='variable';
    if(ts.length===1&&((['a','A','I'].includes(ts[0].value)&&!variableList)||ts[0].kind==='symbol'&&!['π','θ','∞','Σ','∫'].includes(ts[0].value))){start=end;continue;}
    let tex;
    try{tex=parse(ts);}catch{start++;continue;}
    const from=tokens[start].start,to=tokens[end-1].end;
    if(from>cursor)segments.push({text:source.slice(cursor,from)});
    segments.push({text:source.slice(from,to),tex});cursor=to;start=end;
  }
  if(cursor<source.length)segments.push({text:source.slice(cursor)});
  return segments;
}

export function formatMath(source){
  return mathSegments(source).map(s=>s.tex?`<span class="math-inline">${katex.renderToString(s.tex,{output:'htmlAndMathml',throwOnError:true,strict:'error',trust:false})}</span>`:escape(s.text)).join('');
}

export function curriculumText(concepts,questions){
  return [...new Set([
    ...concepts.flatMap(c=>[c.title,c.objective,c.rule,c.firstStep,c.misconception,...c.subskills]),
    ...questions.flatMap(q=>[q.prompt,...q.options.map(o=>o.text),q.explanation]),
  ])];
}

export function compileMathText(concepts,questions){
  const text={},checked=new Set();
  for(const source of curriculumText(concepts,questions)){
    const segments=mathSegments(source);
    if(!segments.some(s=>s.tex))continue;
    for(const segment of segments){
      if(segment.tex&&!checked.has(segment.tex)){
        try{katex.renderToString(segment.tex,{throwOnError:true,strict:'error',trust:false});}
        catch(error){throw new Error(`Cannot typeset ${JSON.stringify(source)}: ${error.message}`);}
        checked.add(segment.tex);
      }
    }
    text[source]=segments.map(s=>s.tex?{tex:s.tex}:s.text);
  }
  return text;
}
