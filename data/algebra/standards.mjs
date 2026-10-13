// Original summaries of the currently linked TEA high-school TEKS, not quotations.
export const TEKS_URL='https://tea.texas.gov/laws-and-rules/sboe-rules-tac/sboe-tac-currently-effect/ch111c.pdf';
const raw=`
A|1A|Apply mathematics in context|20,45,63
A|1B|Plan, solve, justify, and assess reasonableness|34,61
A|1C|Select tools, estimation, and technology|55,62,64
A|1D|Communicate using multiple representations|40,42,59
A|1E|Create and use representations|45,63,65
A|1F|Analyze mathematical relationships|50,57,59
A|1G|Explain and justify using precise language|30,55,61
A|2A|Linear domain and range in continuous or discrete contexts|49
A|2B|Write lines in three standard forms|50
A|2C|Write lines from tables, graphs, or descriptions|45,50
A|2D|Write direct-variation equations|39
A|2E|Parallel line through a point|50
A|2F|Perpendicular line through a point|50
A|2G|Horizontal and vertical lines|50
A|2H|Write two-variable linear inequalities|53
A|2I|Write systems from representations|46,47
A|3A|Calculate slope from representations|41
A|3B|Interpret rates of change in context|40,41,45
A|3C|Graph lines and identify intercepts, zeros, and slope|42
A|3D|Graph two-variable linear inequalities|53
A|3E|Transform the linear parent function|51
A|3F|Graph solutions of two-equation systems|48
A|3G|Estimate contextual system solutions graphically|48
A|3H|Graph systems of two linear inequalities|54
A|4A|Use correlation to interpret linear association|55
A|4B|Distinguish association and causation|55
A|4C|Fit linear models and predict|55
A|5A|Solve one-variable linear equations|34
A|5B|Solve one-variable linear inequalities|35,36
A|5C|Solve two-equation linear systems|47
A|6A|Quadratic domain and range|59
A|6B|Write quadratics from a vertex and point|60
A|6C|Write quadratics from zeros or graphs|60
A|7A|Read quadratic graph features|59
A|7B|Relate factors to zeros|57,61
A|7C|Transform quadratic functions|59
A|8A|Solve real quadratics using four methods|61
A|8B|Use quadratic regression and predict|62
A|9A|Exponential domain and range|63
A|9B|Interpret exponential parameters|63
A|9C|Write growth and decay models|63
A|9D|Graph exponentials, intercepts, and asymptotes|63
A|9E|Use exponential regression and predict|64
A|10A|Add and subtract degree-one and degree-two polynomials|56
A|10B|Multiply degree-one and degree-two polynomials|56
A|10C|Divide degree-one and degree-two polynomials|56
A|10D|Use distribution to rewrite polynomials|30,56
A|10E|Factor trinomials including perfect squares|57
A|10F|Factor differences of squares|57
A|11A|Simplify numerical square-root radicals|58
A|11B|Use integer and rational exponent laws|22,58
A|12A|Determine whether a relation is a function|43
A|12B|Evaluate functions in function notation|44
A|12C|Calculate recursively defined sequence terms|65
A|12D|Write nth terms for arithmetic and geometric sequences|65
A|12E|Solve literal equations for a variable|52
A2|1A|Apply mathematics in context|72,78,84
A2|1B|Plan, solve, justify, and assess reasonableness|75,78,84
A2|1C|Select tools, estimation, and technology|71,85,86
A2|1D|Communicate using multiple representations|67,74,83
A2|1E|Create and use representations|72,77,85
A2|1F|Analyze mathematical relationships|66,81,83
A2|1G|Explain and justify using precise language|66,75,85
A2|2A|Graph parent functions and describe their features|67,68,69,74,77,83
A2|2B|Write and graph inverses|66
A2|2C|Describe inverse pairs and domain restrictions|66,77
A2|2D|Verify inverses by composition with domains|66
A2|3A|Formulate three-variable and linear-quadratic systems|71,72
A2|3B|Solve three-variable linear systems|71
A2|3C|Solve linear-quadratic systems algebraically|72
A2|3D|Check reasonableness of linear-quadratic solutions|72
A2|3E|Formulate systems of linear inequalities|54
A2|3F|Solve systems of linear inequalities|54
A2|3G|Identify feasible points|54
A2|4A|Write a quadratic through three points|86
A2|4B|Write parabolas using focus, directrix, and vertex|73
A2|4C|Transform square-root functions|74
A2|4D|Complete the square to obtain vertex form|60
A2|4E|Use technology to model quadratic or square-root data|86
A2|4F|Solve quadratic and square-root equations|61,75
A2|4G|Identify extraneous square-root solutions|75
A2|4H|Solve quadratic inequalities|76
A2|5A|Transform exponential and logarithmic functions|77
A2|5B|Model situations with exponential or logarithmic equations|78
A2|5C|Convert between exponential and logarithmic forms|77
A2|5D|Solve exponential and single-log equations|78
A2|5E|Check reasonableness of logarithmic solutions|78
A2|6A|Transform cubic and cube-root functions|68
A2|6B|Solve cube-root equations|75
A2|6C|Transform absolute-value functions|69
A2|6D|Write absolute-value equations|70
A2|6E|Solve absolute-value linear equations|70
A2|6F|Solve absolute-value linear inequalities|70
A2|6G|Transform reciprocal functions|83
A2|6H|Write rational equations in context|84
A2|6I|Solve rational equations|84
A2|6J|Check reasonableness of rational solutions|84
A2|6K|Connect rational domains, asymptotes, and range|83
A2|6L|Write and solve inverse-variation models|84
A2|7A|Add, subtract, and multiply complex numbers|79
A2|7B|Add, subtract, and multiply polynomials|56,80
A2|7C|Divide degree-three and degree-four polynomials|80
A2|7D|Determine linear factors of cubics and quartics|81
A2|7E|Factor cubics and quartics using grouping and cube identities|81
A2|7F|Operate on rational expressions|82
A2|7G|Simplify radical expressions with variables|58,75
A2|7H|Solve equations with rational exponents|75
A2|7I|Express domain and range in three notations|67
A2|8A|Select linear, quadratic, or exponential models|85
A2|8B|Use technology to fit regression models|85
A2|8C|Predict and critically judge models|85
`.trim();
export const algebraId=n=>`MATH_${String(n).padStart(3,'0')}`;
export const standards=raw.split('\n').map(line=>{
 const [prefix,code,summary,nodes]=line.split('|');
 const [,section,letter]=/^(\d+)([A-Z])$/.exec(code);
 return {id:`${prefix}.${code}`,course:prefix==='A'?'ALG1':'ALG2',reference:`§111.${prefix==='A'?'39':'40'}(c)(${section})(${letter})`,summary,kind:section==='1'?'process':'content',conceptIds:nodes.split(',').map(algebraId),sourceUrl:TEKS_URL,coverage:section==='1'?'Supporting selected-response practice; extended reasoning and tool use require additional work':'Concept and sampled practice alignment'};
});
