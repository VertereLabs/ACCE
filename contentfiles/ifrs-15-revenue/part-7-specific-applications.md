# IFRS 15 Revenue from Contracts with Customers - Part 7: Specific Application Issues

## Introduction

IFRS 15 includes detailed guidance on specific transaction types that commonly cause complexity. This section covers the key areas that frequently appear in exams.

---

## Warranties

### The Fundamental Question

> **Does the warranty provide assurance that the product meets specifications, OR does it provide a service beyond assurance?**

### Types of Warranties

| Type | Description | Accounting |
|------|-------------|------------|
| **Assurance-type** | Assures product meets agreed specifications | NOT a separate performance obligation—accounted for under IAS 37 (provisions) |
| **Service-type** | Provides service beyond assurance (e.g., extended coverage) | Separate performance obligation—allocate transaction price |

### Assurance-Type Warranties

**Characteristics:**
- Required by law or standard practice
- Covers defects existing at time of sale
- Duration is typically short (e.g., 12 months)

**Accounting:**
- NOT a separate performance obligation
- Estimate warranty costs
- Recognise provision (IAS 37)

**Journal entry at sale:**
```
Dr  Warranty expense                          XX,XXX
    Cr  Provision for warranty                        XX,XXX
```

### Service-Type Warranties

**Characteristics:**
- Purchased separately or optional
- Provides coverage beyond defect repair
- Extended period or enhanced service

**Accounting:**
- Separate performance obligation
- Allocate transaction price
- Recognise revenue over warranty period

**Example:**
- Product sold for R10,000
- Standard 1-year warranty included (assurance)
- Extended 2-year warranty sold separately for R1,500

**Treatment:**
- R10,000 revenue for product (point of sale, less provision for standard warranty)
- R1,500 revenue for extended warranty (recognised over 2 years)

### When Warranty Type is Unclear

Consider:
- Can customer purchase warranty separately?
- Does warranty cover additional services?
- What is the length of coverage period?

If both types exist, separate them and account accordingly.

---

## Licensing

### The Classification Challenge

Licenses grant rights to intellectual property (IP). The accounting depends on the **nature** of the license.

### Two Types of Licenses

| Type | Customer's Right | Revenue Recognition |
|------|------------------|---------------------|
| **Right to access** | Access IP as it exists throughout the license period (dynamic) | Over time |
| **Right to use** | Use IP as it exists at the point of grant (static) | Point in time |

### Determining License Type

A license is a **right to access** (over time) if **ALL THREE** criteria are met:

1. The contract requires (or customer expects) the entity to undertake activities that **significantly affect the IP**
2. The rights expose the customer to **positive or negative effects** of those activities
3. The activities do NOT result in **transfer of a good or service** to the customer

If any criterion is NOT met → **Right to use** (point in time)

### Examples by IP Type

| Intellectual Property | Typical Classification | Reasoning |
|----------------------|------------------------|-----------|
| Software (static) | Right to use | Entity not required to update |
| Software (SaaS/cloud) | Right to access | Ongoing service, continuous updates |
| Brand/franchise | Right to access | Entity maintains brand, customer affected by changes |
| Patent (technology license) | Right to use | Customer uses as-is, no ongoing support |
| Media content (fixed) | Right to use | Content doesn't change |
| Sports team brand | Right to access | Team performance affects brand value |

### Working Example: Franchise License

**Facts:**
- Entity grants 5-year franchise license for R500,000
- Franchisee uses entity's brand, systems, and procedures
- Entity continuously updates systems and markets the brand
- Franchisee's success is affected by entity's activities

**Analysis:**

| Criterion | Assessment |
|-----------|------------|
| Entity undertakes activities affecting IP? | ✓ Yes—marketing, system updates |
| Customer exposed to effects? | ✓ Yes—brand reputation affects franchisee |
| Activities don't transfer a good/service? | ✓ Yes—activities support the IP, not separate deliverables |

**Conclusion:** Right to access → Recognise revenue over 5 years

**Revenue pattern:** Consider if over time criteria met (typically yes for access licenses)

---

### Working Example: Software License

**Facts:**
- Entity sells perpetual software license for R100,000
- No updates included (sold separately)
- Customer can use software indefinitely
- Entity has no ongoing obligations

**Analysis:**
- No activities significantly affecting IP after grant
- Customer has the software "as-is"

**Conclusion:** Right to use → Recognise revenue at point in time (when customer can use and benefit from the software)

---

## Sales-Based or Usage-Based Royalties

### The Exception Rule

For licenses of IP where consideration is a **sales-based or usage-based royalty**:

> **IFRS 15.B63**: Recognise revenue at the LATER of:
> (a) When the subsequent sale or usage occurs
> (b) When the performance obligation is satisfied (or partially satisfied)

### Why This Exception Exists

- Variable consideration rules could require estimation upfront
- For royalties, this creates too much uncertainty
- The exception ensures revenue matches actual usage

### Working Example: Music Royalties

**Facts:**
- Record label licenses song catalog to streaming service
- Royalty: R0.01 per stream
- License transferred on 1 January

**Treatment:**
- Revenue recognised as streams occur
- No estimation of future streams required
- Each month: Revenue = Actual streams × R0.01

---

## Customer Options for Additional Goods or Services

### When is an Option a Performance Obligation?

Customer options (loyalty points, renewal discounts, free upgrades) are performance obligations if they provide a **material right** the customer wouldn't receive without entering the contract.

### Identifying Material Rights

| Scenario | Material Right? | Reasoning |
|----------|-----------------|-----------|
| Loyalty points redeemable for discounts | ✓ Yes | Customer earned discount through purchase |
| Renewal at 10% below market | ✓ Yes | Discount exceeds normal pricing |
| Option to renew at same price (market terms) | ✗ No | Available to all customers |
| "Buy one get one 50% off" | ✓ Yes | Second item discounted due to first purchase |

### Accounting for Material Rights

1. Allocate transaction price between the sale and the material right (based on relative SSPs)
2. Recognise revenue when option exercised OR expires

### Working Example: Loyalty Points

**Facts:**
- Customer purchases goods for R1,000
- Earns 100 loyalty points
- Each point redeemable for R1 discount on future purchases
- Expected redemption rate: 80%
- SSP of points (adjusted for likelihood): 100 × R1 × 80% = R80

**Allocation:**

| Element | SSP | Allocation |
|---------|-----|------------|
| Goods | 1,000 | R926 |
| Loyalty points | 80 | R74 |
| **Total** | **1,080** | **R1,000** |

Calculation: R1,000 × (1,000/1,080) = R926; R1,000 × (80/1,080) = R74

**Entries:**

*At initial sale:*
```
Dr  Cash/Receivable                            1,000
    Cr  Revenue (goods)                                 926
    Cr  Contract liability (points)                      74
```

*When points redeemed (say 60 points of 80 expected):*
```
Dr  Contract liability                            56*
    Cr  Revenue                                          56
```
*R74 × (60/80) = R55.50, plus any adjustment for revised redemption estimates

---

## Non-Refundable Upfront Fees

### Common Examples

- Activation fees (telecom, gym memberships)
- Setup/installation fees (SaaS, equipment)
- Joining fees

### The Key Question

> **Does the upfront fee relate to a separate performance obligation?**

Usually: **NO**—the fee is an advance payment for future goods/services.

### Accounting Treatment

If the fee does NOT relate to a distinct service:
- Include in transaction price
- Allocate to performance obligations
- Recognise as those obligations are satisfied

### Working Example: Gym Membership

**Facts:**
- Customer pays R500 joining fee (non-refundable)
- Monthly membership: R200
- Contract: 12 months
- Joining fee covers administrative processing (no distinct service)

**Treatment:**
- Transaction price: R500 + (R200 × 12) = R2,900
- One performance obligation: Access to gym over 12 months
- Recognise R2,900 ÷ 12 = **R241.67 per month**

---

## Customer Acceptance Clauses

### Purpose

Customer acceptance clauses allow customers to terminate or require remediation if goods/services don't meet specifications.

### When Can Revenue Be Recognised?

| Scenario | Recognition |
|----------|-------------|
| Acceptance is a formality (objective specifications met) | Recognise on delivery |
| Acceptance is substantive (customer discretion) | Recognise on acceptance |
| Delivery for trial/evaluation | Recognise on acceptance or expiry of trial |

### Working Example: Equipment with Trial Period

**Facts:**
- Entity delivers equipment on 15 December
- Customer has 30-day trial period
- If unsatisfied, customer can return for full refund

**Analysis:**
- Acceptance is substantive (customer has discretion)
- Control has NOT transferred during trial period

**Treatment:**
- No revenue on 15 December
- Recognise revenue on earlier of:
  - Customer acceptance (explicit or implied)
  - Expiry of trial period (if customer retains)

---

## Breakage (Unused Rights)

### What is Breakage?

Customers often don't exercise all their contractual rights:
- Unused gift cards
- Unused prepaid phone credit
- Unredeemed loyalty points

### Accounting Treatment

| Expectation | Treatment |
|-------------|-----------|
| Entity expects customer to exercise right | Recognise revenue when customer exercises |
| Entity expects customer NOT to exercise (breakage) | Recognise breakage in proportion to rights exercised |
| Entity expects forfeiture but amount uncertain | Recognise when likelihood of customer exercising becomes remote |

### Proportional Recognition

If entity expects 20% breakage:
- As rights are exercised, recognise both exercised revenue AND proportional breakage

### Working Example: Gift Cards

**Facts:**
- Entity sells R100,000 in gift cards during December
- Historical breakage rate: 10%
- By year-end, R40,000 redeemed

**Calculation:**

Expected redeemable amount: R100,000 × 90% = R90,000
Expected breakage: R100,000 × 10% = R10,000

Revenue recognised at year-end:
- From redemptions: R40,000
- Proportional breakage: R10,000 × (40,000/90,000) = R4,444

**Total revenue:** R44,444

**Remaining liability:** R100,000 - R44,444 = R55,556

---

## Principal vs. Agent (Recap)

### Quick Reference

| Factor | Principal | Agent |
|--------|-----------|-------|
| Controls goods/services before transfer | ✓ | ✗ |
| Bears inventory risk | ✓ | ✗ |
| Has pricing discretion | ✓ | ✗ |
| Revenue | Gross | Net (commission only) |

### Working Example: Travel Agency

**Facts:**
- Travel agency books hotel rooms for customers
- Agency receives 15% commission from hotels
- Customer pays agency R1,000 for room
- Agency remits R850 to hotel

**Analysis:**
- Agency doesn't control hotel room before customer's stay
- Hotel sets prices (agent passes through)
- Agency bears no inventory risk

**Conclusion:** Agent → Revenue = R150 (commission)

---

## South African Application Examples

### Retail Industry

| Issue | SA Context |
|-------|------------|
| Returns | Consumer Protection Act provides cooling-off periods for certain sales |
| Loyalty programs | Widespread (Pick n Pay Smart Shopper, Clicks ClubCard) |
| Gift cards | Subject to 3-year expiry under CPA |

### Mining Industry

| Issue | SA Context |
|-------|------------|
| Provisional pricing | Commodity sales often have provisional prices adjusted later |
| Off-take agreements | Long-term sales contracts may have take-or-pay provisions |
| Toll processing | Principal vs. agent analysis required |

### Telecommunications

| Issue | SA Context |
|-------|------------|
| Bundled handsets and contracts | Two performance obligations; allocate based on SSPs |
| Airtime vouchers | Breakage analysis for unused credit |
| Upfront connection fees | Generally no separate performance obligation |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| **Treating all warranties as provisions** | Distinguish assurance-type (provision) from service-type (separate PO) |
| **Recognising license revenue immediately** | Assess if "right to access" or "right to use" |
| **Ignoring loyalty point allocations** | Material rights require transaction price allocation |
| **Recognising upfront fees immediately** | Allocate to performance obligations unless fee is for distinct service |
| **Recording agent gross revenue** | Agents record net revenue only |
| **Recognising breakage only on expiry** | Recognise proportionally as rights are exercised |

---

## Exam Technique

### Application Issues Questions

These questions test whether you can identify the issue and apply the specific guidance.

**Structure:**
1. **Identify the issue** (warranty, license, loyalty points, etc.)
2. **State the specific IFRS 15 guidance**
3. **Apply** to the facts
4. **Quantify** if numbers are provided
5. **Conclude** with the accounting treatment

### Common Exam Scenarios

| Scenario | What to Look For |
|----------|-----------------|
| "Extended warranty available" | Service-type warranty → separate PO |
| "Franchise agreement" | Likely right to access → over time |
| "Software sold with updates" | Assess if updates are separate PO or part of access |
| "Loyalty points earned" | Material right → allocate transaction price |
| "Gift cards sold" | Contract liability + breakage analysis |
| "Commission received" | Principal vs. agent analysis |

---

## What's Next?

In **Part 8**, we cover Contract Costs, including:
- Costs to obtain a contract
- Costs to fulfil a contract
- Amortisation and impairment

---

**← Previous: Part 6 - Recognising Revenue**

**→ Next: Part 8 - Contract Costs**

