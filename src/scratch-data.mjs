export const SCRATCH_PREFIX='calculus-clinic-scratch-v1:';
export const PAPER={width:1000,height:700};
export const INKS=['#294637','#365fa0','#b34e60'];
export const MAX_POINTS=40000,MAX_STROKES=500;
const validPoint=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=0&&p[0]<=PAPER.width&&p[1]>=0&&p[1]<=PAPER.height;
function validStrokes(strokes){
  return Array.isArray(strokes)&&strokes.length<=MAX_STROKES&&strokes.every(s=>s&&(s.tool==='pen'||s.tool==='eraser')&&INKS.includes(s.color)&&Number.isFinite(s.width)&&s.width>=1&&s.width<=80&&Array.isArray(s.points)&&s.points.length>0&&s.points.every(validPoint))&&strokes.reduce((n,s)=>n+s.points.length,0)<=MAX_POINTS;
}
export class ScratchData {
  constructor(storage,conceptIds){this.storage=storage;this.ids=new Set(conceptIds);this.pages=new Map();}
  page(id){
    if(!this.ids.has(id))throw new Error('Unknown scratch pad concept.');
    if(!this.pages.has(id)){
      const page={strokes:[],undo:[],redo:[],saved:true,readable:true};
      try{const raw=this.storage.getItem(SCRATCH_PREFIX+id);if(raw!==null){const value=JSON.parse(raw);if(value.version!==1||!validStrokes(value.strokes))throw new Error('Invalid drawing');page.strokes=value.strokes;}}
      catch{page.saved=false;page.readable=false;}
      this.pages.set(id,page);
    }
    return this.pages.get(id);
  }
  save(id){
    const page=this.page(id);
    try{if(!page.readable)throw new Error('Unreadable drawing');this.storage.setItem(SCRATCH_PREFIX+id,JSON.stringify({version:1,strokes:page.strokes}));page.saved=true;}
    catch{page.saved=false;}
  }
  edit(id,strokes){
    if(!validStrokes(strokes))return false;
    const page=this.page(id);page.undo.push(page.strokes);if(page.undo.length>40)page.undo.shift();page.strokes=strokes;page.redo=[];this.save(id);return true;
  }
  add(id,stroke){return this.edit(id,[...this.page(id).strokes,structuredClone(stroke)]);}
  eraseAll(id){if(this.page(id).strokes.length)this.edit(id,[]);}
  undo(id){const p=this.page(id);if(p.undo.length){p.redo.push(p.strokes);p.strokes=p.undo.pop();this.save(id);}}
  redo(id){const p=this.page(id);if(p.redo.length){p.undo.push(p.strokes);p.strokes=p.redo.pop();this.save(id);}}
  clear(){for(const id of this.ids)this.storage.removeItem(SCRATCH_PREFIX+id);this.pages.clear();}
}
