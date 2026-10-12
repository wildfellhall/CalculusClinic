// Device-local consent is separate from practice backups and scoring settings.
export const CAMERA_ACCESS_KEY='calculus-clinic-camera-v1';
export const CAMERA_CONSTRAINTS={video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:15,max:24}},audio:false};
const disabled=()=>({version:1,enabled:false,asked:true});
export function cameraPreference(raw,{fresh=false}={}){
  if(raw===null)return fresh?{version:1,enabled:true,asked:false}:disabled();
  try{const p=JSON.parse(raw);if(p.version===1&&typeof p.enabled==='boolean'&&typeof p.asked==='boolean')return {version:1,enabled:p.enabled,asked:p.asked};}catch{}
  return disabled();
}
export class CameraAccess{
  constructor({storage,mediaDevices,permissions,secure=true,onChange=()=>{},onRevoke=()=>{}}){
    Object.assign(this,{storage,mediaDevices,permissions,secure,onChange,onRevoke});
    this.permission='unknown';this.pending=false;this.initialized=false;this.generation=0;this.message='';this.storageWarning='';
    try{this.preference=cameraPreference(storage.getItem(CAMERA_ACCESS_KEY),{fresh:true});}
    catch{this.preference=disabled();this.storageWarning='Camera preferences could not be read. Enable the camera manually for this visit.';}
  }
  get enabled(){return this.preference.enabled;}
  get canStart(){return this.initialized&&this.enabled&&!this.pending&&['granted','unknown'].includes(this.permission);}
  save(){try{this.storage.setItem(CAMERA_ACCESS_KEY,JSON.stringify(this.preference));this.storageWarning='';}catch{this.storageWarning='This browser could not save your camera choice. It applies to this visit only.';}}
  initialize(){return this.initialization??=this.initializeOnce();}
  async initializeOnce(){
    const generation=this.generation;
    try{
      this.status=await this.permissions?.query({name:'camera'});
      if(this.status){this.permission=this.status.state;this.status.addEventListener('change',()=>this.permissionChanged());}
    }catch{/* Some browsers do not support querying camera permissions. */}
    this.initialized=true;
    if(generation!==this.generation)return;
    if(!this.preference.asked&&this.enabled){await this.request();return;}
    if(this.enabled&&['denied','prompt'].includes(this.permission)){this.revoke(this.permission==='denied'?'Camera access is blocked in your browser. Change its site permission before enabling it.':'Browser permission needs to be granted again. Enable the camera when ready.');return;}
    this.onChange();
  }
  async request(){
    if(this.pending)return false;
    const generation=++this.generation;
    this.preference={version:1,enabled:true,asked:true};this.pending=true;this.message='Waiting for camera permission…';this.save();this.onChange();
    try{
      if(!this.secure||!this.mediaDevices?.getUserMedia)throw Object.assign(new Error(),{name:'UnsupportedError'});
      const stream=await this.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      // Permission is requested at entry, but collection belongs to practice.
      stream.getTracks().forEach(track=>track.stop());
      if(generation!==this.generation||!this.enabled)return false;
      this.permission='granted';this.message='';this.pending=false;this.save();this.onChange();return true;
    }catch(error){
      if(generation!==this.generation)return false;
      if(error.name==='NotAllowedError')this.permission='denied';
      this.revoke(error.name==='NotAllowedError'?'Camera permission was not granted. You can enable it later in Settings.':error.name==='NotFoundError'?'No camera was found. Connect one, then enable it in Settings.':error.name==='UnsupportedError'?'Camera access needs a supported browser on HTTPS or localhost.':'The camera could not be opened. Check that it is available, then try again.');
      return false;
    }
  }
  revoke(message='Camera access is off in this app.'){
    this.generation++;this.pending=false;this.preference=disabled();this.message=message;this.save();this.onRevoke();this.onChange();
  }
  permissionChanged(){
    const previous=this.permission;this.permission=this.status.state;
    if(this.permission==='denied'||(previous==='granted'&&this.permission!=='granted')){this.revoke('Browser camera permission was removed. Enable it again when ready.');return;}
    // A browser grant alone never overrides an in-app opt-out.
    this.onChange();
  }
  syncFromStorage(){
    try{this.preference=cameraPreference(this.storage.getItem(CAMERA_ACCESS_KEY));}
    catch{this.preference=disabled();}
    if(!this.enabled){this.generation++;this.pending=false;this.message='Camera access was turned off in another tab.';this.onRevoke();}
    this.onChange();
  }
  cancelPending(){if(this.pending)this.revoke('Camera permission request cancelled. Enable it again when ready.');}
}
