export const COURSE_KEY='calculus-clinic-course-v1';
export const COURSES={
  AB:{title:'AP Calculus AB',description:'Limits, derivatives, integrals, and differential equations.'},
  BC:{title:'AP Calculus BC',description:'Everything in AB, plus parametric and polar calculus and infinite series.'}
};
export function readCourse(storage){
  try{const saved=JSON.parse(storage.getItem(COURSE_KEY));return saved?.version===1&&typeof saved.course==='string'&&Object.hasOwn(COURSES,saved.course)?saved.course:null;}
  catch{return null;}
}
export function saveCourse(storage,course){
  if(typeof course!=='string'||!Object.hasOwn(COURSES,course))throw new Error('Choose AP Calculus AB or BC.');
  try{storage.setItem(COURSE_KEY,JSON.stringify({version:1,course}));return true;}
  catch{return false;}
}
