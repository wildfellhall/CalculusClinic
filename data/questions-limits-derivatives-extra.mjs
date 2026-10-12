export default `
@1.1
A population P(t)=100+4t² is measured in thousands. What is its average growth rate from t=1 to t=3 years?|16 thousand per year|32 thousand per year|8 thousand per year|The population changes from 104 to 136 thousand over two years, giving 32/2.
For s(t)=t³, which quotient gives the average velocity from t=2 to t=2+h, h≠0?|[(2+h)³−8]/h|[(2+h)³−8]/2|(2+h)³/h|Average velocity divides position change by the elapsed time h.
For f(x)=x², secant slopes from x=3 to x=3+h equal 6+h. What slope do they approach as h→0?|6|3|0|As the second point approaches the first, the secant slope approaches 6.
A car's average velocity over an hour is zero. Must its velocity have been zero throughout?|No; motion in opposite directions may cancel|Yes; every instantaneous velocity equals the average|Yes; a zero average means no distance was traveled|Average velocity measures net position change; it does not record all motion within the interval.
For a cooling object, temperature decreases by 6°C in 2 minutes. What is its average temperature-change rate?|−3°C per minute|3°C per minute|−12°C per minute|Use the signed change −6 divided by the elapsed time 2.
@1.2
For f(x)=abs(x)/x, find lim as x→0 from the left.|−1|1|0|For negative x, abs(x)=−x, so the quotient is −1.
f(x)=2x for x<1 and f(x)=x+1 for x>1. What is lim as x→1 f(x)?|2|1|Does not exist because f(1) is missing|Both expressions approach 2; the undefined point does not prevent the limit.
If lim as x→a f(x)=L, which alteration alone leaves this limit unchanged?|Changing only f(a)|Adding 1 to every nearby value|Replacing nearby values with 0|Limits use nearby inputs different from a, so changing only the point value has no effect.
For f(x)=1/(x−1), are the one-sided limits at x=1 equal?|No; the left is −∞ and the right is +∞|Yes; both are +∞|Yes; both are 0|The denominator has opposite signs on the two sides.
If a function is defined only for x≥0, which limit tests continuity at its endpoint 0?|The right-hand limit as x→0|The left-hand limit as x→0|A limit as x→∞|Approach the endpoint through inputs in the function's domain.
@1.3
A graph approaches (−1,2) from the left and (−1,−3) from the right; its filled point is (−1,4). What is the right-hand limit?|−3|2|4|Follow the branch with inputs greater than −1; the filled point does not set the limit.
A graph has a hole at (3,−2) on a continuous branch and a filled point at (3,5). What is lim as x→3 [f(x)+1]?|−1|6|Does not exist|The branch approaches −2; adding 1 gives a limit of −1.
Near x=2, a graph drops without bound from both sides. Which notation describes that behavior?|lim as x→2 f(x)=−∞|lim as x→2 f(x)=0|f(2)=−∞ as a real value|A negative infinite limit describes unbounded decrease, not a real point value.
A graph's left branch approaches height 6 at x=0 while the right branch oscillates between 1 and 2 arbitrarily close to 0. Does a two-sided limit exist?|No|Yes, it is 6|Yes, it is 3.75|The right-hand behavior does not approach any single height.
A graph follows the line y=3x−2 near x=2 except for a hole at x=2. Which limiting height should be read?|4|2|−2|Nearby points on that line approach 3·2−2=4.
@1.4
At x=0.9,0.99,1.01,1.1 a table lists 1.9,1.99,2.01,2.1. What limit at 1 is suggested?|2|1|0|Values on both sides of 1 approach 2.
A table near 0 lists f(−0.01)=−100 and f(0.01)=100. Is averaging these enough to establish a zero limit?|No; opposite-side values need not approach their average|Yes; symmetric inputs always prove a zero limit|Yes; positive and negative infinities cancel|A limit is not an average of two samples, and unbounded behavior needs analysis.
A table has f(1.999)=7.001, f(2.001)=6.999, and f(2)=0. Which limit at 2 is suggested?|7|0|2|The nearby samples suggest 7 regardless of the value exactly at 2.
To investigate lim as x→−2 from the left, which sequence of inputs is appropriate?|−2.1, −2.01, −2.001|−1.9, −1.99, −1.999|−2, −2, −2|Inputs less than −2 approach it from the left.
A rounded table shows every near-0 output as 1.000. Which statement is justified?|The samples suggest a limit near 1, but do not prove one|The exact function is constant on a neighborhood|The limit must equal exactly 1|Rounding can hide changes, and finite samples leave unsampled behavior unknown.
@1.5
If lim f(x)=−2 and lim g(x)=3 at a, find lim [f(x)²+2g(x)].|10|2|−10|Apply the limit laws: (−2)²+2·3=4+6.
Evaluate lim as x→−1 of (x³−2x+4).|5|1|3|Polynomials are continuous, so substitute −1: −1+2+4=5.
If f(x)→4 near a and f(x) is nonnegative there, find lim √f(x).|2|4|16|The square-root function is continuous at 4, so take the square root of the limit.
If f(x)→0 and g(x)→5, what is lim f(x)/g(x)?|0|Undefined because the numerator tends to zero|5|The quotient law applies because the denominator limit is nonzero.
Evaluate lim as x→0 of (cos x+2e^x).|3|2|0|Both functions are continuous at 0; cos 0=1 and e⁰=1.
@1.6
Evaluate lim as x→−2 of (x²−4)/(x+2).|−4|0|4|Factor and cancel x+2 for nearby x, leaving x−2.
Find lim as x→0 of (√(9+x)−3)/x.|1/6|1/3|0|Rationalization gives 1/(√(9+x)+3), which tends to 1/6.
Find lim as h→0 of [(1+h)³−1]/h.|3|1|0|Expand to 3h+3h²+h³, cancel h, then take the limit.
Evaluate lim as x→1 of (x³−1)/(x²−1).|3/2|1|0|Cancel the common factor x−1 to obtain (x²+x+1)/(x+1).
For x≠0, simplify [1/(1+x)−1]/x before taking x→0. What is the limit?|−1|1|0|Combining the numerator gives −x/(1+x); division by x leaves −1/(1+x).
@1.7
For lim as x→0 sin(5x)/x, which rewrite directly uses sin u/u→1?|5·sin(5x)/(5x)|sin(5x)/(5x)|5·sin x|Multiply and divide by 5 to preserve the original expression and obtain the standard limit.
A rational expression has a nonzero numerator and a denominator approaching zero. Which next step is most useful?|Check the denominator's sign on each side|Declare the limit equal to zero|Cancel the zero denominator numerically|One-sided signs distinguish positive and negative unbounded behavior.
For lim as x→2 of (x−2)/(√x−√2), which strategy resolves the indeterminate form?|Multiply by √x+√2|Substitute and divide zero by zero|Apply the quotient limit law with denominator zero|The conjugate changes the denominator to x−2, allowing cancellation nearby.
For lim as x→∞ of (2x³+x)/(5x³−1), which algebraic step is useful?|Divide numerator and denominator by x³|Set x equal to infinity as a real number|Cancel x³ from only the leading terms|Dividing every term by the highest denominator power isolates the leading-coefficient ratio.
For a piecewise function's limit at its joining input, which approach is reliable?|Compute each side using its own branch|Use whichever branch includes equality|Average the two formulas at the joining input|The two-sided limit exists only if the independently computed one-sided limits agree.
@1.8
If −2x²≤g(x)≤5x² near 0, what is lim as x→0 g(x)?|0|3|Cannot be determined because the bounds differ|Both bounding expressions tend to the same value 0.
For radians, evaluate lim as x→0 sin(4x)/(2x).|2|4|1/2|Rewrite as 2·sin(4x)/(4x) and use the standard squeezed trigonometric limit.
If abs(h(x)−3)≤(x−2)² near 2, what is lim as x→2 h(x)?|3|0|2|The inequality places h between 3−(x−2)² and 3+(x−2)².
Evaluate lim as x→0 of x cos(1/x), with x≠0.|0|1|Does not exist|Its absolute value is at most abs(x), which tends to zero even though the cosine oscillates.
To apply the squeeze theorem at a, must both bounds equal f at every nearby input?|No; inequalities and matching bounding limits are enough|Yes; all three functions must coincide nearby|Yes; both bounds must be constant|The functions may differ near a while their limiting bounds agree.
@1.9
For f(x)=(x²−9)/(x−3), x≠3, which table-and-graph description matches the formula?|Outputs approach 6 near 3 and the graph has a hole at (3,6)|Outputs approach 0 and the graph crosses (3,0)|Outputs are unbounded near 3|Factoring leaves x+3 away from the excluded input.
A formula gives f(x)=−1 for x<0 and f(x)=1 for x≥0. Which graph feature explains its limit failure at 0?|A jump between heights −1 and 1|A single removable hole at height 0|A vertical asymptote|The left and right branches approach different finite heights.
For f(x)=1/x², what should a sufficiently detailed table near 0 show?|Large positive outputs on both sides|Large negative outputs on the left only|Outputs tending to zero|Squaring makes the denominator small and positive from either side.
If a plotted graph seems smooth at x=1 but the exact formula excludes x=1, what should you check?|Whether a hole is hidden by the plotting resolution|Whether smooth-looking plots override the formula|Whether every excluded input is a vertical asymptote|Graphing resolution can hide a removable gap; evaluate the nearby limit algebraically.
For f(x)=sin x/x with x≠0 in radians, which graph description matches its limit at 0?|A branch approaching height 1 with the point at 0 missing|A branch approaching height 0|A vertical asymptote at 0|The standard limit is 1 although the original formula is undefined at 0.
@1.10
Classify the discontinuity at x=2 of f(x)=x+1 for x≠2 with f(2)=−4.|Removable|Jump|Infinite|Both sides approach 3; changing only f(2) to 3 repairs continuity.
What type of discontinuity does tan x have at x=π/2?|Infinite|Removable|A finite jump|Cosine tends to zero while sine tends to 1, producing unbounded one-sided behavior.
For f(x)=0 when x<1 and f(x)=2 when x≥1, why is the discontinuity not removable?|The one-sided limits disagree|The function value at 1 is undefined|Every piecewise function has an infinite discontinuity|No single assigned value can change the limiting heights 0 and 2.
If f is unbounded near a, could assigning f(a)=100 make it continuous there?|No; a finite point value cannot match an unbounded limit|Yes, if 100 is sufficiently large|Yes, if both sides have the same infinite behavior|Real-valued continuity requires a finite limit equal to the finite function value.
For f(x)=sin(1/x), x≠0, can any assigned f(0) create continuity at 0?|No; nearby outputs keep oscillating|Yes, f(0)=0|Yes, f(0)=1|Different sequences approaching 0 give different output limits, so there is no finite common limit to use.
@1.11
Let f(x)=x² for x<2 and f(x)=kx+2 for x≥2. Which k makes f continuous at 2?|1|2|−1|The left limit is 4, while the right limit and value are 2k+2; equate them.
A function has f(1)=4 and right-hand limit 4, but left-hand limit 3. Is it continuous at 1?|No; the two-sided limit does not exist|Yes; the right-hand limit matches the value|Yes; all quantities are finite|Both sides must approach the function value at an interior point.
Which continuity condition fails for f(x)=(x−1)/(x−1) at x=1?|f(1) is not defined|The nearby limit does not exist|The nearby limit is infinite|The formula equals 1 for x≠1, but the original quotient is undefined at 1.
If f and g are continuous at a and g(a)≠0, is f/g continuous at a?|Yes|Only when f(a)≠0|Only if f and g are differentiable|The quotient continuity rule requires a nonzero denominator value, not nonzero numerator or differentiability.
For f(x)=abs(x−2)+1, what establishes continuity at x=2?|Both one-sided limits and f(2) equal 1|The derivative exists at 2|f(2)=0|The corner prevents differentiability but not matching limits and function value.
@1.12
On which intervals is f(x)=1/(x²−1) continuous?|(−∞,−1), (−1,1), and (1,∞)|(−∞,1) and (1,∞)|All real numbers|A rational function is continuous except at the denominator zeros −1 and 1.
For continuity on [a,b], what endpoint condition is required at b?|lim as x→b from the left f(x)=f(b)|lim as x→b from the right f(x)=f(b) only|f′(b)=0|The endpoint is approached through points inside the interval, which lie to its left.
Is f(x)=√(4−x²) continuous on [−2,2]?|Yes, including one-sided continuity at the endpoints|No, because its derivative fails at the endpoints|No, because f is zero at the endpoints|The radicand is nonnegative on the interval, and composition preserves continuity there.
If g is continuous on [a,b] and g(x)>0 there, which function must be continuous on [a,b]?|ln(g(x))|1/(g(x)−g(a))|tan(g(x)) for every such g|The positive outputs stay inside the logarithm's continuity domain; the other expressions can have undefined values.
Which closed interval lies entirely in the continuity domain of ln(x−2)?|[3,5]|[2,5]|[1,3]|The logarithm requires x>2 at every input, including endpoints.
@1.13
For x≠0, f(x)=(e^x−1)/x has limit 1 at 0. What value of f(0) makes the extension continuous?|1|0|e|Assign the missing value equal to the given finite two-sided limit.
Define f(x)=(x²−4x+3)/(x−1) for x≠1. Which value fills the hole continuously at 1?|−2|2|0|Factor the numerator as (x−1)(x−3); the nearby expression tends to −2.
For f(x)=ax+2 when x<0 and f(x)=x²+b when x≥0, which condition ensures continuity at 0?|b=2, with any real a|a=b|a=0 and b=0|The left limit is 2 independent of a; the right limit and value are b.
For f(x)=kx² when x≤2 and f(x)=3x+2 when x>2, find k for continuity.|2|4|1|At x=2, equate 4k with 3·2+2=8.
A function has left limit 4 and right limit −4 at a. Does f(a)=0 make it continuous?|No; changing the value cannot repair unequal one-sided limits|Yes; 0 is their average|Yes; finite one-sided limits are enough|The obstruction is the missing two-sided limit, not merely the point value.
@1.14
Find lim as x→3 from the left of 2/(x−3).|−∞|+∞|0|The numerator is positive while the denominator tends to zero through negative values.
Find lim as x→−1 of −5/(x+1)².|−∞|+∞|0|The squared denominator is positive and approaches zero; the negative numerator fixes the sign.
Which vertical asymptote does (x−2)/[(x−2)(x+1)] have?|x=−1|x=2 only|Both x=−1 and x=2|Away from exclusions the expression is 1/(x+1); x=2 is a hole, while x=−1 remains unbounded.
For f(x)=1/(x−4)³, compare the one-sided limits at 4.|Left −∞, right +∞|Both +∞|Left +∞, right −∞|An odd power preserves the sign of x−4.
If lim as x→a from the right f(x)=+∞ but f(a)=7, is x=a still a vertical asymptote?|Yes|No, a vertical asymptote requires f(a) to be undefined|No, 7 prevents unbounded nearby values|A vertical asymptote describes nearby one-sided behavior and does not depend on the assigned point value.
@1.15
Find lim as x→∞ of (4x−1)/(x²+3).|0|4|∞|The denominator has higher degree, so the ratio tends to zero.
Find lim as x→−∞ of (2x³+1)/(x³−5x).|2|−2|0|The equal leading degrees give 2/1 at either infinite end.
Evaluate lim as x→∞ of [√(x²+4)−x].|0|2|∞|Rationalizing gives 4/(√(x²+4)+x), whose denominator grows without bound.
What horizontal asymptote does f(x)=3+e^(−x) approach as x→∞?|y=3|y=0|x=3|The exponential term tends to zero as its exponent tends to −∞.
Find lim as x→−∞ of √(x²+9)/x.|−1|1|0|The numerator behaves like abs(x)=−x for negative x.
@1.16
A continuous f has f(−2)=1 and f(3)=8. Which equation must have a solution in (−2,3)?|f(x)=5|f(x)=0|f(x)=10|The target 5 lies strictly between the endpoint values 1 and 8.
To use IVT to prove x³+x−1=0 has a root in (0,1), which facts suffice?|The polynomial is continuous and its endpoint values have opposite signs|Its derivative is zero somewhere|Its endpoint values are both positive|Continuity and values −1 and 1 guarantee an intermediate value of zero.
A continuous f satisfies f(0)=f(2)=1. Does IVT alone guarantee a zero in (0,2)?|No|Yes|Yes, at x=1|Zero is not between the given endpoint values; a constant function 1 is a counterexample.
A continuous temperature record rises from 10°C to 16°C. What can IVT establish about 13°C?|It was reached at least once between the readings|It was reached exactly halfway in time|It was reached exactly once|Continuity guarantees attainment but does not specify timing or uniqueness.
Why can IVT not prove a root of f(x)=1/(x−2) on [1,3]?|f is not continuous on the entire interval|The endpoint values have the same sign|IVT requires a differentiable inverse|The missing input x=2 breaks the required continuity despite opposite endpoint signs.
@2.1
For f(x)=x³, find the average rate of change on [−1,2].|3|9|7/3|The output change is 8−(−1)=9 across an input change of 3.
A differentiable position s has s′(4)=−2 meters per second. What does this describe?|Instantaneous velocity at 4 seconds|Average velocity over the first 4 seconds|Position at 4 seconds|A derivative describes a local rate at the specified time.
For f(x)=5−3x, how do average and instantaneous rates compare?|Both equal −3 on every nonzero interval and at every input|The average is −3, but the instantaneous rate is 0|Both depend on the interval length|A line has one constant slope, so every secant and tangent share it.
If f(a+h)=f(a)+7h+h² near a, find f′(a).|7|0|7+h|The difference quotient is 7+h, which tends to 7.
A function decreases from 9 to 3 while x increases from 1 to 4. What is its average rate?|−2|2|−6|Divide the signed output change −6 by the input change 3.
@2.2
Which derivative is represented by lim as h→0 [(3+h)³−27]/h?|f′(3) for f(x)=x³|f′(27) for f(x)=x³|f′(0) for f(x)=3x|The numerator compares f(3+h) with f(3) for the cubic function.
For f(x)=1/x and a≠0, use the difference quotient to find f′(a).|−1/a²|1/a²|−1/a|Combining fractions gives the quotient −1/[a(a+h)], whose limit is −1/a².
Which limit is equivalent to f′(a), when it exists?|lim as x→a [f(x)−f(a)]/(x−a)|lim as x→a f(x)/(x−a)|lim as x→a [f(x)−f(a)]/x|This is the derivative definition with x=a+h and h=x−a.
If f′(2)=−3, what is lim as h→0 [f(2+h)−f(2)]/h?|−3|3|f(2)|The displayed limit is exactly the definition of f′(2).
For f(x)=4x−7, calculate [f(a+h)−f(a)]/h for h≠0.|4|4a−7|4h|The numerator is 4h after cancellation of the unchanged terms.
@2.3
Given f(1.8)=5.1 and f(2.2)=4.3, estimate f′(2) using a centered secant.|−2|−0.8|2|The output change −0.8 is divided by the input width 0.4.
A tangent line passes through (0,4) and (2,1). What derivative does its slope represent?|−3/2|3/2|−3|Its slope is (1−4)/(2−0)=−3/2.
f(5)=12 and f(5.02)=12.1. Use these values to estimate f′(5).|5|0.1|0.002|Divide the output increase 0.1 by the input increase 0.02.
For f(x)=x², a centered secant using a−h and a+h, h≠0, has what slope?|2a|2a+h|a²|The difference of squares is 4ah across a total input width of 2h.
Why may extremely tiny numerical step sizes give poor derivative estimates on a calculator?|Subtracting nearly equal rounded values can lose accuracy|Every small step makes the true derivative infinite|A derivative requires a step of exactly 1|Finite-precision subtraction can lose significant digits even when the mathematical limit exists.
@2.4
For f(x)=abs(x−3), compare the one-sided derivatives at 3.|Left −1, right 1|Both 1|Both 0|The graph has a corner where the absolute-value argument changes sign.
If f is differentiable at a, what is lim as x→a f(x)?|f(a)|f′(a)|0|Differentiability implies continuity, so the limit equals the function value.
Let f(x)=x² for x≤1 and f(x)=2x−1 for x>1. Is f differentiable at 1?|Yes; the values and both slopes match|No; every piecewise join fails differentiability|No; the right slope is 1|Both branches give value 1 and derivative 2 at the joining point.
Let f(x)=x² for x<1 and f(x)=3x−2 for x≥1. What happens at 1?|f is continuous but not differentiable|f is differentiable with derivative 2|f has a jump|The values agree at 1, but the one-sided slopes are 2 and 3.
A function has a removable hole at a. Can the original function be differentiable there before the hole is filled?|No, because it is not continuous there|Yes, if the surrounding curve looks smooth|Yes, if the left and right graph slopes match|Differentiability requires a defined function value and continuity at that input.
@2.5
Differentiate x^(−1/2) for x>0.|−1/(2x^(3/2))|1/(2√x)|−1/√x|Multiply by −1/2 and subtract 1 from the exponent.
For f(x)=x⁷, find f′(−1).|7|−7|−1|The derivative is 7x⁶, and the even power is positive at −1.
Differentiate x^(2/3) at x=8.|1/3|4/3|2|The derivative is (2/3)x^(−1/3); the cube root of 8 is 2.
For x≠0, differentiate 1/x⁴.|−4/x⁵|4/x³|−1/x⁵|Rewrite the function as x^(−4), then apply the power rule.
Which expression is the derivative of 5√x for x>0?|5/(2√x)|5√x/2|10√x|The constant factor 5 multiplies the derivative of x^(1/2).
@2.6
Differentiate 2x⁴−3x²+8x−6.|8x³−6x+8|8x³−6x−6|2x³−3x+8|Apply the power rule term by term and drop the constant term.
If f′(3)=−2 and g′(3)=5, find (4f−2g)′(3).|−18|2|−8|Linearity gives 4(−2)−2(5)=−18.
For f(x)=7−x, what is f′(100)?|−1|99|0|The derivative is the constant −1 at every input.
If h(x)=f(x)+12, how does h′ relate to f′?|h′=f′|h′=f′+12|h′=12f′|A vertical shift adds a constant whose derivative is zero.
Differentiate (x²+3x)/2.|x+3/2|2x+3|x+3|Distribute the constant factor 1/2 over the derivatives 2x and 3.
@2.7
Find the derivative of 2 sin x−3 cos x.|2 cos x+3 sin x|2 cos x−3 sin x|−2 sin x−3 cos x|Differentiate sine to cosine and cosine to negative sine, keeping the constant factors.
For f(x)=ln x−e^x, find f′(1).|1−e|1+e|−e|The derivative is 1/x−e^x, evaluated at x=1.
Find the tangent slope to y=cos x at x=π/2.|−1|1|0|The derivative −sin x equals −1 at π/2.
Differentiate 5e^x+4 ln x for x>0.|5e^x+4/x|5xe^(x−1)+4/x|5e^x+4 ln x|Use the natural exponential and logarithm derivative rules independently.
If f(x)=sin x+cos x, at which listed input is f′(x)=0?|π/4|0|π/2|The derivative is cos x−sin x; these values agree at π/4.
@2.8
Differentiate (x+2)e^x.|(x+3)e^x|(x+2)e^x|e^x|The product rule gives e^x+(x+2)e^x, which combines to (x+3)e^x.
If f(1)=−1, g(1)=4, f′(1)=2, and g′(1)=3, find (fg)′(1).|5|6|11|Compute f′g+fg′=2·4+(−1)·3.
For h(x)=f(x)², express h′(x) using the product rule.|2f(x)f′(x)|f′(x)²|2f′(x)|Viewing h as f·f gives two equal terms f f′.
Differentiate x ln x for x>0.|ln x+1|1/x|x+ln x|The two product-rule terms are 1·ln x and x·(1/x).
For f(x)=x² cos x, find f′(π).|−2π|2π|−π²|The derivative is 2x cos x−x² sin x; at π only the first term remains.
@2.9
Differentiate (2x−1)/(x+3).|7/(x+3)²|5/(x+3)²|2|The quotient-rule numerator is 2(x+3)−(2x−1)=7.
For f(x)=e^x/x, x≠0, find f′(x).|e^x(x−1)/x²|e^x/x²|e^x(x+1)/x²|Use [x e^x−e^x]/x² and factor the numerator.
If f(a)=3, g(a)=−2, f′(a)=1, and g′(a)=4, find (f/g)′(a).|−7/2|5/2|−7|The numerator is 1(−2)−3(4)=−14 and the denominator is 4.
Differentiate 1/(x²+1).|−2x/(x²+1)²|1/(2x)|2x/(x²+1)²|The constant numerator has derivative zero; the remaining quotient-rule term is negative.
For f(x)=(x²−1)/x, what is f′(2)?|5/4|3/4|2|Rewrite as x−1/x; the derivative is 1+1/x².
@2.10
Find the derivative of tan x+cot x where both are defined.|sec²x−csc²x|sec²x+csc²x|sec x tan x−csc x cot x|Use the separate tangent and cotangent derivatives, retaining cotangent's negative sign.
For f(x)=sec x, find f′(0).|0|1|Undefined|sec 0·tan 0=1·0=0.
Evaluate the derivative of csc x at x=π/2.|0|−1|1|The formula −csc x cot x becomes −1·0.
Differentiate 3 tan x−2 sec x where defined.|3sec²x−2sec x tan x|3sec x tan x−2sec²x|3sec²x+2sec x tan x|Apply the constant-multiple rule to each trigonometric derivative.
For f(x)=cot x, what is f′(π/4)?|−2|2|−1|The derivative is −csc²x; sin²(π/4)=1/2.
@3.1
Differentiate cos(3x²).|−6x sin(3x²)|−sin(6x)|6x cos(3x²)|Differentiate the outer cosine and multiply by the inner derivative 6x.
For f(x)=√(1+4x), find f′(0).|2|1/2|4|The derivative is 2/√(1+4x), giving 2 at 0.
Differentiate e^(sin x).|e^(sin x) cos x|e^(cos x)|e^(sin x) sin x|Keep the inner input sin x in the exponential and multiply by its derivative.
If g(1)=3, g′(1)=−2, and f′(3)=5, find (f∘g)′(1).|−10|3|−5/2|The chain rule uses f′ at g(1), then multiplies by g′(1).
Differentiate (ln x)³ for x>0.|3(ln x)²/x|3(ln x)²|3/x³|The outer cube gives 3(ln x)², and the inner derivative supplies 1/x.
@3.2
For x²+xy+y²=7, find dy/dx at (1,2).|−4/5|−5/4|4/5|Differentiate to get 2x+y+(x+2y)y′=0, then substitute the point.
If sin y=x and cos y≠0, express dy/dx.|1/cos y|cos y|1/cos x|Implicit differentiation gives cos y·y′=1.
For y²=x³+1 at (2,3), find the tangent slope.|2|4|1/2|From 2y y′=3x², substitute x=2 and y=3 to get 12/6.
Differentiate x²y with respect to x when y depends on x.|2xy+x²y′|2xy′|2x y+x²|Use the product rule and include the derivative of the dependent variable y.
For x²+y²=9, where are the horizontal tangents?|At (0,3) and (0,−3)|At (3,0) and (−3,0)|At all four axis intercepts|The slope −x/y is zero when x=0 and y≠0.
@3.3
If f(−1)=2 and f′(−1)=−4, what is (f⁻¹)′(2)?|−1/4|−4|1/4|Use the reciprocal derivative at the corresponding original input −1.
For f(x)=e^x, find (f⁻¹)′(e²).|e^(−2)|e²|1/2|The inverse input e² corresponds to x=2, where f′(2)=e².
An invertible differentiable function has f(4)=7 and f′(4)=2. What is the tangent line to its inverse at (7,4)?|y−4=(1/2)(x−7)|y−7=2(x−4)|y−4=2(x−7)|The inverse exchanges coordinates and reciprocates the nonzero slope.
For f(x)=x³+x, find (f⁻¹)′(2).|1/4|1/13|4|Since f(1)=2, use 1/f′(1)=1/(3+1).
If f is increasing and f′(a)>0, what is the sign of (f⁻¹)′(f(a))?|Positive|Negative|Zero|Its value is the reciprocal of the positive number f′(a).
@3.4
Differentiate arcsin(3x) where abs(x)<1/3.|3/√(1−9x²)|1/√(1−9x²)|3/(1+9x²)|Use the inverse-sine derivative and the inner derivative 3.
Differentiate arccos(x²) for abs(x)<1.|−2x/√(1−x⁴)|2x/√(1−x⁴)|−2x/√(1−x²)|The inverse-cosine sign is negative, and its squared input is x⁴.
For f(x)=arctan(x²), find f′(1).|1|1/2|2|The derivative 2x/(1+x⁴) gives 2/2 at x=1.
For f(x)=2 arctan x, find f′(−1).|1|−1|2|The derivative is 2/(1+x²), positive at either sign of x.
Where is the derivative formula for arcsin x finite in the real numbers?|(−1,1)|[−1,1]|All real numbers|The denominator √(1−x²) must be real and nonzero.
@3.5
For y=x^x with x>0, which derivative is correct?|x^x(ln x+1)|x·x^(x−1)|x^x ln x|Taking logarithms gives ln y=x ln x, so y′/y=ln x+1.
Differentiate ln(x² e^x) for x>0 using a useful simplification.|2/x+1|2/x+e^x|1/(x² e^x)|Log laws give 2 ln x+x before differentiation.
Which rule sequence fits y=(sin x)/(1+x²)?|Quotient rule using cosine and 2x as the component derivatives|Product of the numerator and denominator derivatives|Power rule with exponent sin x|The outer operation is division, so combine the component derivatives with the quotient rule.
Differentiate x(1+x²)³.|(1+x²)³+6x²(1+x²)²|6x(1+x²)²|(1+x²)³+3x(1+x²)²|Use the product rule, then the chain rule on the cubic factor.
A student differentiates sin(x²) as cos²x. What factor-and-input correction is needed?|Use 2x cos(x²)|Use cos(2x)|Use 2 sin x cos x|The outer cosine keeps the input x², and the derivative of that input contributes 2x.
@3.6
For f(x)=e^(2x), find f‴(x).|8e^(2x)|6e^(2x)|e^(2x)|Each differentiation multiplies by another factor of 2.
For f(x)=sin x, find the fourth derivative.|sin x|−sin x|cos x|The derivative cycle returns to sine after four differentiations.
If s(t)=t³−3t²+2t, find s″(2).|6|2|0|Differentiate twice to obtain s″(t)=6t−6, then substitute 2.
For f(x)=ln x with x>0, find f″(x).|−1/x²|1/x²|−2/x³|Differentiate f′(x)=x^(−1) once more.
For f(x)=x² sin x, what is f″(0)?|0|2|1|Twice differentiating gives 2 sin x+4x cos x−x² sin x, whose terms all vanish at 0.
`;
