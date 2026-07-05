# IFRS 16 Leases - Part 5: Sale-and-Leaseback Transactions

## What is a Sale-and-Leaseback?

A **sale-and-leaseback** transaction occurs when an entity (the seller-lessee):
1. **Sells** an asset to another entity (the buyer-lessor), AND
2. **Leases** that same asset back from the buyer-lessor

These transactions are common in practice for:
- Releasing capital tied up in property/equipment
- Off-balance sheet financing (historically)
- Tax planning purposes

> [!IMPORTANT]
> The key accounting question is: **Did a "sale" actually occur?** This question is answered by applying IFRS 15 Revenue from Contracts with Customers.

---

## The First Question: Is There a Sale?

### Applying IFRS 15 Principles

Before accounting for the leaseback, we must determine whether the transfer of the asset satisfies the requirements to be accounted for as a **sale** under IFRS 15.

The key question: **Does the transfer constitute a performance obligation satisfied?**

In substance, we ask: Has **control** of the asset transferred from the seller-lessee to the buyer-lessor?

### Common Indicators That a Sale Has NOT Occurred

| Scenario | Why No Sale? |
|----------|--------------|
| **Repurchase option at fixed price** | Seller-lessee retains significant risks and rewards |
| **Repurchase at above market price making exercise certain** | Economic compulsion to repurchase means no real transfer |
| **Leaseback is a finance lease** | If the leaseback transfers substantially all risks and rewards BACK, control hasn't really transferred |
| **Variable payments tied to asset performance** | Seller-lessee retains exposure to asset-specific risks |

> [!TIP]
> If the seller-lessee has a **put option** (right to require buyer-lessor to repurchase) or the buyer-lessor has a **call option** (right to require seller-lessee to repurchase) at a price that makes exercise virtually certain, there is NO sale.

---

## Scenario A: Transfer IS a Sale

### When Control Transfers

If the transfer satisfies IFRS 15 requirements for a sale, both parties account as follows:

**Seller-Lessee:**
1. Measure the ROU asset arising from the leaseback as a **proportion** of the previous carrying amount
2. Recognize only the gain/loss that relates to the **rights transferred** to the buyer-lessor

**Buyer-Lessor:**
1. Account for the purchase using applicable standards (IAS 16, IAS 40, etc.)
2. Account for the lease using normal lessor accounting (IFRS 16)

### The Proportional Approach (Seller-Lessee)

The seller-lessee does NOT recognize the full gain on sale because it retains rights through the leaseback. The accounting is:

```
ROU Asset = Previous Carrying Amount × (PV of Lease Payments / Fair Value of Asset)

Gain/Loss = Proportion of gain that relates to rights TRANSFERRED
          = Full Gain × (Fair Value - PV of Lease Payments) / Fair Value
```

### Working Example: Sale at Fair Value

**Facts:**
- Carrying amount of building: R1,000,000
- Fair value of building (sale price): R1,500,000
- Leaseback term: 10 years
- Annual lease payment: R80,000
- Interest rate implicit in lease: 6%
- PV of lease payments: R80,000 × 7.3601 = R588,808

**Step 1: Calculate Full Gain**

| | R |
|---|---|
| Sale proceeds (fair value) | 1,500,000 |
| Carrying amount | (1,000,000) |
| **Full gain** | **500,000** |

**Step 2: Calculate Proportions**

| | R | Proportion |
|---|---|---|
| Rights retained (leaseback) | 588,808 | 39.25% |
| Rights transferred | 911,192 | 60.75% |
| **Fair value** | **1,500,000** | **100%** |

**Step 3: Calculate ROU Asset**

ROU Asset = R1,000,000 × (588,808 / 1,500,000)
= R1,000,000 × 39.25%
= **R392,539**

**Step 4: Calculate Gain to Recognize**

Gain recognized = R500,000 × (911,192 / 1,500,000)
= R500,000 × 60.75%
= **R303,750**

**Step 5: Calculate Lease Liability**

Lease liability = PV of lease payments = **R588,808**

**Journal Entry (Seller-Lessee):**

```
Dr  Cash                                       1,500,000
Dr  Right-of-Use Asset                           392,539
    Cr  Building (carrying amount)                         1,000,000
    Cr  Lease Liability                                      588,808
    Cr  Gain on sale (P/L)                                   303,731*
```
*Rounding difference

### Alternative Presentation of the Calculation

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Cash received | | 1,500,000 |
| Less: Lease liability | PV of payments | (588,808) |
| Net cash inflow | | 911,192 |
| Carrying amount derecognized | | (1,000,000) |
| Add: ROU asset recognized | 1,000,000 × 39.25% | 392,539 |
| Net asset change | | (607,461) |
| **Gain recognized** | 911,192 - 607,461 | **303,731** |

---

## Off-Market Terms

### What if Sale Price ≠ Fair Value?

In practice, the sale price and lease payments may be set **off-market** (not at fair value). This could be:
- **Above-market sale price** with above-market lease payments (financing arrangement)
- **Below-market sale price** with below-market lease payments

### Adjustment Required

IFRS 16 requires adjustments to reflect substance:

| Scenario | Treatment |
|----------|-----------|
| **Sale price > Fair value** | The excess is a financing from buyer-lessor to seller-lessee (additional liability) |
| **Sale price < Fair value** | The shortfall is an advance lease payment (adjust lease liability) |
| **Lease payments > Market** | Represents additional payment for purchase (adjust lease liability down) |
| **Lease payments < Market** | Represents discount granted by buyer-lessor (adjust lease liability up) |

### Working Example: Above-Market Sale Price

**Facts:**
- Fair value of asset: R1,000,000
- Sale price: R1,200,000 (above market by R200,000)
- Carrying amount: R800,000
- PV of lease payments at market rate: R350,000
- Leaseback term: 5 years

**Analysis:**
The excess sale price of R200,000 is effectively a **financing received** from the buyer-lessor.

**Calculations:**

For gain calculation purposes, use FAIR VALUE, not sale price:

| | R |
|---|---|
| Fair value | 1,000,000 |
| Carrying amount | (800,000) |
| Full gain | 200,000 |

Rights transferred proportion = (FV - PV of payments) / FV
= (1,000,000 - 350,000) / 1,000,000 = 65%

Gain recognized = R200,000 × 65% = **R130,000**

ROU asset = R800,000 × 35% = **R280,000**

**Journal Entry:**

```
Dr  Cash                                       1,200,000
Dr  Right-of-Use Asset                           280,000
    Cr  Asset (carrying amount)                              800,000
    Cr  Lease Liability                                      350,000
    Cr  Financial Liability (financing from lessor)          200,000
    Cr  Gain on sale                                         130,000
```

The R200,000 financial liability is repaid over the lease term (often through the above-market lease payments).

---

## Scenario B: Transfer is NOT a Sale

### When Control Does Not Transfer

If the transfer does NOT satisfy IFRS 15:
- The seller-lessee has NOT sold the asset
- The arrangement is accounted for as a **financing transaction**

**Seller-Lessee Accounting:**
- Continue to recognize the asset
- Recognize a **financial liability** equal to the transfer proceeds
- Apply IFRS 9 (financial instruments) to the liability

**Buyer-Lessor Accounting:**
- Do NOT recognize the asset
- Recognize a **financial asset** equal to the transfer proceeds
- Apply IFRS 9 to the asset

### Working Example: No Sale

**Facts:**
- Entity sells equipment for R500,000
- Simultaneously enters into a leaseback with option to repurchase for R550,000
- The exercise of the repurchase option is virtually certain
- Equipment carrying amount: R400,000
- Interest rate implicit: 8%

**Analysis:**
The repurchase option (at price making exercise virtually certain) means control has NOT transferred. No sale occurs.

**Seller-Lessee Journal Entry:**

```
Dr  Cash                                         500,000
    Cr  Financial Liability                                  500,000
```

The asset remains on the seller-lessee's books at R400,000 and continues to be depreciated.

Over the financing period:
```
Dr  Finance Cost                                  XX,XXX
    Cr  Financial Liability                                   XX,XXX
```

Repurchase payments reduce the liability.

---

## Buyer-Lessor Perspective

### When There IS a Sale

If the transfer is a sale:

1. **Recognize the purchased asset** at cost (purchase consideration)
2. **Account for the lease** using normal lessor accounting:
   - Classify as finance or operating lease
   - Apply appropriate recognition model

### When There is NO Sale

If the transfer is not a sale:

1. **Do NOT recognize the asset**
2. **Recognize a financial receivable** at the amount of cash paid
3. **Apply IFRS 9** to the receivable

---

## Complex Scenario: Finance Leaseback

### Special Consideration

What if the leaseback would be classified as a **finance lease** for the lessor?

A finance lease means the lessor is transferring substantially all risks and rewards BACK to the lessee. This could indicate that control hasn't truly transferred in the first place.

**IFRS 16 Guidance:**
- If the leaseback is a finance lease, the seller-lessee cannot recognize any gain/loss
- The transaction is effectively a financing arrangement
- Account similar to "no sale" scenario

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Recognizing full gain on sale | Only recognize proportion relating to rights TRANSFERRED |
| Using sale price instead of fair value for off-market transactions | Always use fair value; adjust for any above/below-market elements |
| Forgetting to assess whether a sale occurred | First step is ALWAYS: Apply IFRS 15 to assess if control transferred |
| Confusing financing liability with lease liability | Financing liability = excess sale price; Lease liability = PV of lease payments |
| Measuring ROU asset at proportion of fair value | Use proportion of CARRYING AMOUNT, not fair value |

---

## Exam Technique

### Structured Approach

**Step 1**: Is there a sale? (IFRS 15 assessment)
- Identify repurchase options, terms, etc.
- Conclude on whether control transfers

**Step 2**: If sale - Calculate at fair value
- Determine fair value (adjust if terms are off-market)
- Calculate full theoretical gain/loss

**Step 3**: Calculate proportions
- PV of lease payments / Fair value = Rights retained
- Remainder = Rights transferred

**Step 4**: Apply proportions
- ROU asset = Carrying amount × Rights retained %
- Gain recognized = Full gain × Rights transferred %

**Step 5**: Prepare journal entries
- Show clearly: Cash, ROU Asset, Asset derecognized, Lease liability, Gain

### Mark Allocation Tips

| Requirement | Typical Marks |
|-------------|---------------|
| IFRS 15 sale assessment | 2-3 marks |
| Proportion calculations | 3-4 marks |
| ROU asset calculation | 2 marks |
| Gain calculation | 2 marks |
| Journal entries | 2-3 marks |
| Off-market adjustments | 2-3 marks |

---

## Comprehensive Example

**Question:**

On 1 January 20X1, Seller Ltd sells its headquarters building to Buyer Ltd and simultaneously leases it back. Details:

| | Amount |
|---|---|
| Carrying amount of building | R4,000,000 |
| Fair value of building | R6,000,000 |
| Sale price | R7,000,000 |
| Leaseback term | 8 years |
| Annual lease payment | R600,000 |
| Market rent for similar property | R500,000 |
| Discount rate | 7% |

The transaction qualifies as a sale under IFRS 15.

**Required:**
1. Calculate the gain to be recognized by Seller Ltd
2. Calculate the initial ROU asset
3. Prepare the journal entry at transaction date

---

<details>
<summary>Model Answer</summary>

**Adjustment for Off-Market Terms**

The sale price exceeds fair value by R1,000,000 (R7m - R6m). This represents financing from Buyer Ltd.

The above-market rent (R600,000 vs R500,000 = R100,000 p.a.) will be used to repay this financing over the lease term.

**Step 1: Calculate Lease Liability (using market rent)**

PV of market-equivalent lease payments:
= R500,000 × PV annuity factor (7%, 8 years)
= R500,000 × 5.9713
= **R2,985,650**

**Step 2: Calculate Proportions (using fair value)**

| | R | % |
|---|---|---|
| Rights retained | 2,985,650 | 49.76% |
| Rights transferred | 3,014,350 | 50.24% |
| Fair value | 6,000,000 | 100% |

**Step 3: Calculate ROU Asset**

ROU Asset = Carrying amount × Rights retained %
= R4,000,000 × 49.76%
= **R1,990,400**

**Step 4: Calculate Gain**

Full gain (using fair value):
= Fair value - Carrying amount
= R6,000,000 - R4,000,000
= R2,000,000

Gain recognized = R2,000,000 × 50.24%
= **R1,004,800**

**Step 5: Journal Entry**

```
Dr  Cash                                       7,000,000
Dr  Right-of-Use Asset                         1,990,400
    Cr  Building (carrying amount)                         4,000,000
    Cr  Lease Liability                                    2,985,650
    Cr  Financial Liability (above-market price)           1,000,000
    Cr  Gain on disposal (P/L)                             1,004,750*
```
*Rounding

The R1,000,000 financial liability will be reduced over 8 years by the above-market portion of each lease payment (R100,000 p.a.).

</details>

---

**← Previous: Part 4 - Lessor Accounting**

**Next: Part 6 - Disclosure Requirements & Exam Strategy →**
