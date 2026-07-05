# Groups & Business Combinations - Part 6: Non-Controlling Interests

## What is a Non-Controlling Interest?

> **IFRS 10 Appendix A**: A non-controlling interest is **equity in a subsidiary not attributable**, directly or indirectly, **to a parent**.

### In Simple Terms

If Parent owns 80% of Subsidiary:
- 80% = Parent's interest
- 20% = Non-controlling interest (NCI)

NCI represents the portion of the subsidiary owned by **outside shareholders**.

---

## NCI at Acquisition: Two Methods

### The Choice

IFRS 3 permits a choice for measuring NCI at acquisition date:

| Method | NCI Measured At |
|--------|-----------------|
| **Full goodwill** (Option 1) | Fair value of NCI |
| **Partial goodwill** (Option 2) | NCI's proportionate share of identifiable net assets |

> [!IMPORTANT]
> The choice is made **per acquisition** (not a blanket policy). Different acquisitions can use different methods.

### Method 1: Full Goodwill (Fair Value of NCI)

NCI is measured at its **fair value** at acquisition date.

**Goodwill includes:**
- Parent's share of goodwill
- NCI's share of goodwill (imputed)

**How to determine NCI fair value:**
- Quoted market price (if shares are listed)
- Valuation techniques (DCF, comparable transactions)
- May differ from proportionate share of consideration paid

### Method 2: Partial Goodwill (Share of Net Assets)

NCI is measured as its **proportionate share** of the acquiree's identifiable net assets.

**Goodwill includes:**
- Only the parent's share of goodwill

### Comparison Example

**Facts:**
- Parent acquires 80% of Subsidiary for R4,000,000
- Fair value of identifiable net assets: R4,500,000
- Fair value of NCI (20%): R1,100,000

| | Full Goodwill | Partial Goodwill |
|---|---------------|------------------|
| Consideration (80%) | 4,000,000 | 4,000,000 |
| NCI at acquisition | 1,100,000 (FV) | 900,000 (20% × 4,500,000) |
| **Total** | **5,100,000** | **4,900,000** |
| Less: FV net assets | (4,500,000) | (4,500,000) |
| **Goodwill** | **600,000** | **400,000** |

**The difference (R200,000) represents NCI's share of goodwill.**

---

## NCI in the Statement of Financial Position

### Components

| Component | Calculation |
|-----------|-------------|
| NCI at acquisition | Per method chosen above |
| + NCI share of post-acquisition profits | NCI% × Subsidiary's post-acquisition retained earnings |
| − NCI share of post-acquisition losses | NCI% × Subsidiary's post-acquisition losses |
| − NCI share of dividends | NCI% × Dividends declared |
| ± NCI share of OCI | NCI% × Subsidiary's OCI movements |
| ± Adjustments | Unrealised profits (upstream), impairment |

### Working Example: NCI Movement

**Facts:**
- Acquisition date: 1 January 20X1
- NCI at acquisition (partial method): R900,000
- NCI%: 20%
- Subsidiary's post-acquisition profit (20X1): R500,000
- Subsidiary's dividend declared: R100,000
- Upstream unrealised profit (Year 1): R50,000

**Calculation:**

| | R |
|---|---|
| NCI at acquisition | 900,000 |
| NCI share of profit (20% × 500,000) | 100,000 |
| NCI share of dividend (20% × 100,000) | (20,000) |
| NCI share of unrealised profit (20% × 50,000) | (10,000) |
| **NCI at 31 December 20X1** | **970,000** |

---

## NCI in Profit or Loss

### Presentation

> **IFRS 10.B94**: Profit or loss and each component of other comprehensive income are attributed to the owners of the parent and to non-controlling interests.

### The Split

| | Parent | NCI | Total |
|---|--------|-----|-------|
| Consolidated profit for the year | X | X | X |
| Other comprehensive income | X | X | X |
| **Total comprehensive income** | **X** | **X** | **X** |

### Loss Absorption

> **IFRS 10.B94**: A subsidiary may have **cumulative losses** that exceed the NCI in its equity. The excess, and any further losses, are attributed to NCI **even if this results in a deficit balance**.

**This means:**
- NCI can go negative
- NCI absorbs its share of losses regardless
- No "cap" on NCI's loss absorption

---

## Changes in Ownership Without Loss of Control

### The Concept

If the parent's ownership in a subsidiary **changes** but **control is retained**, this is an **equity transaction**.

> **IFRS 10.23**: Changes in a parent's ownership interest in a subsidiary that do not result in loss of control are accounted for as **equity transactions**.

### No New Goodwill or Gain/Loss

| What Happens | What Doesn't Happen |
|--------------|---------------------|
| Adjust NCI for change in % | Recognise gain or loss in P/L |
| Adjust parent's equity | Recalculate goodwill |
| | Remeasure assets/liabilities |

### The Mechanics

**Parent buys more shares (say 80% → 90%):**

| | Debit | Credit |
|---|-------|--------|
| NCI (10% of net assets) | | X |
| Cash (consideration) | | X |
| Equity (parent's reserve) | X or | X |

**Balancing figure goes to parent's equity (often a separate reserve).**

### Working Example: Increase in Ownership

**Facts:**
- Parent owns 80% of Subsidiary
- Subsidiary's net assets: R5,000,000
- Parent acquires additional 10% for R600,000
- NCI before: 20% × R5,000,000 = R1,000,000
- NCI after: 10% × R5,000,000 = R500,000

**Calculation:**

| | R |
|---|---|
| Consideration paid | 600,000 |
| NCI transferred (10% × R5m) | 500,000 |
| **Excess to equity** | **(100,000)** |

**Journal Entry:**
```
Dr  NCI                                         500,000
Dr  Equity reserve (parent)                     100,000
    Cr  Cash                                            600,000
```

### Working Example: Decrease in Ownership (Retaining Control)

**Facts:**
- Parent owns 90% of Subsidiary
- Subsidiary's net assets: R5,000,000
- Parent sells 10% for R700,000
- NCI before: 10% × R5,000,000 = R500,000
- NCI after: 20% × R5,000,000 = R1,000,000

**Calculation:**

| | R |
|---|---|
| Cash received | 700,000 |
| NCI transferred (10% × R5m) | 500,000 |
| **Excess to equity** | **200,000** |

**Journal Entry:**
```
Dr  Cash                                        700,000
    Cr  NCI                                             500,000
    Cr  Equity reserve (parent)                         200,000
```

**No gain or loss in profit or loss!**

---

## NCI and Goodwill Impairment

### Full Goodwill Method

Under full goodwill:
- Total goodwill (parent + NCI share) is tested for impairment
- Impairment is allocated between parent and NCI

**Example:**
- Goodwill: R600,000 (parent R480,000 + NCI R120,000)
- Impairment: R150,000

**Allocation:**
- Parent (80%): R120,000
- NCI (20%): R30,000

### Partial Goodwill Method

Under partial goodwill:
- Only parent's goodwill is recognised
- For impairment testing, goodwill is grossed up (notionally)
- Impairment is recognised only for parent's portion

---

## NCI in Other Comprehensive Income

### Treatment

NCI receives its share of all OCI items:

| OCI Item | NCI Treatment |
|----------|---------------|
| Revaluation surplus | NCI% of revaluation |
| Foreign currency translation | NCI% of translation differences |
| Cash flow hedge reserve | NCI% of hedge movements |
| Remeasurement of defined benefit plans | NCI% of remeasurement |

### Presentation

In the Statement of Comprehensive Income:
```
Total comprehensive income for the year    X

Attributable to:
  Owners of the parent                     X
  Non-controlling interests                X
                                           X
```

---

## NCI Disclosures

### Required Disclosures (IFRS 12)

| Disclosure | Requirement |
|------------|-------------|
| **NCI composition** | For each subsidiary with material NCI |
| **Name and principal place of business** | Of subsidiary |
| **Proportion held by NCI** | % ownership |
| **P/L attributable to NCI** | Amount |
| **Accumulated NCI** | Amount in equity |
| **Summarised financial information** | For material subsidiaries |

### Summarised Information

For each subsidiary with material NCI, disclose:
- Revenue, profit/loss
- Total assets, liabilities
- Dividends paid to NCI
- Cash flows (operating, investing, financing)

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Mixing up full and partial goodwill** | Choose one method per acquisition; apply consistently |
| **Recognising gain on NCI transactions** | Changes without loss of control go through EQUITY |
| **Capping NCI losses** | NCI absorbs losses even if negative |
| **Forgetting NCI share of upstream unrealised profit** | Upstream adjustments are split between parent and NCI |
| **Ignoring NCI in OCI** | NCI shares in all comprehensive income items |
| **Not disclosing material NCI** | IFRS 12 requires extensive disclosure |

---

## Exam Technique

### NCI Calculation Questions

**Standard working:**

| | R |
|---|---|
| NCI at acquisition: | |
| - Fair value of NCI, OR | X |
| - NCI% × FV of net assets | X |
| NCI share of post-acquisition RE | X |
| NCI share of post-acquisition OCI | X |
| NCI share of dividends | (X) |
| Adjustments: | |
| - Upstream unrealised profit (NCI%) | (X) |
| - Goodwill impairment (NCI share if full) | (X) |
| **NCI at reporting date** | **X** |

### NCI in P/L

| | R |
|---|---|
| Subsidiary profit for the year | X |
| Adjustments (unrealised profit, etc.) | (X) |
| **Adjusted subsidiary profit** | **X** |
| × NCI% | |
| **NCI share of profit** | **X** |

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **NCI definition** | Equity in subsidiary not attributable to parent |
| **Measurement at acquisition** | Full goodwill (FV) or Partial (share of net assets) |
| **Subsequent measurement** | NCI at acquisition + share of post-acq movements |
| **Changes without loss of control** | Equity transaction—no P/L impact |
| **Loss absorption** | NCI absorbs losses even if balance goes negative |
| **Impairment** | Full: split with NCI; Partial: parent only |
| **OCI** | NCI shares in OCI proportionately |
| **Disclosure** | Extensive for material NCI (IFRS 12) |

---

## What's Next?

In **Part 7**, we cover IAS 28 Associates and the Equity Method:
- Significant influence
- Equity method mechanics
- Upstream and downstream transactions
- Impairment of investments in associates

---

**← Previous: Part 5 - Consolidation Procedures**

**→ Next: Part 7 - IAS 28 Associates**

