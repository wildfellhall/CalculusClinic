// Subsets reuse stable concept/question IDs, so practice evidence follows a
// concept across paths. These bridges are authored teaching dependencies, not
// prerequisite claims made by TEKS or the AP framework.
export const SUBSETS={
  CALC_SUBSET:{
    targetId:'1.6',
    bridges:[
      ['MATH_015','F01','Use signed fraction arithmetic when simplifying expressions.'],
      ['MATH_022','F01','Apply integer exponent laws to algebraic expressions.'],
      ['MATH_058','F01','Use radical and rational-power rules with their real-domain restrictions.'],
      ['MATH_057','F02','Factor trinomials and differences of squares before cancelling common factors.'],
      ['MATH_081','F02','Factor higher-degree expressions, including differences of cubes.'],
      ['MATH_082','F02','Simplify rational expressions without restoring excluded inputs.'],
      ['MATH_034','F03','Solve linear equations to locate zeros and excluded inputs.'],
      ['MATH_036','F03','Solve inequalities and express sign conditions as intervals.'],
      ['MATH_061','F03','Find quadratic roots to divide a sign chart into intervals.'],
      ['MATH_044','F04','Evaluate function notation by substituting into the input expression.'],
      ['MATH_049','F04','Interpret allowed inputs and outputs before extending domain reasoning to other function families.'],
      ['MATH_051','F05','Read shifts, reflections and stretches before interpreting transformed and piecewise graphs.'],
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
    const parents=new Map(concepts.map(c=>[c.id,[]]));
    for(const e of edges){
      if(e.courses&&!e.courses.includes(course))continue;
      if(!byId.has(e.source)||!byId.has(e.target))throw new Error(`Unknown subset endpoint: ${e.source} → ${e.target}`);
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
    for(const e of bridges.filter(e=>e.courses.includes(course)))if(!visited.has(e.source)||!visited.has(e.target))throw new Error(`Subset bridge does not lead to ${subset.targetId}: ${e.source} → ${e.target}`);
  }
  return {concepts:concepts.map(c=>({...c,subsets:memberships.get(c.id)})),relationships:edges};
}
