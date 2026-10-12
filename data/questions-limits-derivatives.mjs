export default `
@1.1
What does a secant slope measure?|Average change over an interval|The function value|Accumulated area|A secant uses two distinct input values.
To approach an instantaneous rate at a, which intervals are useful?|[a,a+h] as h→0|[a,a+h] as h→∞|Only [0,1]|Shrinking the interval approaches local behavior.
For s(t)=t², the average rate on [1,2] is…|3|2|4|Compute (4−1)/(2−1).
For s(t)=t², the average rate on [1,1.1] is…|2.1|1.1|0.21|Compute (1.21−1)/0.1.
Why not directly divide change by zero duration?|That quotient is undefined; use a limit|The rate must be zero|Every instantaneous rate is infinite|A limit describes shrinking nonzero intervals.
@1.2
If the left limit is 2 and the right limit is 3, the two-sided limit…|Does not exist|Equals 2.5|Equals 3|One-sided limits must agree.
If lim as x→a of f(x)=4 and f(a)=9, the limit is…|4|9|Undefined|The value at a does not change nearby behavior.
Can a limit exist where f(a) is undefined?|Yes|No|Only if the limit is zero|A limit concerns inputs near a.
For f(x)=abs(x)/x, find the limit as x→0 from the right.|1|−1|0|For positive x, abs(x)=x.
Both one-sided limits equal −2. The two-sided limit is…|−2|2|Undetermined|Equal finite one-sided limits establish the limit.
@1.3
A graph approaches height 3 from both sides of x=1, with f(1)=7. Find the limit.|3|7|Does not exist|Read the approaching branches, not the filled point.
A graph approaches height 1 on the left and 4 on the right at x=0. Find the limit.|Does not exist|2.5|4|The one-sided heights differ.
A hole is at (2,5), and the same smooth branch approaches it from both sides. Find lim f(x) as x→2.|5|2|Undefined because of the hole|The hole does not prevent a nearby limit.
Both branches rise without bound near x=3. The graph indicates…|An infinite limit of +∞|A finite limit of 3|A limit of 0|Unbounded positive values indicate +∞ behavior.
A graph is horizontal at y=−1 near x=4, except f(4)=0. Find the limit at 4.|−1|0|4|Nearby values remain −1.
@1.4
Near x=2, a table gives f(1.99)=3.98 and f(2.01)=4.02. Which limit is suggested?|4|2|0|Values from both sides are near 4.
A table samples only x>a. Which limit does it directly inform?|The right-hand limit|Both sides conclusively|Only f(a)|All samples lie to the right of a.
Can finitely many table values prove a limit for an otherwise unknown function?|No|Yes|Yes if there are ten values|Unsampled nearby behavior remains possible.
Left-side values approach −1 and right-side values approach 1. What is suggested?|No two-sided limit|A limit of 0|A limit of 1|The sides suggest unequal limits.
Which input pair is most useful for a two-sided estimate near x=3?|2.999 and 3.001|3.001 and 3.002|1 and 2|The first pair approaches from opposite sides.
@1.5
Find lim as x→2 of (x²+1).|5|3|4|A polynomial is continuous, so substitute.
If f→3 and g→2, find lim(2f−g).|4|1|8|Use linearity: 2·3−2=4.
When does the quotient limit law apply directly?|When the denominator limit is nonzero|Whenever the numerator limit is zero|For every denominator limit|The quotient law excludes a zero denominator limit.
Substitution gives 0/0. What follows?|More analysis is needed|The limit equals 0|The limit equals 1|0/0 is an indeterminate form.
Find lim as x→1 of (x+2)/(x+3).|3/4|1|2/3|The denominator tends to 4, so substitute.
@1.6
Find lim as x→3 of (x²−9)/(x−3).|6|0|Does not exist|Cancel x−3 near 3, then evaluate x+3.
Find lim as x→0 of (√(1+x)−1)/x.|1/2|0|1|Rationalization gives 1/(√(1+x)+1).
Find lim as x→2 of (x²−4)/(x²−x−2).|4/3|0|2|Factor both expressions and cancel x−2.
Cancelling x−a during a limit calculation is valid because…|The limit uses nearby x≠a|It defines f(a) automatically|Zero divided by zero equals one|The expressions agree on a punctured neighborhood.
Find lim as h→0 of ((2+h)²−4)/h.|4|2|0|Expansion leaves 4+h after cancellation.
@1.7
Substitution into a rational limit gives 5/2. What is the next step?|Use 5/2 as the limit|Factor until it becomes 0/0|Declare no limit|A nonzero limiting denominator permits substitution.
Substitution gives 0/0 with a radical difference. Which method is promising?|Multiply by the conjugate|Round inputs to whole numbers|Replace 0/0 with 0|A conjugate can remove the radical difference.
Only a graph with a jump is provided. What should you compare?|The two one-sided approaches|Only the filled point|The average of endpoint heights|Unequal one-sided limits rule out a two-sided limit.
Which is a valid first step for (x²−1)/(x−1) as x→1?|Substitute to identify the form|Assume the limit is 0|Set x−1=0 and cancel the zero|Identifying 0/0 guides the algebraic rewrite.
An oscillating expression is trapped between −x² and x² near 0. Choose a method.|Squeeze theorem|Polynomial division only|Read the value at 0|Both bounding functions tend to zero.
@1.8
Find lim as x→0 of x² sin(1/x).|0|1|Does not exist|Its absolute value is at most x².
If g≤f≤h near a and g,h both tend to 7, then f tends to…|7|Any value between 0 and 7|An unknown value|The shared bounds squeeze f to 7.
Does −1≤sin(1/x)≤1 prove a limit at 0?|No|Yes, the limit is 0|Yes, the limit is 1|The bounding limits differ.
With radians, lim as x→0 of sin x/x is…|1|0|∞|This standard trigonometric limit follows from a squeeze argument.
If abs(f(x))≤3 abs(x) near 0, find lim f(x) as x→0.|0|3|Does not exist|Both −3 abs(x) and 3 abs(x) tend to zero.
@1.9
The formula (x²−1)/(x−1) has which graphical feature at x=1?|A hole at height 2|A vertical asymptote|A filled point necessarily at 2|The nearby expression is x+1, but x=1 is excluded.
A table suggests limit 2 but the exact formula gives one-sided limits 1 and 3. Which conclusion is justified?|No two-sided limit|The table proves 2|Average the three values|Exact one-sided behavior outweighs finite sampling.
If lim f(x)=5 at a, which statement matches?|Nearby outputs approach 5|f(a) must equal 5|Every nearby output equals 5|Approaching does not mean equality.
For f(x)=x², which table behavior matches x→−2?|Outputs approach 4|Outputs approach −4|Outputs approach 2|Squaring inputs near −2 gives values near 4.
Which graph matches left limit 0 and right limit 2?|Branches approaching two different heights|One smooth branch through height 1|A horizontal line at y=2|The graph must represent distinct one-sided approaches.
@1.10
A finite limit exists at a but f(a) is missing. The discontinuity is…|Removable|A jump|Infinite|Defining the missing value as the limit repairs it.
Left and right finite limits are unequal. The discontinuity is…|A jump|Removable|Necessarily infinite|A jump has mismatched finite one-sided limits.
Near a, f(x)→+∞. What type occurs?|Infinite discontinuity|Removable discontinuity|Continuity at a|An unbounded approach cannot be repaired by one value.
Which discontinuity can a single reassigned value repair?|A hole with a finite common limit|A jump|An infinite discontinuity|Only the point-value mismatch needs repair.
sin(1/x) near x=0 fails to have a limit because of…|Persistent oscillation|A finite jump|A removable hole|Its oscillations do not settle to either one-sided value.
@1.11
For continuity at a, which equality is required?|lim as x→a f(x)=f(a)|f′(a)=f(a)|f(a)=0|The defined value must match the existing limit.
If lim f(x)=3 at a and f(a)=5, is f continuous at a?|No|Yes|Only if a=0|The limit and the value differ.
If both one-sided limits equal 2 and f(a)=2, is f continuous at a?|Yes|No|Only if differentiable|All three continuity conditions are satisfied.
f(x)=x+1 for x≠2 and f(2)=k. What k gives continuity?|3|2|1|The limiting value is 2+1=3.
Is abs(x) continuous at 0?|Yes|No because it has a corner|Only from the right|Both sides and the value equal zero.
@1.12
Where is 1/(x−2) continuous?|On (−∞,2) and (2,∞)|On all real numbers|Only at x=2|A rational function is continuous on its domain.
For continuity on [a,b], which condition is used at a?|Right continuity|Two-sided differentiability|Left continuity only|Approach the endpoint from within the interval.
Is √x continuous on [0,4]?|Yes|No at 0|Only on (0,4)|At 0, the right-hand limit matches the value.
On which interval is ln x continuous?| (0,∞)|[0,∞)|All real numbers|The real logarithm's domain is strictly positive.
If f and g are continuous on an interval, f+g is…|Continuous there|Always differentiable there|Always positive there|Continuity is preserved by addition.
@1.13
For x≠2, f(x)=(x²−4)/(x−2). Set f(2) to restore continuity.|4|2|0|The nearby expression x+2 tends to 4.
Can changing f(0) repair a jump with limits −1 and 1?|No|Yes, set it to 0|Yes, set it to 1|Changing one value does not change the one-sided limits.
f(x)=sin x/x for x≠0. What continuous extension fits at 0?|1|0|Undefined|The standard radian limit is 1.
f(x)=kx+1 for x<1 and f(x)=4 for x≥1. Find k for continuity.|3|4|1|Require k+1=4 at the joining point.
Which information is enough to choose a missing f(a) for continuity?|A finite two-sided limit L|Only a finite left limit|Only the value f(a+1)|Set f(a)=L when the common finite limit exists.
@1.14
Find lim as x→0 from the right of 1/x.|+∞|−∞|0|Positive reciprocal values grow without bound.
Find lim as x→0 from the left of 1/x.|−∞|+∞|0|Negative reciprocal values decrease without bound.
Does (x²−1)/(x−1) have a vertical asymptote at 1?|No, it has a hole|Yes|Only from the right|Cancellation leaves a finite nearby limit.
Find lim as x→2 of 1/(x−2)².|+∞|−∞|0|The squared denominator approaches zero positively.
If just the right-hand limit at a is +∞, may x=a be a vertical asymptote?|Yes|No, both sides must agree|Only if f(a) is undefined|One unbounded one-sided limit is sufficient.
@1.15
Find lim as x→∞ of (3x²+1)/(x²−5).|3|0|∞|Equal degrees give the leading-coefficient ratio.
Find lim as x→∞ of 5/x.|0|5|∞|A fixed numerator over growing magnitude tends to zero.
Can a graph cross a horizontal asymptote?|Yes|No|Only if it is discontinuous|The asymptote constrains end behavior, not every point.
Find lim as x→−∞ of x/√(x²+1).|−1|1|0|At negative inputs, √(x²) behaves like −x.
As x→∞, which grows faster: e^x or x³?|e^x|x³|They grow at the same rate|Exponential growth eventually exceeds any fixed power.
@1.16
f is continuous on [1,4], f(1)=−2, f(4)=3. What does IVT guarantee?|A zero somewhere in (1,4)|Exactly one zero|A zero at x=2|Zero lies strictly between the endpoint outputs.
Which condition is essential for IVT on [a,b]?|Continuity on [a,b]|Differentiability at every point|A positive derivative|IVT requires continuity, not differentiability.
Does IVT guarantee uniqueness of an intermediate value's input?|No|Yes|Only for a target of zero|Several inputs can attain the same output.
f is continuous on [0,2] with endpoint values 4 and 8. Which value is guaranteed inside?|6|10|0|Six lies strictly between 4 and 8.
f(x)=1/x on [−1,1] has opposite endpoint signs. Does IVT guarantee a root?|No, continuity fails|Yes, at 0|Yes, at an unknown point|The domain break at 0 violates the hypothesis.
@2.1
For f(x)=x², average rate on [1,3] is…|4|6|2|Compute (9−1)/(3−1).
For f(x)=x², instantaneous rate at x=3 is…|6|9|3|The difference-quotient limit is 2·3.
Average rate uses which geometric object?|A secant line|Only a filled point|Area under the graph|The secant connects two graph points.
For constant f(x)=7, every average rate is…|0|7|Undefined|There is no output change.
If s is in meters and t in seconds, instantaneous rate has units…|m/s|m|m·s|The rate divides position change by time change.
@2.2
Which limit defines f′(a)?|lim h→0 [f(a+h)−f(a)]/h|lim h→0 f(a+h)/h|lim h→0 [f(a)+f(h)]|The difference quotient compares nearby outputs.
Using the definition for f(x)=x², f′(a) is…|2a|a²|2|Expand (a+h)² and cancel h.
What does dy/dx denote?|The derivative of y with respect to x|The value y divided by x|The second derivative|Leibniz notation names the differentiation variable.
For f(x)=3x+2, the difference quotient equals…|3|3x|2|The constant cancels and the numerator is 3h.
If the difference-quotient limit is infinite, is there a finite derivative there?|No|Yes, it equals 0|Yes, it equals infinity as a real value|Differentiability requires a finite real derivative.
@2.3
f(1.9)=3.61 and f(2.1)=4.41. Estimate f′(2) with a centered difference.|4|0.8|8|Divide 0.8 by the input width 0.2.
A tangent rises 6 units over a run of 2. Estimate the derivative.|3|12|1/3|Tangent slope is rise divided by run.
f(3)=5 and f(3.01)=5.04. Estimate f′(3) from these values.|4|0.04|0.4|Divide the output change by 0.01.
Is a finite difference generally an exact derivative?|No|Yes|Only for every smooth function|It is an estimate unless special structure makes it exact.
Which points form a centered estimate at x=5?|4.9 and 5.1|5 and 5.1|4 and 4.5|They lie symmetrically on either side of 5.
@2.4
Which implication is always true?|Differentiable implies continuous|Continuous implies differentiable|Having a value implies differentiable|A finite derivative ensures continuity.
Is abs(x) differentiable at 0?|No|Yes, derivative 0|Yes, derivative 1|Left and right slopes are −1 and 1.
Can a function be differentiable at a jump?|No|Yes|Only if f(a)=0|Differentiability requires continuity.
For f(x)=x^(1/3), is there a finite derivative at 0?|No|Yes, 0|Yes, 1/3|Difference quotients grow without bound.
If left derivative=2 and right derivative=2 and f is continuous at a, then…|f′(a)=2|f′(a)=4|f is not differentiable|The finite one-sided derivative limits agree.
@2.5
Differentiate x⁵.|5x⁴|x⁴|5x⁵|Multiply by 5 and reduce the exponent by one.
Differentiate x^(−2) for x≠0.|−2x^(−3)|2x^(−1)|−2x^(−2)|The power rule also applies to negative powers.
Differentiate √x for x>0.|1/(2√x)|2√x|1/√x|Write √x=x^(1/2) before applying the rule.
Differentiate x^(3/2) for x>0.|(3/2)√x|(2/3)√x|(3/2)x^(3/2)|Reduce the exponent 3/2 by one.
For f(x)=x⁴, find f′(2).|32|16|8|The derivative 4x³ equals 32 at 2.
@2.6
Differentiate 4x³−2x+7.|12x²−2|12x²+7|4x²−2|Differentiate each term; the constant disappears.
Differentiate the constant 9.|0|9|1|A constant has zero rate of change.
If f′(a)=2 and g′(a)=−1, find (3f+g)′(a).|5|3|7|Use 3·2+(−1).
Differentiate −5x².|−10x|−5x|10x|Keep the constant multiple −5.
Which differentiation rule is valid?|D(f−g)=f′−g′|D(f−g)=f′+g′|D(f−g)=f′g′|Differentiation is linear.
@2.7
Differentiate sin x in radians.|cos x|−cos x|sin x|The basic sine derivative is cosine.
Differentiate cos x in radians.|−sin x|sin x|−cos x|The cosine derivative has a negative sign.
Differentiate e^x.|e^x|xe^(x−1)|1|The natural exponential is its own derivative.
Differentiate ln x for x>0.|1/x|ln x|x|Natural logarithm has reciprocal derivative.
Find the derivative of sin x+e^x at x=0.|2|1|0|cos 0+e⁰=1+1.
@2.8
Differentiate x e^x.|e^x+x e^x|e^x|x e^x|Use f′g+fg′.
Differentiate x² sin x.|2x sin x+x² cos x|2x cos x|x² cos x|Differentiate each factor in a separate product term.
If f=2, g=3, f′=4 and g′=5 at a, find (fg)′(a).|22|20|6|Compute 4·3+2·5.
Which is the product rule?|(fg)′=f′g+fg′|(fg)′=f′g′|(fg)′=f′+g′|Both changing factors contribute.
Differentiate x²(x+1).|3x²+2x|2x|2x(x+1)|Expansion gives x³+x², whose derivative agrees.
@2.9
Differentiate x/(x+1).|1/(x+1)²|−1/(x+1)²|1|The numerator becomes (x+1)−x.
What denominator appears in the quotient rule for f/g?|g²|g′|g|The original denominator is squared.
If f=2, g=4, f′=3 and g′=1 at a, find (f/g)′(a).|5/8|1/8|3|Compute (3·4−2·1)/16.
Differentiate (x²+1)/x for x≠0.|1−1/x²|1+1/x²|2|Rewrite as x+1/x or use the quotient rule.
Can the quotient rule establish a derivative where g=0?|No|Yes|Only if f=0|The quotient function must be defined.
@2.10
Differentiate tan x where defined.|sec²x|−sec²x|sec x tan x|Use the tangent derivative identity.
Differentiate sec x where defined.|sec x tan x|sec²x|−sec x tan x|The secant derivative keeps a positive sign.
Differentiate cot x where defined.|−csc²x|csc²x|−cot²x|Cotangent has a negative derivative.
Differentiate csc x where defined.|−csc x cot x|csc x cot x|−csc²x|The cosecant derivative includes both factors and a minus.
Find (tan x)′ at x=0.|1|0|Undefined|sec²0=1.
@3.1
Differentiate (3x+1)⁴.|12(3x+1)³|4(3x+1)³|12x³|Multiply the outer derivative by the inner derivative 3.
Differentiate sin(x²).|2x cos(x²)|cos(2x)|2x sin(x²)|Keep the inner input in cosine and multiply by 2x.
Differentiate e^(−2x).|−2e^(−2x)|e^(−2x)|−e^(−2x)|The inner derivative is −2.
Differentiate ln(1+x²).|2x/(1+x²)|1/(1+x²)|2/x|Multiply reciprocal outer derivative by 2x.
f′(g(2))=3 and g′(2)=4. Find (f∘g)′(2).|12|7|3/4|The chain rule multiplies the two derivative factors.
@3.2
If x²+y²=25, find dy/dx where y≠0.|−x/y|x/y|−y/x|Differentiate to get 2x+2y y′=0.
Differentiate y³ with respect to x when y=y(x).|3y² y′|3y²|y³ y′|The chain rule includes dy/dx.
For x²+y²=25 at (3,4), find the slope.|−3/4|3/4|−4/3|Substitute the point into −x/y.
If xy=1, find y′ for x≠0.|−y/x|1/x|−x/y|Product differentiation gives y+x y′=0.
For x+y²=5 at (1,2), find y′.|−1/4|−1/2|1/4|From 1+2y y′=0, use y=2.
@3.3
f(2)=5 and f′(2)=4. Find (f⁻¹)′(5).|1/4|4|1/5|Use the reciprocal slope at the corresponding input 2.
If f′(a)=0, can the usual inverse derivative formula give a finite reciprocal?|No|Yes, it gives 0|Yes, it gives 1|The reciprocal formula requires a nonzero derivative.
If f(x)=3x+1, its inverse has derivative…|1/3|3|−1/3|The inverse is (x−1)/3.
To find (f⁻¹)′(b), which original input is needed?|a such that f(a)=b|a=b necessarily|a=1/b necessarily|Inverse differentiation uses corresponding points.
For f(x)=x³, find (f⁻¹)′(8).|1/12|1/192|12|The corresponding input is 2, where f′=12.
@3.4
Differentiate arctan x.|1/(1+x²)|1/√(1−x²)|sec²x|This is the inverse tangent derivative.
Differentiate arcsin x for −1<x<1.|1/√(1−x²)|−1/√(1−x²)|cos x|The inverse sine derivative is positive on its domain.
Differentiate arccos x for −1<x<1.|−1/√(1−x²)|1/√(1−x²)|−sin x|Inverse cosine has the negative reciprocal-root derivative.
Differentiate arctan(2x).|2/(1+4x²)|1/(1+4x²)|2/(1+x²)|Apply the chain rule with inner derivative 2.
Find (arcsin x)′ at 0.|1|0|Undefined|Substitute 0 into 1/√(1−x²).
@3.5
Which rules differentiate x² sin(3x)?|Product and chain rules|Quotient rule only|Power rule only|It is a product with a composite sine factor.
The outermost operation in e^(x²+1) suggests which rule?|Chain rule|Quotient rule|Product rule between e and x²|The exponential receives a composite input.
Differentiate (x²+1)³.|6x(x²+1)²|3(x²+1)²|6x³|Use the power rule on the outer function, then 2x.
Which is simplest for (x²+x)/x when x≠0?|Simplify to x+1 first|Use three nested chain rules|Treat the quotient as a product of derivatives|Algebra reduces the derivative to 1.
For positive y=x^x, which strategy is useful?|Take logarithms, then differentiate implicitly|Apply x^n with n constant|Declare its derivative x x^(x−1)|Both base and exponent vary, so logarithms simplify it.
@3.6
For f(x)=x⁴, find f″(x).|12x²|16x⁶|4x³|Differentiate 4x³ a second time.
What does f″ mean?|The derivative of f′|The square of f′|The inverse of f|It is a second derivative, not a power.
For f(x)=sin x, find f‴(x).|−cos x|cos x|−sin x|The derivative cycle is cos, −sin, −cos.
For f(x)=e^(2x), find f″(x).|4e^(2x)|2e^(2x)|e^(2x)|Each differentiation multiplies by 2.
For s(t)=t³, find the second derivative at t=2.|12|6|24|s″(t)=6t.
`;
