// One policy for graph fill, exports and explanations. It never grades answers.
export const SCORE_POLICY=Object.freeze({version:1,cameraEmotionWeight:.15,cameraMovementWeight:.05,selfReportWeight:.02});
export const CAMERA_MAX_ADJUSTMENT=SCORE_POLICY.cameraEmotionWeight+SCORE_POLICY.cameraMovementWeight;
export const normalizeScoringPreferences=value=>({includeSelfReports:value?.includeSelfReports===true});
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const round=x=>Number(x.toFixed(6));
const credit=(accuracy,adjustment)=>accuracy===null?null:round(accuracy*(1-adjustment));

export function cameraContribution(negativeScore,excessMovementScore){
  const emotionAdjustment=SCORE_POLICY.cameraEmotionWeight*clamp(negativeScore/100);
  const movementAdjustment=SCORE_POLICY.cameraMovementWeight*clamp(excessMovementScore/100);
  const adjustment=emotionAdjustment+movementAdjustment;
  return {adjustment:round(adjustment),cameraScore:round(clamp(1-adjustment/CAMERA_MAX_ADJUSTMENT))};
}

export function combinedScore(accuracy,expression,observations,preferences){
  accuracy=Number.isFinite(accuracy)&&accuracy>=0&&accuracy<=1?accuracy:null;
  const {includeSelfReports}=normalizeScoringPreferences(preferences);
  const cameraAdjustment=expression?cameraContribution(expression.negativeScore,expression.excessMovementScore).adjustment:0;
  const checkIns=includeSelfReports?(observations?.checkIns??0):0;
  const selfReportAdjustment=checkIns?round(SCORE_POLICY.selfReportWeight*clamp(observations.unpleasantStrength)):0;
  const totalAdjustment=round(cameraAdjustment+selfReportAdjustment);
  return {accuracy,cameraAdjustment,selfReportAdjustment,totalAdjustment,includeSelfReports,checkIns,hasEvidence:!!expression||checkIns>0,cameraAdjustedScore:credit(accuracy,cameraAdjustment),adjustedScore:credit(accuracy,totalAdjustment)};
}

export function selfReportExplanation(preferences){
  const enabled=normalizeScoringPreferences(preferences).includeSelfReports;
  return enabled?`Check-ins are included in the combined view, with up to ${SCORE_POLICY.selfReportWeight*100}% additional credit reduction. Each unpleasant check-in contributes its strength ÷ 5; pleasant and neutral check-ins contribute zero. The mean includes saved retries. Missing check-ins add no adjustment.`:'Check-ins are excluded. Enable their contribution in Settings → Score preferences.';
}
export function combinedExplanation(preferences){
  return `Experimental combined score = accuracy × (1 − camera adjustment − enabled check-in adjustment). Fear, sadness and anger probabilities contribute up to ${SCORE_POLICY.cameraEmotionWeight*100}% of answer credit; coinciding excess movement contributes up to ${SCORE_POLICY.cameraMovementWeight*100}%. ${selfReportExplanation(preferences)} Raw accuracy, the camera-only view, passing and recommendations stay independent of check-ins.`;
}

export function cameraScoreExplanation(){
  return `Camera-only score = 100 − ${Math.round(100*SCORE_POLICY.cameraEmotionWeight/CAMERA_MAX_ADJUSTMENT)} × fear/sadness/anger probability − ${Math.round(100*SCORE_POLICY.cameraMovementWeight/CAMERA_MAX_ADJUSTMENT)} × coinciding excess movement. Check-ins do not enter this view.`;
}
