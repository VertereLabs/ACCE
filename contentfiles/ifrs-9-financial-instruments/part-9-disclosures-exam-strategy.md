# IFRS 9 Financial Instruments — Part 9: Disclosures & Exam Strategy

## The Disclosure Framework: Three Standards Working Together

Financial instrument disclosures are governed by **IFRS 7 Financial Instruments: Disclosures** — a separate standard that works alongside IFRS 9. IFRS 9 determines *how* to measure; IFRS 7 determines *what* to tell the world about those measurements.

Additionally, **IAS 32** governs the *presentation* of financial instruments (offset, classification as liability vs equity).

```
IAS 32     → Presentation (what is it? where does it go on the face?)
IFRS 9     → Recognition & Measurement (how much? when?)
IFRS 7     → Disclosures (what do you tell users about it?)
```

Understanding this three-standard architecture is itself examinable.

---

## Key Disclosures Under IFRS 7

### Categories of Disclosures

IFRS 7 organises disclosures around two objectives:
1. **Significance of financial instruments** for financial position and performance
2. **Nature and extent of risks** arising from financial instruments, and how they are managed

### 1. Significance Disclosures

#### Carrying Amounts by Category

Entities must disclose the carrying amounts of each category of financial instrument:
- Financial assets at amortised cost
- Financial assets at FVOCI (debt)
- Financial assets at FVOCI (equity — OCI option)
- Financial assets at FVTPL
- Financial liabilities at amortised cost
- Financial liabilities at FVTPL

#### Fair Value Hierarchy (IFRS 13)

For instruments measured at fair value, entities disclose the level in the fair value hierarchy:

| Level | Description | Example |
|-------|-------------|---------|
| **Level 1** | Quoted prices in active markets for identical instruments | JSE-listed shares |
| **Level 2** | Observable inputs other than Level 1 quotes (e.g., yield curves, credit spreads) | OTC interest rate swap |
| **Level 3** | Unobservable inputs — significant management judgement | Private equity; complex structured products |

Transfers between levels must be disclosed. Level 3 instruments require a roll-forward reconciliation and sensitivity analysis.

#### Income Statement Items

- Interest income/expense (using EIR method)
- Fee income/expense not included in EIR
- Fair value gains/losses by category
- Impairment losses/reversals

### 2. Risk Disclosures

Qualitative and quantitative disclosures are required for each type of risk:

#### Credit Risk

| Disclosure | Content |
|-----------|---------|
| Maximum exposure | Gross carrying amount before collateral and credit enhancements |
| Collateral and credit enhancements | Description and fair value |
| Concentration of credit risk | By geography, industry, counterparty |
| Loss allowance reconciliation | Opening → movements (Stage 1/2/3) → closing |
| Significant judgements in SICR | Criteria used to determine significant increase |
| Write-offs | Amounts, recovery actions |
| Modified financial assets | Carrying amount; how modification affected loss allowance |

The **loss allowance reconciliation** is a high-priority disclosure under IFRS 9 — showing how the ECL allowance moved between stages during the year.

#### Liquidity Risk

- Maturity analysis of financial liabilities (contractual cash flows, not carrying amounts)
- Must include derivative liabilities
- Management of liquidity risk

#### Market Risk

**Interest Rate Risk:**
- Impact of a parallel shift in yield curves on P/L and equity
- Duration analysis for fixed rate instruments

**Currency Risk:**
- Net exposure by currency
- Sensitivity of P/L and equity to exchange rate movements

**Other Price Risk:**
- Commodity price sensitivity
- Equity price sensitivity

---

## Hedge Accounting Disclosures (IFRS 7.21A–24F)

IFRS 9 significantly expanded the hedge accounting disclosure requirements in IFRS 7. The goal is to help users understand:
- The entity's risk management strategy
- How hedging activities affect the financial statements
- The effect of hedge accounting on risk exposure

### Key Hedge Disclosures

| Disclosure | Detail |
|-----------|--------|
| **Risk management strategy** | For each risk category, qualitative description |
| **Hedging instruments** | Nominal amounts; carrying amounts; line items in balance sheet |
| **Hedged items** | Carrying amounts; accumulated hedge adjustments; line items |
| **Hedge effectiveness** | Sources of ineffectiveness; ineffectiveness in P/L |
| **Cash flow hedge reserve** | Roll-forward: opening → OCI additions → reclassified to P/L → closing |
| **Costs of hedging reserve** | Roll-forward for option time value and forward points |
| **Net investment hedge** | Roll-forward of translation reserve |

---

## IAS 32: Presentation

### Offsetting Financial Assets and Liabilities

A financial asset and a financial liability shall be offset and the **net amount presented** in the statement of financial position only when the entity:
1. Currently has a legally enforceable right to set off the amounts; AND
2. Intends either to settle on a net basis, or to realize the asset and settle the liability simultaneously

Both conditions must be met. Most netting arrangements (e.g., ISDA master agreements that allow offset only on default) fail condition 2 — they are disclosed in notes but not offset on the face.

### Puttable Instruments and Obligations Arising on Liquidation

Certain instruments that give the holder the right to put them back to the issuer (e.g., units in a fund) are classified as liabilities under IAS 32 — even if they look like equity economically. The contractual obligation to deliver cash on demand makes them liabilities.

---

## Integrated Example: Disclosure Note Extract

Below is the style of disclosure note you might need to draft in an exam:

**Note X: Impairment of Financial Assets**

The group applies the IFRS 9 three-stage ECL model to financial assets at amortised cost and FVOCI (debt). The following table shows movements in the loss allowance for the year ended 31 December 20X2:

| | Stage 1 (12m ECL) | Stage 2 (Lifetime) | Stage 3 (Lifetime) | Total |
|--|--|--|--|--|
| Opening balance | R120,000 | R380,000 | R950,000 | R1,450,000 |
| Transfer to Stage 2 | (45,000) | 45,000 | — | — |
| Transfer to Stage 3 | — | (80,000) | 80,000 | — |
| New originations | 35,000 | — | — | 35,000 |
| Changes in parameters | (10,000) | 65,000 | 320,000 | 375,000 |
| Write-offs | — | — | (400,000) | (400,000) |
| **Closing balance** | **R100,000** | **R410,000** | **R950,000** | **R1,460,000** |

---

## IFRS 9 Transition Mechanics

When transitioning from IAS 39 to IFRS 9, specific transition rules apply. These are examinable — particularly around classification changes and the opening ECL allowance.

### Classification on Transition

| IAS 39 Category | IFRS 9 Reassessment | Key Point |
|-----------------|---------------------|-----------|
| HTM → ? | Reassess business model and SPPI at transition date | Most HTM assets will qualify for Amortised Cost (same outcome, different basis) |
| L&R → ? | Reassess business model and SPPI at transition date | Most will remain at Amortised Cost |
| AFS (debt) → ? | Reassess; could become AC, FVOCI debt, or FVTPL | Classification may change — depends on business model at transition |
| AFS (equity) → ? | Default FVTPL; entity may irrevocably designate FVOCI equity at transition | The OCI option can be elected at the transition date (not only at initial recognition) |
| FVTPL (mandatory) → ? | Reassess; may qualify for AC or FVOCI if business model and SPPI support it | An asset previously "stuck" in FVTPL under IAS 39 may now qualify for AC |

### Opening ECL Allowance

- The entity must determine the ECL stage of each financial asset at the **transition date** by comparing credit risk at origination with credit risk at the transition date
- The resulting Day 1 ECL allowance is recognised as an adjustment to **opening retained earnings** — not in P/L
- Comparatives are not restated (unless the entity elects to restate, which is permitted but rare)

### Practical Transition Issues for SA Entities

- SA banks with large, long-dated loan books found the opening ECL calculation particularly complex — many had to estimate credit risk at origination for loans originated years before IFRS 9 existed
- Entities continuing IAS 39 hedge accounting (permitted under IFRS 9 transition provisions) must still adopt IFRS 9 for classification, measurement, and impairment

---

## Comprehensive Exam Strategy: IFRS 9 / IAS 39

### Topic 1: Classification Questions

**Approach:**
1. Is it a financial instrument? (Apply IAS 32 definition)
2. Is it in scope of IFRS 9? (Check exclusions)
3. Is it an equity instrument → FVTPL (or OCI option)?
4. Business model test → Hold to collect / Hold to collect & sell / Other?
5. SPPI test → Does it pass?
6. Apply the matrix → AC / FVOCI debt / FVTPL
7. Consider FVO if mismatch elimination is needed

**Common Traps:**
- Equity instruments never pass SPPI — don't even apply the test
- FVOCI equity option is irrevocable — must be made at initial recognition
- Reclassification requires a genuine business model change

### Topic 2: Measurement Questions

**For amortised cost:**
- Calculate EIR (given or solve using trial-and-error/annuity factors)
- Build the amortisation table (Opening → Interest → Cash → Closing)
- Show journal entries

**For FVOCI debt:**
- Same as amortised cost for interest and impairment
- Additional OCI entry for residual FV movement
- Show how OCI recycled on derecognition

**For FVTPL:**
- FV at reporting date; all changes to P/L; transaction costs expensed upfront

### Topic 3: Impairment Questions

**Step-by-step:**
1. Scope check — is this asset subject to ECL?
2. Approach — General or Simplified?
3. Stage — assess SICR (if General model)
4. Calculate ECL (PD × LGD × EAD, probability-weighted)
5. Opening allowance → calculate movement → closing allowance
6. Journal entries
7. Interest income — gross (Stages 1&2) or net (Stage 3) carrying amount

**Common Traps:**
- 12-month ECL ≠ 12 months of cash flows
- Stage 3 interest on NET carrying amount — never gross
- FVOCI debt still requires ECL; impairment goes to P/L

### Topic 4: Derecognition Questions

**Asset:**
- Rights expired → derecognize
- Transfer occurred? → Risks & rewards → Control → Continuing involvement
- Full recourse = secured borrowing; Repos = secured borrowing

**Liability:**
- Discharged/cancelled/expired → derecognize; gain/loss in P/L
- Substantial modification (10% test at original EIR) → derecognize old; recognize new; gain/loss in P/L

### Topic 5: Transition Questions

**Step-by-step:**
1. Identify the IAS 39 classification of each instrument
2. Reassess the business model and SPPI at the transition date
3. Determine the IFRS 9 classification
4. For assets moving to amortised cost: calculate the opening amortised cost carrying amount
5. For all in-scope assets: calculate the opening ECL allowance (stage each asset at transition)
6. Recognise the net adjustment in opening retained earnings

**Common Traps:**
- The FVOCI equity OCI option can be elected at the transition date — it is not limited to initial recognition
- Opening ECL adjusts retained earnings, never P/L
- Comparatives are not restated unless the entity elects to do so (rare)

### Topic 6: Hedge Accounting Questions

**Identify the type:**
- Recognized asset/liability or firm commitment → Fair value hedge
- Forecast transaction or variable rate exposure → Cash flow hedge
- Net investment in foreign operation → Net investment hedge

**For cash flow hedge:**
- Effective portion → OCI
- Ineffective portion → P/L
- Reclassify OCI when hedged item affects P/L
- If forecast no longer probable → reclassify OCI immediately

**IAS 39 vs IFRS 9 comparison:**
- Effectiveness: 80–125% vs economic relationship
- Rebalancing: Not permitted vs permitted/required
- Voluntary discontinuation: Permitted vs not permitted
- Risk components: Limited vs expanded

---

## Common Student Pitfalls Across All Topics

| Area | Pitfall | Correct Approach |
|------|---------|------------------|
| Classification | Applying SPPI to equity instruments | Equity instruments always fail SPPI — go straight to FVTPL or OCI option |
| Classification | Forgetting the FVO is irrevocable | Once designated at FVO, cannot reverse |
| Measurement | Using coupon rate for interest income | Always use EIR |
| Measurement | Adding transaction costs to FVTPL assets | Transaction costs for FVTPL → P/L immediately |
| Measurement | Recycling FVOCI equity OCI gains | Equity OCI option: gains transfer to retained earnings, never P/L |
| Impairment | Applying general model to trade receivables | Simplified approach is mandatory for trade receivables without significant financing |
| Impairment | Recognizing ECL only when objective evidence exists | That's IAS 39. Under IFRS 9, ECL from Day 1 |
| Impairment | Calculating interest on gross carrying amount (Stage 3) | Stage 3 → interest on NET carrying amount |
| Derecognition | Derecognizing on legal title transfer | Substance over form — test risks and rewards |
| Derecognition | Using new EIR for 10% modification test | Use the ORIGINAL EIR |
| Hedging | Voluntary discontinuation under IFRS 9 | Not permitted — discontinue only when criteria cease to be met |
| Hedging | Putting effective ineffectiveness into OCI | Ineffective portion always to P/L, regardless of hedge type |
| Presentation | Offsetting without meeting both IAS 32 conditions | Both legally enforceable right AND net settlement intention required |
| Impairment | Applying the three-stage model to POCI assets | POCI assets use a credit-adjusted EIR; only changes in lifetime ECL from purchase date are recognised |
| Transition | Recognising opening ECL in P/L | Opening ECL allowance on transition adjusts retained earnings, not P/L |

---

## Mark-Earning Exam Techniques

> Everything in this section is about converting knowledge into marks. You can understand IFRS 9 perfectly and still underperform if your exam technique is poor. The discipline below is what separates a pass from a distinction.

### 1. State Your Basis First

Before any calculation, state which classification, stage, or approach you are applying and *why*. A marker cannot give you marks for an unexplained number, but they can give marks for correct reasoning even if you make an arithmetic error.

### 2. Show Full Amortisation Tables

Never compress a multi-year EIR schedule to a single line. Show opening balance, interest, cash flows, and closing balance for each period. Markers follow the table to award process marks at each step.

### 3. Use a Structured Journal Entry Format

Always use:
```
Dr  [Account Name]    [Amount]
    Cr  [Account Name]             [Amount]
(Narrative)
```
Label every debit and credit. An unexplained DR/CR loses the mark.

### 4. Conclude on Every Sub-Question

Even in a multi-part question, end every section with a brief conclusion statement. "Therefore, the bond is classified as a financial asset at amortised cost." Examiners award a conclusion mark — don't leave it implied.

### 5. Distinguish Discussion Marks from Calculation Marks

In a 15-mark question, typically:
- 5 marks = definitions/principles/classification reasoning
- 8 marks = calculations (EIR table, ECL, journal entries)
- 2 marks = presentation/disclosure

Plan your time accordingly. Don't spend 12 minutes perfecting a calculation that is worth 3 marks when a 5-mark discussion question sits unanswered.

---

## SA Context: JSE and Industry Applications

| Industry | IFRS 9 Issues Commonly Arising |
|----------|-------------------------------|
| **Banking (FNB, ABSA, Nedbank, Standard Bank)** | Massive ECL disclosures; Stage migration; SICR assessment; macro overlays |
| **Mining (Anglo, Glencore, Impala)** | Hedge accounting for commodity prices; forward contracts; options |
| **Retail (Shoprite, Pick n Pay, Woolworths)** | Trade receivable impairment; provision matrix; store card portfolios |
| **Insurance (Sanlam, Discovery, Old Mutual)** | Financial asset classification; equity investments; FVTPL vs FVOCI |
| **Property (Growthpoint, Redefine)** | Financial liabilities at amortised cost; interest rate hedges |
| **Industrials (Sasol, Eskom)** | Commodity hedges; foreign currency risk; net investment hedges |

JSE-listed entities are required to apply IFRS — their annual reports are excellent real-world study material for seeing how IFRS 9 works in practice. Reviewing a bank's IFRS 9 credit risk disclosure note (e.g., First National Bank's annual report) will show the three-stage ECL model in real numbers.

---

## Quick Reference: IFRS 9 at a Glance

### Classification Matrix

| Business Model + SPPI | Result |
|----------------------|--------|
| Hold to Collect + Pass | Amortised Cost |
| Hold to Collect & Sell + Pass | FVOCI (Debt) |
| Other/Trading + Any | FVTPL |
| Any + Fail | FVTPL |
| Equity instrument | FVTPL (or FVOCI equity option, irrevocable) |

### ECL Stage Summary

| Stage | Trigger | Allowance | Interest Base |
|-------|---------|-----------|--------------|
| 1 | Initial recognition / low credit risk | 12-month ECL | Gross |
| 2 | SICR since initial recognition | Lifetime ECL | Gross |
| 3 | Credit impaired | Lifetime ECL | Net |

### Hedge Type Summary

| Type | Hedged Item | Effective Portion | Ineffective Portion |
|------|-------------|-------------------|---------------------|
| Fair value | Recognized asset/liability/firm commitment | P/L (both sides) | N/A (both in P/L) |
| Cash flow | Forecast transaction/variable rate exposure | OCI | P/L |
| Net investment | Net investment in foreign operation | OCI (translation reserve) | P/L |

---

## Key Takeaways

1. **Three standards govern financial instruments**: IAS 32 (presentation), IFRS 9 (measurement), IFRS 7 (disclosures)
2. **IFRS 7** requires carrying amounts by category, fair value hierarchy levels, and extensive risk disclosures
3. **Credit risk disclosures** under IFRS 7/IFRS 9 include loss allowance roll-forwards by stage — a key IFRS 9-specific disclosure
4. **IAS 32 offsetting** requires both legal enforceability AND net settlement intent — most netting arrangements don't qualify
5. **Transition**: classification reassessed at transition date; opening ECL adjusts retained earnings; comparatives not restated; FVOCI equity OCI option can be elected at transition
6. **Exam technique**: state your basis, show your tables, conclude every sub-question, distinguish discussion from calculation marks
7. **South African context**: understand which industries face which IFRS 9 issues — JSE annual reports are real-world examples

---

**← Previous: Part 8 — Hedge Accounting: IFRS 9 Framework**

*This completes the IFRS 9 & IAS 39 Financial Instruments Guide.*
