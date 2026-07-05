# IFRS 15 Revenue from Contracts with Customers - Part 3: Identifying Performance Obligations (Step 2)

## Why Performance Obligations Matter

Performance obligations are the **unit of account** for revenue recognition. Getting this step wrong cascades through the entire analysis:

- Wrong performance obligations → Wrong allocation of transaction price
- Wrong allocation → Wrong timing of revenue recognition
- Wrong timing → Misstated financial statements

> [!IMPORTANT]
> Step 2 is where most judgment is required. Examiners love testing this because it requires both conceptual understanding AND application to novel scenarios.

---

## What is a Performance Obligation?

> **IFRS 15.22**: A performance obligation is a promise in a contract with a customer to transfer to the customer:
> (a) a good or service (or bundle of goods or services) that is **distinct**; or
> (b) a series of distinct goods or services that are **substantially the same** and have the **same pattern of transfer** to the customer.

### Breaking It Down

| Element | Meaning |
|---------|---------|
| **Promise** | A commitment in the contract (explicit or implicit) |
| **Good or service** | Something of value the customer receives |
| **Distinct** | Can be a separate unit of account |
| **Series** | Multiple similar items treated as one obligation |

---

## Identifying Promises in a Contract

Before assessing whether something is distinct, identify **all promises** in the contract.

### Types of Promises

| Type | Examples |
|------|----------|
| **Explicit promises** | Clearly stated goods/services in the contract |
| **Implicit promises** | Customary business practices, published policies, specific statements that create customer expectations |

### Examples of Promises

| Industry | Goods/Services Promised |
|----------|-------------------------|
| **Telecom** | Handset, airtime, data, customer support |
| **Software** | License, implementation, training, support, updates |
| **Retail** | Product, gift wrapping, loyalty points, warranty |
| **Construction** | Design, building, project management |
| **Car dealership** | Vehicle, servicing, extended warranty, accessories |

### What is NOT a Performance Obligation

Administrative or setup activities that do NOT transfer goods/services:

| Activity | Performance Obligation? |
|----------|------------------------|
| Opening a customer account | ✗ No (administrative) |
| Setting up access to software | ✗ No (setup activity) |
| Regulatory paperwork | ✗ No (administrative) |
| Designing to customer specifications | ✓ Yes (if provides value) or ✗ No (if only prepares for delivery) |

> [!TIP]
> Ask: "Does this activity transfer something of value to the customer, or is it just preparing to transfer something?"

---

## The "Distinct" Test

This is the critical test. A good or service is distinct if **BOTH** conditions are met:

### Condition 1: Capable of Being Distinct

> **IFRS 15.27(a)**: The customer can benefit from the good or service either **on its own** or together with **other resources that are readily available** to the customer.

**"Readily available"** means:
- Sold separately by the entity
- Sold separately by other suppliers
- Already obtained by the customer

**Examples:**

| Good/Service | Capable of Being Distinct? | Reasoning |
|--------------|---------------------------|-----------|
| Smartphone in a bundled contract | ✓ Yes | Can be used without the service plan |
| Software license | ✓ Yes | Customer could use it with their own IT team |
| Installation of complex equipment | Depends | If customer could hire another installer, yes |
| Custom software module | ✓ Yes | If customer could integrate it themselves or with third party |

### Condition 2: Separately Identifiable in the Contract

> **IFRS 15.27(b)**: The promise to transfer the good or service is **separately identifiable** from other promises in the contract.

This asks: Is this promise **transformative** or **integrated** with other promises?

**Indicators that a promise is NOT separately identifiable:**

| Indicator | Example |
|-----------|---------|
| **Integration service** | Building contractor that manages subcontractors to deliver integrated output |
| **Significant modification/customisation** | Software requiring substantial custom development |
| **High interdependence** | Components that cannot function without each other |

### The Two-Part Test in Practice

```
Is the good/service DISTINCT?
│
├── Part A: Capable of being distinct?
│   ├── YES → Continue to Part B
│   └── NO → NOT DISTINCT (combine with other goods/services)
│
└── Part B: Separately identifiable?
    ├── YES → DISTINCT (separate performance obligation)
    └── NO → NOT DISTINCT (combine with other goods/services)
```

---

## Working Examples: The Distinct Test

### Example 1: Telecom Bundle

**Contract:** 24-month mobile contract including:
- Smartphone (retail value R12,000)
- 24 months of airtime/data (retail value R500/month)
- Total monthly payment: R800

**Analysis:**

| Promise | Capable of Being Distinct? | Separately Identifiable? | Distinct? |
|---------|---------------------------|-------------------------|-----------|
| Smartphone | ✓ Yes (customer can use with other networks) | ✓ Yes (not integrated with service) | ✓ Yes |
| Airtime/Data | ✓ Yes (customer can use without this phone) | ✓ Yes (separate service delivery) | ✓ Yes |

**Conclusion:** Two performance obligations: (1) Smartphone, (2) Telecom services over 24 months.

---

### Example 2: Construction Contract

**Contract:** Build a manufacturing facility including:
- Site preparation
- Foundation and structure
- Mechanical and electrical installation
- Project management throughout

**Analysis:**

| Promise | Capable of Being Distinct? | Separately Identifiable? | Distinct? |
|---------|---------------------------|-------------------------|-----------|
| Site preparation | ✓ Yes (other contractors could do subsequent work) | ✗ No (integrated into single building output) | ✗ No |
| Foundation | ✓ Yes | ✗ No (integrated) | ✗ No |
| M&E installation | ✓ Yes | ✗ No (integrated) | ✗ No |
| Project management | ✓ Yes | ✗ No (integration service) | ✗ No |

**Conclusion:** ONE performance obligation—the completed facility. Entity provides significant integration service.

---

### Example 3: Software with Implementation

**Contract:** Enterprise software including:
- Perpetual license for standard software
- Implementation services (configuration, data migration)
- 12 months of support

**Analysis:**

| Promise | Capable of Being Distinct? | Separately Identifiable? | Distinct? |
|---------|---------------------------|-------------------------|-----------|
| Software license | ✓ Yes (customer could implement with own team) | ✓ Yes (standard software, minimal customisation) | ✓ Yes |
| Implementation | ✓ Yes (third parties could provide) | ✓ Yes (doesn't significantly modify software) | ✓ Yes |
| Support | ✓ Yes (customer could operate without) | ✓ Yes (separate from license/implementation) | ✓ Yes |

**Conclusion:** THREE performance obligations.

**BUT**, if implementation involves significant customisation that creates new functionality:
- Implementation may NOT be separately identifiable
- Could result in two obligations: (1) Customised software solution, (2) Support

---

### Example 4: Equipment with Warranty

**Contract:** Manufacturing equipment including:
- Equipment delivery
- 12-month warranty (repairs/replacement for defects)
- Optional extended warranty (additional 24 months, sold separately)

**Analysis:**

| Promise | Analysis |
|---------|----------|
| Equipment | Clearly distinct |
| Standard warranty | NOT distinct—it's an **assurance-type warranty** (assures the equipment functions as promised) |
| Extended warranty | Distinct—it's a **service-type warranty** (provides additional service beyond assurance) |

**Conclusion:** TWO performance obligations: (1) Equipment (with embedded assurance warranty), (2) Extended warranty service.

> **Warranty analysis is covered in depth in Part 7.**

---

## Series of Distinct Goods or Services

### When a Series is ONE Performance Obligation

Multiple distinct goods/services are treated as a **single performance obligation** if:

1. Each distinct good/service in the series is **satisfied over time**, AND
2. The same method is used to measure progress toward satisfaction

### Practical Application

| Scenario | Series? | Reasoning |
|----------|---------|-----------|
| Monthly cleaning services (12-month contract) | ✓ Yes | Each month distinct, same pattern |
| Transaction processing services | ✓ Yes | Each transaction distinct, same pattern |
| Managing multiple retail locations | ✓ Yes | Each day/location distinct, same pattern |
| Installing different types of equipment | ✗ No | Not substantially the same |

### Why It Matters

Treating a series as ONE performance obligation:
- Simplifies accounting
- Allows consistent revenue recognition pattern
- Avoids allocating transaction price to each individual service

---

## Principal vs. Agent Considerations

### The Critical Question

When another party is involved in providing goods/services to the customer:

> **Is the entity a PRINCIPAL (controls the good/service) or an AGENT (arranges for another party to provide)?**

### Determining Principal vs. Agent

**Principal** = Controls the good/service BEFORE transfer to customer

**Agent** = Arranges for principal to provide, does NOT control

### Indicators of Control (Principal)

| Indicator | Suggests Principal |
|-----------|-------------------|
| Primary responsibility for fulfillment | ✓ Entity is responsible for ensuring goods/services are delivered |
| Inventory risk | ✓ Entity bears risk of loss/obsolescence |
| Pricing discretion | ✓ Entity sets the price charged to customer |

### Accounting Implications

| Role | Revenue Recognition |
|------|---------------------|
| **Principal** | Gross revenue (total amount from customer) |
| **Agent** | Net revenue (commission/fee only) |

### Working Example: Online Marketplace

**Scenario:** TechMart operates an online platform where third-party sellers list products. TechMart:
- Displays products on its website
- Processes payments
- Takes 15% commission
- Third-party seller ships directly to customer
- Seller sets prices

**Analysis:**

| Indicator | Assessment |
|-----------|------------|
| Primary responsibility | ✗ Seller responsible for shipping and product |
| Inventory risk | ✗ Never holds inventory |
| Pricing discretion | ✗ Seller sets price |

**Conclusion:** TechMart is an **AGENT**.

**Revenue:** 15% commission only, not gross sales.

**Journal entry when R10,000 product sold:**
```
Dr  Cash                          10,000
    Cr  Payable to seller                  8,500
    Cr  Revenue (commission)               1,500
```

---

### Working Example: Electronics Retailer

**Scenario:** ShopElec purchases TVs from Samsung, holds them in its warehouse, and sells to customers at prices it determines. ShopElec bears the risk if TVs don't sell.

**Analysis:**

| Indicator | Assessment |
|-----------|------------|
| Primary responsibility | ✓ ShopElec sells and delivers to customer |
| Inventory risk | ✓ Holds inventory, bears obsolescence risk |
| Pricing discretion | ✓ Sets retail prices |

**Conclusion:** ShopElec is a **PRINCIPAL**.

**Revenue:** Gross amount charged to customer.

---

## Common Bundled Arrangements

### Bundling Patterns by Industry

| Industry | Common Bundle | Typical # of POs |
|----------|--------------|------------------|
| **Telecom** | Device + Services | 2 (device, services) |
| **Software** | License + Implementation + Support | 2-3 depending on customisation |
| **Construction** | Design + Build | 1-2 depending on integration |
| **Franchise** | License + Training + Supplies | 2-3+ depending on distinct analysis |
| **Automotive** | Vehicle + Extended warranty + Servicing | 2-3 |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Treating all promises as separate obligations** | Apply the distinct test—integration often combines promises |
| **Ignoring implicit promises** | Consider customary practices and published policies |
| **Confusing "capable of being distinct" with "separately identifiable"** | Both tests must be passed independently |
| **Treating assurance warranties as performance obligations** | Standard warranties are NOT separate—only service-type warranties |
| **Always treating installation as distinct** | Depends on complexity and whether customer could obtain elsewhere |
| **Recording gross revenue when acting as agent** | Agents only record commission |

---

## Exam Technique

### Step 2 Discussion Questions

**Structured approach:**

1. **List all promises** in the contract (explicit and implicit)
2. For each promise:
   - Is it capable of being distinct? (Reason)
   - Is it separately identifiable? (Reason)
3. **Combine or separate** based on analysis
4. **State the number of performance obligations** and what they are

### Example Answer Structure

> *"The contract contains the following promises: [list]*
>
> *Applying the distinct test under IFRS 15.27:*
>
> *Promise 1 (Equipment):*
> - *Capable of being distinct: Yes—the customer could use the equipment with installation services from third parties*
> - *Separately identifiable: Yes—the equipment is not significantly customised and does not require integration with other promises*
> - *Conclusion: Distinct—separate performance obligation*
>
> *Promise 2 (Installation):*
> - *Capable of being distinct: Yes—third party installers are available*
> - *Separately identifiable: No—installation involves significant customisation to integrate with customer's existing systems, making it highly interdependent with the equipment*
> - *Conclusion: Not distinct—combine with equipment*
>
> *Total performance obligations: ONE (combined equipment and installation)"*

---

## Summary: Step 2 Decision Framework

```
For each promise in the contract:
│
├── Is it a good or service (not an administrative task)?
│   ├── YES → Continue
│   └── NO → Not a performance obligation
│
├── Capable of being distinct?
│   ├── YES → Continue
│   └── NO → Combine with other promise(s)
│
├── Separately identifiable?
│   ├── YES → SEPARATE performance obligation
│   └── NO → Combine with other promise(s)
│
└── Part of a series?
    ├── YES → Single performance obligation for series
    └── NO → Individual performance obligation(s)
```

---

## What's Next?

In **Part 4**, we tackle Step 3: Determining the Transaction Price, including:
- Fixed vs. variable consideration
- Constraining variable consideration
- Significant financing components
- Non-cash consideration
- Consideration payable to customers

---

**← Previous: Part 2 - Identifying the Contract**

**→ Next: Part 4 - Determining Transaction Price**

