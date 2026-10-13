// Subsets reuse stable concept/question IDs, so practice evidence follows a
// concept across paths. These bridges are authored teaching dependencies, not
// prerequisite claims made by TEKS or the AP framework.
export const SUBSETS={
  CALC_SUBSET:{
    targetId:'1.6',
    // A bounded experimental path. Broad foundation groups stand in for the
    // earlier arithmetic chain; full courses retain their complete ontology.
    conceptIds:[
      'MATH_025','MATH_030','MATH_056','MATH_057','MATH_058',
      'MATH_080','MATH_081','MATH_082',
      'F01','F02','F04','F05','1.2','1.5','1.6'
    ],
    bridges:[
      ['MATH_058','F01','Use radical and rational-power rules with their real-domain restrictions.'],
      ['MATH_057','F02','Factor trinomials and differences of squares before cancelling common factors.'],
      ['MATH_081','F02','Factor higher-degree expressions, including differences of cubes.'],
      ['MATH_082','F02','Simplify rational expressions without restoring excluded inputs.'],
      // Retain direct skill-to-application links as well as the broader F02
      // review group, making the Algebra I/II route visible at the target node.
      ['MATH_057','1.6','Factor a quadratic numerator or denominator to remove a shared zero factor near the limit point.'],
      ['MATH_081','1.6','Use cube identities and polynomial factoring for higher-degree removable limit forms.'],
      ['MATH_082','1.6','Cancel common factors and combine complex fractions for x near, but not equal to, the limit point.']
    ]
  }
};

export function assembleSubsets(concepts,relationships,definitions=SUBSETS){
  const byId=new Map(concepts.map(c=>[c.id,c])),memberships=new Map(concepts.map(c=>[c.id,[]]));
  const bridges=Object.entries(definitions).flatMap(([course,subset])=>subset.bridges.map(([source,target,rationale])=>({
    source,target,type:'prerequisite',rationale,courses:[course],
    provenance:'Author-designed cross-course instructional dependency; not specified by TEKS or College Board',requiredFor:'subset approach'
  })));
  const edges=[...relationships,...bridges];
  for(const [course,subset] of Object.entries(definitions)){
    const bounds=subset.conceptIds?new Set(subset.conceptIds):null;
    if(bounds){
      for(const id of bounds)if(!byId.has(id))throw new Error(`Unknown subset concept: ${id}`);
      if(!bounds.has(subset.targetId))throw new Error(`Subset must include target: ${subset.targetId}`);
    }
    const parents=new Map(concepts.map(c=>[c.id,[]]));
    for(const e of edges){
      if(e.courses&&!e.courses.includes(course))continue;
      if(!byId.has(e.source)||!byId.has(e.target))throw new Error(`Unknown subset endpoint: ${e.source} → ${e.target}`);
      if(bounds&&(!bounds.has(e.source)||!bounds.has(e.target)))continue;
      if(e.type==='prerequisite')parents.get(e.target).push(e.source);
    }
    const visited=new Set(),visiting=new Set();
    function visit(id){
      if(!byId.has(id))throw new Error(`Unknown subset target: ${id}`);
      if(visiting.has(id))throw new Error(`Cyclic subset prerequisite: ${id}`);
      if(visited.has(id))return;
      visiting.add(id);
      for(const parent of parents.get(id))visit(parent);
      visiting.delete(id);visited.add(id);memberships.get(id).push(course);
    }
    visit(subset.targetId);
    if(bounds)for(const id of bounds)if(!visited.has(id))throw new Error(`Subset concept does not lead to ${subset.targetId}: ${id}`);
    for(const e of bridges.filter(e=>e.courses.includes(course)))if(!visited.has(e.source)||!visited.has(e.target))throw new Error(`Subset bridge does not lead to ${subset.targetId}: ${e.source} → ${e.target}`);
  }
  return {concepts:concepts.map(c=>({...c,subsets:memberships.get(c.id)})),relationships:edges};
}
