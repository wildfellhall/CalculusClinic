// A deliberately small, transparent practice heuristic, not a calibrated
// speed benchmark. Correctness and question coverage remain the main signal.
export const TIMING_POLICY=Object.freeze({weight:.03,fullCreditMs:120_000,floorMs:300_000});
export const validDuration=value=>Number.isSafeInteger(value)&&value>=0;
export function timedCredit(attempt){
  if(!attempt.correct)return 0;
  if(!validDuration(attempt.durationMs))return 1; // Unknown legacy time is neutral.
  const fraction=Math.max(0,Math.min(1,(attempt.durationMs-TIMING_POLICY.fullCreditMs)/(TIMING_POLICY.floorMs-TIMING_POLICY.fullCreditMs)));
  return 1-TIMING_POLICY.weight*fraction;
}
export function formatDuration(ms){
  if(!validDuration(ms))return 'Not recorded';
  const seconds=Math.floor(ms/1000),minutes=Math.floor(seconds/60),hours=Math.floor(minutes/60);
  return hours?`${hours}:${String(minutes%60).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:`${minutes}:${String(seconds%60).padStart(2,'0')}`;
}

// Use a monotonic clock. Paused time, feedback reading, and repeated renders
// cannot inflate or reset an attempt's duration. A new attempt gets a new clock.
export class QuestionClock{
  constructor(now=()=>performance.now()){this.now=now;this.reset();}
  reset(){this.questionId=null;this.accumulatedMs=0;this.startedAt=null;}
  select(questionId){if(questionId!==this.questionId){this.reset();this.questionId=questionId;}}
  setRunning(running){
    if(running&&this.questionId&&this.startedAt===null)this.startedAt=this.now();
    else if(!running&&this.startedAt!==null){this.accumulatedMs+=Math.max(0,this.now()-this.startedAt);this.startedAt=null;}
  }
  elapsed(){return Math.round(this.accumulatedMs+(this.startedAt===null?0:Math.max(0,this.now()-this.startedAt)));}
  finish(){this.setRunning(false);return this.elapsed();}
  get running(){return this.startedAt!==null;}
}
