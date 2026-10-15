// Finer diagnostic skills within TEKS Algebra I, reviewed against §111.39
// on 2026-10-15. Existing concept and question identities are preserved.
export const ALGEBRA1_ADDITIONS=`
87|Equations with fractions & decimals|13|34,15|Solve linear equations with fractional and decimal coefficients and check the result.|Multiply every term on both sides by a common nonzero denominator.|Clearing denominators must include terms without fractions.|Identify every denominator before distributing.|fractional coefficients;decimal coefficients;variables on both sides;solution checks
88|Linear equation modeling|13|34,27|Build and solve one-variable equations for costs, distances, ages, and geometric quantities.|An equation equates two expressions for the same quantity in compatible units.|A fixed fee is added once rather than once per item.|Define the unknown and its units.|cost models;distance;perimeter;consecutive numbers;reasonableness
89|Compound linear inequalities|13|36|Solve simultaneous or alternative linear bounds and interpret the resulting intervals.|An and condition uses the overlap; an or condition uses the union.|Reversing an inequality is required only when multiplying or dividing by a negative.|Solve each bound before combining the sets.|double inequalities;intersection;union;empty sets;contextual bounds
90|Point-slope & standard form|14|41,34|Construct and convert line equations from points, slopes, and intercepts.|Use y−y₁=m(x−x₁), then preserve equality while rearranging.|The point's signs belong inside the subtractions.|Calculate the slope with a consistent subtraction order.|two-point equations;point-slope form;standard form;intercepts
91|Parallel & perpendicular lines|14|90|Find lines through specified points with parallel or perpendicular directions.|Parallel nonvertical lines share a slope; perpendicular slopes are negative reciprocals.|Vertical and horizontal lines need separate treatment.|Rewrite the given line to identify its slope.|parallel slopes;negative reciprocals;vertical lines;horizontal lines
92|Systems by substitution|19|34,46|Solve two-equation linear systems by substituting one expression into the other.|Replace the entire isolated variable expression, using parentheses.|Finding one coordinate does not finish the ordered pair.|Isolate the variable with the simplest coefficient.|substitution;fractional solutions;dependent equations;inconsistent equations
93|Systems by elimination|19|34,46|Solve linear systems by scaling and adding entire equations.|Scale both sides of an equation so one pair of coefficients cancels.|Scaling only one term changes the equation's solutions.|Choose a variable and find matching or opposite coefficients.|addition;subtraction;scaled elimination;solution counts
94|Systems in context|19|88,92,93|Formulate and solve two-variable models for prices, mixtures, counts, and rates.|Each equation records an independent constraint on the same two quantities.|A solution must meet both the equations and the context's restrictions.|Define both variables before translating the constraints.|ticket counts;mixtures;unit prices;distance rates;break-even points
95|Polynomial products & special identities|15|25,30,22|Expand products of linear and quadratic expressions and use square identities.|Distribute each term; a binomial square includes twice the product of its terms.|Squaring a sum is different from summing two squares.|List the partial products before combining like terms.|binomial products;binomial squares;conjugate products;area models
96|Greatest-common-factor factoring|15|4,25,22|Extract the greatest common numerical and variable factor from polynomial terms.|The common variable factor uses the smallest exponent present in every term.|A factor missing from one term cannot be pulled from the whole expression.|Find the coefficient GCF and the shared variable powers.|numerical GCF;variable factors;negative common factors;factored area
97|Factoring monic trinomials|15|96,95|Factor x²+bx+c by finding numbers with the required sum and product.|In (x+p)(x+q), p+q=b and pq=c.|Matching the product alone does not determine the middle coefficient.|List signed factor pairs of the constant term.|positive constants;negative constants;perfect squares;checking by expansion
98|Factoring nonmonic trinomials|15|97,95|Factor ax²+bx+c with a≠1, including a common factor when present.|A split of the middle term must have product ac and sum b.|The leading coefficient affects the cross products.|Remove a common factor, then look for a valid middle-term split.|ac method;grouping;leading coefficients;common factors
99|Difference of squares & perfect-square trinomials|15|96,95|Use square identities to factor expressions and recognize the required middle term.|u²−v²=(u−v)(u+v), while u²±2uv+v²=(u±v)².|A sum of positive squares is not a difference of squares.|Check the signs and square roots of the outer terms.|conjugate factors;perfect-square trinomials;missing coefficients;repeated factors
100|Quadratic equations by factoring|16|57,34|Solve quadratic equations using a zero product and check contextual roots.|Move all terms to one side before setting factors equal to zero.|A product equal to a nonzero constant does not permit setting each factor to zero.|Write an equivalent equation with zero on one side.|zero-product rule;two roots;repeated roots;root restrictions
101|Quadratic equations by square roots|16|58,34|Solve equations containing an isolated squared expression over the real numbers.|If u²=k>0, both u=√k and u=−√k are candidates.|Taking only the principal root misses a solution of the equation.|Isolate the square before taking both roots.|shifted squares;radical answers;one or no real roots;positive lengths
102|Completing the square|16|99,34,58|Rewrite quadratics as shifted squares and solve equations by preserving equality.|After normalizing the leading coefficient, add the square of half the linear coefficient.|Adding a square on only one side changes the equation.|Factor the leading coefficient from the quadratic and linear terms.|balancing additions;vertex form;nonmonic quadratics;exact solutions
103|Quadratic formula & discriminant|16|34,58|Use coefficients and the discriminant to find and classify real quadratic roots.|For ax²+bx+c=0, use x=(−b±√(b²−4ac))/(2a) with a≠0.|The denominator 2a divides the entire numerator.|Put the equation in standard form and retain each coefficient's sign.|two real roots;repeated roots;no real roots;irrational roots
104|Quadratic maxima & minima in context|16|59,60|Find and interpret optimal outputs of quadratic models on relevant domains.|The vertex gives an interior extremum; on a bounded domain also check the endpoints.|The unrestricted vertex may lie outside the model's allowed inputs.|Locate the vertex and compare it with the contextual domain.|projectile height;area;revenue;bounded domains;units
105|Arithmetic sequences|17|40,44|Find terms, missing parameters, and explicit or recursive rules for constant-difference sequences.|With first term a₁ and common difference d, aₙ=a₁+(n−1)d.|The nth term uses n−1 changes from the first term.|Subtract consecutive terms to find the common difference.|nth terms;recursive rules;missing terms;indices;linear contexts
106|Geometric sequences|17|22,44|Find terms, ratios, and rules for sequences with a constant multiplicative change.|With first term a₁ and ratio r, aₙ=a₁r^(n−1).|A negative ratio alternates signs rather than producing constant differences.|Divide consecutive nonzero terms to find the ratio.|nth terms;recursive rules;negative ratios;decay;exponential contexts
`.trim();

// Connect the focused skills back into broader applications. These teaching
// dependencies are authored links, not prerequisite claims made by TEA.
export const ADDED_PREREQUISITES={50:[90,91],52:[87],54:[89,94],56:[95],57:[96,97,98,99],60:[102],61:[100,101,102,103],62:[104],65:[105,106],71:[93],72:[92]};
export const ADDED_STANDARD_NODES={
 'A.5A':[87,88],'A.5B':[89],'A.2B':[90],'A.3A':[90],'A.2E':[91],'A.2F':[91],'A.2G':[91],
 'A.5C':[92,93,94],'A.2I':[94],'A.10B':[95],'A.10D':[95,96],'A.10E':[97,98,99],'A.10F':[99],
 'A.7B':[100],'A.8A':[100,101,102,103],'A.6B':[102],'A.7A':[104],'A.6A':[104],
 'A.12C':[105,106],'A.12D':[105,106],'A2.4D':[102]
};
export const ADDED_QUESTION_EVIDENCE=`
A.5A|87:1,2,3,4,5,6,7,8,9,10;88:1,2,3,4,5,6,7,8,9,10
A.5B|89:1,2,3,4,5,6,7,8,9,10
A.2B|90:1,2,3,4,5,6,7,8,9,10
A.3A|90:2,5,6,8
A.2E|91:1,3,5,8
A.2F|91:2,4,6,9
A.2G|91:7,10
A.5C|92:1,2,3,4,5,6,7,8,9,10;93:1,2,3,4,5,6,7,8,9,10;94:1,2,3,4,5,6,7,8,9,10
A.2I|94:1,2,3,4,5,6,7,8,9,10
A.10B|95:1,2,3,4,5,6,7,8,9,10
A.10D|95:1,2,3,4,5,6,7,8,9,10;96:1,2,3,4,5,6,7,8,9,10
A.10E|97:1,2,3,4,5,6,7,8,9,10;98:1,2,3,4,5,6,7,8,9,10;99:3,4,6,8
A.10F|99:1,2,5,7,9,10
A.7B|100:1,2,3,4,5,6,7,8,9,10
A.8A|100:1,2,3,4,5,6,7,8,9,10;101:1,2,3,4,5,6,7,8,9,10;102:6,7,8,9;103:1,2,3,4,5,6,7,8,9,10
A.6B|102:1,2,3,4,5,10
A.7A|104:1,2,3,4,5,6,7,8,9,10
A.6A|104:6,7,9
A.12C|105:2,7;106:2,7
A.12D|105:1,3,4,5,6,8,9,10;106:1,3,4,5,6,8,9,10
A2.4D|102:1,2,3,4,5,10
`.trim();
