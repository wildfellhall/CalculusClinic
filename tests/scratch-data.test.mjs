import test from 'node:test';
import assert from 'node:assert/strict';
import {ScratchData,SCRATCH_PREFIX,INKS,MAX_POINTS,validateScratchSnapshot} from '../src/scratch-data.mjs';
import {validateAttempts,validateBackup,mergeAttempts} from '../src/core.mjs';
import {questions,COMPATIBLE_BANK_VERSIONS,BANK_VERSION} from '../data/questions.mjs';
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
test('Answer snapshots retain the exact pen and eraser work through later drawing, clearing, undo and deletion',()=>{
 const data=new ScratchData(storage(),['a','b']);data.add('a',stroke());data.add('a',stroke('eraser'));
 const first=data.snapshot('a'),expected=structuredClone(first);data.add('a',{...stroke(),color:INKS[1]});const retry=data.snapshot('a');
 data.eraseAll('a');const empty=data.snapshot('a');data.undo('a');data.clear();
 assert.deepEqual(first,expected);assert.equal(retry.strokes.length,3);assert.deepEqual(empty,{version:1,strokes:[]});assert.deepEqual(data.snapshot('b'),empty);
});
test('Snapshots capture unsaved in-memory drawing but do not mislabel unreadable storage as a blank pad',()=>{
 const store=storage();store.setItem(SCRATCH_PREFIX+'a','broken');const data=new ScratchData(store,['a','b']);assert.equal(data.snapshot('a'),null);
 store.setItem=()=>{throw Error('Quota');};data.add('b',stroke());assert.equal(data.page('b').saved,false);assert.deepEqual(data.snapshot('b').strokes,[stroke()]);
});
test('Snapshot validation strips extra fields and rejects invalid drawing formats and oversized data',()=>{
 const input={version:1,strokes:[{...stroke(),extra:'ignored'}],image:'https://example.invalid/image'};
 const clean=validateScratchSnapshot(input);assert.deepEqual(clean,{version:1,strokes:[stroke()]});clean.strokes[0].points[0][0]=90;assert.equal(input.strokes[0].points[0][0],20);
 for(const bad of [null,{},'data:image/png;base64,bad',{version:2,strokes:[]},{version:1,strokes:[{...stroke(),tool:'image'}]},{version:1,strokes:[{...stroke(),points:[[1001,0]]}]},{version:1,strokes:[{...stroke(),points:Array(MAX_POINTS+1).fill([0,0])}]}])assert.throws(()=>validateScratchSnapshot(bad),/scratch-pad snapshot/);
});
test('Backups preserve distinct retry snapshots and blank pads while legacy attempts remain without a snapshot',()=>{
 const q=questions[0],make=(id,scratchSnapshot)=>({id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-15T12:00:00.000Z',sessionId:'qa',...(scratchSnapshot?{scratchSnapshot}:{})});
 const first=make('first',{version:1,strokes:[stroke()]}),retry=make('retry',{version:1,strokes:[stroke('eraser')]}),empty=make('empty',{version:1,strokes:[]}),legacy=make('legacy');
 const saved=[first,retry,empty,legacy],restored=validateBackup(JSON.parse(JSON.stringify({schemaVersion:1,bankVersion:BANK_VERSION,attempts:saved})),questions,COMPATIBLE_BANK_VERSIONS);
 assert.deepEqual(restored,saved);assert.ok(!Object.hasOwn(restored[3],'scratchSnapshot'));assert.deepEqual(mergeAttempts([first],restored).find(a=>a.id==='first'),first);
 restored[0].scratchSnapshot.strokes[0].points[0][0]=99;assert.equal(first.scratchSnapshot.strokes[0].points[0][0],20);
 assert.throws(()=>validateAttempts([{...first,scratchSnapshot:{version:99,strokes:[]}}],questions),/scratch-pad snapshot/);
});
