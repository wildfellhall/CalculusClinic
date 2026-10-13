export default String.raw`
@F05
4|Find k so that f(x)=x²+kx+3 satisfies f(2)=f(−2).|0|2|−2|The values are 7+2k and 7−2k; equating them gives 4k=0.
6|The point (−1,4) lies on y=f(x). Find the corresponding point on y=−2f(x)+3.|(−1,−5)|(−1,11)|(1,−5)|Keep the input and transform the output: −2×4+3=−5.
9|For f(x)=x³−x, calculate f(−2)+f(2).|0|12|−12|The outputs are −6 and 6, whose sum is zero.
@F06
4|A graph of volume against time contains (2 min,14 L) and (5 min,32 L). Calculate the secant slope.|6 L/min|18 L/min|1/6 min/L|Divide the volume change by elapsed time: (32−14)/(5−2)=6 L/min.
@F07
2|Let f(u)=sin u and g(x)=x². Evaluate f(g(√(π/2))).|1|0|π/2|The inner function gives π/2; sin(π/2)=1.
5|For f(x)=x² and g(x)=x+1, find f(g(2))−g(f(2)).|4|0|−4|The two compositions give 9 and 5; their difference is 4.
@F08
5|The graph of an invertible f contains (3,−2). Find the corresponding point on the inverse graph.|(−2,3)|(3,−1/2)|(−3,2)|The inverse reverses the input-output pair.
@F09
4|Evaluate sec(2π/3).|−2|−1/2|2|Since cos(2π/3)=−1/2, its reciprocal is −2.
@F10
2|Given ln a=2 and ln b=3 for positive a,b, calculate ln(a²b).|7|12|8|Expand the log as 2ln a+ln b=2×2+3.
5|Evaluate ln(e²+e²) exactly.|2+ln 2|4|2ln 2|Factor e²+e²=2e², then use ln(2e²)=ln 2+2.
@F11
3|A rectangular container is 20 cm long, 10 cm wide, and 15 cm high. Find its volume in liters; 1000 cm³=1 L.|3 L|3000 L|0.3 L|The volume is 20×10×15=3000 cm³, or 3 liters.
6|A cylinder has radius 2 cm and height 5 cm. Calculate its volume.|20π cm³|10π cm³|40π cm³|Substitute into πr²h: π×4×5=20π.
9|A surface area increases at 3 cm²/s for 8 seconds. Find the area increase.|24 cm²|24 cm³|3/8 cm²|Multiply rate by time: 3×8=24. Seconds cancel, leaving square centimeters.
@F12
3|Compute 4!/(0!×3!).|4|0|24|Use 0!=1 and 4!=4×3!, so the quotient is 4.
@F14
5|A polar point has r=5 and Cartesian coordinate x=3. Find the possible y-coordinates.|−4 and 4|−2 and 2|4 only|Use x²+y²=r²: y²=25−9=16.
@F15
2|A numerical solver finds the positive intersection of y=x² and y=2. Round its x-coordinate to three decimals.|1.414|1.500|2.000|Solve x²−2=0; the positive root is √2≈1.41421356.
3|The plotted curve y=(x²−1)/(x−1) looks like a line. Calculate the missing point's height at x=1.|2|1|0|For x≠1 it simplifies to x+1, which approaches 2; the original formula is still undefined at 1.
4|A calculator estimates ∫₀² (3t²+1)dt as 10. If the integrand is a rate in L/min and t is minutes, how much is added to an initial 7 L?|10 L added; final 17 L|10 L added; final 10 L|17 L added; final 24 L|The integral is a net volume change of 10 L. Add it to the initial 7 L.
5|Compute (1/3)×100 and round only the final answer to three decimals.|33.333|33.300|33.000|Keep 1/3 exact while multiplying; 100/3=33.333333… rounds to 33.333.
6|A solver proposes x=1.5 for x²−2=0. Calculate the residual x²−2.|0.25|0|−0.5|Substitution gives 2.25−2=0.25, so the proposed input is not a root.
8|A table for f has f(0.002)=−0.004 and f(0.004)=0.004. Use linear interpolation to estimate the zero.|0.003|0.006|0.002|The opposite outputs have equal magnitude, so the interpolated zero is at the midpoint.
9|A square of side √2 m is scaled to a similar square with sides three times as long. Find the new area to three decimals.|18.000 m²|17.995 m²|6.000 m²|Keep the radical exact: (3√2)²=18. Premature rounding changes the answer.
10|A calculator gives ∫₀² f(x)dx=7.25. Find ∫₂⁰ 3f(x)dx.|−21.75|21.75|−7.25|Reversing the bounds changes the sign; multiplying the integrand by 3 multiplies the integral by 3.
@F16
4|A sequence is aₙ=5−2n for n≥1. Find a₂+a₄.|−2|2|−6|The terms are a₂=1 and a₄=−3, so their sum is −2.
10|For aₙ=1/(n+1), compute the first three terms' sum.|13/12|1/4|11/6|Add 1/2+1/3+1/4=(6+4+3)/12=13/12.
`;
