# Groups & Business Combinations - Part 10: Foreign Subsidiaries (IAS 21 Integration)

## Introduction

When a group includes **foreign operations** (subsidiaries, associates, joint ventures, or branches with a different functional currency), IAS 21 *The Effects of Changes in Foreign Exchange Rates* applies.

This part covers:
1. Functional currency determination
2. Translation of foreign operations
3. Exchange differences on consolidation
4. Goodwill and fair value adjustments

---

## Functional Currency

### The Definition

> **IAS 21.8**: Functional currency is the currency of the **primary economic environment** in which the entity operates.

### Determining Functional Currency

| Factor | Primary Consideration |
|--------|----------------------|
| **Sales currency** | Currency in which sales prices are denominated and settled |
| **Competition/regulation** | Currency that mainly influences sales prices |
| **Cost currency** | Currency of labour, materials, and other costs |
| **Financing** | Currency in which funds from financing are generated |

### Indicators for Foreign Operations

| Indicator | Suggests Same FC as Parent | Suggests Different FC |
|-----------|---------------------------|----------------------|
| Activities are extension of parent | ✓ | |
| High proportion of transactions with parent | ✓ | |
| Cash flows directly affect parent | ✓ | |
| Operates independently | | ✓ |
| Local transactions are primary | | ✓ |
| Local financing without parent support | | ✓ |

### Example

A South African parent has a UK subsidiary:
- Sales in GBP to UK customers
- Costs in GBP (UK staff, UK suppliers)
- Financed by UK banks

**Functional currency of subsidiary:** GBP

---

## Translation to Presentation Currency

### When Translation is Needed

If an entity's functional currency differs from its **presentation currency**, the financial statements must be translated.

### Translation Method

| Item | Exchange Rate |
|------|---------------|
| **Assets and liabilities** | Closing rate at reporting date |
| **Income and expenses** | Rate at date of transaction (or average rate as approximation) |
| **Equity items** | Historical rate |

### Exchange Differences

> **IAS 21.39**: Exchange differences arising on translation are recognised in **OCI** (foreign currency translation reserve—FCTR).

---

## Consolidation of Foreign Subsidiaries

### Step-by-Step Process

1. Prepare foreign subsidiary's financial statements in its **functional currency**
2. Adjust for **group accounting policies**
3. **Translate** to parent's presentation currency
4. Perform normal **consolidation procedures**

### Translation of Subsidiary's Financial Statements

| Statement | Translation |
|-----------|-------------|
| **Assets and liabilities** | Closing rate |
| **Revenue and expenses** | Average rate (or transaction date rate) |
| **Dividends** | Rate on declaration date |
| **Share capital** | Historical rate (acquisition date) |
| **Pre-acquisition retained earnings** | Historical rate (acquisition date) |
| **Post-acquisition retained earnings** | Translated P/L less translated dividends |

---

## Goodwill and Fair Value Adjustments

### The Question

In which currency is goodwill expressed?

### IAS 21 Requirement

> **IAS 21.47**: Goodwill and fair value adjustments to assets/liabilities are treated as **assets and liabilities of the foreign operation**.

### What This Means

| Item | Treatment |
|------|-----------|
| Goodwill | Expressed in subsidiary's functional currency; translated at closing rate each period |
| Fair value adjustments | Same—treated as subsidiary's assets/liabilities |

### Exchange Differences on Goodwill

The exchange difference arising from translating goodwill at different rates:
- Recognised in **OCI** (FCTR)
- Part of the translation differences on the net investment

---

## Working Example: Foreign Subsidiary

### Facts

**Acquisition:**
- SA Parent acquired 100% of UK Sub on 1 January 20X1
- Consideration: £1,000,000
- Fair value of net assets acquired: £800,000
- Goodwill: £200,000

**Exchange rates (ZAR/GBP):**

| Date | Rate |
|------|------|
| 1 January 20X1 (acquisition) | 20.00 |
| 31 December 20X1 (closing) | 22.00 |
| Average 20X1 | 21.00 |

**UK Sub's financial statements at 31 December 20X1:**

| | £ |
|---|---|
| Net assets (excluding goodwill) | 900,000 |
| Profit for year | 100,000 |
| Dividends declared (30 June) | - |

### Step 1: Translate Net Assets

| Item | £ | Rate | ZAR |
|------|---|------|-----|
| Opening net assets | 800,000 | 20.00 | 16,000,000 |
| Profit for year | 100,000 | 21.00 | 2,100,000 |
| **Closing net assets** | **900,000** | | |
| At closing rate | 900,000 | 22.00 | **19,800,000** |

### Step 2: Calculate FCTR on Net Assets

| | ZAR |
|---|---|
| Closing net assets at closing rate | 19,800,000 |
| Opening net assets at historical rate | (16,000,000) |
| Profit at average rate | (2,100,000) |
| **FCTR on net assets** | **1,700,000** |

### Step 3: Translate Goodwill

| | £ | Rate | ZAR |
|---|---|------|-----|
| Goodwill at acquisition | 200,000 | 20.00 | 4,000,000 |
| Goodwill at closing rate | 200,000 | 22.00 | 4,400,000 |
| **FCTR on goodwill** | | | **400,000** |

### Step 4: Total FCTR

| Component | ZAR |
|-----------|-----|
| FCTR on net assets | 1,700,000 |
| FCTR on goodwill | 400,000 |
| **Total FCTR** | **2,100,000** |

### Consolidated Amounts (Parent's Perspective)

| Item | ZAR |
|------|-----|
| Goodwill | 4,400,000 |
| Net assets from Sub | 19,800,000 |
| FCTR (OCI) | 2,100,000 |

---

## Net Investment in Foreign Operation

### What Constitutes Net Investment

The net investment includes:
- Equity investment in subsidiary
- Long-term receivables/payables that are "in substance" part of the investment

### Exchange Differences on Monetary Items

If parent has a long-term loan to/from foreign subsidiary:

> **IAS 21.32**: Exchange differences on monetary items forming part of the net investment are recognised in **OCI** in consolidated FS.

### Example

Parent has a USD loan to US subsidiary of $1,000,000:
- No repayment planned in foreseeable future
- Forms part of net investment
- Exchange differences → OCI (FCTR)

---

## Disposal of Foreign Operation

### On Disposal

When a foreign operation is disposed of:

> **IAS 21.48**: The cumulative FCTR is **reclassified to profit or loss** as part of the gain or loss on disposal.

### Partial Disposal

| Scenario | FCTR Treatment |
|----------|---------------|
| **Dispose retaining control** | Proportionate FCTR attributed to NCI (no P/L) |
| **Dispose losing control** | Cumulative FCTR reclassified to P/L |
| **Dispose reducing to associate** | Proportionate FCTR reclassified to P/L |

### Working Example: Disposal of Foreign Sub

**Facts:**
- Parent sells 100% of foreign subsidiary
- Cumulative FCTR: R2,100,000 (credit)
- Proceeds: R25,000,000
- Carrying amount of net investment: R24,200,000

**Gain on disposal:**

| | ZAR |
|---|---|
| Proceeds | 25,000,000 |
| Carrying amount (net assets + goodwill) | (24,200,000) |
| FCTR reclassified | 2,100,000 |
| **Gain on disposal** | **2,900,000** |

---

## Hyperinflationary Economies

### IAS 29 Requirement

If the foreign subsidiary's functional currency is that of a **hyperinflationary economy**:

1. First, restate the subsidiary's FS for inflation (IAS 29)
2. Then translate to presentation currency at **closing rate** for all items

### Indicators of Hyperinflation

| Indicator |
|-----------|
| Population keeps wealth in non-monetary assets or stable foreign currency |
| Prices quoted in stable foreign currency |
| Credit sales/purchases at prices compensating for expected inflation |
| Interest rates, wages, prices linked to price index |
| Cumulative inflation over 3 years approaches or exceeds 100% |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Translating goodwill at historical rate** | Goodwill is subsidiary's asset—translate at closing rate |
| **Recognising translation differences in P/L** | Translation differences go to OCI (FCTR) |
| **Forgetting to reclassify FCTR on disposal** | Cumulative FCTR goes to P/L on loss of control |
| **Using closing rate for P/L items** | Use average rate (or transaction date) for income/expenses |
| **Ignoring monetary items in net investment** | Include long-term items with no planned settlement |
| **Applying IAS 21 before IAS 29** | For hyperinflation: IAS 29 first, then translate at closing rate |

---

## Exam Technique

### Foreign Subsidiary Questions

**Standard approach:**

1. **Identify functional currencies** (parent and subsidiary)
2. **Translate subsidiary FS** to presentation currency:
   - Assets/liabilities: Closing rate
   - P/L items: Average rate
   - Equity: Historical rate
3. **Calculate FCTR** (balancing figure in translation)
4. **Translate goodwill** at closing rate; calculate FCTR on goodwill
5. **Prepare consolidation entries** as normal
6. **On disposal:** Reclassify cumulative FCTR

### Translation Working

| | FC | Rate | PC |
|---|---|------|---|
| **Assets and liabilities** | | Closing | |
| Net assets at acquisition | X | Hist | X |
| Post-acq RE | X | Various | X |
| **Total translated net assets** | | | **X** |
| Check: Net assets × closing | X | Closing | X |
| **FCTR (balancing)** | | | **X** |

### Goodwill Translation

| | FC | Rate | PC |
|---|---|------|---|
| Goodwill at acquisition | X | Hist | X |
| Goodwill at closing rate | X | Closing | X |
| **FCTR on goodwill** | | | **X** |

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Functional currency** | Currency of primary economic environment |
| **Translation method** | Assets/liabilities at closing; P/L at average |
| **Exchange differences** | Recognised in OCI (FCTR) |
| **Goodwill** | Treated as subsidiary's asset; translated at closing rate |
| **Net investment** | Includes long-term monetary items |
| **Disposal** | Cumulative FCTR reclassified to P/L |
| **Hyperinflation** | Apply IAS 29 first; then translate at closing rate |

---

## What's Next?

In **Part 11**, we cover Exam Strategy for Groups Questions:
- Structured approach
- Time allocation
- Common mark-losing errors
- Comprehensive worked example

---

**← Previous: Part 9 - Step Acquisitions & Disposals**

**→ Next: Part 11 - Exam Strategy**

