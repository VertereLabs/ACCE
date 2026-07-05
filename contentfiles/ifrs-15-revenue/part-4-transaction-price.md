# IFRS 15 Revenue from Contracts with Customers - Part 4: Determining the Transaction Price (Step 3)

## The Transaction Price Concept

> **IFRS 15.47**: The transaction price is the amount of consideration to which an entity expects to be **entitled** in exchange for transferring promised goods or services to a customer, **excluding** amounts collected on behalf of third parties.

### Key Points

1. **"Expects to be entitled"** — Not what might be received, but what the entity has a right to
2. **"Excluding third party amounts"** — VAT, sales taxes collected are NOT revenue
3. **Time value of money** — May need to adjust for significant financing components

---

## Components of Transaction Price

The transaction price may include:

| Component | Treatment |
|-----------|-----------|
| Fixed consideration | Include at stated amount |
| Variable consideration | Estimate and potentially constrain |
| Non-cash consideration | Measure at fair value |
| Consideration payable to customer | Generally reduces transaction price |
| Significant financing component | Adjust for time value |

---

## Fixed Consideration

The simplest scenario: a stated price that won't change.

**Example:**
- Sale of goods for R100,000, payable in 30 days
- No discounts, penalties, or bonuses
- Transaction price = **R100,000**

---

## Variable Consideration

### What is Variable Consideration?

Consideration that can vary due to:

| Type | Examples |
|------|----------|
| **Discounts** | Volume discounts, early payment discounts |
| **Rebates** | Retrospective rebates based on volume |
| **Refunds** | Right of return |
| **Credits** | Performance credits |
| **Incentives** | Bonuses for early delivery |
| **Penalties** | Late delivery penalties |
| **Price concessions** | Expected price adjustments |
| **Contingent payments** | Milestone payments, royalties |

### Estimating Variable Consideration

Two methods are permitted—use whichever **better predicts** the amount:

#### Method 1: Expected Value

Probability-weighted sum of possible outcomes.

**Best for:** Large number of similar contracts where outcomes can be statistically estimated.

**Example: Volume Rebate**

Entity sells products with a 5% rebate if annual sales exceed R1,000,000.

| Scenario | Probability | Rebate | Expected Value |
|----------|-------------|--------|----------------|
| Sales < R1m | 30% | R0 | R0 |
| Sales ≥ R1m | 70% | R50,000 | R35,000 |
| **Expected rebate** | | | **R35,000** |

Transaction price reduction = R35,000

#### Method 2: Most Likely Amount

Single most likely outcome from a range.

**Best for:** Binary outcomes (will happen or won't).

**Example: Performance Bonus**

Contract includes R100,000 bonus if delivery is made by 31 December.

| Outcome | Probability |
|---------|-------------|
| Bonus earned | 80% |
| Bonus not earned | 20% |

**Most likely amount** = R100,000 (then subject to constraint below)

> [!TIP]
> **Expected value** works better when there are many possible outcomes along a continuum. **Most likely amount** works better for "all-or-nothing" scenarios.

---

## The Constraint on Variable Consideration

### The Core Rule

> **IFRS 15.56**: Include variable consideration in the transaction price only to the extent that it is **highly probable** that a significant reversal of revenue will NOT occur when the uncertainty is subsequently resolved.

### Understanding "Highly Probable"

| Term | IFRS Meaning |
|------|--------------|
| Probable | More likely than not (>50%) |
| **Highly probable** | Much more than "more likely than not" (~75-80%+ in practice) |

### The Two-Part Test

Variable consideration should NOT be included if:

1. It's **susceptible to factors outside the entity's influence** (e.g., weather, market conditions), OR
2. The uncertainty won't be resolved for a **long period of time**

### Factors Increasing Risk of Reversal

| Factor | Why It Matters |
|--------|---------------|
| Price is highly sensitive to factors outside entity's control | Volatility risk |
| Long time before uncertainty resolves | More unknowns |
| Limited experience with similar contracts | Poor estimation basis |
| Entity has history of offering concessions | Past behaviour predicts future |
| Broad range of possible outcomes | Hard to estimate reliably |

### Working Example: Constraining Variable Consideration

**Scenario:**
- Entity contracts to provide consulting services for a fixed fee of R500,000 plus a performance bonus of up to R200,000
- Bonus is based on client achieving cost savings, measured after 18 months
- Entity has limited experience with this client

**Analysis:**

| Variable Amount | Estimated | Constraint Assessment |
|-----------------|-----------|----------------------|
| Performance bonus | R150,000 (expected value) | High risk of reversal—client outcomes uncertain, long measurement period, limited experience |

**Conclusion:**
- Include only the amount that is **highly probable** not to reverse
- This might be R0 or a reduced amount (e.g., R50,000)
- Re-assess at each reporting date

**Transaction price:**
- Fixed: R500,000
- Variable (constrained): R50,000
- **Total: R550,000** (re-assess as information becomes available)

---

## Right of Return

### Accounting Treatment

When customers have a right to return goods:

1. **Recognise revenue** for consideration expected to be entitled (net of expected returns)
2. **Recognise a refund liability** for expected refunds
3. **Recognise a "right of return asset"** for the right to recover goods from customers

### Working Example: Right of Return

**Facts:**
- Entity sells 1,000 units at R100 each = R100,000
- Cost per unit: R60
- Expected return rate: 5% (based on historical experience)
- Returns occur within 30 days

**Calculations:**

| Component | Amount |
|-----------|--------|
| Expected sales retained (950 units × R100) | R95,000 |
| Expected returns (50 units × R100) | R5,000 |

**Journal Entry at Sale:**

```
Dr  Receivable/Cash                           100,000
Dr  Right of Return Asset (50 × R60)            3,000
    Cr  Revenue                                         95,000
    Cr  Refund Liability                                 5,000
    Cr  Cost of Sales (contra entry for return asset)    3,000
```

Or alternatively presented:

```
Dr  Cash                                      100,000
    Cr  Revenue                                         95,000
    Cr  Refund Liability                                 5,000

Dr  Cost of Sales                              57,000
Dr  Right of Return Asset                       3,000
    Cr  Inventory                                       60,000
```

**Subsequent re-assessment:**

At each reporting date, update estimates:
- Adjust refund liability
- Adjust right of return asset
- Adjust revenue (and cost of sales)

---

## Significant Financing Component

### When Does a Financing Component Exist?

A significant financing component exists when the timing of payments provides a significant financing benefit to either party.

**Key Question:** Is the customer or entity getting more than just goods/services—are they getting **financing**?

### Factors to Consider

| Factor | Indication |
|--------|------------|
| Difference between cash price and consideration | Large difference suggests financing |
| Length of time between payment and transfer | Longer = more likely financing |
| Prevailing interest rates | Compare implicit rate with market rates |

### Adjusting the Transaction Price

**Customer pays in advance:** Transaction price = PV of consideration (discount the liability)

**Customer pays in arrears:** Transaction price = PV of consideration (discount the receivable)

### Practical Expedient

> **IFRS 15.63**: An entity need NOT adjust for financing if the period between transfer and payment is **one year or less**.

Most entities apply this expedient for normal trade credit (30-60-90 day terms).

### Working Example: Significant Financing Component

**Facts:**
- Entity sells equipment with cash price of R1,000,000
- Customer elects to pay in 3 annual instalments of R380,000
- Implicit interest rate: 8%

**Step 1: Identify the financing component**

Total payments: 3 × R380,000 = R1,140,000
Financing component: R1,140,000 - R1,000,000 = R140,000

**Step 2: Calculate PV at transaction date**

| Year | Payment | PV Factor (8%) | Present Value |
|------|---------|----------------|---------------|
| 1 | 380,000 | 0.9259 | 351,842 |
| 2 | 380,000 | 0.8573 | 325,774 |
| 3 | 380,000 | 0.7938 | 301,644 |
| **Total** | | | **979,260** |

(Slight difference from R1m due to rounding in implicit rate)

**Step 3: Journal entries**

*At sale:*
```
Dr  Receivable                              1,140,000
    Cr  Revenue                                       979,260*
    Cr  Unearned interest income                      160,740*
```
*Using calculated PV

*Over the payment period:*
```
Dr  Unearned interest income                    XX,XXX
    Cr  Interest income (P/L)                           XX,XXX

Dr  Cash                                       380,000
    Cr  Receivable                                     380,000
```

### Customer Pays in Advance

If the customer pays significantly in advance:

**Example:**
- Customer pays R900,000 upfront
- Delivery in 2 years
- Market interest rate: 6%

**Transaction price** = R900,000 × (1.06)² = R1,011,240

**Entries:**

*At receipt of payment:*
```
Dr  Cash                                       900,000
    Cr  Contract liability                             900,000
```

*Over the 2 years (interest accretion):*
```
Dr  Interest expense                            XX,XXX
    Cr  Contract liability                              XX,XXX
```

*At delivery:*
```
Dr  Contract liability                       1,011,240
    Cr  Revenue                                     1,011,240
```

---

## Non-Cash Consideration

### Measurement

When customers pay with non-cash consideration (goods, services, shares):

> **IFRS 15.66**: Measure non-cash consideration at **fair value**.

### What if Fair Value Cannot Be Determined?

Use the **stand-alone selling price** of the goods/services transferred to the customer.

### Working Example: Barter Transaction

**Scenario:**
- Entity provides advertising services to Client
- In exchange, Client provides R500,000 worth of inventory
- Fair value of inventory: R480,000

**Transaction price** = R480,000 (fair value of non-cash consideration)

```
Dr  Inventory                                  480,000
    Cr  Revenue                                       480,000
```

---

## Consideration Payable to Customer

### Types of Payments to Customers

| Type | Example |
|------|---------|
| **Cash payments** | Slotting fees, listing fees |
| **Credits** | Rebates credited against amounts owed |
| **Vouchers/coupons** | Issued to customers for future use |
| **Equity instruments** | Shares issued to customers |

### Accounting Treatment

Generally: **Reduce the transaction price** (reduce revenue)

**Exception:** If the payment is for a **distinct good or service** from the customer:
- Account for the purchase separately
- Only reduce revenue if payment exceeds fair value of what's received

### Working Example: Slotting Fee

**Scenario:**
- Supplier pays R100,000 to retailer to stock products
- No distinct good or service received in exchange

**Treatment:**
- Reduce transaction price by R100,000
- Recognise as reduction of revenue over the expected period

```
Dr  Contract asset (prepaid fee)              100,000
    Cr  Cash                                          100,000

As revenue is earned:
Dr  Revenue (reduction)                        XX,XXX
    Cr  Contract asset                                 XX,XXX
```

### Timing of Recognition

Reduce revenue at the **later of**:
- When the entity recognises revenue for the related goods/services
- When the entity pays (or promises to pay)

---

## Summary: Transaction Price Determination

```
Start with stated contract price
│
├── Is there VARIABLE consideration?
│   ├── YES → Estimate (expected value OR most likely amount)
│   │         → Apply CONSTRAINT (highly probable no reversal)
│   └── NO → Use stated price
│
├── Is there a SIGNIFICANT FINANCING component?
│   ├── YES → Adjust to present value (unless < 1 year)
│   └── NO → No adjustment
│
├── Is there NON-CASH consideration?
│   ├── YES → Measure at fair value
│   └── NO → No adjustment
│
└── Is there CONSIDERATION PAYABLE TO CUSTOMER?
    ├── YES → Reduce transaction price (unless for distinct good/service)
    └── NO → No adjustment

= TRANSACTION PRICE (to allocate in Step 4)
```

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Including unconstrained variable consideration** | Apply the constraint—only include highly probable amounts |
| **Using wrong estimation method** | Expected value for many outcomes; most likely for binary |
| **Ignoring financing in long-term contracts** | Adjust if > 1 year between payment and transfer |
| **Reducing revenue for distinct goods/services** | Only reduce if payment exceeds fair value of what's received |
| **Forgetting right of return asset** | When returns expected, recognise asset for recoverable inventory |
| **Measuring barter at invoice value** | Use FAIR VALUE of consideration received |

---

## Exam Technique

### Calculation Questions

**Show clearly:**
1. Fixed consideration
2. Variable consideration (show estimation method)
3. Constraint applied (with reasoning)
4. Financing adjustment (if applicable)
5. Final transaction price

**Example format:**

| Component | Amount (R) | Notes |
|-----------|-----------|-------|
| Fixed consideration | 500,000 | Per contract |
| Performance bonus (expected value) | 80,000 | 80% × R100,000 |
| Less: Constraint | (30,000) | High uncertainty—limit to highly probable |
| Financing adjustment | - | Payment within 30 days—practical expedient |
| **Transaction price** | **550,000** | |

### Discussion Questions

1. **Identify** the type of consideration
2. **Explain** the IFRS 15 requirement
3. **Apply** to the scenario
4. **Conclude** with the treatment

---

## What's Next?

In **Part 5**, we cover Step 4: Allocating the Transaction Price, including:
- Stand-alone selling prices
- Allocation methods
- Discounts and variable consideration allocation

---

**← Previous: Part 3 - Identifying Performance Obligations**

**→ Next: Part 5 - Allocating the Transaction Price**

