# IFRS 15 Revenue from Contracts with Customers - Part 5: Allocating the Transaction Price (Step 4)

## Why Allocation Matters

When a contract has **multiple performance obligations**, the transaction price must be allocated to each obligation. This determines:

- **How much** revenue is recognised for each obligation
- **When** revenue is recognised (as each obligation is satisfied)

> [!IMPORTANT]
> If you identified only ONE performance obligation in Step 2, allocation is simple—the entire transaction price goes to that obligation. This section is critical when there are multiple performance obligations.

---

## The Allocation Objective

> **IFRS 15.73**: The objective is to allocate the transaction price to each performance obligation in an amount that depicts the **amount of consideration** to which the entity expects to be entitled in exchange for transferring the promised goods or services.

### The General Rule

Allocate based on **relative stand-alone selling prices**.

```
Allocation to PO = Transaction Price × (Stand-alone SSP of PO / Total of all Stand-alone SSPs)
```

---

## Stand-Alone Selling Price (SSP)

### What is the Stand-Alone Selling Price?

> **IFRS 15.77**: The stand-alone selling price is the price at which an entity would sell a promised good or service **separately** to a customer.

**In plain terms:** What would you charge if you sold this item on its own?

### The Best Evidence: Observable Prices

The best evidence of SSP is the **observable price** when the entity sells that good or service separately in similar circumstances to similar customers.

### When Observable Prices Don't Exist

If stand-alone selling price isn't directly observable, **estimate it** using one of these methods:

| Method | Description | When to Use |
|--------|-------------|-------------|
| **Adjusted Market Assessment** | Evaluate what customers in the market would pay | Market data available |
| **Expected Cost Plus Margin** | Forecast costs + add appropriate margin | Cost structure is clear |
| **Residual Approach** | Transaction price minus other observable SSPs | Highly variable or uncertain prices |

### Method 1: Adjusted Market Assessment

Look at the market and estimate what customers would pay for similar goods/services.

**Steps:**
1. Research prices charged by competitors
2. Adjust for entity-specific factors (brand, quality, features)
3. Consider what the entity's customers would pay

**Example:**
- Entity sells software that competitors price at R80,000 - R120,000
- Entity's product has premium features
- Estimated SSP: R110,000

### Method 2: Expected Cost Plus Margin

Estimate costs and add an appropriate margin.

**Steps:**
1. Calculate expected cost to satisfy the obligation
2. Add a margin consistent with similar transactions

**Example:**
- Implementation service costs: R50,000 (labour, overheads)
- Normal margin for similar services: 40%
- Estimated SSP: R50,000 × 1.40 = R70,000

### Method 3: Residual Approach

Assign the "leftover" amount after deducting other observable SSPs.

**Can ONLY be used when:**
- The entity sells the same good/service to different customers at a wide range of prices, OR
- The price has not been established (new product)

**Example:**
- Bundle sold for R200,000
- Component A (observable SSP): R150,000
- Component B (highly variable pricing): Residual = R50,000

> [!CAUTION]
> The residual approach can result in **zero allocation** to a performance obligation. This is only acceptable if genuinely supported by evidence.

---

## Working Example: Basic Allocation

### Scenario

TechCo sells a bundled package:
- Software license (normally sold separately for R100,000)
- Implementation services (normally sold separately for R40,000)
- 12 months support (normally sold separately for R20,000)
- **Bundle price: R130,000**

### Step 1: Identify Stand-Alone Selling Prices

| Performance Obligation | SSP |
|----------------------|-----|
| Software license | R100,000 |
| Implementation | R40,000 |
| Support (12 months) | R20,000 |
| **Total SSP** | **R160,000** |

### Step 2: Calculate Allocation Percentages

| Performance Obligation | SSP | % |
|----------------------|-----|---|
| Software license | 100,000 | 62.5% |
| Implementation | 40,000 | 25.0% |
| Support | 20,000 | 12.5% |
| **Total** | **160,000** | **100%** |

### Step 3: Allocate Transaction Price

| Performance Obligation | Allocation (R130,000 ×) | Amount |
|----------------------|------------------------|--------|
| Software license | 62.5% | R81,250 |
| Implementation | 25.0% | R32,500 |
| Support | 12.5% | R16,250 |
| **Total** | | **R130,000** |

### Result

- Revenue for software: R81,250 (recognised when license delivered)
- Revenue for implementation: R32,500 (recognised over implementation period)
- Revenue for support: R16,250 (recognised over 12 months)

---

## Allocation of Discounts

### General Rule: Proportionate Allocation

A discount is generally allocated **proportionately** to all performance obligations.

### Exception: Allocate Discount to Specific Obligations

A discount can be allocated entirely to one or more (but not all) performance obligations if **all three criteria** are met:

1. Entity regularly sells each distinct good/service separately
2. Entity regularly sells bundles of some (but not all) of those goods/services at a discount
3. The discount is substantially the same as the discount in the current bundle, with observable evidence

### Working Example: Specific Discount Allocation

**Scenario:**

Entity sells:
- Product A (SSP R100)
- Product B (SSP R50)
- Service C (SSP R50)

**Regular pricing:**
- A + B as a bundle: R120 (R30 discount)
- C sold alone: R50 (no discount)

**Current contract:**
- A + B + C for R170

**Analysis:**
- Total SSP: R200
- Discount: R30
- Historical evidence: Discount normally relates to A + B bundle

**Allocation:**

| Obligation | SSP | Discount | Allocated Amount |
|------------|-----|----------|-----------------|
| Product A | 100 | (20)* | 80 |
| Product B | 50 | (10)* | 40 |
| Service C | 50 | 0 | 50 |
| **Total** | **200** | **(30)** | **170** |

*Discount allocated proportionately within the A+B bundle (R30 × 100/150 = R20; R30 × 50/150 = R10)

---

## Allocation of Variable Consideration

### General Rule: Proportionate Allocation

Variable consideration is generally allocated **proportionately** to all performance obligations.

### Exception: Allocate Variable Consideration to Specific Obligations

Allocate variable consideration entirely to one performance obligation (or a distinct good/service in a series) if **both criteria** are met:

1. The terms of the variable payment relate specifically to satisfying that obligation
2. Allocating entirely to that obligation is consistent with the overall allocation objective

### Working Example: Variable Consideration Allocation

**Scenario:**

Construction contract:
- Phase 1: Foundation (SSP R2m)
- Phase 2: Superstructure (SSP R5m)
- Bonus of R500,000 if Phase 2 completed early

**Analysis:**
- The bonus relates specifically to Phase 2
- Allocation entirely to Phase 2 is consistent with the objective

**Allocation:**

| Obligation | Fixed Price | Variable (Bonus) | Total (if earned) |
|------------|-------------|------------------|-------------------|
| Phase 1 | R2,000,000 | R0 | R2,000,000 |
| Phase 2 | R5,000,000 | R500,000 | R5,500,000 |
| **Total** | **R7,000,000** | **R500,000** | **R7,500,000** |

---

## Changes in Transaction Price After Allocation

### What Happens When the Transaction Price Changes?

After contract inception, the transaction price may change due to:
- Resolution of variable consideration uncertainty
- Contract modifications
- Changes in estimates

### General Rule

Allocate changes to performance obligations on the **same basis as the original allocation**.

### Exception for Changes in Variable Consideration

If variable consideration was allocated to a specific performance obligation:
- Changes in that variable consideration are allocated only to that obligation

### Working Example: Change in Transaction Price

**Original allocation:**

| Obligation | % | Original Allocation |
|------------|---|---------------------|
| Product A | 60% | R60,000 |
| Service B | 40% | R40,000 |
| **Total** | | **R100,000** |

**Subsequently:**
- Performance milestone achieved
- Additional R20,000 becomes unconstraint

**Updated allocation:**

| Obligation | % | Additional | New Total |
|------------|---|------------|-----------|
| Product A | 60% | R12,000 | R72,000 |
| Service B | 40% | R8,000 | R48,000 |
| **Total** | | **R20,000** | **R120,000** |

If Product A already fully satisfied:
- R12,000 recognised immediately as revenue
- R8,000 recognised as Service B is satisfied

---

## Practical Considerations

### When SSP Estimation is Challenging

| Challenge | Approach |
|-----------|----------|
| New product (no history) | Expected cost plus margin, or market assessment |
| Highly customised goods | Expected cost plus margin |
| Free items in bundles | Allocate based on relative SSP (even if given free) |
| Price varies by customer | Consider if residual approach appropriate |

### SSP of "Free" Items

If a good/service is provided "free" in a bundle, it **still has an SSP**. Revenue must be allocated to it.

**Example:**
- "Buy phone, get case free"
- Case SSP: R500
- This R500 must be allocated from the bundle price

---

## Summary: The Allocation Process

```
1. DETERMINE transaction price (Step 3)
   │
2. IDENTIFY performance obligations (Step 2)
   │
3. DETERMINE stand-alone selling price for EACH obligation
   │
   ├── Observable price available? → Use it
   │
   └── Not observable? → Estimate using:
       ├── Adjusted market assessment
       ├── Expected cost plus margin, OR
       └── Residual approach (limited use)
   │
4. ALLOCATE proportionately based on relative SSPs
   │
5. APPLY exceptions where criteria met:
   ├── Allocate discount to specific obligations
   └── Allocate variable consideration to specific obligations
   │
6. RECOGNISE revenue as each obligation is satisfied (Step 5)
```

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Using contract prices instead of SSPs** | SSP is what you'd charge SEPARATELY, not the bundled price |
| **Forgetting to allocate to "free" items** | Free items still have an SSP—allocate accordingly |
| **Using residual approach without justification** | Can only use when prices are highly variable or not established |
| **Allocating discount to all obligations** | Check if evidence supports specific allocation |
| **Ignoring variable consideration allocation rules** | If payment relates to specific obligation, allocate specifically |
| **Not updating allocation when transaction price changes** | Use same basis as original allocation |

---

## Exam Technique

### Standard Calculation Format

**Step 1: List SSPs**

| Performance Obligation | SSP |
|----------------------|-----|
| Obligation 1 | R___ |
| Obligation 2 | R___ |
| Obligation 3 | R___ |
| **Total** | **R___** |

**Step 2: Calculate Percentages**

| Performance Obligation | SSP | Percentage |
|----------------------|-----|------------|
| Obligation 1 | R___ | ___% |
| ... | | |
| **Total** | **R___** | **100%** |

**Step 3: Allocate Transaction Price (R___)**

| Performance Obligation | Percentage | Allocation |
|----------------------|------------|------------|
| Obligation 1 | ___% | R___ |
| ... | | |
| **Total** | **100%** | **R___** |

### Discussion Points

When asked to **explain** the allocation:
1. State the IFRS 15 objective (depict consideration expected)
2. Explain the use of relative SSPs
3. Describe how SSPs were determined (observable or estimated)
4. Justify any exceptions applied (discount/variable allocation)

---

## What's Next?

In **Part 6**, we tackle Step 5: Recognising Revenue, including:
- Satisfaction of performance obligations
- Over time vs. point in time recognition
- Measuring progress
- Transfer of control indicators

---

**← Previous: Part 4 - Determining Transaction Price**

**→ Next: Part 6 - Recognising Revenue**

