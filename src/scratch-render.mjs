import {PAPER} from './scratch-data.mjs';

// One renderer for the live pad, PNG download and PDF snapshots. Erasing removes
// ink from its own layer so the paper and dots remain intact in every export.
export function renderScratch(canvas,strokes,width,height,dpr=1){
  canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
  const ctx=canvas.getContext('2d'),scale=Math.min(canvas.width/PAPER.width,canvas.height/PAPER.height);
  ctx.fillStyle='#fffef9';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.translate((canvas.width-PAPER.width*scale)/2,(canvas.height-PAPER.height*scale)/2);ctx.scale(scale,scale);
  ctx.fillStyle='#d7e2d4';for(let x=20;x<PAPER.width;x+=40)for(let y=20;y<PAPER.height;y+=40){ctx.beginPath();ctx.arc(x,y,1.3,0,Math.PI*2);ctx.fill();}
  const ink=document.createElement('canvas');ink.width=Math.ceil(PAPER.width*scale);ink.height=Math.ceil(PAPER.height*scale);const ic=ink.getContext('2d');ic.scale(scale,scale);ic.lineCap='round';ic.lineJoin='round';
  for(const s of strokes){
    ic.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';ic.strokeStyle=s.color;ic.fillStyle=s.color;ic.lineWidth=s.width;
    if(s.points.length===1){ic.beginPath();ic.arc(...s.points[0],s.width/2,0,Math.PI*2);ic.fill();}
    else{ic.beginPath();s.points.forEach((p,i)=>i?ic.lineTo(...p):ic.moveTo(...p));ic.stroke();}
  }
  ctx.drawImage(ink,0,0,PAPER.width,PAPER.height);
}
