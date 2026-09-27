# IFRS 9 Financial Instruments — Part 6: Impairment — The Expected Credit Loss (ECL) Model

## The Paradigm Shift: From Incurred Loss to Expected Loss

Of all the changes IFRS 9 introduced, the impairment model is arguably the most significant — and the most complex. Understanding *why* the model changed is essential to understanding *how* it works.

### The IAS 39 Incurred Loss Model: The Problem

Under IAS 39, an impairment loss on a financial asset was only recognized when there was **objective evidence of impairment** — i.e., after a loss event had *already occurred*.

This "trigger event" approach meant:
- A perfectly healthy borrower who had never missed a payment could have a loan with significant credit risk buildup — but no impairment was recognized until something happened
- Banks were recognizing losses too late, in large, sudden amounts
- The 2008 financial crisis saw banks writing off billions overnight because losses had been accumulating invisibly under the incurred loss model

The G20 and IASB were unambiguous: the incurred loss model was "too little, too late."

### The IFRS 9 Expected Credit Loss (ECL) Model: The Solution

IFRS 9 replaced the incurred loss model with a model based on **expected future losses**. Under ECL:

> **Impairment is recognized from the moment a financial asset is first recognized**, because every loan carries some probability of default — even if very small.

This means:
- Day 1 loss allowances exist for all in-scope assets (even performing ones)
- Loss allowances increase as credit quality deteriorates
- Losses are recognized earlier, in smaller, more frequent amounts

---

## Scope of the Impairment Model

The ECL impairment model applies to:
- Financial assets at **amortised cost**
- Financial assets at **FVOCI (debt instruments)**
- **Lease receivables** (IFRS 16)
- **Contract assets** (IFRS 15)
- **Loan commitments** (not in scope of FVTPL)
- **Financial guarantee contracts** (not measured at FVTPL)

It does **NOT** apply to:
- Financial assets at FVTPL
- Equity instruments (at FVTPL or FVOCI equity option)

---

## The Three-Stage (General) Model

> The three-stage model is the heart of IFRS 9 impairment. If you understand stages, SICR triggers, and interest base (gross vs net), you can handle any ECL question thrown at you.

The general ECL model classifies financial assets into three stages based on how their credit quality has changed since initial recognition:

```
STAGE 1                    STAGE 2                    STAGE 3
(Performing)               (Underperforming)          (Credit-Impaired)

Initial recognition    →   Significant increase    →   Credit impairment
                           in credit risk (SICR)       has occurred

12-month ECL               Lifetime ECL               Lifetime ECL
Interest on GROSS          Interest on GROSS           Interest on NET
carrying amount            carrying amount             carrying amount
```

### Stage 1: Performing Assets

**Condition**: No significant increase in credit risk since initial recognition (or credit risk is low at reporting date)

**Loss Allowance**: 12-month ECL — the ECL resulting from default events possible within the next 12 months

**Interest**: Calculated on the **gross carrying amount** (before deducting loss allowance)

> [!NOTE]
> 12-month ECL does not mean the loss allowance equals 12 months' worth of cash flows. It means the probability of default within 12 months, multiplied by the loss given default, multiplied by the exposure at default — i.e., the portion of lifetime losses attributable to defaults that could occur in the next 12 months.

### Stage 2: Significant Increase in Credit Risk

**Condition**: Credit risk has significantly increased since initial recognition, but the asset is not yet credit-impaired

**Loss Allowance**: **Lifetime ECL** — the ECL resulting from all possible default events over the expected life of the instrument

**Interest**: Still calculated on the **gross carrying amount**

The jump from Stage 1 to Stage 2 triggers a potentially large increase in the loss allowance — this is where the "cliff effect" can occur.

### Stage 3: Credit-Impaired

**Condition**: One or more loss events have occurred that have a detrimental impact on estimated future cash flows

**Loss Allowance**: **Lifetime ECL** (same as Stage 2)

**Interest**: Calculated on the **net carrying amount** (gross carrying amount minus loss allowance — i.e., on the "credit-adjusted" balance)

This is the key operational difference from Stage 2: interest income is calculated on the reduced carrying amount, reflecting that the asset is credit-impaired.

**Indicators of Credit Impairment:**
- Significant financial difficulty of the borrower
- Breach of contract (e.g., default or delinquency in interest/principal payments)
- Lender granting concession for economic or contractual reasons related to borrower's difficulty
- Becoming probable that borrower will enter bankruptcy
- Disappearance of an active market for the financial asset

---

## Calculating ECL: The Components

ECL is calculated as:

```
ECL = PD × LGD × EAD × Discount factor
```

| Component | Definition | Example |
|-----------|------------|---------|
| **PD** | Probability of Default — likelihood the borrower defaults | 2% chance of default in 12 months |
| **LGD** | Loss Given Default — percentage of exposure lost if default occurs | 45% of outstanding balance lost |
| **EAD** | Exposure at Default — outstanding amount at time of default | R1,000,000 |
| **Discount factor** | Discounts the expected loss back to reporting date using EIR | EIR = 8% |

### SA Context: ECL in Practice

The ECL model has had a profound impact on South African financial institutions. The Big 4 banks — **FNB, ABSA, Nedbank, and Standard Bank** — carry ECL allowances worth tens of billions of rands on their home loan, vehicle finance, and corporate lending books.

Key SA-specific considerations when calculating ECL:
- **Macroeconomic overlays**: SA banks must incorporate forward-looking factors such as GDP growth forecasts, the unemployment rate, load shedding severity, and ZAR/USD exchange rate projections into their PD and LGD estimates
- **SOE credit risk**: Exposure to state-owned entities (Eskom, Transnet) requires careful SICR assessment given the well-documented financial difficulties of these borrowers
- **Unsecured lending**: SA has a significant unsecured lending market (personal loans, store cards). These portfolios typically have higher PDs and LGDs, driving larger ECL allowances

> [!TIP]
> In exam questions, the PD, LGD, and EAD components are usually given to you. The skill is assembling them correctly, applying the right stage, and recognizing changes in the loss allowance in P/L.

### 12-Month ECL vs Lifetime ECL

| | 12-Month ECL (Stage 1) | Lifetime ECL (Stages 2 & 3) |
|--|------------------------|------------------------------|
| PD horizon | 12-month PD | PD over full remaining life |
| Loss calculation | PD₁₂ₘ × LGD × EAD | Sum of PDₜ × LGD × EADₜ for each year t |
| Result | Smaller allowance | Larger allowance |

---

## Significant Increase in Credit Risk (SICR): The Critical Threshold

The most judgemental aspect of the ECL model is determining when credit risk has increased significantly — this triggers the Stage 1 → Stage 2 transition.

### Key Principle

Compare the **risk of default at the reporting date** with the **risk of default at initial recognition**.

IFRS 9 uses the *change* in credit risk, not the absolute level. A BBB-rated borrower that deteriorates to BB has had a significant increase in credit risk — even though BB is still investment grade.

### Indicators of SICR

**Quantitative:**
- Significant increase in the PD (e.g., PD has doubled since initial recognition)
- Downgrade below a specified credit rating threshold

**Qualitative:**
- Breach of covenants
- Extension of payment terms as an accommodation
- Borrower experiencing significant financial difficulty
- Adverse change in borrower's business, financial, or economic conditions

**30-Day Backstop (IFRS 9.5.5.11):**
There is a rebuttable presumption that credit risk has increased significantly when **contractual payments are more than 30 days past due**. This is a minimum floor — SICR can be triggered earlier.

**SA-Specific SICR Indicators:**
In the South African context, common triggers for SICR include:
- Significant deterioration in a borrower's industry (e.g., construction sector downturn, retail sector under pressure from consumer spending declines)
- Material adverse changes in the operating environment of SOE counterparties
- Borrowers entering business rescue proceedings under the Companies Act
- Sector-wide credit events (e.g., Steinhoff collapse triggering reassessment of related exposures)

### The Low Credit Risk Simplification

If a financial asset has **low credit risk** at the reporting date, the entity may assume there has been no SICR (Stage 1 applies). Low credit risk approximates to an investment-grade equivalent (broadly, a PD comparable to Baa3/BBB− or better).

---

## Measurement of ECL: Probability Weighting

ECL is a **probability-weighted** estimate — it is not a worst-case scenario, nor a best-case scenario. It must reflect:
1. An unbiased and probability-weighted amount
2. The time value of money (discounted at EIR)
3. Reasonable and supportable information available without undue cost or effort

**Example: Probability-Weighted ECL**

A bank has a R5,000,000 loan. At year end:

| Scenario | PD | LGD | Loss | Probability |
|----------|-----|-----|------|-------------|
| No default | 70% | — | 0 | 70% |
| Default, partial recovery | 20% | 40% | R2,000,000 | 20% |
| Default, full loss | 10% | 100% | R5,000,000 | 10% |

**ECL** = (0.70 × R0) + (0.20 × R2,000,000) + (0.10 × R5,000,000)
= R0 + R400,000 + R500,000
= **R900,000** (before discounting)

---

## Recognizing ECL Changes in P/L

Changes in the loss allowance (both increases and decreases) are recognized as **impairment gains or losses in P/L**.

| Movement | P/L Impact |
|----------|-----------|
| Loss allowance increases | Impairment loss (debit P/L) |
| Loss allowance decreases | Impairment gain (credit P/L) — often called "reversal" |

```
Dr  Impairment Loss (P/L)           [increase in allowance]
    Cr  Loss Allowance Account                [balance sheet contra]
```

For **FVOCI debt instruments**, the loss allowance does not reduce the carrying amount on the balance sheet (the asset is carried at fair value). Instead, the loss allowance is recognized in P/L and OCI is adjusted.

---

## The Simplified Approach: Trade Receivables, Lease Receivables, Contract Assets

### Who Can Use It?

The simplified approach is **mandatory** for:
- Trade receivables and contract assets **without a significant financing component**

It is **optional** for:
- Trade receivables WITH a significant financing component
- Lease receivables (under IFRS 16)

### What is the Simplified Approach?

Under the simplified approach, there is no staging. The entity always recognizes **lifetime ECL** — from day one.

This dramatically simplifies the model for entities with large volumes of short-duration receivables (retailers, manufacturers, service companies).

### The Provision Matrix

The most common tool for implementing the simplified approach is a **provision matrix** — a table that applies historical loss rates (adjusted for forward-looking information) to aging buckets of receivables.

**Example: Provision Matrix**

| Aging Bucket | Total Receivables | Historical Loss Rate | Adjusted Loss Rate | ECL |
|-------------|-------------------|---------------------|-------------------|-----|
| Current (0–30 days) | R2,000,000 | 0.3% | 0.5% | R10,000 |
| 31–60 days | R800,000 | 1.2% | 1.8% | R14,400 |
| 61–90 days | R400,000 | 3.5% | 5.0% | R20,000 |
| 91–180 days | R200,000 | 8.0% | 12.0% | R24,000 |
| >180 days | R100,000 | 25.0% | 35.0% | R35,000 |
| **Total** | **R3,500,000** | | | **R103,400** |

**Journal entry if prior year allowance was R80,000:**
```
Dr  Impairment Loss (P/L)            23,400
    Cr  Loss Allowance                          23,400
(Increase from R80,000 to R103,400)
```

> [!IMPORTANT]
> The historical loss rates must be **adjusted for forward-looking information**. If the economy is deteriorating, macroeconomic factors (unemployment trends, GDP forecasts, sectoral outlooks) must be incorporated. Pure historical rates without adjustment are NOT acceptable under IFRS 9.

### SA Context: The Provision Matrix in Practice

South African retailers like **Woolworths Financial Services**, **Mr Price Money**, and **TFG** (The Foschini Group) apply the provision matrix to their store card and credit portfolios. These entities manage hundreds of thousands of individual accounts — applying the general three-stage model to each account individually would be impractical.

When adjusting historical loss rates for forward-looking information, SA entities typically consider:
- **Unemployment rate**: rising unemployment directly increases default rates on consumer credit
- **Interest rate cycle**: SARB repo rate increases raise instalment payments, increasing default probability
- **Consumer confidence index**: a proxy for willingness and ability to pay
- **Load shedding**: prolonged power outages reduce business revenue, affecting both retail customers and SME borrowers

---

## IAS 39 vs IFRS 9 Impairment: Side-by-Side

| Feature | IAS 39 (Incurred Loss) | IFRS 9 (ECL) |
|---------|----------------------|--------------|
| **When recognized** | Only after loss event occurs | From initial recognition |
| **Trigger** | Objective evidence of impairment | Increase in credit risk |
| **Measurement** | Present value of impaired cash flows | PD × LGD × EAD (probability-weighted) |
| **Forward-looking** | No (historical focus) | Yes (must use forward-looking info) |
| **Complexity** | Lower (binary: impaired or not) | Higher (3-stage model, continuous assessment) |
| **Timing of losses** | Too late | Earlier, more gradual |
| **Trade receivables** | Specific or portfolio provision | Provision matrix (simplified approach) |

---

## Worked Example: Three-Stage Model

**Facts:**
Bank lends R10,000,000 to a corporate borrower on 1 January 20X1 at EIR 8%.

**Initial recognition (1 Jan 20X1):**
- Stage 1 (no SICR yet)
- 12-month ECL = PD₁₂ₘ 1% × LGD 40% × EAD R10,000,000 = **R40,000**

```
Dr  Impairment Loss (P/L)            40,000
    Cr  Loss Allowance                          40,000
```

**31 December 20X1 (1 year later):**
- Borrower's industry hit by recession; PD has increased materially since origination
- Assessed as SICR → moves to **Stage 2**
- Lifetime ECL = R480,000 (based on full PD × LGD × EAD schedule over remaining 4 years)

```
Dr  Impairment Loss (P/L)           440,000   ← (480,000 − 40,000)
    Cr  Loss Allowance                         440,000
```

**31 December 20X2:**
- Borrower misses two consecutive interest payments → credit-impaired → **Stage 3**
- Lifetime ECL reassessed = R2,500,000
- Interest income now calculated on NET carrying amount: (R10,000,000 − R2,500,000) × 8% = R600,000

```
Loss allowance increase:
Dr  Impairment Loss (P/L)         2,020,000   ← (2,500,000 − 480,000)
    Cr  Loss Allowance                        2,020,000

Interest income (on net carrying amount):
Dr  Loan Receivable                  600,000
    Cr  Interest Income (P/L)                   600,000
```

---

## Write-offs and Recoveries

### Write-offs

When there is no reasonable expectation of recovery, the **gross carrying amount** of the financial asset is reduced directly:

```
Dr  Loss Allowance              [amount written off]
    Cr  Loan/Receivable                          [amount written off]
```

Note: Write-offs reduce both the gross carrying amount AND the loss allowance — they do not affect the NET carrying amount (which was already reflecting the expected loss).

### Recoveries

If a written-off amount is subsequently recovered:

```
Dr  Cash
    Cr  Impairment Gain (P/L)
```

---

## Purchased or Originated Credit-Impaired (POCI) Assets

### What is a POCI Asset?

A financial asset is **purchased or originated credit-impaired** when one or more events that have a detrimental impact on estimated future cash flows have already occurred at the time the entity recognizes the asset. In other words, the asset is already impaired on Day 1.

**Examples:**
- A bank buys a portfolio of non-performing loans at a deep discount from another bank
- An entity originates a loan to a borrower already in financial distress, priced to reflect the credit risk
- A debt instrument acquired in a distressed debt market

### Why Does POCI Matter?

POCI assets follow different rules because the credit impairment is already reflected in the purchase price. If the entity applied the normal three-stage model, it would recognise a massive Day 1 loss allowance on an asset it bought *knowing* it was impaired — and already paid a reduced price for that risk. This would be economically misleading.

### The POCI Rules

| Feature | Normal Asset | POCI Asset |
|---------|-------------|------------|
| Day 1 loss allowance | 12-month ECL recognised | No separate loss allowance |
| EIR used | Original EIR | **Credit-adjusted EIR** (reflects expected credit losses in the discount rate) |
| Subsequent impairment | Changes in ECL vs initial recognition | Changes in **lifetime ECL** from purchase date |
| Staging | Stages 1 → 2 → 3 | No staging — always uses lifetime ECL |
| Interest income | Gross (Stages 1&2) or Net (Stage 3) | Always on **net carrying amount** (amortised cost) |

### Worked Example: POCI Asset

**Facts:**
A South African bank purchases a portfolio of non-performing home loans with a face value of R50,000,000 for R30,000,000. The discount reflects the expected credit losses already embedded in the portfolio. The credit-adjusted EIR (incorporating expected defaults) is 14%.

**At initial recognition:**
```
Dr  Loan Portfolio (POCI)          30,000,000
    Cr  Cash                                  30,000,000
```

No separate loss allowance is recognised. The R20,000,000 discount already reflects expected credit losses through the credit-adjusted EIR.

**Subsequently:**
- Interest income is calculated at 14% on the carrying amount
- Only **changes** in lifetime ECL from the purchase date are recognised as impairment gains or losses
- If conditions deteriorate further: additional impairment loss in P/L
- If conditions improve (higher recoveries than expected): impairment gain in P/L — carrying amount can increase above initial recognition amount

> [!CAUTION]
> Students commonly apply the normal three-stage model to POCI assets. The giveaway in an exam question is that the asset was acquired at a significant discount or was already in default at purchase. When you see this — apply POCI rules, not the general model.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Confusing 12-month ECL with 12 months' of cash flows | 12-month ECL = losses from defaults in the next 12 months, not 12 monthly payments |
| Forgetting to use probability-weighted amounts | ECL is NOT the worst-case loss — it's the probability-weighted expected loss |
| Applying the general model to trade receivables | The simplified approach is mandatory for trade receivables without significant financing |
| Ignoring the SICR assessment | Staging is not optional — always assess whether credit risk has significantly increased |
| Using historical loss rates without forward-looking adjustment | IFRS 9 requires current and forward-looking information |
| Calculating interest on gross carrying amount for Stage 3 | Stage 3: interest on NET (gross minus loss allowance) carrying amount |
| Forgetting that FVOCI debt instruments also need impairment | The ECL model applies to FVOCI debt — the loss goes to P/L (even though asset is at FV) |
| Applying the three-stage model to POCI assets | POCI assets use a credit-adjusted EIR and only recognise changes in lifetime ECL from purchase — no staging |

---

## Exam Technique

### Step-by-Step for ECL Questions

**Step 1**: Identify the scope — is this asset subject to the ECL model?

**Step 2**: Identify the approach — General (3-stage) or Simplified?

**Step 3 (General model)**: Determine the stage — assess SICR, check 30-day backstop

**Step 4**: Calculate the loss allowance (12-month ECL or Lifetime ECL as applicable)

**Step 5**: Calculate the movement (closing allowance − opening allowance)

**Step 6**: Recognize in P/L; present journal entries

**Step 7**: Calculate interest income — gross carrying amount (Stages 1 & 2) or net carrying amount (Stage 3)

### Mark Allocation Tip

A 10-mark ECL question typically allocates:
- Stage determination with reasoning: 3 marks
- ECL calculation (PD × LGD × EAD): 3 marks
- Journal entries or P/L impact: 2 marks
- Interest income calculation: 2 marks

---

## Key Takeaways

1. **IAS 39 (incurred loss)** recognized losses too late — only after a trigger event
2. **IFRS 9 (ECL)** recognizes losses from day one, based on forward-looking probability-weighted estimates
3. **Three stages**: Stage 1 (12-month ECL, interest on gross), Stage 2 (lifetime ECL, interest on gross), Stage 3 (lifetime ECL, interest on net)
4. **SICR** is the trigger for Stage 1 → 2; 30 days past due is the backstop
5. **Simplified approach** (always lifetime ECL) is mandatory for trade receivables without significant financing
6. **Provision matrix** is the practical tool for trade receivables — historical rates MUST be adjusted for forward-looking factors (unemployment, interest rates, GDP, and in SA, load shedding impact)
7. ECL applies to amortised cost AND FVOCI debt instruments
8. **POCI assets** (purchased already impaired) use a credit-adjusted EIR, have no Day 1 loss allowance, and only recognise changes in lifetime ECL from acquisition

---

**← Previous: Part 5 — Derecognition**

**Next: Part 7 — Hedge Accounting: IAS 39 Framework →**
