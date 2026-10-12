import {calibrate,CALIBRATION_SAMPLES,MovementSummary} from './observations.mjs';
import {ExpressionSummary,expressionLabel} from './expressions.mjs';
import {CAMERA_CONSTRAINTS} from './camera-access.mjs';

export class MovementCamera {
  constructor(onChange=()=>{}){
    this.onChange=onChange;this.stage='off';this.message='';this.generation=0;this.token=0;
    this.video=document.createElement('video');this.video.muted=true;this.video.autoplay=true;this.video.playsInline=true;
    this.video.setAttribute('aria-label','Mirrored camera preview');this.video.className='camera-preview';
    this.active=false;this.key=null;this.allowed=false;this.progress=0;this.liveScore=null;this.permissionDenied=false;
  }
  get setup(){return this.stage==='loading'||this.stage==='calibrating';}
  mount(host){if(host)host.append(this.video);}
  notify(){this.onChange();}
  sync({key,active,allowed}){
    // A frame captured before a pause must not be accepted after focus returns.
    if(this.active&&!active)this.token++;
    this.allowed=allowed;this.active=active;
    if(!allowed&&this.stage!=='off'){this.stop();return;}
    if(this.key!==key){this.key=key;this.token++;this.summary=null;this.expressionSummary=null;this.liveExpression=null;this.liveScore=null;}
    if(!active){this.summary?.gap();this.expressionSummary?.gap();this.liveExpression=null;this.calibrationFrames=[];this.calibrationStart=null;}
    for(const track of this.stream?.getVideoTracks()||[])track.enabled=active;
  }
  async start(){
    if(this.stage!=='off'||!this.allowed)return;
    this.permissionDenied=false;
    if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!globalThis.Worker||!globalThis.createImageBitmap||!globalThis.OffscreenCanvas){this.message='Camera measurements need a supported browser on HTTPS or localhost. Practice and check-ins still work.';this.notify();return;}
    const generation=++this.generation;
    this.stage='loading';this.message='Waiting for camera permission…';this.notify();
    try{
      const stream=await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      if(generation!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
      this.stream=stream;
      for(const track of stream.getVideoTracks())track.enabled=this.active;
      for(const track of stream.getTracks())track.addEventListener('ended',()=>{if(generation===this.generation)this.stop('Camera disconnected. Enable it again to recalibrate.');});
      this.video.srcObject=stream;await this.video.play();
      if(generation!==this.generation)return;
      this.message='Loading camera…';this.notify();
      this.worker=new Worker(new URL('./face-worker.mjs',import.meta.url),{type:'module'});
      this.worker.onerror=()=>{if(generation===this.generation)this.stop('The movement model could not start in this browser. You can continue without the camera.');};
      this.worker.onmessage=({data})=>{
        if(generation!==this.generation)return;
        if(data.type==='error'){this.stop('Camera processing stopped. Try enabling it again, or continue without it.');return;}
        if(data.type==='ready'){
          clearTimeout(this.loadTimeout);this.stage='uncalibrated';this.message='';
          this.interval=setInterval(()=>this.capture(),200);this.notify();return;
        }
        if(data.type==='sample'){
          this.inFlight=false;
          if(data.token!==this.token||!this.active)return;
          this.receive(data);
        }
      };
      this.loadTimeout=setTimeout(()=>{if(generation===this.generation)this.stop('The local model took too long to load. Try again or continue without it.');},40000);
      this.worker.postMessage({type:'init'});
    }catch(error){
      if(generation!==this.generation)return;
      this.permissionDenied=error.name==='NotAllowedError';
      this.stop(error.name==='NotAllowedError'?'Camera permission was not granted. Practice and emotion check-ins are still available.':error.name==='NotFoundError'?'No camera was found. Practice and emotion check-ins are still available.':'The camera could not be opened. Check that it is available, or continue without it.');
    }
  }
  beginCalibration(){
    if(!['uncalibrated','ready'].includes(this.stage))return;
    this.token++;this.baseline=null;this.summary=null;this.expressionSummary=null;this.liveExpression=null;this.liveScore=null;this.calibrationFrames=[];this.calibrationStart=null;this.progress=0;
    this.stage='calibrating';this.message='Rest comfortably and look at the camera (~6 seconds). Timer paused.';this.notify();
  }
  async capture(){
    if(!this.active||!['ready','calibrating'].includes(this.stage)||this.inFlight||this.video.readyState<2)return;
    const generation=this.generation,token=this.token,at=performance.now();this.inFlight=true;
    try{
      const frame=await createImageBitmap(this.video);
      if(generation!==this.generation||token!==this.token||!this.active){frame.close();if(generation===this.generation)this.inFlight=false;return;}
      this.worker.postMessage({type:'frame',frame,token,at},[frame]);
      clearTimeout(this.frameTimeout);
      this.frameTimeout=setTimeout(()=>{if(generation===this.generation&&this.inFlight)this.stop('Camera processing stopped responding. Enable it again to recalibrate.');},10000);
    }catch{if(generation===this.generation)this.stop('This browser could not process a camera frame. You can continue without the camera.');}
  }
  receive({values,expressions,reason,at}){
    clearTimeout(this.frameTimeout);
    if(!values){
      this.summary?.gap();this.expressionSummary?.gap();this.liveExpression=null;this.liveScore=null;this.calibrationFrames=[];this.calibrationStart=null;this.progress=0;
      this.message=reason==='multiple-faces'?'More than one face is visible. Measurements are paused.':reason==='position'?'Move into view with your whole face comfortably inside the preview.':'No usable face measurement. Face the camera in even lighting.';
      this.notify();return;
    }
    if(this.stage==='calibrating'){
      if(this.calibrationLast!=null&&at-this.calibrationLast>750){this.calibrationFrames=[];this.calibrationStart=null;}
      this.calibrationLast=at;this.calibrationStart??=at;this.calibrationFrames.push(values);
      this.progress=Math.min(100,Math.floor(100*Math.min(this.calibrationFrames.length/CALIBRATION_SAMPLES,(at-this.calibrationStart)/5000)));
      this.message='Rest comfortably and look at the camera (~6 seconds). Timer paused.';
      if(this.calibrationFrames.length>=CALIBRATION_SAMPLES&&at-this.calibrationStart>=5000){
        try{this.baseline=calibrate(this.calibrationFrames,crypto.randomUUID());this.stage='ready';this.message='';}
        catch(error){this.stage='uncalibrated';this.message=error.message;}
        this.calibrationFrames=[];this.calibrationStart=null;this.notify();return;
      }
    }else if(this.stage==='ready'&&this.key){
      this.summary??=new MovementSummary(this.baseline);
      this.liveScore=this.summary.add(values,at);this.message='';
      this.expressionSummary??=new ExpressionSummary(this.baseline.id);
      this.expressionSummary.add(expressions,this.liveScore,at);this.liveExpression=expressionLabel(expressions);
    }
    this.notify();
  }
  finish(){
    this.token++;const value=this.summary?.finish()||null;this.summary=null;this.expressionSummary=null;this.liveExpression=null;this.liveScore=null;return value;
  }
  finishExpression(){const value=this.expressionSummary?.finish()||null;this.expressionSummary=null;return value;}
  stop(message=''){
    this.generation++;this.token++;
    clearInterval(this.interval);clearTimeout(this.loadTimeout);clearTimeout(this.frameTimeout);
    this.worker?.terminate();this.worker=null;
    this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.video.pause();this.video.srcObject=null;
    this.baseline=null;this.summary=null;this.expressionSummary=null;this.liveExpression=null;this.calibrationFrames=[];this.calibrationStart=null;this.calibrationLast=null;this.inFlight=false;this.liveScore=null;this.progress=0;this.stage='off';this.message=message;
    this.notify();
  }
}
