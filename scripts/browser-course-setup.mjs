// Enter the chosen curriculum through the same first-visit controls as a user.
export async function enterCourse(run,waitFor,course='BC'){
  await waitFor('!!document.querySelector(".course-onboarding, .explore-home")');
  await run(`document.querySelector('[data-action="choose-course"][data-course="${course}"]')?.click()`);
  await waitFor('!!document.querySelector(".explore-home")');
  await run(`(()=>{const el=document.querySelector('#course');if(el.value!==${JSON.stringify(course)}){el.value=${JSON.stringify(course)};el.dispatchEvent(new Event('change',{bubbles:true}));}})()`);
}
