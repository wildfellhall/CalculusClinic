// Opt-in personal camera processing. No frame, crop or landmark leaves this worker.
import {FaceLandmarker,FilesetResolver} from '/vendor/mediapipe/vision_bundle.mjs';
import * as faceapi from '/vendor/face-api/face-api.esm.js';
import {movementVector} from './observations.mjs';
let landmarker;
const canvas=new OffscreenCanvas(112,112),context=canvas.getContext('2d',{willReadFrequently:true});
self.onmessage=async ({data})=>{
  if(data.type==='init'){
    try{
      const files=await FilesetResolver.forVisionTasks('/vendor/mediapipe/wasm',true);
      landmarker=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'/models/face-landmarker/face_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numFaces:2,minFaceDetectionConfidence:.65,minFacePresenceConfidence:.65,minTrackingConfidence:.65,outputFaceBlendshapes:true,outputFacialTransformationMatrixes:false});
      // Tensor inputs avoid DOM emulation and identity/age/gender model loading.
      faceapi.env.setEnv({Canvas:OffscreenCanvas,Image:class {},Video:class {},ImageData,fetch:globalThis.fetch.bind(globalThis),createCanvasElement:()=>new OffscreenCanvas(112,112)});
      await faceapi.tf.setBackend('cpu');await faceapi.tf.ready();
      await faceapi.nets.faceExpressionNet.loadFromUri('/models/face-expression');
      self.postMessage({type:'ready'});
    }catch(error){console.error('Movement model initialization failed',error);self.postMessage({type:'error'});}
  }
  if(data.type==='frame'){
    try{
      const result=landmarker.detectForVideo(data.frame,data.at);
      const count=result.faceLandmarks.length;
      let reason=count===0?'no-face':count>1?'multiple-faces':null,values=null,expressions=null;
      if(!reason){
        const points=result.faceLandmarks[0],xs=points.map(p=>p.x),ys=points.map(p=>p.y);
        const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
        if(minX<.02||maxX>.98||minY<.02||maxY>.98||maxX-minX<.15)reason='position';
        else {
          values=movementVector(result.faceBlendshapes[0]?.categories);if(!values)reason='unusable';
          if(values){
            const w=data.frame.width,h=data.frame.height,pad=.1*Math.max((maxX-minX)*w,(maxY-minY)*h);
            const left=Math.max(0,minX*w-pad),top=Math.max(0,minY*h-pad),right=Math.min(w,maxX*w+pad),bottom=Math.min(h,maxY*h+pad);
            context.drawImage(data.frame,left,top,right-left,bottom-top,0,0,112,112);
            const tensor=faceapi.tf.browser.fromPixels(context.getImageData(0,0,112,112));
            try{expressions=await faceapi.nets.faceExpressionNet.predictExpressions(tensor);}finally{tensor.dispose();context.clearRect(0,0,112,112);}
          }
        }
      }
      self.postMessage({type:'sample',token:data.token,at:data.at,values,expressions,reason});
    }catch(error){console.error('Movement frame processing failed',error);self.postMessage({type:'error'});}
    finally{data.frame.close();}
  }
};
