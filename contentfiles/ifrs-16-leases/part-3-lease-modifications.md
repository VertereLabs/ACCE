# IFRS 16 Leases - Part 3: Lease Modifications

## What is a Lease Modification?

A **lease modification** is a change in the scope of a lease, or the consideration for a lease, that was NOT part of the original terms and conditions.

### Examples of Lease Modifications

| Modification Type | Example |
|-------------------|---------|
| **Change in scope** | Adding or terminating the right to use one or more underlying assets |
| **Change in lease term** | Extending or shortening the contractual lease term |
| **Change in consideration** | Changing the amount of lease payments |
| **Change in nature of lease** | Adding or removing a purchase option |

> [!NOTE]
> A modification requires an agreement between the lessor and lessee. Unilateral changes by one party or changes contemplated in the original contract are NOT modifications.

---

## The Key Question: Is the Modification a Separate Lease?

When a lease is modified, the first question is:

**Does this modification result in a SEPARATE lease?**

### Conditions for a Separate Lease

A modification is accounted for as a **separate lease** if **BOTH** conditions are met:

| Condition | Test |
|-----------|------|
| **1. Increases scope** | The modification increases the scope of the lease by adding the right to use one or more underlying assets |
| **2. Standalone price** | The consideration for the increase is commensurate with the stand-alone price for that increase (adjusted for the circumstances) |

If BOTH conditions are met → **Separate lease** (account for it as a new lease)

If EITHER condition is not met → **NOT a separate lease** (remeasure the existing lease)

---

## Accounting for Modifications as a Separate Lease

### Treatment

If the modification creates a separate lease:
- Account for the NEW lease independently
- Continue accounting for the ORIGINAL lease unchanged
- It's as if the lessee entered into TWO leases from the start

### Example: Separate Lease

**Scenario:**
- Original lease: 1,000 m² of office space for R150,000 p.a. for 5 years
- After Year 2: Lessee agrees to also lease adjacent 500 m² for R80,000 p.a. for remaining 3 years
- Stand-alone price for 500 m² similar space: R75,000 - R85,000 p.a.

**Analysis:**

| Condition | Assessment |
|-----------|------------|
| Increases scope? | ✓ Yes - additional 500 m² added |
| Commensurate price? | ✓ Yes - R80,000 is within the range of stand-alone price |

**Result**: The modification is a **separate lease**.

**Accounting:**
- Original lease for 1,000 m²: Continues as before
- New lease for 500 m²: Recognize new ROU asset and lease liability for 3 years at R80,000 p.a.

---

## Modifications NOT a Separate Lease - Lessee Accounting

When the modification does NOT qualify as a separate lease, the lessee must:

1. **Remeasure the lease liability** using:
   - **Revised lease payments**
   - **Revised discount rate** (current rate at modification date)

2. **Adjust the ROU asset** (see detailed treatment below)

### Step-by-Step Process

**Step 1: Determine the revised lease term**
- Consider all relevant facts and circumstances
- Reassess reasonably certain exercise of options

**Step 2: Determine the revised discount rate**
- Use the interest rate implicit in the lease for the remainder (if determinable)
- Otherwise, use the lessee's incremental borrowing rate at the modification date

**Step 3: Remeasure the lease liability**
- Present value of revised remaining payments using revised rate

**Step 4: Adjust the ROU asset**

The adjustment to the ROU asset depends on the TYPE of modification:

| Modification Type | ROU Asset Treatment |
|-------------------|---------------------|
| **Decrease in scope** (partial termination) | Decrease ROU asset proportionately. Recognize gain/loss in P/L |
| **Other modifications** (increase, extension, change in payments) | Adjust ROU asset by the same amount as liability change. No gain/loss |

---

## Modification Type 1: Decrease in Scope (Partial Termination)

### The Principle

When the lease scope is reduced (e.g., returning part of leased space), it's treated as a **partial termination**. The lessee derecognizes part of its position.

### Calculation Steps

1. **Remeasure the lease liability** (revised payments, revised rate)
2. **Calculate the PARTIAL derecognition** of ROU asset proportionately
3. **Recognize the difference as a gain or loss** in profit or loss

### Working Example: Partial Termination

**Facts:**
- Original lease: 2,000 m² office for 10 years
- After 6 years: Lessee returns 500 m² (25% of space), reducing rent from R200,000 to R160,000 p.a.
- Carrying amounts at modification date:
  - ROU Asset: R480,000
  - Lease Liability: R520,000
- Revised discount rate: 9%
- Remaining term: 4 years

**Step 1: Remeasure the Lease Liability**

New lease liability = PV of R160,000 p.a. for 4 years @ 9%
= R160,000 × 3.2397
= **R518,352**

**Step 2: Calculate Proportionate Decrease in ROU Asset**

Proportion terminated = 500 m² / 2,000 m² = 25%

Decrease in ROU asset = R480,000 × 25% = **R120,000**

New ROU asset = R480,000 - R120,000 = **R360,000**

**Step 3: Proportionate Decrease in Lease Liability**

The liability "allocated" to the terminated portion = R520,000 × 25% = **R130,000**

**Step 4: Calculate Gain or Loss**

| Component | Amount (R) |
|-----------|-----------|
| Liability derecognized (for terminated portion) | 130,000 |
| Less: ROU asset derecognized | (120,000) |
| **Gain on partial termination** | **10,000** |

**Step 5: Account for Remaining Liability Change**

| | R |
|---|---|
| Old liability (remaining 75%) | 390,000 |
| New remeasured liability | 518,352 |
| Increase due to remeasurement | 128,352 |

This increase adjusts the ROU asset:
New ROU asset = R360,000 + R128,352 = **R488,352**

Wait - let me recalculate this more carefully.

**Corrected Approach:**

| Step | Calculation | Amount |
|------|-------------|--------|
| Original lease liability | | 520,000 |
| Proportionate derecognition (25%) | 520,000 × 25% | (130,000) |
| Remaining liability (pre-adjustment) | | 390,000 |
| Remeasured liability (revised payments @ 9%) | 160,000 × 3.2397 | 518,352 |
| Adjustment to ROU asset | 518,352 - 390,000 | 128,352 |

| | R |
|---|---|
| Original ROU asset | 480,000 |
| Proportionate derecognition (25%) | (120,000) |
| Adjustment for liability remeasurement | 128,352 |
| **Revised ROU asset** | **488,352** |

**Journal Entry:**

```
Dr  Lease Liability (derecognized portion)           130,000
    Cr  Right-of-Use Asset (proportionate)                   120,000
    Cr  Gain on lease modification (P/L)                      10,000

Dr  Right-of-Use Asset (remeasurement)               128,352
    Cr  Lease Liability (remeasurement)                      128,352
```

OR combined:
```
Dr  Lease Liability                                    1,648
Dr  Right-of-Use Asset                                 8,352
    Cr  Gain on lease modification                            10,000
```

*(520,000 - 518,352 = 1,648 net decrease in liability)*
*(488,352 - 480,000 = 8,352 net increase in ROU asset)*

---

## Modification Type 2: Increase in Scope or Extension (NOT at Stand-alone Price)

### The Principle

When scope increases or lease term extends, but the consideration is NOT commensurate with stand-alone prices, it cannot be a separate lease. Instead, remeasure the existing lease.

### Working Example: Lease Extension

**Facts:**
- Original lease: Equipment for 5 years, R50,000 p.a.
- After 3 years: Lessee extends for additional 3 years at R45,000 p.a.
- Original discount rate: 8%
- Discount rate at modification: 7%
- Carrying amounts at modification:
  - ROU asset: R92,000
  - Lease liability: R89,286 (PV of 2 remaining payments @ 8%)

**Analysis:**

The extension adds scope (more time), but R45,000 is below stand-alone price (which is R50,000 based on original contract). Therefore, NOT a separate lease.

**Step 1: Remeasure Lease Liability**

Revised payments: 2 years at R50,000 + 3 years at R45,000

| Year | Payment | PV Factor @ 7% | Present Value |
|------|---------|----------------|---------------|
| 1 | 50,000 | 0.9346 | 46,729 |
| 2 | 50,000 | 0.8734 | 43,672 |
| 3 | 45,000 | 0.8163 | 36,734 |
| 4 | 45,000 | 0.7629 | 34,331 |
| 5 | 45,000 | 0.7130 | 32,085 |
| **Total** | | | **R193,551** |

**Step 2: Calculate Adjustment**

| | R |
|---|---|
| New lease liability | 193,551 |
| Old lease liability | (89,286) |
| **Increase in liability** | **104,265** |

**Step 3: Adjust ROU Asset**

This is NOT a scope decrease, so the ROU asset is adjusted by the same amount:

New ROU asset = R92,000 + R104,265 = **R196,265**

**Journal Entry:**

```
Dr  Right-of-Use Asset                               104,265
    Cr  Lease Liability                                      104,265
```

---

## Modification Type 3: Change in Consideration Only (No Scope Change)

### Example: Rent Review

**Facts:**
- 10-year lease, currently in Year 4
- Payments were R100,000 p.a., now increased to R110,000 p.a. following rent review
- Revised discount rate: 6%
- Carrying amounts before modification:
  - ROU asset: R420,000
  - Lease liability: R405,000

**Treatment:**

Remeasure the lease liability using revised payments and revised rate:

Remaining term: 7 years
New lease liability = R110,000 × PV factor (6%, 7 years)
= R110,000 × 5.5824
= **R614,064**

Adjustment = R614,064 - R405,000 = R209,064

Since this is not a scope decrease:
```
Dr  Right-of-Use Asset                               209,064
    Cr  Lease Liability                                      209,064
```

New ROU asset = R420,000 + R209,064 = **R629,064**

---

## Summary: Modification Decision Tree

```
                    LEASE MODIFICATION
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Does it INCREASE scope?      │
            └──────────────────────────────┘
                    │           │
                   YES         NO
                    │           │
                    ▼           │
    ┌───────────────────────┐   │
    │ Is price commensurate │   │
    │ with stand-alone?     │   │
    └───────────────────────┘   │
         │           │          │
        YES         NO          │
         │           │          │
         ▼           ▼          ▼
    ┌─────────┐  ┌─────────────────────────┐
    │SEPARATE │  │ NOT SEPARATE LEASE      │
    │  LEASE  │  │ Remeasure liability     │
    │         │  │ & adjust ROU asset      │
    │ Account │  │                         │
    │ as new  │  │ If scope DECREASED:     │
    │ lease   │  │  ► Proportionate gain/  │
    │         │  │    loss recognized      │
    │         │  │ Otherwise:              │
    │         │  │  ► No gain/loss         │
    └─────────┘  └─────────────────────────┘
```

---

## COVID-19-Related Rent Concessions

### Practical Expedient

In response to COVID-19, the IASB issued an amendment providing a practical expedient for rent concessions that meet certain conditions.

**Conditions for Using the Expedient:**
1. Change in lease payments results in revised consideration that is substantially the same or less than pre-change consideration
2. Reduction in payments affects only payments due on or before 30 June 2022 (extended)
3. No substantive change to other terms and conditions

**If Expedient Applied:**
- No reassessment of whether the contract contains a lease
- Account for the concession as if it were not a lease modification
- Typically: Credit P/L (other income), not as reduction to ROU asset

> [!TIP]
> The COVID-19 expedient is election-based and applies consistently to similar contracts. Watch for exam questions specifically stating whether the expedient is being applied.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Forgetting to use a REVISED discount rate | The modification date rate is used for all non-separate lease modifications |
| Not separating the gain/loss on partial termination | Decrease in scope requires proportionate derecognition and gain/loss recognition |
| Adjusting ROU asset through P/L for non-scope decreases | Only scope decreases create a gain/loss; other remeasurements go to ROU asset |
| Treating all extensions as separate leases | Must be at stand-alone price AND increase scope to be separate |
| Confusing lease modifications with remeasurements under existing terms | Modifications require agreement; remeasurements happen when existing terms trigger changes (e.g., index adjustments) |

---

## Exam Technique

### Modification Questions Typically Test

1. **Classification**: Is it a separate lease or not?
2. **Calculation**: Remeasure the lease liability using revised payments and rate
3. **Journal entries**: Particularly for partial terminations with gain/loss

### Mark Allocation Guide

| Requirement | Typical Marks |
|-------------|---------------|
| Identifying whether separate lease | 2-3 marks |
| Calculating new lease liability | 3-4 marks |
| Calculating ROU adjustment | 2-3 marks |
| Proportionate gain/loss on termination | 3-4 marks |
| Journal entries | 2-3 marks |

### Key Phrases for Discussion Marks

- "The modification [does/does not] qualify as a separate lease because..."
- "The lease liability is remeasured using the revised discount rate at the modification date of X%..."
- "As this is a decrease in scope, the ROU asset is reduced proportionately and a gain/loss is recognized..."

---

## Comprehensive Example

**Question:**

XYZ Ltd leases a building from 1 January 20X1 for 10 years at R500,000 per annum payable in arrears. The incremental borrowing rate at inception was 10%.

On 1 January 20X5, the following occurs:
- XYZ returns the ground floor (40% of the building)
- Annual payments are reduced to R380,000 for the remaining 6 years
- The incremental borrowing rate is now 8%

At 31 December 20X4:
- Lease liability: R1,895,394
- Right-of-use asset (net of depreciation): R1,705,855

**Required:**
1. Determine if this is a separate lease
2. Calculate the revised lease liability
3. Calculate the gain or loss on partial termination
4. Prepare the journal entry at 1 January 20X5

---

<details>
<summary>Model Answer</summary>

**1. Separate Lease Assessment**

This modification DECREASES the scope of the lease (returning 40% of space). Since there is no increase in scope, it cannot be a separate lease regardless of price.

The modification is **NOT a separate lease**. (2 marks)

**2. Revised Lease Liability**

| | Amount |
|---|---|
| Revised payments | R380,000 p.a. |
| Remaining term | 6 years |
| Discount rate | 8% (at modification date) |

Lease liability = R380,000 × PV annuity factor (8%, 6 years)
= R380,000 × 4.6229
= **R1,756,702** (3 marks)

**3. Gain/Loss on Partial Termination**

**Step A: Proportionate derecognition of ROU Asset**

ROU asset derecognized = R1,705,855 × 40% = **R682,342**

**Step B: Proportionate derecognition of Lease Liability**

Liability derecognized = R1,895,394 × 40% = **R758,158**

**Step C: Gain on partial termination**

| | R |
|---|---|
| Liability derecognized | 758,158 |
| ROU asset derecognized | (682,342) |
| **Gain on modification** | **75,816** |

(3 marks)

**Step D: Adjustment for remaining lease**

| | R |
|---|---|
| Old liability (remaining 60%) | R1,895,394 × 60% = 1,137,236 |
| New lease liability | 1,756,702 |
| Increase in liability | 619,466 |

ROU asset adjustment = R619,466

New ROU asset = (R1,705,855 × 60%) + R619,466 = R1,023,513 + R619,466 = **R1,642,979**

(2 marks)

**4. Journal Entry**

```
Dr  Lease Liability (40% derecognized)                758,158
    Cr  Right-of-Use Asset (40% derecognized)                 682,342
    Cr  Gain on lease modification (P/L)                       75,816

Dr  Right-of-Use Asset (remeasurement)                619,466
    Cr  Lease Liability (remeasurement)                       619,466
```

**Proof:**
- New Lease Liability: R1,895,394 - R758,158 + R619,466 = R1,756,702 ✓
- New ROU Asset: R1,705,855 - R682,342 + R619,466 = R1,642,979 ✓

(2 marks)

</details>

---

**← Previous: Part 2 - Lessee Accounting Model**

**Next: Part 4 - Lessor Accounting →**
