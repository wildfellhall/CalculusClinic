export default String.raw`
@8.4
2|Find the area between y=x+3 and y=x on [0,4].|12|6|24|The upper-minus-lower height is constantly 3; integrate over width 4.
@8.5
1|Find the area between x=3y and x=y on 0≤y≤2 using horizontal slices.|4|2|8|The horizontal width is 2y. Its integral from 0 to 2 is 4.
3|The region between x=y² and x=4 has horizontal slices. Find its lower and upper y-bounds.|−2 and 2|0 and 4|−4 and 4|Solve y²=4 to find the intersections, giving y=±2.
5|Find the area enclosed by x=y² and x=y+2 using horizontal slices.|9/2|9|3/2|The intersections satisfy y²=y+2, so y=−1,2. Integrate y+2−y² between them to get 9/2.
@8.6
2|Find the area between y=x−1 and y=0 on [0,3].|5/2|3/2|9/2|Split at x=1. The two triangular areas are 1/2 and 2, giving 5/2.
3|For y=x on [−2,1], find both signed integral and total area to the x-axis.|Signed −3/2; area 5/2|Both −3/2|Signed 5/2; area 3/2|The signed integral is (1−4)/2=−3/2; the two unsigned triangles have areas 2 and 1/2.
5|Find the area between y=x² and y=2x on [0,3].|8/3|0|9|Split at x=2: ∫₀²(2x−x²)dx=4/3 and ∫₂³(x²−2x)dx=4/3. Add the unsigned areas to obtain 8/3.
@8.7
2|A solid has square sections with side 3−x on 0≤x≤3. Find its volume.|9|9/2|27|Integrate (3−x)² from 0 to 3, giving 9.
4|A solid extends 5 cm and has a constant rectangular cross section 2 cm by 3 cm. Find its volume.|30 cm³|30 cm²|10 cm³|The cross-sectional area is 6 cm²; multiplying by length gives 30 cm³.
5|Square slices perpendicular to the y-axis have side 2y for 0≤y≤1. Find the volume.|4/3|2/3|2|Integrate the slice area (2y)² with respect to y from 0 to 1.
8|Square cross sections have diagonal d(x)=2x on [0,3]. Calculate their volume.|18|36|9|A square with diagonal d has area d²/2. Integrate 2x² from 0 to 3.
@8.8
1|Semicircular cross sections have diameter 4x on 0≤x≤1. Find the volume.|2π/3|8π/3|π/3|The radius is 2x and the semicircle area is 2πx². Integrate on [0,1].
2|Equilateral triangle cross sections have side 2x on 0≤x≤1. Find the volume.|√3/3|√3|4√3/3|The area is (√3/4)(2x)²=√3 x²; integrate to get √3/3.
4|Isosceles right triangle cross sections have legs of length x on [0,2]. Find the volume.|4/3|8/3|2/3|Each area is x²/2. Integrate from 0 to 2.
5|Semicircular cross sections have diameter 6 cm throughout a length of 4 cm. Find the volume.|18π cm³|72π cm³|36π cm³|The radius is 3, area is 9π/2, and multiplying by length 4 gives 18π.
9|Semicircular cross sections have radius r(x)=x+1 on [0,1]. Calculate their volume.|7π/6|7π/24|7π/3|Integrate π(x+1)²/2 from 0 to 1, yielding (π/2)×7/3.
10|Isosceles right triangle cross sections have hypotenuse 2x on [0,3]. Find their volume.|9|18|36|The slice area is (2x)²/4=x², whose integral is 9.
@8.9
2|Rotate 0≤x≤2y, 0≤y≤1 around the y-axis. Find the volume.|4π/3|2π/3|4π|The horizontal disk radius is 2y, so integrate 4πy² with respect to y.
5|Rotate the region −x≤y≤0 for 0≤x≤2 about the x-axis. Find the volume.|8π/3|4π|−8π/3|The region reaches the axis, giving disks of radius x. Integrate πx² on [0,2].
9|Rotate 0≤y≤3x, 0≤x≤1 about the x-axis using disks. Find the volume.|3π|π|9π|The radius is 3x and the disk area is 9πx². Integrate from 0 to 1.
@8.10
2|Rotate 1≤y≤x+1 on 0≤x≤2 about y=1. Find the volume.|8π/3|26π/3|4π|The disk radius is (x+1)−1=x. Integrate πx² from 0 to 2.
4|Rotate 2≤y≤x+2 on 0≤x≤2 about y=2. Find the volume.|8π/3|56π/3|4π|Measure radius from the shifted axis: (x+2)−2=x. Integrate πx².
9|Rotate x²≤y≤4 on −2≤x≤2 about y=4. Give the volume integral.|π∫_(−2)^2 (4−x²)²dx|π∫_(−2)^2 x⁴dx|π∫_(−2)^2 (16−x⁴)dx|The disk radius is the distance from y=4 to y=x², namely 4−x²; square the entire radius.
@8.11
2|A washer has outer radius 4 cm and inner radius 2 cm. Calculate its area.|12π cm²|4π cm²|20π cm²|Subtract inner disk area from outer: π(16−4)=12π.
4|Rotate 2≤y≤5 on 0≤x≤3 about the x-axis. Find the volume.|63π|27π|87π|The radii are 5 and 2, so multiply π(25−4) by length 3.
10|Rotate the region between y=x and y=2 on 0≤x≤1 about the x-axis. Find its volume.|11π/3|−11π/3|π/3|The farther boundary has radius 2. Integrate π(4−x²) from 0 to 1.
@8.12
2|Rotate 1≤y≤3 on an x-interval of length 2 about y=5. Find the volume.|24π|12π|16π|The outer and inner radii are 4 and 2. Multiply washer area π(16−4) by 2.
4|Rotate 1≤y≤4 on 0≤x≤2 about y=6. Find the volume.|42π|−42π|18π|The lower boundary is farther from the axis: outer radius 5, inner radius 2. Volume is 2π(25−4).
8|Rotate x≤y≤2 on 0≤x≤1 about y=3. Find its volume.|16π/3|8π/3|−16π/3|The outer radius is 3−x and inner radius 1. Integrate π[(3−x)²−1] from 0 to 1.
@8.13
1|Find the length of y=4x−1 on [0,2].|2√17|8|√17|The derivative is 4, so the arc-length integrand is √17 over width 2.
4|Find the length of y=−3x on [−1,1].|2√10|−2√10|6|The integrand uses the squared derivative: √(1+9)=√10, which is positive.
9|Find the length of y=2x+1 on [1,4].|3√5|3|6|The constant derivative is 2; multiply √5 by the interval width 3.
10|Find the arc length of x=3y+2 for 0≤y≤2.|2√10|2√3|6|For integration in y, use √(1+(dx/dy)²)=√10 and multiply by 2.
@9.1
3|For x=t²+1 and y=t³−3t, find the parameters of horizontal tangents.|t=−1 and t=1|t=0 only|t=−√3 and t=√3|Set y′=3t²−3=0; at ±1 the derivative x′=2t is nonzero.
4|For x=t² and y=t+1, find the point with a vertical tangent.|(0,1)|(1,2)|(0,0)|At t=0, x′=0 and y′=1≠0. Substitute t=0 into the coordinates.
5|For x=t³ and y=2t³, find the tangent slope at t=0 despite both parameter derivatives vanishing.|2|0|Undefined|Eliminate t to obtain the straight line y=2x, whose tangent slope is 2.
@9.2
2|For x=2t and y=t⁴, find d²y/dx² at t=1.|3|6|12|First dy/dx=2t³. Differentiate with respect to t to get 6t², then divide again by dx/dt=2.
@9.3
2|For x=5t and y=12t on 0≤t≤3, calculate arc length.|39|51|13|The speed is √(25+144)=13; multiply by the parameter interval length 3.
4|For x=2cos t and y=2sin t on 0≤t≤4π, find total path length.|8π|4π|0|The constant speed is 2 and the interval has length 4π, tracing the circle twice.
@9.5
4|Find r(t) if r′(t)=⟨2t,4⟩ and r(0)=⟨3,−1⟩.|⟨t²+3,4t−1⟩|⟨t²−1,4t+3⟩|⟨2t+3,4t−1⟩|Integrate each component independently, then use the two initial coordinates for the constants.
@9.6
2|For r(t)=⟨2cos t,2sin t⟩ from t=0 to 2π, find both displacement and distance.|Displacement ⟨0,0⟩; distance 4π|Displacement ⟨0,0⟩; distance 0|Displacement ⟨4π,0⟩; distance 4π|The endpoints coincide, but speed is constantly 2 over time 2π.
3|A particle has v(t)=⟨6,8⟩ for 0≤t≤3. Find its total distance.|30|42|10|Integrate the constant speed √(36+64)=10 over 3 units of time.
@9.7
2|For r=2sin θ, find dx/dθ at θ=π/4.|0|2|√2|Using x=r cos θ, dx/dθ=2cos²θ−2sin²θ, which equals zero at π/4.
3|For r=1+cos θ, find dy/dθ at θ=π/2.|−1|1|0|Differentiate r sin θ to get −sin²θ+(1+cos θ)cos θ, then substitute.
4|For r=θ at θ=π/2, compute dr/dθ and dy/dx.|dr/dθ=1; dy/dx=−2/π|Both 1|dr/dθ=1; dy/dx=−π/2|The Cartesian slope is (sin θ+θcos θ)/(cos θ−θsin θ)=1/(−π/2).
@9.8
2|Find the area swept by r=4 for 0≤θ≤π/6.|4π/3|8π/3|2π/3|Integrate r²/2=8 over an angular width π/6.
4|One petal of r=3cos(2θ) is traced on [−π/4,π/4]. Find its area.|9π/8|9π/4|9π/16|Integrate (9/2)cos²(2θ) over the stated interval; the cosine-squared integral is π/4.
9|The curve r=−2 is traced for 0≤θ≤π/2. Find the swept area.|π|−π|2π|Polar area uses r²/2=2, even for a negative radius. Multiply by π/2.
@9.9
2|Find the area between r=4 and r=2 over 0≤θ≤π/3.|2π|4π|2π/3|Integrate (16−4)/2=6 over width π/3.
3|On 0≤θ≤π/2, r=2 and r=4cos θ exchange outer and inner roles. Find the angle at which to split the area integral.|π/3|π/6|π/4|Set 2=4cos θ, giving cos θ=1/2 and θ=π/3.
5|The curves r=2sin θ and r=2cos θ both pass through the origin at different angles. Find their nonzero intersection in Cartesian coordinates.|(1,1)|(2,2)|(√2,√2)|Equal positive radii occur at θ=π/4, r=√2. Convert using x=r cos θ,y=r sin θ.
9|Find the area inside both r=1 and r=2cos θ in the first quadrant.|π/3−√3/4|π/4|π/3+√3/4|The smaller radius is 1 on [0,π/3] and 2cos θ on [π/3,π/2]. Integrate the two squared radii with the factor 1/2.
`;
