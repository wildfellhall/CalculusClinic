export default String.raw`
@6.1
2|A tank loses water at 4 L/min for 3 minutes. Find the signed change in volume.|−12 L|12 L|−4/3 L|The signed rate is −4, so the accumulation is −4×3=−12 liters.
3|A velocity is 5 m/s for 6 seconds. Find the displacement.|30 m|30 m/s|5/6 m|Multiply velocity by elapsed time; seconds cancel to give meters.
5|A quantity starts at 7 and has rate 2t on 0≤t≤3. Find its final value.|16|9|13|The integral of 2t from 0 to 3 is 9. Add the initial 7.
8|People arrive at a constant rate of 12 per hour from hour 2 to hour 5. How many arrive in that interval?|36|60|24|The interval lasts 3 hours, giving 12×3=36 arrivals.
10|A balance starts at 40 and changes at 3t² units per hour for 0≤t≤2. Find the ending balance.|48|8|52|Integrating 3t² gives a net change of 2³=8; add 40.
@6.2
4|For f(x)=x² on [0,2], compute the left sum with two equal subintervals.|1|5|2|The width is 1 and left heights are f(0)=0 and f(1)=1, giving 1.
9|For f(x)=x² on [0,2], find the difference between the one-panel trapezoidal estimate and the exact integral.|4/3|−4/3|8/3|The trapezoid gives 4; the exact integral is 8/3. Their difference is 4/3, an overestimate.
@6.3
3|Evaluate lim as n→∞ of Σ from i=1 to n of (−2)(3/n).|−6|6|0|There are n equal terms, so every sum is n×(−6/n)=−6.
5|Evaluate lim as n→∞ of Σ from i=1 to n of (2i/n)(2/n).|2|4|1|This is the right Riemann sum for ∫₀² x dx, which equals 2.
9|For f(x)=x² on [1,3], use two midpoint rectangles to estimate the integral.|17/2|5|13|The midpoints are 1.5 and 2.5, both with width 1. Add 2.25+6.25=8.5.
10|For f(x)=2x on [0,1], calculate the common limit of left and right equal-width sums.|1|2|1/2|Both sums approach ∫₀¹ 2x dx=[x²]₀¹=1.
@6.4
5|For F(x)=∫₁ˣ √(t+3)dt, calculate F′(6).|3|6|1/6|The integrand is continuous near 6, so FTC gives F′(6)=√9=3.
@6.5
1|Let A(x)=∫₀ˣ (t²−4)dt. Where is A decreasing?|−2<x<2|x<−2 or x>2|x>0|A′(x)=x²−4, which is negative between the two roots.
2|For A(x)=∫₀ˣ (4−t²)dt, find the x-coordinate of its local maximum.|2|−2|0|A′=4−x² changes from positive to negative at 2.
3|For A(x)=∫₀ˣ (t²−2t)dt, find where A is concave up.|x>1|x<1|x>2|A″(x)=2x−2, so it is positive for x>1.
10|For A(x)=∫₀ˣ (t−1)²dt, classify x=1.|Stationary point with no local extremum|Local maximum|Local minimum|A′(x)=(x−1)² stays positive on both sides of 1, so A keeps increasing.
@6.6
4|Evaluate ∫ from −2 to 2 of (x³+3x)dx.|0|20|−20|The integrand is odd and the bounds are symmetric; the signed contributions cancel.
5|Compute ∫₀¹ x²dx and compare it with (∫₀¹ x dx)².|1/3 versus 1/4|Both 1/3|Both 1/4|The integral of the product is 1/3, while the product of integrals is (1/2)²=1/4.
9|Suppose 2≤f(x)≤5 on [1,4]. Find bounds for ∫₁⁴ f(x)dx.|6≤integral≤15|2≤integral≤5|3≤integral≤12|Multiply the constant bounds by the interval width 3.
@6.7
2|An antiderivative F of f has F(−1)=4 and F(3)=−2. Find ∫ from −1 to 3 of f(x)dx.|−6|6|2|FTC gives F(3)−F(−1)=−2−4=−6.
5|Use F(x)=x³/3+7 to evaluate ∫₀³ x²dx.|9|16|2|Subtract F(0) from F(3): (9+7)−7=9. The constant cancels.
@6.8
5|Find the antiderivative F of 2x satisfying F(1)=5.|F(x)=x²+4|F(x)=x²+5|F(x)=2x+3|The general antiderivative is x²+C. Substituting (1,5) gives C=4.
10|Find F(x) if F′(x)=3x² and F(2)=1.|x³−7|x³+1|x³−1|Integrate to x³+C. Then 8+C=1, so C=−7.
@6.10
4|For x>1, find ∫x³/(x−1)dx.|x³/3+x²/2+x+ln(x−1)+C|x³/3+ln(x−1)+C|x⁴/[4(x−1)]+C|Divide to get x²+x+1+1/(x−1), then integrate each term.
@6.11
1|Find ∫x e^(2x)dx.|e^(2x)(x/2−1/4)+C|x e^(2x)/2+C|e^(2x)(x−1)+C|Use u=x and dv=e^(2x)dx. Then v=e^(2x)/2 and subtract its integral.
5|Find ∫x cos x dx.|x sin x+cos x+C|x sin x−cos x+C|sin x+C|Use u=x, dv=cos x dx to get x sin x−∫sin x dx.
@6.12
5|For x>1, find ∫(x²+1)/(x²−1)dx.|x+ln(x−1)−ln(x+1)+C|ln(x²−1)+C|x−ln(x−1)+ln(x+1)+C|Divide to obtain 1+2/(x²−1); the latter fraction is 1/(x−1)−1/(x+1).
@6.13
5|Evaluate ∫₁^∞ x^(−3/2)dx.|2|1/2|Diverges|An antiderivative is −2x^(−1/2). Its limit at infinity is zero, so the integral is 2.
9|Evaluate ∫₀¹ x^(−1/3)dx.|3/2|2/3|Diverges|Integrate to (3/2)x^(2/3), whose limit at zero is zero.
10|Evaluate ∫ from −2 to 3 of 1/x² dx as an ordinary improper integral.|Diverges|−5/6|5/6|Split at the singularity 0. Each one-sided integral is unbounded, so endpoint substitution across zero is invalid.
@6.14
1|Find ∫2x/(1+x²)dx.|ln(1+x²)+C|2ln(1+x²)+C|1/(1+x²)+C|Set u=1+x², du=2x dx, giving ∫du/u.
2|For x>0, find ∫(x²+4)/x dx.|x²/2+4ln x+C|x²/2+ln x+C|x²+4ln x+C|Split the integrand into x+4/x and integrate term by term.
3|A proposed antiderivative is F(x)=x²ln x−x²/2 for x>0. Differentiate it to identify the integrand.|2x ln x|x ln x|2x ln x+x|The product rule gives 2x ln x+x; subtract the derivative x of x²/2.
5|Evaluate ∫₀¹ 4x(1+x²)dx.|3|2|4|Substitute u=1+x², giving 2∫₁² u du=[u²]₁²=3.
6|Find ∫x/(x²+4)dx.|(1/2)ln(x²+4)+C|ln(x²+4)+C|arctan(x/2)+C|Use u=x²+4 and du=2x dx; the missing factor contributes 1/2.
7|For x>0, find ∫√x/x dx.|2√x+C|(2/3)x^(3/2)+C|ln x+C|Rewrite as x^(−1/2), then apply the power rule for integration.
@7.1
1|A population grows at 5% of its current size per hour. Write P′ in terms of P and find P′ when P=200.|P′=0.05P; rate 10|P′=5P; rate 1000|P′=0.05; rate 0.05|A proportional rate multiplies the current amount: 0.05×200=10.
2|A tank gains 8 L/min and loses water at 0.2 times its current volume V. Calculate V′ when V=30 L.|2 L/min|14 L/min|−6 L/min|The net rate is V′=8−0.2V; substitute V=30.
3|An amount decays at a rate equal to 3% of its current size per day. Find its rate when the amount is 400.|−12 units/day|12 units/day|−0.03 units/day|The differential equation is A′=−0.03A, so A′=−12 at 400.
5|A quantity has y′=2x and y(0)=3. Find y(2).|7|4|5|Integrate to y=x²+C, use C=3, then evaluate at 2.
9|A model has y′=3x² and y(1)=5. Find its integration constant C in y=x³+C.|4|5|2|Substitute the initial condition: 5=1+C.
@7.2
4|For y=Ce^(2x), determine C so that y′=2y and y(0)=−3.|−3|−3/2|3|Differentiating verifies y′=2y for any C; the initial condition gives C=−3.
@7.3
3|For y′=2x−1, find the slopes at (2,0) and (2,5).|3 and 3|−1 and 9|3 and 8|Substitute x=2; the equation does not depend on y, so both slopes equal 3.
5|For y′=x²−y, find the slope-field segment's slope at (2,1).|3|1|5|Substitute x=2,y=1 to get 4−1=3.
@7.4
10|For y′=x, a solution passes through (0,3). Find its equation.|y=x²/2+3|y=x²+3|y=x²/2|Integrate the slope field equation, then use y(0)=3 to determine the vertical position.
@7.5
3|Use one Euler step of width 0.2 for y′=x+y from (1,2). Estimate y(1.2).|2.6|2.4|3|The slope at (1,2) is 3. Add 0.2×3=0.6 to the old y-value.
9|Use two Euler steps of width 1 for y′=x−y, starting at (0,2). Estimate y(2).|1|−2|0|First slope is −2, giving (1,0). Recompute the slope as 1, giving (2,1).
@7.6
5|Solve y′=x(y+1), expressing the general solution explicitly.|y=Ce^(x²/2)−1|y=Ce^(x²/2)+1|y=x²/2+C|Separate dy/(y+1)=x dx, integrate, exponentiate, and subtract 1. C=0 includes the equilibrium y=−1.
@7.7
5|Solve y′=3y with y(0)=4, then calculate y(ln 2).|32|12|8|The solution is 4e^(3x); at ln 2 it equals 4×2³=32.
@7.8
2|A quantity satisfies P′=0.25P. Find its doubling time.|4ln 2|ln 2/4|4|From 2=e^(0.25t), take logs and divide by 0.25.
3|An amount satisfies A′=−0.2A. Find its half-life.|5ln 2|ln 2/5|5|Solve 1/2=e^(−0.2t), giving t=ln 2/0.2.
4|A culture grows from 50 to 150 in 2 hours under P′=kP. Calculate k.|ln 3/2|3/2|ln 2/3|The growth factor satisfies 3=e^(2k), so k=(ln 3)/2.
5|For A(t)=80e^(−0.1t), calculate A(10ln 2).|40|160|8|The exponent becomes −ln 2, so the multiplier is 1/2.
10|Two populations satisfy P′=0.1P and Q′=0.1Q, with P(0)=30 and Q(0)=12. Find P(5)/Q(5).|5/2|18|e^0.5|The shared exponential factor cancels: 30e^0.5/(12e^0.5)=5/2.
@7.9
2|For P′=0.2P(1−P/100), at what population is the growth rate largest?|P=50|P=100|P=25|The rate as a function of P is a downward parabola with zeros 0 and 100, so its vertex is at 50.
3|Find the equilibrium populations of P′=0.4P(1−P/60).|0 and 60|0 and 30|30 and 60|Set each factor of the rate equal to zero.
4|For P′=0.2P(1−P/100), calculate the rate at P=150.|−15|15|−30|Substitute to get 0.2×150×(1−1.5)=−15.
5|A logistic solution is P(t)=120/(1+3e^(−0.2t)). Find its initial population and limiting population.|30 and 120|40 and 120|120 and 30|At zero the denominator is 4; as t→∞ it approaches 1.
8|For P′=0.1P(1−P/80), calculate P″ when P=20.|0.075|0.15|−0.075|Differentiate with respect to time: P″=0.1P′(1−2P/80). At P=20, P′=1.5, so P″=0.075.
9|For P′=0.1P(1−P/80), calculate P″ when P=60.|−0.075|0.075|−0.15|Here P′=1.5 and 1−2P/80=−0.5; multiply 0.1×1.5×(−0.5).
@8.1
2|Find the average value of f(x)=2x+1 on [1,4].|6|18|9/2|The integral is [x²+x]₁⁴=18. Divide by the interval width 3.
5|Temperature is T(t)=10+2t °C on 0≤t≤4 hours. Find its average.|14°C|56°C|18°C|Integrate to get 56 degree-hours, then divide by 4 hours.
8|For f(x)=x² on [0,3], find c in this interval where f(c) equals its average value.|√3|3|3/2|The average is (1/3)∫₀³ x²dx=3. Solve c²=3 inside the interval.
@8.3
2|A tank has net rate 6−2t L/min for 0≤t≤3. Find the net gain.|9 L|18 L|0 L|Integrate: [6t−t²]₀³=18−9=9.
3|Q(1)=10 and Q′(t)=3t². Find Q(2).|17|7|18|Add ∫₁² 3t²dt=8−1=7 to the initial amount 10.
4|A quantity has Q′(t)=t(4−t) for 0≤t≤6. At what interior time does Q have a local maximum?|4|2|0|The net rate changes from positive to negative at t=4.
5|A hall starts with 80 people. Arrivals are 30/hour and departures 18/hour for 2 hours. Find the final occupancy.|104|24|176|The net rate is 12/hour, giving a gain of 24; add the initial 80.
7|A tank starts with 10 L and has net rate 4−t L/min for 0≤t≤6. Find its volume at t=6.|16 L|6 L|34 L|The net change is [4t−t²/2]₀⁶=6 L. Add the initial 10 L.
9|Inflow is 10+t L/min and outflow is 2t L/min. At what time are the rates equal?|10 min|5 min|20 min|Set 10+t=2t, giving t=10; at that instant the net volume rate is zero.
@8.2
2|A particle moves at velocity −3 m/s for 2 seconds. Find its total distance traveled.|6 m|−6 m|3 m|Speed is the absolute velocity, 3 m/s. Multiply by 2 seconds.
`;
