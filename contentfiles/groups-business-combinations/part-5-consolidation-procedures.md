# Groups & Business Combinations - Part 5: Consolidation Procedures

## The Purpose of Consolidation

> Consolidated financial statements present the financial position and results of a **group** as if it were a **single economic entity**.

The parent and its subsidiaries are presented as one entity, which requires:
- Combining like items
- Eliminating intragroup transactions
- Adjusting for differences in accounting policies
- Recognising non-controlling interests

---

## Basic Consolidation Requirements

### IFRS 10 Principles

| Requirement | Reference |
|-------------|-----------|
| Combine like items of assets, liabilities, equity, income, expenses, cash flows | IFRS 10.B86 |
| Eliminate carrying amount of parent's investment | IFRS 10.B86(a) |
| Eliminate intragroup balances and transactions | IFRS 10.B86(c) |
| Eliminate unrealised profits in intragroup transactions | IFRS 10.B86(c) |

---

## Uniform Accounting Policies

### The Requirement

> **IFRS 10.B87**: Consolidated financial statements shall be prepared using **uniform accounting policies** for like transactions and events.

### What This Means

If the subsidiary uses different policies:
1. Identify the differences
2. Make adjustments to align with group policy
3. Adjustments are made in the consolidation workings

### Common Differences

| Area | Example |
|------|---------|
| Inventory valuation | FIFO vs. weighted average |
| Depreciation method | Straight-line vs. reducing balance |
| PPE measurement | Cost vs. revaluation |
| Investment property | Fair value vs. cost |
| Revenue recognition | Timing differences |

### Working Example: Policy Alignment

**Subsidiary uses revaluation for PPE; Parent uses cost model (group policy).**

| | Subsidiary Books | Adjustment | Group |
|---|-----------------|------------|-------|
| PPE carrying amount | R5,000,000 | (R1,200,000)* | R3,800,000 |
| Revaluation surplus | R1,200,000 | (R1,200,000) | - |

*Reverse the revaluation to cost model (simplified—actual calculation considers depreciation differences)

---

## Uniform Reporting Dates

### The Requirement

> **IFRS 10.B92**: The financial statements of parent and subsidiaries shall be prepared as of the **same reporting date**.

### When Dates Differ

If impracticable to align:
- Maximum difference: **3 months**
- Make adjustments for significant transactions between dates
- Disclose the different date and reason

---

## Elimination of Intragroup Balances

### What to Eliminate

| Balance Type | Elimination |
|--------------|-------------|
| Parent's investment in subsidiary | Against subsidiary's equity |
| Intragroup receivables/payables | Eliminate in full |
| Intragroup loans | Eliminate in full |

### Investment Elimination Entry

At acquisition and each subsequent period:

```
Dr  Share capital (Subsidiary)                XXX
Dr  Retained earnings at acquisition (Sub)    XXX
Dr  Fair value adjustments (at acquisition)   XXX
Dr  Goodwill                                  XXX
    Cr  Investment in Subsidiary                      XXX
    Cr  NCI (at acquisition)                          XXX
```

### Intragroup Balances

**Example:**
- Parent has receivable from Subsidiary: R500,000
- Subsidiary has payable to Parent: R500,000

**Elimination:**
```
Dr  Intragroup payable (Subsidiary)           500,000
    Cr  Intragroup receivable (Parent)                500,000
```

---

## Elimination of Intragroup Transactions

### Revenue and Expenses

All intragroup revenue and expenses must be eliminated:

| Transaction | Elimination |
|-------------|-------------|
| Sales from P to S | Eliminate P's revenue and S's purchases |
| Interest on intragroup loans | Eliminate interest income and expense |
| Management fees | Eliminate fee income and expense |
| Dividends from S to P | Eliminate S's dividend and P's dividend income |

### Working Example: Intragroup Sales

**During the year:**
- Parent sold goods to Subsidiary for R2,000,000
- These goods were purchased by Parent for R1,500,000
- All goods sold externally by Subsidiary for R2,800,000

**Elimination of intragroup sale:**
```
Dr  Revenue (Parent)                        2,000,000
    Cr  Cost of sales (Subsidiary)                  2,000,000
```

**Note:** No unrealised profit adjustment needed if goods were sold externally.

---

## Unrealised Profits: Inventory

### The Concept

If goods sold between group companies remain in inventory at year-end, any **intragroup profit** is **unrealised** from a group perspective.

### Calculation

```
Unrealised profit = Closing intragroup inventory × Profit margin
```

### Downstream vs. Upstream

| Direction | From | To | Adjustment Against |
|-----------|------|----|--------------------|
| **Downstream** | Parent | Subsidiary | Parent (100%) |
| **Upstream** | Subsidiary | Parent | Subsidiary (P% + NCI%) |

### Working Example: Downstream Inventory

**Facts:**
- Parent sold goods to Subsidiary during the year
- Sales value: R1,000,000
- Cost to Parent: R700,000
- At year-end, 40% remains in Subsidiary's inventory

**Calculation:**

| | R |
|---|---|
| Intragroup sales | 1,000,000 |
| Intragroup cost | 700,000 |
| Profit margin | 30% |
| Closing inventory (at transfer price) | 400,000 (40% × R1m) |
| **Unrealised profit** | **120,000** (R400,000 × 30%) |

**Adjustment:**
```
Dr  Cost of sales (or Retained earnings if prior year)    120,000
    Cr  Inventory                                                 120,000
```

### Working Example: Upstream Inventory

**Facts:**
- Subsidiary (80% owned) sold goods to Parent
- Sales value: R500,000
- Cost to Subsidiary: R350,000
- At year-end, 20% remains in Parent's inventory
- NCI: 20%

**Calculation:**

| | R |
|---|---|
| Profit margin | 30% |
| Closing inventory | 100,000 (20% × R500k) |
| **Unrealised profit** | **30,000** |

**Adjustment (split between parent and NCI):**

| | Parent Share (80%) | NCI Share (20%) |
|---|-------------------|-----------------|
| Unrealised profit | 24,000 | 6,000 |

```
Dr  Cost of sales                              30,000
    Cr  Inventory                                       30,000
```

The effect on retained earnings is split 80/20.

---

## Unrealised Profits: Non-Current Assets

### The Concept

When one group company sells a non-current asset to another at a profit, that profit is **unrealised** from a group perspective until:
- The asset is sold externally, OR
- The profit is realised through depreciation

### Treatment

1. **Eliminate the unrealised profit** on transfer
2. **Adjust depreciation** for the fair value difference
3. Each year, a portion of the profit becomes "realised" through excess depreciation

### Working Example: PPE Transfer

**Facts:**
- On 1 January 20X1, Parent sold equipment to Subsidiary
- Carrying amount in Parent's books: R400,000
- Sale price: R600,000
- Remaining useful life: 4 years
- 80% ownership

**Step 1: Unrealised profit at transfer**

| | R |
|---|---|
| Sale price | 600,000 |
| Carrying amount | 400,000 |
| **Unrealised profit** | **200,000** |

**Year 1 adjustments:**

*Eliminate unrealised profit:*
```
Dr  Gain on sale (P/L or Retained earnings)    200,000
    Cr  Property, plant & equipment                    200,000
```

*Adjust depreciation:*

| | Sub's Depreciation | Correct (Group) | Adjustment |
|---|-------------------|-----------------|------------|
| Annual depreciation | 150,000 (600k ÷ 4) | 100,000 (400k ÷ 4) | 50,000 |

```
Dr  Accumulated depreciation                    50,000
    Cr  Depreciation expense                            50,000
```

**Net unrealised profit at end of Year 1:**

| | R |
|---|---|
| Original unrealised profit | 200,000 |
| Realised through depreciation (Year 1) | (50,000) |
| **Remaining unrealised** | **150,000** |

### Over Time

| Year | Realised | Cumulative Realised | Remaining |
|------|----------|--------------------:|----------:|
| 1 | 50,000 | 50,000 | 150,000 |
| 2 | 50,000 | 100,000 | 100,000 |
| 3 | 50,000 | 150,000 | 50,000 |
| 4 | 50,000 | 200,000 | 0 |

---

## Intragroup Dividends

### The Concept

Dividends paid by a subsidiary to the parent are:
- Income in the parent's separate financial statements
- But NOT income from a group perspective (just movement of cash within group)

### Treatment

**Eliminate:**
- Dividend income in parent
- Dividend paid in subsidiary (from retained earnings)

**Exception:** Dividends to NCI are NOT eliminated—they represent a distribution to parties outside the group.

### Working Example

**Subsidiary declares R100,000 dividend:**
- Parent owns 80%: receives R80,000
- NCI owns 20%: receives R20,000

**Elimination (parent's share only):**
```
Dr  Dividend income (Parent P/L)               80,000
    Cr  Dividends paid (Subsidiary)                    80,000
```

The R20,000 to NCI remains as a distribution.

---

## Deferred Tax on Consolidation Adjustments

### When Deferred Tax Arises

| Adjustment | Deferred Tax Impact |
|------------|---------------------|
| Fair value uplift on assets | DTL on temporary difference |
| Unrealised profit elimination | DTA (profit eliminated but tax was paid) |
| Intragroup asset transfer profit | DTA (until realised through depreciation) |

### Working Example: Unrealised Profit DTax

**Facts:**
- Unrealised profit in inventory: R120,000
- Tax rate: 28%

**The selling company already paid tax on the R120,000 profit.**

From a group perspective:
- Profit eliminated → no group profit
- But tax was paid → recognise DTA

```
Dr  Deferred tax asset                          33,600
    Cr  Deferred tax expense (P/L)                      33,600
(R120,000 × 28%)
```

---

## The Pro-Forma Consolidation Journal

### Standard Set of Entries

**At acquisition:**
1. Eliminate investment and recognise fair value adjustments, goodwill, NCI

**Each period:**
2. Eliminate intragroup balances
3. Eliminate intragroup revenue/expenses
4. Eliminate unrealised profits (inventory, PPE)
5. Adjust for depreciation on fair value adjustments
6. Eliminate intragroup dividends
7. Recognise deferred tax on adjustments
8. Allocate profits to NCI

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Not eliminating both sides of intragroup transactions** | Always eliminate revenue AND expense (or receivable AND payable) |
| **Confusing downstream vs upstream** | Downstream = from parent; Upstream = from sub (NCI shares adjustment) |
| **Forgetting to adjust depreciation on transferred assets** | Excess depreciation realises the unrealised profit over time |
| **Eliminating dividends to NCI** | Only eliminate parent's portion; NCI dividend is a real outflow |
| **Ignoring deferred tax on elimination adjustments** | Consider DTA/DTL implications |
| **Using subsidiary's policies without adjustment** | Align to group policy |

---

## Exam Technique

### Consolidation Workings

**Use structured workings:**

**W1: Group structure**
- % owned, dates, method

**W2: Net assets of subsidiary**

| | At Acquisition | At Year-End | Post-Acq Movement |
|---|----------------|-------------|-------------------|
| Share capital | X | X | - |
| Retained earnings | X | X | X |
| Fair value adjustments | X | X* | - or X |
| **Total** | **X** | **X** | **X** |

**W3: Goodwill**

| | R |
|---|---|
| Consideration | X |
| NCI at acquisition | X |
| Less: FV of net assets | (X) |
| **Goodwill** | **X** |
| Less: Impairment | (X) |
| **Carrying amount** | **X** |

**W4: Non-controlling interest**

| | R |
|---|---|
| NCI at acquisition | X |
| NCI share of post-acquisition RE | X |
| NCI share of unrealised profit adj | (X) |
| **NCI at year-end** | **X** |

**W5: Consolidated retained earnings**

| | R |
|---|---|
| Parent's retained earnings | X |
| Parent's share of sub's post-acq RE | X |
| Less: Unrealised profit | (X) |
| Less: Goodwill impairment | (X) |
| **Consolidated RE** | **X** |

---

## Summary

| Procedure | Key Point |
|-----------|-----------|
| **Uniform policies** | Align subsidiary to group policy |
| **Reporting dates** | Same date (max 3-month difference) |
| **Investment elimination** | Investment ↔ Subsidiary equity + FV adj + Goodwill |
| **Intragroup balances** | Eliminate receivables and payables |
| **Intragroup transactions** | Eliminate revenue and expenses |
| **Unrealised profit - Inventory** | Eliminate at year-end; split for upstream |
| **Unrealised profit - PPE** | Eliminate profit; adjust depreciation to realise |
| **Intragroup dividends** | Eliminate parent's share only |
| **Deferred tax** | Consider DTA/DTL on all adjustments |

---

## What's Next?

In **Part 6**, we cover Non-Controlling Interests in depth:
- Measurement at acquisition
- NCI in profit or loss
- Changes in NCI without loss of control
- Comprehensive examples

---

**← Previous: Part 4 - IFRS 10 Control**

**→ Next: Part 6 - Non-Controlling Interests**

