export default String.raw`
@1.1
1|A car's position is s(t)=t²+3t meters. Find its average velocity from t=1 to t=3 seconds.|7 m/s|14 m/s|5 m/s|The positions are 4 and 18. Divide their difference by 2 seconds.
2|For s(t)=t², the average velocity from 2 to 2+h is 4+h. What value do these averages approach as h approaches 0?|4|0|2|Take the limit of 4+h as the interval width approaches zero.
5|For s(t)=3t², simplify [s(1+h)−s(1)]/h for h≠0 and find its limit as h→0.|6+3h; limit 6|3h; limit 0|6h+3h²; limit 0|Expand 3(1+h)²−3=6h+3h², divide by h, then let h approach zero.
9|A car travels s(t)=5t² meters. Find its average velocity from t=2 to t=2.1.|20.5 m/s|2.05 m/s|21 m/s|The positions are 20 and 22.05; divide 2.05 meters by 0.1 second.
@1.2
3|For x≠3, f(x)=(x²−9)/(x−3). Find lim as x→3 of f(x).|6|9|Does not exist|Cancel x−3 for nearby inputs to get x+3, whose limit is 6.
8|Let f(x)=2x+1 for x<2 and f(x)=x+3 for x>2. Find lim as x→2 of f(x).|5|4|Does not exist|The left expression approaches 5 and the right expression also approaches 5.
10|Let f(x)=x+2 for x<0 and f(x)=3−x for x≥0. Compute the left and right limits at 0.|Left 2, right 3|Left 3, right 2|Both 3|Use each branch on its own side of zero; the different limits prevent a two-sided limit.
@1.4
2|A table lists x=1.1,1.01,1.001 with f(x)=2.2,2.02,2.002. Estimate the right-hand limit at 1.|2|1|2.2|Inputs approach 1 from above while outputs approach 2.
3|For x≠0, f(x)=2+x sin(1/x). A table near 0 suggests 2. Use −abs(x)≤x sin(1/x)≤abs(x) to find the exact limit.|2|0|Does not exist|The bounding functions 2−abs(x) and 2+abs(x) both tend to 2, confirming the table's estimate.
5|Near 3, a table gives f(2.99)=5.98, f(2.999)=5.998, f(3.001)=6.002, f(3.01)=6.02. Estimate the limit.|6|3|5.998|Both sides approach output 6 as the inputs approach 3.
7|A table lists f(−0.1)=−2.1, f(−0.01)=−2.01, f(0.01)=1.99, f(0.1)=1.9. Estimate the two one-sided limits at 0.|Left −2, right 2|Both 0|Left 2, right −2|The negative-input outputs approach −2 and positive-input outputs approach 2.
9|For x=9.9,9.99,10.01,10.1, values of f are 0.99,0.999,1.001,1.01. Estimate lim as x→10 of 3f(x)−2.|1|3|−1|The table suggests f approaches 1, so 3f−2 approaches 3×1−2=1.
10|A table gives f(1.99)=7.9601 and f(2.01)=8.0401 for f(x)=x²+4. Calculate the exact limit at 2.|8|7.9601|8.0401|The polynomial is continuous, so substitute 2: 2²+4=8.
@1.5
3|Given lim f(x)=4 and lim g(x)=−2 as x→a, calculate lim (f(x)²+g(x))/g(x).|−7|7|−9|The denominator limit is nonzero. Substitute the limits: (16−2)/(−2)=−7.
4|Evaluate lim as x→2 of (x²−4)/(x−2).|4|0|Does not exist|The initial form is 0/0. Factor and cancel to get the limit of x+2, namely 4.
@1.6
4|Evaluate lim as x→4 of (x²−16)/(x−4).|8|4|0|For x≠4, cancel x−4 to obtain x+4. Its limit is 8.
@1.7
1|Select an appropriate limit method and evaluate lim as x→1 of (3x+2)/(x+1).|Direct substitution gives 5/2|Factoring gives 0|The limit does not exist|The denominator is 2 at the target, so direct substitution is valid.
2|Evaluate lim as x→0 of (√(9+x)−3)/x.|1/6|1/3|0|Multiply by the conjugate to obtain 1/(√(9+x)+3), then substitute.
3|Let f(x)=x² for x<1 and f(x)=2x+1 for x≥1. Find the limit as x→1.|Does not exist|1|3|The left limit is 1 and the right limit is 3. They do not agree.
4|Evaluate lim as x→−1 of (x²−1)/(x+1).|−2|0|2|Factor the numerator and cancel x+1, leaving x−1 with limit −2.
5|Evaluate lim as x→0 of x² cos(1/x).|0|1|Does not exist|The expression lies between −x² and x²; both bounds approach zero.
6|Evaluate lim as x→∞ of (2x²−x)/(5x²+1).|2/5|0|2|Divide both numerator and denominator by x², then let reciprocal powers approach zero.
7|Evaluate lim as x→0 of sin(5x)/(2x), using radians.|5/2|2/5|0|Rewrite as (5/2)×sin(5x)/(5x); the final factor tends to 1.
8|Evaluate lim as x→0 of (1/(x+2)−1/2)/x.|−1/4|1/4|−1/2|Combine the numerator to get −x/[2(x+2)], then cancel x and substitute.
9|Evaluate lim as x→3 of (x−3)/(√(x+1)−2).|4|1/4|0|Rationalize the denominator to obtain √(x+1)+2 for x≠3, whose limit is 4.
10|Evaluate lim as x→0 from the left of abs(x)/x.|−1|1|0|For negative x, abs(x)=−x. The quotient is −1 throughout that side.
@1.8
3|Evaluate lim as x→0 of x sin(1/x).|0|1|Does not exist|Its absolute value is bounded by abs(x), which approaches zero.
10|If 4−2x²≤g(x)≤4+3x² near 0, evaluate lim as x→0 of (g(x)+1).|5|4|1|Both bounds for g tend to 4, so g+1 tends to 5.
@1.9
3|For x≠2, f(x)=(x²−4)/(x−2), but f(2)=9. Find the limiting height and the plotted filled-point height at x=2.|Limit 4; filled point 9|Limit 9; filled point 4|Both 9|The nearby formula simplifies to x+2; the assigned value only determines the filled point.
5|A piecewise graph follows y=2x for x<1 and y=x+3 for x≥1. Compute its one-sided limits at 1.|Left 2, right 4|Left 4, right 2|Both 2|Substitute into each branch separately to find its approaching height.
9|The table for f(x)=(x²−9)/(x−3) approaches 6 near x=3. What point must be added to fill the graph's hole?|(3,6)|(6,3)|(3,0)|The reduced expression is x+3, so the missing point has coordinates (3,6).
@1.10
1|Let f(x)=(x²−4)/(x−2) for x≠2. What value should fill its hole?|f(2)=4|f(2)=2|f(2)=0|The reduced expression x+2 approaches 4 at 2.
2|Let f(x)=x+1 for x<0 and f(x)=x+4 for x≥0. Calculate the jump size at 0.|3|4|1|The one-sided limits are 1 and 4, whose absolute difference is 3.
3|For f(x)=1/(x−2)², locate the vertical asymptote and determine the right-hand limit there.|x=2; limit +∞|x=−2; limit +∞|x=2; limit −∞|The denominator is positive and tends to zero as x approaches 2 from the right.
4|For f(x)=(x²−1)/(x−1) when x≠1 and f(1)=5, by how much must f(1) change to make f continuous?|Decrease by 3|Increase by 3|Decrease by 4|The finite limit is 2, so replace 5 with 2.
5|For xₙ=1/(π/2+2πn) and zₙ=1/(3π/2+2πn), compare sin(1/xₙ) and sin(1/zₙ).|1 and −1|Both 0|Both 1|The angles have sine 1 and −1 respectively. Both input sequences approach 0, showing the limit fails.
6|For f(x)=(x²−9)/(x²−x−6), find the hole's coordinates.|(3,6/5)|(−2,6/5)|(3,0)|Factor as (x−3)(x+3)/[(x−3)(x+2)]. At the excluded x=3, the reduced height is 6/5.
7|For f(x)=1/(x+2), find the limits at x=−2 from the left and right.|Left −∞, right +∞|Left +∞, right −∞|Both +∞|The numerator is positive while the small denominator changes from negative to positive.
8|Let f(x)=x² for x<1, f(1)=0, and f(x)=3−x for x>1. Find its one-sided limits at 1.|Left 1, right 2|Both 0|Both 1|The limiting values come from the two branches, independently of f(1).
9|For f(x)=(x−1)/(x²−1), locate the hole and vertical asymptote.|Hole (1,1/2); asymptote x=−1|Hole (−1,1/2); asymptote x=1|Two holes at x=±1|Cancel x−1 to get 1/(x+1), while keeping the original exclusions.
10|Let f(x)=x²+1 for x≠2 and f(2)=8. Find lim as x→2 of f(x)−f(2).|−3|0|3|The nearby values approach 5, so the difference approaches 5−8=−3.
@1.11
1|Let f(x)=kx+1 for x<2 and f(x)=7 for x≥2. Find k for continuity at 2.|3|7/2|6|Equate the left limit 2k+1 to the value and right limit 7, giving k=3.
9|Find every real input where f(x)=(x+1)/(x²−9) is discontinuous.|−3 and 3|−1 only|3 only|The denominator vanishes at ±3 and neither factor cancels.
@1.12
2|Let f(0)=k and f(x)=√(x+4) for 0<x≤5. Find k for continuity on [0,5].|2|4|0|At the left endpoint use the right-hand limit √4=2.
5|Find the intervals where h(x)=√(x−1)+1/(x−3) is continuous.|[1,3) and (3,∞)|(−∞,3) and (3,∞)|[1,∞)|The radical requires x≥1 and the reciprocal excludes 3. Both terms are continuous elsewhere in that domain.
7|Let f(x)=x² for 0≤x<2 and f(2)=k. Find k for continuity on [0,2].|4|2|0|At the right endpoint the left-hand limit is 2²=4.
9|Find the largest open interval containing 0 on which f(x)=1/(x²−4) is continuous.|(−2,2)|(−∞,2)|(−∞,∞)|The nearest denominator zeros on either side of 0 are −2 and 2.
@1.13
2|Let f(x)=x+1 for x<0 and f(x)=kx+2 for x≥0. Can any real k make f continuous at 0?|No value of k|k=1|k=−1|The left limit is always 1 and the right limit is always 2; changing k cannot fix them.
5|Let f(x)=(x³−8)/(x−2) for x≠2. Find f(2) that gives continuity.|12|4|8|Factor and cancel to get x²+2x+4, whose value at 2 is 12.
10|Let f(x)=ax+2 for x<1 and f(x)=x²+4 for x≥1. Find a for continuity.|3|5|2|The branches meet when a+2=1+4, so a=3.
@1.14
5|Evaluate lim as x→3 from the right of 2/(x−3).|+∞|−∞|0|The positive numerator is divided by a positive denominator approaching zero.
10|Evaluate lim as x→−1 from the left of (x−2)/(x+1).|+∞|−∞|−3|Near −1 from the left, both numerator and denominator are negative, with denominator approaching zero.
@1.15
3|Find where f(x)=x/(x²+1) crosses its horizontal asymptote y=0.|x=0|x=1|It never crosses|Set the numerator to zero; at x=0 the denominator is nonzero. A horizontal asymptote describes end behavior.
5|Evaluate lim as x→∞ of (4x³+2x)/(x³−7).|4|0|+∞|Divide by x³. The lower-order terms vanish, leaving the leading-coefficient ratio 4.
@1.16
2|Apply IVT to f(x)=x³−2. Which interval guarantees a root: (0,1), (1,2), or (2,3)?|(1,2)|(0,1)|(2,3)|The polynomial is continuous, f(1)=−1, and f(2)=6. Opposite signs bracket a root.
3|Find how many distinct zeros f(x)=x³−x has on [−2,2].|3|1|2|Factor x(x−1)(x+1); the zeros −1,0,1 show why IVT alone does not imply uniqueness.
`;
