export default `
@6.1
A constant inflow is 3 L/min for 4 min. How much accumulates?|12 L|7 L|3/4 L|Multiply rate by elapsed time.
A signed rate is negative on an interval. Its accumulation over that interval is…|Negative|Always positive|Zero|Negative rate contributes negative net change.
If a rate has units m/s, integrating with respect to seconds gives…|Meters|Meters per second squared|Seconds per meter|The time factor cancels the rate denominator.
An initial amount is 10 and the net change is −3. Find the final amount.|7|−3|13|Add the signed net change to the initial amount.
Which quantity is represented by the integral of a rate?|Net change in the original quantity|Always total unsigned change|The initial amount|Signed rate accumulation yields net change.
@6.2
For f(x)=x on [0,2] with two equal subintervals, the left sum is…|1|2|3|Use heights 0,1 with width 1.
For f(x)=x on [0,2] with two equal subintervals, the right sum is…|3|1|2|Use heights 1,2 with width 1.
A table gives (0,2),(1,4),(3,6). Find the trapezoidal estimate on [0,3].|13|10|12|The areas are 1·(2+4)/2 and 2·(4+6)/2.
For an increasing function, a left-endpoint sum…|Underestimates the signed integral|Always overestimates|Is always exact|Left heights are below the function across each subinterval.
For f(x)=x² on [0,2] using two width-1 midpoint rectangles, estimate the integral.|5/2|2|5|Use f(0.5)+f(1.5)=0.25+2.25.
@6.3
Which integral equals lim n→∞ Σ from i=1 to n of (i/n)²(1/n)?|∫₀¹ x² dx|∫₀ⁿ x² dx|∫₁² x dx|The width is 1/n and samples lie in [0,1].
In a uniform partition of [2,5] into n pieces, Δx is…|3/n|5/n|2/n|Divide the interval length by n.
Can a definite integral be negative?|Yes|No|Only if its bounds are equal|Signed area below the axis contributes negatively.
For a right-endpoint sum on [1,3], x_i equals…|1+2i/n|2i/n|1+i/n|Start at 1 and advance i widths of 2/n.
What turns Riemann sums into the definite integral?|Taking a limit as the largest width tends to zero|Using exactly ten rectangles|Taking absolute values of every height|The limiting partition removes finite-width approximation error.
@6.4
Differentiate ∫₀ˣ cos t dt.|cos x|sin x|cos t|FTC evaluates the integrand at the variable upper endpoint.
Differentiate ∫₁^(x²) e^t dt.|2x e^(x²)|e^(x²)|e^x|The moving upper bound adds a chain factor 2x.
Differentiate ∫ₓ³ t² dt.|−x²|x²|9|A moving lower bound contributes a minus sign.
Differentiate ∫ₓ^(2x) f(t)dt for continuous f.|2f(2x)−f(x)|f(2x)−f(x)|2f(x)|Apply FTC and chain factors at both bounds.
What local condition suffices for the usual FTC accumulation derivative at x?|The integrand is continuous at x|The integrand is always positive|The lower bound equals zero|Continuity gives the integrand as the derivative.
@6.5
A(x)=∫₀ˣ f(t)dt and f>0 on (1,2). Then A is…|Increasing on (1,2)|Necessarily positive there|Decreasing there|A′=f by FTC.
If f changes from positive to negative at c, A(x)=∫₀ˣ f has…|A local maximum at c|A local minimum at c|A zero at c necessarily|A′ changes from + to −.
If f is increasing, what is the concavity of its accumulation function?|Concave up|Concave down|Always linear|The accumulation derivative f is increasing.
f has signed area 3 on [0,1] and −2 on [1,2]. Find ∫₀² f.|1|5|−5|Add signed areas: 3−2.
For A(x)=∫₂ˣ f(t)dt, what is A(2)?|0|f(2)|2|An integral with equal bounds is zero.
@6.6
If ∫₁⁴ f=7, what is ∫₄¹ f?|−7|7|0|Reversing orientation negates the integral.
If ∫₀² f=3 and ∫₂⁵ f=4, find ∫₀⁵ f.|7|1|12|Add integrals over adjacent intervals.
If ∫ₐᵇ f=2 and ∫ₐᵇ g=3, find ∫ₐᵇ (2f−g).|1|7|−1|Apply linearity: 2·2−3.
For an integrable odd function, ∫ from −a to a of f equals…|0|Twice the positive-half integral|Always a positive number|Symmetric signed areas cancel.
Is ∫fg generally equal to (∫f)(∫g) over the same interval?|No|Yes|Only because integration is linear|Linearity applies to sums, not products.
@6.7
Evaluate ∫₀² x dx.|2|4|1|Use [x²/2] from 0 to 2.
If F′=f, then ∫ₐᵇ f equals…|F(b)−F(a)|f(b)−f(a)|F(a)−F(b)|FTC uses the antiderivative at the endpoints.
Evaluate ∫₀^π sin x dx.|2|0|π|Use [−cos x] from 0 to π.
Evaluate ∫₁ᵉ 1/x dx.|1|e−1|0|Use ln e−ln 1.
For a continuous integrand, changing its antiderivative by a constant changes the definite integral by…|0|That constant|Twice that constant|The constant cancels in the endpoint difference.
@6.8
Find ∫x² dx.|x³/3+C|2x+C|x³+C|Increase the power and divide by the new exponent.
Find ∫1/x dx on an interval avoiding zero.|ln abs(x)+C|−1/x²+C|x⁰+C|The exponent −1 is the logarithmic exception.
Find ∫cos x dx.|sin x+C|−sin x+C|cos x+C|Differentiating sine recovers cosine.
Find ∫1/(1+x²) dx.|arctan x+C|ln(1+x²)+C|arcsin x+C|This matches the inverse tangent derivative.
Why include +C in an indefinite integral?|All antiderivatives differ by constants on an interval|The integral is uncertain by a random amount|Every answer must equal zero somewhere|Constants disappear under differentiation.
@6.9
Evaluate ∫2x cos(x²)dx.|sin(x²)+C|2 sin(x²)+C|cos(x²)+C|Set u=x² and du=2x dx.
For ∫₀¹ 2x e^(x²)dx with u=x², the u-bounds are…|0 and 1|0 and 2|1 and e|Transform each original endpoint using u=x².
Evaluate ∫₀¹ 2x e^(x²)dx.|e−1|e|2e|The transformed integral is ∫₀¹ e^u du.
If u=3x+1, what is dx in terms of du?|du/3|3du|du|Differentiate: du=3dx.
Find ∫x/(1+x²)dx.|(1/2)ln(1+x²)+C|ln(1+x²)+C|arctan x+C|The numerator is half the denominator's derivative.
@6.10
Find ∫(x²+1)/x dx for x>0.|x²/2+ln x+C|x²+ln x+C|ln(x²+1)+C|Divide first to obtain x+1/x.
Rewrite x²+2x+2 for integration.|(x+1)²+1|(x+2)²−2|(x+1)²+2|Completing the square exposes an arctangent form.
Find ∫1/((x+1)²+1)dx.|arctan(x+1)+C|ln((x+1)²+1)+C|arcsin(x+1)+C|Use the standard arctangent antiderivative after a shift.
Before decomposing x³/(x−1), what algebraic step is useful?|Polynomial division|Take the square root|Multiply by x³|The numerator's degree is at least the denominator's.
Find ∫(x²−1)/(x−1)dx on an interval excluding 1.|x²/2+x+C|x²/2−x+C|ln abs(x−1)+C|Cancel the factor to obtain x+1 on the interval.
@6.11
Which is integration by parts?|∫u dv=uv−∫v du|∫u dv=uv+∫v du|∫u dv=u′v′|Rearrange the integrated product rule.
Find ∫x e^x dx.|(x−1)e^x+C|x e^x+C|(x+1)e^x+C|Choose u=x, dv=e^x dx.
Find ∫ln x dx for x>0.|x ln x−x+C|1/x+C|x ln x+C|Choose u=ln x and dv=dx.
Evaluate ∫₀¹ x e^x dx.|1|e−1|e|Evaluate (x−1)e^x at the endpoints.
For ∫x cos x dx, a helpful choice is…|u=x and dv=cos x dx|u=cos x and dv=x dx always simpler|u=x cos x and dv=0|Differentiating x simplifies the remaining integral.
@6.12
Decompose 1/[x(x+1)].|1/x−1/(x+1)|1/x+1/(x+1)|1/(2x+1)|Combining the difference gives numerator 1.
Find ∫1/[x(x+1)]dx on a valid interval.|ln abs(x)−ln abs(x+1)+C|ln abs(x)+ln abs(x+1)+C|1/(2x+1)+C|Integrate the two partial fractions separately.
If 1/[x(x+1)]=A/x+B/(x+1), what identity follows?|1=A(x+1)+Bx|1=Ax+B(x+1)|x(x+1)=A+B|Clear the denominators carefully.
Decompose (3x+2)/[(x+1)(x+2)].|−1/(x+1)+4/(x+2)|1/(x+1)+2/(x+2)|3/(x+1)+2/(x+2)|The numerator becomes −(x+2)+4(x+1)=3x+2.
Why check that a rational fraction is proper before the usual decomposition?|Polynomial division may be needed first|Its numerator must be zero|Its denominator must be constant|A polynomial part must be separated when degrees require it.
@6.13
Evaluate ∫₁^∞ 1/x² dx.|1|Diverges|0|The antiderivative −1/x tends to zero at infinity.
Does ∫₁^∞ 1/x dx converge?|No|Yes, to 1|Yes, to 0|ln b grows without bound as b→∞.
Evaluate ∫₀¹ 1/√x dx.|2|Diverges|1|Use the one-sided limit of 2√x at zero.
Does ∫ from −1 to 1 of 1/x exist as an ordinary improper integral?|No|Yes, it is 0|Yes, it is 2|Both one-sided pieces must converge independently.
For ∫₁^∞ x^(−p)dx, convergence requires…|p>1|p≥1|p<1|The upper-infinity p-integral has threshold p=1.
@6.14
Which first method fits ∫2x/(1+x²)dx?|Substitution|Expanding as a polynomial|No elementary method is available|The numerator matches the denominator's derivative.
Which first step fits ∫(x²+1)/x dx?|Divide term by term|Use a slope field|Differentiate the numerator only|Algebra exposes x+1/x.
How can an antiderivative answer be checked?|Differentiate it|Square it|Evaluate it only at zero|Its derivative should recover the integrand.
Find ∫cos(4x)dx.|(1/4)sin(4x)+C|4sin(4x)+C|sin(4x)+C|Substitution supplies the reciprocal chain factor.
Which pattern suggests substitution?|A composition multiplied by its inner derivative|Every product of two unrelated functions|A constant by itself only|Substitution reverses the chain rule.
@7.1
A population's rate is proportional to its size. Which model fits?|P′=kP|P=k+t|P′=k/P necessarily|Proportionality multiplies the current amount by a constant.
Which expression is a differential equation?|y′=x+y|y=x+1 only|x²+1=0|A differential equation involves an unknown function's derivative.
If an amount decays proportionally, the model may be…|y′=−ky with k>0|y′=ky with k>0|y′=k with k>0|The negative coefficient produces decay for positive y.
If a tank fills at rate 3−2t, what equation describes amount A?|A′(t)=3−2t|A(t)=3−2t|A′(t)=A(t)|The given rate is the derivative of the amount.
Does a differential equation alone always specify one unique solution?|No|Yes|Only if it contains x|An initial condition often selects among many solutions.
@7.2
Does y=e^(2x) satisfy y′=2y?|Yes|No|Only at x=0|Its derivative is 2e^(2x), equal to 2y.
Does y=x² satisfy y′=y?|No|Yes|Yes for all x>0|2x is not identically equal to x².
For y=Ce^x and y(0)=3, find C.|3|0|1|At x=0, e⁰=1.
To verify an initial value solution, check…|Both the equation and initial condition|Only the initial point|Only that the graph looks smooth|The function must satisfy both requirements.
Does y=0 solve y′=y(1−y)?|Yes|No|Only if x=0|Both sides are identically zero.
@7.3
For y′=x+y, what slope belongs at (1,2)?|3|2|1|Substitute the point into the rate formula.
For y′=y, where are all segments horizontal?|Along y=0|Along x=0|Along y=1|The derivative is zero exactly when y=0.
For y′=x, slopes are the same along…|Each vertical line|Each horizontal line|Every line|The slope depends only on x.
For y′=−y, what is the slope at (3,2)?|−2|2|−3|The x-coordinate does not affect this slope.
What does each short segment in a slope field represent?|A local tangent direction|A completed solution curve|An area estimate|It encodes the derivative at one point.
@7.4
For y′=1−y, which horizontal solution is an equilibrium?|y=1|y=0|y=x|The rate vanishes identically at y=1.
For y′=1−y with y<1, solution curves move…|Upward as x increases|Downward as x increases|Horizontally|The slope is positive below 1.
For y′=x, the solution through (0,1) initially has slope…|0|1|−1|Evaluate the differential equation at x=0.
For y′=y, a solution starting with y>0 has positive slopes and…|Increases|Decreases|Stays constant|All positive y-values give positive derivatives.
Which field matches y′=−x?|Positive slopes left of x=0, negative slopes right|Negative slopes left, positive right|Slopes depending only on y|The sign reverses across the vertical axis.
@7.5
Use one Euler step of h=0.1 for y′=y, y(0)=1. Find y₁.|1.1|1.01|e^0.1 exactly|Add h times the current slope: 1+0.1·1.
Use two Euler steps of h=0.1 for y′=y, y(0)=1. Find y₂.|1.21|1.2|1.22|The second slope is the updated value 1.1.
Which formula is an Euler update?|y_next=y+hF(x,y)|y_next=y+F(x,y)/h|y_next=F(x+h,y)|A tangent step adds slope times step width.
For y′=x+y, start at (0,1) with h=0.5. The first new point is…|(0.5,1.5)|(0.5,2)|(1,1.5)|The starting slope is 1, giving a rise of 0.5.
For y′=y, y(0)=1 and a positive step, Euler tangent estimates are…|Below the exact exponential solution|Above the exact solution|Always exact|The exponential is concave up, above its tangents.
@7.6
Solve y′=2x.|y=x²+C|y=2x+C|y=2+C|Integrate the right side with respect to x.
For y′=xy with y≠0, a separated form is…|dy/y=x dx|y dy=x dx|dy=x/y dx|Divide by y and multiply by dx.
When dividing y′=y(1−y) by y(1−y), which solutions need separate checking?|y=0 and y=1|y=x only|No solutions|Division excludes the zeros of the factor.
For y′=xy, a general nonzero solution is…|y=Ce^(x²/2)|y=Cx²|y=e^x+C|Integrating gives ln abs(y)=x²/2+C₁.
Is y′=x+y directly separable into g(x)h(y)?|No|Yes, dy/y=x dx|Yes, dy/x=y dx|The sum cannot generally be factored into single-variable functions.
@7.7
Solve y′=2x with y(1)=3.|y=x²+2|y=x²+3|y=2x+1|The initial condition gives 3=1+C.
Solve y′=y with y(0)=2.|y=2e^x|y=e^x+2|y=2x|The initial value sets the exponential coefficient.
Solve y′=−2y with y(0)=5.|y=5e^(−2x)|y=5−2x|y=e^(−2x)+5|Separation gives an exponential decay family.
For y=1/(1−x) through (0,1), the maximal interval containing 0 is…|(−∞,1)|(1,∞)|All real numbers|The solution cannot cross its singularity at x=1.
After finding C in an initial value problem, what is a useful check?|Substitute into both the equation and initial value|Only check C is positive|Discard the initial condition|This detects wrong branches or algebra errors.
@7.8
If P′=0.1P and P(0)=50, find P(t).|50e^(0.1t)|50+0.1t|0.1e^(50t)|Use the exponential proportional-growth solution.
For P(t)=P₀e^(kt), k>0, the doubling time is…|ln 2/k|k ln 2|2/k|Solve e^(kt)=2.
For y′=−ky with k>0, the half-life is…|ln 2/k|−ln 2/k|1/(2k)|Solve e^(−kt)=1/2.
In y′=ky, what does k represent for y>0?|The relative rate y′/y|The initial amount|The final amount|Dividing by y gives the constant proportional rate.
A positive exponential decay solution approaches…|0 as t→∞|A negative infinity|Its initial value forever|The negative exponent causes the amount to tend to zero.
@7.9
For P′=0.2P(1−P/100), the carrying capacity is…|100|0.2|50|The positive equilibrium is P=100.
For that model, growth is fastest at…|P=50|P=100|P=0|The quadratic rate peaks at half the capacity.
For P′=kP(1−P/L), k,L>0, which levels are equilibria?|0 and L|L/2 only|k and L|Set each factor of the rate equal to zero.
If P>L>0 in that logistic model, the rate is…|Negative|Positive|Zero|The factor 1−P/L is negative.
If 0<P(0)<L, the logistic population tends toward…|L|0|∞|The carrying capacity is the attracting positive equilibrium.
`;
