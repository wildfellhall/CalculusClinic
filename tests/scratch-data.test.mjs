import test from 'node:test';
import assert from 'node:assert/strict';
import {ScratchData,SCRATCH_PREFIX,INKS,MAX_POINTS} from '../src/scratch-data.mjs';
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
const stroke=(tool='pen')=>({tool,color:INKS[0],width:5,points:[[20,30],[50,80]]});
test('Drawings, including eraser strokes, persist per concept across reloads',()=>{
 const store=storage(),data=new ScratchData(store,['a','b']);data.add('a',stroke());data.add('a',stroke('eraser'));data.add('b',stroke());
 const loaded=new ScratchData(store,['a','b']);assert.equal(loaded.page('a').strokes.length,2);assert.equal(loaded.page('a').strokes[1].tool,'eraser');assert.equal(loaded.page('b').strokes.length,1);
});
test('Undo/redo includes erasing and clearing; a new stroke invalidates redo',()=>{
 const data=new ScratchData(storage(),['a']);data.add('a',stroke());data.add('a',stroke('eraser'));data.undo('a');assert.equal(data.page('a').strokes.length,1);data.redo('a');assert.equal(data.page('a').strokes.length,2);
 data.eraseAll('a');assert.equal(data.page('a').strokes.length,0);data.undo('a');assert.equal(data.page('a').strokes.length,2);data.redo('a');assert.equal(data.page('a').strokes.length,0);
 data.undo('a');data.add('a',stroke());assert.equal(data.page('a').redo.length,0);
});
test('Drawings from different concepts are retained when multiple tabs save',()=>{
 const store=storage(),first=new ScratchData(store,['a','b']),second=new ScratchData(store,['a','b']);first.add('a',stroke());second.add('b',stroke());
 const loaded=new ScratchData(store,['a','b']);assert.equal(loaded.page('a').strokes.length,1);assert.equal(loaded.page('b').strokes.length,1);
});
test('Storage failure preserves the drawing and undo in memory and reports unsaved work',()=>{
 const store=storage(),data=new ScratchData(store,['a']),save=store.setItem;store.setItem=()=>{throw new Error('Quota');};data.add('a',stroke());assert.equal(data.page('a').saved,false);assert.equal(data.page('a').strokes.length,1);
 data.undo('a');assert.equal(data.page('a').strokes.length,0);data.redo('a');store.setItem=save;data.save('a');assert.equal(new ScratchData(store,['a']).page('a').strokes.length,1);assert.equal(data.page('a').saved,true);
});
test('Corrupt storage is preserved; malformed or oversized strokes are rejected',()=>{
 const store=storage();store.setItem(SCRATCH_PREFIX+'a','not json');const data=new ScratchData(store,['a']);data.add('a',stroke());assert.equal(data.page('a').saved,false);assert.equal(store.getItem(SCRATCH_PREFIX+'a'),'not json');
 for(const bad of [{...stroke(),points:[[Infinity,0]]},{...stroke(),points:[[-1,20]]},{...stroke(),color:'bad'},{...stroke(),points:Array(MAX_POINTS+1).fill([0,0])}])assert.equal(data.add('a',bad),false);
 assert.throws(()=>data.page('unknown'));
});
test('Saved stroke data is isolated from mutable input; deletion removes all drawings and undo history',()=>{
 const store=storage(),data=new ScratchData(store,['a','b']),s=stroke();data.add('a',s);s.points[0][0]=99;assert.equal(data.page('a').strokes[0].points[0][0],20);data.add('b',stroke());data.clear();
 for(const id of ['a','b']){assert.equal(store.getItem(SCRATCH_PREFIX+id),null);assert.equal(data.page(id).strokes.length,0);assert.equal(data.page(id).undo.length,0);}
});
