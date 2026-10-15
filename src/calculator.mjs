// A small arithmetic parser: calculator input is never executed as JavaScript.
export const EXPRESSION_LIMIT=300;
const fail=message=>{throw new Error(message);};
const finite=value=>Number.isFinite(value)?value:fail('The result is outside the real-number range.');
export function calculate(expression,{angle='rad',ans=null}={}){
  if(typeof expression!=='string'||!expression.trim())fail('Enter an expression first.');
  if(expression.length>EXPRESSION_LIMIT)fail('Use a shorter expression.');
  const source=expression.toLowerCase().replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replaceAll('π',' pi ').replaceAll('√','sqrt');
  const tokens=[];let i=0;
  while(i<source.length){
    if(/\s/.test(source[i])){i++;continue;}
    const rest=source.slice(i),number=rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/);
    if(number){tokens.push({type:'number',value:finite(Number(number[0]))});i+=number[0].length;continue;}
    const name=rest.match(/^[a-z]+/);
    if(name){tokens.push({type:'name',value:name[0]});i+=name[0].length;continue;}
    if('+-*/^()!%'.includes(source[i])){tokens.push({type:source[i]});i++;continue;}
    fail(`Unsupported character: ${source[i]}`);
  }
  let pos=0;
  const peek=type=>tokens[pos]?.type===type;
  const take=type=>peek(type)?(pos++,true):false;
  const radians=x=>angle==='deg'?x*Math.PI/180:x;
  const inverse=x=>angle==='deg'?x*180/Math.PI:x;
  const functions={sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,
    sin:x=>Math.sin(radians(x)),cos:x=>Math.cos(radians(x)),tan:x=>{
      const rad=radians(x);if(Math.abs(Math.cos(rad))<1e-14)fail('Tangent is undefined at this angle.');return Math.tan(rad);
    },asin:x=>inverse(Math.asin(x)),acos:x=>inverse(Math.acos(x)),atan:x=>inverse(Math.atan(x))};
  function primary(){
    if(take('(')){const value=sum();if(!take(')'))fail('Close the parentheses.');return value;}
    if(peek('number'))return tokens[pos++].value;
    if(peek('name')){
      const name=tokens[pos++].value;
      if(name==='pi')return Math.PI;
      if(name==='e')return Math.E;
      if(name==='ans')return ans===null?fail('Calculate a result before using Ans.'):finite(ans);
      if(!Object.hasOwn(functions,name))fail(`Unknown name: ${name}`);
      if(!take('('))fail(`Use parentheses after ${name}.`);
      const value=sum();if(!take(')'))fail('Close the parentheses.');
      return finite(functions[name](value));
    }
    fail('Check the numbers, operators and parentheses.');
  }
  function postfix(){
    let value=primary();
    while(peek('!')||peek('%')){
      if(take('%'))value/=100;
      else{
        pos++;if(!Number.isInteger(value)||value<0||value>170)fail('Factorial needs a whole number from 0 to 170.');
        let product=1;for(let n=2;n<=value;n++)product*=n;value=product;
      }
    }
    return finite(value);
  }
  function power(){const left=postfix();return take('^')?finite(left**unary()):left;}
  function unary(){if(take('+'))return unary();if(take('-'))return -unary();return power();}
  function product(){
    let value=unary();
    while(true){
      if(take('*'))value=finite(value*unary());
      else if(take('/')){const divisor=unary();if(divisor===0)fail('Division by zero is undefined.');value=finite(value/divisor);}
      // Implicit multiplication supports 2π, 2(3+4), and (2+1)(4-1).
      else if(peek('(')||peek('name'))value=finite(value*unary());
      else break;
    }
    return value;
  }
  function sum(){let value=product();while(peek('+')||peek('-')){const add=take('+');if(!add)pos++;value=finite(add?value+product():value-product());}return value;}
  const value=sum();if(pos!==tokens.length)fail('Check for a missing operator or an extra parenthesis.');return Object.is(value,-0)?0:finite(value);
}
export function formatResult(value){return Number(value.toPrecision(12)).toString();}
