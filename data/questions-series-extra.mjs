export default `
@10.1
Find lim as n→∞ of aₙ=(3n+1)/(n+2).|3|1/2|0|Divide numerator and denominator by n to obtain (3+1/n)/(1+2/n).
A series has partial sums Sₙ=2−1/2ⁿ for n≥1. What is its sum?|2|0|1/2|A series sum is the limit of its partial sums, and 1/2ⁿ tends to zero.
Find Σ from n=1 to ∞ of 1/[n(n+2)].|3/4|1/2|1|Write each term as (1/2)[1/n−1/(n+2)]; only the first two terms and a vanishing tail remain.
If the partial sums of a series grow without bound, what follows?|The series diverges|The terms must grow without bound|The series converges conditionally|Convergence requires the partial sums to approach a finite limit; individual terms may still tend to zero.
A series has S₄=9 and S₅=11. What is its fifth term?|2|11|20|A term equals the difference of successive partial sums: a₅=S₅−S₄.
@10.2
Find Σ from n=0 to ∞ of 5(−2/3)ⁿ.|3|15|−3|The first term is 5 and ratio is −2/3; use 5/[1−(−2/3)]=3.
Find Σ from n=2 to ∞ of (1/2)ⁿ.|1/2|1|2|The first included term is 1/4, so the sum is (1/4)/(1−1/2).
Does 4+6+9+13.5+… converge as a geometric series?|No; its common ratio is 3/2|Yes; its first term is finite|Yes; its common ratio is 2/3|The ratio of consecutive terms is greater than 1 in magnitude.
For which x does Σ from n=0 to ∞ of (3x)ⁿ converge?|−1/3<x<1/3|−3<x<3|−1/3≤x≤1/3|A nonzero geometric series requires abs(3x)<1; the endpoints do not converge.
Find the sum 6−2+2/3−2/9+…|9/2|9|4|The common ratio is −1/3; divide the first term 6 by 1+1/3.
@10.3
What does the nth-term test conclude for Σ from n=1 to ∞ of (2n+1)/(n+3)?|Divergence|Convergence to 2|Inconclusive|The terms tend to 2 instead of zero.
For Σ from n=1 to ∞ of sin(1/n), what does the nth-term test alone conclude?|Nothing decisive; the term limit is zero|Convergence|Divergence|Since sin(1/n) tends to zero, the test is inconclusive; another comparison is needed.
If Σaₙ converges, what must lim as n→∞ aₙ equal?|0|The sum of the series|1|Individual terms must approach zero as a necessary condition for series convergence.
For aₙ=(−1)ⁿ(1+1/n), what does the term test say about Σaₙ?|It diverges|It converges by alternating signs|The test proves absolute convergence|The terms have subsequences approaching 1 and −1 rather than a common zero limit.
A student concludes Σ1/n converges because 1/n→0. What is the logical error?|Treating a necessary condition as sufficient|Using the wrong limit, since 1/n→1|Assuming all positive series diverge|A zero term limit is required but does not establish convergence; the harmonic series diverges.
@10.4
Use the integral test to classify Σ from n=2 to ∞ of 1/(n ln n).|Diverges|Converges|The test cannot apply to logarithms|The positive decreasing extension has integral ln(ln x), which grows without bound.
For Σ from n=1 to ∞ of 1/n³, evaluate the corresponding integral ∫₁^∞ x^(−3)dx.|1/2|1/3|Diverges|The antiderivative −1/(2x²) has limit zero at infinity, giving 1/2.
A positive term formula becomes continuous and decreasing only for x≥10. Can the integral test still settle its series convergence?|Yes; the finite initial segment does not affect convergence|No; it must decrease starting at x=0|No; every term must equal the first term|The test can be applied to a tail after the hypotheses begin to hold.
If f is positive, continuous, and decreasing, and ∫₁^∞ f(x)dx diverges, what follows for Σ from n=1 to ∞ of f(n)?|It diverges|It has the same finite value as the integral|Nothing, even under these hypotheses|The integral test transfers divergence as well as convergence when its conditions hold.
For the series Σ1/n², how does ∫_N^∞ 1/x² dx bound the remainder after N terms?|It is an upper bound of 1/N|It is the exact remainder 1/N|It is a lower bound of 1/N|For a positive decreasing integrand, the tail rectangles starting at N+1 lie below the integral starting at N.
@10.5
Classify Σ from n=1 to ∞ of 1/n^(4/3).|Converges|Diverges|Conditionally converges|This positive p-series has p=4/3>1.
Classify Σ from n=1 to ∞ of n^(−0.9).|Diverges|Converges|Conditionally converges|Its denominator exponent is p=0.9, below the convergence threshold 1.
For a fixed ε>0, does Σ1/n^(1+ε) converge?|Yes, for every such ε|Only if ε>1|No, because the exponent is near 1|The exponent is strictly greater than 1, however small the positive ε.
Does multiplying the harmonic series by 0.001 make it converge?|No|Yes; its terms become sufficiently small|Only if the first term is omitted|A nonzero constant multiple of a divergent positive series still diverges.
Classify Σ from n=1 to ∞ of 1/∛(n²).|Diverges|Converges|Not a p-series|The cube root gives n^(2/3), so p=2/3≤1.
@10.6
For Σ from n=2 to ∞ of 1/(n²−1), what is the limit comparison with Σ1/n²?|Ratio limit 1, so it converges|Ratio limit 0, so it diverges|Ratio limit infinity, so it diverges|The ratio n²/(n²−1) tends to the positive finite value 1.
Classify Σ from n=1 to ∞ of (2n+1)/(n²+1) by limit comparison with 1/n.|Diverges|Converges|Conditionally converges|The ratio n(2n+1)/(n²+1) tends to 2, and the harmonic comparison diverges.
If 0≤aₙ≤bₙ and Σbₙ diverges, what can direct comparison alone conclude about Σaₙ?|Nothing decisive|It must diverge|It must converge|A smaller positive series may converge or diverge; this inequality with a divergent upper series is inconclusive.
Which direct comparison proves convergence of Σ from n=1 to ∞ of 1/(n²+n)?|0<1/(n²+n)≤1/n²|1/(n²+n)≤1/n with harmonic upper series|1/(n²+n)≥1/n|The convergent p-series 1/n² is a valid upper bound.
For aₙ=√(n²+1)/n³ and bₙ=1/n², find lim aₙ/bₙ.|1|0|∞|The ratio simplifies to √(n²+1)/n=√(1+1/n²).
@10.7
Does Σ from n=1 to ∞ of (−1)ⁿ/(n+2) converge by the alternating series test?|Yes|No; the denominator must be exactly n|No; the first term is negative|The positive magnitudes 1/(n+2) decrease to zero; the starting sign is irrelevant.
Why does the alternating series test not prove convergence of Σ(−1)ⁿ n/(n+1)?|The magnitudes approach 1 instead of 0|The signs do not alternate|All magnitudes are negative|The terms fail to approach zero, so the series actually diverges.
For n≥3, does Σ(−1)ⁿ(ln n)/n converge by the alternating test?|Yes|No; logarithms cannot be used in the test|No; the magnitudes approach 1|The magnitudes tend to zero and decrease for x>e since the derivative of ln x/x is (1−ln x)/x².
If an alternating series has decreasing positive magnitudes tending to zero only after its first 20 terms, what follows?|It converges; a finite initial segment does not prevent the test|It diverges because the first terms fail monotonicity|It can converge only if the first 20 terms sum to zero|The convergence decision depends on the tail where the alternating test applies.
For Σ from n=1 to ∞ of (−1)^(n+1)/n³, which facts establish alternating-test convergence?|The magnitudes decrease and tend to zero|Alternating signs alone|The first term equals 1 alone|The test requires both monotone magnitude decay and zero limit in addition to alternation.
@10.8
Apply the ratio test to Σ from n=1 to ∞ of n²/3ⁿ. What is the result?|L=1/3, so it converges absolutely|L=3, so it diverges|L=1, so the test is inconclusive|The ratio is [(n+1)/n]²/3, whose limit is 1/3.
For aₙ=3ⁿ/n!, what is lim abs(aₙ₊₁/aₙ)?|0|3|1|The ratio is 3/(n+1), which tends to zero.
For Σ1/n, the ratio test yields L=1. What should happen next?|Use another test; the ratio test is inconclusive|Declare convergence|Declare divergence solely from L=1|Both convergent and divergent series can have ratio limit 1.
For Σ from n=1 to ∞ of (−4)ⁿ/n², what does the ratio test establish?|Divergence, since the absolute ratio tends to 4|Absolute convergence, since the signed ratio is negative|Conditional convergence by alternation|The ratio test uses absolute values; its limit exceeds 1.
For Σ from n=0 to ∞ of 1/(2ⁿ n!), which ratio expression is correct?|1/[2(n+1)]|2(n+1)|1/(2n)|The extra power-of-two factor and factorial factor both remain in the denominator.
@10.9
Classify Σ from n=1 to ∞ of (−1)^(n+1)/√n.|Conditionally convergent|Absolutely convergent|Divergent|Alternation with decreasing magnitudes gives convergence, but the absolute p-series has p=1/2 and diverges.
Classify Σ from n=1 to ∞ of (−1)ⁿ/3ⁿ.|Absolutely convergent|Conditionally convergent|Divergent|The magnitude series is geometric with ratio 1/3<1.
If Σabs(aₙ) diverges, does Σaₙ necessarily diverge?|No; it may converge conditionally|Yes|No; it must converge|Failure of absolute convergence leaves either conditional convergence or divergence possible.
A series converges and the ratio test gives an absolute ratio limit below 1. How should it be classified?|Absolutely convergent|Conditionally convergent|Divergent|The ratio-test conclusion is convergence of the absolute-value series.
Classify Σ from n=1 to ∞ of (−1)ⁿ n/(n+1).|Divergent|Conditionally convergent|Absolutely convergent|The individual terms do not tend to zero, so neither kind of convergence is possible.
@10.10
For Σ from n=1 to ∞ of (−1)^(n+1)/n², bound the error after 3 terms.|At most 1/16|At most 1/9|At most 1/25|The first omitted term is the fourth, whose magnitude is 1/4².
For 1−1/4+1/9−1/16+…, is the three-term partial sum an overestimate or underestimate?|Overestimate|Underestimate|Exact|The next omitted term is negative, so the true sum lies below the partial sum.
For that alternating reciprocal-square series, what is the smallest N guaranteeing error at most 0.01 by the alternating bound?|9|10|99|Require 1/(N+1)²≤0.01, giving N+1≥10.
For 1−1/2+1/3−…, where does the true sum lie using S₂ and S₃?|Between 1/2 and 5/6|Between 0 and 1/3|Exactly at their midpoint|Alternating partial sums bracket the sum; S₂=1/2 and S₃=5/6.
For Σ from n=0 to ∞ of (−1)ⁿ/(n+1)!, what error bound follows after the terms n=0 through n=3?|1/120|1/24|1/720|The first omitted index is n=4, giving magnitude 1/5!=1/120.
@10.11
For f(2)=3, f′(2)=−1, and f″(2)=4, find its degree-2 Taylor polynomial centered at 2.|3−(x−2)+2(x−2)²|3−x+4x²|3−(x−2)+4(x−2)²|Taylor coefficients divide derivatives by factorials, so the quadratic coefficient is 4/2!=2.
What is the degree-4 Maclaurin polynomial for cos x?|1−x²/2+x⁴/24|1−x²+x⁴|x−x³/6|Cosine has alternating even-power terms with factorial denominators.
Use the degree-2 Maclaurin polynomial for e^x to estimate e^0.1.|1.105|1.11|1.005|Substitute 0.1 into 1+x+x²/2.
If a degree-3 Taylor polynomial contains the term 5(x−a)³, what is f‴(a)?|30|5|15|The cubic coefficient equals f‴(a)/3!, so multiply 5 by 6.
What is the degree-2 Taylor polynomial for ln x centered at x=1?| (x−1)−(x−1)²/2|1+(x−1)+(x−1)²/2|x−x²/2|Use ln 1=0, f′(1)=1, and f″(1)=−1 with powers of x−1.
@10.12
If abs(f⁽⁴⁾(t))≤24 between 0 and 0.2, what bound applies to the degree-3 Maclaurin error at 0.2?|0.0016|0.0064|0.0004|Use M abs(x)⁴/4!=24·0.2⁴/24=0.0016.
For the degree-2 Maclaurin approximation to e^0.1, which M can bound the required third derivative on [0,0.1]?|e^0.1|1|0.1|Every derivative of e^t equals e^t, whose maximum on this interval occurs at t=0.1.
A degree-1 Taylor polynomial centered at 2 approximates f(2.2), with abs(f″)≤5 throughout [2,2.2]. What is the error bound?|0.1|0.2|0.01|The Lagrange bound is 5·(0.2)²/2!=0.1.
For a degree-4 Maclaurin polynomial, which power and factorial appear in the Lagrange bound?|abs(x)⁵/5!|abs(x)⁴/4!|abs(x)⁵/4!|The remainder uses one order beyond the polynomial degree.
If a valid remainder bound is 0.004, which statement follows?|The absolute approximation error is at most 0.004|The actual error equals 0.004|The approximation must be an overestimate|A bound controls magnitude; it does not by itself determine the error's exact size or sign.
@10.13
Find the interval of convergence of Σ from n=1 to ∞ of xⁿ/n².|[−1,1]|(−1,1)|[−1,1)|The radius is 1, and at both endpoints the absolute-value series is Σ1/n².
For Σ from n=1 to ∞ of (x−3)ⁿ/(2ⁿn), find the convergence interval.|[1,5)|(1,5)|[1,5]|Inside, abs(x−3)<2; the left endpoint gives an alternating harmonic series and the right gives the divergent harmonic series.
Find the radius of convergence of Σ from n=0 to ∞ of n!xⁿ.|0|1|∞|For every x≠0, the absolute ratio (n+1)abs(x) grows without bound; only x=0 converges.
If a power series converges at x=4 and is centered at 1, what is guaranteed?|It converges absolutely for abs(x−1)<3|It converges at x=−2|Its radius is exactly 3|Convergence at distance 3 ensures absolute convergence at every smaller distance, but does not fix the other boundary.
For Σ from n=0 to ∞ of (x+2)ⁿ/n!, what are the center and radius?|Center −2, radius ∞|Center 2, radius 1|Center −2, radius 1|The ratio abs(x+2)/(n+1) tends to zero for every fixed real x.
@10.14
What is the Taylor series for e^x centered at x=2?|e² Σ from n=0 to ∞ of (x−2)ⁿ/n!|Σ from n=0 to ∞ of (x−2)ⁿ/n!|e² Σ from n=0 to ∞ of xⁿ/n!|Every derivative evaluated at the center equals e², and powers must be of x−2.
What is the coefficient of x⁵ in the Maclaurin series for sin x?|1/120|−1/120|1/24|The sine series alternates x−x³/3!+x⁵/5!−…, so the coefficient is positive 1/5!.
For abs(x)<1, which series represents ln(1+x)?|x−x²/2+x³/3−x⁴/4+…|1+x+x²/2+x³/6+…|x+x²/2+x³/3+x⁴/4+…|Integrating the alternating geometric expansion of 1/(1+x) produces this logarithmic series.
A Taylor series has coefficients f⁽ⁿ⁾(a)/n!. What does its n=0 term equal?|f(a)|0|f′(a)|The zeroth derivative is the function itself and 0!=1.
For the Maclaurin series of cos x, why is the x³ coefficient zero?|The third derivative at zero is zero|Odd factorials are zero|Cosine has no third derivative|The third derivative is sin x, which vanishes at zero; all odd-order coefficients vanish similarly.
@10.15
Substitute x² into the geometric series for 1/(1−x). Which expansion results for abs(x)<1?|1/(1−x²)=1+x²+x⁴+…|1/(1−x²)=1+x+x²+…|1/(1−x²)=1−x²+x⁴−…|Replace every occurrence of the original input by x², making the powers even.
Using the cosine series, find lim as x→0 of (cos x−1)/x².|−1/2|1/2|0|The first remaining term after subtracting 1 is −x²/2.
Use e^x=1+x+x²/2+x³/6+… to find lim as x→0 (e^x−1−x−x²/2)/x³.|1/6|1/2|0|Cancellation leaves leading term x³/6; divide by x³.
Integrate 1−x²+x⁴ from 0 to a as an approximation to ∫₀ᵃ 1/(1+x²)dx for small positive a.|a−a³/3+a⁵/5|a−a²/2+a⁴/4|1−a³/3+a⁵/5|Integrate each power separately and apply the zero lower bound.
Differentiate Σ from n=0 to ∞ of xⁿ inside abs(x)<1. What is the resulting indexed series?|Σ from n=1 to ∞ of n x^(n−1)|Σ from n=0 to ∞ of x^(n−1)|Σ from n=1 to ∞ of xⁿ/n|The constant term differentiates to zero and each other term gains its exponent as a coefficient.
`;
