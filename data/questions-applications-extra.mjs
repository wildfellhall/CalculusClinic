export default `
@4.1
The amount A is in milligrams and time t is in hours. What are the units of A″(t)?|Milligrams per hour squared|Milligrams per hour|Hours per milligram|Differentiating twice divides the amount units by the time units twice.
If R(2)=40 and R′(2)=−5 dollars per day, estimate R(2.2).|39 dollars|41 dollars|35 dollars|Use the local approximation 40+(−5)(0.2).
A temperature satisfies T(6)=12°C and T′(6)=3°C per hour. Which statement is supported?|At hour 6, the temperature is 12°C and rising at 3°C per hour|At hour 6, the temperature is 3°C|The temperature rose by 18°C over the first six hours|The function value gives the amount, while its derivative gives the instantaneous rate.
If f′(a)<0, must f(a)<0?|No; a positive quantity can be decreasing|Yes, derivatives and values always share a sign|Only when a>0|For example, f(x)=10−x has negative derivative while its value is positive near x=0.
What does lim as h→0 [P(5+h)−P(5)]/h represent when P is population and t is years?|The instantaneous population-change rate at year 5|The total population change in five years|The average population during five years|The difference quotient approaches the derivative P′(5).
@4.2
A particle has s(t)=t³−6t²+9t. At t=2, is it speeding up or slowing down?|Neither at that instant; the speed derivative is zero|Speeding up|Slowing down|Here v(2)=−3 and a(2)=0, so the instantaneous rate of change of speed is zero.
For v(t)=t²−4 on t≥0, when does the particle change direction?|t=2|t=0|Never, because acceleration is nonnegative|Velocity is negative before 2 and positive after 2, so its sign changes there.
For s(t)=4t−t², find acceleration at t=3.|−2|−2t|2|Velocity is 4−2t, so its derivative is the constant −2.
A particle has v=−6 and a=2 at an instant. What is happening?|It moves in the negative direction and slows down|It moves in the positive direction and speeds up|It moves in the negative direction and speeds up|Negative velocity sets direction; opposite signs of v and a make speed decrease.
If v(t)=(t−1)², does the particle reverse direction at t=1?|No; velocity is nonnegative on both sides|Yes; every zero velocity causes reversal|Yes; acceleration changes sign|A direction change requires a velocity sign change, not just a zero.
@4.3
Revenue R(q)=20q−0.1q² is in dollars for q items. Find marginal revenue at q=50.|10 dollars per item|750 dollars per item|20 dollars per item|Differentiate to get R′(q)=20−0.2q, then evaluate at 50.
A drug amount A(t)=80e^(−0.25t) is in mg with t in hours. At what rate is the amount changing initially?|−20 mg per hour|20 mg per hour|−0.25 mg per hour|The derivative is −20e^(−0.25t); evaluating at zero gives −20.
A company's cost is rising but at a decreasing rate. Which signs fit?|C′>0 and C″<0|C′<0 and C″>0|C′>0 and C″>0|Positive first derivative means rising cost; negative second derivative means its rate is decreasing.
A circular stain has area A(t)=9πt² square centimeters. Find its area-change rate at t=2 seconds.|36π cm² per second|18π cm² per second|36π cm|The derivative is 18πt, and rate units divide area by time.
A differentiable demand function has D′(10)=−4 units per dollar. Estimate the demand change for a $0.50 price increase near $10.|A decrease of about 2 units|An increase of about 2 units|A decrease of about 8 units|Multiply the local rate −4 by the price change 0.5.
@4.4
A cone's radius is always one third of its height. Which single-variable formula is useful before differentiating its volume?|V=πh³/27|V=πh³/3|V=πh²/9|Substitute r=h/3 into V=(1/3)πr²h.
If a rectangle's length and width both vary with time, differentiate A=lw.|A′=l′w+lw′|A′=l′w′|A′=l+w|Both changing dimensions contribute through the product rule.
For two perpendicular distances x(t),y(t), let z²=x²+y². What rate relation follows?|z z′=x x′+y y′|z′=x′+y′|z′²=x′²+y′²|Differentiate the squares with the chain rule, then divide the equation by 2.
A circle's area grows at 8 cm² per second. Which symbol expresses the given rate?|dA/dt=8|dr/dt=8|A=8|The stated changing quantity is area; radius change would have different units.
In a related-rates problem, what does r=5 at a particular instant imply about dr/dt?|Nothing by itself; the instantaneous value does not specify the rate|dr/dt=0|dr/dt=5|A variable can equal 5 at an instant while increasing, decreasing, or momentarily stationary.
@4.5
A sphere has radius 3 cm and volume increasing at 36π cm³ per second. Find dr/dt.|1 cm per second|3 cm per second|4 cm per second|From V′=4πr²r′, divide 36π by 4π·9.
A rectangle has l=5, w=3, l′=2, and w′=−1 in consistent units. Find its area rate.|1 square unit per time unit|11 square units per time unit|−2 square units per time unit|Use A′=l′w+lw′=2·3+5(−1).
A 13-foot ladder has its foot 5 feet from the wall and moving outward at 3 ft/s. Find the height's rate.|−5/4 ft/s|5/4 ft/s|−36/5 ft/s|The height is 12; from x x′+y y′=0, obtain y′=−15/12.
Two vehicles move away from an intersection along perpendicular roads. At x=3 km,y=4 km, their rates are x′=2 km/h,y′=1 km/h. Find the separation rate.|2 km/h|3 km/h|14/5 km/h|The separation is 5; z′=(3·2+4·1)/5=2.
A cone has r=h/2 and V′=π cubic units per second when h=2. Find h′.|1 unit per second|3 units per second|1/4 unit per second|V=πh³/12 gives V′=(πh²/4)h′; at h=2 the coefficient is π.
@4.6
Use the linearization of ln x at x=1 to estimate ln(1.03).|0.03|1.03|−0.03|At 1, ln 1=0 and the derivative is 1, so L(x)=x−1.
Linearize f(x)=1/x at a=2.|L(x)=1/2−(x−2)/4|L(x)=1/2+(x−2)/4|L(x)=2−(x−2)|Use f(2)=1/2 and f′(2)=−1/4.
A function has f(4)=7, f′(4)=2, and f″<0 near 4. How does its linear estimate of f(4.1) compare to the true value?|7.2 is an overestimate|7.2 is an underestimate|7.02 is exact|The tangent estimate is 7+2(0.1); concavity down places the graph below its tangent.
For y=x³ at x=2 with dx=0.01, what is the differential dy?|0.12|0.01|0.120601 exactly|The differential is f′(2)dx=12·0.01, distinct from the exact function change.
Using linearization at x=0, approximate e^(−0.02).|0.98|1.02|−0.02|The tangent approximation to e^x at zero is 1+x.
@4.7
Use L’Hôpital's rule to evaluate lim as x→0 ln(1+2x)/x.|2|1|0|The quotient has form 0/0; the derivative ratio is 2/(1+2x).
Find lim as x→∞ of x²/e^x using repeated L’Hôpital applications.|0|2|∞|The derivative ratios are 2x/e^x and then 2/e^x, which tends to zero.
To apply L’Hôpital to lim as x→0+ of x ln x, what quotient rewrite is useful?|ln x/(1/x)|ln x/x|x/ln x|The equivalent quotient has form −∞/∞ and can be handled by the rule.
Evaluate lim as x→0 of (e^x−1−x)/x².|1/2|1|0|Two valid 0/0 applications yield e^x/2, which tends to 1/2.
A student applies L’Hôpital to (x²+1)/x as x→0 and reports 0. What went wrong?|The original quotient is not 0/0 or ∞/∞|The derivative of x² is x|L’Hôpital is never valid for polynomials|The numerator tends to 1 and denominator to 0, so the indeterminate-form prerequisite fails.
@5.1
For f(x)=x³ on [0,2], find the MVT input c in (0,2).|2/√3|1|√3|The average slope is 4; solve 3c²=4 and take the positive interior root.
Does MVT apply to f(x)=1/x on [−1,1]?|No; continuity fails within the interval|Yes; the endpoint secant is defined|Yes; choose c=0|The function is undefined at 0, so the theorem's hypotheses are not met.
If f′(x)=2 for every x in (1,5) and f is continuous on [1,5], find f(5)−f(1).|8|2|10|MVT gives a secant slope of 2 over an interval of length 4.
A differentiable f has f(0)=f(4)=3. What does Rolle's theorem guarantee?|At least one c in (0,4) with f′(c)=0|A c with f(c)=0|f′(2)=0 specifically|The zero endpoint secant slope is attained at some interior point, not necessarily the midpoint.
If abs(f′(x))≤3 on [0,2], what bound follows for abs(f(2)−f(0))?|At most 6|At most 3|Exactly 6|The mean-value estimate bounds output change by the derivative bound times interval length.
@5.2
Which function satisfies the Extreme Value Theorem's hypotheses on [0,1]?|f(x)=√x|f(x)=1/x|f(x)=ln x|The square-root function is continuous on the entire closed interval, including the endpoint.
For f(x)=x^(2/3), is x=0 a critical number?|Yes; f exists there but f′ does not|No; only derivative zeros qualify|No; f(0)=0|An interior domain point where the derivative is undefined is also a critical number.
For f(x)=1/(x−2), is x=2 a critical number?|No; it is outside the function's domain|Yes; the derivative is undefined there|Yes; it is a vertical asymptote|Critical numbers must first be inputs where the function exists.
What are the critical numbers of f(x)=x³−3x?|−1 and 1|0 only|−3 and 3|Solve f′(x)=3x²−3=0; this polynomial has no other derivative failures.
A continuous function on [−2,5] has no interior critical numbers. Where must its absolute extrema occur?|At the endpoints|Nowhere; extrema need critical numbers|At the midpoint|EVT ensures attained extrema, and any interior extremum would be a critical number.
@5.3
For f′(x)=x(x−2), on which interval is f decreasing?|(0,2)|(−∞,0)|(2,∞)|The derivative's two factors have opposite signs between 0 and 2.
If f′(x)=−(x+1)², what is true about f on (0,3)?|It is decreasing|It is increasing|It is constant|The derivative is strictly negative throughout that interval.
For f(x)=x³−12x, where is f increasing?|(−∞,−2) and (2,∞)|(−2,2)|Everywhere|Its derivative 3(x²−4) is positive outside the roots ±2.
A derivative sign chart has + on (−∞,1), 0 at 1, and + on (1,∞). Does the zero force a decreasing interval?|No; a zero at one point does not change the positive signs|Yes; immediately after 1|Yes; immediately before 1|Monotonicity follows the derivative signs on intervals rather than the isolated zero.
For f,g continuous on [a,b] and differentiable inside, if f′(x)>g′(x) on (a,b) and f(a)=g(a), which comparison holds for a<x<b?|f(x)>g(x)|f(x)<g(x)|f(x)=g(x)|The difference f−g starts at zero and has positive derivative, so it increases above zero.
@5.4
For f′(x)=−(x+2)(x−1), classify the critical input x=−2.|Local minimum|Local maximum|Neither|The derivative changes from negative to positive across −2.
For f′(x)=(x−2)², what does the first-derivative test say at x=2?|No local extremum|Local minimum|Local maximum|The derivative is positive on both sides, so f continues increasing.
For f(x)=abs(x−1), what does its slope change imply at 1?|A local minimum despite the undefined derivative|No extremum because the derivative is undefined|A local maximum|Slopes change from −1 to 1, giving a valley at a point in the domain.
A continuous f has f′<0 immediately left and right of c. If f′(c)=0, how is c classified?|Neither a local maximum nor a local minimum|Local minimum|Local maximum|The function decreases through c without changing direction.
For f(x)=x³−3x, classify the critical input x=1.|Local minimum|Local maximum|Stationary inflection|The derivative 3(x²−1) changes from negative to positive at 1.
@5.5
Find the absolute minimum of f(x)=x³−3x on [−2,2].|−2, attained at x=−2 and x=1|−2, attained only at x=1|2, attained at x=−1 and x=2|Check endpoints and critical inputs ±1: the values are −2,2,−2,2.
Find the absolute maximum of f(x)=x(4−x) on [0,3].|4 at x=2|3 at x=3|0 at x=0|The interior derivative zero is x=2, where the output exceeds both endpoint values.
For f(x)=abs(x−2) on [0,5], where is the absolute minimum?|x=2|x=0|x=5|Include the nondifferentiable interior point; its value 0 is smallest.
A continuous f on [a,b] has candidates with outputs f(a)=4, f(c)=−1, and f(b)=3, with no other critical inputs. What is the absolute maximum value?|4|3|−1|Compare the function outputs at all endpoint and critical-point candidates.
Find the absolute minimum of f(x)=1/x on [1,4].|1/4 at x=4|1 at x=1|0 at infinity|The function decreases on the closed interval, so its minimum is the right endpoint value.
@5.6
For f(x)=x⁴−6x², where is f concave down?|(−1,1)|(−∞,−1)∪(1,∞)|(−√3,√3)|The second derivative is 12(x²−1), negative between −1 and 1.
If f″(x)=x²(x−2), which listed input gives a concavity change?|2 only|0 only|Both 0 and 2|The squared factor does not change sign at 0, while x−2 does at 2.
Can an inflection point occur where f″ is undefined but f is continuous?|Yes, if concavity changes|No; f″ must equal zero|Only if f′ is also zero|The definition depends on changing concavity; x^(1/3) at 0 is an example.
For f(x)=ln x on x>0, what is its concavity?|Concave down|Concave up|It changes concavity at x=1|The second derivative −1/x² is negative throughout its domain.
A graph is decreasing and concave up. How do its tangent slopes behave?|They are negative and become less negative|They are positive and become larger|They are negative and become more negative|Decreasing means negative slopes, while concavity up means those slopes increase.
@5.7
For f(x)=x³−6x²+9x, use the second-derivative test to classify x=1.|Local maximum|Local minimum|Inconclusive|f′(1)=0 and f″(1)=6−12=−6, so the stationary point is a maximum.
For f(x)=x³−6x²+9x, classify x=3 using the second derivative.|Local minimum|Local maximum|Inconclusive|f′(3)=0 and f″(3)=18−12=6>0.
For f(x)=−x⁴, the second-derivative test at 0 gives which conclusion?|Inconclusive, although another method shows a maximum|A local minimum|A proof that no extremum exists|Both f′(0) and f″(0) vanish; checking values shows f(x)≤f(0).
If f′(a)=2 and f″(a)=−3, can the second-derivative test classify a as a local maximum?|No; the stationary-point condition is missing|Yes; any negative second derivative gives a maximum|Yes; 2 is positive|The test requires f′(a)=0 before the second derivative's sign classifies an extremum.
For f(x)=e^x−2x, classify its stationary input x=ln 2.|Local minimum|Local maximum|Inflection point|At ln 2, f′=e^x−2=0 and f″=e^x=2>0.
@5.8
Which description fits f(x)=−x² on x>0?|Decreasing and concave down|Increasing and concave down|Decreasing and concave up|f′=−2x<0 and f″=−2<0 on positive inputs.
A sketch of f has f′<0 before c, f′>0 after c, and continuity at c. What feature must the sketch show?|A local valley at c|A local peak at c|A vertical asymptote at c|The function switches from decreasing to increasing at the continuous joining point.
For f(x)=x³, which features belong at the origin?|A horizontal tangent and a change in concavity, with no extremum|A local minimum|A vertical asymptote|f′=3x² stays nonnegative while f″=6x changes sign.
When sketching f(x)=(x²−1)/(x−1), what feature belongs at (1,2)?|An open hole|A filled point automatically|A vertical asymptote|The original formula excludes x=1, though the nearby graph follows y=x+1.
A curve has f′>0 and f″>0 on an interval. Which sketch direction fits?|Rising with progressively steeper positive tangents|Falling with progressively steeper negative tangents|Rising with progressively flatter tangents|Both the function and its tangent slopes increase.
@5.9
The graph of f′ is below the x-axis and rising on an interval. Describe f.|Decreasing and concave up|Increasing and concave down|Decreasing and concave down|The sign of f′ sets decreasing behavior; its positive slope sets upward concavity.
At c, the graph of f′ touches the x-axis and stays positive on both sides. What can be inferred about f at c?|A horizontal tangent without a local extremum|A local minimum|A local maximum|The derivative vanishes but does not change sign.
If the graph of f′ has a smooth local maximum at c and changes from increasing to decreasing there, what happens to f's concavity?|It changes from up to down|It changes from down to up|It stays up|The monotonicity of f′ determines the concavity of f.
Two functions satisfy f′(x)=g′(x) on an interval. How can their graphs differ there?|By a vertical shift|By arbitrary horizontal scaling|By opposite concavity|Their difference has derivative zero and is therefore constant on the interval.
If f″ is negative while f′ crosses zero from positive to negative, which feature does f have?|A local maximum in a concave-down region|A local minimum in a concave-up region|A required x-intercept|The first derivative gives the peak, while the second derivative describes curvature rather than height.
@5.10
A farmer uses 60 m of fencing for three sides of a rectangle beside a straight river. With each perpendicular side x, what is the area objective?|A(x)=x(60−2x), 0<x<30|A(x)=x(60−x), 0<x<60|A(x)=60x, x>0|The remaining fenced side is 60−2x, and both dimensions must be positive.
A closed cylinder has fixed volume V₀. Express its surface area as a function of radius r>0.|S(r)=2πr²+2V₀/r|S(r)=πr²+V₀/r|S(r)=2πr²+2πrV₀|Substitute h=V₀/(πr²) into 2πr²+2πrh.
A 12-by-8 sheet has squares of side x cut from its corners to form an open box. What is the feasible nondegenerate domain?|0<x<4|0<x<6|0<x<8|Both base lengths 12−2x and 8−2x must stay positive, with x>0.
To find the point on a curve nearest a fixed point, why can squared distance be minimized instead of distance?|Squaring is increasing on nonnegative distances and preserves their minimizer|Squared distance always has the same derivative|Distance can be negative|Removing the square root simplifies the objective without changing which nonnegative distance is least.
A product has price p(q)=30−q and cost C(q)=5q+20. Which profit objective is correct?|P(q)=25q−q²−20|P(q)=30−q−5q−20|P(q)=35q−q²+20|Revenue is quantity times price; subtract cost from q(30−q).
@5.11
Maximize A(x)=x(60−2x) for 0<x<30. What dimensions give the maximum?|15 m by 30 m|20 m by 20 m|10 m by 40 m|A′=60−4x vanishes at 15, and A″=−4 confirms the maximum.
For P(q)=25q−q²−20 with real 0≤q≤30, which quantity maximizes profit?|q=12.5|q=25|q=30|The derivative 25−2q changes from positive to negative at q=12.5.
Find the positive x minimizing f(x)=x²+16/x².|x=2|x=4|x=√2|Solve f′=2x−32/x³=0 to get x⁴=16; the derivative changes from negative to positive at 2.
For an open-top square-base box of volume 32, surface area is S(x)=x²+128/x. Which base side minimizes area?|x=4|x=2|x=8|S′=2x−128/x² vanishes at x³=64, and S″=2+256/x³>0 for positive x.
A differentiable objective is strictly increasing over a closed feasible interval [2,7]. Where is its global maximum?|At x=7|At an interior derivative zero|At x=2|Monotonicity places the largest value at the feasible right endpoint.
@5.12
For x²+4y²=4 at (0,1), what is the tangent line?|y=1|x=0|y=−x+1|Implicit differentiation gives y′=−x/(4y), which is zero at (0,1).
For x²+y²=16 at (0,−4), what is the sign of y″?|Positive|Negative|Zero|The circle formula y″=−16/y³ is positive when y is negative.
For xy=4 at (2,2), determine the local concavity of y as a function of x.|Concave up|Concave down|No concavity because the relation is implicit|Here y=4/x, so y″=8/x³>0 at x=2.
On x²+xy+y²=3, is the tangent at (1,1) horizontal, vertical, or neither?|Neither; its slope is −1|Horizontal|Vertical|The point lies on the curve, and y′=−(2x+y)/(x+2y)=−3/3.
For x²+y²=1, why can the formula y′=−x/y not be evaluated at (1,0)?|The tangent is vertical and dy/dx is not finite there|The point is not on the circle|The slope must be zero there|The denominator vanishes while the numerator does not; the curve has a vertical tangent.
`;
