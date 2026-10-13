export default String.raw`
@2.1
3|Find the secant slope for f(x)=x³−x from x=1 to x=2.|6|3|11|The outputs are 0 and 6; divide by the input change 1.
5|A position is s(t)=2t²+1 meters. Find instantaneous velocity at t=3 seconds.|12 m/s|19 m/s|6 m/s|Differentiate to get s′(t)=4t, then evaluate at 3.
7|A position has s(4)=10 m and s′(4)=−2 m/s. Use the tangent line to estimate s(4.1).|9.8 m|10.2 m|8 m|The time change is 0.1 s, so the estimated position change is −2×0.1=−0.2 m.
@2.2
1|Evaluate lim as h→0 of [(2+h)²−4]/h.|4|0|2|For h≠0 the quotient simplifies to 4+h, which tends to 4.
3|For y=5x²−3x, calculate dy/dx at x=2.|17|14|7|The derivative is 10x−3; at x=2 it equals 17.
5|For f(x)=abs(x), compute the right and left difference-quotient limits at 0.|Right 1, left −1|Both 1|Both 0|The quotient abs(h)/h is 1 for positive h and −1 for negative h, so no derivative exists.
6|Evaluate lim as h→0 of [(3+h)³−27]/h.|27|9|0|Expand to get (27h+9h²+h³)/h. Its limit is 27.
8|Evaluate lim as x→2 of (x³−8)/(x−2).|12|6|4|Factor the numerator and cancel x−2 to get x²+2x+4, which approaches 12.
@2.3
4|For f(x)=x³, estimate f′(1) using a centered difference with h=0.1.|3.01|3|0.301|Use (1.1³−0.9³)/0.2=(1.331−0.729)/0.2=3.01.
5|Given f(4.9)=7.7 and f(5.1)=8.3, estimate f′(5) by a centered difference.|3|0.6|6|Divide the output change 0.6 by the full input span 0.2.
10|A calculator rounds f(1.000001) and f(1) both to 2.000. What forward-difference estimate results using h=0.000001?|0|2|2000000|Subtracting the rounded outputs gives zero; division still gives zero, illustrating lost precision.
@2.4
1|Let f(x)=ax+1 for x<1 and f(x)=x²+2 for x≥1. Find a that makes f differentiable at 1.|2|1|3|Continuity requires a+1=3, and equal slopes require a=2. Both conditions agree.
3|Let f(x)=x for x<0 and f(x)=x+2 for x≥0. Calculate the limit of [f(h)−f(0)]/h as h→0 from the right.|1|0|Does not exist|For h>0 the quotient is (h+2−2)/h=1. The other side fails, so this is only a one-sided result.
7|A differentiable f has f(2)=5. Calculate lim as x→2 of [3f(x)−4].|11|15|1|Differentiability implies continuity, so the limit is 3×5−4=11.
10|Set f(x)=(x²−1)/(x−1) for x≠1. Which pair of values f(1), f′(1) makes the extension differentiable?|f(1)=2, f′(1)=1|f(1)=1, f′(1)=2|f(1)=2, f′(1)=0|The reduced formula is x+1. Filling the hole with 2 gives that line everywhere, with slope 1.
@2.6
5|Given f′(2)=7 and g′(2)=−3, find (f−2g)′(2).|13|1|4|Apply linearity: 7−2(−3)=13.
9|For h(x)=x³+12, find h′(2).|12|24|20|The constant has derivative zero, so h′(x)=3x² and h′(2)=12.
@2.8
4|Differentiate (x²+1)(x³−2).|5x⁴+3x²−4x|6x³|5x⁴−4x−2|Use 2x(x³−2)+(x²+1)3x², then simplify.
@2.9
2|Differentiate (x+1)/(x−1), where x≠1.|−2/(x−1)²|2/(x−1)²|1|The quotient-rule numerator is (x−1)−(x+1)=−2.
5|For f(x)=sin x/x, find f′(π).|−1/π|1/π|0|The derivative is (x cos x−sin x)/x²; at π the numerator is −π.
@3.3
2|Let f(x)=x³+2x and g=f⁻¹. Find g′(3).|1/5|5|1/29|First solve f(1)=3, then use g′(3)=1/f′(1)=1/(3+2).
4|For f(x)=x² restricted to x>0, calculate the slope of its inverse at x=9.|1/6|6|1/18|The inverse input 9 corresponds to original input 3, whose derivative is 6; take the reciprocal.
10|Let f(x)=3x−2 and g=f⁻¹. Find the tangent line to g at (4,2).|y−2=(1/3)(x−4)|y−2=3(x−4)|y−4=(1/3)(x−2)|The inverse slope is 1/3 and the specified point is (4,2).
@3.4
10|Find the tangent slope to y=arcsin x at x=1/2.|2/√3|√3/2|2|Substitute into 1/√(1−x²): 1/√(3/4)=2/√3.
@3.5
1|Differentiate y=(x²+1)⁴.|8x(x²+1)³|4(x²+1)³|8x³|Use the chain rule, multiplying the outer derivative by 2x.
2|Differentiate y=x²e^(3x).|e^(3x)(2x+3x²)|6x e^(3x)|2x e^(3x)|The product rule gives 2x e^(3x)+x²×3e^(3x).
4|Differentiate y=(x²+1)/x for x≠0.|1−1/x²|1+1/x²|2x|Rewrite as x+1/x, then differentiate term by term.
5|For x>0, differentiate y=ln(x²+4).|2x/(x²+4)|1/(x²+4)|2/x|The log derivative divides the inner derivative 2x by the inner expression.
8|For y=sin x/(1+x²), find y′(0).|1|0|−1|The quotient rule gives [(1+x²)cos x−2x sin x]/(1+x²)², which equals 1 at zero.
@3.6
2|For f(x)=2x⁴−x², calculate f″(1).|22|6|24|Differentiate twice: f′=8x³−2x and f″=24x²−2. Evaluate at 1.
@4.1
1|The cost of producing x items is C(x)=0.02x²+3x+100 dollars. Calculate the marginal cost at x=50.|5 dollars per item|300 dollars per item|4 dollars per item|C′(x)=0.04x+3, so C′(50)=5.
2|Water height has h(3)=12 cm and h′(3)=−0.4 cm/min. Estimate h(3.5) using a linear approximation.|11.8 cm|12.2 cm|11.6 cm|Multiply the rate −0.4 by the time change 0.5, then add to 12.
3|Temperature T(t)=20+6e^(−t) is in °C with t in hours. Find the rate at t=0.|−6°C/hour|6°C/hour|26°C/hour|T′(t)=−6e^(−t), so T′(0)=−6.
4|Revenue is R(x)=10x−0.01x² dollars. Estimate the extra revenue from increasing output from 100 to 101 using R′(100).|8 dollars|9 dollars|800 dollars|R′(x)=10−0.02x, so the estimated one-item increase is 8 dollars.
6|A population P(t)=200+30t−2t² is measured in individuals. Find P′(4).|14 individuals per year|16 individuals per year|288 individuals per year|Differentiate to get 30−4t, then evaluate at 4.
8|Pressure p(V)=120/V is in kPa for volume V in liters. Find dp/dV at V=4.|−7.5 kPa/L|30 kPa/L|7.5 kPa/L|The derivative is −120/V²; substitute V=4.
9|A balance has B(2)=500 dollars and B′(2)=12 dollars/year. Estimate B(2.25).|503 dollars|512 dollars|548 dollars|The linear change is 12×0.25=3 dollars.
10|A radius r(t)=2+0.5t is measured in cm and t in seconds. Find the rate of change of the diameter.|1 cm/s|0.5 cm/s|2 cm/s|The diameter is 2r, so its rate is 2r′=2×0.5=1.
@4.3
2|A population is P(t)=1000+60t−5t². When does its growth rate become zero?|t=6|t=12|t=3|Differentiate: P′=60−10t. Set this equal to zero.
4|A cost model has C′(x)=2x+5. Find the rate at which marginal cost changes.|2|2x|5|Differentiate the marginal-cost function: C″=2.
8|Water temperature is T(t)=30−8t+t². Find the interval of positive times on which it is decreasing.|0<t<4|t>4|0<t<8|T′(t)=−8+2t is negative when t<4; combine with positive time.
@4.4
2|A circle's radius grows at 3 cm/s. Write its area rate at the instant r=4 cm.|24π cm²/s|16π cm²/s|12π cm²/s|Differentiate A=πr² with respect to time: A′=2πr r′. Substitute r=4 and r′=3.
4|A 10 m ladder has foot x m from the wall and top y m high. At x=6,y=8, its foot moves out at 2 m/s. Find y′.|−3/2 m/s|3/2 m/s|−8/3 m/s|Differentiate x²+y²=100: 2x x′+2y y′=0. Thus y′=−6×2/8.
9|A cone has height h=3r. Express its volume using r alone.|V=πr³|V=3πr³|V=πr²|Substitute h=3r into V=πr²h/3 and simplify.
10|A rectangle satisfies xy=24. At x=4,y=6, x increases at 2 units/s. Find y′.|−3 units/s|3 units/s|−4/3 units/s|Differentiate to get x′y+xy′=0, so 2×6+4y′=0.
@4.6
2|Use the linearization of √x at x=4 to approximate √4.04.|2.01|2.02|2.001|The tangent approximation is 2+(x−4)/4. At 4.04, the correction is 0.01.
3|Find the tangent line to y=x² at x=3.|y=6x−9|y=3x|y=6x+9|The point is (3,9) and slope is 6, giving y−9=6(x−3).
5|Use the tangent line to f(x)=√x at x=4 to estimate √4.4.|2.1|2.2|2.05|At 4 the value is 2 and slope 1/4. Add (1/4)×0.4.
@4.7
2|Use L'Hôpital's rule to evaluate lim as x→0 of (e^(2x)−1)/x.|2|1|0|The form is 0/0. The derivative quotient 2e^(2x)/1 approaches 2.
3|Evaluate lim as x→∞ of ln x/√x.|0|2|+∞|Apply L'Hôpital to get (1/x)/(1/(2√x))=2/√x, which tends to zero.
8|Evaluate lim as x→0 from the right of x ln x.|0|−∞|1|Rewrite as ln x/(1/x). L'Hôpital gives (1/x)/(−1/x²)=−x, which approaches zero.
@5.1
2|For f(x)=x⁴ on [1,2], find the c guaranteed by MVT.|∛(15/4)|3/2|∛15|The secant slope is (16−1)/(2−1)=15. Solve 4c³=15 for the input in (1,2).
4|Apply Rolle's theorem to f(x)=x²−4x+3 on [1,3]. Find c.|2|1|3|The endpoint values are both zero and f′(x)=2x−4, so c=2.
@5.2
1|Find all critical numbers of f(x)=x³−3x².|0 and 2|0 only|1 and 3|Set f′(x)=3x(x−2)=0; the polynomial is differentiable everywhere.
2|Find the absolute maximum of f(x)=x²−2x on [0,3].|3|0|−1|Check endpoints and critical point 1: values are 0,3,−1 respectively.
4|Find the absolute minimum of f(x)=abs(x−2)+1 on [0,5].|1|3|4|The absolute-value term is smallest, zero, at x=2; endpoints are larger.
5|Find every critical number of f(x)=x^(2/3).|0|None|1|For x≠0, f′=(2/3)x^(−1/3), which never vanishes; at zero f exists but the derivative is undefined.
6|Find the absolute extrema of f(x)=x³−3x on [−2,2].|Minimum −2; maximum 2|Minimum −1; maximum 1|Minimum −2; maximum 4|Check x=−2,−1,1,2. Their values are −2,2,−2,2.
10|Find the absolute maximum of f(x)=x³ on [−1,2].|8|0|−1|Check the critical number 0 and both endpoints. The largest value is f(2)=8.
@5.3
1|If f′(x)=(x−1)(x+2), where is f increasing?|x<−2 or x>1|−2<x<1|x>−2|The two factors have the same sign outside the roots and opposite signs between them.
4|For f(x)=x³−12x, find its intervals of decrease.|(−2,2)|(−∞,−2) and (2,∞)|(0,4)|f′=3x²−12=3(x−2)(x+2), which is negative between −2 and 2.
5|A derivative graph is the line through (0,−4) and (2,0). Where is the original function decreasing?|x<2|x>2|x<0|The derivative line is 2x−4 and lies below zero for x<2.
9|If f′(x)=−(x−3)², where is f strictly increasing?|Nowhere|(3,∞)|(−∞,3)|The derivative is negative except at 3, so it never has an interval of increase.
10|For f′(x)=x(x−4), compare f(1) and f(3).|f(1)>f(3)|f(1)<f(3)|f(1)=f(3)|The derivative is negative throughout (1,3), so f decreases across that interval.
@5.4
1|For f(x)=x³−3x, identify the local maximum point.|(−1,2)|(1,−2)|(0,0)|The derivative 3(x−1)(x+1) changes from positive to negative at −1; f(−1)=2.
2|For f(x)=x³−3x², identify the local minimum point.|(2,−4)|(0,0)|(2,4)|The derivative 3x(x−2) changes from negative to positive at 2, where f=−4.
5|For f′(x)=(x−1)(x−3), classify x=3.|Local minimum|Local maximum|Neither|The derivative changes from negative to positive at 3, so f has a local minimum there.
9|If f′(x)=(x−1)²(x+2), classify the critical number x=1.|Neither a local maximum nor minimum|Local maximum|Local minimum|On both sides near 1 the squared factor is positive and x+2 is positive, so the derivative does not change sign.
@5.5
2|Find the absolute minimum of f(x)=2x²−8x+3 on [0,5].|−5|3|13|The critical input is 2. Compare f(0)=3, f(2)=−5, f(5)=13.
4|Find the absolute maximum of f(x)=sin x on [0,3π/2].|1|0|−1|The interior critical point π/2 gives 1; the other critical point and endpoints give no larger value.
@5.6
1|For f(x)=x³−6x², find where its graph is concave up.|x>2|x<2|x>4|f″(x)=6x−12, which is positive when x>2.
3|Find the inflection point of f(x)=x³−3x².|(1,−2)|(0,0)|(2,−4)|The second derivative 6x−6 changes sign at 1; f(1)=−2.
5|For f(x)=x⁴, find all inflection points.|None|(0,0)|(1,1)|f″=12x² stays nonnegative on both sides of zero, so concavity does not change.
8|If f′(x)=x²−4x, where is f concave down?|x<2|x>2|0<x<4|Differentiate f′ to get f″=2x−4, which is negative for x<2.
10|For f(x)=x⁴−6x², find the x-coordinates of inflection points.|−1 and 1|0 only|−√3 and √3|The second derivative 12x²−12 changes sign at ±1.
@5.7
5|For f(x)=x³−3x²+2, use the second derivative test to classify x=2.|Local minimum|Local maximum|Inconclusive|f′(2)=0 and f″(2)=6>0, so x=2 is a local minimum.
@5.8
1|For f(x)=x³−3x, give the local maximum and local minimum coordinates.|Maximum (−1,2); minimum (1,−2)|Maximum (1,−2); minimum (−1,2)|Maximum (0,0); no minimum|Solve f′=3x²−3=0 and check its sign changes, then evaluate f at ±1.
2|For f(x)=x³, where is the graph decreasing and where is it concave down?|Never decreasing; concave down for x<0|Decreasing for x<0; concave down for x<0|Never decreasing; concave down for x>0|f′=3x² is nonnegative, while f″=6x is negative on x<0.
4|For f(x)=x⁴−2x², find the local extrema values.|Local maximum 0; local minima −1|Local maximum 1; local minima 0|Local maximum 0; local minima −2|The critical inputs are 0 and ±1; evaluate f there and use derivative sign changes.
5|For f(x)=x/(x²+1), find the x-coordinates of its local extrema.|−1 and 1|0 only|−2 and 2|The derivative is (1−x²)/(x²+1)² and changes sign at ±1.
7|For f(x)=x³−3x², identify the interval where it is decreasing and concave up.|(1,2)|(0,1)|(2,∞)|Decreasing requires 0<x<2; concave up requires x>1. Intersect the two conditions.
10|For f(x)=x²e^(−x), find the nonzero critical input and classify it.|x=2, local maximum|x=2, local minimum|x=−2, local maximum|f′=e^(−x)x(2−x); at 2 it changes from positive to negative.
@5.9
1|The graph of f′ is the line joining (0,−2) to (4,2). At which x does f have a local minimum?|2|0|4|The line crosses zero at x=2, changing the derivative from negative to positive.
2|The graph of f′ is the line through (0,4),(2,0),(4,−4). Where is f increasing on (0,4)?|(0,2)|(2,4)|(0,4)|The derivative graph is above the axis only before its zero at 2.
3|The graph of f′ consists of line segments through (0,0),(2,4),(5,1). Find f″(3).|−1|1|3|At x=3 the slope of the derivative graph is (1−4)/(5−2)=−1.
4|The graph of f′ follows y=(x−1)². Where does f have a local extremum?|Nowhere|x=1|x=0|The derivative touches zero at 1 but is positive on both sides, so f has no local extremum there.
5|A graph of f′ is piecewise linear through (−2,1),(0,3),(2,1). At what x does f change concavity?|0|−1|1|The derivative graph changes from increasing to decreasing at 0, so f changes from concave up to concave down.
6|A graph of f″ is the line y=2x−6. Find the inflection input of a twice-differentiable f.|3|6|−3|The second derivative changes sign at 2x−6=0, so x=3.
7|The graph of f′ follows y=4−x². Where does f have a local maximum?|2|−2|0|At x=2 the derivative changes from positive to negative; at −2 it changes the other way.
8|A derivative graph is a line segment from (1,5) to (4,−1). Calculate f′(2).|3|2|−2|The derivative graph has slope −2; its height at x=2 is 5−2×1=3.
9|The graph of f′ is y=x²−2x. On which interval is f decreasing and concave down?|(0,1)|(1,2)|(−∞,0)|f′<0 on (0,2) and its slope f″=2x−2 is negative for x<1. The overlap is (0,1).
10|At x=2, the graph of f passes through (2,5) and its derivative graph passes through (2,−3). Find the tangent line to f.|y−5=−3(x−2)|y+3=5(x−2)|y−5=3(x−2)|Read the slope −3 from f′ and use the point (2,5) on f.
@5.10
2|A rectangle has perimeter 20 and positive side lengths. If one side is x, find the feasible domain.|0<x<10|0≤x≤10|0<x<20|The other side is 10−x. Requiring both sides to be positive gives 0<x<10.
3|A rectangle has perimeter 40. Write its area as a function of width x.|A(x)=20x−x²|A(x)=40x−x²|A(x)=x²+20x|The other side is 20−x, so multiply x(20−x).
4|A closed cylinder has volume 54π. Express its surface area using radius r alone.|S(r)=2πr²+108π/r|S(r)=2πr²+54π/r|S(r)=πr²+108π/r|From πr²h=54π, h=54/r². Substitute into 2πr²+2πrh.
5|Squares of side x are cut from the corners of a 10 by 16 sheet. Write the open box's volume.|V(x)=x(10−2x)(16−2x)|V(x)=x(10−x)(16−x)|V(x)=160x|The height is x; each base dimension loses two corner widths.
9|A fence of length 60 surrounds three sides of a rectangle against a wall. Express area in terms of the side x perpendicular to the wall.|A(x)=60x−2x²|A(x)=60x−x²|A(x)=30x−2x²|The parallel side has length 60−2x, so area is x(60−2x).
@5.11
3|A rectangle has perimeter 40. Find the maximum possible area.|100|200|400|A(x)=20x−x² has derivative 20−2x=0 at x=10; both sides are 10.
5|Find the point on y=x closest to (4,0).|(2,2)|(4,4)|(0,0)|Minimize squared distance (x−4)²+x². Its derivative 4x−8 vanishes at x=2 and its second derivative is positive.
@5.12
3|For x²+xy+y²=7, find dy/dx at (2,1).|−5/4|−4/5|5/4|Implicit differentiation gives y′=−(2x+y)/(x+2y), so at (2,1) it is −5/4.
5|For x²+y²=25 at (3,4), find d²y/dx².|−25/64|−3/4|25/64|Differentiate 2x+2yy′=0 again: 2+2(y′)²+2yy″=0. Use y′=−3/4 and y=4.
`;
