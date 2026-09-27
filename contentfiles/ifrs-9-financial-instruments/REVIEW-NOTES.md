# IFRS 9: Financial Instruments guide: content review notes

<!-- Generated from review-items.json by contentfiles/_tools/review_pdf.py. Edit the JSON, not this file. -->

Status: **under review**. Page gate and PDF gate for `ifrs-9` are both `false` in `acce-nextjs/src/config/guides.ts` and `acce-nextjs/src/middleware.ts`; the guide is visible only in dev or a `NEXT_PUBLIC_GUIDES_PREVIEW=true` deploy. Source copied from `D:/Projects/IFRSguides/guides/ifrs-9-financial-instruments/` (PDF built 2026-05-24). Web pages at `acce-nextjs/src/app/guides/ifrs-9/part-1..9` map 1:1 to the markdown parts. Every item was left as written in the markdown, the web page and the PDF. Flags came from the page build pass, not a formal technical review: treat them as leads, not verdicts.

Every item below is also a numbered comment on `contentfiles/ifrs-9-financial-instruments-REVIEW.pdf`, highlighted on the passage it refers to (red = release blocker, orange = technical correction, yellow = minor). Reply to the comments in the PDF, then run `pull` to bring your replies into the Response column here.

## Release blockers (clearly wrong)

| # | Part | Section | Issue | Web page | Response |
|---|------|---------|-------|----------|----------|
| 1 | 1 | The Structure of IFRS 9 | Claims there is no Chapter 5, deliberately. Wrong: Ch 3 Recognition and derecognition, Ch 4 Classification, Ch 5 Measurement (5.1 initial, 5.4 amortised cost, 5.5 impairment, 5.6 reclassification, 5.7 gains and losses), Ch 6 Hedge accounting. The chapter tree is mis-numbered and contradicts the guide's own references (IFRS 9.5.1, 5.5.3). Rewrite or delete. | /guides/ifrs-9/part-1 |  |
| 2 | 2 | Fair value option example | If both the fixed-rate debt and the bonds are at amortised cost there is no accounting mismatch. Designating only the bonds at FVTPL would create one. The example only works if the liability is at fair value, or both are designated. | /guides/ifrs-9/part-2 |  |
| 3 | 5 | Derecognition decision tree, Step 5 (control) | Says control is retained if the entity has the practical ability to sell. IFRS 9.3.2.9 looks at the TRANSFEREE's practical ability to sell: control is retained if the transferee does NOT have that ability. | /guides/ifrs-9/part-5 |  |
| 4 | 5 | Securitisation | Backwards: senior notes absorb losses last, not first. Derecognising only the senior portion is not how 3.2.2 works (a subordinated tranche is not a qualifying 'part'). Retaining a R20m first-loss piece on R100m likely means substantially all risks are retained. The IFRS 10 SPV consolidation step is missing. | /guides/ifrs-9/part-5 |  |
| 5 | 5 | Continuing involvement example (R1m loan, R200k guarantee) | Says the entity derecognises the asset (transferred most risks/rewards), which contradicts the continuing-involvement premise (only applies when risks and rewards are neither substantially transferred nor retained). Per 3.2.16(a) / B3.2.13(a) the asset stays recognised at the lower of carrying amount and the guarantee amount; the associated liability is the guarantee amount plus the fair value of the guarantee. It also treats the R200k guarantee amount as the guarantee's fair value. | /guides/ifrs-9/part-5 |  |
| 6 | 6 | SICR example | States BB is still investment grade. BB is sub-investment grade (investment grade is BBB- or better). | /guides/ifrs-9/part-6 |  |
| 7 | 7 | Worked example: interest rate swap fair value hedge | Facts say rates rise, bond FV falls, receive-fixed/pay-floating swap gains. When rates rise a receive-fixed swap LOSES value, and a fall in a fixed-rate liability's FV is a gain for the issuer. The journals (Dr Swap asset / Cr FV gain; Dr FV loss / Cr Bond payable) only fit rates FALLING. | /guides/ifrs-9/part-7 |  |
| 8 | 7 | Sasol cash flow hedge: settlement | The forward is carried at 10,000,000 but settlement credits only 8,000,000 'plus adjustment'. The 2,000,000 remeasurement (Dr CFHR / Cr Forward) is never shown, so the reserve would be 10m, not the 8m reclassified. Also: the facts are in USD but the net line says 'Inventory carried at R80,000,000'. | /guides/ifrs-9/part-7 |  |
| 9 | 8 | Costs of hedging: option time value | Reversed. Per IFRS 9.6.5.15, TRANSACTION-related time value is deferred and recognised when the hedged item affects P/L; TIME-PERIOD-related time value is amortised systematically over the hedge period. | /guides/ifrs-9/part-8 |  |
| 10 | 9 | IAS 32: puttable instruments | Says puttables are liabilities under a heading that names the IAS 32.16A-D EXCEPTION. Puttables and liquidation obligations meeting those criteria are classified as EQUITY. | /guides/ifrs-9/part-9 |  |

## Technical corrections (fix before release)

| # | Part | Section | Issue | Web page | Response |
|---|------|---------|-------|----------|----------|
| 11 | 1 | Key definitions: amortised cost | Says '± principal repayments' and '± impairment'. IFRS 9 Appendix A: MINUS principal repayments, adjusted for any loss allowance. | /guides/ifrs-9/part-1 |  |
| 12 | 1 | IFRS 9 transition | Describes transition as prospective. IFRS 9 transition is retrospective under IAS 8, with relief from restating comparatives and the adjustment going to opening retained earnings. | /guides/ifrs-9/part-1 |  |
| 13 | 1 | Scope: common exam trap | Says subsidiaries, associates and JVs in separate FS ARE within scope. Only if the entity elects IFRS 9 under IAS 27.10 (cost / IFRS 9 / equity method). Also: venture-capital-type holdings can be at FVTPL under IFRS 9 in consolidated FS. | /guides/ifrs-9/part-1 |  |
| 14 | 1 | Scope list and pitfalls | Lease receivables are in scope only for derecognition and impairment. Lessee lease liabilities are subject to IFRS 9 derecognition. A gold forward is only an IFRS 9 derivative if it is net-settleable and not held for own use. | /guides/ifrs-9/part-1 |  |
| 15 | 2 | SPPI table: non-recourse loans | 'Non-recourse loans: Pass' is overstated. Non-recourse does not automatically fail, but you must look through to the underlying assets (B4.1.16-17); it can fail. | /guides/ifrs-9/part-2 |  |
| 16 | 2 | Business model: sales table | Should be 'infrequent (even if significant in value) OR insignificant in value (even if frequent)' (B4.1.3B), not both together. | /guides/ifrs-9/part-2 |  |
| 17 | 2 | FVOCI equity: OCI on sale | Says the OCI balance is transferred to retained earnings. IFRS 9 permits a transfer within equity but does not require it (B5.7.1). Same wording in Part 3. | /guides/ifrs-9/part-2 |  |
| 18 | 3 | Below-market intragroup loan journal | From the lender (parent) side, the R248,685.20 should be debited to Investment in subsidiary (a capital contribution), not the parent's own equity. | /guides/ifrs-9/part-3 |  |
| 19 | 3 | Amortised cost formula | '+ cumulative EIR interest - cash ± amortisation of premium/discount' double counts: EIR interest already includes the amortisation. | /guides/ifrs-9/part-3 |  |
| 20 | 3 | Reclassification FVOCI to amortised cost | Per IFRS 9.5.6.5 the cumulative OCI is removed and adjusted against the FAIR VALUE of the asset at the reclassification date (so it is measured as if always at amortised cost), not 'against gross carrying amount'. | /guides/ifrs-9/part-3 |  |
| 21 | 3 | Comprehensive example: multi-asset portfolio | Assumes the FVOCI bond's opening amortised cost equals its R800,000 opening carrying amount (fair value). Not stated, and the R8,000 OCI figure depends on it. | /guides/ifrs-9/part-3 |  |
| 22 | 4 | Non-substantial modification | This is old IAS 39 practice. Under IFRS 9 (2017 clarification, BC4.252-253) amortised cost is recalculated at the original EIR and the gain/loss goes to P/L immediately. Part 5 says immediate P/L, so Parts 4 and 5 contradict each other. | /guides/ifrs-9/part-4 |  |
| 23 | 4 | Fair value option for liabilities | Not the same as for assets. IFRS 9.4.2.2 also allows the FVO for a group of liabilities managed on a fair value basis, and 4.3.5 covers hybrid contracts. | /guides/ifrs-9/part-4 |  |
| 24 | 4 | Own credit risk: OCI | Transfer of the OCI amount to retained earnings is permitted, not required (B5.7.9). Also omits the 5.7.8 exception: if OCI presentation would create or enlarge an accounting mismatch in P/L, the whole change goes to P/L. | /guides/ifrs-9/part-4 |  |
| 25 | 5 | Pass-through conditions | Omits IFRS 9.3.2.5(b) (prohibited from selling or pledging the original asset). The 'no delay' and 'no reinvestment' points are both parts of 3.2.5(c). | /guides/ifrs-9/part-5 |  |
| 26 | 5 | Factoring with recourse | The journal credits the liability with R5,000,000 and expenses R200,000 on day 1. Per 3.2.15 the liability is recognised at the consideration received (R4,800,000), with the R200k accreted through the EIR. | /guides/ifrs-9/part-5 |  |
| 27 | 5 | Modification table: < 10% row | Repeats the amortise-the-difference treatment, contradicting the paragraph below it (immediate P/L) and the pitfalls table. See #22. | /guides/ifrs-9/part-5 |  |
| 28 | 5 | Debt modification example | The new liability is booked '@ FV' at R2,650,000, which is the PV at the ORIGINAL EIR, not fair value (FV would use a current market rate). 'New EIR (9%)' only holds if recognised at par. The R2,650,000 is given, not derived: a 9% 5-year bullet discounted at 12% gives R2,675,570 (10.8%, so the 'substantial' conclusion still stands). | /guides/ifrs-9/part-5 |  |
| 29 | 5 | Exam technique: gain/loss formula | 'Proceeds - Carrying amount ± FV of retained interest' is loose. IFRS 9.3.2.12-3.2.13 allocate the carrying amount between the part derecognised and the part retained using relative fair values. | /guides/ifrs-9/part-5 |  |
| 30 | 6 | Three-stage worked example | Stage 3 interest (R600k) is shown in the period of transfer. Net-basis interest applies from the NEXT reporting period (5.4.1(b)); interest for the transfer period is on the gross amount. The gross amount is also kept at R10m despite two missed interest payments. Loan term not stated ('remaining 4 years' implies 5). | /guides/ifrs-9/part-6 |  |
| 31 | 6 | Simplified approach: SA retailers | Claims WFS, Mr Price Money and TFG apply the provision matrix (simplified approach) to store-card books. Unverified and likely wrong: these are loans, not trade receivables without a significant financing component, and TFG discloses a staged model. WFS is Absa-controlled. | /guides/ifrs-9/part-6 |  |
| 32 | 7 | Discontinuation table | Under IAS 39.101 the OCI stays in equity while the transaction is still EXPECTED to occur; it is recycled immediately only when no longer expected. The source's own text below the table is correct. Same wording in the Part 7 pitfalls and Part 9 Topic 6. | /guides/ifrs-9/part-7 |  |
| 33 | 7 | Net investment hedges | 'Uniquely' contradicts the earlier (correct) statement that IAS 39 allows non-derivatives as hedging instruments for FX risk in any hedge type. | /guides/ifrs-9/part-7 |  |
| 34 | 8 | Rebalancing mechanics | The parentheticals are mismatched against B6.5.16-20: increasing the hedging instrument is an additional designation; decreasing the instrument removes that portion from the relationship. | /guides/ifrs-9/part-8 |  |
| 35 | 8 | Aggregated exposure example | Swapping variable-rate debt to fixed is a CASH FLOW hedge, not a fair value hedge. | /guides/ifrs-9/part-8 |  |
| 36 | 8 | Impala worked example | A revised forecast volume (10,000 to 8,000 oz) is arguably partial discontinuation (that portion is no longer highly probable), not rebalancing. Rebalancing addresses hedge ratio changes with an unchanged risk management objective (B6.5.7-9). The claim IAS 39 would need full discontinuation is also debatable. | /guides/ifrs-9/part-8 |  |
| 37 | 8 | Comparison table: written options | IFRS 9 keeps essentially the same written-option restriction as IAS 39. The real change (non-derivative financial instruments at FVTPL became eligible hedging instruments) is omitted. | /guides/ifrs-9/part-8 |  |
| 38 | 8 | Calculating ineffectiveness (Parts 7-9) | 'Ineffective portion always to P/L' ignores the 6.5.11 lower-of test: an under-hedge in a cash flow hedge produces no P/L ineffectiveness. Parts 7-9 also never mention that IFRS 9 makes the basis adjustment mandatory for non-financial items (optional under IAS 39). | /guides/ifrs-9/part-8 |  |
| 39 | 9 | IAS 32 offsetting | ISDA-type arrangements primarily fail condition 1: a right enforceable only on default is not CURRENTLY enforceable (IAS 32.AG38B). Not primarily condition 2. | /guides/ifrs-9/part-9 |  |

## Minor / wording

| # | Part | Section | Issue | Web page | Response |
|---|------|---------|-------|----------|----------|
| M1 | 2 | Worked example item 4 (structured note) | '120% x JSE return' payoff is ambiguous (probably 120% participation in the index return). Conclusion unaffected. | /guides/ifrs-9/part-2 |  |
| M2 | 3 | Amortisation table, Year 3 | 981,818.19 x 10% = 98,181.82; the table shows 98,181.81 (1c rounding plug so the balance closes at 1,000,000.00). Consider a footnote. | /guides/ifrs-9/part-3 |  |
| M3 | 3 | Growthpoint sale journal | The sale journal combines the remeasurement to fair value and the derecognition. Acceptable, but examiners often expect the FV uplift through OCI first, then derecognition. | /guides/ifrs-9/part-3 |  |
| M4 | 4 | Own credit risk: terminology | Not a standard term; usually called the own-credit or counterintuitive-gain problem. | /guides/ifrs-9/part-4 |  |
| M5 | 4 | Compound instruments: paragraph reference | The residual (split) method sits in IAS 32.31-32 (and AG31), not only 32.31. | /guides/ifrs-9/part-4 |  |
| M6 | 4 | Convertible bond split | Exact PV of the liability is R4,620,305.80; R4,620,305.91 comes from 7-decimal rounded factors (R0.11 difference). Fine, but worth knowing. | /guides/ifrs-9/part-4 |  |
| M7 | 5 | Derecognition Step 1 | A write-off is a derecognition event under 5.4.4, not strictly an expiry of contractual rights. | /guides/ifrs-9/part-5 |  |
| M8 | 6 | Credit-impaired indicators | Should read 'disappearance of an active market for that financial asset because of financial difficulties' (Appendix A). | /guides/ifrs-9/part-6 |  |
| M9 | 6 | SA banks | FNB is a division of FirstRand, not a standalone bank; the reporting entity is FirstRand. | /guides/ifrs-9/part-6 |  |
| M10 | 6 | POCI table | The 'normal asset: subsequent impairment' row wording is vague; consider spelling out 12-month vs lifetime ECL by stage. | /guides/ifrs-9/part-6 |  |
| M11 | 7 | IAS 39 qualifying criteria | 'All six criteria' is a teaching regrouping. IAS 39.88 lists five conditions; instrument and item eligibility sit in separate paragraphs. | /guides/ifrs-9/part-7 |  |
| M12 | 7 | Fair value hedge terminology | Calling the fair value hedge adjustment a 'basis adjustment' clashes with the cash flow hedge basis adjustment term. Part 8's comparison table does the same. | /guides/ifrs-9/part-7 |  |
| M13 | 7 | Failed effectiveness test | Strictly, discontinuation is from the last date on which effectiveness was demonstrated (IAS 39.AG113), not from the failed test date. | /guides/ifrs-9/part-7 |  |
| M14 | 8 | Risk components: airline example | Wording muddled. The usual example is the crude oil component of jet fuel purchases. | /guides/ifrs-9/part-8 |  |
| M15 | 8 | Costs of hedging: forward points | Treating forward points / currency basis spread as a cost of hedging is an election (6.5.16), not automatic. Under IAS 39, non-financial items could also be hedged for FX risk alone (omitted). | /guides/ifrs-9/part-8 |  |
| M16 | 8 | Discontinuation under IFRS 9 | Change in risk management objective is not listed as a discontinuation trigger. | /guides/ifrs-9/part-8 |  |
| M17 | 8 | Paragraph reference | The three effectiveness requirements are 6.4.1(c). | /guides/ifrs-9/part-8 |  |
| M18 | 9 | Paragraph reference | Probably IFRS 7.21A-24G. | /guides/ifrs-9/part-9 |  |
| M19 | 9 | SA context table | Eskom is a state-owned enterprise, not JSE-listed, so it sits oddly under JSE industrials. | /guides/ifrs-9/part-9 |  |
| M20 | 9 | SA context: banks | Reference FirstRand's annual report rather than FNB's. | /guides/ifrs-9/part-9 |  |
| M21 | 9 | IFRS 7 market risk | Duration analysis is not an IFRS 7 requirement; IFRS 7.40 requires sensitivity analysis. | /guides/ifrs-9/part-9 |  |
| M22 | 9 | Pitfalls: hedging | Garbled wording; the web page renders it as 'Putting ineffectiveness into OCI'. Also see #38 on 'always to P/L'. | /guides/ifrs-9/part-9 |  |

## Release checklist

1. Resolve the items above in the markdown in this folder.
2. Mirror the changes into `acce-nextjs/src/app/guides/ifrs-9/part-N/page.tsx`.
3. Regenerate the PDF into `contentfiles/ifrs-9-financial-instruments.pdf`, then produce the reduced-size online version for `acce-nextjs/public/pdfs/ifrs-9-financial-instruments.pdf`, as done for the other three guides. The copy in `public/pdfs/` is currently the full 1.2MB file.
4. Flip `"ifrs-9"` to `true` in `GUIDE_PUBLISH_STATUS` (config and middleware), then in `GUIDE_PDF_PUBLISH_STATUS` when the PDF is signed off.
5. Update `tests/unit/guides-config.test.ts` ("holds the IFRS 9 page") and `tests/unit/sitemap.test.ts` (IFRS 9 exclusion, part count 9).
6. At release, consider adding IFRS 9 to the homepage Resources cards (`src/components/Resources.tsx`), the guides index metadata, and the `/accounting-tutor` guide links.
