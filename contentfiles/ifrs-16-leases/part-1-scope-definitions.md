# IFRS 16 Leases - Part 1: Scope & Key Definitions

## Introduction: The Economic Substance of a Lease

Before we dive into the mechanics, let's understand WHY IFRS 16 exists.

Under the old IAS 17, companies could structure leases as "operating leases" to keep massive liabilities off their balance sheets. An airline could fly 200 aircraft and show virtually no aircraft assets or lease liabilities on its balance sheet. This was a form of "off-balance sheet financing" that obscured the true financial position of entities.

IFRS 16 changed everything for lessees by requiring virtually ALL leases to be recognized on the balance sheet. The principle is simple: **if you have the right to use an asset, you have an asset. If you have an obligation to pay for that right, you have a liability.**

---

## What is a Lease?

### The Definition

> **A lease is a contract, or part of a contract, that conveys the right to use an asset (the underlying asset) for a period of time in exchange for consideration.** (IFRS 16.9)

This definition has three critical elements:
1. **A contract** (or part of a contract)
2. **Right to use an asset** for a period of time
3. **In exchange for consideration**

### The Key Question: Is There a Lease?

At contract inception, an entity must assess whether the contract IS, or CONTAINS, a lease. This is crucial because many contracts bundle services with the use of assets.

**The Two-Condition Test (IFRS 16.B9)**

A contract contains a lease if BOTH conditions are met:

| Condition | Question to Ask |
|-----------|-----------------|
| **1. Identified Asset** | Is there a specific asset that the contract relates to? |
| **2. Right to Control** | Does the customer have the right to control the use of that asset for the period of use? |

Let's break these down.

---

## Condition 1: Identified Asset

### What Makes an Asset "Identified"?

An asset is typically identified by being:
- **Explicitly specified** in the contract (e.g., "Vehicle with registration ABC 123"), OR
- **Implicitly specified** when it's the only asset that can satisfy the contract

### The Substitution Right Trap

> [!CAUTION]
> **Critical exam point**: A supplier's substitution right can negate an identified asset.

An asset is NOT identified if the supplier has the **substantive right to substitute** the asset throughout the period of use.

A substitution right is **substantive** if BOTH conditions are met:
1. The supplier has the **practical ability** to substitute alternative assets
2. The supplier would **benefit economically** from substitution

**Example: Is There an Identified Asset?**

*Scenario 1: Fibre Optic Cables*
Company A contracts for data transmission capacity using a specified fibre optic cable from Point X to Point Y. The supplier cannot substitute without Company A's permission.
- **Result**: Identified asset ✓ (specific cable, no substitution right)

*Scenario 2: Cloud Storage*
Company B contracts for 500GB of storage capacity. The supplier can move the data between any of its 50 data centres at any time.
- **Result**: No identified asset ✗ (supplier can substitute freely)

*Scenario 3: Aircraft*
Airline X leases a specific Boeing 737 (tail number ZS-ABC). The lessor can only substitute if the aircraft needs maintenance.
- **Result**: Identified asset ✓ (substitution only for maintenance is a protective right, not a substantive right)

### Portions of Assets

Can you lease **part** of an asset? Yes, IF that portion is physically distinct (e.g., one floor of a building, one wing of a warehouse).

A capacity portion that is not physically distinct (e.g., 50% of a pipeline's capacity) is generally NOT capable of being an identified asset.

---

## Condition 2: Right to Control the Use

Having an identified asset is not enough. The customer must also have the **right to control** the use of that asset.

### The Control Test (IFRS 16.B24)

A customer has the right to control the use if it has **BOTH**:

| Element | Description |
|---------|-------------|
| **Right to obtain substantially all economic benefits** | The customer gets substantially all the outputs, by-products, and other benefits from using the asset |
| **Right to direct the use** | The customer can decide HOW and FOR WHAT PURPOSE the asset is used throughout the period |

### Right to Direct the Use - Deep Dive

The right to direct the use exists if the customer can direct:
- **How** the asset is operated, OR
- **What** the asset is used for

**Pre-Determined Use**
Sometimes, HOW and FOR WHAT PURPOSE is pre-determined by the contract. In this case, ask:
- Does the customer operate the asset (or direct others to operate it) without the supplier having the right to change instructions? OR
- Did the customer design the asset in a way that predetermines how and for what purpose it will be used?

**What Rights Don't Count?**

The following are NOT decision-making rights that convey control:
- Protective rights (e.g., "you may not use the vehicle off-road")
- Rights that protect the supplier's interest in the asset

**Example: Who Has Control?**

*Scenario: Dedicated Truck*
Retailer contracts with a logistics company for exclusive use of a specific truck. The truck is branded with the retailer's logo. However, the logistics company:
- Determines which driver operates the truck
- Decides the routes and scheduling
- Maintains the vehicle

**Analysis:**
- Identified asset? ✓ (specific truck)
- Economic benefits? ✓ (retailer gets substantially all transport output)
- Right to direct use? ✗ (logistics company decides how the truck is used)

**Result**: This is a SERVICE contract, NOT a lease. The retailer is paying for deliveries, not for the right to use a truck.

---

## Separating Lease and Non-Lease Components

### The Reality: Contracts Often Bundle Everything

A lease contract frequently includes:
- **Lease component**: The right to use the underlying asset
- **Non-lease components**: Services (maintenance, cleaning, security)

### Lessee Accounting Choice

IFRS 16 gives lessees a practical choice:

**Option A: Separate Components**
- Allocate contract consideration to each component based on relative stand-alone prices
- Account for lease component under IFRS 16
- Account for service component under other standards (e.g., as an expense)

**Option B: Practical Expedient**
- Elect NOT to separate components
- Account for entire contract as a single lease
- This is a class-by-class election (e.g., all building leases, all vehicle leases)

> [!TIP]
> **Exam insight**: Option B is simpler but results in HIGHER lease liabilities and ROU assets. Watch for questions testing whether you understand this trade-off.

**Example: Vehicle Lease with Maintenance**

Company leases a vehicle. Monthly payment: R10,000
- Market rent for vehicle: R8,000/month
- Market price for maintenance: R2,500/month

*If separating components:*
Allocation based on relative stand-alone prices:
- Vehicle (lease): R10,000 × (8,000 / 10,500) = R7,619
- Maintenance (service): R10,000 × (2,500 / 10,500) = R2,381

*If NOT separating:*
- Entire R10,000 treated as lease payment

---

## Scope Exclusions and Recognition Exemptions

### What's Completely OUT of IFRS 16 Scope?

| Excluded Item | Why? |
|---------------|------|
| Leases of intangible assets | Covered by IAS 38 |
| Leases to explore for minerals, oil, gas, etc. | Covered by IFRS 6 |
| Leases of biological assets (lessees) | Covered by IAS 41 |
| Service concession arrangements | Covered by IFRIC 12 |

### Recognition Exemptions (Lessee Only)

Even if a contract IS a lease, a lessee may ELECT not to apply the full IFRS 16 recognition model to:

**1. Short-Term Leases**
- Lease term of **12 months or less** at commencement
- No purchase option
- Elect on a **class-by-class basis**
- Expense lease payments on straight-line basis (or other systematic basis)

**2. Low-Value Assets**
- Underlying asset has low value when NEW (guidance: ~USD 5,000 or less)
- Examples: tablets, small office furniture, laptops
- Elect on a **lease-by-lease basis**
- Expense lease payments on straight-line basis

> [!WARNING]
> **Common pitfall**: Students often forget that low-value is assessed when the asset is NEW, not its current value. A R2,000 second-hand car that cost R200,000 new is NOT a low-value asset.

> [!NOTE]
> Right-of-use assets that meet the low-value threshold must also be assessed for characteristics. Cars, for example, would generally NOT qualify even if below the monetary threshold, as they are not typically considered low-value by nature.

---

## Common Student Pitfalls

| Pitfall | How to Avoid |
|---------|--------------|
| Confusing substitution rights | Ask: Is the substitution **substantive**? Can the supplier actually substitute AND benefit from doing so? |
| Ignoring embedded leases | Always check service contracts for identified assets with customer control |
| Misapplying short-term exemption | The 12-month period is from **commencement**, not remaining term at reporting date. And NO purchase option! |
| Confusing direction of use with operation | Operating an asset ≠ Directing HOW it's used. A driver doesn't direct use - the entity telling the driver where to go does. |
| Forgetting protective rights don't count | Speed limits, maintenance requirements, and permitted uses are protective, not decision-making |

---

## Exam Technique

### For "Identify Whether a Lease Exists" Questions

**Step 1**: State the definition of a lease (1 mark)

**Step 2**: Apply the two-condition test:
- Is there an identified asset? Check for substantive substitution rights.
- Does the customer control use? Check for directing HOW and FOR WHAT PURPOSE.

**Step 3**: Conclude clearly on each contract/scenario

### Mark Allocation Tip

If a question is worth 4-6 marks, the examiner wants:
- Definition (1 mark)
- Application of identified asset (1-2 marks)
- Application of control test (1-2 marks)
- Clear conclusion (1 mark)

---

## Key Takeaways

1. **IFRS 16 exists to bring leases onto the balance sheet** - understand the economic rationale
2. **Two conditions must BOTH be met** for a lease to exist: identified asset + right to control
3. **Substitution rights** can prevent an asset from being "identified"
4. **Control means directing HOW and FOR WHAT PURPOSE** - not just operating
5. **Separate lease from service components** unless electing the practical expedient
6. **Short-term and low-value exemptions** are available but are elections with consequences

---

## Practice Scenario

**Question**: Manufacturer Ltd enters into a contract with Logistics Co for the exclusive use of a warehouse section (1,000 m² of a 5,000 m² facility) for 5 years. Manufacturer Ltd stores its finished goods there. Logistics Co provides security officers, cleaning, and handles all incoming/outgoing goods based on Manufacturer's instructions. Manufacturer can access the warehouse 24/7 and decides which products are stored and in what configuration.

**Required**: Determine whether this contract contains a lease.

<details>
<summary>Model Answer</summary>

**Definition**: A lease conveys the right to use an identified asset for a period of time in exchange for consideration. (1 mark)

**Condition 1 - Identified Asset**:
The warehouse portion (1,000 m²) is physically distinct and explicitly specified in the contract. There is no indication that Logistics Co can substitute this with another section. Therefore, there IS an identified asset. (2 marks)

**Condition 2 - Right to Control**:
- *Economic benefits*: Manufacturer Ltd obtains substantially all economic benefits from the warehouse portion - it is exclusively for their use.
- *Right to direct use*: Manufacturer Ltd decides what is stored, how items are configured, and has 24/7 access. While Logistics Co handles the physical movement, they act on Manufacturer's instructions. Manufacturer directs HOW and FOR WHAT PURPOSE the space is used.

Both elements of control are met. (2 marks)

**Conclusion**: The contract contains a lease for the warehouse portion. The security and handling services are non-lease components that should be separated or combined with the lease under the practical expedient. (1 mark)

</details>

---

**Next: Part 2 - Lessee Accounting Model** →
