export default `
@4.1
P(t) is a population in people, with t in years. P′(3)=20 means…|At year 3 the population is increasing at 20 people/year|The population is 20 people|The total three-year increase is 20|A derivative describes an instantaneous rate.
If T′(5)=−2 °C/min, temperature is…|Decreasing at that instant|Necessarily negative|Constant|The derivative's sign describes change, not the amount.
If C is dollars and x is items, C′ has units…|Dollars per item|Items per dollar|Dollars|Divide output units by input units.
V′(2)=0 guarantees what at t=2?|Instantaneous rate is zero|V(2)=0|V has an absolute maximum|A zero derivative alone does not classify an extremum.
If f′(a)=3, estimate f(a+0.1)−f(a).|0.3|3.1|30|Use the local rate times the input change.
@4.2
v=−3 and a=−2 at an instant. The particle is…|Speeding up|Slowing down|At rest|Velocity and acceleration have the same sign.
v=4 and a=−1. The particle is…|Slowing down|Speeding up|Moving left|Opposite signs mean decreasing speed.
For s(t)=t³−3t, find v(2).|9|6|2|v(t)=3t²−3.
If v(t)=−5, what is the speed?|5|−5|0|Speed is the absolute value of velocity.
For s(t)=t²−4t, when is the particle at rest?|t=2|t=4|t=0|Set v(t)=2t−4 equal to zero.
@4.3
C′(100)=4 dollars/item. Approximate the cost increase from 100 to 101 items.|4 dollars|400 dollars|104 dollars|Marginal cost times one additional item gives the estimate.
Water depth is positive but its derivative is negative. What follows?|The water is getting shallower|The depth is below zero|The derivative must be wrong|An amount and its rate can have different signs.
If P(t)=100e^(0.02t), find P′(0).|2|100|0.02|Differentiate to obtain 2e^(0.02t).
If T′(t) is increasing while negative, temperature is…|Decreasing at a less negative rate|Increasing|Constant|The rate remains negative but moves toward zero.
If A′(3)=5 units/hour, estimate the change over the next 0.2 hour.|1 unit|25 units|5.2 units|Multiply the local rate by 0.2 hour.
@4.4
For a growing circle, differentiate A=πr² with respect to t.|dA/dt=2πr dr/dt|dA/dt=2πr|dA/dt=π(dr/dt)²|The radius depends on time, requiring the chain rule.
Why differentiate before replacing a changing radius by a number?|To preserve its time dependence|To avoid using any numbers|Because substitution is never allowed|Early substitution can erase a changing variable's derivative.
For x²+y²=25 with changing x,y, time differentiation gives…|2x x′+2y y′=0|2x+2y=0|x′²+y′²=25|Both coordinates depend on time.
A spherical balloon changes radius. Which relation connects volume and radius?|V=(4/3)πr³|V=πr²|V=2πr|Use the sphere volume formula.
If a distance shrinks at 3 m/s, its signed derivative is…|−3 m/s|3 m/s|0 m/s|Shrinking corresponds to a negative rate.
@4.5
A circle has r=3 cm and dr/dt=2 cm/s. Find dA/dt.|12π cm²/s|6π cm²/s|18π cm²/s|Use 2πr r′.
A sphere has r=2 and r′=1. Find V′.|16π|8π|4π|Differentiate volume to get 4πr²r′.
A 5 m ladder has x=3,y=4 and x′=2 m/s. Find y′.|−3/2 m/s|3/2 m/s|−8/3 m/s|Use x x′+y y′=0.
A square has side s=4 and s′=3. Find its area rate.|24|12|16|A′=2s s′.
For xy=12, x=3,y=4 and x′=2. Find y′.|−8/3|8/3|−3/2|From x′y+xy′=0, solve for y′.
@4.6
Linearize √x at x=4.|L(x)=2+(x−4)/4|L(x)=2+(x−4)/2|L(x)=√4+x|The derivative at 4 is 1/4.
Using that linearization, approximate √4.04.|2.01|2.02|2.04|The input change 0.04 contributes 0.01.
If f is concave up throughout a neighborhood, its tangent approximation there tends to…|Underestimate f|Overestimate f|Equal f everywhere|A concave-up graph lies above its tangent.
If f(2)=5 and f′(2)=−3, estimate f(2.1).|4.7|5.3|4.9|Add −3 times the input change 0.1.
Why is a linearization usually used near its center?|Local curvature can create growing error farther away|It has no value far away|Every function is globally linear|The tangent captures only first-order behavior.
@4.7
Find lim as x→0 of (e^x−1)/x using L’Hôpital.|1|0|∞|The 0/0 derivative ratio is e^x/1.
Can L’Hôpital be applied directly when substitution gives 5/2?|No|Yes|Only if x→0|The original quotient is not indeterminate.
When using L’Hôpital on f/g, differentiate as…|f′/g′|(f′g−fg′)/g²|f′g′|Differentiate numerator and denominator separately.
Find lim as x→∞ of ln x/x.|0|1|∞|The derivative ratio is 1/x, tending to zero.
Find lim as x→0 of (1−cos x)/x².|1/2|1|0|Two valid applications yield cos x/2.
@5.1
For f(x)=x² on [1,3], which c satisfies MVT?|2|1|3|The secant slope is 4, so 2c=4.
MVT requires differentiability on…|(a,b)|Only at the endpoints|All real numbers|The derivative condition applies to the open interval.
Does MVT apply to abs(x) on [−1,1]?|No|Yes, with c=0|Yes, with c=1|The corner at zero violates differentiability.
If f(a)=f(b) and MVT hypotheses hold, some interior derivative equals…|0|1|f(a)|This is Rolle's theorem, the zero-secant-slope case.
A differentiable position function travels from 0 m to 100 m in 10 s. What rate is guaranteed somewhere?|10 m/s|100 m/s|0 m/s|MVT matches the average velocity.
@5.2
What does EVT guarantee for continuous f on [a,b]?|At least one absolute maximum and minimum|Exactly one of each|A derivative everywhere|The extrema exist but need not be unique.
Which interior input is a critical number?|f exists and f′ is zero or undefined|Any zero of f|Any undefined point of f|Critical numbers must belong to the function's domain.
Is x=0 a critical number of f(x)=abs(x)?|Yes|No|Only if f′(0)=0|The function exists there but its derivative does not.
Does f′(c)=0 guarantee an extremum?|No|Yes, a minimum|Yes, a maximum|For example, x³ has no extremum at zero.
Does continuity on (0,1) alone guarantee attained absolute extrema?|No|Yes|Only a maximum|The closed-interval hypothesis is missing.
@5.3
If f′>0 on (1,4), f is…|Increasing there|Necessarily positive there|Concave up there|Derivative sign determines monotonicity.
For f(x)=x², where is f decreasing?|(−∞,0)|(0,∞)|Everywhere|f′=2x is negative on the negative axis.
f′=(x−1)(x+2). Where is f decreasing?|(−2,1)|(−∞,−2)∪(1,∞)|(1,∞)|The derivative is negative between its roots.
Can f be negative and increasing on an interval?|Yes|No|Only if f′=0|For example, x−10 is negative and increasing on (0,1).
If f′=0 everywhere on an interval, f is…|Constant there|Zero there|Strictly increasing there|MVT gives zero change between any two interval points.
@5.4
f′ changes from positive to negative at c. Then f has…|A local maximum at c|A local minimum at c|No possible extremum|The function rises before c and falls after it.
f′ changes from negative to positive at c. Then f has…|A local minimum at c|A local maximum at c|An asymptote at c|The function falls before c and rises after it.
For f(x)=x³, does the critical point 0 give an extremum?|No|A maximum|A minimum|f′=3x² stays positive on both sides.
f′=(x−1)(x−3). Classify x=1.|Local maximum|Local minimum|Neither|The sign changes from + to −.
For the same derivative, classify x=3.|Local minimum|Local maximum|Neither|The sign changes from − to +.
@5.5
Find the absolute maximum of x² on [−1,2].|4 at x=2|1 at x=−1|0 at x=0|Compare both endpoints and the critical point.
Which candidates must be checked for continuous f on [a,b]?|Endpoints and interior critical points|Only derivative zeros|Only endpoints|Nondifferentiable interior points can also be candidates.
Find the absolute minimum of x²−2x on [0,3].|−1 at x=1|0 at x=0|3 at x=3|The values at 0,1,3 are 0,−1,3.
Why compare f-values instead of candidate x-values?|Extrema concern outputs|The largest input is always best|Derivative values are the final answers|The largest or smallest output determines the extremum.
Find the absolute maximum of sin x on [0,π].|1 at π/2|0 at 0|π at π|Include the interior critical point π/2.
@5.6
If f″>0 on an interval, f is…|Concave up|Necessarily increasing|Necessarily positive|Second-derivative sign determines concavity.
For f(x)=x³, where is the inflection point?|(0,0)|(1,1)|There is none|f″=6x changes sign at zero.
Does f″(c)=0 guarantee an inflection point?|No|Yes|Only if f(c)=0|Concavity must actually change.
For f(x)=x⁴, is zero an inflection point?|No|Yes|Only from the right|f″=12x² is nonnegative on both sides.
If f′ is decreasing throughout an interval, f is…|Concave down|Always decreasing|Always negative|A decreasing first derivative indicates downward concavity.
@5.7
f′(c)=0 and f″(c)=5. Classify c.|Local minimum|Local maximum|No extremum|Positive second derivative gives a minimum at a stationary point.
f′(c)=0 and f″(c)=−2. Classify c.|Local maximum|Local minimum|Inflection point|Negative second derivative gives a maximum.
f′(c)=0 and f″(c)=0. The test is…|Inconclusive|Proof of no extremum|Proof of an inflection|Use another test, such as a first-derivative sign chart.
For f(x)=x²+2x, classify x=−1.|Local minimum|Local maximum|Neither|f′=0 there and f″=2.
Can f″(c)>0 alone, without f′(c)=0, establish a local minimum at c?|No|Yes|Only if c>0|The second derivative test requires a stationary point.
@5.8
A sketch with f′>0 and f″<0 should be…|Increasing and concave down|Decreasing and concave up|Increasing and concave up|Use first derivative for direction, second for curvature.
Near a local maximum, f′ typically changes…|From + to −|From − to +|From + to +|The function switches from rising to falling.
For f(x)=1/x on x>0, which description fits?|Decreasing and concave up|Increasing and concave up|Decreasing and concave down|f′=−1/x² and f″=2/x³.
When sketching a rational function, what should be marked before joining branches?|Domain breaks and asymptotes|Only its y-intercept|Only its derivative value at zero|The branches must respect the domain and limiting behavior.
A function is concave up throughout and has a stationary point. Its local shape there is…|A valley|A peak|A jump|An upward-bending stationary graph gives a local minimum.
@5.9
If the graph of f′ lies below the x-axis, f is…|Decreasing|Negative|Concave down necessarily|The height of f′ determines the direction of change.
If f′ is positive and decreasing, f is…|Increasing and concave down|Decreasing and concave up|Increasing and concave up|Separate the sign of f′ from its trend.
If f has a horizontal tangent at c, what is f′(c)?|0|f(c)|Undefined necessarily|A horizontal tangent has zero slope.
If f′ crosses from negative to positive, f has…|A local minimum|A local maximum|A zero necessarily|The derivative sign change determines the extremum.
If f′ has positive slope, what is the sign of f″?|Positive|Negative|Zero|f″ measures the slope of f′.
@5.10
A rectangle has perimeter 20. With side x, its area function is…|A(x)=x(10−x)|A(x)=20x|A(x)=x(20−x)|The other side is 10−x.
For that rectangle with positive sides, the feasible x-domain is…|0<x<10|0<x<20|All real x|Both x and 10−x must be positive.
In a minimum-cost problem, the objective is…|The cost function|Any constraint equation|The derivative alone|The objective names the quantity to optimize.
A box volume is V=xyh. A fixed surface area is a…|Constraint|Derivative|Critical point|It restricts possible dimensions.
Why reduce an optimization objective to one variable?|To differentiate along the feasible choices|To discard the constraint|To make every domain infinite|Substitution expresses the constraint within the objective.
@5.11
Which rectangle of perimeter 20 has maximum area?|5 by 5|2 by 8|1 by 9|A=x(10−x) peaks at x=5.
For A(x)=x(10−x), A″=−2. What does this help justify?|The stationary point is a maximum|Every x is optimal|The area is negative|Concavity is downward across the feasible interval.
Is solving A′=0 alone a full global optimization argument?|No|Yes|Only for a word problem|Candidates must be justified within the feasible domain.
Minimize f(x)=x+4/x for x>0.|Minimum 4 at x=2|Minimum 5 at x=1|No minimum|f′ changes from negative to positive at 2.
An algebraic optimization candidate has a negative physical length. What should happen?|Reject it as infeasible|Take it as the optimum|Always replace it by its absolute value|The model's domain controls valid solutions.
@5.12
For x²+y²=25 at (0,5), the tangent is…|Horizontal|Vertical|Undefined in every direction|dy/dx=−x/y=0 there.
For x²+y²=25 at (5,0), the tangent is…|Vertical|Horizontal|Slope 1|The circle's x-coordinate is locally extreme there.
Before evaluating an implicit derivative at (a,b), check…|The point satisfies the original relation|a=b|The derivative is zero|Derivative information applies only to points on the curve.
For x²+y²=25, y″=−25/y³ where y≠0. At y=5 the curve is…|Concave down|Concave up|An inflection point|The second derivative is negative.
When differentiating a formula containing y(x), which rule remains necessary?|Chain rule|Only the constant rule|No additional rule|The dependent variable still changes with x.
`;
