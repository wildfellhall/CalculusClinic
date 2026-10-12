export default `
@10.1
A series converges when…|Its partial sums approach a finite limit|Its terms are all positive|It has infinitely many terms|Convergence is defined through the partial-sum sequence.
For aₙ=1/n, does aₙ→0 prove Σaₙ converges?|No|Yes|Only if n starts at 1|The harmonic series is a counterexample.
Find the first three partial sums of 1+1/2+1/4+…|1,3/2,7/4|1,1/2,1/4|1,2,3|Add successive terms cumulatively.
Does the sequence aₙ=(−1)ⁿ converge?|No|Yes, to 0|Yes, to 1|The values alternate indefinitely between −1 and 1.
Find Σ from n=1 to ∞ of [1/n−1/(n+1)].|1|0|Diverges|The Nth partial sum telescopes to 1−1/(N+1).
@10.2
Find Σ from n=0 to ∞ of (1/2)ⁿ.|2|1|1/2|First term 1 divided by 1−1/2 gives 2.
When does a nonzero geometric series with ratio r converge?|abs(r)<1|abs(r)≤1|r>1|Powers of r must tend to zero.
Find Σ from n=1 to ∞ of (1/3)ⁿ.|1/2|3/2|1/3|The first term is 1/3, not 1.
Does Σ from n=0 to ∞ of (−1)ⁿ converge?|No|Yes, to 0|Yes, to 1/2 as an ordinary sum|Its partial sums alternate between 1 and 0.
Find 3−3/2+3/4−…|2|6|3/2|Use first term 3 and ratio −1/2.
@10.3
If lim aₙ=5, what can be said about Σaₙ?|It diverges|It converges to 5|The divergence test is inconclusive|A convergent series must have terms tending to zero.
If lim aₙ=0, the nth-term test is…|Inconclusive|Proof of convergence|Proof of divergence|The zero limit is necessary, not sufficient.
Does Σ n/(n+1), n≥1, converge?|No|Yes|Only conditionally|Its terms tend to 1 rather than zero.
What does the nth-term test say about Σ1/n²?|Inconclusive|Converges by this test alone|Diverges|The terms tend to zero, so another test is needed.
For Σ(−1)ⁿ, what does the term test show?|Divergence|Convergence|Absolute convergence|The terms do not tend to zero.
@10.4
Which hypotheses support the integral test eventually?|Positive, continuous and decreasing f with f(n)=aₙ|Any continuous f|Only f(n)→0|All three regularity conditions are needed.
To test Σ1/n², which improper integral is natural?|∫₁^∞ 1/x² dx|∫₀¹ 1/x² dx|∫₁² x² dx|Use the same formula over the positive infinite tail.
Does convergence of the test integral mean its value equals the series sum?|No|Yes|Only for every p-series|The test transfers convergence, not exact values.
For Σ1/[n(ln n)²], n≥2, the integral test gives…|Convergence|Divergence|Inconclusive because n starts at 2|Substitution u=ln x gives a convergent 1/u² tail integral.
Do finitely many early terms change convergence of a series?|No|Yes, always|Only if they are positive|Convergence depends on the infinite tail.
@10.5
Does Σ1/n² converge?|Yes|No|Only conditionally|It is a p-series with p=2>1.
Does Σ1/n converge?|No|Yes|Only if n starts at 2|The harmonic series has boundary exponent p=1.
Does Σ1/√n converge?|No|Yes|Only absolutely|Here p=1/2≤1.
For which p does Σ1/n^p converge?|p>1|p≥1|p>0|The threshold is strictly greater than 1.
Does Σn^(−3/2) converge?|Yes|No|Inconclusive as a p-series|The denominator exponent is p=3/2.
@10.6
If 0≤aₙ≤bₙ eventually and Σbₙ converges, then Σaₙ…|Converges|Diverges|Must equal Σbₙ|A smaller nonnegative tail also has bounded partial sums.
If 0≤bₙ≤aₙ eventually and Σbₙ diverges, then Σaₙ…|Diverges|Converges|Is necessarily alternating|A larger nonnegative tail cannot have a finite sum.
If lim aₙ/bₙ=3 for positive terms, the two series…|Share convergence behavior|Have the same exact sum|Both diverge necessarily|A finite positive ratio permits limit comparison.
Classify Σ1/(n²+1), n≥1.|Converges|Diverges|Conditionally converges|It is bounded above by the convergent series Σ1/n².
A useful limit comparison for Σ(3n+1)/(n³+2) is…|Σ1/n²|Σ1/n|Σn|Dominant powers make the terms behave like 3/n².
@10.7
Does Σ(−1)^(n+1)/n converge?|Yes|No|Only if made finite|Magnitudes decrease to zero, satisfying the alternating test.
Which magnitude condition does the alternating test require?|Eventually decreasing to zero|Only bounded above|Increasing to one|Both monotonicity and a zero limit are needed.
Does Σ(−1)ⁿ n converge?|No|Yes by alternation|Yes, absolutely|Its terms do not tend to zero.
Does Σ(−1)ⁿ/√n converge?|Yes|No|The test fails because √n grows|The magnitudes 1/√n decrease to zero.
Are alternating signs alone enough for convergence?|No|Yes|Only if the first term is positive|The magnitudes must also meet the test's conditions.
@10.8
A ratio-test limit L=1/3 implies…|Absolute convergence|Divergence|Inconclusive|A limit below one establishes absolute convergence.
A ratio-test limit L=2 implies…|Divergence|Absolute convergence|Inconclusive|A ratio limit above one gives divergence.
A ratio-test limit L=1 implies…|Inconclusive|Convergence|Divergence|The boundary case needs a different test.
For aₙ=1/n!, the ratio aₙ₊₁/aₙ is…|1/(n+1)|n+1|1/n|Expand (n+1)!=(n+1)n!.
Classify Σn!/2ⁿ using the ratio test.|Diverges|Converges absolutely|Converges conditionally|The consecutive ratio (n+1)/2 tends to infinity.
@10.9
Σ(−1)^(n+1)/n is…|Conditionally convergent|Absolutely convergent|Divergent|The signed series converges but the harmonic magnitude series diverges.
Σ(−1)ⁿ/n² is…|Absolutely convergent|Conditionally convergent|Divergent|Its absolute-value series is a convergent p-series.
If Σabs(aₙ) converges, then Σaₙ…|Converges|May diverge|Must be positive|Absolute convergence implies convergence.
Conditional convergence means…|The signed series converges while the absolute series diverges|Both series diverge|Both series converge|These are two distinct convergence checks.
Can a series of nonnegative terms be conditionally convergent?|No|Yes|Only if terms decrease|Its absolute-value series is the same series.
@10.10
For a valid alternating series, the error after N terms is at most…|The magnitude of term N+1|The magnitude of term N|The entire partial sum|Use the first omitted term.
For 1−1/2+1/3−… after four terms, the error bound is…|1/5|1/4|1/6|The next omitted term is +1/5.
The four-term partial sum of that series is…|An underestimate|An overestimate|Exact|The next omitted term is positive.
For that series, to guarantee error at most 0.01, the smallest N allowed by the bound is…|99|1000|10|Require 1/(N+1)≤0.01, so N≥99.
Can this error bound be used just because signs alternate?|No|Yes|Only if N is even|Decreasing magnitudes tending to zero are also required.
@10.11
What is the degree-2 Maclaurin polynomial for e^x?|1+x+x²/2|1+x+x²|x+x²/2|Use derivatives all equal to 1 at zero, divided by factorials.
What is the degree-3 Maclaurin polynomial for sin x?|x−x³/6|x+x³/6|1−x²/2|The first two nonzero terms are x and −x³/3!.
In a Taylor polynomial at a, the coefficient of (x−a)² is…|f″(a)/2|f″(a)|f′(a)/2|Divide the second derivative by 2!.
The degree-one Taylor polynomial is also called…|The linearization|An improper integral|The exact function always|It matches value and first derivative at the center.
For f(x)=x² centered at a=1, the Taylor polynomial is…|1+2(x−1)+(x−1)²|1+(x−1)²|x−1|Use the value 1, derivative 2 and second derivative 2.
@10.12
For a degree-n Taylor approximation, which derivative bounds the Lagrange remainder?|The (n+1)st|The nth only|The first only|The remainder uses the next derivative order.
If abs(f‴)≤6 between a and x and abs(x−a)=0.1, bound the degree-2 error.|0.001|0.006|0.01|Use 6·0.1³/3!.
Where must the derivative bound M hold?|Throughout the interval between the center and target|Only at the center|Only at the target|The unknown remainder point lies somewhere in between.
For a degree-3 Maclaurin approximation to sin(0.2), using M=1, an error bound is…|0.2⁴/24|0.2³/6|0.2⁴/4|The fourth derivative magnitude is at most 1.
Does evaluating the next derivative only at the center always give a valid M?|No|Yes|Only if the center is zero|The derivative could be larger elsewhere in the interval.
@10.13
For Σxⁿ, n≥0, the radius of convergence is…|1|0|∞|This geometric series converges when abs(x)<1.
For Σ(x−2)ⁿ/3ⁿ, the center and radius are…|Center 2, radius 3|Center 3, radius 2|Center −2, radius 3|The ratio magnitude is abs(x−2)/3.
After finding an open convergence interval, what remains?|Test each finite endpoint separately|Include both endpoints automatically|Exclude both endpoints automatically|The interior ratio test does not settle endpoints.
For Σxⁿ/n, n≥1, the interval is…|[−1,1)|(−1,1)|[−1,1]|At −1 it alternates and converges; at 1 it is harmonic.
For Σxⁿ/n!, n≥0, the radius is…|∞|1|0|For every fixed x, the ratio abs(x)/(n+1) tends to zero.
@10.14
The Maclaurin series for e^x is…|Σ xⁿ/n!, n≥0|Σ xⁿ, n≥0|Σ n!xⁿ, n≥0|Every derivative at zero equals 1.
The Maclaurin series for cos x starts…|1−x²/2+x⁴/24|x−x³/6|1+x²/2+x⁴/24|Even derivatives alternate signs.
For abs(x)<1, 1/(1−x) equals…|1+x+x²+x³+…|1−x+x²−x³+…|x+x²+x³+…|It is the geometric series with first term 1.
For a Taylor series to equal its function at x, what is needed?|The Taylor remainder tends to zero|Only that every derivative exists|Only a positive convergence radius|Smoothness alone does not ensure equality with the Taylor series.
The Maclaurin series for sin x contains…|Only odd powers|Only even powers|All powers with equal coefficients|Its even-order derivatives vanish at zero.
@10.15
For abs(x)<1, substitute −x into 1/(1−x) to obtain…|1/(1+x)=1−x+x²−…|1/(1+x)=1+x+x²+…|1/(1+x)=x−x²+…|Changing x to −x alternates the signs.
Differentiate Σxⁿ, n≥0, inside its radius to represent…|1/(1−x)²|ln(1−x)|1/(1+x)|Differentiate the geometric sum function.
Integrating the geometric series from 0 to x gives…|−ln(1−x)=Σ x^(n+1)/(n+1), n≥0|ln(1−x)=Σ xⁿ|1/(1−x)²=Σ x^(n+1)|Integrate each term and use the zero initial value.
Does termwise integration necessarily preserve endpoint inclusion?|No; endpoints need rechecking|Yes, always|It always excludes both endpoints|The radius stays the same, but endpoints can change.
Use sin x=x−x³/6+… to find lim as x→0 of (sin x−x)/x³.|−1/6|1/6|0|Cancel x and divide the leading remaining term by x³.
`;
