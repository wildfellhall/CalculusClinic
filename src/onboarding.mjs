export const ONBOARDING_KEY='calculus-clinic-onboarding-v1';
const steps=['course','tutorial','camera','complete'];

export function readOnboarding(storage,course){
 if(!course)return 'course';
 try{
  const saved=JSON.parse(storage.getItem(ONBOARDING_KEY));
  if(saved?.version===1&&steps.includes(saved.step)){
   if(saved.step==='complete')return ['calibrated','skipped'].includes(saved.cameraOutcome)?null:'camera';
   return saved.step;
  }
 }catch{/* A saved course still lets the learner continue with the new tour. */}
 return 'tutorial';
}
export function saveOnboarding(storage,step,cameraOutcome=null){
 if(!steps.includes(step)||(step==='complete'&&!['calibrated','skipped'].includes(cameraOutcome)))throw new Error('Invalid onboarding step.');
 try{storage.setItem(ONBOARDING_KEY,JSON.stringify({version:1,step,...(step==='complete'?{cameraOutcome}:{})}));return true;}
 catch{return false;}
}
