// Observable facial movement and voluntary self-report are separate data sources.
// Raw grading and diagnostic routing stay separate from optional display adjustments.
export const MOVEMENT_VERSION=1;
export const MOVEMENT_MODEL='mediapipe-face-landmarker-float16-v1/tasks-vision-1.1.0';
export const METRICS=[
  ['browInnerUp','Inner brow raise'],['browOuterUpLeft','Left outer brow raise'],['browOuterUpRight','Right outer brow raise'],
  ['browDownLeft','Left brow lower'],['browDownRight','Right brow lower'],
  ['eyeBlinkLeft','Left eyelid closure'],['eyeBlinkRight','Right eyelid closure'],
  ['eyeWideLeft','Left eye opening'],['eyeWideRight','Right eye opening'],['jawOpen','Jaw opening'],
  ['mouthPressLeft','Left lip compression'],['mouthPressRight','Right lip compression'],
  ['mouthSmileLeft','Left mouth corner lift'],['mouthSmileRight','Right mouth corner lift'],
  ['mouthFrownLeft','Left mouth corner lower'],['mouthFrownRight','Right mouth corner lower'],['mouthPucker','Lip rounding']
].map(([id,label])=>({id,label}));
export const EMOTIONS=['happiness','frustration','fear','anger','sadness','calm','neutral','mixed'];
export const VALENCES={pleasant:1,neutral:0,unpleasant:-1};
export const CALIBRATION_SAMPLES=30;
const round=x=>Math.round(x*10000)/10000;
const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
const median=xs=>{const sorted=[...xs].sort((a,b)=>a-b),m=Math.floor(xs.length/2);return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;};
const numberIn=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const validVector=values=>values&&METRICS.every(({id})=>numberIn(values[id],0,1));

export function movementVector(categories){
  if(!Array.isArray(categories))return null;
  const map=new Map(categories.map(c=>[c.categoryName,c.score]));
  const values=Object.fromEntries(METRICS.map(({id})=>[id,map.get(id)]));
  return validVector(values)?values:null;
}
export function calibrate(samples,id){
  if(samples.length<CALIBRATION_SAMPLES||!samples.every(validVector))throw new Error('More usable resting-face samples are needed.');
  const center={},noise={};
  for(const {id:key} of METRICS){
    center[key]=median(samples.map(s=>s[key]));
    const mad=median(samples.map(s=>Math.abs(s[key]-center[key])));
    if(mad>.07)throw new Error('The reference moved too much. Rest comfortably and try calibration again.');
    noise[key]=Math.max(.015,3*mad);
  }
  return {id,center,noise};
}
export function frameChange(values,baseline){
  if(!validVector(values))return null;
  const metrics=Object.fromEntries(METRICS.map(({id})=>{
    const delta=values[id]-baseline.center[id];
    return [id,{delta,change:Math.max(0,Math.abs(delta)-baseline.noise[id])*100}];
  }));
  return {score:mean(Object.values(metrics).map(m=>m.change)),metrics};
}
export class MovementSummary {
  constructor(baseline){this.baseline=baseline;this.samples=0;this.sum=0;this.peak=0;this.observedMs=0;this.lastTime=null;this.metrics=Object.fromEntries(METRICS.map(({id})=>[id,{delta:0,change:0}]));}
  gap(){this.lastTime=null;}
  add(values,at){
    const frame=frameChange(values,this.baseline);if(!frame){this.gap();return null;}
    // Only join nearby usable frames. Absence, tab switches and pauses contribute
    // neither time nor a synthetic zero-movement observation.
    if(this.lastTime!==null&&at>=this.lastTime&&at-this.lastTime<=750)this.observedMs+=at-this.lastTime;
    this.lastTime=at;this.samples++;this.sum+=frame.score;this.peak=Math.max(this.peak,frame.score);
    for(const {id} of METRICS){this.metrics[id].delta+=frame.metrics[id].delta;this.metrics[id].change+=frame.metrics[id].change;}
    return frame.score;
  }
  finish(){
    if(this.samples<3||this.observedMs<250)return null;
    return {version:MOVEMENT_VERSION,source:'facial-movement',model:MOVEMENT_MODEL,baselineId:this.baseline.id,samples:this.samples,observedMs:Math.round(this.observedMs),changeScore:round(this.sum/this.samples),peakChangeScore:round(this.peak),metrics:Object.fromEntries(METRICS.map(({id})=>[id,{meanDelta:round(this.metrics[id].delta/this.samples),changeScore:round(this.metrics[id].change/this.samples)}]))};
  }
}
export function selfReport({emotion,intensity,valence}){
  if(!EMOTIONS.includes(emotion)||!Number.isInteger(intensity)||intensity<1||intensity>5||!Object.hasOwn(VALENCES,valence))throw new Error('Choose an emotion, its strength and how it felt.');
  return {version:1,source:'self-report',emotion,intensity,valence,sentimentScore:VALENCES[valence]*intensity*20};
}
export function validateSelfReport(value){
  if(!value||value.version!==1||value.source!=='self-report')throw new Error('Invalid emotion check-in.');
  // Derive the signed score from what the student chose; never trust imported scores.
  return selfReport(value);
}
export function validateMovement(value,durationMs){
  const fail=()=>{throw new Error('Invalid facial-movement summary.');};
  if(!value||value.version!==MOVEMENT_VERSION||value.source!=='facial-movement'||value.model!==MOVEMENT_MODEL||typeof value.baselineId!=='string'||!value.baselineId.length||value.baselineId.length>100)fail();
  if(!Number.isSafeInteger(value.samples)||value.samples<3||value.samples>1e8||!Number.isSafeInteger(value.observedMs)||value.observedMs<250||value.observedMs>(value.samples-1)*750)fail();
  if(durationMs!=null&&value.observedMs>durationMs+1)fail();
  if(!numberIn(value.changeScore,0,100)||!numberIn(value.peakChangeScore,value.changeScore,100))fail();
  const metrics={};
  for(const {id} of METRICS){const m=value.metrics?.[id];if(!m||!numberIn(m.meanDelta,-1,1)||!numberIn(m.changeScore,0,100))fail();metrics[id]={meanDelta:m.meanDelta,changeScore:m.changeScore};}
  if(Math.abs(mean(Object.values(metrics).map(m=>m.changeScore))-value.changeScore)>.001)fail();
  // Whitelisting intentionally drops raw landmarks, frames and any extra fields.
  return {version:1,source:'facial-movement',model:MOVEMENT_MODEL,baselineId:value.baselineId,samples:value.samples,observedMs:value.observedMs,changeScore:value.changeScore,peakChangeScore:value.peakChangeScore,metrics};
}
export function observationStats(attempts,conceptId){
  const selected=attempts.filter(a=>a.conceptId===conceptId);
  const reports=selected.flatMap(a=>{try{return a.selfReport?[{...a,selfReport:validateSelfReport(a.selfReport)}]:[];}catch{return [];}});
  const motion=selected.flatMap(a=>{try{return a.facialMovement?[{...a,facialMovement:validateMovement(a.facialMovement,a.durationMs)}]:[];}catch{return [];}});
  const samples=motion.reduce((s,a)=>s+a.facialMovement.samples,0);
  return {checkIns:reports.length,unpleasantStrength:reports.length?round(mean(reports.map(a=>a.selfReport.valence==='unpleasant'?a.selfReport.intensity/5:0))):null,sentimentScore:reports.length?round(mean(reports.map(a=>a.selfReport.sentimentScore))):null,movementAttempts:motion.length,changeScore:samples?round(motion.reduce((s,a)=>s+a.facialMovement.changeScore*a.facialMovement.samples,0)/samples):null,observedMs:motion.reduce((s,a)=>s+a.facialMovement.observedMs,0),samples,metrics:Object.fromEntries(METRICS.map(({id})=>[id,samples?{meanDelta:round(motion.reduce((s,a)=>s+a.facialMovement.metrics[id].meanDelta*a.facialMovement.samples,0)/samples),changeScore:round(motion.reduce((s,a)=>s+a.facialMovement.metrics[id].changeScore*a.facialMovement.samples,0)/samples)}:null]))};
}
export function observationColumns(a){
  return {emotionSource:a.selfReport?.source,emotion:a.selfReport?.emotion,intensity:a.selfReport?.intensity,valence:a.selfReport?.valence,sentimentScore:a.selfReport?.sentimentScore,movementSource:a.facialMovement?.source,changeScore:a.facialMovement?.changeScore,peakChangeScore:a.facialMovement?.peakChangeScore,movementSamples:a.facialMovement?.samples,observedMs:a.facialMovement?.observedMs,baselineId:a.facialMovement?.baselineId,...Object.fromEntries(METRICS.flatMap(({id})=>[[id+'MeanDelta',a.facialMovement?.metrics[id].meanDelta],[id+'ChangeScore',a.facialMovement?.metrics[id].changeScore]]))};
}
