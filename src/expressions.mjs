// Experimental personal-use expression estimates. Class probabilities are not
// measurements of a person's felt emotion. Self-reports never enter this module.
import {SCORE_POLICY,cameraContribution} from './score-policy.mjs';
export const EXPRESSION_MODEL='face-api-1.7.15/face-expression';
export const EXPRESSION_LABELS={neutral:'Neutral',happy:'Happiness',sad:'Sadness',angry:'Anger',fearful:'Fear',disgusted:'Disgust',surprised:'Surprise'};
export const EXPRESSION_POLICY={confidence:.55,margin:.15,minimumSamples:3,emotionWeight:SCORE_POLICY.cameraEmotionWeight,movementWeight:SCORE_POLICY.cameraMovementWeight,movementThreshold:20};
const keys=Object.keys(EXPRESSION_LABELS),round=x=>Number(x.toFixed(6)),inRange=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;
export function expressionVector(value){
  if(!value||!keys.every(k=>inRange(value[k],0,1)))return null;
  const total=keys.reduce((s,k)=>s+value[k],0);
  if(Math.abs(total-1)>.001)return null;
  return Object.fromEntries(keys.map(k=>[k,value[k]/total]));
}
export function expressionLabel(probabilities){
  const p=expressionVector(probabilities);if(!p)return null;
  const sorted=keys.map(key=>({key,confidence:p[key]})).sort((a,b)=>b.confidence-a.confidence);
  return {...sorted[0],label:sorted[0].confidence>=EXPRESSION_POLICY.confidence&&sorted[0].confidence-sorted[1].confidence>=EXPRESSION_POLICY.margin?EXPRESSION_LABELS[sorted[0].key]:'Mixed / uncertain'};
}
export const adverseProbability=p=>p.sad+p.angry+p.fearful;
export function expressionScores(probabilities,excessMovementScore){
  probabilities=expressionVector(probabilities);
  const negativeScore=Math.min(100,100*adverseProbability(probabilities)),sentimentScore=Math.max(-100,Math.min(100,100*probabilities.happy-negativeScore));
  return {negativeScore:round(negativeScore),sentimentScore:round(sentimentScore),...cameraContribution(negativeScore,excessMovementScore)};
}
export class ExpressionSummary{
  constructor(baselineId){this.baselineId=baselineId;this.samples=0;this.observedMs=0;this.lastTime=null;this.excess=0;this.sum=Object.fromEntries(keys.map(k=>[k,0]));}
  gap(){this.lastTime=null;}
  add(value,movement,at){
    const p=expressionVector(value),label=expressionLabel(p);
    if(!p||label.label==='Mixed / uncertain'||!inRange(movement,0,100)||!Number.isFinite(at)){this.gap();return null;}
    if(this.lastTime!==null&&at>=this.lastTime&&at-this.lastTime<=750)this.observedMs+=at-this.lastTime;
    this.lastTime=at;this.samples++;
    for(const k of keys)this.sum[k]+=p[k];
    this.excess+=adverseProbability(p)*Math.max(0,movement-EXPRESSION_POLICY.movementThreshold)/(100-EXPRESSION_POLICY.movementThreshold)*100;
    return label;
  }
  finish(){
    if(this.samples<EXPRESSION_POLICY.minimumSamples||this.observedMs<250)return null;
    const probabilities=Object.fromEntries(keys.map(k=>[k,round(this.sum[k]/this.samples)]));
    const excessMovementScore=round(this.excess/this.samples);
    return {version:1,source:'camera-expression',model:EXPRESSION_MODEL,baselineId:this.baselineId,samples:this.samples,observedMs:Math.round(this.observedMs),probabilities,excessMovementScore,...expressionScores(probabilities,excessMovementScore)};
  }
}
export function validateExpression(value,durationMs){
  const fail=()=>{throw new Error('Invalid camera expression summary.');};
  if(!value||value.version!==1||value.source!=='camera-expression'||value.model!==EXPRESSION_MODEL||typeof value.baselineId!=='string'||!value.baselineId.length||value.baselineId.length>100)fail();
  if(!Number.isSafeInteger(value.samples)||value.samples<3||value.samples>1e8||!Number.isSafeInteger(value.observedMs)||value.observedMs<250||value.observedMs>(value.samples-1)*750||(durationMs!=null&&value.observedMs>durationMs+1))fail();
  const probabilities=expressionVector(value.probabilities);
  if(!probabilities||!inRange(value.excessMovementScore,0,100)||value.excessMovementScore>100*adverseProbability(probabilities)+.001)fail();
  const p=Object.fromEntries(keys.map(k=>[k,round(value.probabilities[k])]));
  return {version:1,source:'camera-expression',model:EXPRESSION_MODEL,baselineId:value.baselineId,samples:value.samples,observedMs:value.observedMs,probabilities:p,excessMovementScore:value.excessMovementScore,...expressionScores(p,value.excessMovementScore)};
}
export function expressionStats(attempts,conceptId){
  const selected=attempts.filter(a=>a.conceptId===conceptId&&a.facialExpression).flatMap(a=>{try{return [{...a,facialExpression:validateExpression(a.facialExpression,a.durationMs)}];}catch{return [];}}),samples=selected.reduce((n,a)=>n+a.facialExpression.samples,0);
  if(!samples)return null;
  const probabilities=Object.fromEntries(keys.map(k=>[k,round(selected.reduce((n,a)=>n+a.facialExpression.probabilities[k]*a.facialExpression.samples,0)/samples)]));
  const excessMovementScore=round(selected.reduce((n,a)=>n+a.facialExpression.excessMovementScore*a.facialExpression.samples,0)/samples);
  return {samples,records:selected.length,probabilities,excessMovementScore,...expressionScores(probabilities,excessMovementScore),...expressionLabel(probabilities)};
}
export function expressionColumns(a){
  const x=a.facialExpression;
  return {cameraExpressionSource:x?.source,cameraExpressionModel:x?.model,cameraExpressionSamples:x?.samples,cameraExpressionObservedMs:x?.observedMs,cameraSentimentScore:x?.sentimentScore,cameraNegativeScore:x?.negativeScore,adverseExcessMovement:x?.excessMovementScore,cameraAdjustment:x?.adjustment,...Object.fromEntries(keys.map(k=>['camera_'+k,x?.probabilities[k]]))};
}
