# IFRS 9 guide: content review notes

Status: **under review**. The page gate and PDF gate for `ifrs-9` are both `false` in `acce-nextjs/src/config/guides.ts` and `acce-nextjs/src/middleware.ts`. The guide is visible only in dev or a `NEXT_PUBLIC_GUIDES_PREVIEW=true` deploy.

Source: copied from `D:/Projects/IFRSguides/guides/ifrs-9-financial-instruments/` (PDF built 2026-05-24). Web pages at `acce-nextjs/src/app/guides/ifrs-9/part-1..9` map 1:1 to the markdown parts. Every item below was left **as written** in both the markdown and the web page, so the reviewer can decide. Fix in the markdown, mirror in the page, then regenerate the PDF.

Flags came from the page build pass (not a formal technical review). Treat them as leads, not verdicts.

## Release blockers (clearly wrong)

| # | Part | Section | Issue |
|---|------|---------|-------|
| 1 | 1 | The Structure of IFRS 9 | Claims "there is no Chapter 5, deliberately". Wrong: Ch 3 Recognition and derecognition, Ch 4 Classification, Ch 5 Measurement (5.1 initial, 5.4 amortised cost, 5.5 impairment, 5.6 reclassification, 5.7 gains and losses), Ch 6 Hedge accounting. The tree is mis-numbered and contradicts the guide's own refs (IFRS 9.5.1, 5.5.3). Rewrite or delete. |
| 2 | 2 | Fair value option example | If both the fixed-rate debt and the bonds are at amortised cost there is no mismatch. Designating only the bonds at FVTPL creates one. Only works if the liability is at FV or both are designated. |
| 3 | 5 | Derecognition Step 5 (control) | Says control is retained "if the entity has the practical ability to sell". IFRS 9.3.2.9 looks at the **transferee's** practical ability to sell. |
| 4 | 5 | Securitisation | "Senior notes: investors bear the first R80m" is backwards (senior absorbs last). Derecognising "only the senior portion" is not how 3.2.2 works. A retained R20m first-loss piece on R100m likely means substantially all risks retained. IFRS 10 SPV consolidation step missing. |
| 5 | 5 | Continuing involvement example (R1m loan, R200k guarantee) | Says entity "derecognises the asset (transferred most risks/rewards)", which contradicts the continuing-involvement premise. Measurement per 3.2.16(a)/B3.2.13(a) is not applied. |
| 6 | 6 | SICR example | "BB is still investment grade". BB is sub-investment grade (investment grade is BBB- or better). |
| 7 | 7 | Fair value hedge example | Facts say rates rise, bond FV falls, receive-fixed swap gains. With rates rising a receive-fixed swap loses. The journals only fit rates **falling**. |
| 8 | 7 | Sasol settlement journal | Forward carried at 10,000,000 but settlement credits 8,000,000 "plus adjustment". The 2,000,000 remeasurement (Dr CFHR / Cr Forward) is never shown, so the reserve would be 10m, not the 8m reclassified. Facts are USD but the net line says "R80,000,000". |
| 9 | 8 | Costs of hedging (option time value) | Reversed. Per 6.5.15, **transaction-related** time value is deferred until the hedged item affects P/L; **time-period-related** is amortised systematically. |
| 10 | 9 | IAS 32 puttables | Says puttables are liabilities under a heading naming the IAS 32.16A-D **exception**. Instruments meeting those criteria are classified as **equity**. |

## Technical corrections (should fix before release)

| # | Part | Issue |
|---|------|-------|
| 11 | 1 | Amortised cost definition: "± principal repayments ± impairment". Appendix A: **minus** principal repayments, adjusted for any loss allowance. |
| 12 | 1 | Transition described as "prospective". IFRS 9 transition is retrospective (IAS 8) with relief from restating comparatives; adjustment to opening retained earnings. |
| 13 | 1 | Separate FS: subsidiaries/associates/JVs "ARE within scope". Only if IFRS 9 is elected under IAS 27.10 (cost / IFRS 9 / equity method). |
| 14 | 1 | Scope list: lease receivables in scope only for derecognition and impairment; lessee lease liabilities subject to IFRS 9 derecognition; gold forward is only a derivative if net-settleable and not own-use. |
| 15 | 2 | SPPI table: "Non-recourse loans: Pass" overstated. Must look through to underlying assets (B4.1.16-17); can fail. |
| 16 | 2 | Sales table: should be "infrequent (even if significant) OR insignificant (even if frequent)" (B4.1.3B). |
| 17 | 2, 3 | FVOCI equity: OCI "transferred to retained earnings". Transfer within equity is permitted, not required (B5.7.1). |
| 18 | 3 | Below-market intragroup loan (lender side): debit should be **Investment in subsidiary** (capital contribution), not "Equity". |
| 19 | 3 | Amortised cost formula "+ EIR interest - cash ± amortisation of premium/discount" double counts (EIR interest already includes amortisation). |
| 20 | 3 | Reclassification FVOCI to AC: OCI adjusted against the **fair value** at reclassification date (5.6.5), not "gross carrying amount". |
| 21 | 3 | Comprehensive example assumes the FVOCI bond's opening amortised cost equals its R800,000 fair value. Not stated; the R8,000 OCI depends on it. |
| 22 | 4 | Non-substantial modification: "amortise the adjustment using the original EIR" is old IAS 39 practice. IFRS 9 (2017 clarification, BC4.252-253): recalculate at original EIR, gain/loss to P/L immediately. Part 5 says immediate P/L, so parts 4 and 5 contradict each other. |
| 23 | 4 | FVO for liabilities "same criteria as assets". 4.2.2 also allows a group managed on FV basis; 4.3.5 covers hybrids. |
| 24 | 4 | Own credit risk: OCI transfer to retained earnings is permitted, not required (B5.7.9). Omits the 5.7.8 exception (all to P/L if OCI would create/enlarge a mismatch). |
| 25 | 5 | Pass-through conditions omit 3.2.5(b) (no sale/pledge of original asset). |
| 26 | 5 | Factoring with recourse: liability should be recognised at consideration received (R4.8m) with the R200k accreted via EIR, not R5m with R200k expensed on day 1. |
| 27 | 5 | Modification table "< 10%" row repeats the amortise-the-difference treatment, contradicting the text below it. |
| 28 | 5 | Debt modification example: new liability booked "@ FV" at R2,650,000, which is PV at the original EIR, not FV. "New EIR (9%)" only holds at par. The R2,650,000 figure is given, not derived (a 9% 5-year bullet at 12% gives R2,675,570). |
| 29 | 5 | Gain/loss formula "Proceeds - CA ± FV of retained interest" is loose. 3.2.12-13 allocates carrying amount by relative fair values. |
| 30 | 6 | Three-stage example: Stage 3 interest (R600k) shown in the transfer period. Net-basis interest applies from the **next** period (5.4.1(b)). Gross amount kept at R10m despite missed payments. |
| 31 | 6 | SA retailers (WFS, Mr Price Money, TFG) said to use the provision matrix for store-card books. Unverified and likely wrong: these are loans, and TFG discloses a staged model. WFS is Absa-controlled. |
| 32 | 7 | Discontinuation table: "no longer highly probable → reclassify immediately". Under IAS 39.101 OCI stays while still **expected** to occur; recycle only when no longer expected. The text below the table is correct. Same wording in part 7 pitfalls and part 9 topic 6. |
| 33 | 7 | "Uniquely" non-derivatives for net investment hedges contradicts the earlier (correct) statement that IAS 39 allows non-derivatives for FX risk in any hedge type. |
| 34 | 8 | Rebalancing parentheticals mismatched against B6.5.16-20. |
| 35 | 8 | Aggregated exposure: swapping variable-rate debt to fixed is a **cash flow** hedge, not "(now a fair value hedge)". |
| 36 | 8 | Impala example: a lower forecast volume is arguably partial discontinuation (no longer highly probable), not rebalancing. |
| 37 | 8 | Comparison table on written options: IFRS 9 keeps essentially the same restriction. The real change (non-derivative FVTPL instruments eligible) is omitted. |
| 38 | 7-9 | "Ineffective portion always to P/L" ignores the 6.5.11 lower-of test (under-hedge produces no P/L ineffectiveness). Mandatory basis adjustment for non-financial items under IFRS 9 (optional under IAS 39) is not mentioned. |
| 39 | 9 | ISDA offsetting fails condition 1 (not **currently** enforceable, AG38B), not primarily condition 2. |

## Minor / wording

- Part 2: worked example item 4 "120% x JSE return" payoff is ambiguous (probably 120% participation).
- Part 3: amortisation table Year 3 interest has a 1c rounding plug (98,181.81 vs 98,181.82) so the balance closes at 1,000,000.00. Growthpoint sale combines remeasurement and derecognition; examiners often expect FV uplift through OCI first.
- Part 4: "day of reckoning paradox" is not a standard term. Split method cited as IAS 32.31; residual method sits in 32.31-32 (AG31). Convertible liability PV is R4,620,305.80 exact vs R4,620,305.91 from rounded factors.
- Part 5: "receivable is written off" is a write-off (5.4.4), not strictly expiry of rights.
- Part 6: credit-impaired indicator should read "disappearance of an active market because of financial difficulties". FNB is a division of FirstRand. POCI table "normal asset: subsequent impairment" wording vague.
- Part 7: "all six criteria" is a teaching regrouping (IAS 39.88 lists five). "Basis adjustment" used for the FV hedge adjustment clashes with the CF hedge term. Discontinuation date is from last date effectiveness was demonstrated (AG113).
- Part 8: airline example wording (crude oil component of jet fuel purchases). Forward points / currency basis cost of hedging is an election (6.5.16). Change in risk management objective missing as a discontinuation trigger. "6.4.1" is 6.4.1(c).
- Part 9: "IFRS 7.21A-24F" probably 21A-24G. Eskom is state-owned, not JSE-listed. "FNB annual report" should be FirstRand's. Duration analysis is not an IFRS 7 requirement (7.40 is sensitivity analysis). Source pitfall "Putting effective ineffectiveness into OCI" rendered as "Putting ineffectiveness into OCI".

## Release checklist

1. Resolve the items above in the markdown in this folder.
2. Mirror the changes into `acce-nextjs/src/app/guides/ifrs-9/part-N/page.tsx`.
3. Regenerate the PDF into `contentfiles/ifrs-9-financial-instruments.pdf`, then produce the reduced-size online version for `acce-nextjs/public/pdfs/ifrs-9-financial-instruments.pdf`, as was done for the other three guides (100-184KB online). The copy in `public/pdfs/` is currently the full 1.2MB file.
4. Flip `"ifrs-9"` to `true` in `GUIDE_PUBLISH_STATUS` (config **and** middleware), then later in `GUIDE_PDF_PUBLISH_STATUS` when the PDF is signed off.
5. Update `tests/unit/guides-config.test.ts` ("holds the IFRS 9 page") and `tests/unit/sitemap.test.ts` (IFRS 9 exclusion, part count 9).
6. At release, consider adding IFRS 9 to the homepage Resources cards (`src/components/Resources.tsx`), the guides index metadata, and the `/accounting-tutor` guide links.
