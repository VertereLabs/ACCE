# IFRS 9 Financial Instruments — Part 4: Financial Liabilities — Classification & Measurement

## The Asymmetry Between Assets and Liabilities

When IFRS 9 was developed, the IASB made a deliberate choice: overhaul the classification of **financial assets** comprehensively, but make only targeted changes to **financial liabilities**. Why? Because the concerns that drove IFRS 9 (the 2008 crisis, incurred loss model, too many asset categories) were primarily about assets. The IAS 39 treatment of most financial liabilities was considered broadly appropriate.

The result is that financial liabilities under IFRS 9 look very similar to IAS 39 — with one important exception: **own credit risk on FVO liabilities**.

---

## Classification of Financial Liabilities

### The Two Categories

Financial liabilities are classified into one of two categories:

| Category | Default or Elected? | Measurement |
|----------|---------------------|-------------|
| **Amortised Cost** | Default | EIR method |
| **Fair Value Through Profit or Loss (FVTPL)** | Elected (FVO) or mandatory | Fair value |

Unlike financial assets, there is **no "hold to collect" or SPPI test** for liabilities. The default is amortised cost, and FVTPL is the exception.

---

## Category 1: Amortised Cost (Default)

The vast majority of financial liabilities — borrowings, bonds payable, trade payables, lease liabilities — are measured at amortised cost using the EIR method.

### Initial Measurement

```
Initial carrying amount = Fair value of proceeds received − Transaction costs
```

Transaction costs (issue costs, underwriting fees, legal fees) **reduce** the initial carrying amount. They are not expensed immediately — they are amortised over the life of the liability using the EIR method.

### Subsequent Measurement: EIR Method

The EIR method for liabilities works in mirror image to assets:

```
Closing Carrying Amount = Opening balance + Interest expense (EIR) − Cash paid
```

The interest expense recognized in P/L equals the opening carrying amount × EIR — not the coupon rate. Any difference between the coupon paid and EIR interest accrual adjusts the carrying amount (amortising the discount or premium created by transaction costs).

### Worked Example: Bond Issued at a Discount

**Facts:**
- Entity issues a 3-year bond, face value R2,000,000, coupon 8% p.a. (paid annually)
- Issue price: R1,900,525.92 (discount because market rate = 10%)
- Transaction costs: nil (for simplicity)

**EIR = 10%** (market rate)

**Amortisation Table:**

| Year | Opening Balance | Interest @ 10% | Coupon Paid @ 8% | Closing Balance |
|------|----------------|----------------|-----------------|----------------|
| 1 | 1,900,525.92 | 190,052.59 | (160,000.00) | 1,930,578.51 |
| 2 | 1,930,578.51 | 193,057.85 | (160,000.00) | 1,963,636.36 |
| 3 | 1,963,636.36 | 196,363.64 | (160,000.00) | 2,000,000.00 |

**Year 1 Journal Entries:**

```
Initial recognition:
Dr  Cash                           1,900,525.92
    Cr  Bond Payable                           1,900,525.92

Year 1 interest expense (EIR):
Dr  Finance Cost (P/L)               190,052.59
    Cr  Bond Payable                             30,052.59   ← discount amortised
    Cr  Cash/Accrued Interest                   160,000.00   ← coupon paid

Closing carrying amount: R1,930,578.51
```

> [!TIP]
> The finance cost is always HIGHER than the coupon paid when a bond is issued at a discount, and LOWER when issued at a premium. The difference adjusts the carrying amount toward face value over time. This is the same logic as assets — just from the liability perspective.

---

## Category 2: FVTPL

### Two Routes to FVTPL for Liabilities

**Route 1: Mandatory — Held for Trading**

A financial liability is classified as FVTPL if it is held for trading. This includes:
- Derivative liabilities (e.g., a written option or a swap in a net liability position)
- Short positions (selling borrowed securities)
- Liabilities incurred specifically to repurchase in the near term

**Route 2: Elected — The Fair Value Option (FVO)**

An entity may irrevocably designate any financial liability at FVTPL at initial recognition if doing so **eliminates or significantly reduces an accounting mismatch**.

The FVO criteria are the same as for assets: the designation must result in more relevant information by removing a measurement inconsistency that would otherwise arise.

---

## The IFRS 9 Innovation: Own Credit Risk

### The Problem Under IAS 39

Under IAS 39, when a liability was designated at FVTPL via the FVO, **all** fair value changes went through P/L — including changes caused by the entity's own creditworthiness. This produced a deeply counterintuitive result:

> If your credit rating deteriorates (your bonds fall in value), the liability's fair value decreases — creating a **gain** in your P/L. The worse your financial health, the better your reported profit.

This "day of reckoning paradox" was widely criticized as economically nonsensical and misleading to users.

### The IFRS 9 Fix

> The own credit risk treatment is a favourite exam topic — examiners love it because students consistently get tripped up. Know it precisely: own credit risk → OCI, never recycled, never P/L.

IFRS 9 separates the fair value movement on FVO financial liabilities into two components:

| Component | Where it Goes |
|-----------|---------------|
| Change due to **own credit risk** | **OCI** (Other Comprehensive Income) |
| Change due to **other factors** (e.g., benchmark interest rate movements) | **P/L** |

> [!IMPORTANT]
> The own credit risk portion goes to OCI and is **never recycled to P/L** — not even on derecognition. It stays in OCI and is transferred directly to retained earnings on settlement.

### When Does the Split Apply?

Only when a liability is designated at FVTPL via the FVO. Mandatory FVTPL liabilities (derivatives) continue to record all changes in P/L — there is no own credit risk split for trading liabilities.

### Worked Example: Own Credit Risk

**Facts:**
- Entity issues a 5-year bond with face value R10,000,000 and designates it at FVTPL (FVO) to eliminate an accounting mismatch with a related asset
- At year-end:
  - Total fair value change = R(250,000) — the liability decreased in value
  - Of which, own credit risk deterioration caused: R(180,000)
  - Market interest rate movements caused: R(70,000)

**Journal Entry:**

```
Decrease in fair value (liability fell → gain):
Dr  Bond Payable — FVO              250,000
    Cr  OCI (Own Credit Risk)                   180,000   ← credit deterioration
    Cr  P/L (Finance Income)                     70,000   ← market rate effect
```

**Interpretation:**
- The R70,000 gain from market rate movement appropriately hits P/L (offsetting the asset side of the mismatch)
- The R180,000 "gain" from credit deterioration is quarantined in OCI — it never boosts reported profit

---

## Compound Financial Instruments (IAS 32 Link)

### What is a Compound Instrument?

Some financial instruments contain both a **liability component** and an **equity component**. The classic example is a **convertible bond** — the holder has both:
- A contractual right to receive interest and principal (liability)
- An option to convert into a fixed number of ordinary shares (equity)

### Accounting for Compound Instruments

IAS 32 requires the components to be **split and presented separately** from inception. IFRS 9 then measures the liability component at amortised cost (or FVTPL if designated).

**The Split-Off Method (IAS 32.31):**

1. Determine the fair value of the **liability component** (value of the bond without the conversion feature, i.e., PV of cash flows at market rate for a non-convertible equivalent bond)
2. The **equity component** = Total proceeds − Liability component

> [!IMPORTANT]
> The equity component is determined as a **residual** — not independently valued. The liability is valued first, and equity gets whatever is left over. This is the "with-and-without" method.

**Worked Example: Convertible Bond**

**Facts:**
- Entity issues a 3-year convertible bond with face value R5,000,000, coupon 6%
- Equivalent non-convertible bond rate: 9%
- Proceeds received: R5,000,000 (par, because the conversion feature makes it attractive)

**Step 1: Value the liability component**
PV of cash flows at 9% (non-convertible rate):

| Year | Cash Flow | PV Factor @ 9% | PV |
|------|-----------|----------------|-----|
| 1 | 300,000 | 0.9174312 | 275,229.36 |
| 2 | 300,000 | 0.8416800 | 252,504.00 |
| 3 | 5,300,000 | 0.7721835 | 4,092,572.55 |
| **Liability Component** | | | **4,620,305.91** |

**Step 2: Equity component**
R5,000,000.00 − R4,620,305.91 = **R379,694.09**

**Journal Entry at Inception:**

```
Dr  Cash                           5,000,000.00
    Cr  Financial Liability (Bond)             4,620,305.91
    Cr  Equity (Conversion Option)               379,694.09
```

**Subsequent measurement:**
The liability is measured at amortised cost using 9% EIR. The equity component is never remeasured.

---

## Derecognition of Financial Liabilities

A financial liability is removed from the balance sheet (derecognised) when the obligation is **discharged, cancelled, or expired**.

### Common Derecognition Events

| Event | Treatment |
|-------|-----------|
| Repayment at maturity | Derecognize at carrying amount; no gain/loss if fully amortised to par |
| Early redemption | Difference between carrying amount and amount paid = gain/loss in P/L |
| Debt forgiveness | Carrying amount derecognized; gain in P/L (unless related party — may be equity) |
| Exchange for new debt (substantial modification) | Old liability derecognized; new liability recognized at fair value; difference in P/L |

### Substantial Modification

If the terms of a financial liability are modified, the entity must assess whether the modification is **substantial**.

A modification is substantial if the PV of the new cash flows (discounted at the original EIR) differs by **10% or more** from the PV of the original remaining cash flows.

| Modification | Treatment |
|-------------|-----------|
| Substantial | Derecognize old; recognize new at FV; gain/loss in P/L |
| Not substantial | Adjust carrying amount; amortise the adjustment using the original EIR |

> [!CAUTION]
> During COVID-19, many South African companies renegotiated debt terms with banks. Determining whether those modifications were substantial (triggering derecognition) was a significant accounting issue. The same principle applies in any scenario where loan terms are restructured.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Classifying all liabilities at amortised cost | Check for held-for-trading (derivatives) and FVO elections |
| Ignoring transaction costs on liabilities | Transaction costs reduce the initial carrying amount and are amortised via the EIR |
| Putting own credit risk gains through P/L | Own credit risk on FVO liabilities → OCI, never P/L |
| Splitting compound instruments: doing equity first | Always value the liability first; equity is the residual |
| Using coupon rate instead of EIR for interest expense | EIR is the market rate at inception; always use this for P/L recognition |
| Treating all debt modifications as derecognition events | Apply the 10% test; only substantial modifications trigger derecognition |

---

## Exam Technique

### Identifying the Correct Category

**Step 1**: Is it held for trading (including all derivative liabilities)? → FVTPL mandatory
**Step 2**: Has the entity irrevocably designated it at FVTPL (FVO) to eliminate a mismatch? → FVTPL elected
**Step 3**: Everything else → Amortised cost

### For FVO Liability Questions

1. Calculate total fair value movement
2. Identify the portion attributable to own credit risk (usually given in the question)
3. Route own credit risk → OCI; remainder → P/L

### For Compound Instrument Questions

1. Identify liability component cash flows
2. Discount at equivalent non-convertible rate → Liability value
3. Proceeds − Liability = Equity
4. Show amortisation table for liability at EIR

---

## Key Takeaways

1. **Most financial liabilities are at amortised cost** — the EIR method applies, spreading transaction costs and premium/discount over the instrument's life
2. **FVTPL applies** to held-for-trading liabilities and those designated via the FVO to eliminate accounting mismatches
3. **Own credit risk** on FVO liabilities goes to OCI (never P/L) under IFRS 9 — a key improvement over IAS 39
4. **Compound instruments** (e.g., convertible bonds): split at inception using the "liability first" method; equity is the residual (IAS 32)
5. **Derecognition**: on discharge; substantial modifications (10% test) also trigger derecognition
6. Financial liabilities **cannot be reclassified** between categories

---

**← Previous: Part 3 — Measurement of Financial Assets**

**Next: Part 5 — Derecognition of Financial Assets →**
