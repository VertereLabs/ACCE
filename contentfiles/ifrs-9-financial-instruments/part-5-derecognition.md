# IFRS 9 Financial Instruments — Part 5: Derecognition

## Why Derecognition Matters

Derecognition is the process of removing a financial asset or financial liability from an entity's statement of financial position. While it sounds like a simple "when do I take it off the books?" question, derecognition of financial assets is among the most complex areas of IFRS 9 — and a fertile source of exam questions.

The core challenge: **when an asset is transferred, is it really gone?** Or has the entity retained exposure to its risks and rewards?

---

## Derecognition of Financial Assets

### The Decision Tree

> Learn this decision tree by heart. In the exam, draw it in rough before you start — it keeps you from jumping to conclusions. Derecognition questions reward methodical students who follow each step, not those who guess.

IFRS 9 provides a sequential decision framework for derecognition of financial assets:

```
Step 1: Have the contractual rights to cash flows expired?
        YES → Derecognize ✓
        NO  → Continue

Step 2: Has the entity transferred the asset?
        NO  → Do NOT derecognize (asset stays on balance sheet)
        YES → Continue

Step 3: Has substantially all the risks and rewards been transferred?
        YES → Derecognize ✓
        NO  → Continue

Step 4: Has substantially all the risks and rewards been RETAINED?
        YES → Do NOT derecognize (asset stays on balance sheet)
        NO  → Continue

Step 5 (Mixed situation): Has the entity retained control?
        YES → Recognize asset to extent of continuing involvement
        NO  → Derecognize ✓
```

### Step 1: Expiry of Contractual Rights

The simplest case. If the rights to receive cash flows have lapsed (e.g., a receivable is written off as uncollectable or a bond matures), the asset is derecognized. No transfer is involved.

### Step 2: Transfer of the Asset

A transfer occurs when the entity either:
- **Transfers the contractual rights** to receive the cash flows (outright assignment), OR
- **Retains the rights but assumes an obligation to pass on** those cash flows (pass-through arrangement)

#### Pass-Through Arrangements

For a pass-through to qualify, three conditions must ALL be met:
1. The entity has no obligation to pay unless it collects equivalent amounts from the original asset
2. Transfer of the collected cash flows to the eventual recipients is **not permitted to be delayed** beyond short periods
3. The entity has **no right to reinvest** those cash flows (except short-term investments in cash/cash equivalents during settlement periods)

### Step 3 & 4: The Risks and Rewards Test

This is the heart of the derecognition assessment.

> **"Risks and rewards"** refers primarily to exposure to **variability in cash flows** — both positive (upside from early repayment, favorable rates) and negative (credit losses, interest rate risk).

| Scenario | Risks & Rewards Assessment | Treatment |
|----------|---------------------------|-----------|
| Outright sale (no recourse, no repurchase obligation) | Substantially all transferred | Derecognize |
| Sale with full recourse for credit losses | Substantially all retained | Continue recognition |
| Sale with partial credit guarantee | Mixed | Assess continuing involvement |
| Repo agreement (sell + agree to repurchase at fixed price) | Substantially all retained (price risk stays) | Continue recognition |
| Securities lending | Substantially all retained (price risk stays) | Continue recognition |
| Sale of a senior tranche (junior retained) | Depends on structure | Assess retained exposure |

> [!TIP]
> The risks and rewards test is not a precise calculation — it is a "substantially all" judgement. In practice, if an entity retains any credit risk or interest rate variability, carefully assess whether that constitutes "substantial" retention.

### Step 5: The Control Test (Continuing Involvement)

When the risks and rewards outcome is mixed (neither substantially transferred nor substantially retained), the entity looks to **control**.

**Control** is retained if the entity has the practical ability to sell the transferred asset unilaterally. If control is retained, the entity recognizes the asset to the extent of its **continuing involvement**.

#### Continuing Involvement Accounting

Continuing involvement represents the maximum exposure to changes in value of the transferred asset.

**Example:** Entity sells a loan receivable for R1,000,000 but provides a credit guarantee up to R200,000 maximum loss.

- The entity derecognizes the asset (transferred most risks/rewards) but retains a continuing involvement of R200,000
- Recognize: A liability for the guarantee of R200,000 (initially at fair value)
- The asset is "retained" only to the extent of R200,000

---

## Derecognition in Practice: Common Scenarios

### Scenario 1: Factoring of Trade Receivables

A South African retailer sells R5,000,000 of trade receivables to a factor (financial institution) for R4,800,000.

**With recourse**: The retailer bears all credit risk. Substantially all risks retained. → **Do NOT derecognize**. Treat as a secured borrowing.

```
Dr  Cash                           4,800,000
Dr  Discount (Finance Cost)          200,000
    Cr  Financial Liability                     5,000,000
```

**Without recourse**: The factor bears all credit risk. Substantially all risks transferred. → **Derecognize**.

```
Dr  Cash                           4,800,000
Dr  Loss on Derecognition            200,000
    Cr  Trade Receivables                       5,000,000
```

> [!CAUTION]
> Many "sale" arrangements in practice are actually secured borrowings. The legal form says "sale" but the economic substance is that the original holder still bears the risk. IFRS 9 always looks to **substance over form**.

### Scenario 2: Repurchase Agreements (Repos)

Entity sells government bonds with fair value R10,000,000 and simultaneously agrees to repurchase them in 90 days at R10,200,000 (a fixed price).

- The entity bears the full risk of price changes between now and repurchase
- Substantially all risks retained → **Do NOT derecognize**

```
Dr  Cash                          10,000,000
    Cr  Financial Liability (Repo)             10,000,000

(Interest expense @ EIR over 90-day term)
```

### Scenario 3: Securitisation

Entity securitises a portfolio of home loans. It transfers R100,000,000 of loans to a Special Purpose Vehicle (SPV) which issues senior (R80,000,000) and junior (R20,000,000) notes. The entity retains the junior notes.

- Senior notes: investors bear the first R80m of value / risk
- Junior notes: entity bears losses first (first-loss piece)

**Assessment:**
The entity retains exposure to variability in cash flows (through the junior notes and any credit enhancement). The portion of risk retained must be quantified. The entity derecognizes only the portion for which risks and rewards have been genuinely transferred (senior notes to external investors).

---

## Derecognition of Financial Liabilities

Derecognition of financial liabilities is more straightforward than assets.

### When to Derecognize

A financial liability is derecognized when it is **extinguished** — i.e., when the obligation is:
- **Discharged** (paid in full)
- **Cancelled** (creditor formally releases the obligation)
- **Expired** (the obligation has legally lapsed)

### Gain or Loss on Derecognition

```
Gain/Loss = Carrying Amount of Liability − Amount Paid to Settle
```

A gain arises when the entity pays *less* than the carrying amount (e.g., buys back bonds in the open market at a discount). A loss arises when more is paid.

### Worked Example: Early Redemption

Entity has bonds on its books with a carrying amount of R2,050,000 (amortised cost, partially through their term). It repurchases them in the open market for R1,980,000.

```
Dr  Bond Payable                   2,050,000
    Cr  Cash                                   1,980,000
    Cr  Gain on Extinguishment (P/L)              70,000
```

### Part Extinguishment

If an entity repurchases only part of its bonds:

1. Allocate the carrying amount between the part redeemed and the part retained (based on relative fair values at the repurchase date)
2. Derecognize the portion bought back
3. Recognize the resulting gain/loss in P/L

---

## Substantial Modification of Financial Liabilities

(Introduced briefly in Part 4 — fuller treatment here)

If a financial liability is **renegotiated or modified**, the entity must determine:

**10% Test:**
Compare the PV of the new cash flows (discounted at the **original EIR**) with the PV of the original remaining cash flows.

| PV Difference | Treatment |
|--------------|-----------|
| ≥ 10% | **Substantial** → Derecognize old; recognize new at FV; gain/loss in P/L |
| < 10% | **Not substantial** → Adjust carrying amount; amortise difference using original EIR |

> [!NOTE]
> Even if the 10% quantitative test is not breached, a modification may still be substantial if there has been a **qualitative change** — e.g., a change in the currency of the borrowing, conversion from fixed to floating rate, or change of debtor. Use judgement.

### Treatment of Non-Substantial Modification

For a non-substantial modification, the new carrying amount is calculated as the PV of the modified cash flows discounted at the **original EIR**. The difference between the old carrying amount and this new PV is recognized immediately in P/L.

### Worked Example: Debt Modification

**Facts:**
- Loan payable: carrying amount R3,000,000; original EIR = 12%; 4 years remaining
- Bank agrees to extend the term by 1 year and reduce the interest rate from 12% to 9%
- New cash flows (PV at original 12% EIR): R2,650,000

**10% Test:**
PV of original remaining cash flows at 12% = R3,000,000 (equal to carrying amount, simplification)
PV of new cash flows at 12% = R2,650,000
Difference = R350,000 / R3,000,000 = 11.7% → **Substantial**

**Journal:**
```
Dr  Financial Liability (old)      3,000,000
    Cr  Financial Liability (new @ FV)         2,650,000
    Cr  Gain on Modification (P/L)               350,000
```

New liability recognized at R2,650,000 and measured at amortised cost using the new EIR (9%).

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Automatically derecognizing when legal title transfers | Substance over form: test risks and rewards, not legal form |
| Ignoring continuing involvement | When risks and rewards are mixed, quantify the retained exposure |
| Treating repos as sales | Repos retain risks and rewards → secured borrowings, not sales |
| Using the new EIR (not original) for the 10% test | The 10% test uses the ORIGINAL EIR to discount both old and new cash flows |
| Forgetting that debt modification gains/losses go to P/L | Both substantial and non-substantial modification adjustments are recognized in P/L |
| Treating full recourse factoring as a sale | With full recourse, credit risk is retained → it's a secured borrowing |

---

## Exam Technique

### Derecognition of Assets — Framework to Apply

**Step 1**: Have the contractual rights expired? If yes → derecognize.

**Step 2**: Has there been a transfer? If no → keep on balance sheet.

**Step 3**: Assess risks and rewards:
- Substantially all transferred → derecognize; calculate gain/loss
- Substantially all retained → keep on balance sheet; treat as secured borrowing
- Mixed → assess control and continuing involvement

**Step 4**: If derecognized, calculate:
```
Gain/Loss = Proceeds received − Carrying amount ± Fair value of any retained interest
```

### Mark Allocation Tip

Derecognition questions often earn marks for the *reasoning*, not just the conclusion. State:
- Which test applies (risks and rewards)
- What specific risk exposure is retained or transferred
- The accounting consequence with a journal entry or balance sheet extract

---

## Key Takeaways

1. **Derecognition of assets** follows a sequential test: expiry → transfer → risks & rewards → control
2. **Substance over form**: legal sale ≠ accounting derecognition if risks are retained
3. **Repos and full-recourse factoring** are secured borrowings — the asset stays on balance sheet
4. **Continuing involvement**: when risks/rewards are mixed, only the retained exposure keeps the asset on balance sheet
5. **Derecognition of liabilities**: when discharged, cancelled, or expired; gain/loss = carrying amount − settlement amount
6. **Substantial modification** (10% test using original EIR): triggers derecognition of old liability and recognition of new one

---

**← Previous: Part 4 — Financial Liabilities**

**Next: Part 6 — Impairment: The Expected Credit Loss Model →**
