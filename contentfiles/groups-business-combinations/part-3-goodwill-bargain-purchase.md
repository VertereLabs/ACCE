# Groups & Business Combinations - Part 3: Goodwill & Bargain Purchases

## Understanding Goodwill

### What is Goodwill?

> **IFRS 3.32**: Goodwill is an asset representing the future economic benefits arising from other assets acquired in a business combination that are not individually identified and separately recognised.

### What Does Goodwill Include?

| Component | Description |
|-----------|-------------|
| **Synergies** | Cost savings, revenue enhancements from combining businesses |
| **Assembled workforce** | Trained employees (not separately recognisable) |
| **Going concern value** | Value of operating as a going concern |
| **Expected growth** | Future opportunities and expansion potential |
| **Market position** | Competitive advantages not separately identifiable |

### The Goodwill Calculation (Recap)

```
Goodwill = Consideration transferred
         + Amount of NCI
         + Fair value of previously held interest
         − Fair value of identifiable net assets acquired
```

---

## Subsequent Measurement of Goodwill

### The Key Principle

> Goodwill is **not amortised**. It is tested for **impairment** at least annually.

### Why No Amortisation?

- Goodwill has an indefinite useful life (or can't be determined)
- Impairment testing captures value decline more accurately
- Prevents arbitrary expense allocation

---

## Goodwill Impairment Testing

### The Framework (IAS 36)

Goodwill must be:
1. **Allocated** to cash-generating units (CGUs)
2. **Tested** for impairment annually (and when indicators exist)
3. **Written down** if recoverable amount < carrying amount

### What is a Cash-Generating Unit?

> **IAS 36.6**: A CGU is the smallest identifiable group of assets that generates cash inflows that are **largely independent** of the cash inflows from other assets or groups.

### Allocating Goodwill to CGUs

| Rule | Requirement |
|------|-------------|
| Allocation level | Lowest level at which goodwill is monitored for internal management purposes |
| Maximum size | Not larger than an operating segment (IFRS 8) |
| Must reflect synergies | Allocate to CGUs expected to benefit from synergies |

### The Impairment Test

```
Compare:
├── Carrying amount of CGU (including allocated goodwill)
└── Recoverable amount of CGU (higher of fair value less costs to sell OR value in use)

If Carrying Amount > Recoverable Amount:
└── Impairment loss = Difference
    └── First: Reduce goodwill
    └── Then: Reduce other assets pro-rata (but not below individual recoverable amounts)
```

---

## Working Example: Goodwill Impairment

### Facts

Parent acquired Subsidiary on 1 January 20X1.

At 31 December 20X2:

| CGU Assets | Carrying Amount |
|------------|-----------------|
| Goodwill | R2,000,000 |
| Property | R5,000,000 |
| Plant & equipment | R3,000,000 |
| Inventory | R1,500,000 |
| Receivables | R500,000 |
| **Total** | **R12,000,000** |

Recoverable amount (value in use): R9,500,000

### Impairment Calculation

| | R |
|---|---|
| Carrying amount | 12,000,000 |
| Recoverable amount | 9,500,000 |
| **Impairment loss** | **2,500,000** |

### Allocation of Impairment

**Step 1: Write off goodwill first**

| | Before | Impairment | After |
|---|--------|------------|-------|
| Goodwill | 2,000,000 | (2,000,000) | 0 |

Remaining impairment: R2,500,000 − R2,000,000 = R500,000

**Step 2: Allocate remaining impairment to other assets**

Allocation basis: Pro-rata to carrying amounts

| Asset | CA | % | Impairment Allocated |
|-------|----|----|---------------------|
| Property | 5,000,000 | 50% | 250,000 |
| Plant | 3,000,000 | 30% | 150,000 |
| Inventory | 1,500,000 | 15% | 75,000 |
| Receivables | 500,000 | 5% | 25,000 |
| **Total** | **10,000,000** | **100%** | **500,000** |

**Note:** Check that no asset is reduced below its individual recoverable amount.

### Journal Entry

```
Dr  Impairment loss (P/L)                   2,500,000
    Cr  Goodwill                                      2,000,000
    Cr  Property                                        250,000
    Cr  Accumulated depreciation - P&E                  150,000
    Cr  Inventory                                        75,000
    Cr  Allowance for receivables                        25,000
```

---

## Reversal of Goodwill Impairment

> **IAS 36.124**: Impairment losses recognised for goodwill shall **NOT be reversed** in a subsequent period.

### Why No Reversal?

- Would effectively be recognising internally generated goodwill
- This is prohibited by IAS 38
- Any increase in value is new internally generated goodwill, not a reversal

---

## Contingent Consideration

### Initial Recognition (Recap)

Contingent consideration is included in the consideration at **acquisition-date fair value**.

### Subsequent Measurement

| Classification | Treatment |
|----------------|-----------|
| **Financial liability** | Remeasure at fair value through P/L |
| **Equity** | No remeasurement |

### Classification Criteria

| If settlement is... | Classification |
|---------------------|----------------|
| Cash or other assets | Liability (IFRS 9) |
| Issue of shares (fixed number for fixed amount) | Equity |
| Variable number of shares | Liability |

### Working Example: Contingent Consideration

**At acquisition (1 January 20X1):**
- Additional payment of R3,000,000 if target EBITDA achieved in Year 1
- Probability-weighted fair value: R2,400,000 (80% probability)

**Classification:** Liability (cash payment)

**At 31 December 20X1:**
- Target was achieved
- Now certain that R3,000,000 is payable

**Journal Entry:**
```
Dr  Fair value adjustment (P/L)               600,000
    Cr  Contingent consideration liability            600,000
(To increase liability from R2,400,000 to R3,000,000)
```

**On payment:**
```
Dr  Contingent consideration liability      3,000,000
    Cr  Cash                                        3,000,000
```

> [!IMPORTANT]
> Changes in contingent consideration **do NOT adjust goodwill** after the measurement period. They go through P/L.

---

## Bargain Purchases (Negative Goodwill)

### What is a Bargain Purchase?

When the fair value of identifiable net assets acquired **exceeds** the consideration paid.

```
"Negative Goodwill" = FV of net assets − Consideration − NCI
```

### Why Might This Occur?

| Reason | Example |
|--------|---------|
| Distressed sale | Seller under financial pressure |
| Forced sale | Regulatory requirement to divest |
| Measurement at different dates | Market decline between agreement and closing |
| Synergies not reflected in price | Buyer captures more value than paid |
| Errors in valuation | Initial measurement was incorrect |

### Accounting Treatment

> **IFRS 3.34**: Before recognising a bargain purchase gain, reassess whether all assets and liabilities have been correctly identified and measured.

**Process:**

1. **Re-examine** the identification and measurement of:
   - Identifiable assets
   - Liabilities assumed
   - NCI
   - Consideration transferred

2. **Review procedures** used to measure fair values

3. If bargain purchase still exists after reassessment:
   - **Recognise the gain immediately in profit or loss**

### Working Example: Bargain Purchase

**Facts:**

Parent acquires 100% of Target:

| Component | Amount (R) |
|-----------|-----------|
| Cash consideration | 8,000,000 |
| Fair value of identifiable net assets | 9,500,000 |

**Calculation:**

| | R |
|---|---|
| Consideration | 8,000,000 |
| Fair value of net assets | (9,500,000) |
| **Bargain purchase gain** | **(1,500,000)** |

**After reassessment:** All amounts confirmed correct.

**Journal Entry (Consolidation):**

```
Dr  Net assets (at fair value)              9,500,000
    Cr  Investment in Target                        8,000,000
    Cr  Bargain purchase gain (P/L)                 1,500,000
```

### Presentation

The bargain purchase gain is presented in:
- **Profit or loss** as a separate line item or disclosed in notes
- Typically in "Other income" or similar

---

## NCI and Goodwill: Full vs. Partial Method

### The Two Approaches (Recap)

| Method | NCI Measurement | Goodwill Includes |
|--------|-----------------|-------------------|
| **Full goodwill** | Fair value of NCI | Goodwill attributable to NCI |
| **Partial goodwill** | NCI's share of FV of net assets | Only parent's share of goodwill |

### Impact on Impairment Testing

**Full goodwill method:**
- Total goodwill allocated to CGU
- Compare total carrying amount to recoverable amount
- Impairment split between parent and NCI

**Partial goodwill method:**
- Only parent's goodwill is recognised
- For impairment testing, must "gross up" goodwill to include notional NCI portion
- This ensures the CGU is tested on a consistent basis

### Working Example: Partial Goodwill Impairment

**Facts:**
- 80% acquisition, partial goodwill method
- Goodwill recognised: R800,000 (parent's share only)
- CGU carrying amount (including goodwill): R5,800,000
- Recoverable amount: R4,500,000

**Step 1: Gross up goodwill for testing**

Parent's goodwill: R800,000 = 80% of total
Implied total goodwill: R800,000 ÷ 80% = R1,000,000

**Step 2: Adjusted carrying amount**

| | R |
|---|---|
| Carrying amount per books | 5,800,000 |
| Add: Notional NCI goodwill (R1m − R800k) | 200,000 |
| **Adjusted carrying amount** | **6,000,000** |

**Step 3: Compare to recoverable amount**

| | R |
|---|---|
| Adjusted carrying amount | 6,000,000 |
| Recoverable amount | 4,500,000 |
| **Total impairment** | **1,500,000** |

**Step 4: Allocate impairment**

First to goodwill:
- Total goodwill (grossed up): R1,000,000
- Impairment to goodwill: R1,000,000 (fully impaired)
- But only R800,000 is recognised → recognise R800,000

Remaining impairment (R1,500,000 − R1,000,000 = R500,000):
- Allocate to other assets of CGU (parent's 80% share)
- Amount recognised: R500,000 × 80% = R400,000

**Total impairment recognised:**
- Goodwill: R800,000
- Other assets: R400,000
- **Total: R1,200,000**

---

## Goodwill in Consolidated Financial Statements

### Presentation

| Statement | Treatment |
|-----------|-----------|
| Statement of Financial Position | Presented as a separate intangible asset |
| Statement of Comprehensive Income | Impairment losses shown in operating expenses or separately |
| Statement of Cash Flows | Non-cash impairment added back in operating activities |

### Disclosure Requirements

| Disclosure | Details |
|------------|---------|
| Carrying amount by CGU | For each CGU with significant goodwill |
| Basis of recoverable amount | Value in use or fair value less costs of disposal |
| Key assumptions | Discount rate, growth rates, projection period |
| Sensitivity analysis | Effect of reasonably possible changes |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Amortising goodwill** | No amortisation—impairment testing only |
| **Adjusting goodwill for contingent consideration changes** | Changes go to P/L after measurement period |
| **Reversing goodwill impairment** | Goodwill impairment is NEVER reversed |
| **Recognising bargain gain without reassessment** | Must reassess all measurements first |
| **Forgetting to gross up partial goodwill for impairment testing** | Required to test CGU on consistent basis |
| **Ignoring NCI share of impairment** | Full goodwill method means NCI bears portion |

---

## Exam Technique

### Goodwill Calculation Questions

**Standard structure:**

| | R |
|---|---|
| Consideration: | |
| - Cash | X |
| - Shares (number × FV) | X |
| - Deferred consideration (PV) | X |
| - Contingent consideration (FV) | X |
| **Total consideration** | **X** |
| NCI at [state method] | X |
| Previously held interest (if applicable) | X |
| **Total** | **X** |
| Less: FV of identifiable net assets | (X) |
| **Goodwill** | **X** |

### Impairment Questions

1. Identify the CGU and its carrying amount
2. State the recoverable amount (value in use or FVLCOD)
3. Calculate impairment (if any)
4. Allocate: first to goodwill, then pro-rata to other assets
5. Show journal entry

### Bargain Purchase Questions

1. Calculate the "negative goodwill"
2. State requirement to reassess
3. Conclude bargain purchase exists
4. Recognise gain in P/L

---

## Summary

| Topic | Key Point |
|-------|-----------|
| **Goodwill nature** | Future benefits not separately identifiable |
| **Subsequent measurement** | Impairment testing, no amortisation |
| **Impairment** | Allocate to CGUs, test annually, first reduce goodwill |
| **Reversal** | Never reversed for goodwill |
| **Contingent consideration** | Changes to P/L after measurement period |
| **Bargain purchase** | Reassess, then recognise gain in P/L |
| **NCI methods** | Full vs. partial affects goodwill amount |

---

## What's Next?

In **Part 4**, we cover IFRS 10 Control:
- Definition of control
- Power over the investee
- Exposure to variable returns
- Link between power and returns
- De facto control and structured entities

---

**← Previous: Part 2 - The Acquisition Method**

**→ Next: Part 4 - IFRS 10 Control**

