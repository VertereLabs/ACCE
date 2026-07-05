# IFRS 16 Leases - Part 2: Lessee Accounting Model

## The Core Principle

Under IFRS 16, a lessee recognizes:
1. A **Right-of-Use (ROU) Asset** - representing the right to use the underlying asset
2. A **Lease Liability** - representing the obligation to make lease payments

This single accounting model applies to virtually ALL leases (subject to the short-term and low-value exemptions discussed in Part 1).

> [!IMPORTANT]
> The lessee accounting model treats all leases as if the lessee has acquired an asset and borrowed funds to pay for it. This is the economic substance that IFRS 16 seeks to reflect.

---

## Initial Recognition

### When to Recognize?

Recognition occurs at the **commencement date** - the date the lessor makes the underlying asset available for use by the lessee.

> [!NOTE]
> Don't confuse:
> - **Inception date**: When the lease is agreed/signed
> - **Commencement date**: When the asset is made available for use
> 
> Initial recognition happens at commencement, not inception.

---

## Initial Measurement of the Lease Liability

### Formula

```
Lease Liability = Present Value of Lease Payments Not Yet Paid at Commencement
```

### What Lease Payments Are Included?

| Payment Type | Include? | Notes |
|--------------|----------|-------|
| Fixed payments | ✓ Yes | Less any lease incentives receivable |
| Variable payments based on index/rate | ✓ Yes | Using index/rate at commencement |
| Amounts expected under residual value guarantees | ✓ Yes | Lessee's expected payment |
| Purchase option price | ✓ Yes | Only if reasonably certain to exercise |
| Termination penalties | ✓ Yes | If lease term reflects exercising termination option |
| Variable payments based on usage/performance | ✗ No | Expensed as incurred |

### The Discount Rate

The lease liability is measured at **present value** using:

| Option | When to Use |
|--------|------------|
| **Interest rate implicit in the lease** | If readily determinable (often available for lessors, rarely for lessees) |
| **Lessee's incremental borrowing rate** | If implicit rate not readily determinable |

**Incremental Borrowing Rate (IBR)** is the rate the lessee would have to pay to borrow funds:
- Over a similar term
- With similar security
- To obtain an asset of similar value
- In a similar economic environment

> [!TIP]
> **Exam technique**: When a question gives you both rates, state which rate you're using and briefly justify why the implicit rate is or isn't readily determinable.

### Working Example: Initial Measurement of Lease Liability

**Facts:**
- Lease commencement: 1 January 20X1
- Lease term: 5 years
- Annual payment: R100,000 paid at year-end
- Incremental borrowing rate: 10% (implicit rate not determinable)
- No purchase option, residual guarantees, or incentives

**Calculation:**

Present value of lease payments:

| Year | Payment | PV Factor @ 10% | Present Value |
|------|---------|-----------------|---------------|
| 1 | R100,000 | 0.9091 | R90,909 |
| 2 | R100,000 | 0.8264 | R82,645 |
| 3 | R100,000 | 0.7513 | R75,131 |
| 4 | R100,000 | 0.6830 | R68,301 |
| 5 | R100,000 | 0.6209 | R62,092 |
| **Total** | | | **R379,078** |

*Alternatively, using annuity factor:*
R100,000 × 3.7908 = **R379,078**

---

## Initial Measurement of the Right-of-Use Asset

### Formula

```
ROU Asset = Lease Liability
          + Lease payments made at or before commencement
          - Lease incentives received
          + Initial direct costs
          + Estimated dismantling/restoration costs (IAS 37)
```

### Component Breakdown

| Component | Description | Example |
|-----------|-------------|---------|
| Lease liability | As calculated above | R379,078 |
| Payments made at/before commencement | Upfront payments, first month's rent paid in advance | First month's rent of R8,000 |
| Lease incentives received | Cash received or payable from lessor | Moving cost contribution of R20,000 |
| Initial direct costs | Incremental costs to obtain lease (NOT pre-paid rent) | Legal fees R5,000, commission R10,000 |
| Restoration costs | Obligation to restore asset at lease end | Estimated cost R15,000 at NPV |

### Working Example: Initial Measurement of ROU Asset

**Continuing from above, with additional facts:**
- First month's rent of R8,333 paid on signing (1 month of R100,000/12)
- Lessor contributed R20,000 toward lessee's moving costs
- Legal fees to negotiate lease: R15,000
- Obligation to restore premises at end: Present value R25,000

**Calculation:**

| Component | Amount |
|-----------|--------|
| Lease liability | R379,078 |
| Add: Prepaid rent | R8,333 |
| Less: Lease incentive received | (R20,000) |
| Add: Initial direct costs | R15,000 |
| Add: Restoration provision | R25,000 |
| **ROU Asset** | **R407,411** |

### Journal Entry at Commencement

```
Dr  Right-of-Use Asset                           407,411
Dr  Cash (lease incentive received)               20,000
    Cr  Lease Liability                                      379,078
    Cr  Cash (prepaid rent)                                    8,333
    Cr  Cash (legal fees)                                     15,000
    Cr  Provision for Restoration                             25,000
```

---

## Subsequent Measurement of the Lease Liability

The lease liability is subsequently measured using the **effective interest method**.

### Effective Interest Method

Each period:
1. **Calculate interest expense**: Opening liability × Discount rate
2. **Process the payment**: Reduces the liability
3. **Closing liability**: Opening + Interest - Payment

### Amortization Table

**Continuing our example (R379,078 liability, 10% rate, R100,000 annual payments):**

| Year | Opening Balance | Interest (10%) | Payment | Closing Balance |
|------|-----------------|----------------|---------|-----------------|
| 1 | 379,078 | 37,908 | (100,000) | 316,986 |
| 2 | 316,986 | 31,699 | (100,000) | 248,685 |
| 3 | 248,685 | 24,868 | (100,000) | 173,553 |
| 4 | 173,553 | 17,355 | (100,000) | 90,908 |
| 5 | 90,908 | 9,092 | (100,000) | 0 |
| **Total** | | **120,922** | **(500,000)** | |

### Journal Entry - Year 1

```
Interest expense:
Dr  Finance Cost (P/L)                            37,908
    Cr  Lease Liability                                       37,908

Lease payment:
Dr  Lease Liability                              100,000
    Cr  Bank                                                 100,000
```

**Closing lease liability after Year 1 = R316,986**

---

## Subsequent Measurement of the ROU Asset

### Two Measurement Options

**Option 1: Cost Model (Default)**
- ROU asset measured at cost less accumulated depreciation and impairment losses
- This is the most common approach

**Option 2: Revaluation Model**
- If the underlying asset would qualify for revaluation under IAS 16
- Apply IAS 16 revaluation model requirements
- Rarely used in practice

**Option 3: Fair Value Model**
- If the underlying asset meets the definition of investment property
- Lessee applies fair value model under IAS 40

### Depreciation of ROU Asset

| Scenario | Depreciation Period |
|----------|---------------------|
| Ownership transfers to lessee at end of lease | Useful life of underlying asset |
| Purchase option reasonably certain to be exercised | Useful life of underlying asset |
| No transfer of ownership or purchase option | **Shorter of**: Lease term OR Useful life of asset |

### Working Example: Depreciation

**Continuing our example:**
- ROU Asset at commencement: R407,411
- Lease term: 5 years
- Useful life of building: 40 years
- No purchase option or transfer of ownership

**Depreciation period** = Shorter of 5 years or 40 years = **5 years**

**Annual depreciation** = R407,411 / 5 = **R81,482**

### Journal Entry - Year 1 Depreciation

```
Dr  Depreciation Expense (P/L)                    81,482
    Cr  Accumulated Depreciation - ROU Asset                  81,482
```

---

## Summary: Year 1 Impact on Financial Statements

### Statement of Financial Position (Extract)

**Assets:**
| | R |
|---|---|
| Right-of-Use Asset (407,411 - 81,482) | 325,929 |

**Liabilities:**
| | R |
|---|---|
| Lease Liability - Non-current (248,685) | 248,685 |
| Lease Liability - Current (316,986 - 248,685) | 68,301 |
| **Total Lease Liability** | **316,986** |

### Statement of Profit or Loss (Extract)

| | R |
|---|---|
| Depreciation expense | (81,482) |
| Finance cost | (37,908) |
| **Total expense** | **(119,390)** |

### Comparison with Operating Lease Under Old IAS 17

Under old IAS 17, if classified as an operating lease:
- **P/L expense**: R100,000 (straight-line rental)
- **Balance sheet**: Nothing!

Under IFRS 16:
- **P/L expense**: R119,390 (Year 1 - higher in early years, lower in later years)
- **Balance sheet**: ROU asset R325,929, Liability R316,986

> [!IMPORTANT]
> **Front-loading effect**: Total expense over the lease term is the same (R500,000 in payments + restoration). However, IFRS 16 **front-loads** expenses due to higher interest in early years when the liability is larger. This affects profit trends but NOT total profit.

---

## Payments Made at Different Times

### Payments in Advance vs Payments in Arrears

The timing of payments affects:
1. The present value calculation (annuity due vs ordinary annuity)
2. The first journal entry

**Payments in Advance (Beginning of Period)**

If R100,000 is paid at the START of each year:

| Year | Payment Date | PV Factor @ 10% | Present Value |
|------|--------------|-----------------|---------------|
| 1 | Start Year 1 | 1.0000 | R100,000 |
| 2 | Start Year 2 | 0.9091 | R90,909 |
| 3 | Start Year 3 | 0.8264 | R82,645 |
| 4 | Start Year 4 | 0.7513 | R75,131 |
| 5 | Start Year 5 | 0.6830 | R68,301 |
| **Total** | | | **R416,986** |

*First payment is NOT discounted - it's already "present"*

Initial recognition with first payment on commencement:
```
Dr  Right-of-Use Asset                           416,986
    Cr  Lease Liability                                      316,986
    Cr  Bank (first payment)                                 100,000
```

---

## Lease Incentives

### What Are Lease Incentives?

Payments made by the lessor to or on behalf of the lessee, such as:
- Cash payments to the lessee
- Reimbursement of lessee's costs (moving, fit-out)
- Lessor assuming lessee's obligations (e.g., paying off old lease)
- Rent-free periods

### Accounting Treatment

Lease incentives **reduce** the ROU asset at initial recognition (as shown in our earlier example).

If the incentive is for costs the lessee incurs (e.g., moving costs):
1. Lessee recognizes and expenses the cost when incurred
2. Simultaneously reduces ROU asset by incentive amount

---

## Practical Application: Payments Linked to an Index

### Variable Payments Based on Index/Rate

Variable payments that depend on an index (e.g., CPI) or a rate (e.g., LIBOR) are included in the lease liability using the **index or rate at commencement**.

**Example:**
- Annual payment: R100,000 adjusted annually for CPI changes
- Current CPI: 100
- Lease term: 3 years

**Initial measurement**: 
All three payments measured using current CPI = R100,000 each (then discounted)

**Subsequent measurement**:
If CPI increases to 105 in Year 2, the lease liability is **NOT automatically remeasured**. Remeasurement only occurs when cash flows actually change (i.e., at the payment adjustment date).

When CPI increases:
```
Year 2 payment = R100,000 × (105/100) = R105,000
```

Remeasure lease liability using **revised payments** and **original discount rate**.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Using the remaining lease term to depreciate ROU | Use lease term from commencement (or useful life if shorter and ownership transfers) |
| Including variable usage-based payments in liability | Only include if based on an index/rate; pure usage payments are expensed as incurred |
| Discounting at current market rates at reporting date | Keep using the original discount rate (unless remeasurement event occurs) |
| Confusing lease incentives with initial direct costs | Incentives REDUCE the ROU asset; initial direct costs INCREASE it |
| Forgetting to split current/non-current liability | Amount payable within 12 months is current |
| Not recognizing the front-loading effect on profits | Early years = higher total expense; later years = lower |

---

## Exam Technique

### Calculation Questions (High Mark Allocation)

**Step 1**: Calculate the lease liability (present value of payments)
- State the payments included
- State and justify the discount rate used
- Show the PV calculation clearly

**Step 2**: Calculate the ROU asset
- Start with lease liability
- Adjust for each component (± prepayments, incentives, direct costs, restoration)

**Step 3**: Prepare the amortization schedule (if required)
- Opening balance → Interest → Payment → Closing balance
- Show at least 2-3 years

**Step 4**: Calculate depreciation
- State depreciation period with reasoning
- Calculate annual charge

**Step 5**: Prepare journal entries or extracts (as required)

### Time-Saving Tips

1. **Use annuity factors** when payments are equal and timing is consistent
2. **Don't round intermediate calculations** - round only final answers
3. **Label everything** - examiners can't give marks for unexplained numbers
4. **Present amortization tables clearly** - easy marks if formatted properly

---

## Comprehensive Example

**Question:**

On 1 January 20X1, ABC Ltd enters into a lease for office space with the following terms:
- Lease term: 4 years
- Annual payment: R200,000 payable at year-end
- Lessee's incremental borrowing rate: 8%
- Legal fees to obtain lease: R30,000
- Rent-free period: First 3 months (not reflected in R200,000)
- Obligation to restore premises at end: Estimated cost R50,000 (present value at 8%: R36,751)

**Required**: 
1. Calculate the initial lease liability
2. Calculate the initial ROU asset
3. Prepare the lease amortization schedule
4. Calculate Year 1 depreciation
5. Calculate total expense in Year 1

---

<details>
<summary>Model Answer</summary>

**1. Initial Lease Liability**

Present value of lease payments @ 8%:
R200,000 × PV annuity factor (8%, 4 years)
= R200,000 × 3.3121
= **R662,420**

Note: The rent-free period is a lease incentive that affects the ROU asset, not the liability calculation (payments are still R200,000 p.a.)

**2. Initial ROU Asset**

| Component | Amount (R) |
|-----------|-----------|
| Lease liability | 662,420 |
| Initial direct costs (legal fees) | 30,000 |
| Restoration provision | 36,751 |
| Rent-free period incentive | (0)* |
| **ROU Asset** | **729,171** |

*The rent-free period is already embedded in the payment structure; if this were a cash incentive equivalent, it would reduce the ROU asset.

**3. Lease Amortization Schedule**

| Year | Opening | Interest @ 8% | Payment | Closing |
|------|---------|---------------|---------|---------|
| 1 | 662,420 | 52,994 | (200,000) | 515,414 |
| 2 | 515,414 | 41,233 | (200,000) | 356,647 |
| 3 | 356,647 | 28,532 | (200,000) | 185,179 |
| 4 | 185,179 | 14,821 | (200,000) | 0 |

**4. Year 1 Depreciation**

ROU Asset / Lease term = R729,171 / 4 years = **R182,293**

**5. Total Expense Year 1**

| | R |
|---|---|
| Depreciation | 182,293 |
| Finance cost | 52,994 |
| **Total** | **235,287** |

</details>

---

**← Previous: Part 1 - Scope & Key Definitions**

**Next: Part 3 - Lease Modifications →**
