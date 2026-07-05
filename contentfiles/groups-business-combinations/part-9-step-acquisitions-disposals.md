# Groups & Business Combinations - Part 9: Step Acquisitions & Disposals

## Overview

Changes in ownership percentages are common in practice. This part covers:

1. **Step acquisitions** — Achieving control in stages
2. **Partial disposals retaining control** — Equity transactions
3. **Loss of control** — Full disposal accounting
4. **Deemed disposals** — Dilution without sale

---

## Part A: Step Acquisitions (Achieving Control in Stages)

### The Scenario

An investor may:
1. Hold an existing investment (associate, financial asset)
2. Acquire additional shares
3. **Achieve control** through the additional acquisition

### The Accounting Treatment

> **IFRS 3.41-42**: When control is achieved in stages, the acquirer shall:
> 1. **Remeasure** the previously held interest at **acquisition-date fair value**
> 2. **Recognise a gain or loss** on the remeasurement in profit or loss (or OCI as appropriate)

### The Key Principle

On the date control is achieved:
- It's as if the entity sold the previous investment
- And acquired 100% (or controlling interest) at fair value

### The Calculation

| Component | Treatment |
|-----------|-----------|
| Previously held interest | Remeasure to fair value → Gain/loss |
| New consideration | Include in goodwill calculation |
| Total consideration for goodwill | FV of previous + New consideration |

### Working Example: Step Acquisition

**Facts:**
- 1 January 20X1: Parent acquired 25% of Target for R500,000
- Equity method applied (significant influence)
- 31 December 20X2: Carrying amount of investment: R650,000 (including share of profits)
- 1 January 20X3: Parent acquires additional 55% for R1,650,000, achieving control
- Fair value of previously held 25% on 1 January 20X3: R700,000
- Fair value of identifiable net assets of Target: R2,500,000
- NCI to be measured at fair value: R500,000

**Step 1: Remeasure previously held interest**

| | R |
|---|---|
| Fair value of 25% at acquisition date | 700,000 |
| Carrying amount | (650,000) |
| **Gain on remeasurement (P/L)** | **50,000** |

**Step 2: Calculate goodwill**

| | R |
|---|---|
| Fair value of previously held 25% | 700,000 |
| Consideration for additional 55% | 1,650,000 |
| Fair value of NCI (20%) | 500,000 |
| **Total** | **2,850,000** |
| Less: FV of identifiable net assets | (2,500,000) |
| **Goodwill** | **350,000** |

**Journal entries:**

*Remeasure previous investment:*
```
Dr  Investment in Target                        50,000
    Cr  Gain on remeasurement (P/L)                     50,000
```

*Acquisition of additional shares:*
```
Dr  Investment in Target                     1,650,000
    Cr  Cash                                          1,650,000
```

*Consolidation entries:*
```
Dr  Net assets (at FV)                       2,500,000
Dr  Goodwill                                   350,000
    Cr  Investment in Target (700k + 1,650k)          2,350,000
    Cr  NCI                                             500,000
```

### OCI Reclassification

If the previously held interest was a FVOCI investment:
- Accumulated OCI is reclassified to P/L (or retained earnings) on remeasurement

---

## Part B: Partial Disposal Retaining Control

### The Scenario

Parent sells part of its shareholding but **retains control**.

### The Accounting Treatment

> **IFRS 10.23**: Changes in ownership that do NOT result in loss of control are **equity transactions**.

### What This Means

| What Happens | What Doesn't Happen |
|--------------|---------------------|
| Adjust NCI | Recognise gain/loss in P/L |
| Adjust parent's equity | Recalculate goodwill |
| | Remeasure assets/liabilities |

### The Mechanics

1. Calculate the difference between:
   - Proceeds received
   - The adjustment to NCI (share of net assets transferred)
2. Recognise the difference in **equity** (often a "Changes in ownership reserve")

### Working Example: Partial Disposal Retaining Control

**Facts:**
- Parent owns 80% of Subsidiary
- Parent sells 10% for R600,000
- Subsidiary's consolidated net assets: R4,000,000
- NCI before sale: 20% × R4,000,000 = R800,000
- NCI after sale: 30% × R4,000,000 = R1,200,000

**Calculation:**

| | R |
|---|---|
| Proceeds received | 600,000 |
| Increase in NCI (10% × R4m) | (400,000) |
| **Credit to equity** | **200,000** |

**Journal Entry:**
```
Dr  Cash                                       600,000
    Cr  NCI                                            400,000
    Cr  Equity reserve (parent)                        200,000
```

**No gain or loss in P/L!**

---

## Part C: Loss of Control (Full Disposal)

### The Scenario

Parent disposes of enough shares to **lose control** over the subsidiary.

### The Accounting Treatment

> **IFRS 10.25**: On loss of control, the parent shall:
> 1. Derecognise assets and liabilities of the subsidiary
> 2. Derecognise goodwill
> 3. Derecognise NCI
> 4. Recognise fair value of any retained interest
> 5. Recognise gain or loss in P/L
> 6. Reclassify OCI items to P/L (where required)

### The Calculation

| | R |
|---|---|
| Proceeds from disposal | X |
| Fair value of retained interest | X |
| **Total** | **X** |
| Carrying amount of net assets disposed | (X) |
| Carrying amount of goodwill | (X) |
| NCI derecognised | X |
| OCI reclassified | X/(X) |
| **Gain/(loss) on disposal** | **X** |

### What Happens to Retained Interest

| New Relationship | Accounting |
|------------------|------------|
| Associate (significant influence) | Equity method at FV on disposal date |
| Financial investment | IFRS 9 at fair value |
| Joint venture | Equity method at FV |

### Working Example: Loss of Control

**Facts:**
- Parent owns 80% of Subsidiary
- Parent sells 60% for R3,000,000
- Retains 20% (significant influence—associate)
- At disposal date:
  - Subsidiary's net assets (consolidated): R4,000,000
  - Goodwill: R500,000
  - NCI (20%): R800,000
  - FCTR in OCI (group share): R200,000
- Fair value of retained 20%: R1,100,000

**Calculation:**

| | R |
|---|---|
| Proceeds from sale (60%) | 3,000,000 |
| Fair value of retained 20% | 1,100,000 |
| **Total** | **4,100,000** |
| | |
| Net assets derecognised | (4,000,000) |
| Goodwill derecognised | (500,000) |
| NCI derecognised (credit back) | 800,000 |
| FCTR reclassified to P/L | 200,000 |
| **Gain on disposal** | **600,000** |

**Journal Entries:**

*Deconsolidation:*
```
Dr  Cash                                     3,000,000
Dr  Investment in Associate (retained)       1,100,000
Dr  NCI                                        800,000
    Cr  Net assets                                    4,000,000
    Cr  Goodwill                                        500,000
    Cr  Gain on disposal (P/L)                          400,000
```

*Reclassification of OCI:*
```
Dr  FCTR (OCI)                                 200,000
    Cr  Gain on disposal (P/L)                          200,000
```

Total gain: R400,000 + R200,000 = R600,000 ✓

---

## Part D: Deemed Disposals (Dilution)

### The Scenario

A subsidiary issues new shares to third parties:
- Parent doesn't participate
- Parent's percentage ownership decreases
- But no cash changes hands (from parent's perspective)

### The Accounting Treatment

**If control is retained:**
- Treat as equity transaction (same as partial disposal)
- No gain/loss in P/L

**If control is lost:**
- Apply loss of control accounting
- Recognise gain/loss in P/L

### Working Example: Deemed Disposal Retaining Control

**Facts:**
- Parent owns 80% (800,000 shares) of Subsidiary
- Subsidiary issues 200,000 new shares to third party for R1,000,000
- Total shares now: 1,200,000
- Parent's new holding: 800,000 / 1,200,000 = 66.67%
- Net assets before issue: R4,000,000
- Net assets after issue: R5,000,000

**Parent's analysis:**

| | Before | After |
|---|--------|-------|
| % owned | 80% | 66.67% |
| Share of net assets | R3,200,000 | R3,333,333 |

| | R |
|---|---|
| Share of net assets after | 3,333,333 |
| Share of net assets before | (3,200,000) |
| **Increase in parent's equity** | **133,333** |

But parent received no cash—this is an equity adjustment:

**Journal Entry:**
```
Dr  NCI                                        133,333
    Cr  Equity reserve (parent)                        133,333
```

*(Exact entries depend on the specific circumstances)*

---

## Summary of Transactions

| Transaction | Control Status | Accounting |
|-------------|----------------|------------|
| **Step acquisition** | Gain control | Remeasure previous holding at FV; calculate goodwill on total |
| **Partial disposal - retain control** | Keep control | Equity transaction; no P/L |
| **Full disposal** | Lose control | Deconsolidate; recognise gain/loss; FV retained interest |
| **Deemed disposal - retain control** | Keep control | Equity transaction |
| **Deemed disposal - lose control** | Lose control | Full disposal accounting |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Not remeasuring previous holding on step acquisition** | Remeasure to fair value; recognise gain/loss |
| **Recognising gain/loss on partial disposal retaining control** | Equity transaction—no P/L impact |
| **Forgetting to reclassify OCI on loss of control** | Reclassify items required by relevant standards |
| **Using book value for retained interest** | Measure at fair value on disposal date |
| **Forgetting to derecognise NCI** | NCI is removed on loss of control |

---

## Exam Technique

### Step Acquisition Questions

1. State the fair value of previously held interest
2. Calculate gain/loss on remeasurement
3. Calculate goodwill using total fair value (previous + new + NCI)
4. Show journal entries

### Disposal Questions

1. Identify whether control is retained or lost
2. If retained: equity transaction (show working)
3. If lost: full disposal accounting (show calculation and entries)
4. Don't forget OCI reclassification

### Standard Calculation Format

**Loss of control:**

| | R |
|---|---|
| Proceeds | X |
| + Fair value of retained interest | X |
| **Total** | **X** |
| − Net assets derecognised | (X) |
| − Goodwill derecognised | (X) |
| + NCI derecognised | X |
| + OCI reclassified | X |
| **Gain/(Loss)** | **X** |

---

## What's Next?

In **Part 10**, we cover Foreign Subsidiaries (IAS 21 Integration):
- Functional currency determination
- Translation of foreign operations
- Exchange differences on consolidation
- Goodwill in foreign currency

---

**← Previous: Part 8 - IFRS 11 Joint Arrangements**

**→ Next: Part 10 - Foreign Subsidiaries**

