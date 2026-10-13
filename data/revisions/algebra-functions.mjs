export default String.raw`
@MATH_049
10|A theater sells at most 120 tickets at 8 dollars each. Write the set of possible revenues, including selling none.|{8n: n is an integer and 0≤n≤120}|All real amounts from 0 to 960|{8n: n is an integer and 0≤n≤960}|Each whole ticket adds 8 dollars, with n from 0 to 120. The revenue is discrete.
@MATH_051
3|The point (3,3) lies on f(x)=x. Find the point with the same input on g(x)=−2f(x).|(3,−6)|(−6,3)|(3,−3)|Multiply the output by −2 while keeping the input fixed.
6|Reflect the line y=x across the x-axis, then shift it up 5. Find its x-intercept.|(5,0)|(−5,0)|(0,5)|The transformed line is y=−x+5. Set y=0 to obtain x=5.
@MATH_052
8|Solve y=mx+b for m when x≠0, then evaluate m for y=11, x=3, b=2.|m=(y−b)/x=3|m=(y+b)/x=13/3|m=(y−x)/b=4|Subtract b and divide by x: (11−2)/3=3.
@MATH_053
1|Write the inequality for a dashed boundary through (0,1) and (2,5), shaded above.|y>2x+1|y≥2x+1|y<2x+1|The slope is 2 and intercept 1; above means greater, and the dashed line excludes equality.
2|A shaded half-plane includes its boundary through (0,3),(3,0) and contains (0,0). Write the inequality.|y≤−x+3|y≥−x+3|y<−x+3|The line has slope −1 and intercept 3; (0,0) lies below it and the solid boundary is included.
9|A graph shades left of a dashed vertical line through (5,2). Which of (4,9),(5,0),(6,−1) is in the solution set?|(4,9)|(5,0)|(6,−1)|The boundary is x=5 and the shading means x<5, so only x=4 works.
10|The boundary is 2x−y=4 and (0,0) must be included. Choose the strict inequality for that half-plane.|2x−y<4|2x−y>4|2x−y=4|Substitute (0,0): 0<4, so the less-than half-plane contains it.
@MATH_054
7|Find all points satisfying y≥x+3 and y≤x−1.|No points|(0,0) only|All points with x≥0|The lower bound x+3 exceeds the upper bound x−1 for every x.
@MATH_055
1|For paired data (1,2),(2,1),(3,3), calculate Pearson's r using a calculator; round to two decimals.|0.50|1.00|−0.50|Both means are 2. The centered product sum is 1 and both centered square sums are 2, so r=1/√(2×2)=0.50.
2|For paired data (−1,1),(0,0),(1,1), calculate Pearson's r.|0|1|−1|The mean x is zero. The centered products sum to −1/3+0+1/3=0, giving r=0 despite a curved relationship.
6|Two data sets have correlations r=−0.8 and r=0.6. Compute the difference between their squared correlations.|0.28|0.20|1.40|Square first: 0.64−0.36=0.28; the negative sign does not reduce the strength of association.
8|The fit y=2x+1 is used on data (1,4),(2,4),(3,8). Calculate its sum of squared residuals.|3|1|9|Predictions are 3,5,7; residuals are 1,−1,1. Their squares sum to 3.
9|Calculate the least-squares line for (1,2),(2,1),(3,3). A calculator may be used.|y=0.5x+1|y=x|y=−0.5x+3|Both means are 2. The centered product sum is 1 and x square sum is 2, so slope=1/2 and intercept=2−(1/2)×2=1.
@MATH_057
9|Factor x²+10x+25.|(x+5)²|(x+25)(x+1)|(x−5)²|The outside terms are squares and the middle is 2×5×x, giving (x+5)².
10|A rectangle has area x²+4x+4 and one side x+2, with x>0. Find the other side.|x+2|x−2|x+4|Factor the area as (x+2)², then divide by x+2.
@MATH_058
7|Evaluate ∛(−64)+√81.|5|13|−13|The cube root is −4 and the principal square root is 9, giving 5.
10|Calculate √(9+16)−√9.|2|4|−2|The first radical is √25=5; subtract √9=3 to obtain 2.
@MATH_059
7|The point (2,4) lies on y=x². Where does it move under a vertical stretch by 3?|(2,12)|(6,4)|(2,7)|A vertical stretch multiplies the output by 3.
8|The point (4,16) lies on y=x². Find the corresponding point after replacing x by 2x.|(2,16)|(8,16)|(4,32)|To preserve the old input 4, the new input must satisfy 2x=4, so x=2.
@MATH_060
7|Rewrite y=x²−4x−5 in factored form and find the zeros.|y=(x−5)(x+1); zeros −1,5|y=(x−1)(x+5); zeros −5,1|y=(x−5)(x−1); zeros 1,5|The numbers −5 and 1 have product −5 and sum −4. Each factor gives one zero.
8|Rewrite y=3x²+12x+11 in vertex form.|y=3(x+2)²−1|y=3(x+2)²+11|y=3(x−2)²−1|Factor 3 from the quadratic terms, complete the square, and subtract the added 12: 3(x+2)²−1.
9|A parabola has vertex (1,2) and passes through (3,14). Find its leading coefficient a.|3|6|12|Substitute into y=a(x−1)²+2: 14=4a+2, so a=3.
@MATH_061
7|Solve 3x²+2x−2=0 exactly.|x=(−1±√7)/3|x=(−2±√7)/3|x=(−1±√5)/3|The quadratic formula gives (−2±√28)/6=(−1±√7)/3.
9|Solve (x−2)(x+3)=10.|x=(−1±√65)/2|x=2 or x=−3|x=(1±√65)/2|Expand and subtract 10 to obtain x²+x−16=0; the discriminant is 65.
@MATH_062
6|A quadratic fit predicts 4,7,12 for three observations 5,5,13. Calculate its sum of squared residuals.|6|0|4|The residuals are 1,−2,1; their squares sum to 1+4+1=6.
7|A fitted model y=x²−2x+3 uses inputs from 0 to 10. Predict y at x=6.|27|33|39|Substitute the in-range input: 36−12+3=27.
9|Use quadratic regression on (0,1),(1,2),(2,5),(3,10). What fitted equation results?|y=x²+1|y=3x+1|y=x²+x+1|Every point satisfies x²+1, so this degree-two fit has zero residuals.
10|A fitted height is h(t)=−2t²+8t+1 meters for 0≤t≤4 seconds. Estimate the height at 3 seconds.|7 meters|13 meters|−1 meter|Compute −2×9+8×3+1=7 meters at an input inside the fitted domain.
@MATH_063
10|An 800-person population grows 5% each year. Find the modeled population after 2 years.|882|880|840|Compound twice: 800(1.05)²=882.
@MATH_064
5|Data from times 0 through 6 are fitted by y=4(2^t). Predict y at t=4.|64|32|16|The input is within the data range; 4×2⁴=64.
7|Fit y=a b^x to (0,6),(1,9),(2,13.5). Find a and b.|a=6, b=1.5|a=6, b=3|a=3, b=1.5|At x=0 the value is a=6. Both successive ratios are 1.5.
9|A population model is P(t)=50(1.2)^t. Calculate its predicted increase from t=1 to t=2.|12|10|22|The values are 60 and 72; their difference is 12.
@MATH_066
6|A one-to-one function's graph contains (−3,8). Find the corresponding point on its inverse.|(8,−3)|(3,−8)|(−3,1/8)|An inverse exchanges input and output, reflecting the point across y=x.
8|Restrict f(x)=(x−2)² to x≤2. Find its inverse at input 9.|−1|5|3|The branch x≤2 gives f⁻¹(y)=2−√y. At 9, this is −1.
@MATH_065
8|Write the explicit rule for 5,−10,20,−40,... with first index n=1.|aₙ=5(−2)^(n−1)|aₙ=5(−2)^n|aₙ=5−15(n−1)|The first term is 5 and the ratio is −2. The exponent is n−1 to recover the first term at n=1.
@MATH_067
4|For f(x)=x³ and g(x)=abs(x), compute f(−2)+g(−2).|−6|10|−10|The cubic gives −8 and absolute value gives 2; add them.
6|Express the domain of y=√(x+2)/(x−3) in interval notation.|[−2,3)∪(3,∞)|(−2,∞)|[−2,3]|Require x≥−2 for the radical, and exclude x=3 for the denominator.
7|Express the domain of y=√(2x−8) in set notation.|{x∈R: x≥4}|{x∈R: x>4}|{x∈R: x≤4}|The radicand condition 2x−8≥0 simplifies to x≥4, including 4.
8|Find the range of y=−2√x+3 in interval notation.|(−∞,3]|[3,∞)|(−∞,3)|At x=0 the value is 3; larger inputs decrease it without bound, so 3 is included as the maximum.
9|Find the range of y=(x−1)²+2 in set notation.|{y∈R: y≥2}|{y∈R: y>2}|{y∈R: y≤2}|The squared term is nonnegative and can equal zero, so the minimum output is 2.
@MATH_068
3|The point (2,8) lies on y=x³. Find its reflected point on y=−x³.|(2,−8)|(−2,8)|(2,8)|Reflection across the x-axis negates the output.
4|For y=2∛(x−1)+3, find the point where y=−1.|(−7,−1)|(9,−1)|(−1,−1)|Solve ∛(x−1)=−2, so x−1=−8 and x=−7.
8|The point (1,1) lies on y=∛x. Find its corresponding point on y=∛(x/8).|(8,1)|(1/8,1)|(1,8)|The new input must satisfy x/8=1, giving x=8.
10|For y=∛(−x), calculate the output at x=27.|−3|3|−9|The real cube root of −27 is −3.
@MATH_069
4|For y=3abs(x−2), find both inputs that give y=12.|−2 and 6|−4 and 4|2 and 6|Divide by 3, then solve x−2=±4.
9|Translate y=abs(x) four units left and one unit down. Find its zeros.|−5 and −3|3 and 5|−4 only|The new function is abs(x+4)−1. Setting it to zero gives x+4=±1.
@MATH_071
2|There are x 2-dollar, y 3-dollar, and z 5-dollar items. There are 9 items costing 25 dollars and x=y. Find (x,y,z).|(4,4,1)|(3,3,3)|(2,2,5)|Substitute y=x to get 2x+z=9 and 5x+5z=25. Thus x+z=5, giving x=4, y=4, z=1.
6|Solve x+y+z=6, x−y=0, and 2x+2y+2z=12 in terms of z=t.|(x,y,z)=((6−t)/2,(6−t)/2,t)|(x,y,z)=(6−t,6−t,t)|No solution|The third equation repeats the first. With x=y and z=t, 2x=6−t.
9|For x+y+z=6, 2x−y+z=3, and x+2y−z=2, find (x,y,z).|(1,2,3)|(2,1,3)|(3,2,1)|Subtract the first equation from the second: x−2y=−3. Add the first and third: 2x+3y=8. Solve for x=1,y=2, then z=3.
10|A shop sells pens, books, and folders for 2, 6, and 3 dollars. It sells 10 items for 31 dollars, with twice as many pens as books. Find the counts (pens,books,folders).|(2,1,7)|(4,2,4)|(6,3,1)|Let books=b, pens=2b, folders=10−3b. Revenue is 4b+6b+3(10−3b)=30+b=31, so b=1.
@MATH_072
6|Find the real intersections of y=x²+2 and y=2x.|None|(1,2)|(0,2) and (2,4)|Set x²−2x+2=0. Its discriminant is 4−8=−4, so there are no real intersections.
8|A rectangle has width x, length y, perimeter 14 and area 12. Find the possible positive side lengths.|3 and 4|−3 and −4|2 and 5|From x+y=7 and xy=12, substitute y=7−x to get (x−3)(x−4)=0.
10|Solve y=x²−1 and y=2x+2, giving both intersection points.|(−1,0) and (3,8)|(−1,−4) and (3,4)|(1,4) and (−3,−4)|Solve x²−2x−3=0 for x=−1,3 and use y=2x+2 to obtain y=0,8.
@MATH_073
5|Write the parabola with vertex (1,−2) and focus (4,−2).|(y+2)²=12(x−1)|(x−1)²=12(y+2)|(y+2)²=3(x−1)|The axis is horizontal and p=3, so use (y−k)²=4p(x−h).
8|Write the parabola with vertex (−2,5), vertical axis, and focus (−2,6).|(x+2)²=4(y−5)|(x−2)²=4(y+5)|(x+2)²=−4(y−5)|Here p=1, so the vertical parabola has coefficient 4p=4 and opens upward.
9|A parabola has focus (0,2) and directrix y=−2. Find y when x=4.|2|4|8|The vertex is (0,0) and p=2, so x²=8y. Substitute 16=8y.
@MATH_074
5|The point (4,2) lies on y=√x. Find its corresponding point on y=3√x−1.|(4,5)|(12,1)|(4,6)|Transform the output by 3y−1: 3×2−1=5.
6|The point (9,3) lies on y=√x. Find the corresponding point on y=√(4x).|(9/4,3)|(36,3)|(9,12)|Set the new inner input 4x equal to 9, giving x=9/4.
@MATH_075
7|Solve √(x+6)=x over the reals, discarding extraneous candidates.|x=3 only|x=−2 or x=3|x=−2 only|Squaring gives x²−x−6=0, with candidates 3 and −2. The original square root is nonnegative, so only 3 works.
@MATH_076
10|Solve (x+2)(x−5)<0.|−2<x<5|x<−2 or x>5|−2≤x≤5|Between the roots the factors have opposite signs; strict inequality excludes both roots.
@MATH_077
7|For g(x)=−log₁₀(x)+2, find the x-intercept.|(100,0)|(0.01,0)|(2,0)|Set log₁₀(x)=2 and convert to x=10²=100.
9|Find the inverse of f(x)=10^(x−2).|f⁻¹(x)=log₁₀(x)+2|f⁻¹(x)=log₁₀(x−2)|f⁻¹(x)=10^(x+2)|Take the common log of y=10^(x−2), solve for x, then exchange the variables.
10|For y=2ln(x−1)+3, find the point with x=e+1.|(e+1,5)|(e+1,3)|(e+1,2e+3)|The log argument is e, so y=2×1+3=5.
@MATH_078
9|Solve log₂(x−4)=2 and check the domain.|x=8|x=0|x=6|The argument must equal 2²=4, giving x=8, which meets x>4.
10|A sensor's score is 0 at amplitude 100 and increases by 1 for every tenfold increase in amplitude A. Write the score as a function of A.|S=log₁₀(A/100)|S=log₁₀(A−100)|S=100log₁₀(A)|At the baseline A/100=1, giving score 0. Each multiplication of A by 10 adds 1 to this logarithm.
@MATH_079
1|Simplify (2i)²+3.|−1|7|−4|Square both factors: 4i²+3=−4+3=−1.
6|Multiply (4−3i) by its complex conjugate.|25|7−24i|−25|The conjugate is 4+3i. Their product is 16−9i²=25.
9|Find a real number k so that (k+5i)+(3−5i)=−7.|−10|−4|−7|The imaginary parts cancel, leaving k+3=−7, so k=−10.
@MATH_080
8|Divide x⁴−3x²+2 by x−1. Give the quotient and remainder.|x³+x²−2x−2; remainder 0|x³−3x+2; remainder 0|x³+x²−2x; remainder 2|Use coefficients 1,0,−3,0,2. Synthetic division by 1 gives 1,1,−2,−2 and remainder 0.
10|Divide x⁴+2x+3 by x²+1. Give the quotient and remainder.|Quotient x²−1; remainder 2x+4|Quotient x²+1; remainder 2x+2|Quotient x²; remainder 2x+3|Subtract (x²+1)(x²−1)=x⁴−1 from the dividend to obtain 2x+4.
@MATH_081
10|Expand (x+2)(x²−2x+4).|x³+8|x³+4x²+8x+8|x³−8|Distribute both terms. The middle terms cancel, leaving x³+8.
@MATH_082
8|Subtract 1 from (x+2)/x, with x≠0.|2/x|2|1/x|Write 1=x/x and subtract the numerators: (x+2−x)/x=2/x.
@MATH_083
2|Give the domain of y=1/(x+2) in interval and set notation.|(−∞,−2)∪(−2,∞); {x∈R: x≠−2}|[−2,∞); {x∈R: x≥−2}|(−∞,2)∪(2,∞); {x∈R: x≠2}|The denominator excludes only x=−2. Split the real line there with open endpoints.
3|Give the range of y=3/(x−1)−4 in interval and set notation.|(−∞,−4)∪(−4,∞); {y∈R: y≠−4}|[−4,∞); {y∈R: y≥−4}|(−∞,4)∪(4,∞); {y∈R: y≠4}|The reciprocal term can be any nonzero real number. After subtracting 4, the only unattainable output is −4.
4|The point (2,1/2) lies on y=1/x. Find the corresponding point on y=−1/x+3.|(2,5/2)|(−2,7/2)|(2,7/2)|Transform the output by −y+3: −1/2+3=5/2.
9|Find y at x=1/4 on the transformed graph y=1/(2x).|2|8|1/8|The denominator is 2×1/4=1/2, whose reciprocal is 2.
10|For f(x)=(x−2)/[(x−2)(x+1)], identify the hole and vertical asymptote.|Hole (2,1/3); asymptote x=−1|Hole (−1,1/3); asymptote x=2|Asymptotes x=2 and x=−1|Cancel x−2 but keep x≠2. The simplified formula gives the hole's height 1/3 and still has a zero denominator at −1.
@MATH_084
6|An inverse variation has y=15 when x=4. Find y when x=10.|6|37.5|150|The product xy=60 stays fixed, so y=60/10=6.
7|One worker takes 6 hours for a job and another takes 3 hours. Write an equation for their combined completion time t at constant independent rates.|1/6+1/3=1/t|6+3=t|1/6+1/3=t|Their rates add in jobs/hour. Completing one job in t hours gives combined rate 1/t.
8|One worker completes a job in 6 hours and another in 3 hours. At constant independent rates, how long do they take together?|2 hours|4.5 hours|9 hours|The rates add to 1/6+1/3=1/2 job per hour. One job therefore takes 2 hours.
@MATH_085
1|For x=0,1,2,3, outputs are 5,9,13,17. Fit a linear model and predict at x=5.|25|21|29|The difference is 4, so y=4x+5 and y(5)=25.
2|For x=0,1,2,3, outputs are 1,4,9,16. Fit a quadratic and predict at x=4.|25|23|32|The data fit y=(x+1)², so the next value is 25.
3|For x=0,1,2,3, outputs are 2,6,18,54. Fit an exponential and predict at x=4.|162|108|90|The ratio is 3 and initial value 2, so y=2×3^x gives 162.
7|Observations at x=−1,0,1 are 1,0,1. A constant fit predicts 2/3 each time. Calculate its sum of squared residuals.|2/3|0|4/3|Residuals are 1/3,−2/3,1/3; squared values sum to 6/9=2/3.
8|A fit for a 100-seat venue is N(t)=20+15t, with t in hours. For which nonnegative times is its predicted count within capacity?|0≤t≤16/3|0≤t≤20/3|t≥16/3|Require 0≤20+15t≤100. With t≥0, the binding upper bound is t≤80/15=16/3.
@MATH_086
5|Find the polynomial of degree at most two through (0,2),(1,5),(2,8).|y=3x+2|y=x²+2|y=3x²+2|The equal first differences are 3, so the quadratic coefficient is zero and the line y=3x+2 fits all points.
10|A quadratic through (0,2),(1,6),(2,12) has form y=ax²+bx+c. Solve for (a,b,c).|(1,3,2)|(2,2,2)|(1,2,3)|c=2; a+b=4; 4a+2b=10. Subtract twice the second equation from the third to get a=1, then b=3.
`;
