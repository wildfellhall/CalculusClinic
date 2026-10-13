// Slot | problem | correct answer | two distractors | worked explanation.
// These replace recall items; earlier item identities remain in the archive.
export default String.raw`
@MATH_001
8|A warehouse count changes from 4070 to 4700. How much greater is the new count?|630|6300|70|Subtract 4070 from 4700, keeping the place values aligned: 630.
@MATH_005
2|Five meters of ribbon are shared equally among four people. How many meters does each receive?|1.25|0.8|4.5|The share is 5/4 meters. Divide 5 by 4 to get 1.25.
1|A ribbon is cut into 8 equal pieces. Three pieces measure 27 cm altogether. How long was the whole ribbon?|72 cm|24 cm|216 cm|One eighth is 27/3=9 cm, so the whole is 8×9=72 cm.
6|One of 9 equal strips of a 45 cm ribbon is used. How long is the used strip?|5 cm|9 cm|4 cm|One ninth of 45 is 45/9=5 cm.
10|A cake weighs 900 g. One piece weighs 150 g. What fraction of the cake is that piece?|1/6|1/3|1/9|The fraction is 150/900=1/6; the number of other pieces is irrelevant.
@MATH_006
8|Fill the blank: 14/21=2/x.|3|7|6|Divide numerator and denominator by 7 to get 2/3, so x=3.
9|A recipe uses 5/7 cup. Express this amount in twenty-eighths of a cup.|20/28|5/28|24/28|Multiply numerator and denominator by 4: 5/7=20/28.
@MATH_007
9|A walker covers 1/2 mile, then another 1/3 mile. How far did they walk?|5/6 mile|2/5 mile|1/6 mile|Convert to sixths: 3/6+2/6=5/6.
@MATH_008
7|Solve (7/4)x=1.|4/7|7/4|3/4|Multiply both sides by 4/7 to obtain x=4/7.
9|A recipe uses 8 cups. A batch is scaled to 3/4 of the recipe. How many cups are needed?|6|10|32/3|Compute 8×3/4=6 cups.
@MATH_016
9|Adults and children are in a 7:3 ratio. There are 42 adults. How many children are there?|18|14|98|The scale factor is 42/7=6, so there are 3×6=18 children.
10|A paint mix uses red and blue in ratio 2:3. How much blue accompanies 4 liters of red?|6 liters|5 liters|8 liters|Doubling the red amount requires doubling the blue amount: 3×2=6.
@MATH_011
10|Write 7/8 as a decimal.|0.875|0.78|0.87|Multiply numerator and denominator by 125 to get 875/1000=0.875.
@MATH_017
9|A 2.5 kg bag costs 15 dollars. Find its price per kilogram.|6 dollars per kg|37.50 dollars per kg|0.167 dollars per kg|Divide cost by mass: 15/2.5=6 dollars per kilogram.
@MATH_018
7|A scale drawing has width 6 cm and height 9 cm. An enlargement has width 10 cm. Find its height.|15 cm|13 cm|18 cm|Multiply every length by 10/6: 9×10/6=15.
8|Solve (x+1)/6=5/3.|9|10|4|Multiplying both sides by 6 gives x+1=10, so x=9.
@MATH_019
6|A survey has 200 responses. If 12% select option A, how many select it?|24|12|166.7|Compute 0.12×200=24.
@MATH_021
3|A square has side length 4 cm. Calculate its area using a power.|16 cm²|8 cm²|64 cm²|The area is 4²=4×4=16 square centimeters.
@MATH_024
1|Use a convenient ordering to calculate 37+18+63.|118|108|128|Group 37+63=100, then add 18 to get 118.
2|Compute 25×3×4 by regrouping the factors.|300|75|1200|Group 25×4=100, then multiply by 3.
3|Calculate (8−3)−(3−8).|10|0|−10|The two differences are 5 and −5; 5−(−5)=10.
6|Calculate (8÷4)÷(4÷8).|4|1|1/4|The inner quotients are 2 and 1/2, so 2÷(1/2)=4.
7|A shipment has 7 boxes, each with 25 packs of 4 cards. How many cards are there?|700|175|2800|Regroup the product as 7×(25×4)=700.
8|Calculate 125×16×8.|16000|2000|1600|Reorder and group 125×8=1000, then multiply by 16.
10|Calculate 3.7+2.6+6.3+7.4 by pairing convenient addends.|20|19|21|The pairs 3.7+6.3 and 2.6+7.4 each equal 10.
@MATH_025
9|Use distribution to calculate 9×102.|918|908|911|Compute 9×100+9×2=900+18=918.
10|A price of 3(x+2) dollars is incorrectly calculated as 3x+2. By how many dollars is it too low?|4|6|2|The correct expression is 3x+6, which exceeds 3x+2 by 4.
@MATH_026
3|Fill the blank: 12+8=5×x.|4|20|5|The left side is 20, so 5x=20 and x=4.
4|A balanced scale has 3 identical blocks and 2 kg on one side, and 17 kg on the other. Find one block's mass.|5 kg|19/3 kg|15 kg|The blocks together weigh 17−2=15 kg; divide by 3.
6|Given a=b and b=4+7, calculate 2a.|22|11|18|Both a and b equal 11, so 2a=22.
7|Given a=b+2, b=c, and c=5, find a.|7|5|3|Substitute c=5 into b=c, then calculate a=5+2.
9|Replace x so the chain 4+5=3x=11−2 is valid.|3|9|11/3|The first and last expressions both equal 9, so 3x=9.
10|Find the missing value: 14−6=3+x.|5|8|11|The left side is 8, so x=8−3=5.
@MATH_027
4|A ride costs 4 dollars per mile plus a 9-dollar fee. How much does a 6-mile ride cost?|33 dollars|78 dollars|24 dollars|The expression is 4m+9. Substitute m=6 to get 33.
5|A rectangle has width w and length w+2. Write its perimeter in terms of w.|4w+4|2w+2|w²+2w|Add two widths and two lengths: 2w+2(w+2)=4w+4.
10|Two quantities satisfy a+b=12 and a=b. Find each quantity.|6|12|24|Replace b by a to get 2a=12, so both are 6.
@MATH_028
1|Combine only like terms in 3x²−4x+7+2x²+5x−1.|5x²+x+6|6x²+6|5x²−9x+6|Group squared terms, linear terms, and constants: 5x²+x+6.
2|Find k so that kx+8 equals −5x+8 for every x.|−5|5|8|Matching the coefficients of x gives k=−5.
3|A cube has side length 2x. Write its volume as a single term.|8x³|6x³|8x²|Cubing the entire side gives (2x)³=8x³.
4|Subtract 7x from 4x+3x².|3x²−3x|0|−3x³|Only the linear terms combine: 4x−7x=−3x.
5|Expand the product of the factors 2 and (x+3).|2x+6|2x+3|x+6|Multiply 2 by both terms inside the grouping.
6|Two squares have sides x and x+1. Write their total area in expanded form.|2x²+2x+1|2x²+1|4x²+4x+1|Add x²+(x+1)² and combine like terms.
7|Evaluate 2x²+3x−9 at x=0.|−9|9|−4|The variable terms become zero, leaving −9.
8|Evaluate (x+1)/(x−2) at x=5.|2|6|1/2|Calculate the numerator and denominator first: 6/3=2.
9|How much does x+4 increase when x increases by 7?|7|11|28|Subtract (x+4) from (x+7+4); the difference is 7.
10|A square has side x−2. Three such squares have what combined area in expanded form?|3x²−12x+12|3x²−12|9x²−36x+36|Expand 3(x−2)²=3(x²−4x+4).
@MATH_031
3|A number tripled and then increased by 2 equals 11. Find the number.|3|13/3|9|Translate to 3x+2=11, then solve 3x=9.
8|Solve 4(x−2)=4x−8 over the real numbers.|All real x|No solution|x=2 only|Both sides expand to 4x−8, so every real input satisfies the equation.
9|Which candidate satisfies 3x−7=2x+5: 5, 7, or 12?|12|5|7|Subtract 2x and add 7 to obtain x=12; both sides then equal 29.
@MATH_032
1|Solve x+5=12 and check the result.|x=7|x=17|x=−7|Subtract 5 from both sides: x=7; 7+5=12.
2|Solve 4x=20.|5|80|16|Divide both sides by 4 to obtain 5.
3|Two containers have equal masses. One weighs x+7 kg and the other 19 kg. Find x.|12|26|7|Subtract the same 7 kg from both sides of x+7=19.
4|Solve 0x=5.|No solution|x=0|x=5|For every real x, 0x=0, which cannot equal 5.
6|Solve x−2=5.|7|3|−3|Add 2 to both sides: x=7.
8|Solve −x=−9.|9|−9|0|Multiply both sides by −1 to get x=9.
9|Solve x(x−1)=0 without losing a solution.|x=0 or x=1|x=1 only|x=0 only|Either factor can be zero. Dividing by x would lose the zero solution.
10|If a=b and b=6, solve a+x=14.|8|20|6|Replace a by 6, then subtract 6 from both sides.
@MATH_033
1|After adding 9 to a number, the result is 14. Find the number.|5|23|−5|Undo adding 9 by subtracting it: 14−9=5.
2|Four times a number is 30. Find the number.|7.5|120|26|Undo multiplication by 4: 30/4=7.5.
3|A number is doubled, then 3 is added, giving 19. Find the number.|8|11|16|First subtract 3 to obtain 16, then divide by 2.
5|Subtracting −2 from a number gives 7. Find the number.|5|9|−5|x−(−2)=x+2=7, so x=5.
6|A machine sends x to 3x−4. What input produces 20?|8|16/3|64|Undo subtraction, then multiplication: (20+4)/3=8.
7|A number is multiplied by 7, then divided by 2, giving 21. Find the number.|6|3|73.5|Reverse the order: 21×2/7=6.
9|A number divided by 1/2 gives 18. Find the number.|9|36|17.5|Multiply both sides by 1/2: x=9.
10|Solve x²=49 for all real x.|x=−7 or x=7|x=7 only|x=−7 only|Both 7 and −7 square to 49; taking a principal square root alone loses one solution.
@MATH_035
2|A lift can carry at most 500 kg. Cargo already weighs 325 kg. What additional mass m is allowed?|0≤m≤175|m≥175|0≤m<175|The constraint 325+m≤500 gives m≤175; a mass is nonnegative.
3|A freezer must stay below −2°C. Its current temperature is 3°C. What decrease d is required?|d>5|d<5|d≥−5|Require 3−d<−2, which simplifies to d>5.
8|A fee is 3 dollars plus 2 dollars per hour. Write the constraint for a total of at most 12 dollars.|3+2h≤12|3+2h≥12|2h≤12|The entire fee must be no more than 12, so 3+2h≤12.
9|A trip requires at least 18 liters. There are 7 liters in the tank. How much fuel f must be added?|f≥11|f≤11|f≥25|Solve 7+f≥18 to get f≥11.
@MATH_037
1|Start at (−3,4), move 5 units right and 2 down. Find the endpoint.|(2,2)|(−8,2)|(2,6)|Add 5 to the first coordinate and subtract 2 from the second.
2|Reflect (2,−5) across the y-axis.|(−2,−5)|(2,5)|(−2,5)|A y-axis reflection reverses the x-coordinate and keeps y unchanged.
8|Move 4 units left and 6 units up from (2,−3). Find the point.|(−2,3)|(6,3)|(−2,−9)|Calculate (2−4,−3+6)=(−2,3).
9|A point moves from (−4,0) to the origin. What horizontal displacement occurs?|4|−4|0|Subtract initial x from final x: 0−(−4)=4.
@MATH_038
1|A tank contains 12 L at 2 minutes and 27 L at 5 minutes. How much does volume change over this interval?|15 L|39 L|5 L|Subtract the initial volume from the final volume: 27−12=15.
3|At constant speed a runner covers 150 m in 30 s. How far in 50 s?|250 m|170 m|90 m|The rate is 150/30=5 m/s, so the distance is 5×50=250 m.
7|A tank drains at 3 L/min. Its volume changes by −18 L. How much time passes?|6 min|54 min|−6 min|Divide the volume decrease by the draining rate: 18/3=6 minutes.
10|A table lists time in hours and distance in kilometers: (1,12),(3,36). Find the average speed in meters per hour.|12000 m/hour|12 m/hour|1200 m/hour|The rate is (36−12)/(3−1)=12 km/hour, or 12000 m/hour.
@MATH_039
4|A direct-variation model contains (4,14). Find its output at x=10.|35|20|140|The constant is 14/4=3.5, so y=3.5×10=35.
9|A taxi costs 2x+5 dollars for x miles. Find the cost per mile at 5 miles.|3 dollars per mile|2 dollars per mile|7 dollars per mile|The total cost is 15 dollars. Divide by 5 miles to obtain 3 dollars per mile.
@MATH_040
4|A linear table has y=−1 at x=0 and y=7 at x=2. Find y at x=5.|19|20|14|The slope is (7+1)/2=4, so y=4x−1 and y(5)=19.
6|A line has slope 3 and passes through (2,11). Find its y-intercept.|5|17|−5|Substitute into 11=3×2+b, giving b=5.
9|A plan costs 8 dollars plus 2 dollars per hour. For how many hours is the cost 22 dollars?|7|11|15|Solve 8+2h=22, so h=7.
10|Fill the blank so the table is linear: x: 0,2,4; y: 3,7,blank.|11|14|9|Equal input increases must have equal output increases; add 4 to 7.
@MATH_041
3|Find the slope through (−2,5) and (7,5).|0|9|Undefined|The change in y is zero and the change in x is 9, so the slope is 0/9=0.
4|Find the slope through (3,−2) and (3,6).|Undefined|0|8|The change in x is zero. The quotient 8/0 is undefined.
9|Find the slope through (5,−1) and (−1,11).|−2|2|−1/2|Use matching orders: (11−(−1))/(−1−5)=12/(−6)=−2.
@MATH_043
2|For the relation x=y², find all y-values paired with x=9.|−3 and 3|3 only|−9 and 9|Solving y²=9 gives two outputs, so this unrestricted relation is not a function of x.
3|For f(x)=(x−1)², find both inputs that give output 9.|−2 and 4|−3 and 3|4 only|Set (x−1)²=9, giving x−1=±3 and x=−2 or 4.
7|The pairs (1,4),(2,7),(1,k) must define a function. Find k.|4|7|1|Input 1 already has output 4, so its repeated output must also be 4.
9|The relation x²+y²=25 contains x=3. Find both corresponding y-values.|−4 and 4|4 only|−16 and 16|Substitute x=3 to get y²=16, so y=±4; a vertical line meets it twice.
@MATH_044
6|A function satisfies f(6)=10 and f(2)=3. Calculate 2f(6)−f(2).|17|14|7|Substitute the function values: 2×10−3=17.
@MATH_045
4|A bill follows C=15+4n. If the total is 47 dollars, how many items were purchased?|8|11.75|32|Solve 15+4n=47, giving 4n=32 and n=8.
5|Distance is d=60t miles, with t in hours. How far is traveled in 45 minutes?|45 miles|2700 miles|0.75 mile|Convert 45 minutes to 0.75 hour, then calculate 60×0.75.
9|A passenger estimate is P(t)=20−4t. For what nonnegative times is the estimate nonnegative?|0≤t≤5|t≥5|0≤t≤20|Solve 20−4t≥0 and combine with t≥0.
@MATH_046
3|Find a pair satisfying both x+y=10 and x−y=4.|(7,3)|(6,4)|(3,7)|Adding the equations gives 2x=14, then y=3.
4|Solve the system y=2x+3 and y=2x−1.|No solution|(0,3)|Infinitely many solutions|Equating the expressions yields 3=−1, a contradiction.
5|Find y when x=3 in the system y=2x+1 and 2y=4x+2.|7|5|No solution|The second equation is twice the first. At x=3, both give y=7.
8|A candidate (2,k) must solve x+y=7 and 2x−y=−1. Find k.|5|3|−5|The first equation gives y=5; the second checks as 4−5=−1.
@MATH_047
5|Solve 3x+2y=7 and x−2y=5.|(3,−1)|(2,1)|(3,1)|Add to get 4x=12, then substitute x=3 to find y=−1.
6|Solve x+2y=3 and 2x+4y=11.|No solution|(3,0)|Infinitely many solutions|Twice the first left side would require the right side to be 6, not 11.
7|Solve x+2y=3 and 2x+4y=6 for y in terms of x.|y=(3−x)/2|y=3−2x|No solution|The equations are equivalent; rearranging the first describes every shared point.
@MATH_048
2|One graphed line passes through (0,2),(2,4); another through (0,6),(2,4). Find their intersection.|(2,4)|(0,4)|(4,2)|The two lines share (2,4) and have different slopes, so it is their unique intersection.
5|Two straight-line graphs have values at x=1 of 2 and 3, and at x=2 of 4 and 3. Estimate the intersection by interpolation.|(1.5,3)|(1,2)|(2,3)|The first line rises from 2 to 4 while the second stays at 3, meeting halfway between 1 and 2.
8|The graphs of x+y=6 and 2x+2y=12 overlap. Find the point on both with x=4.|(4,2)|(4,8)|(4,−2)|Substitute x=4 into either equation; y=2.
9|The graphs y=x+100 and y=2x are viewed only for −10≤x≤10. Find the intersection that lies outside this window.|(100,200)|(−100,−200)|(0,100)|Solve x+100=2x to get x=100, then y=200.
10|Two costs are C=2h+14 and C=3h+6. Calculate the hours and cost at their graph intersection.|8 hours, 30 dollars|8 hours, 22 dollars|6 hours, 26 dollars|Equate the costs to obtain h=8, then substitute to obtain C=30.
`;
