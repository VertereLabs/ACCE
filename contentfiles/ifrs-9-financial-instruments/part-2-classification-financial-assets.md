# IFRS 9 Financial Instruments — Part 2: Classification of Financial Assets

## Why Classification Matters

The category into which a financial asset is classified determines *everything* about how it is measured — both at initial recognition and subsequently. Get the classification wrong, and every number that flows from it is wrong.

Classification also determines whether fair value changes hit your **profit or loss** (affecting earnings per share and bonuses) or **other comprehensive income** (bypassing P/L entirely). This is not an academic distinction — it has real economic consequences for reported performance.

---

## IAS 39: The Old Four-Category Model

Under IAS 39, financial assets were classified into **four categories**, primarily driven by *management intention*:

| Category | Abbreviation | Basis |
|----------|-------------|-------|
| Fair Value Through Profit or Loss | FVTPL | Held for trading OR designated at inception |
| Held-to-Maturity | HTM | Positive intention AND ability to hold to maturity |
| Loans and Receivables | L&R | Not quoted in an active market, fixed/determinable payments |
| Available-for-Sale | AFS | Residual category — everything else |

### The Problems with IAS 39

**1. Management intention was unreliable**
Classification depended on what management *said* they intended, not what was economically appropriate. This created scope for manipulation.

**2. The "Tainting Rule" (HTM)**
If an entity sold *any* HTM investment before maturity (except in very narrow circumstances), it was "tainted" and had to reclassify *all* HTM investments to AFS for the current year and the next two years. This made HTM impractical.

**3. The AFS "Recycling" Problem**
Fair value changes on AFS instruments went to OCI. When the asset was sold, those gains were "recycled" to P/L — creating artificial volatility in reported earnings.

**4. Too many categories, too many exceptions**
IAS 39 had layer upon layer of exceptions, carve-outs, and specific guidance that made it enormously complex and difficult to apply consistently.

---

## IFRS 9: The New Three-Category Model

IFRS 9 replaces the four IAS 39 categories with **three categories**, based on objective criteria rather than management intention:

| Category | Measurement | P/L or OCI? |
|----------|-------------|-------------|
| **Amortised Cost (AC)** | Initial FV → amortised cost thereafter | Interest income via EIR in P/L |
| **Fair Value Through Other Comprehensive Income (FVOCI)** | Fair value | FV changes in OCI; interest in P/L |
| **Fair Value Through Profit or Loss (FVTPL)** | Fair value | All FV changes in P/L |

### The Two-Step Classification Test

Classification under IFRS 9 is determined by applying **two tests in sequence**:

```
Step 1: Business Model Test
         ↓
Step 2: SPPI Test (Cash Flow Characteristics)
         ↓
Classification Result
```

Both tests must be applied. The outcome of the two tests together determines the category.

---

## Step 1: The Business Model Test

> Master the two-step classification test cold. It is the gateway to everything else in IFRS 9 — measurement, impairment, and even disclosure all flow from the classification you determine here.

### What is a Business Model?

The business model reflects how an entity manages its financial assets to generate cash flows. It is determined at a level *higher than individual instruments* — it is about the portfolio or group of assets managed together.

> [!IMPORTANT]
> The business model is a **fact**, not a choice. It is determined by observable evidence — what management actually does, not what they claim they will do. Evidence includes: how performance is evaluated, how managers are compensated, the frequency and volume of sales activity, and stated policies.

### Three Business Model Categories

**Business Model 1: Hold to Collect**
- Objective: Collect the contractual cash flows (principal + interest)
- Sales are incidental — they happen but are not central to the objective
- Examples: A bank holding mortgage loans, a company holding bonds to maturity
- **Result**: Points toward Amortised Cost (if SPPI also passes)

**Business Model 2: Hold to Collect AND Sell**
- Objective: Both collect contractual cash flows AND sell the assets
- Both activities are integral to achieving the objective
- Examples: A bank managing a liquidity portfolio, an insurer managing assets to meet policyholder claims
- **Result**: Points toward FVOCI (if SPPI also passes)

**Business Model 3: Other (Trading)**
- Objective: Primarily selling assets to realize fair value gains
- Also applies when no other business model fits
- Examples: A trading book, investments held for speculative purposes
- **Result**: FVTPL (regardless of SPPI test result)

### Sales Activity — What's Acceptable in "Hold to Collect"?

A common exam question is: "Does selling assets mean the business model is NOT hold to collect?"

The answer is nuanced. Sales are **not inconsistent** with hold-to-collect if they are:

| Reason for Sale | Consistent with Hold to Collect? |
|----------------|----------------------------------|
| Credit deterioration (selling a deteriorating loan) | ✓ Yes |
| Low frequency and insignificant value | ✓ Yes |
| Close to maturity (cash flows substantially collected) | ✓ Yes |
| Increasing sales frequency and volume | ✗ No |
| Sales to generate profit from fair value movements | ✗ No |

> [!TIP]
> **Exam technique**: When assessing the business model, look for the *overall pattern*, not isolated transactions. One sale doesn't change a business model. Consistent, repeated selling to capture gains does.

---

## Step 2: The SPPI Test

### What Does SPPI Mean?

**Solely Payments of Principal and Interest**

For a financial asset to be measured at amortised cost or FVOCI, its contractual cash flows must consist *solely* of payments of principal and interest on the principal amount outstanding.

This is a test of **cash flow characteristics** — what does the contract actually say you will receive?

### What is "Principal"?

The fair value of the financial asset at initial recognition. As repayments are made, the outstanding principal amount decreases.

### What is "Interest"?

Consideration for:
- **The time value of money** (compensation for the passage of time)
- **Credit risk** (compensation for the risk of default)
- **Liquidity risk and other basic lending risks** (compensation for other lending-related costs)
- **Administrative costs** and **profit margin** (reasonable)

### Does the Instrument PASS the SPPI Test?

| Cash Flow Feature | SPPI Result | Explanation |
|------------------|-------------|-------------|
| Fixed rate bond | ✓ Pass | Simple interest on principal |
| Floating rate bond (JIBAR + spread) | ✓ Pass | Rate changes but still time value + credit risk |
| Inflation-linked bond | ✓ Pass* | Updating principal for inflation is consistent with time value |
| Bond with prepayment option | ✓ Pass* | If prepayment amount ≈ outstanding principal + accrued interest |
| Convertible bond (equity conversion) | ✗ Fail | Equity conversion feature is not interest or principal |
| Leveraged interest features (e.g., 3× JIBAR) | ✗ Fail | Leverage amplifies beyond time value compensation |
| Return linked to equity index or commodity price | ✗ Fail | Not a compensation for time value or credit risk |
| Profit-participating loans | ✗ Fail | Return linked to borrower performance |
| Non-recourse loans (asset-specific) | ✓ Pass | Restriction of recourse doesn't disqualify if still P+I |

*Subject to conditions

### The "Insignificant Effect" Exception

If a cash flow feature could modify timing or amount, but the effect on cash flows is **de minimis** (i.e., insignificant in all circumstances), the asset may still pass SPPI.

### The Contractually Linked Instruments (CLI) Trap

When an entity invests in tranches of a structured vehicle (e.g., a CDO or CLO), the SPPI test must "look through" to the underlying pool of instruments. Tranches that concentrate credit risk (subordinated tranches) typically fail SPPI.

> [!CAUTION]
> **Exam trap**: Students sometimes assume any bond passes SPPI automatically. Always check for equity conversion features, performance-linked returns, or leveraged interest rates — these are automatic SPPI failures.

---

## Putting It Together: The Classification Matrix

| Business Model | SPPI Pass? | Classification |
|----------------|------------|----------------|
| Hold to Collect | ✓ Yes | **Amortised Cost** |
| Hold to Collect | ✗ No | **FVTPL** |
| Hold to Collect & Sell | ✓ Yes | **FVOCI (Debt)** |
| Hold to Collect & Sell | ✗ No | **FVTPL** |
| Other/Trading | Any | **FVTPL** |

### The "Override" to FVTPL: The Fair Value Option (FVO)

Even if an asset would otherwise be classified at amortised cost or FVOCI, an entity may **irrevocably designate** it at FVTPL at initial recognition if doing so **eliminates or significantly reduces an accounting mismatch**.

**Example of FVO:**
A bank issues fixed-rate debt (liability at amortised cost) and holds fixed-rate bonds (asset would normally be amortised cost). If interest rates change, the asset's fair value moves but the liability doesn't — creating a mismatch. The bank can designate the bonds at FVTPL so both sides reflect market values, eliminating the mismatch.

---

## Equity Instruments: A Special Case

Equity instruments (shares in other companies) **always fail the SPPI test** — dividends are not "principal and interest." Therefore:

- **Default**: FVTPL (all fair value changes + dividends in P/L)
- **Irrevocable OCI Option**: At initial recognition, an entity may designate an equity investment as FVOCI **if it is not held for trading**

### The FVOCI Equity Option — Key Differences from FVOCI Debt

| Feature | FVOCI (Debt Instrument) | FVOCI (Equity — OCI Option) |
|---------|------------------------|----------------------------|
| Reclassification to P/L on sale | ✓ Yes (recycled) | ✗ No (never recycled) |
| Impairment model applies | ✓ Yes | ✗ No |
| Interest income in P/L | ✓ Yes (EIR method) | ✗ No (dividends only) |
| OCI accumulation on sale | Transferred to P/L | Transferred to retained earnings |

> [!IMPORTANT]
> **The no-recycling rule for equity OCI** is a deliberate policy choice. The IASB decided that recycling created artificial P/L volatility. However, this means gains/losses on equity investments designated at FVOCI **never appear in P/L** — not even when sold. This is a significant difference from IAS 39 AFS treatment, where gains and losses *were* recycled on disposal.

---

## IAS 39 vs IFRS 9 Classification: Side-by-Side Comparison

| IAS 39 Category | IFRS 9 Equivalent | Key Difference |
|-----------------|-------------------|----------------|
| FVTPL (held-for-trading) | FVTPL | Essentially the same |
| FVTPL (designated — FVO) | FVTPL (FVO) | IFRS 9 FVO criteria are similar but own credit risk changes go to OCI for liabilities |
| Held-to-Maturity (HTM) | Amortised Cost | No more "tainting rule" under IFRS 9 |
| Loans and Receivables (L&R) | Amortised Cost | More principled basis (business model + SPPI) |
| Available-for-Sale (AFS) | FVOCI (debt) or FVOCI equity option | Equity: no recycling under IFRS 9; debt: impairment model now applies |

---

## Reclassification

Under IFRS 9, reclassification of financial assets is **only permitted** when the entity **changes its business model** for managing financial assets.

- Changes to business model are expected to be **very infrequent**
- Must be significant to the entity's operations (e.g., acquisition/disposal of a business line)
- Cannot be triggered by a change in intention for a specific instrument
- Applied **prospectively** from the reclassification date

Under IAS 39, the rules were different — certain transfers between categories were permitted (with restrictions), and the tainting rule forced reclassifications.

> [!NOTE]
> Reclassification of **financial liabilities** is **not permitted** under either IAS 39 or IFRS 9.

---

## Worked Example: Classifying a Portfolio of Financial Assets

**Facts:**
XYZ Bank holds the following financial assets:

1. **Home loan portfolio** — Fixed rate mortgages. Managed to collect monthly payments. Occasional sales when borrowers default and security is sold.

2. **Government bond portfolio** — JSE-listed bonds. Portfolio is managed to both collect coupon payments and sell bonds when the yield curve shifts to manage liquidity.

3. **Listed equity shares in ABC Ltd** — Purchased because the treasury desk believes the share price will rise. Not designated under OCI option.

4. **Structured note** — Returns are linked to the JSE All Share Index, with capital protection. Repayment = greater of initial investment or 120% × JSE return.

5. **Trade receivables** — Standard 30-day receivables from corporate clients. Business model is simply to collect the amount owed.

**Classification:**

| Asset | Business Model | SPPI? | Classification | Reasoning |
|-------|---------------|-------|----------------|-----------|
| 1. Home loans | Hold to Collect | ✓ Pass | Amortised Cost | Fixed P+I; sales are credit-driven (acceptable) |
| 2. Govt bonds | Hold to Collect & Sell | ✓ Pass | FVOCI (Debt) | Both objectives are integral |
| 3. ABC shares | Other/Trading | N/A (equity) | FVTPL | Held for capital gain; no OCI designation |
| 4. Structured note | N/A | ✗ Fail | FVTPL | Cash flows linked to equity index — not SPPI |
| 5. Trade receivables | Hold to Collect | ✓ Pass | Amortised Cost | Simple right to receive cash |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Applying SPPI before Business Model | Always apply business model first — if business model = "other/trading", SPPI is irrelevant |
| Assuming all bonds pass SPPI | Check for equity conversion, leveraged interest, index-linked returns |
| Confusing FVOCI debt and FVOCI equity | Debt: recycled to P/L on sale; Equity OCI option: NEVER recycled |
| Thinking sales automatically change the business model | Frequency, volume, and reason for sales matter — isolated credit-driven sales don't change the model |
| Confusing IAS 39 AFS with IFRS 9 FVOCI | Under IAS 39, equity AFS gains were recycled. Under IFRS 9 equity FVOCI option, they are not |
| Treating the FVTPL FVO as a free choice | The FVO is only available to eliminate or significantly reduce an accounting mismatch |

---

## Exam Technique

### Classification Question Framework

When asked to classify a financial asset under IFRS 9:

**Step 1**: Confirm it is a financial asset within scope of IFRS 9

**Step 2**: Is it an equity instrument?
- Yes → Default FVTPL. Consider whether the OCI option has been/could be elected.
- No (debt instrument) → Continue to Step 3

**Step 3**: Apply the Business Model Test
- Describe the business model (hold to collect / hold to collect & sell / other)
- Support with evidence from the facts

**Step 4**: Apply the SPPI Test
- Are cash flows solely payments of principal and interest?
- Identify any features that might cause a fail (leverage, equity-linking, etc.)

**Step 5**: Conclude on classification using the matrix

### Mark Allocation Tip

A 4-mark classification question typically wants:
- Business model identification + justification (2 marks)
- SPPI assessment (1 mark)
- Correct classification conclusion (1 mark)

---

## Key Takeaways

1. **IAS 39 had four categories** based on management intention; **IFRS 9 has three** based on objective criteria
2. Classification is determined by the **Business Model Test** (how are assets managed?) AND the **SPPI Test** (what are the contractual cash flows?)
3. **Business model = Hold to Collect + SPPI pass** → Amortised Cost
4. **Business model = Hold to Collect & Sell + SPPI pass** → FVOCI (Debt)
5. **Anything else, or SPPI fail** → FVTPL
6. **Equity instruments** default to FVTPL; the irrevocable OCI option (no recycling) is available for non-trading equity investments
7. **Reclassification** is only permitted on a genuine change of business model — expected to be very rare

---

**← Previous: Part 1 — Scope & Introduction**

**Next: Part 3 — Measurement of Financial Assets →**
