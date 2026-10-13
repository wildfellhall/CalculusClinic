export default String.raw`
@10.1
1|A series has partial sums Sₙ=5−3/(n+1). Find its sum.|5|2|3|The series sum is the limit of its partial sums; 3/(n+1) tends to zero.
9|A series has partial sums Sₙ=2n/(n+1). Find its sum.|2|0|Diverges|Divide numerator and denominator by n to get a limit of 2.
@10.2
2|Find the sum of Σ from n=0 to ∞ of 4(−1/3)^n.|3|6|Diverges|The ratio has magnitude less than 1, so the sum is 4/(1+1/3)=3.
@10.3
1|Calculate the term limit for Σ from n=1 to ∞ of (5n−1)/(n+2), then decide whether the series converges.|Limit 5; diverges|Limit 0; converges|Limit 5; converges|The term limit is the leading-coefficient ratio 5, not zero, so the series diverges.
2|For Σ from n=1 to ∞ of n/(n²+1), find the term limit and the conclusion of the nth-term test alone.|Limit 0; inconclusive|Limit 0; converges|Limit 1; diverges|The terms tend to zero, which is necessary but not sufficient for convergence.
8|Apply the nth-term test to Σ from n=1 to ∞ of (−1)^n(2+1/n).|Diverges; the terms have no limit|Converges; signs alternate|Inconclusive; the terms tend to zero|Even and odd terms approach 2 and −2, so the terms do not tend to zero.
10|Apply the nth-term test to Σ from n=1 to ∞ of (3n²+1)/(2n²−1).|Diverges; term limit 3/2|Converges; term limit 3/2|Inconclusive; term limit 0|Divide by n² to find term limit 3/2, which forces divergence.
@10.4
1|Use the integral test on Σ from n=1 to ∞ of 1/(n+2)². Give the test integral's value and conclusion.|Integral 1/3; series converges|Integral 1/3; series sum is 1/3|Integral diverges; series diverges|The positive continuous decreasing function 1/(x+2)² has integral 1/3 on [1,∞). This settles convergence, not the sum.
3|For Σ from n=1 to ∞ of 1/n², bound the remainder after 10 terms using integrals.|1/11≤remainder≤1/10|Remainder=1/10|1/10≤remainder≤1/9|For a positive decreasing function, the tail lies between integrals from 11 and 10 to infinity, equal to 1/11 and 1/10.
5|Use the integral test to classify 1000+Σ from n=2 to ∞ of 1/n².|Converges|Diverges because of 1000|Diverges because terms are positive|The tail integral of x^(−2) is finite; adding a finite initial term cannot change convergence.
8|Use the integral test to classify Σ from n=2 to ∞ of (ln n)/n².|Converges; test integral (ln 2+1)/2|Diverges; test integral infinite|Converges; test integral 0|The function is positive and decreasing for x≥2. Integration by parts gives ∫₂^∞ (ln x)/x² dx=(ln 2+1)/2.
9|Evaluate ∫₁^∞ 1/√x dx to classify Σ from n=1 to ∞ of 1/√n.|Integral and series diverge|Both converge to 2|Integral converges, series diverges|The antiderivative 2√x grows without bound; the positive decreasing integrand meets the test conditions.
@10.5
4|For which real k does Σ from n=1 to ∞ of 1/n^(2k−1) converge?|k>1|k>0|k≥1|A p-series requires 2k−1>1, giving k>1; equality is the divergent harmonic case.
@10.6
1|Use direct comparison to classify Σ from n=1 to ∞ of 1/(n²+5).|Converges by comparison with 1/n²|Diverges by comparison with 1/n|Converges because terms tend to zero|The terms are positive and no larger than those of the convergent p-series Σ1/n².
2|Use direct comparison to classify Σ from n=2 to ∞ of 1/(n−1).|Diverges since 1/(n−1)≥1/n|Converges since terms tend to zero|Converges by comparison with 1/n²|Its positive terms exceed harmonic terms, so the series diverges.
3|For aₙ=(3n+2)/(n³+1) and bₙ=1/n², calculate lim aₙ/bₙ and classify Σaₙ.|Limit 3; converges|Limit 0; diverges|Limit 3; diverges|The quotient is (3n³+2n²)/(n³+1), which tends to 3. The comparison p-series converges.
8|Classify Σ from n=1 to ∞ of 1/(n²+n) by comparison with 1/n².|Converges|Diverges|Cannot be decided by this comparison|The positive terms are at most 1/n², whose series converges.
@10.7
2|Classify Σ from n=1 to ∞ of (−1)^(n+1)/(2n+1) using the alternating series test.|Converges|Diverges|The test fails because terms are negative|The positive magnitudes 1/(2n+1) decrease to zero.
5|Classify Σ from n=1 to ∞ of (−1)^n(1+1/n).|Diverges|Converges by alternating series test|Converges absolutely|The magnitudes approach 1, so the signed terms do not tend to zero.
9|For n≥2, test Σ (−1)^n/(n−1).|Converges conditionally|Diverges because n starts at 2|Converges absolutely|The magnitudes 1/(n−1) decrease to zero, but their harmonic series diverges.
@10.8
1|Use the ratio test on Σ from n=1 to ∞ of n/3^n. State the limit and result.|L=1/3; converges absolutely|L=3; diverges|L=1; inconclusive|The successive absolute ratio is (n+1)/(3n), which tends to 1/3.
2|Use the ratio test on Σ from n=1 to ∞ of 2^n/n. State the limit and result.|L=2; diverges|L=1/2; converges|L=1; inconclusive|The ratio is 2n/(n+1), which tends to 2>1.
3|Calculate the ratio-test limit for Σ from n=1 to ∞ of 1/n².|1; the ratio test is inconclusive|0; converges|2; diverges|The ratio is n²/(n+1)² and tends to 1. A different test is needed.
@10.9
3|Classify Σ from n=1 to ∞ of (−1)^n/(n²+1).|Absolutely convergent|Conditionally convergent|Divergent|The absolute terms are positive and bounded above by 1/n², so the absolute series converges.
4|Classify Σ from n=2 to ∞ of (−1)^n/ln n.|Conditionally convergent|Absolutely convergent|Divergent|The magnitudes decrease to zero, but 1/ln n≥1/n for n≥2, so the absolute series diverges.
5|Classify Σ from n=1 to ∞ of 1/(n²+2n).|Absolutely convergent|Conditionally convergent|Divergent|All terms are positive and no larger than 1/n². Its convergence is therefore also absolute convergence.
8|Classify Σ from n=1 to ∞ of (−1)^n n/(n²+1).|Conditionally convergent|Absolutely convergent|Divergent|The magnitudes eventually decrease to zero, but their limit comparison with 1/n has ratio 1, so the absolute series diverges.
9|Classify Σ from n=0 to ∞ of (−2)^n/n!.|Absolutely convergent|Conditionally convergent|Divergent|The absolute successive ratio is 2/(n+1), whose limit is zero.
@10.10
3|For the alternating harmonic series 1−1/2+1/3−1/4+…, calculate S₄ and determine whether it overestimates or underestimates the sum.|7/12; underestimate|7/12; overestimate|5/6; underestimate|The first four terms sum to 7/12. The next term is positive and bounds the positive remainder.
4|For 1−1/2+1/3−…, find the smallest N for which the alternating bound guarantees error at most 0.01 after N terms.|99|100|98|The bound is 1/(N+1)≤1/100, so N+1≥100.
8|For Σ from n=1 to ∞ of (−1)^(n+1)/n², find the smallest N guaranteeing error at most 0.01 after N terms.|9|10|99|Require 1/(N+1)²≤1/100, giving N+1≥10.
1|For Σ from n=1 to ∞ of (−1)^(n+1)/n³, bound the error after 4 terms.|At most 1/125|At most 1/64|At most 1/16|The decreasing magnitudes tend to zero, so the error is at most the first omitted magnitude, 1/5³.
5|For Σ from n=1 to ∞ of (−1)^(n+1)/2^n, what is the smallest number of terms ensuring error at most 1/64?|5|6|4|The next-term bound is 1/2^(N+1). Require N+1≥6, giving N≥5.
@10.11
3|Given f(2)=1, f′(2)=3 and f″(2)=8, find its quadratic Taylor polynomial at 2.|1+3(x−2)+4(x−2)²|1+3(x−2)+8(x−2)²|1+6(x−2)+4(x−2)²|Divide the second derivative by 2! to obtain the quadratic coefficient 4.
4|Use the degree-one Taylor polynomial for ln x at x=1 to estimate ln(1.2).|0.2|1.2|0.182|The value is ln 1=0 and derivative is 1, so the linear polynomial is x−1.
@10.12
1|For a degree-two Taylor approximation centered at 1, suppose abs(f‴(t))≤12 for 1≤t≤1.5. Bound the error at 1.5.|1/4|3/2|1/2|Use M abs(x−a)³/3!=12(0.5)³/6=1/4.
3|For e^x on [0,0.2], use M=e^0.2 to bound the degree-one Maclaurin error at 0.2.|0.02e^0.2|0.2e^0.2|0.04e^0.2|The second derivative is e^x and its maximum on the interval is e^0.2. Multiply by 0.2²/2.
5|For the degree-one Maclaurin approximation to e^0.5, use the maximum of f″ on [0,0.5] to give a Lagrange bound.|e^0.5/8|1/8|e^0.5/2|The maximum derivative is e^0.5; the distance factor is 0.5²/2=1/8.
9|A degree-four Taylor polynomial is centered at 2. If abs(f⁽⁵⁾)≤120 between 2 and 2.1, bound its error at 2.1.|0.00001|0.0001|0.0012|Use 120(0.1)⁵/5!=0.00001.
10|An approximation gives f(1.2)≈3.10 with a valid error bound of 0.004. Give a guaranteed interval for f(1.2).|[3.096,3.104]|[3.10,3.104]|[3.06,3.14]|Subtract and add the absolute error bound to the approximation.
@10.13
3|Find the interval of convergence of Σ from n=1 to ∞ of (x−1)^n/n.|[0,2)|(0,2)|[0,2]|The radius is 1. At x=0 the alternating harmonic series converges; at x=2 the harmonic series diverges.
@10.14
1|Find the coefficient of x³ in the Maclaurin series of e^(2x).|4/3|1/6|8|Substitute 2x into the exponential series: the coefficient is 2³/3!=4/3.
2|Find the first three nonzero terms of the Maclaurin series of cos(2x).|1−2x²+(2/3)x⁴|1−x²/2+x⁴/24|1−2x²+(4/3)x⁴|Substitute 2x into 1−u²/2!+u⁴/4!.
3|Write the terms through x³ in the Maclaurin expansion of 1/(1−3x).|1+3x+9x²+27x³|1+3x+6x²+9x³|1−3x+9x²−27x³|Use the geometric series with ratio 3x, valid for abs(x)<1/3.
4|The Taylor remainder for a function at x=0.5 satisfies abs(Rₙ)≤(0.5)^(n+1). Find its limit as n→∞.|0|1/2|1|The geometric bound tends to zero, so the remainder tends to zero and the series represents the function there.
5|Find the coefficient of x⁵ in the Maclaurin series of sin(2x).|4/15|1/120|−4/15|The fifth-power term is (2x)⁵/5!, giving 32/120=4/15.
9|Given f(3)=7 and f′(3)=−2, write the constant and linear terms of the Taylor series centered at 3.|7−2(x−3)|7−2x|3−2(x−7)|Taylor terms are f(3)+f′(3)(x−3).
10|Find the coefficient of x⁴ in the Maclaurin series of 3cos x.|1/8|1/24|−1/8|Multiply the cosine coefficient 1/4!=1/24 by 3.
@10.15
4|Integrate Σ from n=0 to ∞ of x^n from 0 to x. Find the interval of convergence of the resulting series Σ x^(n+1)/(n+1).|[−1,1)|(−1,1)|[−1,1]|The radius stays 1, but endpoints must be tested: −1 gives alternating harmonic convergence and 1 gives harmonic divergence.
`;
