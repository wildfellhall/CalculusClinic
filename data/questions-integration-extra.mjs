export default `
@6.1
A tank starts with 20 L. Water enters at 5 L/min and leaves at 2 L/min for 4 minutes. What is the final volume?|32 L|48 L|12 L|The net rate is 3 L/min, so add 12 L to the initial 20 L.
A velocity is −2 m/s for 3 seconds, then 4 m/s for 2 seconds. What is the displacement?|2 m|14 m|−2 m|Add the signed contributions (−2)(3)+(4)(2)=2.
A rate r(t) is measured in people per day. What units belong to ∫ from day 2 to day 5 of r(t)dt?|People|People per day|People per day squared|Multiplying a rate by the time differential cancels the day unit in the denominator.
A temperature-change rate is 0.5°C/min for 6 minutes. If the initial temperature is 18°C, what is the final temperature?|21°C|3°C|18.5°C|The accumulated temperature change is 3°C, which must be added to the initial value.
If a continuous rate is positive on [a,b] with a<b, what can be said about the quantity it changes?|Its final amount exceeds its initial amount|Its initial amount must be positive|Its total change equals r(b)−r(a)|Integrating a positive rate over a nonzero interval yields a positive net change.
@6.2
For f(x)=x² on [0,2], find the right-endpoint sum using two equal subintervals.|5|1|5/2|Each width is 1, and right-endpoint heights are f(1)=1 and f(2)=4.
A table gives f(0)=1, f(2)=3, and f(5)=2. Find the left-endpoint estimate of ∫₀⁵ f(x)dx.|11|12|10|Use the unequal widths: 2·1+3·3=11.
For f(x)=x² on [0,2], find the trapezoidal estimate with one subinterval.|4|2|8/3|The single trapezoid has width 2 and average endpoint height (0+4)/2=2.
If f is concave up on [a,b], how does a trapezoidal sum compare with its integral?|It overestimates or equals the integral|It always underestimates|Its sign alone determines the error|Each secant chord lies at or above the concave-up graph, so its trapezoid contributes at least as much signed area.
For f(x)=2x+1 on [1,3], use two equal midpoint rectangles to estimate the integral.|10|8|12|The midpoints are 1.5 and 2.5, with heights 4 and 6 and widths 1.
@6.3
Which integral equals lim as n→∞ Σ from i=1 to n of [2+(3i/n)]²(3/n)?|∫₂⁵ x² dx|∫₀³ x² dx|∫₂³ x² dx|The width is 3/n and the right endpoints start from 2, giving the interval [2,5].
For a uniform partition of [−1,3], what is its ith right endpoint?|−1+4i/n|4i/n|−1+3i/n|Add i times the width 4/n to the left endpoint −1.
Which sum approaches ∫₀² e^x dx as n→∞?|Σ from i=1 to n of e^(2i/n)(2/n)|Σ from i=1 to n of e^(i/n)(1/n)|Σ from i=1 to n of e^(2i/n) without a width factor|The correct interval length is 2, and every sampled height must be multiplied by 2/n.
In a Riemann sum Σ f(xᵢ*)Δxᵢ, what does xᵢ* represent?|A sample input within the ith subinterval|The width of the ith subinterval|The total number of rectangles|The function height is evaluated at a sample point within its associated interval.
For continuous f on [a,b], do left and right Riemann sums approach the same value as equal widths shrink to zero?|Yes, both approach ∫ₐᵇ f(x)dx|No, left sums always have a different limit|Only when f is constant|Continuity guarantees integrability, making the limit independent of these sample choices.
@6.4
Differentiate F(x)=∫₂^(3x+1) √(1+t²)dt.|3√(1+(3x+1)²)|√(1+(3x+1)²)|3√(1+x²)|Apply FTC at the upper bound and multiply by its derivative 3.
If F(x)=∫_(x²)^4 sin t dt, what is F′(x)?|−2x sin(x²)|2x sin(x²)|−sin(x²)|A moving lower bound contributes a negative sign and the chain factor 2x.
For F(x)=∫_(−x)^x e^(t²)dt, find F′(x).|2e^(x²)|0|e^(x²)|The upper contribution is e^(x²); subtracting the lower contribution times −1 adds another equal term.
Let F(x)=∫₀ˣ (t²−1)dt. Find F′(2).|3|2/3|4|FTC gives F′(x)=x²−1, so F′(2)=3.
For F(x)=∫₁^(sin x) cos(t²)dt, find F′(x).|cos(sin²x) cos x|−sin(sin²x) cos x|cos(x²)|Evaluate the integrand at sin x and multiply by the derivative of sin x.
@6.5
Let A(x)=∫₀ˣ f(t)dt. If f is negative and increasing on (2,4), describe A.|Decreasing and concave up|Increasing and concave down|Decreasing and concave down|A′=f is negative, while its increasing trend makes A concave up.
For A(x)=∫₁ˣ (t−3)dt, where does A have a local minimum?|x=3|x=1|No local minimum|A′=x−3 changes from negative to positive at 3.
f has signed integral 4 on [0,2] and −7 on [2,5]. If A(x)=∫₀ˣ f, find A(5).|−3|11|3|Add the signed contributions 4+(−7).
If A(x)=∫₃ˣ f(t)dt and ∫₁³ f(t)dt=5, what is A(1)?|−5|5|0|The bounds in A(1)=∫₃¹ f reverse those of the given integral.
An accumulation function A has derivative f. Must every zero of f give an extremum of A?|No; f must change sign to give a first-derivative-test extremum|Yes; every zero of f is a minimum|Yes; every zero of f is a maximum|A derivative can be zero without a sign change, as with f(x)=x².
@6.6
If ∫₂⁶ f=5 and ∫₂⁴ f=8, find ∫₄⁶ f.|−3|13|3|Interval additivity gives 5=8+∫₄⁶ f.
If ∫₀³ f=4, evaluate ∫₀³ [2f(x)+1]dx.|11|9|8|The first term contributes 8, and the constant 1 integrates to the interval length 3.
If f is even and ∫₀² f=3, find ∫_(−2)^2 f.|6|0|3|An even function has matching signed contributions on the two symmetric halves.
If f(x)≤g(x) on [a,b] and a<b, which comparison holds?|∫ₐᵇ f≤∫ₐᵇ g|∫ₐᵇ f≥∫ₐᵇ g|The integrals must be equal|Integration preserves pointwise order over positively oriented bounds.
Evaluate ∫₅⁵ (x²+7)dx.|0|32|7|An interval of zero width has zero signed integral regardless of the integrand's value.
@6.7
Evaluate ∫₁³ (2x−1)dx.|6|8|4|Use the antiderivative x²−x: (9−3)−(1−1)=6.
Evaluate ∫₀^(π/2) cos x dx.|1|0|π/2|The antiderivative sin x changes from 0 to 1.
Evaluate ∫₀^(ln 2) e^x dx.|1|2|ln 2|The endpoint difference is e^(ln 2)−e⁰=2−1.
An antiderivative F satisfies F(2)=7 and F(5)=−1. Find ∫₂⁵ F′(x)dx.|−8|8|6|FTC gives F(5)−F(2)=−1−7.
Evaluate ∫₁⁴ x^(−1/2)dx.|2|3|4|The antiderivative 2√x gives 4−2=2.
@6.8
Find ∫(6x²−4x+3)dx.|2x³−2x²+3x+C|12x−4+C|6x³−4x²+3x+C|Integrate each term with the power rule; the constant integrand contributes 3x.
Find ∫sec²x dx on an interval where sec x is defined.|tan x+C|sec x tan x+C|−cot x+C|The derivative of tan x is sec²x.
For x>0, find ∫x^(−3)dx.|−1/(2x²)+C|−3/x⁴+C|ln x+C|Increase the exponent to −2 and divide by −2; only exponent −1 needs the logarithm rule.
Find ∫1/√(1−x²)dx for −1<x<1.|arcsin x+C|arctan x+C|−arcsin x+C|This integrand matches the derivative of inverse sine.
If F′(x)=f(x) on an interval, which function is also an antiderivative of f there?|F(x)−9|9F(x) in general|F(x)+x|Adding a constant leaves the derivative unchanged.
@6.9
Evaluate ∫3x² e^(x³)dx.|e^(x³)+C|3e^(x³)+C|x³e^(x³)+C|Use u=x³, so du=3x²dx.
Evaluate ∫₀¹ 6x(1+x²)²dx.|7|21|3|Set u=1+x²; the bounds become 1 and 2 and the integral is 3∫₁² u²du=8−1.
For ∫₁² x/(1+x²)dx with u=1+x², what are the transformed bounds?|2 and 5|1 and 4|1 and 2|Substitute each x-endpoint into u=1+x².
Find ∫cos x/(2+sin x)dx.|ln(2+sin x)+C|ln(cos x)+C|arctan(2+sin x)+C|The denominator derivative is cos x, and 2+sin x is always positive.
Evaluate ∫₀^(π/2) sin x e^(cos x)dx.|e−1|1−e|e+1|Use u=cos x, du=−sin x dx, with bounds 1 and 0; reversing them gives ∫₀¹ e^u du.
@6.10
Rewrite (x³+1)/x for x≠0 before integrating.|x²+1/x|x²+1|x³+1/x|Divide each numerator term by the common denominator x.
Complete the square in x²−6x+13.|(x−3)²+4|(x−6)²−23|(x−3)²+13|The square (x−3)² includes a constant 9, so add 4 to reach 13.
Find ∫1/[(x−2)²+4]dx.|(1/2)arctan((x−2)/2)+C|arctan(x−2)+C|2arctan((x−2)/2)+C|Match ∫du/(u²+a²)=(1/a)arctan(u/a)+C with a=2.
Divide x² by x+1 to prepare an integral.|x−1+1/(x+1)|x+1−1/(x+1)|x−1|Multiplying (x+1)(x−1) gives x²−1, leaving remainder 1.
Find ∫(x²+2x+1)/(x+1)dx on an interval excluding −1.|x²/2+x+C|x²/2+2x+C|ln abs(x+1)+C|The numerator is (x+1)²; cancellation leaves x+1 on the valid interval.
@6.11
Evaluate ∫x sin x dx.|−x cos x+sin x+C|x cos x−sin x+C|−x cos x−sin x+C|Choose u=x and dv=sin x dx, so v=−cos x and the remaining integral is +∫cos x dx.
Evaluate ∫₀¹ x e^(2x)dx.|(e²+1)/4|(e²−1)/4|e²/2|Parts gives e^(2x)(x/2−1/4); subtract its endpoint values e²/4 and −1/4.
For x>0, find ∫x ln x dx.|(x²/2)ln x−x²/4+C|(x²/2)ln x−x²/2+C|x² ln x+C|Take u=ln x and dv=x dx; subtract ∫x/2 dx.
Which antiderivative results from two applications of parts to ∫x² e^x dx?|e^x(x²−2x+2)+C|e^x(x²+2x+2)+C|x²e^x+C|Repeated differentiation of x² lowers its degree, giving the alternating polynomial coefficients.
Evaluate ∫₀^(π/2) x cos x dx.|π/2−1|π/2+1|1|An antiderivative is x sin x+cos x; the endpoint difference is π/2−1.
@6.12
Decompose 1/[(x−1)(x+1)].|(1/2)/(x−1)−(1/2)/(x+1)|1/(x−1)+1/(x+1)|1/(x−1)−1/(x+1)|Clearing denominators gives 1=A(x+1)+B(x−1), so A=1/2 and B=−1/2.
Find ∫(2x+3)/[x(x+3)]dx on a valid interval.|ln abs(x)+ln abs(x+3)+C|2 ln abs(x)+3 ln abs(x+3)+C|ln abs(x)−ln abs(x+3)+C|The decomposition is 1/x+1/(x+3), whose combined numerator is 2x+3.
If 5/[(x−2)(x+3)]=A/(x−2)+B/(x+3), find A and B.|A=1, B=−1|A=−1, B=1|A=5, B=5|Evaluate 5=A(x+3)+B(x−2) at x=2 and x=−3.
Evaluate ∫₁² 1/[x(x+1)]dx.|ln(4/3)|ln(3/4)|ln 2|Use ln x−ln(x+1); the endpoint difference is ln(2/3)−ln(1/2).
A student writes (x+4)/[(x+1)(x+2)]=A/(x+1)+B/(x+2). Which equations determine A,B?|A+B=1 and 2A+B=4|A+B=4 and 2A+B=1|A=1 and B=4|After clearing denominators, match x+4 with (A+B)x+(2A+B).
@6.13
Evaluate ∫₂^∞ x^(−3)dx.|1/8|1/4|Diverges|The antiderivative is −1/(2x²); its limit at infinity is zero.
Does ∫₀¹ 1/x² dx converge?|No; it diverges to +∞|Yes, to 1|Yes, to −1|Evaluate from ε to 1: −1+1/ε grows without bound as ε→0+.
Evaluate ∫₀^∞ e^(−2x)dx.|1/2|2|Diverges|The endpoint limit of −e^(−2x)/2 is 0, leaving 1/2.
For ∫₀¹ x^(−p)dx, which condition gives convergence?|p<1|p>1|p≥1|The finite-endpoint singularity converges exactly when x^(1−p) tends to zero as x→0+.
Why must ∫_(−2)^3 1/x² dx be split at 0?|There is an interior singularity and both one-sided pieces must converge|The integrand changes sign at 0|Every integral across 0 must be split|The formula is undefined and unbounded at 0, so ordinary endpoint subtraction across it is invalid.
@6.14
Which first method fits ∫x/(x²+4)dx?|Substitute u=x²+4|Treat it as ∫x dx divided by ∫(x²+4)dx|Apply the derivative quotient rule|The numerator is a constant multiple of the denominator's derivative.
Which rewrite makes ∫√x/x dx straightforward for x>0?|∫x^(−1/2)dx|∫x^(1/2)dx|∫x^(−3/2)dx|Subtract exponents: x^(1/2)/x=x^(−1/2).
A student claims ∫e^(3x)dx=e^(3x)+C. What correction is needed?|Multiply the answer by 1/3|Multiply the answer by 3|Add 3 to the answer|Differentiating e^(3x) produces an extra factor 3, which the antiderivative must cancel.
Find ∫sin(2x+1)dx.|−(1/2)cos(2x+1)+C|−2cos(2x+1)+C|(1/2)cos(2x+1)+C|Reverse the chain rule, including the sine antiderivative's negative sign and inner factor 2.
For ∫(3x²+2)/(x³+2x+5)dx on a valid interval, what answer does substitution give?|ln abs(x³+2x+5)+C|arctan(x³+2x+5)+C|1/(x³+2x+5)+C|The numerator equals the derivative of the denominator, producing a logarithm.
@7.1
A tank receives 8 L/min and drains at 0.1 times its current volume V in L/min. Which differential equation models V?|V′=8−0.1V|V′=8+0.1V|V=8−0.1t|Net rate is inflow minus outflow, and the outflow depends on the current volume.
An object's temperature T approaches a room temperature of 20°C at a rate proportional to their difference. Which cooling model fits for k>0?|T′=−k(T−20)|T′=−kT−20|T′=k(T−20)|Above room temperature, the derivative must be negative; below it, the same model gives a positive derivative.
A bacteria population grows at 4% of its current size per hour in a continuous model. Which equation fits?|P′=0.04P|P′=4P|P′=0.04|Convert 4% to the proportional rate 0.04 per hour and multiply by the current population.
If y′=3x², what information would select a particular antiderivative?|One value such as y(1)=5|Only another name for x|Only that y is differentiable|Integrating gives y=x³+C, and an initial value determines C.
Which model describes a quantity losing a constant 6 units per minute?|A′=−6|A′=−6A|A=−6t for every initial amount|A constant loss is a constant derivative; proportional loss would multiply by A.
@7.2
Does y=3e^(−x) satisfy y′+y=0?|Yes, for all real x|No, because y is positive|Only at x=0|Its derivative is −3e^(−x), which cancels y identically.
For y=x²+C, which C satisfies y′=2x and y(2)=1?|−3|3|−1|Every C satisfies the differential equation; the condition 1=4+C selects −3.
Does y=1/(1−x) satisfy y′=y² on x<1?|Yes|No; the derivative is negative|Only at x=0|Differentiate to obtain 1/(1−x)², equal to y² on the stated domain.
The function y=2e^x satisfies y′=y. Does it solve the initial value problem y(0)=3?|No; it fails the initial condition|Yes; satisfying the equation is sufficient|Yes; the factor 2 is arbitrary even after the condition|At zero the proposed function has value 2, not 3.
Which constant function solves y′=4−2y?|y=2|y=4|y=−2|A constant has derivative zero, so solve 4−2y=0.
@7.3
For y′=x−y, what slope belongs at (2,−1)?|3|1|−3|Substitute both coordinates: 2−(−1)=3.
For y′=y²−4, along which horizontal lines are the field segments horizontal?|y=−2 and y=2|y=0 only|y=4 only|Zero slope requires y²=4, giving both signs of 2.
For y′=xy, which axis or axes have horizontal slope segments?|Both coordinate axes|Only the x-axis|Only the y-axis|The product xy is zero whenever x=0 or y=0.
For y′=2−x, which region has negative slopes?|x>2|x<2|y>2|The sign depends only on x and becomes negative to the right of x=2.
A slope field has identical slopes along each horizontal line, with positive slopes above y=0 and negative below. Which equation fits?|y′=y|y′=x|y′=−y|Dependence only on y creates horizontal bands, and the derivative sign matches y.
@7.4
For y′=2−y, describe a solution through (0,3) as x initially increases.|It decreases toward the equilibrium level 2|It increases away from 2|It stays at 3|Above y=2 the slope is negative; the equilibrium gives the attracting reference level.
For y′=x², can a solution curve decrease on any interval?|No; all slopes are nonnegative|Yes; when x<0|Yes; when y<0|The square x² is nonnegative independently of the solution's height.
For y′=−y, a solution starts below the x-axis. In which direction does it initially move as x increases?|Upward|Downward|Horizontally|Negative y makes −y positive, so the local tangent slopes upward.
For y′=y(2−y), what happens to solutions with 0<y<2?|They increase|They decrease|They stay constant|Both factors on the right are positive between the equilibrium levels.
A field for y′=x has zero slopes on x=0. Must every solution pass through (0,0)?|No; the zero slope fixes direction, not height|Yes; a zero slope forces y=0|Only the positive solutions|Solutions y=x²/2+C have different heights while all have horizontal tangents at x=0.
@7.5
Use two Euler steps of width 0.5 for y′=x+y, y(0)=1. Estimate y(1).|2.5|2|2.25|The first point is (0.5,1.5); its slope 2 gives the next value 1.5+0.5·2=2.5.
Use one Euler step toward decreasing x with h=−0.2 for y′=2x−y from (1,3). Estimate y(0.8).|3.2|2.8|2.6|The current slope is −1; the signed increment is (−0.2)(−1)=0.2.
For y′=−2y, y(0)=4, use two forward Euler steps with h=0.25. Estimate y(0.5).|1|2|0|The first update gives 2, and the second gives 2+0.25(−4)=1.
In Euler's method, after stepping from (x₀,y₀) to (x₁,y₁), where is the next slope evaluated?|At (x₁,y₁)|Again at (x₀,y₀)|At (x₁,y₀) always|Each step uses the most recent approximate point, including its updated y-value.
For y′=2x, y(0)=1, use h=0.5 for two Euler steps. Estimate y(1).|1.5|2|1|The slope at (0,1) is 0; at x=0.5 it is 1, adding 0.5 on the second step.
@7.6
Separate y′=x(1+y²).|dy/(1+y²)=x dx|dy/y²=x dx|y dy=x dx|Divide by the whole y-dependent factor 1+y², which never vanishes for real y.
Solve y′=3x²y for nonzero y.|y=Ce^(x³)|y=Cx³|y=e^(3x)+C|Separation gives ln abs(y)=x³+C₁, so the coefficient C can carry either nonzero sign.
For y′=2xy² with y≠0, which implicit equation follows by integration?|−1/y=x²+C|ln abs(y)=x²+C|y³/3=x²+C|Integrate y^(−2)dy to obtain −1/y and integrate 2x dx to obtain x².
When separating y′=(y−3)x by dividing by y−3, which solution needs separate checking?|y=3|y=0|y=x|Division excludes the constant equilibrium y=3, which satisfies the original equation.
Solve y′=cos x independently of an initial condition.|y=sin x+C|y=−sin x+C|y=cos x+C|Integrate the derivative with respect to x.
@7.7
Solve y′=2xy with y(0)=3.|y=3e^(x²)|y=3e^(2x)|y=e^(x²)+2|Separation gives y=Ce^(x²), and the initial condition determines C=3.
Solve y′=1+y² with y(0)=0 on the interval around zero where the solution is finite.|y=tan x|y=arctan x|y=e^x−1|Integrating gives arctan y=x+C; the initial condition sets C=0, on (−π/2,π/2).
For y′=2x/y with y(0)=−2, choose the solution branch near zero.|y=−√(2x²+4)|y=√(2x²+4)|y=−√(x²+4)|Integration gives y²=2x²+C, and the negative initial value selects the negative square root.
Solve y′=y² with y(0)=2.|y=2/(1−2x), on x<1/2|y=2/(1+2x), for all real x|y=2e^x, for all real x|Integrating −1/y=x+C and using the initial value gives the rational solution; its interval cannot cross 1/2.
Solve y′=3x²−1 with y(1)=4.|y=x³−x+4|y=x³−x+2|y=3x³−x+2|An antiderivative is x³−x+C; at x=1 its nonconstant terms cancel, so C=4.
@7.8
A population satisfies P′=0.2P and P(0)=30. When does it triple?|t=5 ln 3|t=ln 3/5|t=15|Solve 30e^(0.2t)=90, so 0.2t=ln 3.
A substance has half-life 4 hours. Which function models amount A(t) from A₀?|A(t)=A₀e^[(−ln 2)t/4]|A(t)=A₀e^(−4t)|A(t)=A₀(1−t/8)|The decay constant must make the exponential factor equal 1/2 when t=4.
A population doubles in 3 years under P′=kP. Find k.|ln 2/3 per year|3 ln 2 per year|2/3 per year|From e^(3k)=2, take logarithms and divide by 3.
For P(t)=100e^(−0.05t), what is the relative rate P′/P?|−0.05|−5|100|Differentiation multiplies by −0.05, and division by P cancels the amount.
If two positive populations have the same proportional rate k but different initial values, how does their ratio change under exponential models?|It stays constant|It must approach 1|It increases at rate k|The common exponential factor cancels in P₁(t)/P₂(t).
@7.9
For P′=0.3P(1−P/200), at what population is growth fastest?|100|200|0.3|The quadratic rate function has its maximum at half the carrying capacity.
For P′=0.1P(1−P/80), find the growth rate at P=40.|2 population units per time unit|4 population units per time unit|8 population units per time unit|Substitute to get 0.1·40·(1−1/2)=2.
A logistic solution has 0<P<L/2. What is its concavity when P′=kP(1−P/L), k>0?|Concave up|Concave down|Linear|Differentiating gives P″=kP′(1−2P/L); both variable factors are positive below L/2.
For logistic growth with L/2<P<L, how does the positive growth rate change with time?|It decreases|It increases|It is constant|Here P′>0 but 1−2P/L<0, so P″<0.
If P(0)=L exactly in P′=kP(1−P/L), which solution satisfies that initial value?|P(t)=L|P(t)=Le^(kt)|P(t)=L/2|The rate is zero at the carrying capacity, so the constant function satisfies the equation and initial condition.
`;
