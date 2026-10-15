import test from 'node:test';
import assert from 'node:assert/strict';
import {PracticeNotes,NOTES_KEY,NOTE_LIMIT} from '../src/practice-notes.mjs';
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};

test('Notes persist per concept across reloads and are independent of question attempts',()=>{
 const store=storage(),notes=new PracticeNotes(store,['a','b']);notes.set('a','x² − 1 = (x − 1)(x + 1)\nNext step…');notes.set('b','A different skill');
 const restored=new PracticeNotes(store,['a','b']);assert.equal(restored.get('a'),notes.get('a'));assert.equal(restored.get('b'),'A different skill');
 assert.deepEqual(Object.keys(JSON.parse(store.getItem(NOTES_KEY))).sort(),['notes','version']);
});
test('Concurrent tabs keep other-concept notes when they save',()=>{
 const store=storage(),a=new PracticeNotes(store,['a','b']),b=new PracticeNotes(store,['a','b']);
 a.set('a','first');b.set('b','second');a.set('a','updated');b.load();assert.equal(b.get('a'),'updated');assert.equal(b.get('b'),'second');
});
test('Unavailable storage retains working notes in memory and accurately reports save failure',()=>{
 const store=storage(),notes=new PracticeNotes(store,['a','b']),save=store.setItem;
 store.setItem=()=>{throw new Error('Quota exceeded');};assert.equal(notes.set('a','work to keep'),false);assert.equal(notes.get('a'),'work to keep');
 notes.set('b','more work');store.setItem=save;assert.equal(notes.set('a','updated work'),true);
 const restored=new PracticeNotes(store,['a','b']);assert.equal(restored.get('a'),'updated work');assert.equal(restored.get('b'),'more work');
});
test('Corrupt saved data is preserved until an explicit clear; oversized or unknown notes are bounded',()=>{
 const store=storage();store.setItem(NOTES_KEY,'not json');const notes=new PracticeNotes(store,['a']);
 assert.equal(notes.saved,false);notes.set('a','session only');assert.equal(store.getItem(NOTES_KEY),'not json');assert.equal(notes.get('a'),'session only');
 notes.clear();assert.equal(store.getItem(NOTES_KEY),null);assert.equal(notes.get('a'),'');assert.equal(notes.set('a','a'.repeat(NOTE_LIMIT+50)),true);assert.equal(notes.get('a').length,NOTE_LIMIT);
 assert.equal(notes.set('other','unknown'),false);assert.equal(notes.get('other'),'');
});
test('Clearing all notes removes persisted and session-only content',()=>{
 const store=storage(),notes=new PracticeNotes(store,['a','b']);notes.set('a','one');notes.set('b','two');notes.clear();
 assert.equal(notes.get('a'),'');assert.equal(notes.get('b'),'');assert.equal(new PracticeNotes(store,['a','b']).get('a'),'');assert.equal(store.getItem(NOTES_KEY),null);
});
