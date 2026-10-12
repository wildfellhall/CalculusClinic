export default `
@8.1
Find the average value of f(x)=3x² on [0,2].|4|8|6|The integral is [x³]₀²=8; divide by the interval length 2.
Find the average value of sin x on [0,π].|2/π|2|0|The integral is 2 and the interval width is π.
If f is continuous on [a,b], what does the integral mean-value theorem guarantee?|Some c in [a,b] has f(c) equal to the average value|f′(c) equals the average value at every c|The average value equals f at the midpoint|Continuity ensures the function attains its average, though not necessarily at the midpoint.
A temperature T has ∫₀⁴ T(t)dt=72 degree-hours. What is its average temperature over those four hours?|18°C|72°C|288°C|Divide the accumulated temperature by the elapsed time 4 hours.
If the average of f on [1,5] is 6, what is ∫₁⁵ f(x)dx?|24|6|3/2|Multiply the average value by the interval length 5−1=4.
@8.2
For v(t)=2t−2 on [0,3], find displacement.|3|5|6|Integrating gives [t²−2t]₀³=3, with signed contributions.
For v(t)=2t−2 on [0,3], find total distance.|5|3|1|Split at t=1: the negative portion has magnitude 1 and the positive portion contributes 4.
If a(t)=6t, v(0)=−1, and s(0)=2, find s(1).|2|3|1|Integrate to v=3t²−1, then s=t³−t+2; evaluate at 1.
A particle has v(t)=−t on [1,3]. How do displacement and distance compare?|Displacement is −4 and distance is 4|Both are −4|Both are 4|The velocity stays negative; ∫₁³ −t dt=−4 while integrating speed t gives 4.
If ∫₀⁴ a(t)dt=7 and v(0)=−2, what is v(4)?|5|7|9|The acceleration integral is the change in velocity, so add it to −2.
@8.3
A tank starts with 10 L and has net rate 4−t L/min for 0≤t≤6. At what time is its volume greatest on this interval?|t=4 minutes|t=6 minutes|t=0 minutes|The rate changes from positive to negative at 4, so volume first rises and then falls.
For that tank with initial 10 L and net rate 4−t, how much water is present at t=6?|16 L|6 L|22 L|Add ∫₀⁶(4−t)dt=24−18=6 to the initial 10 L.
People enter a hall at E(t) and leave at L(t), both in people/hour. Which expression gives the change in occupancy from hour 1 to hour 3?|∫₁³ [E(t)−L(t)]dt|∫₁³ [E(t)+L(t)]dt|E(3)−L(1)|Occupancy changes by the signed accumulation of entry rate minus departure rate.
If inflow and outflow rates are equal at t=c, what can be concluded about the amount at that instant?|Its instantaneous rate of change is zero|It must be zero|It must be an absolute maximum|Equal rates give zero net rate, but further sign information is needed to classify an extremum.
A quantity Q has Q(2)=15 and net change −4 from t=2 to t=5. What is Q(5)?|11|−4|19|Final amount equals the known initial amount plus signed net change.
@8.4
Find the area enclosed by y=2x and y=x².|4/3|8/3|2/3|They meet at x=0 and 2; integrate 2x−x² over that interval.
For y=4−x² above y=0 on [−2,2], find the area.|32/3|16/3|8|Integrate 4−x² from −2 to 2, or double the positive-half integral.
Which vertical-slice integral gives the area between y=√x and y=x on [0,1]?|∫₀¹ (√x−x)dx|∫₀¹ (x−√x)dx|∫₀¹ (√x+x)dx|The square-root curve is above the line throughout the interior.
Two curves y=x+2 and y=x² intersect at which x-values?|−1 and 2|−2 and 1|0 and 2|Solve x²−x−2=(x−2)(x+1)=0.
Find the area between y=3 and y=x² on [0,1].|8/3|3|10/3|The top curve is 3; the integral of 3−x² is 3−1/3.
@8.5
Find the area between x=2y and x=y² from y=0 to y=2.|4/3|8/3|2|Horizontal widths are 2y−y²; integrating from 0 to 2 gives 4/3.
A region is bounded by x=0 and x=4−y² for −2≤y≤2. Which horizontal-slice setup gives its area?|∫_(−2)^2 (4−y²)dy|∫₀⁴ (4−y²)dy|∫_(−2)^2 y²dy|The bounds are y-coordinates, and the width is right boundary minus left boundary.
For the region between x=y−1 and x=3 on 0≤y≤2, find its area.|6|4|8|The width is 3−(y−1)=4−y; integrate it over [0,2].
When a right boundary is y=x² with x≥0, how is it written for integration with respect to y?|x=√y|x=y²|x=−√y|Solve for the nonnegative x-branch to match the stated side of the parabola.
The region between y=x² and y=4 can be described using horizontal width…|2√y for 0≤y≤4|√y for 0≤y≤4|4−y² for −2≤y≤2|At a given y, the boundaries are x=−√y and x=√y.
@8.6
Find the total area between y=x²−1 and the x-axis on [−2,2].|4|8/3|4/3|Split at ±1; the outer pieces contribute 8/3 and the middle contributes 4/3.
Where must ∫ abs(x²−x)dx on [−1,2] be split to remove the absolute value correctly?|At x=0 and x=1|Only at x=0|Only at x=1|The difference x(x−1) changes sign at both roots inside the interval.
Find the area between y=cos x and the x-axis on [0,π].|2|0|1|Split at π/2; each lobe contributes area 1.
For y=x and y=−x on [−1,1], find the total enclosed-between-curves area over the interval.|2|0|1|The slice height is abs(2x); its integral is 2.
Two curves have signed difference integral 3 on [a,c] and −5 on [c,b], with no other crossings. What is their total area on [a,b]?|8|2|−2|Add the magnitudes of the separately ordered pieces: 3+5.
@8.7
A solid has square cross sections perpendicular to the x-axis with side 2−x for 0≤x≤2. Find its volume.|8/3|2|4|Integrate the square area (2−x)² over the stated interval.
Rectangle cross sections have width x and height 2x for 0≤x≤3. Find the volume.|18|9|27|The area is 2x²; its integral from 0 to 3 is 18.
A solid's square cross sections have a diagonal of length d(x). What is their area?|d(x)²/2|d(x)²|2d(x)²|A square's diagonal is its side times √2, so squaring the side gives half the diagonal squared.
A base region lies between y=x and y=x² on [0,1]. Square sections perpendicular to the x-axis have what area?|(x−x²)²|x²−x⁴|x−x²|The entire vertical gap is the side length; square the difference, not the individual terms separately.
For square slices perpendicular to the y-axis with side 1+y on [0,2], which volume integral is correct?|∫₀² (1+y)²dy|∫₀² (1+y)dy|∫₀² y(1+y)²dy|The slice area is the square of its side and the thickness is dy.
@8.8
Semicircular cross sections have diameter 2x for 0≤x≤2. Find their total volume.|4π/3|16π/3|8π/3|The radius is x, so integrate the half-disk area πx²/2.
Equilateral-triangle cross sections have side x for 0≤x≤2. Find the volume.|2√3/3|8√3/3|4/3|Integrate (√3/4)x² over [0,2].
Right-triangle cross sections have perpendicular legs x and 2x on [0,3]. Find the volume.|9|18|9/2|The triangle area is (1/2)x(2x)=x²; integrate from 0 to 3.
A semicircular slice has radius r(x), explicitly stated as a radius. Which area formula is correct?|πr(x)²/2|πr(x)²/8|πr(x)²|A semicircle has half the area of a full radius-r disk; the factor 1/8 applies to a stated diameter.
An isosceles right-triangle slice has hypotenuse d. What is its area?|d²/4|d²/2|d²|The equal legs have length d/√2, and half their product is d²/4.
@8.9
Rotate the region 0≤y≤√x, 0≤x≤4 about the x-axis. Find its volume.|8π|16π/3|4π|The disk area is π(√x)²=πx; integrate from 0 to 4.
Rotate 0≤x≤y², 0≤y≤1 about the y-axis. Which volume results?|π/5|π/3|π/2|Horizontal disks have radius y², so their area is πy⁴.
A region under y=3 on [−1,2] rotates about the x-axis. Find the volume.|27π|18π|9π|The radius-3 disk has area 9π over an interval of length 3.
For a disk-method integral with dx, which kind of rotation axis is perpendicular to the slices?|A horizontal axis|A vertical axis|Any diagonal line without changing the setup|A vertical slice has thickness dx and rotates into a disk perpendicular to a horizontal axis.
Rotate the region −2≤y≤0 on 0≤x≤1 about the x-axis. What disk radius should be used?|2|−2|0|Radius is a nonnegative distance from the axis; the lower boundary is 2 units away.
@8.10
Rotate 2≤y≤x+2 on 0≤x≤3 about y=2. Find the volume.|9π|15π|27π|The disk radius is x, so integrate πx² over [0,3].
Rotate −3≤x≤y−3 on 0≤y≤2 about x=−3. What is the disk radius?|y|y−3|y+3|The horizontal distance from x=−3 to x=y−3 is y.
Rotate 1≤y≤4 on 0≤x≤2 about y=4. Find the volume.|18π|32π|24π|The region reaches the axis, and each disk has radius 4−1=3 over length 2.
A region lies between y=f(x) and y=5, with f(x)≤5, and rotates about y=5. What is the disk radius?|5−f(x)|f(x)|5+f(x)|Measure the nonnegative vertical distance from the shifted axis to the other boundary.
Rotate 2≤x≤5 on 0≤y≤3 about x=2. Which integral gives the disk volume?|π∫₀³ 3²dy|π∫₂⁵ y²dy|π∫₀³ 5²dy|The horizontal radius is 5−2=3 and the thickness direction is y.
@8.11
Rotate the region between y=1 and y=√x on 1≤x≤4 about the x-axis. Find its volume.|9π/2|15π/2|3π|The washer area is π(x−1), whose integral from 1 to 4 is 9π/2.
Rotate the region between y=x and y=x² on [0,1] about the x-axis. Find the volume.|2π/15|π/30|π/6|The outer radius is x and inner radius is x²; integrate π(x²−x⁴).
A washer has outer radius 5 and inner radius 3. What is its area?|16π|4π|34π|Subtract the squared-radius disk areas: π(25−9).
Rotate 1≤x≤y+1 on 0≤y≤2 about the y-axis. Which area belongs in a dy integral?|π[(y+1)²−1]|πy²|π[(y+1)−1]|The outer and inner radii are y+1 and 1; subtract their squares.
A washer setup yields R<r on part of the interval. What should be rechecked?|Which boundary is farther from the axis on that interval|Whether negative volume is physically acceptable|Whether to omit π|Correct radius ordering makes each cross-sectional area nonnegative; boundaries may need to be reordered piecewise.
@8.12
Rotate 1≤y≤2 on 0≤x≤3 about y=−1. Find the volume.|15π|9π|3π|Outer radius is 3 and inner radius is 2, giving area 5π across length 3.
Rotate 0≤x≤2 on 1≤y≤4 about x=3. What are the washer radii?|R=3 and r=1|R=2 and r=0|R=1 and r=3|The axis is to the right; x=0 is farther from it than x=2.
For a region g(x)≤y≤f(x) below the line y=k, with f(x)≤k, what is the washer area about y=k?|π[(k−g(x))²−(k−f(x))²]|π[(f(x)−k)²−(g(x)−k)²]|π[f(x)²−g(x)²]|The lower curve is farther from the axis, so its distance is the outer radius.
Rotate 0≤y≤x on 0≤x≤1 about y=2. Find the volume.|5π/3|π/3|4π|The outer radius is 2 and inner radius is 2−x; integrate π[4−(2−x)²].
Rotate 2≤x≤4 on 0≤y≤1 about x=−1. Find its volume.|16π|12π|4π|The distances from the axis are 5 and 3, so the constant washer area is π(25−9).
@8.13
Find the arc length of y=−2x+1 on [0,3].|3√5|3√3|6|The derivative is −2; the length integrand √(1+4) is constant over width 3.
For y=x² on [0,1], which integral gives arc length?|∫₀¹ √(1+4x²)dx|∫₀¹ √(1+x⁴)dx|∫₀¹ 2x dx|Square the derivative 2x, not the original function.
Find the length of y=(2/3)x^(3/2) on [0,3].|14/3|8/3|7|The derivative is √x; integrate √(1+x), giving (2/3)(8−1).
For a smooth graph over [a,b] with a<b, how does its arc length compare with b−a?|It is at least b−a|It is always less than b−a|It equals the signed integral of f′|The length integrand √(1+f′²) is at least 1 everywhere.
For x=g(y) on c≤y≤d, what is the corresponding arc-length formula?|∫_c^d √(1+[g′(y)]²)dy|∫_c^d √(1+g(y)²)dy|∫_c^d g′(y)dy|The same distance calculation works with horizontal change g′(y)dy and vertical change dy.
@9.1
For x=t²+1 and y=2t³, find dy/dx at t=2.|6|12|1/6|Divide y′=6t² by x′=2t to obtain 3t at nonzero t.
For x=t³−3t and y=t², which parameter gives a horizontal tangent with x′≠0?|t=0|t=1|t=−1|At t=0, y′=0 and x′=−3; at ±1 the x derivative vanishes instead.
For x=t³−3t and y=t², at which parameters are the tangents vertical?|t=−1 and t=1|t=0 only|No parameters|x′=3t²−3 vanishes at ±1 while y′=2t is nonzero there.
For x=2t+1 and y=t² at t=1, what is the tangent line?|y−1=x−3|y−1=2(x−3)|y−3=x−1|The point is (3,1), and dy/dx=(2t)/2=1 at t=1.
For x=e^t and y=e^(−t), find dy/dx at t=0.|−1|1|0|The derivative ratio is −e^(−t)/e^t, which equals −1 at zero.
@9.2
For x=t² and y=t⁴ with t≠0, find d²y/dx².|2|4t|2t²|The first derivative is 2t²; differentiate it to 4t and divide by x′=2t.
For x=2t and y=t³, find d²y/dx² at t=2.|3|6|12|The slope is (3/2)t²; its t-derivative 3t divided by x′=2 gives 3t/2.
For x=e^t and y=t, determine the sign of d²y/dx².|Negative|Positive|Zero|The slope is e^(−t); differentiating and dividing by e^t gives −e^(−2t).
If d/dt(dy/dx)=−6 and dx/dt=−2, what is the curve's local concavity as y(x)?|Concave up|Concave down|No conclusion can be drawn|The second x-derivative is (−6)/(−2)=3>0.
For x=t and y=sin t, find d²y/dx² at t=π/2.|−1|0|1|Since x′=1, the second x-derivative is −sin t.
@9.3
For x=2 cos t and y=2 sin t on 0≤t≤π, find arc length.|2π|4π|π|The speed is 2 and the parameter interval has length π.
For x=t² and y=0 on −1≤t≤1, find total path length.|2|0|1|The speed is abs(2t); the point travels from x=1 to 0 and back to 1.
For x=1+5t and y=2−12t on 0≤t≤2, find path length.|26|14|13|The constant speed is √(25+144)=13 across two time units.
For x=t and y=t² on [0,1], which integral gives arc length?|∫₀¹ √(1+4t²)dt|∫₀¹ √(t²+t⁴)dt|∫₀¹ (1+2t)dt|Differentiate both components and integrate the magnitude of velocity.
A path has constant speed 3 and is traced for 5 seconds, returning to its start. What is its path length?|15|0|5|Path length accumulates speed regardless of net displacement.
@9.4
For r(t)=⟨e^(2t),t³⟩, find velocity at t=0.|⟨2,0⟩|⟨1,0⟩|⟨4,0⟩|Differentiate the two components to obtain ⟨2e^(2t),3t²⟩.
For r(t)=⟨sin t,cos t⟩, find acceleration at t=0.|⟨0,−1⟩|⟨1,0⟩|⟨0,1⟩|The second derivative is ⟨−sin t,−cos t⟩.
If velocity is v(t)=⟨t²−1,2t⟩, what is acceleration at t=2?|⟨4,2⟩|⟨3,4⟩|⟨2,4⟩|Differentiate v componentwise to ⟨2t,2⟩.
For r(t)=⟨t³−3t,t²⟩, is the particle at rest at t=1?|No; velocity is ⟨0,2⟩|Yes; the first component derivative is zero|Yes; the first coordinate is negative|A planar particle is at rest only when every velocity component is zero.
For r(t)=⟨ln t,1/t⟩ with t>0, find r′(1).|⟨1,−1⟩|⟨0,1⟩|⟨1,1⟩|The derivative is ⟨1/t,−1/t²⟩, evaluated at 1.
@9.5
If v(t)=⟨3t²,2t⟩ and r(0)=⟨−1,4⟩, find r(2).|⟨7,8⟩|⟨8,4⟩|⟨11,8⟩|Integrate to r(t)=⟨t³−1,t²+4⟩ and substitute t=2.
Evaluate ∫₀^π ⟨sin t,cos t⟩dt.|⟨2,0⟩|⟨0,2⟩|⟨0,0⟩|Integrate the components separately: sine contributes 2 and cosine contributes 0.
If a(t)=⟨2,−4⟩ and v(1)=⟨3,2⟩, find v(3).|⟨7,−6⟩|⟨9,−10⟩|⟨4,−8⟩|Add acceleration times the elapsed 2 units to the given velocity.
If v(t)=⟨e^t,1⟩ and r(0)=⟨0,2⟩, which position function is correct?|r(t)=⟨e^t−1,t+2⟩|r(t)=⟨e^t,t+2⟩|r(t)=⟨e^t−1,t⟩|Integrate each component and impose both initial coordinates separately.
Given r(2)=⟨5,−1⟩ and ∫₂⁴ v(t)dt=⟨−3,6⟩, find r(4).|⟨2,5⟩|⟨−3,6⟩|⟨8,−7⟩|The vector integral is displacement, which must be added to the known initial position.
@9.6
A particle has v(t)=⟨3,−4⟩ for 0≤t≤2. Find distance traveled.|10|2|−2|Its speed is the magnitude 5, so distance is 5·2.
For r(t)=⟨cos t,sin t⟩ from t=0 to π, find displacement.|⟨−2,0⟩|⟨π,0⟩|⟨0,0⟩|Subtract initial position ⟨1,0⟩ from final position ⟨−1,0⟩.
For r(t)=⟨t²,t³⟩, find speed at t=−1.|√13|1|−√13|Velocity is ⟨−2,3⟩ at t=−1, whose magnitude is √(4+9).
A particle moves with velocity ⟨2,0⟩ for 1 second and ⟨−2,0⟩ for 1 second. What are distance and displacement?|Distance 4, displacement ⟨0,0⟩|Distance 0, displacement ⟨0,0⟩|Distance 4, displacement ⟨4,0⟩|The two displacements cancel, but each second contributes distance 2.
If both components of v(t) are zero at t=c, what is the speed at c?|0|The sum of the position coordinates|Undefined|The velocity vector has magnitude √(0²+0²)=0.
@9.7
For r=1+cos θ, find dy/dx at θ=π/2.|1|−1|0|Here r=1 and r′=−1; both dy/dθ and dx/dθ equal −1.
For r=sin θ at θ=π/4, what kind of tangent occurs?|Vertical|Horizontal|Slope 1|dx/dθ=cos²θ−sin²θ=0, while dy/dθ=2sin θ cos θ=1.
For r=θ near θ=0, what is the tangent slope at the origin?|0|1|Undefined because every polar origin is singular|At 0, r=0 and r′=1; dx/dθ=1 and dy/dθ=0.
For constant r=3, find the Cartesian slope at θ=π/6.|−√3|√3|−1/√3|The slope is (3cos θ)/(−3sin θ)=−cot θ.
For r=2+sin θ at θ=0, find dx/dθ.|1|0|2|Use r′cos θ−r sin θ; at 0, r′=1 and sin θ=0.
@9.8
Find the polar area for r=3 over 0≤θ≤π/3.|3π/2|3π|π/2|Integrate one half of r²: (1/2)·9·(π/3).
For r=2 cos θ, use −π/2≤θ≤π/2 to find the enclosed area.|π|2π|4π|The integral is 2∫cos²θ dθ over an interval of length π, giving π.
One petal of r=2 cos(2θ) is traced on [−π/4,π/4]. What is its area?|π/2|π|π/4|The polar integral is 2∫cos²(2θ)dθ over that interval, giving π/2.
If r is negative on part of a valid single-trace interval, is its polar area contribution negative?|No; the area integrand uses r²/2|Yes; radius sign determines area sign|Yes; that portion must always be omitted|Squaring the radius gives nonnegative sector area, though the traced region and repeated coverage still need checking.
For r=2 sin θ, which interval traces its circle once from the origin back to the origin?|[0,π]|[0,2π] without retracing|[0,π/2] for the full circle|On [0,π], the curve traces the entire circle centered at (0,1) once.
@9.9
Find the area between r=3 and r=2 for 0≤θ≤π.|5π/2|π/2|5π|Subtract sector areas: (1/2)(9−4) integrated over angular width π.
For 0≤θ≤π/2, r=2 lies outside r=cos θ. Which area integral is correct?|(1/2)∫₀^(π/2) [4−cos²θ]dθ|(1/2)∫₀^(π/2) [2−cos θ]²dθ|∫₀^(π/2) [2−cos θ]dθ|Polar area subtracts the squared boundary radii before multiplying by 1/2.
Where do r=1 and r=2 sin θ have equal positive radius in [0,π]?|θ=π/6 and 5π/6|θ=π/3 and 2π/3|θ=π/2 only|Solve sin θ=1/2 on the interval.
On a common ray where two positive radial boundaries enclose regions from the origin, which radius bounds their overlap?|The smaller of the two radii|The larger of the two radii|The sum of the radii|A point must lie within both regions, so its radius cannot exceed either boundary.
Find the area between r=2 and r=cos θ for −π/2≤θ≤π/2.|7π/4|3π/2|2π|The integral is (1/2)[4π−π/2]=7π/4 because ∫cos²θ over this interval is π/2.
`;
