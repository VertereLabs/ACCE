# IFRS 15 Revenue from Contracts with Customers - Part 8: Contract Costs

## Introduction

IFRS 15 provides guidance on costs related to obtaining and fulfilling contracts. While the primary focus of IFRS 15 is revenue recognition, the cost guidance ensures proper matching of costs with revenue.

---

## Two Categories of Contract Costs

| Category | Description | Key Requirement |
|----------|-------------|-----------------|
| **Costs to obtain a contract** | Incremental costs of obtaining the contract | Capitalise if expect to recover |
| **Costs to fulfil a contract** | Costs directly related to fulfilling obligations | Capitalise if criteria met |

---

## Costs to Obtain a Contract

### What Are They?

> **IFRS 15.91**: Incremental costs of obtaining a contract are costs that would NOT have been incurred if the contract had NOT been obtained.

### The Key Word: "Incremental"

**Incremental** = Only incurred BECAUSE the contract was obtained

| Cost | Incremental? | Reasoning |
|------|--------------|-----------|
| Sales commission on signed contracts | ✓ Yes | Wouldn't pay if no contract |
| General advertising | ✗ No | Incurred regardless of specific contracts |
| Legal fees for contract negotiation | ✗ Usually no | Often incurred whether or not contract is obtained |
| Sales salaries (fixed) | ✗ No | Paid regardless of contracts obtained |
| Success-based commission | ✓ Yes | Only paid when contract secured |

### Recognition Criteria

Capitalise costs to obtain a contract if:

1. The costs are **incremental**, AND
2. The entity **expects to recover** those costs

If not capitalisable → **Expense when incurred**

### Practical Expedient

> **IFRS 15.94**: An entity may recognise the incremental costs as an expense when incurred if the **amortisation period** would be **one year or less**.

**Why this matters:**
- Simplifies accounting for short-cycle businesses
- Reduces asset tracking burden
- Must disclose if expedient is applied

### Working Example: Sales Commissions

**Facts:**
- Entity pays 5% commission on contract value when contracts are signed
- Contract value: R1,000,000
- Commission: R50,000
- Contract period: 3 years (services rendered evenly)

**Without practical expedient:**

*Initial recognition:*
```
Dr  Contract cost asset                       50,000
    Cr  Cash / Commission payable                      50,000
```

*Amortisation (over 3 years):*
```
Dr  Amortisation expense                      16,667
    Cr  Contract cost asset                            16,667
```

**With practical expedient (if amortisation ≤ 1 year):**
```
Dr  Commission expense                        50,000
    Cr  Cash / Commission payable                      50,000
```

---

## Costs to Fulfil a Contract

### What Are They?

Costs directly relating to a contract (or anticipated contract) that:
- Relate directly to a specific contract
- Generate or enhance resources used in satisfying performance obligations
- Are expected to be recovered

### Recognition Criteria

Capitalise costs to fulfil if **ALL THREE** criteria are met:

| # | Criterion | Example |
|---|-----------|---------|
| 1 | Costs relate **directly** to a contract | Setup costs for specific customer project |
| 2 | Costs **generate or enhance resources** used to satisfy performance obligations | Design work, materials staged for use |
| 3 | Costs are **expected to be recovered** | Entity expects to earn sufficient margin |

### Costs That Relate Directly

Examples of costs that may relate directly:

| Cost | Capitalise? |
|------|-------------|
| Direct labour | ✓ Yes |
| Direct materials | ✓ Yes |
| Allocations of directly related costs (depreciation of equipment used) | ✓ Yes |
| Costs explicitly chargeable to customer | ✓ Yes |
| Subcontractor costs | ✓ Yes |

### Costs That Do NOT Qualify

Always expense:

| Cost | Treatment |
|------|-----------|
| General and administrative | Expense |
| Wasted materials, labour, overhead | Expense |
| Costs relating to satisfied performance obligations | Expense |
| Costs where can't distinguish satisfied vs. unsatisfied | Expense |

### Relationship with Other Standards

If another standard addresses specific costs, apply that standard first:

| Cost Type | Applicable Standard |
|-----------|---------------------|
| Inventory | IAS 2 |
| Property, plant & equipment | IAS 16 |
| Intangible assets | IAS 38 |

Only apply IFRS 15 to costs NOT covered by another standard.

### Working Example: Setup Costs

**Facts:**
- Entity enters contract to provide IT services for 5 years
- Initial setup costs (data migration, system configuration): R500,000
- Setup doesn't transfer a good/service to customer (not a separate PO)
- Contract expected to be profitable

**Analysis:**

| Criterion | Assessment |
|-----------|------------|
| Directly related? | ✓ Yes—specific to this contract |
| Generate/enhance resources? | ✓ Yes—enables future service delivery |
| Expected to be recovered? | ✓ Yes—contract is profitable |

**Treatment:**

*Capitalise setup costs:*
```
Dr  Contract fulfilment asset                500,000
    Cr  Cash / Payables                               500,000
```

*Amortise over contract period (5 years):*
```
Dr  Cost of services (amortisation)          100,000
    Cr  Contract fulfilment asset                     100,000
```

---

## Amortisation of Contract Cost Assets

### Amortisation Basis

> **IFRS 15.99**: Amortise on a **systematic basis** consistent with the transfer of goods or services to which the asset relates.

### Amortisation Period

Consider:
- Goods or services directly related to the asset
- **Anticipated contracts** — if commission relates to expected renewals, the asset may be amortised over a longer period

### Example: Commission with Expected Renewal

**Facts:**
- Commission of R10,000 paid on 2-year contract
- Entity expects customer to renew for additional 2 years
- Commission on renewal is NOT commensurate with initial commission

**Analysis:**
- The initial commission effectively relates to 4 years of expected services
- Amortise over 4 years, not 2 years

**Amortisation:** R10,000 / 4 = R2,500 per year

---

## Impairment of Contract Cost Assets

### When to Test

Test for impairment when indicators suggest the carrying amount exceeds:

> **Recoverable amount** = Remaining consideration expected − Direct costs to satisfy the contract

### Impairment Calculation

| Component | Amount |
|-----------|--------|
| Remaining consideration expected | R___ |
| Less: Costs not yet recognised as expenses | (R___) |
| **Recoverable amount** | **R___** |
| Carrying amount of asset | R___ |
| **Impairment (if carrying amount > recoverable)** | **R___** |

### Working Example: Impairment

**Facts:**
- Contract cost asset: R200,000
- Remaining consideration: R500,000
- Remaining costs to satisfy contract: R450,000

**Calculation:**

Recoverable amount = R500,000 - R450,000 = R50,000

Carrying amount = R200,000

Impairment = R200,000 - R50,000 = **R150,000**

**Entry:**
```
Dr  Impairment loss                          150,000
    Cr  Contract cost asset                           150,000
```

### Reversal of Impairment

If conditions improve, reverse impairment (up to original amortised cost).

---

## Summary: Contract Costs Decision Tree

```
Is the cost covered by another standard?
├── YES → Apply that standard (IAS 2, IAS 16, IAS 38, etc.)
└── NO → Continue

Is it a cost to OBTAIN the contract?
├── YES → Is it INCREMENTAL?
│         ├── YES → Expect to recover?
│         │         ├── YES → CAPITALISE (unless practical expedient)
│         │         └── NO → EXPENSE
│         └── NO → EXPENSE
└── NO → Continue

Is it a cost to FULFIL the contract?
├── YES → Does it meet ALL THREE criteria?
│         ├── YES → CAPITALISE
│         └── NO → EXPENSE
└── NO → EXPENSE
```

---

## Presentation

### Statement of Financial Position

Contract cost assets are presented:
- As a **separate line item**, OR
- Included in relevant asset category with **disclosure**

### Statement of Profit or Loss

Amortisation is presented:
- Consistent with the nature of the cost (e.g., cost of sales, selling expenses)

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Capitalising all costs to win contracts** | Only INCREMENTAL costs qualify |
| **Ignoring practical expedient** | Apply if amortisation ≤ 1 year |
| **Not extending amortisation for renewals** | If asset relates to anticipated renewals, extend period |
| **Forgetting impairment testing** | Test when indicators exist |
| **Capitalising general overheads** | Only direct and directly allocable costs qualify |
| **Applying IFRS 15 to inventory** | Use IAS 2 for inventory costs |

---

## Exam Technique

### Contract Cost Questions

**Structure:**

1. **Identify the cost category** (obtain vs. fulfil)
2. **Apply the criteria** for capitalisation
3. **Calculate the asset amount** (if capitalised)
4. **Determine amortisation period** and pattern
5. **Test for impairment** if relevant

### Mark Allocation Awareness

| Topic | Typical Marks |
|-------|---------------|
| Identifying cost type | 1-2 marks |
| Applying capitalisation criteria | 2-3 marks |
| Calculating asset/amortisation | 2-4 marks |
| Impairment calculation | 2-3 marks |
| Journal entries | 2-3 marks |

---

## What's Next?

In **Part 9**, we cover Disclosures and Exam Strategy, including:
- Disclosure requirements
- Common exam pitfalls
- Comprehensive exam technique
- SA-specific considerations

---

**← Previous: Part 7 - Specific Application Issues**

**→ Next: Part 9 - Disclosures & Exam Strategy**

