export const NOTES_KEY='calculus-clinic-notes-v1';
export const NOTE_LIMIT=10000;
export class PracticeNotes {
  constructor(storage,conceptIds){this.storage=storage;this.ids=new Set(conceptIds);this.notes={};this.saved=true;this.readable=true;this.load();}
  read(){
    const raw=this.storage.getItem(NOTES_KEY);if(raw===null)return {};
    const data=JSON.parse(raw);
    if(data?.version!==1||!data.notes||typeof data.notes!=='object'||Array.isArray(data.notes))throw new Error('Invalid saved notes.');
    return Object.fromEntries(Object.entries(data.notes).filter(([id,note])=>this.ids.has(id)&&typeof note==='string'&&note.length<=NOTE_LIMIT));
  }
  load(){try{this.notes=this.read();this.saved=true;this.readable=true;}catch{this.saved=false;this.readable=false;}}
  get(id){return this.notes[id]||'';}
  set(id,value){
    if(!this.ids.has(id))return false;
    const text=String(value).slice(0,NOTE_LIMIT);this.notes[id]=text;
    try{
      if(!this.readable)throw new Error('Saved notes could not be read.');
      // Merge the latest other-concept notes so another tab's work is retained.
      const notes={...this.read(),...this.unsaved,[id]:text};
      if(!text)delete notes[id];
      this.storage.setItem(NOTES_KEY,JSON.stringify({version:1,notes}));
      this.notes=notes;this.unsaved={};this.saved=true;
    }catch{this.unsaved={...this.unsaved,[id]:text};this.saved=false;}
    return this.saved;
  }
  clear(){this.storage.removeItem(NOTES_KEY);this.notes={};this.unsaved={};this.saved=true;this.readable=true;}
}
