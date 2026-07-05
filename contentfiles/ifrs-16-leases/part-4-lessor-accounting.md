# IFRS 16 Leases - Part 4: Lessor Accounting

## Introduction: A Different World for Lessors

While IFRS 16 revolutionized lessee accounting with a single model, **lessor accounting remains largely unchanged** from IAS 17. Lessors still classify leases as either:
- **Finance leases**, or
- **Operating leases**

This dual model reflects the economic difference between leases that transfer substantially all risks and rewards of ownership (finance) versus those that don't (operating).

> [!NOTE]
> Think of it this way: IFRS 16 took the lessee's "operating lease" classification away. But the lessor still uses both classifications because the lessor needs to determine whether to derecognize the asset.

---

## Lease Classification: The Foundation

### The Core Principle

A lease is classified as a **finance lease** if it transfers **substantially all the risks and rewards incidental to ownership** of an underlying asset.

A lease is classified as an **operating lease** if it does **not** transfer substantially all the risks and rewards.

### Risk and Rewards - What Are They?

| Risks | Rewards |
|-------|---------|
| Losses from idle capacity | Gain from appreciation in value |
| Technological obsolescence | Profitable operation over asset's life |
| Variations in return due to economic conditions | Gain from expected residual value |

### Classification Indicators

IFRS 16 provides indicators that **individually or in combination** would normally lead to finance lease classification:

| Indicator | Finance Lease Indicator |
|-----------|------------------------|
| **1. Transfer of ownership** | Lease transfers ownership to lessee at end of lease term |
| **2. Bargain purchase option** | Lessee has option to purchase at price expected to be sufficiently lower than fair value that exercise is reasonably certain |
| **3. Major part of economic life** | Lease term is for the major part of the asset's economic life (even if title not transferred) |
| **4. Present value test** | Present value of lease payments amounts to at least substantially all of fair value of underlying asset |
| **5. Specialized asset** | Asset is of specialized nature that only lessee can use without major modifications |

### Additional Indicators

| Indicator | Finance Lease Indicator |
|-----------|------------------------|
| **6. Cancellation losses** | If lessee cancels, losses are borne by lessee |
| **7. Residual value fluctuations** | Gains/losses from residual value fluctuations accrue to lessee |
| **8. Bargain renewal option** | Lessee can continue lease for secondary period at below-market rent |

> [!WARNING]
> **Common pitfall**: Students often apply these indicators mechanically without understanding the principle. Remember: the indicators are EXAMPLES of when risks and rewards transfer. The PRINCIPLE is what matters.

### "Substantially All" and "Major Part" - What Do They Mean?

IFRS 16 does NOT define these terms numerically. However:
- Historical practice (from IAS 17) used **75%** for "major part" of economic life
- Historical practice used **90%** for "substantially all" of fair value

> [!CAUTION]
> These percentages are **guidance**, not rules. A lease at 73% of economic life could still be a finance lease if other factors indicate risk/reward transfer. Always apply judgment.

---

## Finance Lease - Lessor Accounting

### Initial Recognition

At commencement, the lessor:
1. **Derecognizes** the underlying asset
2. **Recognizes** a receivable (the "net investment in the lease")
3. **Recognizes** any selling profit or loss (if manufacturer/dealer lessor)

### Net Investment in the Lease

The **net investment** is the **gross investment** discounted at the **interest rate implicit in the lease**.

```
Gross Investment = Lease Payments + Unguaranteed Residual Value
                   (expected to be received)

Net Investment = Present Value of Gross Investment at Implicit Rate
```

### Interest Rate Implicit in the Lease

This is the rate that causes the present value of:
- Lease payments, PLUS
- Unguaranteed residual value

To equal the sum of:
- Fair value of the underlying asset, PLUS
- Initial direct costs of the lessor

In simple terms: the implicit rate equates the lessor's investment to the present value of expected cash flows.

### Working Example: Finance Lease Recognition (Non-Dealer Lessor)

**Facts:**
- Lessor (not a manufacturer/dealer) leases equipment
- Fair value of equipment: R500,000
- Lease term: 5 years
- Annual payment: R130,000 (payable at year-end)
- Unguaranteed residual value at end of lease: R20,000
- Interest rate implicit in lease: 10%
- Carrying amount of equipment: R500,000 (equals fair value)
- Initial direct costs: R0

**Step 1: Calculate Gross Investment**

| Component | Amount |
|-----------|--------|
| Lease payments (5 × R130,000) | 650,000 |
| Unguaranteed residual | 20,000 |
| **Gross Investment** | **670,000** |

**Step 2: Calculate Net Investment**

| Component | PV @ 10% | Amount |
|-----------|----------|--------|
| Lease payments (annuity) | R130,000 × 3.7908 | 492,804 |
| Unguaranteed residual (single sum) | R20,000 × 0.6209 | 12,418 |
| **Net Investment** | | **505,222** |

*Note: The difference from R500,000 fair value is due to rounding in PV factors. In practice, the implicit rate is calculated to equate these exactly.*

**Step 3: Journal Entry at Commencement**

```
Dr  Lease Receivable (Net Investment)             505,222
    Cr  Equipment (PPE)                                      500,000
    Cr  Gain on lease (if any)                                 5,222*
```
*This gain could arise from the transaction; typically net investment = FV in a non-dealer lease*

### Subsequent Measurement

The lessor recognizes:
1. **Finance income** - Using effective interest method on the net investment
2. **Receipt of lease payments** - Reducing the lease receivable

### Amortization Schedule

**Continuing the example:**

| Year | Opening NI | Finance Income @ 10% | Payment Received | Closing NI |
|------|------------|----------------------|------------------|------------|
| 1 | 505,222 | 50,522 | (130,000) | 425,744 |
| 2 | 425,744 | 42,574 | (130,000) | 338,318 |
| 3 | 338,318 | 33,832 | (130,000) | 242,150 |
| 4 | 242,150 | 24,215 | (130,000) | 136,365 |
| 5 | 136,365 | 13,637 | (130,000) | 20,002* |

*Residual value remains as the balance (approximately R20,000 - rounding difference)

**Year 1 Journal Entry:**

```
Finance income:
Dr  Lease Receivable                              50,522
    Cr  Finance Income (P/L)                                  50,522

Receipt of payment:
Dr  Bank                                         130,000
    Cr  Lease Receivable                                     130,000
```

---

## Manufacturer or Dealer Lessors

### Special Treatment

When a **manufacturer or dealer** uses leasing to sell its products, the economics are different. The lessor is effectively:
1. Making a SALE (earning gross profit)
2. Providing FINANCING (earning finance income)

### Initial Recognition - Manufacturer/Dealer

At commencement, recognize:

| Component | Measurement |
|-----------|-------------|
| **Revenue** | Lower of: Fair value of asset OR PV of lease payments at market rate |
| **Cost of sales** | Cost of asset (or carrying amount) LESS PV of unguaranteed residual |
| **Lease receivable** | PV of (lease payments + unguaranteed residual) at implicit rate |

> [!IMPORTANT]
> Initial direct costs of manufacturer/dealer lessors are **EXPENSED** immediately. They cannot be included in the net investment because they relate to earning the selling profit.

### Working Example: Manufacturer/Dealer Lessor

**Facts:**
- Manufacturer leases equipment it produces
- Cost of equipment: R300,000
- Fair value: R500,000
- Lease term: 5 years
- Annual payment: R120,000
- Unguaranteed residual: R30,000
- Implicit rate: 12%
- Market rate for similar transactions: 12%

**Calculations:**

**Revenue:**
Lower of fair value (R500,000) or PV of lease payments at market rate

PV of lease payments = R120,000 × 3.6048 = R432,576

Revenue = **R432,576** (lower than FV of R500,000)

**Cost of Sales:**
Cost less PV of unguaranteed residual
= R300,000 - (R30,000 × 0.5674)
= R300,000 - R17,022
= **R282,978**

**Gross Profit:**
R432,576 - R282,978 = **R149,598**

**Lease Receivable (Net Investment):**
PV of lease payments + PV of unguaranteed residual
= R432,576 + R17,022
= **R449,598**

**Journal Entry:**

```
Dr  Lease Receivable                             449,598
    Cr  Revenue                                              432,576
    Cr  Deferred Residual Value*                              17,022

Dr  Cost of Sales                                282,978
Dr  Deferred Residual Value*                      17,022
    Cr  Inventory                                            300,000
```

*Or net presentation - the key is that the unguaranteed residual stays on the balance sheet, not in P/L*

---

## Operating Lease - Lessor Accounting

### The Principle

In an operating lease, the lessor retains the asset on its balance sheet and recognizes lease income over the lease term.

### Recognition

**Lease Income:**
- Recognize on a **straight-line basis** over the lease term
- OR another systematic basis if that better represents the pattern of benefits

**Underlying Asset:**
- Continue to recognize on balance sheet
- Continue to depreciate in accordance with IAS 16 or IAS 38
- Apply IAS 36 impairment requirements

### Initial Direct Costs

- Add to carrying amount of the underlying asset
- Recognize as expense over lease term on same basis as lease income

### Working Example: Operating Lease

**Facts:**
- Lessor leases office space for 3 years
- Annual rent: R240,000
- Lease incentive (rent-free first 3 months): Foregone rent of R60,000
- Initial direct costs (legal fees): R15,000
- Building carrying amount: R2,000,000, remaining useful life: 20 years

**Annual Accounting:**

**Lease Income (straight-line):**
Total payments = R240,000 + R240,000 + R180,000 (9 months Year 1) = R660,000

Wait, let me recalculate:
- Year 1: 9 months at R20,000/month = R180,000
- Year 2: 12 months at R20,000/month = R240,000
- Year 3: 12 months at R20,000/month = R240,000
- Total: R660,000 over 3 years

Straight-line income = R660,000 / 3 = **R220,000 per year**

**Initial Direct Costs:**
R15,000 / 3 years = **R5,000 expense per year**
(Added to building, but amortized separately for illustration)

**Depreciation:**
R2,000,000 / 20 years = **R100,000 per year**

**Year 1 Journal Entries:**

```
Cash received:
Dr  Bank                                         180,000
Dr  Lease Receivable (accrued)                    40,000
    Cr  Lease Income                                         220,000

Depreciation:
Dr  Depreciation Expense                         100,000
    Cr  Accumulated Depreciation - Building                  100,000

Initial direct cost amortization:
Dr  Lease Expense                                  5,000
    Cr  Building (or separate IDC asset)                       5,000
```

---

## Sub-Leases

### Classification of Sub-Leases

A sub-lease is a transaction where:
- The **intermediate lessor** leases an asset from a **head lessor**
- The **intermediate lessor** then leases the same asset to a **sub-lessee**

> [!IMPORTANT]
> **Key rule**: The intermediate lessor classifies the sub-lease with reference to the **right-of-use asset** arising from the head lease, NOT the underlying asset.

This means:
- Head lease of 20 years on building → ROU asset with 20-year useful life
- Sub-lease of 18 years → Likely a FINANCE lease (major part of ROU asset's life)

### Accounting by Intermediate Lessor

| If Sub-Lease is... | Treatment |
|--------------------|-----------|
| **Finance Lease** | Derecognize ROU asset, recognize sub-lease receivable, recognize gain/loss |
| **Operating Lease** | Keep ROU asset, continue recognizing lease liability from head lease, recognize sub-lease income |

### Working Example: Sub-Lease

**Facts:**
- ABC Ltd leases a building for 10 years (head lease) at R100,000 p.a.
- After 2 years, ABC sub-leases to XYZ Ltd for remaining 8 years at R120,000 p.a.
- ROU asset carrying amount at sub-lease commencement: R640,000
- Lease liability at sub-lease commencement: R576,000 (8 years remaining)
- Discount rate for sub-lease: 6%

**Classification:**
Sub-lease is for 8 years (100% of remaining ROU asset life) = **Finance Lease**

**Sub-lease Receivable:**
R120,000 × PV annuity factor (6%, 8 years)
= R120,000 × 6.2098
= **R745,176**

**Journal Entry at Sub-Lease Commencement:**

```
Dr  Sub-Lease Receivable                         745,176
    Cr  Right-of-Use Asset                                   640,000
    Cr  Gain on sub-lease (P/L)                              105,176
```

ABC continues to account for the head lease liability:
- Remains on balance sheet at R576,000
- Continue to apply effective interest method and make payments

---

## Lease Modifications - Lessor

### Finance Lease Modifications

| Type of Modification | Treatment |
|----------------------|-----------|
| Increase scope as separate lease | Account as new lease |
| Decrease scope or change consideration | If would have been operating lease originally → Account as new lease from modification date; derecognize existing receivable and recognize gain/loss |
| Other modifications | Recalculate lease payments, adjust receivable using original implicit rate |

### Operating Lease Modifications

Account for the modification as a **new lease** from the effective date:
- Consider any prepaid or accrued lease payments as part of new lease consideration
- Continue depreciation and lease income recognition under new terms

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Confusing lessor and lessee accounting | Lessors classify (finance vs operating); lessees generally don't |
| Forgetting unguaranteed residual in net investment | Include it in gross investment and discount it |
| Including initial direct costs in manufacturer/dealer net investment | Manufacturer/dealer lessors EXPENSE initial direct costs |
| Classifying sub-lease against underlying asset | Use the ROU asset from head lease as reference |
| Recognizing operating lease income based on cash received | Use straight-line over lease term (or other systematic basis) |
| Forgetting to continue depreciating operating lease assets | The lessor still owns the asset; depreciate per IAS 16 |

---

## Exam Technique

### Classification Questions

**Step 1**: State the classification principle (1 mark)
- "A lease is a finance lease if it transfers substantially all the risks and rewards incidental to ownership"

**Step 2**: Apply relevant indicators (2-4 marks)
- Discuss each indicator that applies
- Conclude on each

**Step 3**: Overall conclusion (1 mark)
- "Based on the above, the lease is classified as a [finance/operating] lease"

### Calculation Questions

**Finance Lease:**
1. Calculate gross investment
2. Calculate net investment (show individual PV calculations)
3. Prepare amortization schedule if required
4. Show journal entries

**Operating Lease:**
1. Calculate total lease payments including incentive effects
2. Calculate straight-line income per period
3. Show depreciation calculations
4. Show journal entries

---

## Summary Comparison

| Aspect | Finance Lease | Operating Lease |
|--------|---------------|-----------------|
| **Asset** | Derecognized | Remains on lessor's books |
| **Receivable** | Net investment in lease | None (only accrued/prepaid) |
| **Income** | Finance income (effective interest) | Lease income (straight-line) |
| **Depreciation** | N/A (no asset) | Continues on underlying asset |
| **Initial direct costs** | Add to net investment* | Add to asset, amortize over term |

*Except manufacturer/dealer lessors who expense immediately

---

**← Previous: Part 3 - Lease Modifications**

**Next: Part 5 - Sale-and-Leaseback Transactions →**
