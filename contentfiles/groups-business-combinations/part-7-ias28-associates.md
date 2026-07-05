# Groups & Business Combinations - Part 7: IAS 28 Associates & Equity Method

## What is an Associate?

> **IAS 28.3**: An associate is an entity over which the investor has **significant influence**.

### Significant Influence Defined

> **IAS 28.3**: Significant influence is the power to participate in the financial and operating policy decisions of the investee but is **not control or joint control**.

### The Key Distinction

| Relationship | Power Level | Accounting |
|--------------|-------------|------------|
| Subsidiary | Control | Consolidation |
| Joint venture | Joint control | Equity method |
| **Associate** | **Significant influence** | **Equity method** |
| Investment | No significant influence | IFRS 9 (Fair value) |

---

## Identifying Significant Influence

### The Rebuttable Presumption

> **IAS 28.5**: If an investor holds, directly or indirectly, **20% or more** of voting power, it is **presumed** to have significant influence (unless clearly demonstrated otherwise).

### Indicators of Significant Influence

Even without 20%, significant influence may exist if:

| Indicator |
|-----------|
| Representation on the board of directors |
| Participation in policy-making processes |
| Material transactions between investor and investee |
| Interchange of managerial personnel |
| Provision of essential technical information |

### When 20%+ Does NOT Equal Significant Influence

Significant influence can be rebutted if:
- Another party has control
- The investor is excluded from decision-making
- Contractual arrangements limit the investor's influence

---

## The Equity Method

### The Core Principle

> **IAS 28.10**: Under the equity method, the investment is initially recognised at **cost** and the carrying amount is increased or decreased to recognise the investor's share of the **profit or loss** of the investee after the date of acquisition.

### Key Features

| Feature | Treatment |
|---------|-----------|
| Initial recognition | At cost |
| Share of profit/loss | Recognise in P/L |
| Share of OCI | Recognise in OCI |
| Dividends received | Reduce carrying amount (not income) |
| Uniform policies | Required where practicable |

### The "One-Line Consolidation"

The equity method is sometimes called "one-line consolidation" because:
- Only ONE line in the SFP (Investment in associate)
- Only ONE line in P/L (Share of associate's profit)
- But it reflects the investor's share of net assets and profits

---

## Initial Recognition

### At Cost

| Component | Include in Cost |
|-----------|-----------------|
| Purchase price | ✓ |
| Transaction costs | ✓ (unlike subsidiaries) |
| Contingent consideration | ✓ (at fair value) |

### Implicit Goodwill and Fair Value Adjustments

At acquisition, calculate:
1. Fair value of identifiable net assets
2. Implicit goodwill (excess of cost over share of FV net assets)

**This is NOT separately presented** but is embedded in the investment carrying amount.

### Working Example: Initial Recognition

**Facts:**
- Investor acquires 30% of Associate for R3,000,000
- Associate's identifiable net assets at fair value: R8,000,000
- Transaction costs: R50,000

**Calculation:**

| | R |
|---|---|
| Cost (purchase price + transaction costs) | 3,050,000 |
| Share of FV of net assets (30% × R8m) | 2,400,000 |
| **Implicit goodwill** | **650,000** |

**Journal Entry:**
```
Dr  Investment in Associate                   3,050,000
    Cr  Cash                                          3,050,000
```

The R650,000 goodwill is NOT separately recognised—it's embedded in the investment.

---

## Subsequent Measurement

### Share of Profit or Loss

Each period:
1. Take associate's profit/loss for the period
2. Adjust for investor's share
3. Adjust for unrealised profits and fair value amortisation
4. Recognise in investor's P/L

### Journal Entry

```
Dr  Investment in Associate                     XX
    Cr  Share of profit of associate (P/L)            XX
```

### Dividends

Dividends **reduce the carrying amount** (not income):

```
Dr  Cash/Receivable                            XX
    Cr  Investment in Associate                       XX
```

### Share of OCI

Recognise investor's share of associate's OCI in investor's OCI:

```
Dr  Investment in Associate                     XX
    Cr  OCI (e.g., revaluation reserve)               XX
```

---

## Fair Value Adjustments (Embedded Goodwill)

### The Concept

If the investor paid more than the proportionate share of book value, there may be:
1. Fair value adjustments on specific assets
2. Implicit goodwill

### Treatment of Fair Value Adjustments

**Depreciable assets:**
- Amortise the fair value adjustment over remaining useful life
- Reduces share of associate's profit

**Land (non-depreciable):**
- No amortisation
- Realised on disposal

### Working Example

**Facts:**
- 30% acquired for R3,000,000
- Associate's book value of net assets: R7,000,000
- Fair value adjustment on PPE: R1,000,000 (remaining life 10 years)
- Share of FV net assets: 30% × R8,000,000 = R2,400,000
- Implicit goodwill: R3,000,000 − R2,400,000 = R600,000

**Annual adjustment:**
- FV adjustment amortisation: R1,000,000 ÷ 10 = R100,000
- Investor's share: 30% × R100,000 = R30,000

**Each year:**
```
Dr  Share of profit of associate (P/L)          30,000
    Cr  Investment in Associate                        30,000
```

---

## Intragroup Transactions with Associates

### Unrealised Profits

Unrealised profits on transactions between investor and associate must be eliminated **to the extent of the investor's interest**.

### Downstream Transactions

Investor sells to Associate:

**Adjustment:**
- Eliminate investor's share of unrealised profit
- Reduce investor's profit (not associate's)

**Calculation:**
```
Unrealised profit in associate's inventory × Investor's %
```

### Upstream Transactions

Associate sells to Investor:

**Adjustment:**
- Eliminate investor's share of unrealised profit
- Reduce share of associate's profit

**Calculation:**
```
Unrealised profit in investor's inventory × Investor's %
```

### Working Example: Upstream

**Facts:**
- Investor owns 30% of Associate
- During the year, Associate sold goods to Investor for R500,000
- Associate's cost: R350,000
- At year-end, 40% remains in Investor's inventory

**Calculation:**

| | R |
|---|---|
| Profit margin | 30% |
| Closing inventory | 200,000 (40% × R500k) |
| Unrealised profit | 60,000 (R200k × 30%) |
| Investor's share (30%) | **18,000** |

**Adjustment:**
```
Dr  Share of profit of associate               18,000
    Cr  Investment in Associate                       18,000
```

---

## Losses of Associates

### Absorbing Losses

The investor recognises its share of losses **until the investment is reduced to zero**.

| Investment Carrying Amount | Treatment of Losses |
|---------------------------|---------------------|
| > 0 | Reduce investment |
| = 0 | Stop recognising (unless obligation exists) |

### Long-Term Interests

If the investor has long-term interests (e.g., loans to associate):
- After investment reaches zero, apply losses to long-term interests
- In reverse order of seniority

### Resuming Profit Recognition

If the associate becomes profitable:
1. First, recover unrecognised losses
2. Then resume normal equity accounting

### Working Example: Loss Absorption

**Facts:**
- Investment carrying amount: R500,000
- Long-term loan to associate: R200,000
- Investor's 30% share of associate's loss: R800,000

**Allocation:**

| | R |
|---|---|
| Investment balance | 500,000 |
| Share of loss applied to investment | (500,000) |
| **Investment reduced to** | **0** |
| Remaining loss to absorb | 300,000 |
| Applied to loan | (200,000) |
| **Loan reduced to** | **0** |
| Unrecognised loss (memorandum) | **100,000** |

---

## Impairment of Investment in Associate

### When to Test

Apply IAS 36 impairment indicators, including:
- Significant financial difficulty of associate
- Significant adverse changes in associate's environment
- Dividend distributions exceeding total comprehensive income

### Impairment Calculation

| | R |
|---|---|
| Carrying amount of investment | X |
| Recoverable amount (higher of VIU and FVLCOD) | (X) |
| **Impairment loss** | **X** |

### Treatment

Impairment loss recognised in P/L. Can be reversed if conditions improve.

> [!NOTE]
> Goodwill embedded in the investment is NOT tested separately—the investment is tested as a single asset.

---

## Discontinuing the Equity Method

### When to Discontinue

| Scenario | Action |
|----------|--------|
| Loss of significant influence | Stop equity method |
| Associate becomes subsidiary | Apply IFRS 3 (business combination) |
| Associate becomes joint venture | Continue equity method |
| Associate goes into liquidation | Stop when significant influence lost |

### Accounting on Discontinuation

1. **Measure any retained interest** at fair value
2. **Recognise gain/loss** on deemed disposal
3. **Reclassify OCI** to P/L (if required by the related standard)

### Working Example: Loss of Significant Influence

**Facts:**
- Investor sells half of 30% holding (now holds 15%)
- Carrying amount before sale: R2,000,000
- Sale proceeds (for 15%): R1,200,000
- Fair value of retained 15%: R1,200,000
- Share of associate's revaluation reserve: R150,000

**Calculation:**

| | R |
|---|---|
| Proceeds received | 1,200,000 |
| Fair value of retained interest | 1,200,000 |
| **Total** | **2,400,000** |
| Carrying amount of investment | (2,000,000) |
| Reclassification of OCI | 150,000 |
| **Gain on disposal** | **550,000** |

**Entries:**
```
Dr  Cash                                      1,200,000
Dr  Financial asset (FVOCI or FVPL)           1,200,000
    Cr  Investment in Associate                       2,000,000
    Cr  Gain on disposal (P/L)                          400,000

Dr  Revaluation reserve (OCI)                   150,000
    Cr  Gain on disposal (P/L)                          150,000
```

---

## Presentation and Disclosure

### Statement of Financial Position

| Line Item | Presentation |
|-----------|--------------|
| Investment in associate | Non-current assets (unless held for sale) |

### Statement of Profit or Loss

| Line Item | Presentation |
|-----------|--------------|
| Share of profit of associates | After operating profit, before tax (typically) |

### Key Disclosures (IFRS 12)

| Disclosure |
|------------|
| Nature and extent of significant influence |
| Summarised financial information of associates |
| Carrying amount of investment |
| Fair value (if available) |
| Unrecognised share of losses |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Treating dividends as income** | Dividends reduce carrying amount, not income |
| **Expensing transaction costs** | Capitalise as part of investment cost |
| **Ignoring fair value adjustments** | Amortise FV adjustments on depreciable assets |
| **Full elimination of unrealised profits** | Only eliminate investor's share |
| **Continuing to recognise losses past zero** | Stop at zero (unless obligations exist) |
| **Recognising implicit goodwill separately** | Embedded in investment, not separate |

---

## Exam Technique

### Investment in Associate Working

| | R |
|---|---|
| Cost at acquisition | X |
| Share of post-acquisition retained earnings | X |
| Share of post-acquisition OCI | X |
| Less: Dividends received | (X) |
| Less: Amortisation of FV adjustments | (X) |
| Less: Unrealised profits | (X) |
| Less: Impairment | (X) |
| **Carrying amount** | **X** |

### Share of Associate's Profit Working

| | R |
|---|---|
| Associate's profit for year | X |
| × Investor's % | X |
| Less: Amortisation of FV adjustments | (X) |
| Less: Unrealised profit (current year) | (X) |
| **Share of profit recognised** | **X** |

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Significant influence** | Power to participate but not control |
| **Presumption** | 20%+ = significant influence (rebuttable) |
| **Equity method** | One-line consolidation |
| **Initial measurement** | At cost (including transaction costs) |
| **Subsequent measurement** | Cost + share of profits − dividends |
| **Dividends** | Reduce carrying amount |
| **Unrealised profits** | Eliminate investor's share only |
| **Losses** | Reduce investment to zero; stop unless obligations |
| **Implicit goodwill** | Embedded, not separately recognised |

---

## What's Next?

In **Part 8**, we cover IFRS 11 Joint Arrangements:
- Joint control definition
- Joint operations vs. joint ventures
- Accounting for each type

---

**← Previous: Part 6 - Non-Controlling Interests**

**→ Next: Part 8 - IFRS 11 Joint Arrangements**

