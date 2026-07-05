# IFRS 15 Revenue from Contracts with Customers - Part 2: Identifying the Contract (Step 1)

## Why Step 1 Matters

Before applying any revenue recognition principles, you must establish that a **contract** exists. Without a valid contract under IFRS 15, there is no basis for recognizing revenue.

> [!IMPORTANT]
> Many students jump straight to calculations without confirming that the contract criteria are met. This is a fundamental error that can cost significant marks.

---

## What is a Contract?

> **IFRS 15.10**: A contract is an agreement between two or more parties that creates **enforceable rights and obligations**.

### Forms of Contracts

| Form | Validity |
|------|----------|
| Written document | ✓ Valid |
| Oral agreement | ✓ Valid (if enforceable) |
| Implied by customary business practices | ✓ Valid |

The form doesn't matter—**enforceability** is the key question.

### Legal Enforceability

Enforceability is a matter of **law**. Consider:
- Jurisdiction-specific contract law
- Industry regulations
- Custom and practice in the market

> [!NOTE]
> In South Africa, contracts may be enforceable even if not in writing (with exceptions like contracts for sale of land). Consider the Consumer Protection Act implications where applicable.

---

## The Five Contract Criteria

All FIVE criteria must be met simultaneously for a contract to exist:

### Criterion 1: Approval and Commitment

> **IFRS 15.9(a)**: The parties to the contract have **approved** the contract and are **committed** to perform their respective obligations.

**What this means:**
- Approval can be written, oral, or implied
- Each party has agreed to the terms
- Both parties intend to fulfil their obligations

**Red flags indicating no approval:**

| Scenario | Issue |
|----------|-------|
| Customer hasn't signed, but entity started work | Unilateral commitment isn't a contract |
| "Subject to Board approval" clause | Approval condition not yet met |
| Customer routinely cancels without penalty | Suggests lack of commitment |

### Criterion 2: Rights Identified

> **IFRS 15.9(b)**: The entity can identify each party's **rights** regarding the goods or services to be transferred.

**In practice:**
- What is the customer entitled to receive?
- What is the entity entitled to receive?
- Are these rights clear from the contract terms?

### Criterion 3: Payment Terms Identified

> **IFRS 15.9(c)**: The entity can identify the **payment terms** for the goods or services to be transferred.

**This includes:**
- Amount of consideration
- Timing of payment
- Form of consideration (cash, kind, services)

**Note:** This doesn't require a fixed price—variable consideration can be identified even if not yet determinable.

### Criterion 4: Commercial Substance

> **IFRS 15.9(d)**: The contract has **commercial substance** (i.e., the risk, timing, or amount of the entity's future cash flows is expected to change as a result of the contract).

**Purpose:** Prevents recognition of revenue from arrangements that don't affect the entity's economics.

**Example of NO commercial substance:**
- Entity A sells goods to Entity B for R100
- Entity B simultaneously sells identical goods back to A for R100
- No net cash flows or risk changes = No commercial substance

### Criterion 5: Collectability is Probable

> **IFRS 15.9(e)**: It is **probable** that the entity will collect the consideration to which it will be entitled in exchange for the goods or services.

**"Probable" means:** More likely than not (>50%)

**Assessment factors:**

| Factor | Consider |
|--------|----------|
| Customer's ability to pay | Credit history, financial position |
| Customer's intention to pay | Past payment patterns |
| Amount at risk | Full amount or partial? |

> [!CAUTION]
> The collectability assessment is about the **customer's ability and intention to pay**, NOT about measurement of expected receipts. If collectability isn't probable, there's NO CONTRACT (yet).

---

## When Contract Criteria Are NOT Met

### Accounting Treatment

If the five criteria are not met, the entity:

1. **Does NOT recognise revenue**
2. **Continues to assess** whether criteria are subsequently met
3. **May recognise cash received** as a liability (until criteria met or specific conditions occur)

### When Can Cash Received Be Recognised as Revenue?

Only when ALL of the following occur:

| Condition | Explanation |
|-----------|-------------|
| Entity has no remaining obligations | Nothing more to transfer |
| All or substantially all consideration received | Cash collected |
| Consideration is non-refundable | No return obligation |

**OR:**

| Condition | Explanation |
|-----------|-------------|
| Contract has been terminated | No further performance expected |
| Entity has no obligation to return consideration | Cash is the entity's to keep |

### Working Example: Failed Collectability

**Facts:**
- Entity sells equipment for R500,000 on credit to a new customer
- Customer has poor credit history and uncertain cash flows
- Entity delivers the equipment

**Analysis:**
- Criterion 5 (collectability) is NOT met
- This is NOT a contract under IFRS 15
- No revenue is recognised on delivery

**Journal entry at delivery:**
```
Dr  Contract asset / Receivable (at amount recoverable)     ???
    Cr  ???
```

Actually—**no entry for revenue**. The equipment may still be recognized as inventory until a contract exists, or if already transferred, the entity monitors for when criteria are met.

**If R200,000 is received as a deposit:**
```
Dr  Cash                                                  200,000
    Cr  Contract liability (deposit received)                     200,000
```

---

## Contract Combination

### When to Combine Contracts

Sometimes multiple legal contracts should be **combined** and accounted for as a single contract.

Combine contracts if they are entered into at or near the same time with the same customer (or related parties) AND at least one of these applies:

| Criterion | Example |
|-----------|---------|
| **Negotiated as a package** with single commercial objective | Equipment purchase + 3-year maintenance contract negotiated together |
| **Consideration in one contract depends** on the price or performance of the other | Discount on Product A if customer also buys Service B |
| **Goods/services are a single performance obligation** | Building construction + architect services that are highly interrelated |

### Why It Matters

Combining contracts affects:
- Identification of performance obligations
- Allocation of transaction price
- Timing of revenue recognition

**Example:**

Entity enters into two contracts with Customer:
- Contract 1: Sale of equipment for R1,000,000
- Contract 2: 2-year maintenance for R100,000

If negotiated as a package with interdependent pricing:
- **Combined transaction price:** R1,100,000
- **Performance obligations:** Equipment + Maintenance (if distinct)
- **Allocate R1,100,000** between the two obligations based on stand-alone selling prices

---

## Contract Modifications

### What is a Modification?

> **IFRS 15.18**: A contract modification is a change in the scope or price (or both) of a contract that is approved by the parties to the contract.

**Examples:**
- Adding products/services to an existing contract
- Reducing scope (terminating part of the contract)
- Changing the price
- Extending the contract period

### Accounting for Modifications

The accounting depends on **two tests**:

**Test 1: Are the additional goods/services distinct?**

**Test 2: Does the price for the additional goods/services reflect their stand-alone selling price?**

### Modification Scenarios

#### Scenario A: Separate Contract

A modification is accounted for as a **separate contract** if BOTH:
1. The scope increases due to addition of **distinct** goods/services, AND
2. The price increases by an amount reflecting the **stand-alone selling price**

**Effect:** The original contract continues unchanged. The modification is a new contract.

**Example:**

| Original Contract | Modification |
|-------------------|--------------|
| 100 units @ R100 each = R10,000 | Add 20 units @ R100 each = R2,000 |

If R100 per unit is the stand-alone price:
- Modification = Separate contract
- Account for original 100 units unchanged
- Account for new 20 units as a separate transaction

#### Scenario B: Termination and New Contract

If the modification is NOT a separate contract AND the remaining goods/services are **distinct** from those transferred before modification:

- **Terminate** the original contract
- Account for a **new contract** that includes:
  - The remaining unsatisfied performance obligations
  - The modified terms

**Calculation approach:**
- Transaction price = Unrecognised revenue from original + Modification consideration
- Allocate to remaining performance obligations

#### Scenario C: Cumulative Catch-Up

If the modification is NOT a separate contract AND the remaining goods/services are **NOT distinct** (part of a single performance obligation being satisfied over time):

- Account for as part of the **original contract**
- Update transaction price and measure of progress
- Recognise **cumulative catch-up adjustment** to revenue

### Working Example: Contract Modification

**Original Contract:**
- Construct a building for R10,000,000
- Estimated cost: R8,000,000
- Progress: 40% complete (R3,200,000 costs incurred)
- Revenue recognised to date: R4,000,000

**Modification (at 40% complete):**
- Add additional floor
- Modification price: R2,500,000
- Additional costs: R2,000,000
- Additional work is NOT distinct (part of single building)

**Analysis:**

Scenario C applies—cumulative catch-up.

**Revised contract:**

| | Original | Modification | Revised |
|---|---|---|---|
| Transaction price | 10,000,000 | 2,500,000 | 12,500,000 |
| Total costs | 8,000,000 | 2,000,000 | 10,000,000 |
| Margin | 2,000,000 | 500,000 | 2,500,000 |

**Revised progress:**
- Costs to date: R3,200,000
- Total revised costs: R10,000,000
- Progress: 32% (3,200,000 / 10,000,000)

**Cumulative revenue to date:**
- 32% × R12,500,000 = R4,000,000

**Revenue previously recognised:** R4,000,000

**Catch-up adjustment:** R4,000,000 - R4,000,000 = **R0**

*In this example, the modification happens to result in no immediate catch-up—but the rate of future recognition changes.*

---

## Portfolio Approach

### When to Use

IFRS 15 permits applying the standard to a **portfolio of contracts** if:

1. The contracts have **similar characteristics**, AND
2. The entity reasonably expects the results to **not differ materially** from applying the standard to individual contracts

### Practical Application

| Useful For | Not Suitable For |
|------------|-----------------|
| High-volume, similar transactions (retail) | Individually negotiated large contracts |
| Standard service contracts | Contracts with significant variable consideration |
| Routine product sales | Complex multi-element arrangements |

> [!TIP]
> The portfolio approach is a **practical expedient**. Use it to reduce effort, but ensure it doesn't materially distort results.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Assuming all signed documents are contracts** | Apply all five criteria—especially collectability |
| **Ignoring oral or implied contracts** | Enforceability matters, not form |
| **Treating all modifications as new contracts** | Apply the two tests—distinct + stand-alone price |
| **Forgetting to combine related contracts** | Assess if negotiated together with linked pricing |
| **Continuing to recognise revenue when collectability fails** | If probable threshold not met, no contract exists |
| **Confusing collectability with credit loss measurement** | Collectability = contract existence; credit loss = IFRS 9 impairment |

---

## Exam Technique

### Step 1 Discussion Questions

When asked about contract identification:

1. **List the five criteria** (briefly)
2. **Apply each criterion** to the scenario
3. **Conclude** whether a contract exists
4. If NOT, explain the accounting for cash received

### Step 1 Calculation Impact

Remember that if no contract exists:
- **Zero revenue** in the period
- **Cash received = liability**
- Re-assess at each reporting date

### Contract Modification Questions

**Structure your answer:**

1. Is this a modification? (Change in scope/price, approved)
2. Are additional goods/services **distinct**?
3. Is the pricing at **stand-alone selling price**?
4. **Conclude:** Separate contract, termination + new, or cumulative catch-up
5. **Show calculations** if required

---

## Summary: Step 1 Checklist

| Question | If Yes | If No |
|----------|--------|-------|
| All 5 criteria met? | Contract exists → proceed to Step 2 | No contract → no revenue |
| Multiple contracts with same customer? | Assess if should be combined | Treat separately |
| Contract modification? | Apply modification accounting | Continue with original |
| High volume similar contracts? | Consider portfolio approach | Account individually |

---

## What's Next?

In **Part 3**, we tackle Step 2: Identifying Performance Obligations, including:
- The "distinct" test in detail
- Series of distinct goods/services
- Promises in contracts
- Principal vs. agent considerations

---

**← Previous: Part 1 - Scope & Core Principle**

**→ Next: Part 3 - Identifying Performance Obligations**

