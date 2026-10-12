export default `
@8.1
Find the average value of f(x)=x on [0,2].|1|2|1/2|Divide ∫₀² x dx=2 by the interval length 2.
Which formula gives average function value on [a,b], a<b?|(1/(b−a))∫ₐᵇ f|[f(b)−f(a)]/(b−a)|f′((a+b)/2)|Average value divides accumulated output by interval width.
The average value of constant f=7 on [2,5] is…|7|21|3|A constant's average equals the constant.
Find the average value of x² on [0,3].|3|9|9/2|The integral is 9 and the interval length is 3.
If temperature is measured in °C, its average value has units…|°C|°C/hour|Hours|An average value keeps the original output units.
@8.2
Velocity is −3 m/s for 2 seconds. Find displacement.|−6 m|6 m|−3 m|Integrate the signed velocity.
For the same motion, find total distance.|6 m|−6 m|0 m|Distance integrates speed, which is 3 m/s.
v(t)=t−1 on [0,2]. Find displacement.|0|1|2|The negative and positive triangular areas cancel.
v(t)=t−1 on [0,2]. Find total distance.|1|0|2|Each triangle contributes positive area 1/2.
If s(0)=5 and ∫₀³ v(t)dt=−2, find s(3).|3|−2|7|Add displacement to initial position.
@8.3
A tank begins with 20 L. Inflow is 5 L/min and outflow is 2 L/min for 4 min. Final volume?|32 L|12 L|48 L|The net rate is 3 L/min, adding 12 L.
If net rate is positive, the amount is…|Increasing|Necessarily at its maximum|Necessarily positive|The sign of the rate determines the direction of change.
Which formula recovers amount Q(t)?|Q(0)+∫₀ᵗ Q′(s)ds|Q′(0)+∫₀ᵗ Q(s)ds|Only ∫₀ᵗ Q′(s)ds for every initial amount|The initial amount must be included.
An amount reaches a local maximum when its net rate changes…|From positive to negative|From negative to positive|From positive to positive|The amount switches from increasing to decreasing.
A rate is in people/hour and time in hours. Its integral has units…|People|People/hour²|Hours/people|Time cancels the rate denominator.
@8.4
Find the area between y=x and y=0 on [0,2].|2|4|1|Integrate the slice height x.
Which integrand gives area where f≥g?|f−g|g−f|f+g|A vertical slice has height top minus bottom.
Find the area between y=2 and y=x on [0,2].|2|4|0|Integrate 2−x from 0 to 2.
Where do y=x² and y=x intersect?|x=0 and 1|x=−1 and 1|x=1 only|Solve x²−x=x(x−1)=0.
Find the area between x and x² on [0,1].|1/6|1/3|1/2|Integrate x−x² on that interval.
@8.5
For horizontal slices, area is computed as…|∫(right−left)dy|∫(top−bottom)dy without rewriting|∫(right+left)dy|The horizontal segment length is right minus left.
Find area between x=y² and x=1 for −1≤y≤1.|4/3|2/3|2|Integrate 1−y² from −1 to 1.
If integrating with respect to y, the bounds should be…|y-values|Always x-values|Function slopes|Bounds correspond to the integration variable.
The region 0≤y≤2 and 0≤x≤y has area…|2|4|1|Integrate the horizontal width y from 0 to 2.
Why might horizontal slices be preferable?|They can avoid splitting a region into several integrals|They always make the area larger|They eliminate all intersections|Choose the orientation that simplifies boundaries.
@8.6
Area between sin x and 0 on [0,2π] equals…|4|0|2|Split at π so both lobes contribute positive area.
Where should an area integral be split when two curves exchange order?|At their crossing inputs|Only at zero|At every integer|The top-minus-bottom formula changes at crossings.
What can happen if one uses ∫(f−g) across changing order?|Positive and negative areas cancel|The answer is always the geometric area|The integral becomes undefined|A signed difference can cancel distinct regions.
Area between x and 0 on [−1,1] is…|1|0|2|Two triangles of area 1/2 add to 1.
Which always represents area between continuous f,g on [a,b]?|∫ₐᵇ abs(f−g)dx|abs(∫ₐᵇ(f−g)dx)|∫ₐᵇ(f+g)dx|Take the absolute difference before accumulating.
@8.7
Square slices have side s(x)=x on [0,2]. Find the volume.|8/3|2|4|Integrate x² from 0 to 2.
If square slices have side f−g, their area is…|(f−g)²|f²−g²|f−g|Square the complete side length.
Rectangle slices have width 2x and height 3 on [0,1]. Find volume.|3|6|1|Integrate area 6x from 0 to 1.
What units result from integrating cross-sectional area over a length?|Cubic units|Square units|Linear units|Area times thickness gives volume.
If slices are perpendicular to the y-axis, the natural volume setup is…|∫A(y)dy|∫A(y)dx without conversion|∫yA(y)dy always|Thickness lies along the y-direction.
@8.8
A semicircular slice has diameter d. Its area is…|πd²/8|πd²/2|πd²|Its radius is d/2 and only half the disk is used.
An equilateral triangular slice has side d. Its area is…|√3 d²/4|d²/2|√3 d²|Use the equilateral triangle area formula.
Semicircular slices have constant diameter 2 on an interval of length 3. Find volume.|3π/2|6π|3π|Each cross section has area π/2.
A right triangle slice has perpendicular legs both of length s. Its area is…|s²/2|s²|2s²|Triangle area is half the product of perpendicular legs.
Why must a semicircle's stated width be read carefully?|It may be the diameter, not the radius|Semicircles have no area|The width never affects volume|Confusing diameter and radius introduces a factor of four.
@8.9
Rotate 0≤y≤x, 0≤x≤1 about the x-axis. Find volume.|π/3|π/2|π|Disks have radius x and area πx².
For disks about the y-axis using horizontal slices, radius is measured…|Horizontally from the y-axis|Vertically from the x-axis|Along the tangent|Slices are perpendicular to the rotation axis.
A disk has radius 3. Its area is…|9π|6π|3π|Disk area is πR².
Rotate 0≤y≤2, 0≤x≤3 about the x-axis. Find volume.|12π|6π|18π|Integrate the constant disk area 4π over length 3.
When does a disk cross section have no inner hole?|The region reaches the rotation axis|The top curve is linear|The interval starts at zero|No missing central segment means inner radius zero.
@8.10
The region 1≤y≤x+1, 0≤x≤2 rotates about y=1. Disk radius is…|x|x+1|1|Measure the top boundary's distance from y=1.
For that region and axis, find volume.|8π/3|26π/3|4π|Integrate πx² from 0 to 2.
A region from x=−2 to x=g(y)>−2 rotates about x=−2. Disk radius is…|g(y)+2|g(y)−2|g(y)|Radius is the horizontal distance to −2.
Why is y=f(x) not always itself the rotation radius?|The axis may be shifted|Radii are always derivatives|The radius must be constant|Measure from the actual axis, not automatically from zero.
Rotate 3≤y≤5, 0≤x≤1 about y=3. Volume is…|4π|25π|16π|The disk radius is 5−3=2.
@8.11
A washer has outer radius 3 and inner radius 1. Its area is…|8π|4π|10π|Subtract π·1² from π·3².
Which expression is washer area?|π(R²−r²)|π(R−r)²|π(R+r)²|Subtract disk areas, not radii before squaring.
Rotate the region between y=2 and y=x on [0,2] about the x-axis. Volume?|16π/3|8π/3|4π|Integrate π(4−x²).
For a washer, which ordering must hold?|0≤r≤R|R≤r always|r must be zero|The inner radius cannot exceed the outer radius.
Rotate 1≤x≤3, 0≤y≤2 about the y-axis. Find volume.|16π|8π|4π|Each horizontal washer has area π(9−1), over height 2.
@8.12
Rotate 1≤y≤3 about y=5. The outer and inner radii are…|4 and 2|3 and 1|2 and 4|The lower boundary is farther from the shifted axis.
Over an x-interval of length 2, those constant radii give volume…|24π|8π|12π|Integrate π(16−4) over length 2.
Rotate between x=2 and x=5 about x=1. Outer radius is…|4|5|3|Measure from x=1 to x=5.
Is the upper curve always the outer radius about a horizontal axis?|No|Yes|Only when curves are continuous|An axis above the region reverses that intuition.
Rotate 0≤y≤1 on 0≤x≤1 about y=−1. Volume is…|3π|π|4π|Outer radius is 2 and inner radius is 1.
@8.13
Arc length of y=f(x) uses which integrand?|√(1+(f′(x))²)|√(1+f(x)²)|abs(f(x))|The local distance combines dx and dy=f′dx.
Find the length of y=3x on [0,2].|2√10|6|√10|The constant length integrand is √(1+9).
Find the length of y=5 on [1,4].|3|5|15|The derivative is zero, so length equals interval width.
Can arc length be negative?|No|Yes if f′<0|Yes if f<0|The length integrand is nonnegative.
Find the length of y=x on [0,1].|√2|1|2|Integrate the constant √(1+1).
@9.1
If x=t² and y=t³, find dy/dx at t=1.|3/2|2/3|3|Divide 3t² by 2t.
For x=cos t,y=sin t, find slope at t=π/4.|−1|1|0|The ratio is cos t/(−sin t).
With x′≠0, a horizontal tangent requires…|y′=0|x′=0|y=0|The dy/dx numerator must vanish.
If x′=0 and y′≠0 at a regular point, the tangent is…|Vertical|Horizontal|Slope 1|Motion has only a vertical component there.
If x′ and y′ both vanish, what should you do?|Analyze further|Automatically declare a vertical tangent|Automatically declare slope zero|The ratio 0/0 does not determine the tangent.
@9.2
If x=t²,y=t³ with t>0, find d²y/dx².|3/(4t)|3/2|3|Differentiate slope 3t/2, then divide by 2t.
Which is the parametric second derivative formula?|[d/dt(dy/dx)]/(dx/dt)|(d²y/dt²)/(d²x/dt²)|d/dt(dy/dx) alone|Converting the derivative to x requires division by dx/dt.
If x=t,y=t², find d²y/dx².|2|2t|1|Here x′=1 and the slope is 2t.
For x=t²,y=t³ at t=1, the graph is locally…|Concave up|Concave down|Linear|The second derivative is 3/4>0.
If d/dt(dy/dx)=6 and dx/dt=2, find d²y/dx².|3|12|6|Divide the parameter derivative by x′.
@9.3
For x=3t,y=4t on [0,2], find arc length.|10|5|14|Speed is √(9+16)=5 for two time units.
What is the parametric arc-length integrand?|√((x′)²+(y′)²)|√(x²+y²)|x′+y′|Use the magnitude of the velocity vector.
For x=cos t,y=sin t on [0,2π], find length.|2π|π|0|The curve has unit speed around one full circle.
If the same circle is traced twice, the path length is…|Twice one circumference|One circumference|Zero|Path length counts retracing.
For x=t,y=0 on [−1,2], find path length.|3|1|2|The speed is 1 across an interval of length 3.
@9.4
Differentiate r(t)=⟨t²,sin t⟩.|⟨2t,cos t⟩|⟨2t,−cos t⟩|2t+cos t|Differentiate each coordinate independently.
For r(t)=⟨t²,t³⟩, find acceleration.|⟨2,6t⟩|⟨2t,3t²⟩|⟨4t,9t²⟩|Acceleration is the second vector derivative.
If velocity is ⟨3,4⟩, is speed a vector?|No, speed is the scalar 5|Yes, speed is ⟨3,4⟩|No, speed is 7|Speed is velocity's magnitude.
Differentiate ⟨e^t,ln t⟩ for t>0.|⟨e^t,1/t⟩|⟨te^(t−1),1/t⟩|⟨e^t,t⟩|Apply each scalar derivative rule componentwise.
For r(t)=⟨cos t,sin t⟩, find velocity at t=0.|⟨0,1⟩|⟨1,0⟩|⟨0,0⟩|The derivative is ⟨−sin t,cos t⟩.
@9.5
Find ∫⟨2t,3⟩dt.|⟨t²+C₁,3t+C₂⟩|⟨2t²+C,3t+C⟩|t²+3t+C|Each component has its own integration constant.
v(t)=⟨2,−1⟩ and r(0)=⟨3,4⟩. Find r(2).|⟨7,2⟩|⟨4,−2⟩|⟨5,3⟩|Add the component displacements ⟨4,−2⟩.
Evaluate ∫₀¹ ⟨t,t²⟩dt.|⟨1/2,1/3⟩|⟨1,1⟩|5/6|A vector integral returns the two scalar integrals.
Why are two constants needed in a planar vector antiderivative?|The two initial coordinates can vary independently|Both constants must always be equal|One is a rounding error|Each component's antiderivative has an independent constant.
If acceleration is ⟨0,2⟩ and v(0)=⟨1,0⟩, then v(t)=…|⟨1,2t⟩|⟨t,2⟩|⟨0,t²⟩|Integrate acceleration and apply the velocity initial value.
@9.6
Velocity is ⟨−3,4⟩. Find speed.|5|1|−5|Take the Euclidean magnitude.
A particle returns to its start after traveling around a circle. Its displacement is…|The zero vector|The circumference|Its total distance vector|Displacement depends only on the endpoints.
Which integral gives total planar distance?|∫√(vₓ²+vᵧ²)dt|Magnitude of ∫v dt in every case|∫(vₓ+vᵧ)dt|Integrate speed rather than net displacement.
If r(t)=⟨t,t²⟩, find speed at t=1.|√5|3|2|Velocity is ⟨1,2⟩ at that instant.
With r(0)=⟨2,3⟩ and displacement ⟨−1,4⟩, find final position.|⟨1,7⟩|⟨−1,4⟩|⟨3,−1⟩|Add displacement to the initial position.
@9.7
For r=2, find dy/dx at θ=π/4.|−1|1|0|With r′=0, the ratio is cos θ/(−sin θ).
If x=r cos θ, what is dx/dθ?|r′ cos θ−r sin θ|r′ cos θ|r′ sin θ+r cos θ|Apply the product rule to r and cosine.
If y=r sin θ, what is dy/dθ?|r′ sin θ+r cos θ|r′ sin θ−r cos θ|r cos θ only|Apply the product rule to r and sine.
Does dr/dθ generally equal dy/dx?|No|Yes|Only because both are derivatives|One is radial change; the other is Cartesian slope.
For r=2, the tangent at θ=0 is…|Vertical|Horizontal|Slope 1|dx/dθ=0 and dy/dθ=2 there.
@9.8
Find the area enclosed by r=2 over one full trace.|4π|2π|8π|Use one half times ∫₀^(2π)4 dθ.
What factor appears in the polar area formula?|1/2|2|π for every integrand|A sector's area is half radius squared times angle.
For r=2 and 0≤θ≤π/2, find sector area.|π|2π|π/2|The sector is one quarter of a radius-2 disk.
Why check a rose curve's tracing interval?|To avoid counting loops more than once|To ensure r is always positive|To make the derivative zero|The integral counts whatever region is traced over its bounds.
For r=cos θ, what bounds trace its circle once?|−π/2 to π/2|0 to 2π without double counting|0 to π/4|This interval traces the radius-1/2 circle once.
@9.9
Between r=3 and r=1 over 0≤θ≤π/2, find area.|2π|π|4π|Use (1/2)(9−1)(π/2).
Which integrand describes a correctly ordered polar gap?|(R²−r²)/2|(R−r)²/2|R−r|Subtract sector areas, including the one-half factor.
If outer and inner radial boundaries exchange, what should you do?|Split the angular interval|Keep the original subtraction everywhere|Add both squared radii|Each piece needs correct radial ordering.
Where do r=1 and r=2 cos θ have equal positive radii?|θ=±π/3 modulo 2π|θ=±π/2 modulo 2π|θ=0 only|Solve cos θ=1/2.
Can solving r₁(θ)=r₂(θ) alone miss a polar intersection?|Yes|No|Only if both radii are constant|The origin and alternate-angle representations need attention.
`;
