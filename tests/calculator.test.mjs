import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,formatResult} from '../src/calculator.mjs';
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);

test('Calculator respects arithmetic precedence, right-associative powers, signs and parentheses',()=>{
 for(const [input,expected] of [['2+3*4',14],['(2+3)*4',20],['2^3^2',512],['-2^2',-4],['(-2)^2',4],['2^-3',.125],['2*-3+4',-2],['1/2/4',.125],['.5+.25',.75],['3−2×4÷2',-1],['1e-3+2E2',200.001],['0^0',1]])near(calculate(input),expected);
});
test('Calculator supports constants, implicit multiplication, scientific functions and percentages',()=>{
 for(const [input,expected] of [['2π',2*Math.PI],['3(2+4)',18],['(2+1)(4-1)',9],['sqrt(9)+√(16)',7],['ln(e^2)',2],['log(1000)',3],['abs(-5)',5],['5!/(3!*2!)',10],['50%*80',40],['sin(pi/2)',1],['cos(pi)',-1],['atan(1)',Math.PI/4],['exp(0)',1]])near(calculate(input),expected);
 near(calculate('2ans+1',{ans:3}),7);assert.equal(formatResult(.1+.2),'0.3');assert.equal(formatResult(1/3),'0.333333333333');
});
test('Angle modes affect direct and inverse trigonometric functions consistently',()=>{
 for(const [input,expected] of [['sin(30)',.5],['cos(60)',.5],['tan(45)',1],['asin(.5)',30],['acos(.5)',60],['atan(1)',45]])near(calculate(input,{angle:'deg'}),expected);
 near(calculate('sin(30)',{angle:'rad'}),Math.sin(30));
});
test('Domain errors and incomplete input cannot silently produce invalid answers',()=>{
 for(const input of ['', '1/0','sqrt(-1)','ln(0)','log(-3)','asin(2)','tan(pi/2)','(-1)!','1.5!','171!','10^1000','1e999','1+','(1+2','1+2)','1 2','sin 2','unknown(1)'])assert.throws(()=>calculate(input),Error,input);
 assert.throws(()=>calculate('tan(90)',{angle:'deg'}),/undefined/);assert.throws(()=>calculate('ans'),/before using Ans/);
});
test('Calculator accepts only math syntax and bounds input complexity',()=>{
 globalThis.calculatorExecuted=false;
 for(const input of ['globalThis.calculatorExecuted=true','constructor.constructor("return 1")()','alert(1)','[1,2]','Math.sin(1)','1;2', '('.repeat(301)])assert.throws(()=>calculate(input));
 assert.equal(globalThis.calculatorExecuted,false);delete globalThis.calculatorExecuted;
});
